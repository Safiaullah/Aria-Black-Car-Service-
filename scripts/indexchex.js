#!/usr/bin/env node
/**
 * IndexChex API client — index status checks and submission for Google indexing.
 *
 * Modes:
 *   node scripts/indexchex.js balance           Show credit balance
 *   node scripts/indexchex.js check             Check index status of all sitemap URLs
 *   node scripts/indexchex.js submit            Submit all sitemap URLs (standard, ~1 credit/URL)
 *   node scripts/indexchex.js submit:instant    Submit with instant indexing (60 credits/URL)
 *
 * Setup:
 *   INDEXCHEX_API_KEY must be set (read from .env.local or shell env).
 *
 * Docs: https://indexchex.com/api
 */

const fs = require("fs");
const path = require("path");

function loadEnv() {
  if (process.env.INDEXCHEX_API_KEY) return;
  for (const envFile of [".env.local", ".env"]) {
    const envPath = path.join(process.cwd(), envFile);
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
    break;
  }
}
loadEnv();

const API_KEY = process.env.INDEXCHEX_API_KEY;
const BASE_URL = "https://indexchex.com/api";
const SITE_URL = (process.env.SITE_URL || "https://ariablackcarservice.com").replace(/\/$/, "");
const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

if (!API_KEY) {
  console.error("Missing INDEXCHEX_API_KEY.");
  console.error("Set it in .env.local or run with: INDEXCHEX_API_KEY=... npm run indexchex:submit");
  process.exit(1);
}

async function api(method, urlPath, body) {
  const res = await fetch(`${BASE_URL}${urlPath}`, {
    method,
    headers: {
      Authorization: API_KEY,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg = data.message || data.raw || text;
    const err = new Error(`HTTP ${res.status} ${method} ${urlPath}: ${msg}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

async function getBalance() {
  return api("GET", "/v1/balance");
}

async function fetchSitemapUrls() {
  const localSitemap = path.join(process.cwd(), "public", "sitemap.xml");
  if (fs.existsSync(localSitemap)) {
    const xml = fs.readFileSync(localSitemap, "utf8");
    return [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()))];
  }
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status} ${SITE_URL}/sitemap.xml`);
  const xml = await res.text();
  return [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()))];
}

async function createCheckJob(urls, name) {
  return api("POST", "/v1/index-check/jobs", { urls, name });
}

async function getCheckJob(jobId) {
  return api("GET", `/v1/index-check/jobs/${jobId}`);
}

async function createSubmitJob(urls, name, instantIndex) {
  const body = { urls, name };
  if (instantIndex) body.instantIndex = true;
  return api("POST", "/v1/index-submit/jobs", body);
}

async function getSubmitJob(jobId) {
  return api("GET", `/v1/index-submit/jobs/${jobId}`);
}

function fmtJobLine(s) {
  const checked = s.checked_urls ?? s.submitted_urls ?? 0;
  const pct = s.progress_percent ?? 0;
  return `${(s.status || "?").padEnd(11)} ${String(pct).padStart(3)}%  ${checked}/${s.total_urls}`;
}

async function pollJob(jobId, kind) {
  const get = kind === "check" ? getCheckJob : getSubmitJob;
  const started = Date.now();
  let last = "";
  while (true) {
    const s = await get(jobId);
    const line = fmtJobLine(s);
    if (line !== last) {
      process.stdout.write(`\r   ${line}    `);
      last = line;
    }
    if (s.status === "completed" || s.status === "failed") {
      process.stdout.write("\n");
      return s;
    }
    if (Date.now() - started > POLL_TIMEOUT_MS) {
      process.stdout.write("\n");
      throw new Error(`Poll timeout after ${POLL_TIMEOUT_MS / 1000}s (job ${jobId} still ${s.status})`);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

async function modeBalance() {
  const { balance } = await getBalance();
  console.log(`Credits: ${balance}`);
}

async function modeCheck() {
  const { balance } = await getBalance();
  console.log(`Credits before: ${balance}`);
  const urls = await fetchSitemapUrls();
  console.log(`Sitemap URLs: ${urls.length} (${SITE_URL})`);

  const BATCH = 10000;
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const name = `Aria sitemap audit ${new Date().toISOString().slice(0, 10)}${urls.length > BATCH ? ` part ${i / BATCH + 1}` : ""}`;
    console.log(`\nCreating index check job (${batch.length} URLs)...`);
    const job = await createCheckJob(batch, name);
    console.log(`  job_id: ${job.job_id} · queued_at: ${job.queued_at}`);
    const final = await pollJob(job.job_id, "check");
    console.log(`  indexed: ${final.indexed_count} · not indexed: ${final.not_indexed_count} · failed: ${final.failed_count}`);
  }
  const after = await getBalance();
  console.log(`\nCredits after: ${after.balance}`);
}

async function modeSubmit(instant) {
  const { balance } = await getBalance();
  console.log(`Credits before: ${balance}`);
  const urls = await fetchSitemapUrls();
  console.log(`Sitemap URLs: ${urls.length} (${SITE_URL})`);

  const BATCH = instant ? 1000 : 10000;
  const perUrlCost = instant ? 60 : 1;
  const projectedCost = urls.length * perUrlCost;
  console.log(`Mode: ${instant ? "INSTANT (60 credits/URL)" : "standard"}`);
  console.log(`Projected cost: ~${projectedCost} credits`);

  if (projectedCost > balance) {
    console.error(`Insufficient credits. Need ~${projectedCost}, have ${balance}.`);
    process.exit(1);
  }

  let okTotal = 0;
  let failTotal = 0;
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const name = `Aria ${instant ? "instant" : "standard"} ${new Date().toISOString().slice(0, 10)}${urls.length > BATCH ? ` part ${i / BATCH + 1}` : ""}`;
    console.log(`\nSubmitting ${batch.length} URLs (${instant ? "instant" : "standard"})...`);
    const job = await createSubmitJob(batch, name, instant);
    console.log(`  job_id: ${job.job_id} · queued_at: ${job.queued_at}`);
    const final = await pollJob(job.job_id, "submit");
    console.log(`  successful: ${final.successful_count} · failed: ${final.failed_count}`);
    okTotal += final.successful_count || 0;
    failTotal += final.failed_count || 0;
  }
  const after = await getBalance();
  console.log(`\nTotal: ${okTotal} successful · ${failTotal} failed`);
  console.log(`Credits after: ${after.balance} (used: ${balance - after.balance})`);
}

const mode = process.argv[2];

(async () => {
  try {
    if (mode === "balance") await modeBalance();
    else if (mode === "check") await modeCheck();
    else if (mode === "submit") await modeSubmit(false);
    else if (mode === "submit:instant") await modeSubmit(true);
    else {
      console.log("Usage:");
      console.log("  node scripts/indexchex.js balance");
      console.log("  node scripts/indexchex.js check");
      console.log("  node scripts/indexchex.js submit");
      console.log("  node scripts/indexchex.js submit:instant   (60 credits/URL)");
      process.exit(1);
    }
  } catch (err) {
    console.error(`\n${err.message}`);
    if (err.status === 401) console.error("Check INDEXCHEX_API_KEY is correct (Settings → API Access).");
    if (err.status === 402) console.error("Insufficient credits.");
    if (err.status === 422) console.error("Validation error (malformed URL, >10k URLs, or empty body).");
    process.exit(1);
  }
})();
