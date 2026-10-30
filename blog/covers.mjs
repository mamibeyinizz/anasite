#!/usr/bin/env node
/* =========================================================
   BLOG KAPAK GÖRSELLERİ — özgün, marka renkleriyle çizilmiş SVG sahneler.
   Lisans: QR Menu Official'a ait özgün çalışma (üçüncü taraf görsel yok).
   Kullanım: node blog/covers.mjs  (Playwright + ImageMagick gerekir)
   Çıktı: assets/blog/<slug>-1200.webp, <slug>-720.webp, <slug>-og.jpg (Open Graph)
========================================================= */
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../assets/blog");
const G = "#0D2B22", G2 = "#173226", G3 = "#24493A", AU = "#C9A84C", AU2 = "#E8C766", CR = "#F4F1E8";

const frame = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<defs>
  <radialGradient id="glow" cx="78%" cy="18%" r="70%"><stop offset="0" stop-color="${AU}" stop-opacity=".22"/><stop offset=".55" stop-color="${AU}" stop-opacity="0"/></radialGradient>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${G2}"/><stop offset="1" stop-color="${G}"/></linearGradient>
  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="${CR}" fill-opacity=".07"/></pattern>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/><rect width="1200" height="630" fill="url(#dots)"/><rect width="1200" height="630" fill="url(#glow)"/>
${inner}</svg>`;

/* sabit tohumlu QR benzeri desen (gerçek kod değildir, okutulamaz) */
function qr(x, y, s, n = 21, seed = 7, fg = G) {
  let r = seed, cells = "";
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  const finder = (i, j) => (i < 7 && j < 7) || (i < 7 && j >= n - 7) || (i >= n - 7 && j < 7);
  const c = s / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (!finder(i, j) && rnd() > 0.52) cells += `<rect x="${x + j * c}" y="${y + i * c}" width="${c}" height="${c}"/>`;
  const f = (fx, fy) => `<rect x="${fx}" y="${fy}" width="${7 * c}" height="${7 * c}" fill="${fg}"/><rect x="${fx + c}" y="${fy + c}" width="${5 * c}" height="${5 * c}" fill="#fff"/><rect x="${fx + 2 * c}" y="${fy + 2 * c}" width="${3 * c}" height="${3 * c}" fill="${fg}"/>`;
  return `<g fill="${fg}">${cells}</g>${f(x, y)}${f(x + (n - 7) * c, y)}${f(x, y + (n - 7) * c)}`;
}
const phone = (x, y, w, h, inner) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="38" fill="#0A1F18" stroke="${AU}" stroke-opacity=".55" stroke-width="2"/><rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}" rx="28" fill="${CR}"/><rect x="${x + w / 2 - 34}" y="${y + 22}" width="68" height="8" rx="4" fill="#0A1F18" fill-opacity=".8"/>${inner}</g>`;
const card = (x, y, w, h, fill = "#FFFDF8") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}"/>`;
const bar = (x, y, w, o = 1, c = G) => `<rect x="${x}" y="${y}" width="${w}" height="10" rx="5" fill="${c}" fill-opacity="${o}"/>`;

const SCENES = {
  "qr-menu-nedir": frame(`
    <g transform="translate(150 150)"><rect width="360" height="400" rx="26" fill="${CR}"/><rect x="0" y="330" width="360" height="70" rx="0" fill="${AU}" fill-opacity=".9"/><text x="180" y="374" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="26" fill="${G}" letter-spacing="3">MASA 12</text>
    <rect x="50" y="34" width="260" height="260" rx="12" fill="#fff"/>${qr(70, 54, 220, 25, 11)}</g>
    <path d="M540 350 C 620 300, 660 300, 720 330" stroke="${AU2}" stroke-width="3" fill="none" stroke-dasharray="2 12" stroke-linecap="round"/>
    ${phone(760, 80, 290, 500, `${card(790, 140, 230, 120, G)}<circle cx="840" cy="200" r="28" fill="${AU}"/>${bar(885, 185, 110, 0.85, CR)}${bar(885, 207, 80, 0.5, CR)}
      ${[0, 1, 2].map((i) => `${card(790, 280 + i * 92, 230, 78)}<rect x="802" y="${292 + i * 92}" width="54" height="54" rx="10" fill="${AU}" fill-opacity="${0.35 + i * 0.2}"/>${bar(870, 300 + i * 92, 110, 0.75)}${bar(870, 322 + i * 92, 70, 0.35)}`).join("")}`)}`),

  "karekod-fiyat-listesi-yonetmeligi": frame(`
    <g transform="translate(140 110)"><rect width="430" height="420" rx="22" fill="${CR}"/><rect width="430" height="78" rx="22" fill="${AU}"/><rect y="50" width="430" height="28" fill="${AU}"/>
    <text x="215" y="50" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="26" fill="${G}" letter-spacing="4">FİYAT LİSTESİ</text>
    ${[0, 1, 2, 3, 4, 5].map((i) => `${bar(40, 120 + i * 46, 210, 0.75)}<rect x="300" y="${120 + i * 46}" width="90" height="10" rx="5" fill="${G}" fill-opacity=".45"/>`).join("")}</g>
    <g transform="translate(700 190)"><rect width="300" height="330" rx="22" fill="#FFFDF8"/><rect x="40" y="30" width="220" height="220" rx="10" fill="#fff" stroke="${G}" stroke-opacity=".12"/>${qr(54, 44, 192, 23, 29)}
    <rect x="70" y="272" width="160" height="34" rx="17" fill="${G}"/><text x="150" y="295" text-anchor="middle" font-family="Segoe UI,sans-serif" font-weight="700" font-size="16" fill="${CR}">Okut</text></g>
    <g transform="translate(980 120)"><circle r="46" fill="${AU}"/><path d="M-20 0 l14 15 l28 -30" stroke="${G}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`),

  "menu-muhendisligi-nedir": frame(`
    <g transform="translate(330 70)">
      <rect width="540" height="490" rx="24" fill="${CR}" fill-opacity=".06" stroke="${AU}" stroke-opacity=".35"/>
      <rect x="20" y="20" width="240" height="215" rx="16" fill="${G3}"/><rect x="280" y="20" width="240" height="215" rx="16" fill="${AU}"/>
      <rect x="20" y="255" width="240" height="215" rx="16" fill="${G3}" fill-opacity=".55"/><rect x="280" y="255" width="240" height="215" rx="16" fill="${CR}"/>
      <path d="M400 92 l18 38 42 5 -31 29 8 41 -37 -20 -37 20 8 -41 -31 -29 42 -5z" fill="${G}"/>
      <g fill="${CR}" fill-opacity=".9"><rect x="95" y="105" width="90" height="56" rx="18"/><rect x="104" y="150" width="12" height="40" rx="5"/><rect x="164" y="150" width="12" height="40" rx="5"/><rect x="170" y="78" width="26" height="46" rx="10" transform="rotate(25 183 101)"/></g>
      <text x="400" y="400" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="120" fill="${G}">?</text>
      <g fill="${CR}" fill-opacity=".75"><ellipse cx="140" cy="370" rx="48" ry="40"/><ellipse cx="102" cy="346" rx="14" ry="26" transform="rotate(-20 102 346)"/><ellipse cx="178" cy="346" rx="14" ry="26" transform="rotate(20 178 346)"/></g>
    </g>
    <path d="M300 560 V 70" stroke="${AU2}" stroke-width="3"/><path d="M300 560 H 900" stroke="${AU2}" stroke-width="3"/>
    <path d="M300 62 l-9 16 h18z M908 560 l-16 -9 v18z" fill="${AU2}"/>`),

  "dijital-menu-nasil-hazirlanir": frame(`
    <g transform="translate(120 130)"><rect width="440" height="380" rx="18" fill="#FFFDF8"/>
      <rect width="440" height="54" rx="18" fill="${G3}"/><rect y="36" width="440" height="18" fill="${G3}"/>
      ${["Kategori", "Ürün", "Fiyat"].map((t, i) => `<text x="${24 + i * 150}" y="34" font-family="Segoe UI,sans-serif" font-weight="700" font-size="16" fill="${CR}">${t}</text>`).join("")}
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="0" y="${70 + i * 50}" width="440" height="1" fill="${G}" fill-opacity=".1"/>${bar(24, 88 + i * 50, 90, 0.4)}${bar(174, 88 + i * 50, 120, 0.7)}${bar(324, 88 + i * 50, 60, 0.55, AU)}`).join("")}</g>
    <path d="M590 320 h80" stroke="${AU2}" stroke-width="4" stroke-linecap="round"/><path d="M664 306 l16 14 -16 14" stroke="${AU2}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${phone(730, 70, 300, 510, `${["Kahve", "Tatlı", "Kahvaltı"].map((t, i) => `<rect x="${758 + i * 82}" y="128" width="74" height="30" rx="15" fill="${i === 0 ? G : "#fff"}" stroke="${G}" stroke-opacity=".2"/><text x="${795 + i * 82}" y="148" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="13" font-weight="700" fill="${i === 0 ? CR : G}">${t}</text>`).join("")}
      ${[0, 1].map((r) => [0, 1].map((c) => `${card(760 + c * 124, 178 + r * 190, 112, 174)}<rect x="${770 + c * 124}" y="${188 + r * 190}" width="92" height="84" rx="10" fill="${AU}" fill-opacity="${0.35 + (r + c) * 0.15}"/>${bar(770 + c * 124, 286 + r * 190, 80, 0.75)}${bar(770 + c * 124, 306 + r * 190, 50, 0.35)}<rect x="${770 + c * 124}" y="${326 + r * 190}" width="46" height="16" rx="8" fill="${G}"/>`).join("")).join("")}`)}`),

  "garson-cagirma-sistemi": frame(`
    <g transform="translate(110 100)"><rect width="640" height="430" rx="22" fill="#0A1F18" stroke="${AU}" stroke-opacity=".4"/><rect x="18" y="18" width="604" height="394" rx="14" fill="${CR}"/>
      ${bar(46, 46, 150, 0.85)}<circle cx="584" cy="51" r="10" fill="${AU}"/>
      ${[["Masa 4", "Garson", AU], ["Masa 9", "Hesap", G3], ["Masa 2", "Sipariş", G], ["Masa 11", "Garson", AU]].map(([m, t, c], i) => {
        const x = 46 + (i % 2) * 284, y = 92 + Math.floor(i / 2) * 150;
        return `${card(x, y, 264, 128)}<rect x="${x}" y="${y}" width="8" height="128" rx="4" fill="${c}"/><text x="${x + 28}" y="${y + 46}" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="28" fill="${G}">${m}</text><rect x="${x + 28}" y="${y + 70}" width="${t.length * 13 + 30}" height="32" rx="16" fill="${c}" fill-opacity=".2"/><text x="${x + 43}" y="${y + 92}" font-family="Segoe UI,sans-serif" font-weight="700" font-size="17" fill="${G}">${t}</text>`;
      }).join("")}</g>
    <g transform="translate(940 300)"><circle r="120" fill="${AU}" fill-opacity=".14"/><circle r="84" fill="${AU}" fill-opacity=".22"/>
      <path d="M-46 30 h92 l-12 -16 v-34 a34 34 0 0 0 -68 0 v34z" fill="${AU2}"/><circle cy="44" r="12" fill="${AU2}"/><rect x="-6" y="-70" width="12" height="16" rx="6" fill="${AU2}"/>
      <path d="M70 -60 q22 22 0 44 M92 -80 q38 42 0 84" stroke="${AU2}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`)
};

export function coverSvg(slug) { return SCENES[slug]; }

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const require = createRequire(import.meta.url);
  const { chromium } = require("playwright");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const [slug, svg] of Object.entries(SCENES)) {
    await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
    const png = path.join(out, `${slug}.png`);
    await page.screenshot({ path: png, clip: { x: 0, y: 0, width: 1200, height: 630 } });
    execFileSync("convert", [png, "-strip", "-quality", "80", "-define", "webp:method=6", path.join(out, `${slug}-1200.webp`)]);
    execFileSync("convert", [png, "-strip", "-resize", "720x378", "-quality", "78", "-define", "webp:method=6", path.join(out, `${slug}-720.webp`)]);
    execFileSync("convert", [png, "-strip", "-quality", "82", "-interlace", "Plane", path.join(out, `${slug}-og.jpg`)]);
    fs.unlinkSync(png);
    console.log("kapak:", slug);
  }
  await browser.close();
}
