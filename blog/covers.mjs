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
      <path d="M70 -60 q22 22 0 44 M92 -80 q38 42 0 84" stroke="${AU2}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`),
  "restoran-fiyat-artisi-menuye-nasil-yansitilir": frame(`
    <g transform="translate(130 120)"><rect width="400" height="400" rx="22" fill="${CR}"/><rect width="400" height="70" rx="22" fill="${G3}"/><rect y="48" width="400" height="22" fill="${G3}"/>
      <text x="200" y="46" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="24" fill="${CR}" letter-spacing="3">MENÜ</text>
      ${[0, 1, 2, 3, 4].map((i) => `${bar(36, 112 + i * 56, 190, 0.7)}<rect x="270" y="${104 + i * 56}" width="96" height="26" rx="13" fill="${i === 1 ? AU : G}" fill-opacity="${i === 1 ? 1 : 0.15}"/>`).join("")}</g>
    <g transform="translate(600 140)"><rect width="460" height="360" rx="22" fill="${CR}" fill-opacity=".06" stroke="${AU}" stroke-opacity=".35"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${40 + i * 66}" y="${300 - (40 + i * 34)}" width="40" height="${40 + i * 34}" rx="8" fill="${i === 5 ? AU : G3}"/>`).join("")}
      <path d="M50 250 L 116 222 L 182 196 L 248 160 L 314 128 L 400 70" stroke="${AU2}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M400 70 l-24 4 m24 -4 l-6 23" stroke="${AU2}" stroke-width="5" stroke-linecap="round"/></g>`),

  "garson-eksikligi-az-personelle-servis": frame(`
    <g transform="translate(120 140)">${[0, 1, 2, 3, 4, 5].map((i) => { const x = (i % 3) * 150, y = Math.floor(i / 3) * 190;
      return `<circle cx="${x + 60}" cy="${y + 70}" r="52" fill="${G3}"/><circle cx="${x + 60}" cy="${y + 70}" r="30" fill="${CR}" fill-opacity=".9"/><text x="${x + 60}" y="${y + 78}" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="22" fill="${G}">${i + 1}</text>${i === 1 || i === 4 ? `<circle cx="${x + 100}" cy="${y + 28}" r="14" fill="${AU}"/>` : ""}`; }).join("")}</g>
    ${phone(720, 70, 300, 510, `${bar(752, 128, 120, 0.85)}${[0, 1, 2].map((i) => `${card(752, 160 + i * 112, 236, 96)}<rect x="752" y="${160 + i * 112}" width="8" height="96" rx="4" fill="${i === 2 ? G3 : AU}"/><text x="776" y="${200 + i * 112}" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="22" fill="${G}">Masa ${[2, 5, 4][i]}</text>${bar(776, 220 + i * 112, 110, 0.35)}`).join("")}`)}`),

  "restoran-google-yorumlari-nasil-artirilir": frame(`
    ${phone(170, 70, 300, 510, `${[0, 1, 2].map((i) => `${card(200, 130 + i * 140, 240, 120)}<circle cx="236" cy="${166 + i * 140}" r="18" fill="${AU}" fill-opacity="${0.4 + i * 0.2}"/>${bar(266, 156 + i * 140, 120, 0.7)}${[0, 1, 2, 3, 4].map((k) => `<path transform="translate(${218 + k * 30} ${200 + i * 140}) scale(.55)" d="M20 0 l6 13 14 2 -10 10 2 14 -12 -7 -12 7 2 -14 -10 -10 14 -2z" fill="${k < 5 - (i === 2 ? 1 : 0) ? AU : G}" fill-opacity="${k < 5 - (i === 2 ? 1 : 0) ? 1 : 0.2}"/>`).join("")}${bar(218, 230 + i * 140, 160, 0.25)}`).join("")}`)}
    <g transform="translate(600 170)"><path transform="translate(120 -40) scale(4)" d="M20 0 l6 13 14 2 -10 10 2 14 -12 -7 -12 7 2 -14 -10 -10 14 -2z" fill="${AU2}"/>
      ${[0, 1, 2, 3, 4].map((k) => `<path transform="translate(${10 + k * 76} 170) scale(1.6)" d="M20 0 l6 13 14 2 -10 10 2 14 -12 -7 -12 7 2 -14 -10 -10 14 -2z" fill="${AU}"/>`).join("")}
      ${bar(10, 270, 300, 0.35, CR)}${bar(10, 296, 220, 0.2, CR)}</g>`),

  "google-isletme-profili-restoran-yerel-seo": frame(`
    <g transform="translate(110 90)"><rect width="560" height="450" rx="22" fill="${G3}" fill-opacity=".55"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M0 ${80 + i * 90} H560" stroke="${CR}" stroke-opacity=".08" stroke-width="18"/>`).join("")}
      ${[0, 1, 2, 3].map((i) => `<path d="M${90 + i * 130} 0 V450" stroke="${CR}" stroke-opacity=".08" stroke-width="14"/>`).join("")}
      <g transform="translate(280 210)"><path d="M0 -110 a70 70 0 0 1 70 70 c0 52 -70 120 -70 120 s-70 -68 -70 -120 a70 70 0 0 1 70 -70z" fill="${AU}"/><circle cy="-40" r="28" fill="${G}"/></g></g>
    <g transform="translate(720 150)"><rect width="370" height="330" rx="20" fill="${CR}"/><rect x="24" y="24" width="322" height="110" rx="12" fill="${AU}" fill-opacity=".45"/>
      <text x="24" y="176" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="26" fill="${G}">Restoran</text>
      ${[0, 1, 2, 3, 4].map((k) => `<path transform="translate(${24 + k * 28} 194) scale(.55)" d="M20 0 l6 13 14 2 -10 10 2 14 -12 -7 -12 7 2 -14 -10 -10 14 -2z" fill="${AU}"/>`).join("")}
      ${bar(24, 236, 230, 0.4)}${bar(24, 260, 170, 0.25)}<rect x="24" y="286" width="120" height="30" rx="15" fill="${G}"/><rect x="156" y="286" width="120" height="30" rx="15" fill="${G}" fill-opacity=".15"/></g>`),

  "turist-icin-cok-dilli-menu": frame(`
    <g transform="translate(140 150)">${["TR", "EN", "DE", "AR"].map((t, i) => `<rect x="${(i % 2) * 190}" y="${Math.floor(i / 2) * 170}" width="170" height="150" rx="20" fill="${i === 1 ? AU : G3}"/><text x="${(i % 2) * 190 + 85}" y="${Math.floor(i / 2) * 170 + 92}" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="46" fill="${i === 1 ? G : CR}">${t}</text>`).join("")}</g>
    ${phone(730, 70, 300, 510, `<rect x="758" y="122" width="244" height="40" rx="20" fill="#fff" stroke="${G}" stroke-opacity=".2"/><text x="780" y="148" font-family="Segoe UI,sans-serif" font-weight="700" font-size="15" fill="${G}">English</text><path d="M975 136 l8 8 8 -8" stroke="${G}" stroke-width="3" fill="none"/>
      ${[0, 1, 2].map((i) => `${card(758, 182 + i * 120, 244, 104)}<rect x="770" y="${194 + i * 120}" width="80" height="80" rx="12" fill="${AU}" fill-opacity="${0.35 + i * 0.2}"/>${bar(864, 204 + i * 120, 110, 0.75)}${bar(864, 226 + i * 120, 90, 0.35)}${bar(864, 248 + i * 120, 60, 0.35)}`).join("")}`)}`),

  "restoran-menude-alerjen-bilgisi": frame(`
    <g transform="translate(130 120)"><rect width="440" height="400" rx="22" fill="${CR}"/>
      ${[0, 1, 2, 3].map((i) => `${bar(36, 48 + i * 90, 210, 0.75)}${bar(36, 72 + i * 90, 150, 0.3)}${[0, 1, 2].slice(0, 1 + (i % 3)).map((k) => `<circle cx="${300 + k * 40}" cy="${60 + i * 90}" r="16" fill="${[AU, G3, G][k]}" fill-opacity=".85"/>`).join("")}`).join("")}</g>
    <g transform="translate(680 140)">${[["Gluten", AU], ["Süt", CR], ["Yumurta", AU2], ["Fıstık", G3]].map(([t, c], i) => `<g transform="translate(${(i % 2) * 210} ${Math.floor(i / 2) * 190})"><circle cx="90" cy="80" r="74" fill="${c}" fill-opacity="${c === CR ? 0.9 : 0.85}"/><text x="90" y="88" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="24" fill="${c === G3 ? CR : G}">${t}</text></g>`).join("")}</g>`),

  "menude-olmayan-urun-aramalari": frame(`
    <g transform="translate(130 120)"><rect width="520" height="80" rx="40" fill="${CR}"/><circle cx="52" cy="40" r="16" fill="none" stroke="${G}" stroke-width="5"/><path d="M64 52 l14 14" stroke="${G}" stroke-width="5" stroke-linecap="round"/>
      <text x="100" y="50" font-family="Segoe UI,sans-serif" font-weight="700" font-size="26" fill="${G}">milkshake</text>
      ${[0, 1, 2, 3].map((i) => `${card(0, 120 + i * 74, 520, 60, i === 0 ? "#FFFDF8" : "#FFFDF8")}${bar(28, 145 + i * 74, [200, 160, 230, 140][i], 0.7)}<rect x="430" y="${136 + i * 74}" width="60" height="28" rx="14" fill="${AU}" fill-opacity="${1 - i * 0.2}"/><text x="460" y="${156 + i * 74}" text-anchor="middle" font-family="Segoe UI,sans-serif" font-weight="800" font-size="16" fill="${G}">${[14, 9, 6, 3][i]}</text>`).join("")}</g>
    <g transform="translate(860 300)"><circle r="150" fill="${AU}" fill-opacity=".12"/><circle cx="-10" cy="-10" r="78" fill="none" stroke="${AU2}" stroke-width="18"/><path d="M48 48 l70 70" stroke="${AU2}" stroke-width="22" stroke-linecap="round"/></g>`),

  "restoran-siparis-hatalari": frame(`
    <g transform="translate(130 110)">${[0, 1, 2].map((i) => `<g transform="rotate(${[-8, 5, -3][i]} 140 200) translate(${i * 40} ${i * 30})"><rect width="260" height="330" rx="14" fill="#FFFDF8"/>${[0, 1, 2, 3, 4].map((k) => `<path d="M30 ${60 + k * 50} q40 -14 80 0 t80 0" stroke="${G}" stroke-opacity=".45" stroke-width="5" fill="none"/>`).join("")}</g>`).join("")}
      <g transform="translate(330 30)"><circle r="40" fill="#B4473A"/><path d="M-16 -16 l32 32 m0 -32 l-32 32" stroke="${CR}" stroke-width="8" stroke-linecap="round"/></g></g>
    <path d="M560 330 h80" stroke="${AU2}" stroke-width="4" stroke-linecap="round"/><path d="M634 316 l16 14 -16 14" stroke="${AU2}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(700 130)"><rect width="390" height="390" rx="22" fill="${CR}"/>${[0, 1, 2].map((i) => `${card(24, 24 + i * 118, 342, 100, "#fff")}<text x="48" y="${64 + i * 118}" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="22" fill="${G}">Masa ${[3, 7, 12][i]}</text>${bar(48, 82 + i * 118, 180, 0.45)}<circle cx="330" cy="${74 + i * 118}" r="16" fill="${G3}"/><path d="M322 ${74 + i * 118} l6 6 12 -12" stroke="${CR}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join("")}</g>`),

  "restoran-menu-tasarimi": frame(`
    <g transform="translate(120 120)">${[0, 1, 2].map((i) => `<rect x="0" y="${i * 140}" width="420" height="116" rx="18" fill="${CR}" fill-opacity="${0.12 + i * 0.05}" stroke="${AU}" stroke-opacity=".3"/><rect x="18" y="${18 + i * 140}" width="80" height="80" rx="12" fill="${AU}" fill-opacity="${0.5 + i * 0.15}"/>${bar(118, 34 + i * 140, 180, 0.9, CR)}${bar(118, 58 + i * 140, 240, 0.35, CR)}<text x="390" y="${92 + i * 140}" text-anchor="end" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="22" fill="${AU2}">${[180, 240, 95][i]} ₺</text>`).join("")}</g>
    ${phone(740, 70, 300, 510, `${["Başlangıç", "Ana", "Tatlı"].map((t, i) => `<rect x="${766 + i * 82}" y="128" width="74" height="30" rx="15" fill="${i === 1 ? G : "#fff"}" stroke="${G}" stroke-opacity=".2"/><text x="${803 + i * 82}" y="148" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="12" font-weight="700" fill="${i === 1 ? CR : G}">${t}</text>`).join("")}
      ${[0, 1, 2, 3].map((i) => `${card(768, 176 + i * 92, 244, 80)}<rect x="778" y="${186 + i * 92}" width="60" height="60" rx="10" fill="${AU}" fill-opacity="${0.35 + i * 0.15}"/>${bar(850, 196 + i * 92, 110, 0.75)}${bar(850, 218 + i * 92, 70, 0.35)}`).join("")}`)}`),

  "qr-menu-fiyatlari": frame(`
    <g transform="translate(130 120)">${[["Temel", G3, 300], ["Pro", AU, 360], ["Plus", G3, 330]].map(([t, c, h], i) => `<g transform="translate(${i * 220} ${400 - h})"><rect width="196" height="${h}" rx="20" fill="${c === AU ? CR : c}" stroke="${AU}" stroke-opacity="${c === AU ? 1 : 0.3}" stroke-width="${c === AU ? 4 : 1}"/><text x="98" y="56" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="30" fill="${c === AU ? G : CR}">${t}</text>${[0, 1, 2, 3].map((k) => `<circle cx="34" cy="${100 + k * 42}" r="9" fill="${AU}"/>${bar(54, 95 + k * 42, 100, c === AU ? 0.6 : 0.5, c === AU ? G : CR)}`).join("")}</g>`).join("")}</g>
    <g transform="translate(860 170)"><rect width="230" height="300" rx="20" fill="${CR}"/><rect x="28" y="26" width="174" height="174" rx="10" fill="#fff"/>${qr(38, 36, 154, 21, 41)}<rect x="40" y="226" width="150" height="40" rx="20" fill="${AU}"/><text x="115" y="253" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="18" fill="${G}">₺ / ay</text></g>`),
  "qr-menu-programi-secimi": frame(`
    <g transform="translate(130 110)"><rect width="440" height="420" rx="22" fill="${CR}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="34" y="${40 + i * 74}" width="40" height="40" rx="10" fill="${i < 4 ? G3 : "#fff"}" stroke="${G}" stroke-opacity=".25"/>${i < 4 ? `<path d="M${44} ${60 + i * 74} l8 8 14 -16" stroke="${CR}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ""}${bar(96, 54 + i * 74, [240, 200, 260, 180, 220][i], 0.7)}`).join("")}</g>
    ${phone(720, 70, 300, 510, `<rect x="758" y="120" width="244" height="40" rx="20" fill="#fff" stroke="${G}" stroke-opacity=".2"/>${[0, 1, 2].map((i) => `${card(758, 180 + i * 120, 244, 104)}<rect x="770" y="${192 + i * 120}" width="80" height="80" rx="12" fill="${AU}" fill-opacity="${0.35 + i * 0.2}"/>${bar(864, 204 + i * 120, 110, 0.75)}${bar(864, 228 + i * 120, 80, 0.35)}`).join("")}`)}`),

  "qr-ile-masadan-siparis": frame(`
    ${phone(160, 70, 300, 510, `${bar(192, 128, 140, 0.85)}${[0, 1].map((i) => `${card(190, 160 + i * 100, 240, 84)}<rect x="202" y="${172 + i * 100}" width="60" height="60" rx="10" fill="${AU}" fill-opacity="${0.5 + i * 0.2}"/>${bar(276, 184 + i * 100, 110, 0.7)}${bar(276, 206 + i * 100, 60, 0.4)}`).join("")}
      <rect x="190" y="470" width="240" height="56" rx="28" fill="${G}"/><text x="310" y="505" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="20" fill="${CR}">Sipariş Ver</text>`)}
    <path d="M500 320 h120" stroke="${AU2}" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/><path d="M612 306 l16 14 -16 14" stroke="${AU2}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(680 170)"><rect width="400" height="300" rx="22" fill="${CR}"/><rect width="10" height="300" rx="5" fill="${AU}"/>
      <text x="40" y="70" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="40" fill="${G}">Masa 7</text>
      ${[0, 1, 2].map((i) => `${bar(40, 110 + i * 42, [220, 180, 240][i], 0.55)}<text x="360" y="${120 + i * 42}" text-anchor="end" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="18" fill="${G}">×${[2, 1, 2][i]}</text>`).join("")}
      <rect x="40" y="240" width="150" height="36" rx="18" fill="${G3}"/><text x="115" y="264" text-anchor="middle" font-family="Segoe UI,sans-serif" font-weight="700" font-size="16" fill="${CR}">Yeni sipariş</text></g>`),

  "restoranda-ek-satis": frame(`
    <g transform="translate(140 150)"><circle cx="190" cy="170" r="170" fill="${CR}" fill-opacity=".1"/><circle cx="190" cy="170" r="130" fill="${CR}"/><circle cx="190" cy="170" r="92" fill="${AU}" fill-opacity=".55"/>
      <rect x="120" y="140" width="140" height="60" rx="30" fill="${G3}"/></g>
    ${[["İçecek", 140], ["Tatlı", 300]].map(([t, y], i) => `<g transform="translate(640 ${y})"><rect width="420" height="120" rx="22" fill="${CR}"/><circle cx="64" cy="60" r="36" fill="${[AU, G3][i]}"/>
      <text x="124" y="54" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="26" fill="${G}">+ ${t}</text>${bar(124, 74, 200, 0.4)}
      <rect x="330" y="40" width="64" height="40" rx="20" fill="${G}"/><path d="M352 60 h20 m-10 -10 v20" stroke="${CR}" stroke-width="4" stroke-linecap="round"/></g>`).join("")}`),

  "recete-maliyeti-hesaplama": frame(`
    <g transform="translate(130 110)"><rect width="420" height="420" rx="22" fill="${CR}"/><rect width="420" height="70" rx="22" fill="${G3}"/><rect y="48" width="420" height="22" fill="${G3}"/>
      <text x="32" y="46" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="24" fill="${CR}">Reçete Kartı</text>
      ${[0, 1, 2, 3, 4].map((i) => `${bar(32, 112 + i * 52, [150, 120, 170, 100, 140][i], 0.7)}<text x="300" y="${122 + i * 52}" font-family="Manrope,Segoe UI,sans-serif" font-weight="700" font-size="18" fill="${G}">${["150 g", "30 g", "1 ad.", "20 g", "10 ml"][i]}</text>`).join("")}
      <rect x="32" y="372" width="356" height="2" fill="${G}" fill-opacity=".2"/></g>
    <g transform="translate(660 150)"><rect width="140" height="20" rx="10" x="80" y="0" fill="${AU2}"/><rect x="142" y="20" width="16" height="140" fill="${AU2}"/>
      <path d="M150 40 L 40 60 M150 40 L 260 60" stroke="${AU2}" stroke-width="6"/><path d="M0 60 h80 l-40 70z M220 60 h80 l-40 70z" fill="${AU}"/><rect x="80" y="160" width="140" height="22" rx="11" fill="${AU2}"/></g>
    <g transform="translate(700 400)"><rect width="320" height="120" rx="20" fill="${CR}"/><text x="160" y="76" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="40" fill="${G}">= ₺ / porsiyon</text></g>`),

  "menu-fiyatlandirma": frame(`
    <g transform="translate(150 140)">${[0, 1, 2].map((i) => `<g transform="translate(${i * 150} ${i * 30}) rotate(${-10 + i * 10} 70 150)"><path d="M0 40 L40 0 H140 V300 H0z" fill="${[CR, AU, G3][i]}"/><circle cx="40" cy="40" r="12" fill="${G}"/>
      <text x="70" y="180" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="34" fill="${i === 2 ? CR : G}">₺</text></g>`).join("")}</g>
    <g transform="translate(700 130)"><rect width="380" height="380" rx="22" fill="${CR}"/>${[0, 1, 2, 3, 4].map((i) => `${bar(36, 50 + i * 62, [180, 150, 200, 130, 170][i], 0.7)}<text x="344" y="${60 + i * 62}" text-anchor="end" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="20" fill="${i === 1 ? AU : G}">₺₺</text>`).join("")}</g>`),

  "pdf-menu-mu-dijital-menu-mu": frame(`
    <g transform="translate(140 100)"><rect width="340" height="440" rx="14" fill="${CR}"/><rect x="0" y="0" width="80" height="40" rx="8" fill="#B4473A"/><text x="40" y="28" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="18" fill="${CR}">PDF</text>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `${bar(30, 70 + i * 44, [180, 220, 160, 240, 200, 170, 230, 150][i], 0.35)}`).join("")}</g>
    <text x="600" y="345" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="40" fill="${AU2}">vs</text>
    ${phone(730, 70, 300, 510, `${["Kahve", "Tatlı"].map((t, i) => `<rect x="${758 + i * 90}" y="128" width="80" height="30" rx="15" fill="${i === 0 ? G : "#fff"}" stroke="${G}" stroke-opacity=".2"/><text x="${798 + i * 90}" y="148" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="13" font-weight="700" fill="${i === 0 ? CR : G}">${t}</text>`).join("")}
      ${[0, 1, 2].map((i) => `${card(758, 178 + i * 118, 244, 102)}<rect x="770" y="${190 + i * 118}" width="78" height="78" rx="12" fill="${AU}" fill-opacity="${0.35 + i * 0.2}"/>${bar(862, 202 + i * 118, 110, 0.75)}${bar(862, 226 + i * 118, 70, 0.35)}`).join("")}`)}`),

  "restoran-cirosu-artirma": frame(`
    <g transform="translate(130 130)">${[["Masa devri", 0], ["Bekleme", 1], ["Ortalama hesap", 2]].map(([t, i]) => `<g transform="translate(0 ${i * 130})"><rect width="420" height="110" rx="20" fill="${CR}" fill-opacity="${0.1 + i * 0.04}" stroke="${AU}" stroke-opacity=".3"/><circle cx="56" cy="55" r="30" fill="${[AU, CR, AU2][i]}"/><text x="108" y="64" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="26" fill="${CR}">${t}</text></g>`).join("")}</g>
    <g transform="translate(640 140)"><rect width="440" height="360" rx="22" fill="${CR}" fill-opacity=".06" stroke="${AU}" stroke-opacity=".35"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${40 + i * 64}" y="${300 - (60 + i * 30)}" width="40" height="${60 + i * 30}" rx="8" fill="${i === 5 ? AU : G3}"/>`).join("")}</g>`),

  "ucretsiz-qr-menu": frame(`
    <g transform="translate(160 160)"><rect y="90" width="340" height="230" rx="18" fill="${AU}"/><rect y="50" width="340" height="60" rx="14" fill="${AU2}"/><rect x="150" y="50" width="40" height="270" fill="${G3}"/>
      <path d="M170 50 C 120 -20, 60 20, 170 50 C 280 20, 220 -20, 170 50z" fill="none" stroke="${G3}" stroke-width="14"/></g>
    <g transform="translate(700 160)"><rect width="300" height="330" rx="22" fill="${CR}"/><rect x="40" y="30" width="220" height="220" rx="10" fill="#fff"/>${qr(54, 44, 192, 23, 53)}
      <text x="150" y="300" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="40" fill="${G}">?</text></g>`),

  "qr-menu-guvenligi": frame(`
    <g transform="translate(200 120)"><path d="M180 0 L360 60 V200 C360 300 270 370 180 400 C90 370 0 300 0 200 V60z" fill="${G3}" stroke="${AU}" stroke-width="4"/>
      <rect x="120" y="170" width="120" height="100" rx="16" fill="${AU}"/><path d="M140 170 v-30 a40 40 0 0 1 80 0 v30" stroke="${AU}" stroke-width="16" fill="none"/><circle cx="180" cy="215" r="12" fill="${G}"/></g>
    <g transform="translate(700 170)"><rect width="300" height="320" rx="22" fill="${CR}"/><rect x="40" y="30" width="220" height="220" rx="10" fill="#fff"/>${qr(54, 44, 192, 23, 67)}
      <rect x="60" y="268" width="180" height="34" rx="17" fill="${G}"/><text x="150" y="291" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="16" fill="${CR}">90 dk oturum</text></g>`),

  "kombo-menu": frame(`
    <g transform="translate(150 170)"><rect x="0" y="150" width="520" height="40" rx="20" fill="${CR}" fill-opacity=".15"/>
      <g transform="translate(20 0)"><path d="M0 70 a100 70 0 0 1 200 0z" fill="${AU}"/><rect y="70" width="200" height="22" rx="6" fill="${G3}"/><rect y="92" width="200" height="16" rx="6" fill="${AU2}"/><path d="M0 108 h200 v20 a20 20 0 0 1 -20 20 h-160 a20 20 0 0 1 -20 -20z" fill="${AU}"/></g>
      <g transform="translate(250 30)"><path d="M0 0 h90 l-14 120 h-62z" fill="#B4473A"/>${[0, 1, 2, 3].map((k) => `<rect x="${10 + k * 18}" y="-30" width="10" height="40" rx="3" fill="${AU2}"/>`).join("")}</g>
      <g transform="translate(380 10)"><rect width="90" height="140" rx="14" fill="${CR}"/><rect x="30" y="-24" width="10" height="40" rx="4" fill="${G3}"/><rect y="40" width="90" height="40" fill="${AU}"/></g></g>
    <g transform="translate(800 140)"><circle cx="120" cy="120" r="120" fill="${AU}"/><text x="120" y="110" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="34" fill="${G}">KOMBO</text><text x="120" y="160" text-anchor="middle" font-family="Manrope,Segoe UI,sans-serif" font-weight="800" font-size="40" fill="${G}">₺</text></g>`)
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
