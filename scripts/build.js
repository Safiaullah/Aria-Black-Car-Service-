#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { guideLongForm } = require("./long-guide-content");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public");
const DATA = path.join(ROOT, "data");

const site = load("site.json");
const services = load("services.json");
const airports = load("airports.json");
const fleet = load("fleet.json");
const routes = load("routes.json");
const locations = load("locations.json");
const corporate = load("corporate.json");
const events = load("events.json");
const guides = load("guides.json");
const blog = load("blog.json");

function load(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Opens MyLimoBiz in a full-screen modal (avoids inline widget overlapping the hero) */
function bookLink(text, className = "", extraAttrs = "") {
  const classes = ["js-open-booking", className].filter(Boolean).join(" ");
  return `<a href="${esc(site.bookingUrl)}" class="${esc(classes)}"${extraAttrs ? " " + extraAttrs : ""}>${text}</a>`;
}

function writePage(urlPath, html) {
  const rel = urlPath === "/" ? "index.html" : path.join(urlPath.replace(/^\//, ""), "index.html");
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, "utf8");
}

function breadcrumbs(items) {
  const parts = items
    .map((item, i) => {
      if (i === items.length - 1) return `<span>${esc(item.label)}</span>`;
      return `<a href="${item.href}">${esc(item.label)}</a>`;
    })
    .join('<span class="bc-sep">/</span>');
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${parts}</nav>`;
}

function nav() {
  const svcLinks = services
    .map((s) => `<a href="/services/${s.slug}">${esc(s.title)}</a>`)
    .join("");
  const aptLinks = airports
    .map((a) => `<a href="/airports/${a.slug}">${esc(a.code)}</a>`)
    .join("");
  const fleetLinks = fleet
    .map((f) => `<a href="/fleet/${f.slug}">${esc(f.tier)}</a>`)
    .join("");

  return `
  <header class="navbar scrolled" role="banner">
    <div class="container nav-inner">
      <a href="/" class="logo"><span class="logo-name">ARIA</span><span class="logo-tag">Black Car Service</span></a>
      <nav class="nav-links" aria-label="Main navigation">
        <div class="nav-dropdown">
          <a href="/services">Services</a>
          <div class="nav-dropdown-menu">${svcLinks}</div>
        </div>
        <div class="nav-dropdown">
          <a href="/airports">Airports</a>
          <div class="nav-dropdown-menu">${aptLinks}</div>
        </div>
        <a href="/fleet">Fleet</a>
        <a href="/routes">Routes</a>
        <a href="/locations/manhattan">Locations</a>
        <a href="/guides">Guides</a>
        <a href="/blog">Blog</a>
        <a href="/pricing">Rates</a>
      </nav>
      <div class="nav-actions">
        <a href="tel:${site.phoneTel}" class="nav-phone">
          <span class="nav-phone-icon"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/></svg></span>
          <span class="nav-phone-text"><span>24/7</span><strong>${esc(site.phone)}</strong></span>
        </a>
        ${bookLink("Book Now", "btn btn-gold nav-cta")}
        <button class="menu-toggle" aria-label="Open menu" aria-expanded="false"><svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg></button>
      </div>
    </div>
  </header>
  <nav id="mobile-menu" class="mobile-menu" aria-label="Mobile navigation">
    <a href="/services">Services</a><a href="/airports">Airports</a><a href="/fleet">Fleet</a>
    <a href="/routes">Routes</a><a href="/guides">Guides</a><a href="/blog">Blog</a>
    ${bookLink("Book", "")}<a href="/contact">Contact</a>
    <a href="tel:${site.phoneTel}" style="color:var(--gold)">${esc(site.phone)}</a>
  </nav>`;
}

function seoFooter() {
  const svcLinks = services
    .slice(0, 8)
    .map((s) => `<a href="/services/${s.slug}">${esc(s.title)}</a>`)
    .join("");
  const aptLinks = airports
    .map((a) => `<a href="/airports/${a.slug}">${esc(a.code)} — ${esc(a.name)}</a>`)
    .join("");
  const routeLinks = routes
    .slice(0, 8)
    .map((r) => `<a href="/routes/${r.slug}">${esc(r.h1)}</a>`)
    .join("");
  const areaLinks = locations
    .slice(0, 6)
    .map((l) => `<a href="/locations/${l.slug}">${esc(l.area)}</a>`)
    .join("");

  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid footer-grid--wide">
        <div class="footer-brand">
          <a href="/" class="logo"><span class="logo-name">ARIA</span><span class="logo-tag">Black Car Service</span></a>
          <p>Premium black car and chauffeur service serving NYC and the tri-state area. TLC licensed. 24/7.</p>
        </div>
        <div class="footer-col"><h4>Services</h4>
          ${svcLinks}
          <a href="/services">All services →</a>
        </div>
        <div class="footer-col"><h4>Airports</h4>
          ${aptLinks}
        </div>
        <div class="footer-col"><h4>Routes</h4>
          ${routeLinks}
          <a href="/routes">All routes →</a>
        </div>
        <div class="footer-col"><h4>Areas &amp; Company</h4>
          ${areaLinks}
          <a href="/locations/manhattan">All areas →</a>
          <a href="/guides">Guides</a>
          ${blog
            .slice(0, 4)
            .map((b) => `<a href="/blog/${b.slug}">${esc(b.title.replace(/ \(2026\)$/, ""))}</a>`)
            .join("")}
          <a href="/blog">All articles →</a>
          <a href="/about">About</a>
          <a href="/faq">FAQ</a>
          <a href="/contact">Contact</a>
          <a href="/sitemap">Sitemap</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${site.year} ${esc(site.name)}. All rights reserved.</span>
        <span><a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="tel:${site.phoneTel}">${esc(site.phone)}</a></span>
      </div>
    </div>
  </footer>
  <div class="floating-cta" aria-label="Quick actions">
    <a href="tel:${site.phoneTel}" class="call-btn" aria-label="Call"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/></svg></a>
    ${bookLink('<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg>', "book-btn", 'aria-label="Book now"')}
  </div>`;
}

function footer() {
  return seoFooter();
}

function layout({ title, description, canonical, body, bc, schema, bodyClass = "" }) {
  const canonicalUrl = `${site.domain}${canonical}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#050505" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${esc(canonicalUrl)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonicalUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${esc(site.name)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://book.ariablackcarservice.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600;700&family=Pinyon+Script&display=swap" rel="stylesheet" />
  <link rel="icon" href="/favicon.png?v=2" type="image/png" />
  <link rel="stylesheet" href="/css/styles.css" />
  <link rel="stylesheet" href="/css/pages.css" />
  ${schema ? `<script type="application/ld+json">${schema}</script>` : ""}
  <script src="https://analytics.ahrefs.com/analytics.js" data-key="rUk2ZX0/7ijvQFYN+Kteaw" async></script>
</head>
<body class="inner-page${bodyClass ? ` ${bodyClass}` : ""}">
${nav()}
<main class="page-main">${bc || ""}${body}</main>
${footer()}
<script src="/js/main.js?v=4"></script>
</body>
</html>`;
}

function pageHero(h1, subtitle, label = "", bgImg = "") {
  const attrs = bgImg
    ? ` class="page-hero page-hero--image" style="background-image:linear-gradient(rgba(5,5,5,.45),rgba(5,5,5,.82)),url('${esc(bgImg)}');background-size:cover;background-position:center;min-height:clamp(300px,42vh,440px);display:flex;align-items:center;"`
    : ` class="page-hero"`;
  return `
  <section${attrs}>
    <div class="container">
      ${label ? `<p class="section-label">${esc(label)}</p>` : ""}
      <h1 class="page-hero-title">${h1}</h1>
      ${subtitle ? `<p class="page-hero-sub">${esc(subtitle)}</p>` : ""}
    </div>
  </section>`;
}

function ctaBlock(text = "Book your ride — flat rates, no surge pricing.") {
  return `
  <section class="page-cta">
    <div class="container cta-box reveal">
      <h2>Ready to Book with Aria?</h2>
      <p>${esc(text)}</p>
      <div class="cta-buttons">
        ${bookLink("Book Online", "btn btn-gold")}
        <a href="tel:${site.phoneTel}" class="btn btn-outline">Call ${esc(site.phone)}</a>
      </div>
    </div>
  </section>`;
}

function faqSection(faqs, extra = []) {
  const all = [...(faqs || []), ...extra];
  if (!all.length) return defaultFaqs();
  return `
  <section class="page-section">
    <div class="container narrow">
      <h2 class="section-title">Frequently <em>Asked</em></h2>
      <div class="faq-list">
        ${all.map((f) => `
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">${esc(f.q)}<span class="faq-icon">+</span></button>
          <div class="faq-answer"><p>${esc(f.a)}</p></div>
        </div>`).join("")}
      </div>
    </div>
  </section>`;
}

function defaultFaqs() {
  return faqSection([
    { q: "Is pricing flat with no surge?", a: "Yes. The rate quoted at booking is the rate you pay — 24/7, including holidays and bad weather." },
    { q: "How do I book?", a: `Book online via our reservation system or call ${site.phone} anytime.` },
    { q: "Are chauffeurs TLC licensed?", a: "All Aria chauffeurs are NYC TLC licensed, background-checked, and professionally trained." },
  ]);
}

function includedFeatures() {
  return `
  <ul class="check-list">
    <li>Professional TLC-licensed chauffeur</li>
    <li>Real-time flight tracking</li>
    <li>Meet-and-greet at baggage claim</li>
    <li>60 minutes complimentary airport wait</li>
    <li>All standard tolls included</li>
    <li>Bottled water, Wi-Fi, phone chargers</li>
    <li>Luggage assistance</li>
  </ul>`;
}

/** Renders unique per-page content authored in the data files.
 *  sections: [{ h2, html }] — html is trusted author content, inserted raw. */
function richBody(sections) {
  return (sections || [])
    .map((s) => `${s.h2 ? `<h2>${esc(s.h2)}</h2>` : ""}${s.html || ""}`)
    .join("\n");
}

function airportRatesTable() {
  const rows = airports
    .map(
      (a) =>
        `<tr><td>Manhattan ↔ ${esc(a.name)}</td><td>$${a.sedan}</td><td>$${a.suv}</td></tr>`
    )
    .join("");
  return `
  <table class="pricing-table">
    <thead><tr><th>Route</th><th>Sedan</th><th>SUV</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function cardGrid(items, basePath) {
  return `<div class="card-grid">${items
    .map(
      (item) => `
    <a href="${basePath}/${item.slug}" class="link-card reveal">
      <span class="link-card-num">${item.featured ? "★" : ""}</span>
      <h3>${esc(item.h1 || item.title || item.name)}</h3>
      <p>${esc(item.desc || item.description || "")}</p>
      <span class="link-card-arrow">View →</span>
    </a>`
    )
    .join("")}</div>`;
}

function hubPage(title, desc, items, basePath, bc) {
  const body = `
    ${pageHero(title, desc, "Aria Black Car Service")}
    <section class="page-section"><div class="container">
      ${cardGrid(items, basePath)}
    </div></section>
    ${ctaBlock()}`;
  return layout({
    title: `${title} | ${site.name}`,
    description: desc,
    canonical: basePath,
    bc: breadcrumbs(bc),
    body,
  });
}

function servicePage(s) {
  const body = `
    ${pageHero(s.h1, s.desc, "Service")}
    <section class="page-section"><div class="container prose-grid">
      <div class="prose">
        ${s.intro ? s.intro : `<p class="lead">${esc(s.desc)} Aria Black Car Service provides flat-rate luxury transportation across NYC and the tri-state area with professional TLC-licensed chauffeurs — available 24 hours a day, 365 days a year.</p>`}
        ${s.sections ? richBody(s.sections) : ""}
        <h2>What's Included</h2>
        ${includedFeatures()}
        ${s.slug === "airport-transfer" || s.slug.includes("airport") ? `<h2>Airport Flat Rates — Manhattan</h2>${airportRatesTable()}` : ""}
        ${s.slug === "hourly" ? `<h2>Hourly Rates</h2><table class="pricing-table"><thead><tr><th>Vehicle</th><th>Rate</th><th>Minimum</th></tr></thead><tbody>${site.hourlyRates.map((r) => `<tr><td>${esc(r.vehicle)}</td><td>$${r.rate}/hr</td><td>${esc(r.min)}</td></tr>`).join("")}</tbody></table>` : ""}
        ${s.slug === "long-distance" ? `<h2>Popular Routes</h2><table class="pricing-table"><thead><tr><th>Route</th><th>Sedan</th><th>SUV</th></tr></thead><tbody>${site.longDistance.map((r) => `<tr><td>${esc(r.route)}</td><td>$${r.sedan}</td><td>$${r.suv}</td></tr>`).join("")}</tbody></table>` : ""}
        <h2>How to Book</h2>
        <ol class="steps-list">
          <li><strong>Request a quote</strong> — ${bookLink("book online", "")} or call ${esc(site.phone)}</li>
          <li><strong>Confirm your vehicle</strong> — sedan, SUV, or Sprinter based on passengers and luggage</li>
          <li><strong>Receive confirmation</strong> — flat rate locked, chauffeur assigned</li>
          <li><strong>Enjoy the ride</strong> — professional service door to door</li>
        </ol>
      </div>
      <aside class="page-sidebar">
        <div class="sidebar-card">
          <h3>Book This Service</h3>
          <p>Flat rates · No surge · 24/7</p>
          ${bookLink("Get Quote", "btn btn-gold btn-block")}
          <a href="tel:${site.phoneTel}" class="btn btn-outline btn-block">Call Now</a>
        </div>
        <div class="sidebar-card">
          <h3>Related</h3>
          ${services.filter((x) => x.slug !== s.slug).slice(0, 4).map((x) => `<a href="/services/${x.slug}" class="sidebar-link">${esc(x.title)}</a>`).join("")}
        </div>
      </aside>
    </div></section>
    ${faqSection(s.faqs || [
      { q: `How much does ${s.title.toLowerCase()} cost in NYC?`, a: `Rates vary by vehicle and distance. Airport sedans from $140, hourly from $90/hr. Request a flat quote at booking — no surge pricing.` },
      { q: "How far in advance should I book?", a: "We recommend 24 hours for airport transfers; online booking requires 12 hours’ notice. Same-day pickups are phone-only — call (888) 402-8202, 24/7." },
    ])}
    ${ctaBlock()}`;

  return layout({
    title: `${s.metaTitle || s.h1} | ${site.name}`,
    description: s.desc,
    canonical: `/services/${s.slug}`,
    bc: breadcrumbs([
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: s.title, href: `/services/${s.slug}` },
    ]),
    body,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.h1,
      provider: { "@type": "LocalBusiness", name: site.name, telephone: site.phoneTel },
      areaServed: "New York City",
    }),
  });
}

function airportPage(a) {
  const h1 = a.h1 || `${a.name} Car Service`;
  // Use a local hero image only if it actually exists on disk (keeps deploys safe until files are added)
  const heroImg = (a.img && a.img.startsWith("/images/") && fs.existsSync(path.join(ROOT, a.img.replace(/^\//, "")))) ? a.img : "";
  const lead = a.intro || `<p class="lead">Aria provides reliable luxury transfers to and from ${esc(a.full)}. Typical drive time from Manhattan: <strong>${esc(a.time)}</strong> via ${esc(a.route)}.</p>`;
  const body = `
    ${pageHero(h1, `Flat-rate ${a.full} car service with flight tracking and meet-and-greet.`, a.code, heroImg)}
    <section class="page-section"><div class="container prose-grid">
      <div class="prose">
        ${lead}
        <h2>Flat Rates from Manhattan</h2>
        <table class="pricing-table"><tbody>
          <tr><td>Executive Sedan</td><td><strong>$${a.sedan}</strong> base fare</td></tr>
          <tr><td>Premium SUV</td><td><strong>$${a.suv}</strong> base fare</td></tr>
        </tbody></table>
        <p>Base fares include tolls and fuel. Gratuity, NYS sales tax, and card processing are itemized transparently at checkout. Flat rates apply within NYC's five boroughs.</p>
        <h2>What's Included</h2>
        ${includedFeatures()}
        <h2>Aria vs Uber at ${esc(a.code)}</h2>
        <table class="pricing-table compare-table">
          <thead><tr><th></th><th>Aria Black Car</th><th>Uber / Rideshare</th></tr></thead>
          <tbody>
            <tr><td>Price</td><td>Flat — no surge</td><td>Surges 2–3× at peaks</td></tr>
            <tr><td>Pickup</td><td>Meet-and-greet inside</td><td>Curbside confusion</td></tr>
            <tr><td>Delays</td><td>Flight tracking included</td><td>Manual updates</td></tr>
            <tr><td>Vehicle</td><td>Guaranteed class</td><td>Random assignment</td></tr>
          </tbody>
        </table>
      </div>
      <aside class="page-sidebar">
        <div class="sidebar-card"><h3>Book ${esc(a.code)} Transfer</h3>
          ${bookLink("Book Online", "btn btn-gold btn-block")}
          <a href="tel:${site.phoneTel}" class="btn btn-outline btn-block">${esc(site.phone)}</a>
        </div>
        <div class="sidebar-card"><h3>Other Airports</h3>
          ${airports.filter((x) => x.slug !== a.slug).map((x) => `<a href="/airports/${x.slug}" class="sidebar-link">${esc(x.code)} — ${esc(x.name)}</a>`).join("")}
        </div>
      </aside>
    </div></section>
    ${faqSection([
      { q: `How much is a car from ${a.code} to Manhattan?`, a: `Aria charges a $${a.sedan} base flat rate for a sedan and $${a.suv} for an SUV from ${a.code} to Manhattan, including tolls and 60 minutes wait time. Gratuity, tax, and card processing are itemized at checkout.` },
      { q: "Do you track my flight?", a: "Yes — we monitor your flight and adjust pickup automatically if you're delayed." },
    ])}
    ${ctaBlock()}`;

  return layout({
    title: `${a.metaTitle || h1} | ${site.name}`,
    description: a.metaDesc || `Flat-rate ${a.name} car service. Sedan $${a.sedan}, SUV $${a.suv}. Meet-and-greet, flight tracking, 24/7.`,
    canonical: `/airports/${a.slug}`,
    bc: breadcrumbs([
      { label: "Home", href: "/" },
      { label: "Airports", href: "/airports" },
      { label: a.code, href: `/airports/${a.slug}` },
    ]),
    body,
  });
}

function routePage(r) {
  const body = `
    ${pageHero(r.h1, `Private luxury car service — flat rate, all tolls included.`, "Route")}
  <section class="page-section"><div class="container">
    <div class="stat-strip reveal">
      <div><strong>${esc(r.miles)}</strong><span>Miles</span></div>
      <div><strong>${esc(r.time)}</strong><span>Drive Time</span></div>
      <div><strong>$${r.sedan}</strong><span>Sedan Flat</span></div>
      <div><strong>$${r.suv}</strong><span>SUV Flat</span></div>
    </div>
    <div class="prose-grid" style="margin-top:3rem">
      <div class="prose">
        ${r.intro ? r.intro : `<p class="lead">Travel from <strong>${esc(r.from)}</strong> to <strong>${esc(r.to)}</strong> in comfort with a professional Aria chauffeur. ${r.note ? esc(r.note) + "." : "Flat rate locked at booking — no surge pricing ever."}</p>`}
        ${r.sections ? richBody(r.sections) : ""}
        <h2>Why Choose Private Car Over Train or Rideshare</h2>
        <ul class="check-list">
          <li>Door-to-door — no station transfers or parking</li>
          <li>Work productively with Wi-Fi and privacy</li>
          <li>Schedule departure on your timeline</li>
          <li>Flat rate — no surge during rush hour or holidays</li>
          <li>Luggage assistance and professional chauffeur</li>
        </ul>
        <h2>Vehicle Options</h2>
        <table class="pricing-table"><thead><tr><th>Vehicle</th><th>Passengers</th><th>Flat Rate</th></tr></thead>
        <tbody>
          <tr><td>Executive Sedan</td><td>Up to 3</td><td>$${r.sedan}</td></tr>
          <tr><td>Premium SUV</td><td>Up to 6</td><td>$${r.suv}</td></tr>
          <tr><td>Executive Sprinter</td><td>Up to 12</td><td>${bookLink("Request quote", "")}</td></tr>
        </tbody></table>
        <h2>How to Book</h2>
        <ol class="steps-list">
          <li>Submit trip details ${bookLink("online", "")}</li>
          <li>Receive flat-rate confirmation — no hidden fees</li>
          <li>Chauffeur arrives early; flight tracked if applicable</li>
        </ol>
      </div>
      <aside class="page-sidebar">
        <div class="sidebar-card"><h3>Book This Route</h3>
          ${bookLink("Get Flat Rate Quote", "btn btn-gold btn-block")}
        </div>
        <div class="sidebar-card"><h3>More Routes</h3>
          ${routes.filter((x) => x.slug !== r.slug).slice(0, 6).map((x) => `<a href="/routes/${x.slug}" class="sidebar-link">${esc(x.h1)}</a>`).join("")}
          <a href="/routes" class="sidebar-link">All routes →</a>
        </div>
      </aside>
    </div>
  </div></section>
  ${faqSection(r.faqs || [
    { q: `How much is car service from ${r.from} to ${r.to}?`, a: `Flat rate from $${r.sedan} for a sedan and $${r.suv} for an SUV, including chauffeur, fuel, and standard tolls.` },
    { q: "Is the price all-inclusive?", a: "Base rates include tolls and fuel. Gratuity (20%), NYS sales tax (8.87%), and card processing (3.5%) are itemized transparently at checkout — you see every line before you confirm." },
  ])}
  ${ctaBlock()}`;

  return layout({
    title: `${r.h1} | ${site.name}`,
    description: `Flat-rate private car from ${r.from} to ${r.to}. Sedan $${r.sedan}, SUV $${r.suv}. Book 24/7.`,
    canonical: `/routes/${r.slug}`,
    bc: breadcrumbs([
      { label: "Home", href: "/" },
      { label: "Routes", href: "/routes" },
      { label: r.from + " → " + r.to, href: `/routes/${r.slug}` },
    ]),
    body,
  });
}

function locationPage(l) {
  const body = `
    ${pageHero(l.h1, l.desc, "Location")}
    <section class="page-section"><div class="container prose">
      ${l.intro ? l.intro : `<p class="lead">${esc(l.desc)} Airport transfers to JFK (from $165), LaGuardia (from $140), and Newark (from $180) — flat base rates within NYC's five boroughs, distance-based quotes beyond.</p>`}
      ${l.sections ? richBody(l.sections) : ""}
      ${l.hideAirportRates ? "" : `<h2>Airport Flat Rates — NYC's Five Boroughs</h2>${airportRatesTable()}`}
      <h2>Services in ${esc(l.area)}</h2>
      <div class="card-grid">${services.slice(0, 8).map((s) => `<a href="/services/${s.slug}" class="link-card"><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></a>`).join("")}</div>
      ${l.sections ? "" : `<h2>Popular Routes</h2>
      <ul class="check-list">
        <li><a href="/routes/manhattan-to-jfk">${esc(l.area)} to JFK</a></li>
        <li><a href="/routes/hamptons">NYC to The Hamptons</a></li>
        <li><a href="/routes/boston">NYC to Boston</a></li>
      </ul>`}
    </div></section>
    ${faqSection(l.faqs || [])}
    ${ctaBlock()}`;

  return layout({
    title: `${l.h1} | ${site.name}`,
    description: l.desc,
    canonical: `/locations/${l.slug}`,
    bc: breadcrumbs([
      { label: "Home", href: "/" },
      { label: "Locations", href: "/locations/manhattan" },
      { label: l.area, href: `/locations/${l.slug}` },
    ]),
    body,
  });
}

const fleetCapacityIcon = `<svg class="fleet-list-row__cap-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>`;

function fleetVehicle(v) {
  return typeof v === "string" ? { name: v, image: "", pax: "" } : v;
}

function fleetVehicleNames(f) {
  return f.vehicles.map((v) => fleetVehicle(v).name);
}

function fleetListRow(f, vehicle) {
  const v = fleetVehicle(vehicle);
  const pax = v.pax || f.pax;
  const paxLabel = `Up to ${pax} passengers`;
  return `
        <li class="fleet-list-row-item">
          <a href="/fleet/${f.slug}" class="fleet-list-row">
            <div class="fleet-list-row__grid">
              <div class="fleet-list-row__visual">
                <img src="/images/fleet/${esc(v.image)}" alt="${esc(v.name)}" loading="lazy" decoding="async" />
              </div>
              <div class="fleet-list-row__info">
                <h3 class="fleet-list-row__name">${esc(v.name)}</h3>
                <span class="fleet-list-row__tier">${esc(f.tier.toUpperCase())}</span>
              </div>
              <div class="fleet-list-row__capacity">
                ${fleetCapacityIcon}
                <span>${paxLabel}</span>
              </div>
              <div class="fleet-list-row__cta-wrap">
                <span class="fleet-list-row__cta">View Details</span>
              </div>
            </div>
          </a>
        </li>`;
}

function fleetHubPage() {
  const fleetSections = fleet
    .map(
      (f) => `
    <section class="fleet-list-group reveal" aria-labelledby="fleet-group-${f.slug}">
      <div class="fleet-list-group__head">
        <h2 id="fleet-group-${f.slug}" class="fleet-list-group__title">${esc(f.tier.toUpperCase())}</h2>
        <a href="/fleet/${f.slug}" class="fleet-list-group__all">View All <span aria-hidden="true">→</span></a>
      </div>
      <ul class="fleet-list-rows">
        ${f.vehicles.map((v) => fleetListRow(f, v)).join("")}
      </ul>
    </section>`
    )
    .join("");

  const body = `
    <section class="fleet-collection-hero" aria-labelledby="fleet-collection-heading">
      <div class="fleet-collection-hero__intro container">
        <p class="section-label">The Collection</p>
        <h1 id="fleet-collection-heading" class="fleet-collection-hero__title">A Curated Fleet for <em>Every Journey</em></h1>
        <p class="fleet-collection-hero__lead">Hand-selected executive sedans, luxury SUVs, and Sprinter vans — late-model, immaculately detailed, and maintained to the highest standards of safety and presentation.</p>
        <div class="fleet-collection-hero__actions">
          ${bookLink("Reserve Your Vehicle", "btn btn-gold")}
          <a href="tel:${site.phoneTel}" class="btn btn-outline">Call ${esc(site.phone)}</a>
        </div>
      </div>
    </section>
    <section class="fleet-list-catalog" aria-label="Fleet vehicles by class">
      <div class="container fleet-list-catalog__inner">
        ${fleetSections}
      </div>
    </section>
    <section class="page-section fleet-collection-rates fleet-collection-rates--dark">
      <div class="container narrow">
        <h2 class="section-title" style="text-align:center">Hourly <em>Rates</em></h2>
        <table class="pricing-table reveal">
          <thead><tr><th>Vehicle</th><th>Rate</th><th>Minimum</th></tr></thead>
          <tbody>${site.hourlyRates.map((r) => `<tr><td>${esc(r.vehicle)}</td><td>$${r.rate}/hr</td><td>${esc(r.min)}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
    ${ctaBlock("Select your vehicle and book in minutes — flat rates, no surge pricing.")}`;

  return layout({
    title: `The Collection | Luxury Fleet | ${site.name}`,
    description: "Explore Aria's executive sedans, luxury SUVs, and Mercedes Sprinter vans. Late-model fleet for airport transfers, corporate travel, and special events in NYC.",
    canonical: "/fleet",
    bc: breadcrumbs([{ label: "Home", href: "/" }, { label: "Fleet", href: "/fleet" }]),
    body,
    bodyClass: "fleet-hub-page",
  });
}

function fleetPage(f) {
  const vehicleList = `
    <section class="fleet-list-catalog fleet-category-catalog" aria-label="${esc(f.tier)} vehicles">
      <div class="container fleet-list-catalog__inner">
        <ul class="fleet-list-rows">
          ${f.vehicles.map((v) => fleetListRow(f, v)).join("")}
        </ul>
      </div>
    </section>`;

  const body = `
    ${pageHero(f.h1, `Late-model ${f.tier.toLowerCase()} vehicles — meticulously maintained.`, "Fleet")}
    ${vehicleList}
    <section class="page-section"><div class="container prose-grid">
      <div class="prose">
        <p class="lead">Our ${esc(f.tier)} fleet includes ${fleetVehicleNames(f).map(esc).join(", ")}. Capacity: up to ${f.pax} passengers, ${f.bags} bags.</p>
        <h2>Rates</h2>
        <table class="pricing-table"><tbody>
          <tr><td>Hourly</td><td>$${f.hourly}/hr</td></tr>
          <tr><td>JFK from Manhattan</td><td>From $${f.jfk}</td></tr>
        </tbody></table>
        ${includedFeatures()}
      </div>
      <aside class="page-sidebar">
        <div class="sidebar-card"><h3>Book ${esc(f.tier)}</h3>
          ${bookLink("Reserve Now", "btn btn-gold btn-block")}
        </div>
      </aside>
    </div></section>
    ${ctaBlock()}`;

  return layout({
    title: `${f.h1} | ${site.name}`,
    description: `${f.tier} fleet — ${fleetVehicleNames(f).join(", ")}. Hourly from $${f.hourly}/hr.`,
    canonical: `/fleet/${f.slug}`,
    bc: breadcrumbs([
      { label: "Home", href: "/" },
      { label: "Fleet", href: "/fleet" },
      { label: f.tier, href: `/fleet/${f.slug}` },
    ]),
    body,
  });
}

function guidePage(g) {
  let content = `<p class="lead">${esc(g.meta)}</p><p class="updated-badge">Updated ${esc(g.updated)} · ${esc(g.readTime)} read</p>`;

  if (g.tldr) {
    content += `<h2>TL;DR — Quick Answer</h2><ul class="check-list">${g.tldr.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  }

  if (g.options) {
    content += `<h2>Every Option Compared</h2>`;
    g.options.forEach((o, i) => {
      content += `<h3>Option ${i + 1}: ${esc(o.name)}</h3>
        <p><strong>Time:</strong> ${esc(o.time)} · <strong>Typical cost:</strong> ${esc(o.cost)}</p>
        <p><strong>Best for:</strong> ${esc(o.bestFor)}</p>
        <p><strong>Pros:</strong> ${o.pros.map(esc).join("; ")}</p>
        ${o.cons && o.cons.length ? `<p><strong>Cons:</strong> ${o.cons.map(esc).join("; ")}</p>` : ""}`;
    });
    content += `<h2>Which Option Is Right for You?</h2>
      <p>For business travelers, families, and international arrivals with luggage, <strong>Aria Black Car Service</strong> offers the best balance of reliability, flat pricing, and terminal meet-and-greet.</p>`;
  }

  if (g.comparison) {
    const keys = Object.keys(g.comparison[0]).filter((k) => k !== "factor");
    content += `<h2>Side-by-Side Comparison</h2>
      <table class="pricing-table compare-table">
        <thead><tr><th>Factor</th>${keys.map((k) => `<th>${esc(k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()))}</th>`).join("")}</tr></thead>
        <tbody>${g.comparison.map((row) => `<tr><td>${esc(row.factor)}</td>${keys.map((k) => `<td>${esc(row[k])}</td>`).join("")}</tr>`).join("")}
        </tbody></table>`;
  }

  if (g.steps) {
    content += `<h2>How to Book (Step-by-Step)</h2><ol class="steps-list">${g.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`;
  }

  if (g.mistakes) {
    content += `<h2>Common Mistakes to Avoid</h2><ul class="check-list">${g.mistakes.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>`;
  }

  if (g.terminals) {
    content += `<h2>Terminal Overview</h2>${g.terminals.map((t) => `<h3>${esc(t.name)}</h3><p>${esc(t.airlines)}</p>`).join("")}`;
  }

  if (g.routes) {
    content += `<h2>Route Options</h2>${g.routes.map((r) => `<h3>${esc(r.name)}</h3><p><strong>Time:</strong> ${esc(r.time)}. ${esc(r.best)}</p>`).join("")}`;
  }

  if (g.referenceHtml) {
    content += g.referenceHtml;
  }

  if (g.slug === "black-car-vs-uber-nyc" || g.slug === "how-to-book-black-car-service") {
    content += guideLongForm(g.slug);
  }

  if (g.type === "pricing") {
    content += `<h2>Aria Black Car Rates (${site.year})</h2>
      <h3>Hourly Chauffeur</h3>
      <table class="pricing-table"><thead><tr><th>Vehicle</th><th>Rate</th><th>Minimum</th></tr></thead>
      <tbody>${site.hourlyRates.map((r) => `<tr><td>${esc(r.vehicle)}</td><td>$${r.rate}/hr</td><td>${esc(r.min)}</td></tr>`).join("")}</tbody></table>
      <h3>Airport Flat Rates — Manhattan</h3>${airportRatesTable()}
      <h3>Long-Distance</h3>
      <table class="pricing-table"><thead><tr><th>Route</th><th>Sedan</th><th>SUV</th></tr></thead>
      <tbody>${site.longDistance.map((r) => `<tr><td>${esc(r.route)}</td><td>$${r.sedan}</td><td>$${r.suv}</td></tr>`).join("")}</tbody></table>`;
  }

  const relatedGuides = g.relatedSlugs
    ? g.relatedSlugs.map((slug) => guides.find((guide) => guide.slug === slug)).filter(Boolean)
    : guides.filter((guide) => guide.slug !== g.slug).slice(0, 4);

  const body = `
    ${pageHero(g.title, "", "Guide")}
    <section class="page-section"><div class="container prose narrow">${content}</div></section>
    ${faqSection(g.faqs || [])}
    <section class="page-section"><div class="container">
      <h2 class="section-title">Related <em>Guides</em></h2>
      <div class="card-grid">${relatedGuides.map((guide) => `<a href="/guides/${guide.slug}" class="link-card"><h3>${esc(guide.title)}</h3></a>`).join("")}</div>
    </div></section>
    ${ctaBlock()}`;

  return layout({
    title: `${g.title} | ${site.name}`,
    description: g.meta,
    canonical: `/guides/${g.slug}`,
    bc: breadcrumbs([
      { label: "Home", href: "/" },
      { label: "Guides", href: "/guides" },
      { label: g.title, href: `/guides/${g.slug}` },
    ]),
    body,
  });
}

function blogPage(b) {
  const paragraphs = [
    `When choosing ${b.title.toLowerCase().replace(/\(\d{4}\)/, "").trim()}, the most important factors are flat-rate pricing, TLC licensing, flight tracking for airport trips, and a guaranteed vehicle class.`,
    `Aria Black Car Service has completed ${site.trips} trips with a ${site.rating}★ rating. We serve all five NYC boroughs, Long Island, Westchester, Connecticut, and Northern New Jersey — 24 hours a day.`,
    `Unlike rideshare apps, Aria locks your rate at booking. No surge during rush hour, rain, holidays, or major events like Fashion Week or the UN General Assembly.`,
    `For airport transfers, every ride includes real-time FAA flight tracking, meet-and-greet at baggage claim with a name sign, and 60 minutes of complimentary wait time.`,
    `Corporate clients benefit from monthly net-30 billing, dedicated account managers, detailed trip reporting, and NDA-compliant chauffeurs upon request.`,
  ];

  const richContent = b.intro || b.sections;
  const legacyBody = `
      ${paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
      <h2>Why Aria Black Car Service</h2>
      ${includedFeatures()}
      <h2>Popular Services</h2>
      <ul class="check-list">
        <li><a href="/services/airport-transfer">Airport Transfers</a> — JFK, LGA, EWR, TEB, HPN</li>
        <li><a href="/services/corporate-shuttle">Corporate Shuttle</a> — accounts & billing</li>
        <li><a href="/services/hourly">Hourly Chauffeur</a> — from $90/hr</li>
        <li><a href="/services/long-distance">Long Distance</a> — Boston, Hamptons, DC</li>
      </ul>
      <h2>Airport Flat Rates (Manhattan)</h2>
      ${airportRatesTable()}`;

  // Related articles: prefer same-category posts, then fill from the rest
  const related = [
    ...blog.filter((x) => x.slug !== b.slug && x.category === b.category),
    ...blog.filter((x) => x.slug !== b.slug && x.category !== b.category),
  ].slice(0, 4);

  const body = `
    ${pageHero(b.title, "", b.category)}
    <section class="page-section"><div class="container prose narrow">
      <p class="updated-badge">${esc(b.category)} · Updated ${esc(b.updated)} · ${esc(b.readTime)} read</p>
      ${b.intro ? b.intro : ""}
      ${b.sections ? richBody(b.sections) : (richContent ? "" : legacyBody)}
    </div></section>
    ${b.faqs ? faqSection(b.faqs) : defaultFaqs()}
    <section class="page-section"><div class="container">
      <h2 class="section-title">Related <em>Articles</em></h2>
      <div class="card-grid">${related.map((x) => `<a href="/blog/${x.slug}" class="link-card"><span class="link-card-tag">${esc(x.category)}</span><h3>${esc(x.title)}</h3></a>`).join("")}</div>
    </div></section>
    ${ctaBlock()}`;

  return layout({
    title: `${b.title} | ${site.name}`,
    description: b.meta,
    canonical: `/blog/${b.slug}`,
    bc: breadcrumbs([
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: b.title, href: `/blog/${b.slug}` },
    ]),
    body,
  });
}

function staticPage(id, title, h1, contentHtml) {
  return layout({
    title: `${title} | ${site.name}`,
    description: `${title} — ${site.name}. ${site.phone}.`,
    canonical: `/${id}`,
    bc: breadcrumbs([{ label: "Home", href: "/" }, { label: title, href: `/${id}` }]),
    body: `${pageHero(h1, "", "")}<section class="page-section"><div class="container prose narrow">${contentHtml}</div></section>${ctaBlock()}`,
  });
}

const HUB_PATHS = new Set([
  "/services",
  "/airports",
  "/fleet",
  "/routes",
  "/guides",
  "/blog",
  "/pricing",
  "/faq",
  "/about",
  "/contact",
  "/book",
  "/quote",
  "/sitemap",
]);

function sitemapPriority(urlPath) {
  if (urlPath === "/") return "1.0";
  if (HUB_PATHS.has(urlPath)) return "0.9";
  return "0.8";
}

function buildSitemap(urls) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${site.domain}${u}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${sitemapPriority(u)}</priority></url>`
  )
  .join("\n")}
</urlset>`;
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), xml);
}

function sitemapLinkList(items, basePath, labelKey = "title") {
  return `<ul class="sitemap-links">${items
    .map((item) => {
      const label = item[labelKey] || item.h1 || item.name || item.title;
      return `<li><a href="${basePath}/${item.slug}">${esc(label)}</a></li>`;
    })
    .join("")}</ul>`;
}

function htmlSitemapPage() {
  const body = `
    ${pageHero("Sitemap", "Browse every page on Aria Black Car Service.", "Site Map")}
    <section class="page-section"><div class="container sitemap-sections">
      <section class="sitemap-section">
        <h2>Services</h2>
        ${sitemapLinkList(services, "/services", "title")}
        <p><a href="/services">All services →</a></p>
      </section>
      <section class="sitemap-section">
        <h2>Airports</h2>
        ${sitemapLinkList(
          airports.map((a) => ({ slug: a.slug, title: `${a.code} — ${a.name}` })),
          "/airports"
        )}
        <p><a href="/airports">Airport hub →</a></p>
      </section>
      <section class="sitemap-section">
        <h2>Fleet</h2>
        ${sitemapLinkList(
          fleet.map((f) => ({ slug: f.slug, title: f.tier })),
          "/fleet"
        )}
        <p><a href="/fleet">Fleet overview →</a></p>
      </section>
      <section class="sitemap-section">
        <h2>Routes</h2>
        ${sitemapLinkList(routes, "/routes", "h1")}
        <p><a href="/routes">All routes →</a></p>
      </section>
      <section class="sitemap-section">
        <h2>Locations</h2>
        ${sitemapLinkList(locations, "/locations", "area")}
      </section>
      <section class="sitemap-section">
        <h2>Guides</h2>
        ${sitemapLinkList(guides, "/guides")}
        <p><a href="/guides">All guides →</a></p>
      </section>
      <section class="sitemap-section">
        <h2>Blog</h2>
        ${sitemapLinkList(blog, "/blog")}
        <p><a href="/blog">All articles →</a></p>
      </section>
      <section class="sitemap-section">
        <h2>Corporate &amp; Events</h2>
        <ul class="sitemap-links">
          ${corporate.map((c) => `<li><a href="/corporate/${c.slug}">${esc(c.h1)}</a></li>`).join("")}
          ${events.map((e) => `<li><a href="/events/${e.slug}">${esc(e.h1)}</a></li>`).join("")}
        </ul>
      </section>
      <section class="sitemap-section">
        <h2>Company</h2>
        <ul class="sitemap-links">
          <li><a href="/">Home</a></li>
          <li><a href="/pricing">Rates &amp; Pricing</a></li>
          <li><a href="/book">Book Online</a></li>
          <li><a href="/quote">Get a Quote</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/terms">Terms</a></li>
          <li><a href="/privacy">Privacy</a></li>
        </ul>
      </section>
    </div></section>`;

  return layout({
    title: `Sitemap | ${site.name}`,
    description: "Complete sitemap of Aria Black Car Service — services, airports, routes, fleet, guides, and blog.",
    canonical: "/sitemap",
    bc: breadcrumbs([{ label: "Home", href: "/" }, { label: "Sitemap", href: "/sitemap" }]),
    body,
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Sitemap",
      url: `${site.domain}/sitemap`,
      isPartOf: { "@type": "WebSite", name: site.name, url: site.domain },
    }),
  });
}

function patchHomepage(html) {
  const newNav = `<nav class="nav-links" aria-label="Main navigation">
        <a href="/services">Services</a>
        <a href="/airports">Airports</a>
        <a href="/fleet">Fleet</a>
        <a href="/routes">Routes</a>
        <a href="/guides">Guides</a>
        <a href="/blog">Blog</a>
        <a href="/pricing">Rates</a>
        <a href="/faq">FAQ</a>
        <a href="/contact">Contact</a>
      </nav>`;

  return html
    .replace(/<nav class="nav-links"[\s\S]*?<\/nav>/, newNav)
    .replace(/href="#"/g, 'href="/"')
    .replace(/href="#services"/g, 'href="/services"')
    .replace(/href="#fleet"/g, 'href="/fleet"')
    .replace(/href="#routes"/g, 'href="/airports"')
    .replace(/href="#pricing"/g, 'href="/pricing"')
    .replace(/href="#faq"/g, 'href="/faq"')
    .replace(/href="#contact"/g, 'href="/contact"')
    .replace(/href="#book"/g, `href="${site.bookingUrl}" class="js-open-booking"`)
    .replace('href="css/styles.css"', 'href="/css/styles.css"')
    .replace('src="js/main.js?v=4"', 'src="/js/main.js?v=4"')
    .replace('src="js/main.js?v=3"', 'src="/js/main.js?v=4"')
    .replace('src="js/main.js"', 'src="/js/main.js?v=4"')
    .replace('href="favicon.png?v=2"', 'href="/favicon.png?v=2"')
    .replace(/src="images\//g, 'src="/images/')
    .replace(
      '<link rel="stylesheet" href="/css/styles.css" />',
      '<link rel="stylesheet" href="/css/styles.css" />\n  <link rel="stylesheet" href="/css/pages.css" />'
    )
    .replace(
      '<nav id="mobile-menu"',
      `<nav id="mobile-menu"`
    )
    .replace(
      /<nav id="mobile-menu"[\s\S]*?<\/nav>\s*<main>/,
      `<nav id="mobile-menu" class="mobile-menu" aria-label="Mobile navigation">
    <a href="/services">Services</a><a href="/airports">Airports</a><a href="/fleet">Fleet</a>
    <a href="/routes">Routes</a><a href="/guides">Guides</a><a href="/blog">Blog</a>
    <a href="/pricing">Rates</a>${bookLink("Book", "")}<a href="/contact">Contact</a>
    <a href="tel:${site.phoneTel}" style="color:var(--gold)">${site.phone}</a>
  </nav>
  <main>`
    )
    .replace(
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n  <link rel="dns-prefetch" href="https://book.ariablackcarservice.com" />'
    )
    .replace(/<footer class="footer">[\s\S]*?<div class="floating-cta"[\s\S]*?<\/div>/, seoFooter().trim())
    .replace(
      /<script type="application\/ld\+json">\s*\{/,
      '<script type="application/ld+json">\n  [{'
    )
    .replace(
      '"slogan": "Where Every Mile Feels First Class"\n  }\n  <\/script>',
      `"slogan": "Where Every Mile Feels First Class"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "${site.name}",
    "url": "${site.domain}",
    "publisher": { "@id": "${site.domain}" }
  }]
  </script>`
    );
}

// --- BUILD ---
console.log("Building site...");
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

// Assets
fs.mkdirSync(path.join(OUT, "css"), { recursive: true });
fs.mkdirSync(path.join(OUT, "js"), { recursive: true });
fs.copyFileSync(path.join(ROOT, "css", "styles.css"), path.join(OUT, "css", "styles.css"));
fs.copyFileSync(path.join(ROOT, "css", "pages.css"), path.join(OUT, "css", "pages.css"));
fs.copyFileSync(path.join(ROOT, "js", "main.js"), path.join(OUT, "js", "main.js"));
fs.copyFileSync(path.join(ROOT, "favicon.svg"), path.join(OUT, "favicon.svg"));
fs.copyFileSync(path.join(ROOT, "favicon.png"), path.join(OUT, "favicon.png"));
if (fs.existsSync(path.join(ROOT, "llms.txt"))) {
  fs.copyFileSync(path.join(ROOT, "llms.txt"), path.join(OUT, "llms.txt"));
}
const indexNowKeyPath = path.join(ROOT, "indexnow-key.txt");
if (fs.existsSync(indexNowKeyPath)) {
  const indexNowKey = fs.readFileSync(indexNowKeyPath, "utf8").trim();
  if (indexNowKey) {
    fs.writeFileSync(path.join(OUT, `${indexNowKey}.txt`), indexNowKey);
  }
}
const imagesDir = path.join(ROOT, "images");
if (fs.existsSync(imagesDir)) {
  const copyImages = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) copyImages(srcPath, destPath);
      else fs.copyFileSync(srcPath, destPath);
    }
  };
  copyImages(imagesDir, path.join(OUT, "images"));
}

const videosDir = path.join(ROOT, "videos");
if (fs.existsSync(videosDir)) {
  const outVideos = path.join(OUT, "videos");
  fs.mkdirSync(outVideos, { recursive: true });
  for (const file of fs.readdirSync(videosDir)) {
    if (/\.(mp4|webm)$/i.test(file)) {
      fs.copyFileSync(path.join(videosDir, file), path.join(outVideos, file));
    }
  }
}

const urls = ["/"];

// Homepage
let home = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
home = patchHomepage(home);
fs.writeFileSync(path.join(OUT, "index.html"), home);

// Hubs
writePage("/services", hubPage("NYC Black Car Services", "Premium chauffeured transportation for every occasion.", services, "/services", [{ label: "Home", href: "/" }, { label: "Services", href: "/services" }]));
urls.push("/services");
writePage("/airports", hubPage("NYC Airport Car Service", "Flat-rate transfers to all major NYC-area airports.", airports.map((a) => ({ slug: a.slug, h1: a.name, desc: `Sedan $${a.sedan} · SUV $${a.suv} · ${a.time}` })), "/airports", [{ label: "Home", href: "/" }, { label: "Airports", href: "/airports" }]));
urls.push("/airports");
writePage("/fleet", fleetHubPage());
urls.push("/fleet");
writePage("/routes", hubPage("Popular Routes & Flat Rates", "Airport pairs, neighborhoods, and long-distance corridors.", routes.map((r) => ({ slug: r.slug, h1: r.h1, desc: r.note || `Sedan $${r.sedan} · SUV $${r.suv} · ${r.time}` })), "/routes", [{ label: "Home", href: "/" }, { label: "Routes", href: "/routes" }]));
urls.push("/routes");
writePage("/guides", hubPage("Transportation Guides", "Expert guides on NYC airports, pricing, and booking black car service.", guides, "/guides", [{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }]));
urls.push("/guides");
writePage("/blog", hubPage("Blog & Resources", "Tips, comparisons, and NYC transportation insights from Aria.", blog, "/blog", [{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]));
urls.push("/blog");

services.forEach((s) => { writePage(`/services/${s.slug}`, servicePage(s)); urls.push(`/services/${s.slug}`); });
airports.forEach((a) => { writePage(`/airports/${a.slug}`, airportPage(a)); urls.push(`/airports/${a.slug}`); });
fleet.forEach((f) => { writePage(`/fleet/${f.slug}`, fleetPage(f)); urls.push(`/fleet/${f.slug}`); });
routes.forEach((r) => { writePage(`/routes/${r.slug}`, routePage(r)); urls.push(`/routes/${r.slug}`); });
locations.forEach((l) => { writePage(`/locations/${l.slug}`, locationPage(l)); urls.push(`/locations/${l.slug}`); });
corporate.forEach((c) => {
  writePage(`/corporate/${c.slug}`, layout({
    title: `${c.h1} | ${site.name}`, description: c.desc, canonical: `/corporate/${c.slug}`,
    bc: breadcrumbs([{ label: "Home", href: "/" }, { label: "Corporate", href: "/corporate/accounts" }, { label: c.h1, href: `/corporate/${c.slug}` }]),
    body: `${pageHero(c.h1, c.desc, "Corporate")}<section class="page-section"><div class="container prose"><p class="lead">${esc(c.desc)}</p>${includedFeatures()}<h2>Corporate Account Benefits</h2><ul class="check-list"><li>Monthly net-30 consolidated billing</li><li>Dedicated account manager</li><li>Volume discounts</li><li>Detailed trip reporting</li><li>Priority dispatch</li><li>NDA-compliant chauffeurs on request</li></ul><p>${bookLink("Set up your account →", "")}</p></div></section>${defaultFaqs()}${ctaBlock("Set up your corporate account today.")}`,
  }));
  urls.push(`/corporate/${c.slug}`);
});
events.forEach((e) => {
  writePage(`/events/${e.slug}`, layout({
    title: `${e.h1} | ${site.name}`, description: e.desc, canonical: `/events/${e.slug}`,
    bc: breadcrumbs([{ label: "Home", href: "/" }, { label: "Events", href: "/events/sporting" }, { label: e.h1, href: `/events/${e.slug}` }]),
    body: `${pageHero(e.h1, e.desc, "Events")}<section class="page-section"><div class="container prose"><p class="lead">${esc(e.desc)}</p><p>Hourly chauffeur from $90/hr · Sprinter vans $200/hr (5-hour minimum) · Book 24–48 hours ahead for major events.</p></div></section>${ctaBlock()}`,
  }));
  urls.push(`/events/${e.slug}`);
});
guides.forEach((g) => { writePage(`/guides/${g.slug}`, guidePage(g)); urls.push(`/guides/${g.slug}`); });
blog.forEach((b) => { writePage(`/blog/${b.slug}`, blogPage(b)); urls.push(`/blog/${b.slug}`); });

// Static pages
writePage("/about", staticPage("about", "About Us", "About Aria Black Car Service", `
  <p class="lead">Founded in ${site.founded}, Aria Black Car Service is NYC's trusted luxury chauffeur company — ${site.rating}★ rated with ${site.trips} completed trips.</p>
  <p>We provide flat-rate airport transfers, corporate travel, hourly hire, and special event transportation across all five boroughs and the tri-state area.</p>
  <h2>Our Promise</h2><ul class="check-list"><li>Flat rates — never surge pricing</li><li>TLC-licensed, background-checked chauffeurs</li><li>Late-model luxury fleet</li><li>24/7/365 availability</li></ul>
`));
urls.push("/about");

writePage("/contact", staticPage("contact", "Contact", "Contact Aria", `
  <p><strong>Phone:</strong> <a href="tel:${site.phoneTel}">${esc(site.phone)}</a> (24/7)</p>
  <p><strong>Email:</strong> <a href="mailto:${site.email}">${esc(site.email)}</a></p>
  <p><strong>General:</strong> <a href="mailto:${site.infoEmail}">${esc(site.infoEmail)}</a></p>
  <p><strong>Service area:</strong> NYC, Long Island, Westchester, CT, NJ</p>
`));
urls.push("/contact");

writePage("/faq", layout({
  title: `FAQ | ${site.name}`,
  description: "Frequently asked questions about Aria Black Car Service — pricing, airports, booking, and corporate accounts.",
  canonical: "/faq",
  bc: breadcrumbs([{ label: "Home", href: "/" }, { label: "FAQ", href: "/faq" }]),
  body: `${pageHero("Frequently Asked Questions", "Everything you need to know about booking with Aria.", "FAQ")}
  ${faqSection([
    { q: "How much is JFK to Manhattan?", a: "$165 sedan, $250 SUV — base flat rate including tolls, flight tracking, and 60 min wait. Gratuity, tax, and card processing itemized at checkout." },
    { q: "Is there surge pricing?", a: "Never. Your quoted flat rate is final." },
    { q: "Do you offer corporate accounts?", a: "Yes — monthly billing, account manager, volume discounts." },
    { q: "How do I book?", a: `Book online or call ${site.phone}.` },
    { q: "Child car seats?", a: "Available free when requested at booking." },
    { q: "What airports do you serve?", a: "JFK, LaGuardia, Newark, Teterboro, Westchester, ISP, and Stewart." },
  ])}${ctaBlock()}`,
}));
urls.push("/faq");

writePage("/pricing", layout({
  title: `Rates & Pricing | ${site.name}`,
  description: "Transparent NYC black car pricing — airport flat rates, hourly chauffeur, long-distance routes. No surge.",
  canonical: "/pricing",
  bc: breadcrumbs([{ label: "Home", href: "/" }, { label: "Pricing", href: "/pricing" }]),
  body: `${pageHero("Transparent Pricing", "Flat rates. No surge. No hidden fees.", "Rates")}
  <section class="page-section"><div class="container">
    <h2>Airport Flat Rates — Manhattan</h2>${airportRatesTable()}
    <h2 style="margin-top:3rem">Hourly Chauffeur</h2>
    <table class="pricing-table"><thead><tr><th>Vehicle</th><th>Rate</th><th>Min</th></tr></thead>
    <tbody>${site.hourlyRates.map((r) => `<tr><td>${esc(r.vehicle)}</td><td>$${r.rate}/hr</td><td>${esc(r.min)}</td></tr>`).join("")}</tbody></table>
    <h2 style="margin-top:3rem">Long Distance</h2>
    <table class="pricing-table"><thead><tr><th>Route</th><th>Sedan</th><th>SUV</th></tr></thead>
    <tbody>${site.longDistance.map((r) => `<tr><td>${esc(r.route)}</td><td>$${r.sedan}</td><td>$${r.suv}</td></tr>`).join("")}</tbody></table>
    <p style="margin-top:2rem">Base rates include tolls and fuel. Gratuity (20%), NYS sales tax (8.87%), and card processing (3.5%) are itemized transparently at checkout. Airport flat rates apply within NYC's five boroughs; trips beyond are distance-priced.</p>
  </div></section>${ctaBlock()}`,
}));
urls.push("/pricing");

writePage("/book", layout({
  title: `Book Your Ride | ${site.name}`,
  description: "Book Aria Black Car Service online — instant flat-rate reservations for airport transfers and chauffeur hire.",
  canonical: "/book",
  bc: breadcrumbs([{ label: "Home", href: "/" }, { label: "Book", href: "/book" }]),
  body: `${pageHero("Book Your Ride", "Flat rate pricing. No surge. No hidden fees.", "Reserve")}
  <section class="page-section book-embed-section"><div class="container">
    <iframe class="booking-iframe" title="Online reservations" src="${esc(site.bookingUrl)}" loading="lazy"></iframe>
    <p style="text-align:center;margin-top:1rem;color:var(--gray-500)">Prefer to call? <a href="tel:${site.phoneTel}" style="color:var(--gold)">${esc(site.phone)}</a> — 24/7</p>
  </div></section>`,
}));
urls.push("/book");
writePage("/quote", layout({ title: `Get a Quote | ${site.name}`, description: "Request a flat-rate quote.", canonical: "/quote", body: `${pageHero("Get a Quote", "", "Quote")}<section class="page-section"><div class="container" style="text-align:center">${bookLink("Online Reservations", "btn btn-gold")}</div></section>${ctaBlock()}` }));
urls.push("/quote");

writePage("/sitemap", htmlSitemapPage());
urls.push("/sitemap");

writePage("/terms", staticPage("terms", "Terms of Service", "Terms of Service", `<p>By booking with Aria Black Car Service you agree to our cancellation policy: 24+ hours notice for full refund. Quoted rates are base fares; a 20% standard gratuity, 8.87% NYS sales tax, and 3.5% card processing fee are itemized at checkout. Chauffeurs wait 60 minutes complimentary at airports.</p>`));
writePage("/privacy", staticPage("privacy", "Privacy Policy", "Privacy Policy", `<p>We collect booking information to provide transportation services. We do not sell personal data. Contact ${site.infoEmail} for data requests.</p>`));
urls.push("/terms", "/privacy");

fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);
buildSitemap(urls);

console.log(`Built ${urls.length} pages → public/`);
