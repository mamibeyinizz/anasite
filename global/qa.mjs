#!/usr/bin/env node
/**
 * Global header/footer kalite kontrolü:
 *   node global/build.mjs && node sss/build.mjs && node moduller/build.js && node global/qa.mjs
 * Statik: her sayfada gerçek <header>/<footer>/nav, href="#" yok, bağlantı hedefleri.
 * Tarayıcı (Playwright): 8 genişlikte taşma/dokunma hedefi/konsol; masaüstü mega menü;
 * mobil drawer (kaydırma kilidi, iç kaydırma, Esc, backdrop, focus trap, odak iadesi);
 * footer akordeonu; reduced-motion; JS kapalıyken kullanılabilirlik.
 */
import fs from "fs";
import path from "path";
import http from "http";
import { createRequire } from "module";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const require = createRequire(import.meta.url);
const MOD = require("../moduller/module-data.js");

const WIDTHS = [1440, 1024, 768, 390, 375, 320];

function ghHeightRange(w, h) {
  if (w >= 961 && h <= 800) return [74, 78];
  if (w <= 560) return [70, 74];
  if (w <= 960) return [76, 80];
  if (w <= 1180) return [82, 86];
  return [92, 96];
}
/* GitHub Pages proje alt dizini: tüm testler /anasite/ altında koşar */
const PREFIX = "/anasite";
const PAGES = [
  { url: "/", file: "index.html" },
  { url: "/paketler/", file: "paketler/index.html" },
  { url: "/sss/", file: "sss/index.html" },
  { url: "/sss.html", file: "sss.html" },
  { url: "/moduller/", file: "moduller/index.html" },
  ...MOD.modules.map((m) => ({ url: `/moduller/${m.slug}/`, file: `moduller/${m.slug}/index.html` }))
];

let pass = 0, failN = 0;
const check = (ok, name, d) => { if (ok) pass++; else { failN++; console.error(`FAIL: ${name}${d ? " — " + d : ""}`); } };
const notes = [];

/* ---------- statik ---------- */
for (const pg of PAGES) {
  const html = fs.readFileSync(path.join(root, pg.file), "utf8");
  check(/<header class="qrmo-gh" data-qrmo-gh>/.test(html), `${pg.file} gerçek <header>`);
  check(/<footer class="qrmo-gf" data-qrmo-gf[\s>]/.test(html), `${pg.file} gerçek <footer>`);
  check(/<nav class="qrmo-gh-nav" aria-label="Ana menü">/.test(html), `${pg.file} <nav>`);
  check(!/QRMO:(HEADER|FOOTER)"?\s*-->\s*$/.test(html) && html.includes("QRMO:HEADER:END"), `${pg.file} işaretçiler`);
  check(!/href="#"/.test(html), `${pg.file} href="#" yok`);
  check(!/(?:href|src)="\/(?!\/)/.test(html), `${pg.file} köke mutlak (/…) yol yok`, (html.match(/(?:href|src)="\/(?!\/)[^"]*/) || [""])[0]);
  check(html.includes("global/dist/qrmo-global.css") && html.includes("global/dist/qrmo-global.js"), `${pg.file} global css/js bağlı`);
  check((html.match(/<header class="qrmo-gh"/g) || []).length === 1, `${pg.file} tek global header`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  check(dup.length === 0, `${pg.file} yinelenen id`, dup.join(","));
  const skip = (html.match(/class="qrmo-gh-skip" href="#([^"]+)"/) || [])[1];
  check(skip && ids.includes(skip), `${pg.file} skip hedefi`, skip);
  /* header+footer bağlantıları */
  const seg = (html.match(/<header class="qrmo-gh"[\s\S]*?<\/header>/) || [""])[0] + (html.match(/<footer class="qrmo-gf"[\s\S]*?<\/footer>/) || [""])[0];
  const depth = pg.file.split("/").length - 1;
  const rel = "../".repeat(depth);
  for (const m of seg.matchAll(/href="([^"]*)"/g)) {
    const h = m[1];
    if (h.startsWith("#")) continue;
    let t = h === "./" ? "index.html" : h;
    if (rel && t.startsWith(rel)) t = t.slice(rel.length); else if (rel) { check(false, `${pg.file} bağlantı göreli kök`, h); continue; }
    if (t === "") t = "index.html";
    if (t.endsWith("/")) t += "index.html";
    check(fs.existsSync(path.join(root, t)), `${pg.file} bağlantı ${h}`, t);
  }
}

/* ---------- tarayıcı ---------- */
async function loadPW() {
  try { return await import("playwright"); } catch {}
  try { return createRequire(path.join(execSync("npm root -g", { encoding: "utf8" }).trim(), "x.js"))("playwright"); } catch { return null; }
}
function serve() {
  const T = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "application/javascript; charset=utf-8" };
  return new Promise((res) => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split("?")[0]);
      if (!p.startsWith(PREFIX + "/")) { r.writeHead(404); return r.end("nf"); } /* alt dizin dışı = 404 */
      p = p.slice(PREFIX.length);
      if (p.endsWith("/")) p += "index.html";
      const f = path.join(root, p);
      fs.readFile(f, (e, d) => { if (e || !f.startsWith(root)) { r.writeHead(404); return r.end("nf"); } r.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); r.end(d); });
    });
    s.listen(0, "127.0.0.1", () => res({ s, port: s.address().port }));
  });
}

const pw = await loadPW();
if (!pw) { console.warn("Playwright yok; tarayıcı kontrolleri atlandı."); }
else {
  const exe = ["/opt/pw-browsers/chromium", process.env.CHROME_PATH].find((p) => p && fs.existsSync(p) && fs.statSync(p).isFile());
  const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
  const { s, port } = await serve();
  const base = `http://127.0.0.1:${port}${PREFIX}`;
  try {
    /* 1) her sayfa × her genişlik */
    for (const pg of PAGES) {
      const errs = [];
      for (const w of WIDTHS) {
        const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
        const page = await ctx.newPage();
        page.on("pageerror", (e) => errs.push(String(e)));
        const ok = new Set();
        page.on("response", (r) => { if (r.status() >= 400 && !/favicon|assets\/product/.test(r.url())) errs.push(`${r.status()} ${r.url()}`); else if (r.status() === 200) ok.add(r.url().split("/").pop()); });
        await page.goto(base + pg.url, { waitUntil: "load" });
        const r = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const gh = document.querySelector("[data-qrmo-gh]"), gf = document.querySelector("[data-qrmo-gf]");
          const small = [];
          const scope = [...gh.querySelectorAll("a[href], button, summary"), ...gf.querySelectorAll("a[href], button, summary")];
          scope.forEach((el) => {
            const st = getComputedStyle(el); if (st.display === "none" || st.visibility === "hidden") return;
            if (el.closest(".qrmo-gh-drawer") && !gh.classList.contains("qrmo-gh--open")) return;
            if (el.classList.contains("qrmo-gh-skip")) return;
            const minH = el.classList.contains("qrmo-gh-burger") ? 42 : 44;
            if (el.tagName === "SUMMARY" && el.closest(".qrmo-gf") && vw >= 561) return; /* ≥561: başlık, etkileşimsiz */
            const b = el.getBoundingClientRect();
            if (!b.width) return;
            if (b.height < minH - 0.5) small.push(`${el.textContent.trim().slice(0, 24)} ${Math.round(b.height)}`);
          });
          const gfr = gf.getBoundingClientRect();
          return {
            overflow: document.documentElement.scrollWidth - vw,
            ghH: Math.round(gh.getBoundingClientRect().height),
            sticky: getComputedStyle(gh).position,
            gfOver: gfr.right > vw + 1 || gfr.left < -1,
            small: small.slice(0, 5),
            burger: getComputedStyle(gh.querySelector(".qrmo-gh-burger")).display,
            nav: getComputedStyle(gh.querySelector(".qrmo-gh-nav")).display,
            cta: gh.querySelector(".qrmo-gh-in > .qrmo-gh-cta") && getComputedStyle(gh.querySelector(".qrmo-gh-in > .qrmo-gh-cta")).display
          };
        });
        check(ok.has("qrmo-global.css") && ok.has("qrmo-global.js"), `${pg.url} @${w} global CSS+JS 200`, [...ok].join(","));
        const desk = w >= 961;
        const [ghMin, ghMax] = ghHeightRange(w, 900);
        check(r.overflow <= 0, `${pg.url} @${w} yatay taşma`, `${r.overflow}px`);
        check(!r.gfOver, `${pg.url} @${w} footer taşması`);
        check(r.sticky === "sticky", `${pg.url} @${w} sticky`);
        check(r.ghH >= ghMin && r.ghH <= ghMax, `${pg.url} @${w} header yüksekliği (V3)`, String(r.ghH));
        check(
          desk
            ? (r.nav !== "none" && r.burger === "none" && /flex$/.test(r.cta))
            : (r.nav === "none" && r.burger !== "none"),
          `${pg.url} @${w} desktop/mobil geçişi`,
          JSON.stringify(r)
        );
        check(r.small.length === 0, `${pg.url} @${w} 44px hedef`, r.small.join("|"));
        const cssLoaded = await page.evaluate(() => getComputedStyle(document.querySelector("[data-qrmo-gh]")).position === "sticky" && document.documentElement.classList.contains("qrmo-gh-js"));
        check(cssLoaded, `${pg.url} @${w} CSS uygulandı, JS bayrağı`);
        await ctx.close();
      }
      check(errs.length === 0, `${pg.url} konsol/JS/404`, errs.join(" | "));
    }

    /* 2) masaüstü: V3 nav + drawer çözüm linkleri */
    {
      const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(base + "/moduller/qr-masa/", { waitUntil: "load" });
      check(await page.isVisible(".qrmo-gh-nav"), "1200: masaüstü nav görünür");
      check((await page.textContent(".qrmo-gh-in > .qrmo-gh-cta")).includes("Görüşme Talep Edin"), "1200: gold CTA metni");
      const solHrefs = await page.$$eval(".qrmo-gh-d-sol", (a) => a.map((x) => x.getAttribute("href")));
      check(solHrefs.includes("../../moduller/restoran-menu/") && solHrefs.includes("../../moduller/menu-asistani/"), "1200: drawer çözüm kartları gerçek modül URL'leri", solHrefs.join(","));
      await page.goto(base + "/", { waitUntil: "load" });
      const order = [];
      for (let i = 0; i < 9; i++) {
        await page.keyboard.press("Tab");
        order.push(await page.evaluate(() => (document.activeElement.textContent || document.activeElement.className).trim().slice(0, 28)));
      }
      check(
        order[0] === "İçeriğe geç" &&
          order.some((x) => x.includes("Ana Sayfa")) &&
          order.some((x) => x.includes("Çözümler")) &&
          order.some((x) => x.includes("Paketler")) &&
          order.some((x) => x.includes("Canlı Menü")) &&
          order.some((x) => x.includes("Bize Ulaşın")),
        "klavye Tab sırası (V3 nav)",
        order.join(" > ")
      );
      await ctx.close();
    }

    /* 3) mobil drawer */
    {
      const ctx = await browser.newContext({ viewport: { width: 375, height: 560 }, hasTouch: true });
      const page = await ctx.newPage();
      await page.goto(base + "/moduller/servis-paneli/", { waitUntil: "load" });
      await page.evaluate(() => scrollTo(0, 500));
      const y0 = await page.evaluate(() => scrollY);
      await page.click(".qrmo-gh-burger");
      check((await page.getAttribute(".qrmo-gh-burger", "aria-expanded")) === "true", "375: drawer açılır");
      check(await page.evaluate(() => getComputedStyle(document.documentElement).overflow === "hidden" && getComputedStyle(document.body).overflow === "hidden"), "375: html+body kaydırma kilidi");
      await page.mouse.move(200, 400);
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(150);
      const y1 = await page.evaluate(() => scrollY);
      check(y1 === y0, "375: drawer açıkken arka plan kaydırılmaz", `${y0}→${y1}`);
      check(await page.evaluate(() => getComputedStyle(document.querySelector(".qrmo-gh-drawer")).touchAction === "pan-y"), "375: touch-action pan-y (none değil)");
      /* iç kaydırma: zengin drawer taşar → kendi içinde kayar */
      const sc = await page.evaluate(() => {
        const d = document.querySelector(".qrmo-gh-drawer");
        return { over: d.scrollHeight > d.clientHeight, oy: getComputedStyle(d).overflowY };
      });
      check(sc.over && sc.oy === "auto", "375: drawer içeriği taşınca kendi içinde kaydırılabilir", JSON.stringify(sc));
      await page.mouse.move(200, 300);
      await page.mouse.wheel(0, 400); await page.waitForTimeout(200);
      check((await page.evaluate(() => document.querySelector(".qrmo-gh-drawer").scrollTop)) > 0, "375: drawer wheel ile kayar");
      check((await page.evaluate(() => scrollY)) === y0, "375: iç kaydırma sayfayı kaydırmaz");
      const ctaReach = await page.evaluate(() => {
        const d = document.querySelector(".qrmo-gh-drawer");
        const c = document.querySelector(".qrmo-gh-cta--drawer");
        d.scrollTop = d.scrollHeight;
        const b = c.getBoundingClientRect();
        return b.top < innerHeight && b.bottom > 0;
      });
      check(ctaReach, "375: drawer alt CTA kaydırma ile erişilebilir");
      /* focus trap */
      const inside = [];
      for (let i = 0; i < 40; i++) { await page.keyboard.press("Tab"); inside.push(await page.evaluate(() => !!(document.activeElement.closest(".qrmo-gh-drawer") || document.activeElement.classList.contains("qrmo-gh-burger")))); }
      check(inside.every(Boolean), "375: focus trap (40 Tab drawer dışına çıkmaz)");
      const sinside = [];
      for (let i = 0; i < 12; i++) { await page.keyboard.press("Shift+Tab"); sinside.push(await page.evaluate(() => !!(document.activeElement.closest(".qrmo-gh-drawer") || document.activeElement.classList.contains("qrmo-gh-burger")))); }
      check(sinside.every(Boolean), "375: focus trap ters yön");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(350);
      check(
        (await page.getAttribute(".qrmo-gh-burger", "aria-expanded")) === "false" &&
          (await page.getAttribute(".qrmo-gh-drawer", "aria-hidden")) === "true",
        "375: Esc kapatır"
      );
      check(await page.evaluate(() => document.activeElement.classList.contains("qrmo-gh-burger")), "375: kapanınca odak hamburger'da");
      check(await page.evaluate(() => getComputedStyle(document.documentElement).overflow !== "hidden"), "375: kapanınca kaydırma serbest");
      const yc = await page.evaluate(() => scrollY);
      await page.mouse.move(200, 300); await page.mouse.wheel(0, 300); await page.waitForTimeout(300);
      check((await page.evaluate(() => scrollY)) > yc, "375: kapanınca sayfa kayar", `${yc}→${await page.evaluate(() => scrollY)}`);
      /* backdrop */
      await page.click(".qrmo-gh-burger");
      await page.mouse.click(5, 550, { delay: 10 }).catch(() => {});
      /* 375'te drawer tam genişlik: backdrop tıklamasını 601+ genişlikte dene */
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({ viewport: { width: 768, height: 800 } });
      const page = await ctx.newPage();
      await page.goto(base + "/", { waitUntil: "load" });
      await page.click(".qrmo-gh-burger");
      await page.waitForFunction(() => document.querySelector("[data-qrmo-gh]").classList.contains("qrmo-gh--open"));
      await page.evaluate(() => document.querySelector("[data-qrmo-gh-backdrop]").click());
      check((await page.getAttribute(".qrmo-gh-burger", "aria-expanded")) === "false", "768: backdrop tıklaması kapatır");
      check(await page.evaluate(() => document.activeElement.classList.contains("qrmo-gh-burger")), "768: backdrop sonrası odak hamburger'da");
      await page.click(".qrmo-gh-burger");
      await page.setViewportSize({ width: 1100, height: 800 });
      await page.waitForTimeout(150);
      check((await page.evaluate(() => getComputedStyle(document.documentElement).overflow)) !== "hidden", "768→1300: drawer kapanır, kilit kalkar");
      await ctx.close();
    }

    /* 4) footer akordeon */
    {
      const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
      const page = await ctx.newPage();
      await page.goto(base + "/paketler/", { waitUntil: "load" });
      const open0 = await page.$$eval(".qrmo-gf-col", (c) => c.filter((d) => d.open).length);
      check(open0 === 1, "375: footer ilk kolon açık başlar (V4)", String(open0));
      await page.click(".qrmo-gf-col:nth-child(2) > summary");
      check((await page.$$eval(".qrmo-gf-col", (c) => c.filter((d) => d.open).length)) >= 2, "375: footer akordeon tıkla açılır");
      await page.setViewportSize({ width: 700, height: 800 }); await page.waitForTimeout(100);
      check((await page.$$eval(".qrmo-gf-col", (c) => c.filter((d) => d.open).length)) === 6, "700: footer kolonları hep açık");
      await ctx.close();
    }

    /* 5) reduced-motion + JS kapalı */
    {
      const ctx = await browser.newContext({ viewport: { width: 375, height: 800 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(base + "/", { waitUntil: "load" });
      const t = await page.evaluate(() => ["qrmo-gh-drawer", "qrmo-gh-backdrop", "qrmo-gh-cta"].map((c) => getComputedStyle(document.querySelector("." + c)).transitionDuration + "/" + getComputedStyle(document.querySelector("." + c)).animationName));
      check(t.every((x) => /^0(\.0+)?s\/none$/.test(x) || x.startsWith("0.00001s/none") || x.startsWith("1e-05s/none")), "reduced-motion: geçiş/animasyon yok", t.join(","));
      await ctx.close();
      const c2 = await browser.newContext({ viewport: { width: 375, height: 800 }, javaScriptEnabled: false });
      const p2 = await c2.newPage();
      await p2.goto(base + "/moduller/", { waitUntil: "load" });
      check(await p2.isHidden(".qrmo-gh-burger") && await p2.isVisible(".qrmo-gh-drawer a[href='../paketler/']"), "JS kapalı: menü statik listelenir");
      check(await p2.evaluate(() => getComputedStyle(document.querySelector("[data-qrmo-gh]")).position === "static"), "JS kapalı: başlık sabit değil");
      check((await p2.$$eval(".qrmo-gf-col", (c) => c.every((d) => d.open))), "JS kapalı: footer açık");
      await c2.close();
    }
  } finally { await browser.close(); s.close(); }
}
console.log(`\nGlobal header/footer QA: ${pass} geçti, ${failN} başarısız.`);
if (notes.length) console.log("Notlar (bilinçli açık hedefler):", [...new Set(notes)].join("; "));
process.exit(failN ? 1 : 0);
