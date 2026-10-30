#!/usr/bin/env node
/* /blog/ kalite kontrolü: node blog/qa.mjs
   Statik: iç bağlantı/görsel hedefleri, JSON-LD, canonical, meta, tek H1, alt metin.
   Playwright: 6 genişlikte yatay taşma, alt çizgi, dokunma hedefi, kategori filtresi. */
import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const pages = ["blog/index.html", ...fs.readdirSync(here, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `blog/${d.name}/index.html`)];
const errors = [];
const fail = (m) => errors.push(m);

for (const rp of pages) {
  const html = fs.readFileSync(path.join(root, rp), "utf8");
  const dir = path.dirname(path.join(root, rp));
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${rp}: H1 sayısı 1 değil`);
  if (!/<link rel="canonical" href="https:\/\/qrmenuofficial\.com\/blog\/(?:[^"]*\/)?">/.test(html)) fail(`${rp}: canonical`);
  for (const m of ["og:title", "og:description", "og:image", "og:url"]) if (!html.includes(`property="${m}"`)) fail(`${rp}: ${m} yok`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || "";
  if (desc.length < 70 || desc.length > 165) fail(`${rp}: description ${desc.length}`);
  const types = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { types.push(JSON.parse(m[1])["@type"]); } catch (e) { fail(`${rp}: JSON-LD bozuk`); }
  }
  if (!types.includes("BreadcrumbList")) fail(`${rp}: BreadcrumbList yok`);
  if (rp !== "blog/index.html" && !(types.includes("BlogPosting") && types.includes("FAQPage"))) fail(`${rp}: BlogPosting/FAQPage yok`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="[^"]+"/.test(m[0])) fail(`${rp}: alt'sız görsel ${m[0].slice(0, 80)}`);
  /* h2 → h3 sırası: h2 olmadan h3 yok */
  const hs = [...html.matchAll(/<h([1-4])[\s>]/g)].map((m) => +m[1]);
  hs.forEach((h, i) => { if (i && h > hs[i - 1] + 1) fail(`${rp}: başlık atlaması h${hs[i - 1]}→h${h}`); });
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(u)) continue;
    let t = path.resolve(dir, u.split("?")[0]);
    if (u.endsWith("/") || fs.existsSync(t) && fs.statSync(t).isDirectory()) t = path.join(t, "index.html");
    if (!fs.existsSync(t)) fail(`${rp}: kırık bağlantı ${u}`);
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!html.includes(`id="${m[1]}"`)) fail(`${rp}: kırık çapa #${m[1]}`);
}
console.log(`statik: ${pages.length} sayfa`);

let pw;
try { pw = createRequire(import.meta.url)("playwright"); } catch { console.log("Playwright yok; tarayıcı testleri atlandı."); }
if (pw) {
  const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".jpg": "image/jpeg" };
  const srv = http.createServer((q, s) => {
    let f = path.join(root, decodeURIComponent(q.url.split("?")[0]));
    if (f.endsWith("/")) f += "index.html";
    fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(b); } });
  }).listen(0);
  const base = `http://127.0.0.1:${srv.address().port}/`;
  const browser = await pw.chromium.launch();
  for (const w of [320, 360, 390, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width: w, height: 860 } });
    const bad = [];
    page.on("response", (r) => { if (r.status() >= 400) bad.push(r.url()); });
    page.on("pageerror", (e) => fail(`${w}px JS hatası: ${e.message}`));
    for (const rp of pages) {
      await page.goto(base + rp.replace("index.html", ""), { waitUntil: "load" });
      const r = await page.evaluate(() => {
        const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth;
        const under = [...document.querySelectorAll("main a, main p, main li, main h1, main h2, main h3")]
          .filter((e) => getComputedStyle(e).textDecorationLine.includes("underline")).length;
        const small = [...document.querySelectorAll("main a, main button, main summary")].filter((e) => {
          const b = e.getBoundingClientRect();
          return b.width && b.height && b.height < 24 && getComputedStyle(e).display !== "inline";
        }).map((e) => e.textContent.trim().slice(0, 30));
        return { over: sw - cw, under, small };
      });
      if (r.over > 0) fail(`${w}px ${rp}: yatay taşma ${r.over}px`);
      if (r.under) fail(`${w}px ${rp}: ${r.under} altı çizili öğe`);
      if (r.small.length) fail(`${w}px ${rp}: küçük dokunma hedefi ${r.small.join(", ")}`);
    }
    if (bad.length) fail(`${w}px: 4xx/5xx kaynak ${[...new Set(bad)].join(", ")}`);
    await page.goto(base + "blog/");
    await page.click('[data-filter="karlilik"]');
    const vis = await page.$$eval(".qb-card", (cs) => cs.filter((c) => !c.hidden).length);
    if (vis !== 1) fail(`${w}px: filtre sonrası ${vis} kart (beklenen 1)`);
    await page.close();
  }
  await browser.close();
  srv.close();
  console.log("tarayıcı: 6 genişlik × " + pages.length + " sayfa");
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("blog QA: geçti");
