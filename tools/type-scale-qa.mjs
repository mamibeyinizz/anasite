#!/usr/bin/env node
/* Tipografi ölçeği denetimi: görünen her metnin font-size/font-weight değeri
   global/src/type-scale.css token'larındaki değerlerden biri olmalı.
   Kapsam dışı: açılış ekranı (.qrmo-splash) ve ürün ekranı maketleri.
   Kullanım:  node tools/type-scale-qa.mjs [http://localhost:8123] [/yol/ /baska/]
   Gerekir: Playwright. Statik sunucu: python3 -m http.server 8123 (repo kökünde).
   Yeni sayfa eklendiğinde PAGES listesine yolunu ekle. */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");

const BASE = process.argv[2] || "http://localhost:8123";
const PAGES = process.argv.slice(3).length ? process.argv.slice(3) : [
  "/", "/paketler/", "/moduller/", "/moduller/akilli-filtreleme/", "/moduller/coklu-dil/",
  "/moduller/masa-oturum-guvenligi/", "/moduller/menu-asistani/", "/moduller/menu-muhendisligi/",
  "/moduller/qr-analytics/", "/moduller/qr-masa/", "/moduller/restoran-menu/", "/moduller/servis-paneli/",
  "/moduller/yorum-geri-bildirim/", "/blog/", "/blog/dijital-menu-nasil-hazirlanir/",
  "/blog/garson-cagirma-sistemi/", "/blog/karekod-fiyat-listesi-yonetmeligi/",
  "/blog/menu-muhendisligi-nedir/", "/blog/qr-menu-nedir/", "/canli-menu/", "/iletisim/", "/sss/",
  "/gizlilik/", "/kullanim-sartlari/", "/cerez-politikasi/"
];
const VIEWPORTS = [["mobil", 390, 844], ["tablet", 820, 1100], ["masaüstü", 1440, 900]];
const MOCK = "[class*=phone],[class*=mock],[class*=device],[class*=screen],[class*=mini],[class*=demo-ui],[class*=hubui],[class*=hubviz],[class*=-viz-],[class*=cue--lang],[class*=qm-lcard],[class*=qm-stage],[class*=qm-ui],[class*=__visual],[class*=__demo],[class*=-demo__],[class*=final-cta-v1__panel],[class*=final-cta-v1__chip]";
const OK_WEIGHTS = new Set(["400", "500", "700", "800"]);

const browser = await chromium.launch();
let bad = 0;
const agg = new Map();
for (const [vn, w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  for (const p of PAGES) {
    const pg = await ctx.newPage();
    await pg.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
    await pg.goto(BASE + p, { waitUntil: "load" });
    await pg.waitForTimeout(500);
    const H = await pg.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 700) { await pg.evaluate((y) => scrollTo(0, y), y); await pg.waitForTimeout(25); }
    const res = await pg.evaluate((MOCK) => {
      const rs = getComputedStyle(document.documentElement);
      const sizes = new Set(), weights = new Set();
      for (const r of ["display","h1","h2","h3","h4","lead","body","bodyb","btn","link","form","eyebrow","cap","capb"]) {
        sizes.add(parseFloat(rs.getPropertyValue("--ts-fs-" + r)));
      }
      const off = []; const seen = new Set();
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
      while ((n = tw.nextNode())) {
        const t = n.nodeValue.trim(); const el = n.parentElement;
        if (!t || !el || seen.has(el) || ["SCRIPT","STYLE","NOSCRIPT","TEMPLATE","OPTION"].includes(el.tagName)) continue;
        if (el.closest(".qrmo-splash," + MOCK)) continue;
        const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
        const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
        seen.add(el);
        const s = parseFloat(cs.fontSize);
        if (!sizes.has(s) || !["400","500","700","800"].includes(cs.fontWeight)) {
          let lab = el.tagName.toLowerCase() + "." + [...el.classList].slice(0, 2).join(".");
          if (!el.classList.length) { const a = el.parentElement?.closest("[class]"); if (a) lab = "." + [...a.classList].slice(0, 2).join(".") + " " + el.tagName.toLowerCase(); }
          off.push(`${s}px/${cs.fontWeight} ${lab} “${t.slice(0, 24)}”`);
        }
      }
      return { off, sizes: [...sizes] };
    }, MOCK);
    if (res.off.length) {
      bad += res.off.length; console.log(`✗ ${vn} ${p}  (${res.off.length})`);
      res.off.slice(0, 12).forEach((o) => console.log("   " + o));
      for (const o of res.off) { const k = `${vn} ${o.split(" “")[0]}`; agg.set(k, (agg.get(k) || 0) + 1); }
    }
    await pg.close();
  }
  await ctx.close();
}
await browser.close();
if (process.env.QA_SUMMARY) [...agg].sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(String(n).padStart(4), k));
console.log(bad ? `\n${bad} ölçek dışı metin.` : "Tüm metinler ölçekte.");
process.exit(bad ? 1 : 0);
