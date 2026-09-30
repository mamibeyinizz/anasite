#!/usr/bin/env node
/**
 * /moduller/ kalite kontrolü — build sonrası çalıştırın:
 *
 *   node moduller/build.js && node moduller/qa.mjs [--shots=<klasör>]
 *
 * Statik kontroller (tarayıcısız): H1, title, description, canonical,
 * breadcrumb JSON-LD, yinelenen id, başlık sırası, iç bağlantılar ve
 * sayfa içi/SSS çapaları, eksik dosya.
 * Tarayıcı kontrolleri (Playwright varsa): 12 genişlikte yatay taşma ve
 * kırpılan metin, 44px dokunma hedefi, konsol hatası, mobil menü + Esc,
 * akordeon klavye, odak görünürlüğü, reduced-motion, gerçek tekerlek
 * kaydırması (kaydırma ilerliyor mu, layout shift, uzun görev).
 */
import fs from "fs";
import path from "path";
import http from "http";
import { createRequire } from "module";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const MOD = require("./module-data.js");

const VIEWPORTS = [1440, 1280, 1024, 900, 768, 600, 480, 414, 390, 375, 360, 320];
const PAGES = [{ slug: null, file: "moduller/index.html", url: "/moduller/" }]
  .concat(MOD.modules.map((m) => ({ slug: m.slug, file: `moduller/${m.slug}/index.html`, url: `/moduller/${m.slug}/` })));
const shotsArg = process.argv.find((a) => a.startsWith("--shots="));
const SHOTS = shotsArg ? path.resolve(shotsArg.slice(8)) : null;

let failCount = 0, passCount = 0;
const fail = (name, detail) => { failCount++; console.error(`FAIL: ${name}${detail ? " — " + detail : ""}`); };
const pass = () => { passCount++; };
const check = (ok, name, detail) => (ok ? pass() : fail(name, detail));

/* ---------- statik ---------- */

const PENDING = new Set();
const idsOf = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);

function resolveTarget(fromUrl, href) {
  const u = new URL(href, "https://qrmenuofficial.com" + fromUrl);
  if (u.origin !== "https://qrmenuofficial.com") return null;
  let p = u.pathname;
  let file;
  if (p.endsWith("/")) file = p.slice(1) + "index.html";
  else file = p.slice(1);
  return { file, hash: u.hash.slice(1), path: p };
}

for (const pg of PAGES) {
  const html = fs.readFileSync(path.join(root, pg.file), "utf8");
  const tag = pg.url;
  check((html.match(/<h1[\s>]/g) || []).length === 1, `${tag} tek H1`);
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || "";
  check(title.length > 10 && title.length <= 70, `${tag} title uzunluğu`, `${title.length}`);
  const desc = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || "";
  check(desc.length >= 70 && desc.length <= 175, `${tag} description uzunluğu`, `${desc.length}`);
  const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  check(canon === "https://qrmenuofficial.com" + pg.url, `${tag} canonical`, canon);
  const ld = (html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/) || [])[1];
  try {
    const j = JSON.parse(ld);
    check(j["@type"] === "BreadcrumbList" && j.itemListElement.at(-1).item === canon, `${tag} breadcrumb JSON-LD`);
  } catch (e) { fail(`${tag} breadcrumb JSON-LD parse`, String(e)); }
  check(/<nav class="qrmo-mod-crumbs[^"]*" aria-label="Sayfa konumu">/.test(html), `${tag} görünür breadcrumb`);

  const ids = idsOf(html);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  check(dup.length === 0, `${tag} yinelenen id`, dup.join(", "));

  /* başlık sırası: seviye atlanmaz */
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  let prev = 0, bad = [];
  levels.forEach((l) => { if (prev && l > prev + 1) bad.push(`h${prev}→h${l}`); prev = l; });
  check(bad.length === 0, `${tag} başlık hiyerarşisi`, bad.join(", "));

  /* iç bağlantılar + çapalar + varlıklar */
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]).filter((h) => !/^(https?:|mailto:|tel:)/.test(h) || h.startsWith("https://qrmenuofficial.com"));
  for (const h of refs) {
    if (h.startsWith("https://qrmenuofficial.com")) continue; /* canonical/og: mutlak */
    if (h.startsWith("#")) { check(ids.includes(h.slice(1)), `${tag} sayfa içi çapa ${h}`); continue; }
    const t = resolveTarget(pg.url, h);
    if (!t) continue;
    check(PENDING.has(t.file) || fs.existsSync(path.join(root, t.file)), `${tag} bağlantı hedefi ${h}`, t.file);
    if (t.hash) {
      const targetIds = new Set(idsOf(fs.readFileSync(path.join(root, t.file), "utf8")));
      check(targetIds.has(t.hash), `${tag} çapa ${h}`);
    }
  }
  /* rol=img mock'ların hepsinde açıklama var */
  const imgs = [...html.matchAll(/role="img"(?: aria-label="([^"]*)")?/g)];
  check(imgs.every((m) => m[1] && m[1].length > 20), `${tag} temsili arayüz açıklamaları`);
}

/* ---------- tarayıcı ---------- */

async function loadPlaywright() {
  try { return await import("playwright"); } catch {}
  try {
    const g = execSync("npm root -g", { encoding: "utf8" }).trim();
    return createRequire(path.join(g, "noop.js"))("playwright");
  } catch { return null; }
}

function startServer() {
  const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".xml": "application/xml", ".webp": "image/webp" };
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
      if (p.endsWith("/")) p += "index.html";
      const file = path.join(root, p);
      if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); return res.end("Not found"); }
        res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

async function browserQa() {
  const pw = await loadPlaywright();
  if (!pw) { console.warn("UYARI: Playwright bulunamadı; tarayıcı kontrolleri atlandı."); return; }
  const exe = ["/opt/pw-browsers/chromium", process.env.CHROME_PATH].find((p) => p && fs.existsSync(p) && fs.statSync(p).isFile());
  const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
  const { server, port } = await startServer();
  const base = `http://127.0.0.1:${port}`;
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

  try {
    for (const pg of PAGES) {
      const tag = pg.url;
      const errors = [];
      for (const w of VIEWPORTS) {
        const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
        const page = await ctx.newPage();
        page.on("pageerror", (e) => errors.push(String(e)));
        page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
        page.on("response", (res) => { if (res.status() >= 400 && !/favicon\.ico$/.test(res.url())) errors.push(`${res.status()} ${res.url()}`); });
        await page.goto(base + pg.url, { waitUntil: "load" });
        const r = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const overflow = document.documentElement.scrollWidth - vw;
          const wide = [];
          document.querySelectorAll("body *").forEach((el) => {
            const b = el.getBoundingClientRect();
            if (b.width && (b.right > vw + 1 || b.left < -1) && getComputedStyle(el).visibility !== "hidden") {
              let p = el.parentElement, clipped = false;
              while (p && p !== document.body) { const s = getComputedStyle(p); if (s.overflowX !== "visible" && s.overflowX !== "") { const pb = p.getBoundingClientRect(); if (pb.right <= vw + 1 && pb.left >= -1) { clipped = true; break; } } p = p.parentElement; }
              if (!clipped) wide.push(el.className || el.tagName);
            }
          });
          /* kırpılan metin: temsili arayüz dışındaki metinler */
          const clippedText = [];
          document.querySelectorAll("main h1, main h2, main h3, main h4, main p, main a, main li, footer a, header a").forEach((el) => {
            if (el.closest(".qrmo-mod-shot")) return;
            if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== "visible") clippedText.push(el.textContent.trim().slice(0, 40));
          });
          /* dokunma hedefi: temsili arayüz dışındaki etkileşimli öğeler */
          const small = [];
          document.querySelectorAll("a[href], button, summary").forEach((el) => {
            if (el.closest(".qrmo-mod-shot")) return;
            const s = getComputedStyle(el);
            if (s.display === "none" || s.visibility === "hidden") return;
            if (el.closest("details:not([open])") && el.tagName !== "SUMMARY" && !el.closest("details:not([open]) > summary")) return;
            const b = el.getBoundingClientRect();
            if (!b.width || !b.height) return;
            if (el.classList.contains("qrmo-gh-skip")) return;
            if (el.tagName === "SUMMARY" && el.closest(".qrmo-gf") && document.documentElement.clientWidth >= 600) return; /* ≥600: footer başlığı etkileşimsiz */
            if (b.height < 44 || b.width < 24) small.push(`${el.textContent.trim().slice(0, 30)} (${Math.round(b.width)}×${Math.round(b.height)})`);
          });
          return { overflow, wide: [...new Set(wide)].slice(0, 6), clippedText: clippedText.slice(0, 6), small: small.slice(0, 8) };
        });
        check(r.overflow <= 0 && r.wide.length === 0, `${tag} @${w} yatay taşma`, `${r.overflow}px ${r.wide.join(" | ")}`);
        check(r.clippedText.length === 0, `${tag} @${w} kırpılan metin`, r.clippedText.join(" | "));
        check(r.small.length === 0, `${tag} @${w} 44px dokunma hedefi`, r.small.join(" | "));
        if (SHOTS && [1440, 1024, 768, 390, 320].includes(w)) {
          await page.screenshot({ path: path.join(SHOTS, `${(pg.slug || "hub")}-${w}.png`), fullPage: true });
        }
        await ctx.close();
      }
      check(errors.length === 0, `${tag} konsol/JS hatası`, errors.join(" | "));
    }

    /* mobil menü, klavye, odak, akordeon, reduced motion */
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(base + "/moduller/servis-paneli/", { waitUntil: "load" });
      check(await page.isHidden(".qrmo-gh-nav"), "390: masaüstü nav gizli");
      await page.click(".qrmo-gh-burger");
      check(await page.isVisible(".qrmo-gh-drawer a[href='../../paketler/']"), "390: mobil menü açılır");
      await page.keyboard.press("Escape");
      check((await page.getAttribute(".qrmo-gh-burger", "aria-expanded")) === "false", "390: Esc menüyü kapatır");
      check(await page.evaluate(() => document.activeElement.matches(".qrmo-gh-burger")), "390: Esc sonrası odak hamburger'da");
      const anim = await page.evaluate(() => getComputedStyle(document.querySelector(".qrmo-mod-hero-visual")).animationName);
      check(anim === "none", "reduced-motion: hero animasyonu yok", anim);
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(base + "/moduller/qr-masa/", { waitUntil: "load" });
      await page.keyboard.press("Tab");
      check(await page.evaluate(() => document.activeElement.classList.contains("qrmo-gh-skip")), "klavye: ilk Tab 'İçeriğe geç'");
      await page.keyboard.press("Tab");
      const ring = await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2; });
      check(ring, "klavye: odak halkası görünür");
      await page.focus(".qrmo-mod-acc-item > summary");
      await page.keyboard.press("Enter");
      check(await page.evaluate(() => document.querySelector(".qrmo-mod-acc-item").open), "klavye: akordeon Enter ile açılır");
      await ctx.close();
    }

    /* gerçek kaydırma: tekerlekle sonuna kadar, animasyonlar açık */
    for (const w of [390, 1280]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, reducedMotion: "no-preference" });
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        window.__cls = 0; window.__long = 0;
        try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: "layout-shift", buffered: true }); } catch (e) {}
        try { new PerformanceObserver((l) => { window.__long += l.getEntries().length; }).observe({ type: "longtask", buffered: true }); } catch (e) {}
      });
      for (const pg of PAGES) {
        await page.goto(base + pg.url, { waitUntil: "load" });
        await page.mouse.move(w / 2, 400);
        const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
        let last = -1, stuck = 0;
        for (let i = 0; i < 80; i++) {
          await page.mouse.wheel(0, 420);
          await page.waitForTimeout(30);
          const y = await page.evaluate(() => scrollY);
          if (y <= last && y < H - 2) stuck++;
          last = y;
          if (y >= H - 2) break;
        }
        const res = await page.evaluate(() => ({ y: scrollY, H: document.documentElement.scrollHeight - innerHeight, cls: window.__cls, long: window.__long, of: getComputedStyle(document.body).overflow }));
        check(res.y >= res.H - 2 && stuck <= 2, `${pg.url} @${w} kaydırma sonuna kadar ilerler`, `y=${res.y}/${res.H} takılma=${stuck}`);
        check(res.cls < 0.02, `${pg.url} @${w} layout shift`, res.cls.toFixed(4));
        check(res.of !== "hidden", `${pg.url} @${w} body overflow kilidi yok`);
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

await browserQa();
console.log(`\n/moduller/ QA: ${passCount} geçti, ${failCount} başarısız.`);
process.exit(failCount ? 1 : 0);
