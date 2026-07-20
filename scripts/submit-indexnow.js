#!/usr/bin/env node
/**
 * Submit sitemap URLs to IndexNow (Bing, Yandex, etc.).
 * Key file must be live at https://ariablackcarservice.com/{key}.txt
 *
 * Run: npm run indexnow
 * Override: SITE_URL=... INDEXNOW_KEY=... npm run indexnow
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE_URL = (process.env.SITE_URL || "https://ariablackcarservice.com").replace(/\/$/, "");
const KEY_FILE = path.join(ROOT, "indexnow-key.txt");
const KEY = (process.env.INDEXNOW_KEY || (fs.existsSync(KEY_FILE) ? fs.readFileSync(KEY_FILE, "utf8") : "")).trim();
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const HOST = new URL(SITE_URL).host;
const BATCH_SIZE = 10000;

function getLocalSitemapUrls() {
  const sitemapPath = path.join(ROOT, "public", "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) return null;
  const text = fs.readFileSync(sitemapPath, "utf8");
  return [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function fetchSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Sitemap HTTP ${res.status}`);
  const text = await res.text();
  return [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function submitIndexNowBatch(urlList, label) {
  if (urlList.length === 0) return true;
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });
  const ok = res.status === 200 || res.status === 202;
  console.log(`IndexNow [${label}]: ${urlList.length} URLs → HTTP ${res.status}${ok ? " ✓" : ""}`);
  if (!ok) console.warn(await res.text().catch(() => ""));
  return ok;
}

async function verifyKeyFile() {
  const res = await fetch(KEY_LOCATION);
  if (!res.ok) {
    console.error(`Key file not reachable: ${KEY_LOCATION} (HTTP ${res.status})`);
    return false;
  }
  const body = (await res.text()).trim();
  if (body !== KEY) {
    console.error(`Key file content mismatch at ${KEY_LOCATION}`);
    return false;
  }
  return true;
}

async function main() {
  if (!KEY) {
    console.error("Missing IndexNow key. Add indexnow-key.txt or set INDEXNOW_KEY.");
    process.exit(1);
  }

  if (!(await verifyKeyFile())) {
    console.error(`
Deploy the key file first:
  1. npm run build   (copies ${KEY}.txt to public/)
  2. vercel deploy --prod
  3. Verify: ${KEY_LOCATION}
  4. Bing Webmasters → add site → IndexNow key must match
  5. npm run indexnow`);
    process.exit(1);
  }

  let urls = getLocalSitemapUrls();
  if (urls?.length) {
    console.log(`Using local sitemap: ${urls.length} URLs`);
  } else {
    urls = await fetchSitemapUrls();
    console.log(`Using live sitemap: ${urls.length} URLs`);
  }

  const all = [...new Set(urls)];
  let ok = 0;
  for (const [i, batch] of chunk(all, BATCH_SIZE).entries()) {
    if (await submitIndexNowBatch(batch, `batch-${i + 1}`)) ok += batch.length;
  }

  console.log(`IndexNow done: ${ok}/${all.length} URLs submitted`);
  if (ok === 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
