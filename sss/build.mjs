#!/usr/bin/env node
/**
 * Tek kaynak: faq-data.mjs → sss.html (semantic HTML + JSON-LD)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { applyGlobal } from "../global/inject.mjs";
import {
  SITE,
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  assertFaqData,
} from "./faq-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
/* Aynı içerik iki adrese yazılır: asıl adres /sss/ (sss/index.html) ve eski
   /sss.html. Bağlantılar sayfanın derinliğine göre göreli üretilir; böylece
   site kökte de GitHub Pages alt dizininde (/anasite/) de çalışır. */
const OUTPUTS = [
  { file: path.join(root, "sss", "index.html"), rel: "../", assets: "" },
  { file: path.join(root, "sss.html"), rel: "", assets: "sss/" },
];
let REL = "";
/* "/" → ana sayfa, "/x/" → rel + "x/" */
const link = (h) => (h === "/" ? REL || "./" : REL + h.replace(/^\//, ""));

assertFaqData();

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function partsToHtml(parts) {
  return parts
    .map((p) => {
      if (p.type === "text") return escapeHtml(p.value);
      if (p.type === "link") {
        return `<a href="${escapeHtml(link(p.href))}">${escapeHtml(p.label)}</a>`;
      }
      return "";
    })
    .join("");
}

function partsToPlain(parts) {
  return parts.map((p) => (p.type === "text" ? p.value : p.label)).join("");
}

function buildJsonLd() {
  const mainEntity = FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: partsToPlain(item.answer),
    },
  }));
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

const CAT_ICONS = {
  "qr-nedir": '<rect x="3.5" y="3.5" width="6" height="6" rx="1.2"/><rect x="14.5" y="3.5" width="6" height="6" rx="1.2"/><rect x="3.5" y="14.5" width="6" height="6" rx="1.2"/><path d="M14.5 14.5h2.5v2.5h-2.5zM20.5 14.5v2.5M14.5 20.5h2.5M20 20.5h.5"/>',
  "menu-urun": '<path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3V4.5Z"/><path d="M9 9h6M9 12.5h6"/>',
  "qr-masa": '<path d="M4 9.5h16M6 9.5V19M18 9.5V19M3.5 9.5l1.5-4h14l1.5 4"/>',
  "siparis-servis": '<path d="M14.9 17.1a23.8 23.8 0 0 0 5.4-1.3A9 9 0 0 1 18 9.8V9A6 6 0 0 0 6 9v.8a9 9 0 0 1-2.3 6c1.7.7 3.6 1.1 5.5 1.3m5.7 0a24 24 0 0 1-5.7 0m5.7 0a3 3 0 1 1-5.7 0"/>',
  "dil-alerjen": '<circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="3.6" ry="8.5"/><path d="M3.5 12h17M5 7.6h14M5 16.4h14"/>',
  "menu-asistani": '<path d="M9.8 15.9 9 18.75l-.8-2.85a4.5 4.5 0 0 0-3.1-3.1L2.25 12l2.85-.8a4.5 4.5 0 0 0 3.1-3.1L9 5.25l.8 2.85a4.5 4.5 0 0 0 3.1 3.1l2.85.8-2.85.8a4.5 4.5 0 0 0-3.1 3.1Z"/><path d="M18.3 8.7 18 9.75l-.3-1.05a3.4 3.4 0 0 0-2.4-2.45L14.25 6l1.05-.3a3.4 3.4 0 0 0 2.4-2.45L18 2.25l.3 1.05a3.4 3.4 0 0 0 2.45 2.4L21.75 6l-1.05.3a3.4 3.4 0 0 0-2.4 2.4Z"/>',
  "analytics-muhendislik": '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
  "guvenlik-teknik": '<path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6l-7-2.5Z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  "paketler-fiyat": '<path d="M3.5 12.2V5a1.5 1.5 0 0 1 1.5-1.5h7.2l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-5.9 5.9a1.5 1.5 0 0 1-2.1 0L3.5 12.2Z"/><circle cx="8" cy="8" r="1.2"/>',
};

function buildCategoryNav() {
  return FAQ_CATEGORIES.map((cat, i) => {
    const n = FAQ_ITEMS.filter((x) => x.categoryId === cat.id).length;
    return `
        <li>
          <button type="button" class="qrmo-faq-nav__btn" data-qrmo-faq-cat="${escapeHtml(cat.id)}" aria-controls="qrmo-faq-panel-${escapeHtml(cat.id)}" id="qrmo-faq-nav-${escapeHtml(cat.id)}"${i === 0 ? ' aria-current="true"' : ""}>
            <span class="qrmo-faq-nav__ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${CAT_ICONS[cat.id] || ""}</svg></span>
            <span class="qrmo-faq-nav__label">${escapeHtml(cat.title)}</span>
            <span class="qrmo-faq-nav__count">${n} soru</span>
          </button>
        </li>`;
  }).join("");
}

function buildPanels() {
  return FAQ_CATEGORIES.map((cat, ci) => {
    const items = FAQ_ITEMS.filter((x) => x.categoryId === cat.id);
    const list = items
      .map(
        (item, ii) => `
          <details class="qrmo-faq-item" id="${escapeHtml(item.id)}" data-qrmo-faq-item>
            <summary class="qrmo-faq-item__q">
              <span class="qrmo-faq-item__no" aria-hidden="true">${String(ii + 1).padStart(2, "0")}</span>
              <span class="qrmo-faq-item__q-text">${escapeHtml(item.question)}</span>
              <span class="qrmo-faq-item__icon" aria-hidden="true"></span>
            </summary>
            <div class="qrmo-faq-item__a">
              <p>${partsToHtml(item.answer)}</p>
            </div>
          </details>`
      )
      .join("");
    return `
        <section class="qrmo-faq-panel" id="qrmo-faq-panel-${escapeHtml(cat.id)}" data-qrmo-faq-panel="${escapeHtml(cat.id)}" role="tabpanel" aria-labelledby="qrmo-faq-panel-title-${escapeHtml(cat.id)}"${ci === 0 ? "" : ' hidden'}>
          <div class="qrmo-faq-panel__head">
            <h2 class="qrmo-faq-panel__title" id="qrmo-faq-panel-title-${escapeHtml(cat.id)}">${escapeHtml(cat.title)}</h2>
            <span class="qrmo-faq-panel__count">${items.length} soru</span>
          </div>
          <div class="qrmo-faq-list">
            ${list}
          </div>
        </section>`;
  }).join("");
}

const canonical = `${SITE.baseUrl}${SITE.path.replace(/^\//, "")}`.replace(
  /([^:]\/)\/+/g,
  "$1"
);
const canonicalUrl = SITE.baseUrl + SITE.path;

const ogImageTags = SITE.ogImage
  ? `
  <meta property="og:image" content="${escapeHtml(SITE.ogImage)}">`
  : "";

const jsonLd = JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c");

function renderPage(rel, assets) {
  REL = rel;
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(SITE.title)}</title>
  <meta name="description" content="${escapeHtml(SITE.description)}">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#0D2B22">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(SITE.brand)}">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:title" content="${escapeHtml(SITE.title)}">
  <meta property="og:description" content="${escapeHtml(SITE.description)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">${ogImageTags}
  <link rel="stylesheet" href="${assets}faq.css">
  <script type="application/ld+json">${jsonLd}</script>
  <script defer src="${assets}faq.js"></script>
</head>
<body class="qrmo-faq-page" data-qrmo-faq-root>

<main class="qrmo-faq" id="qrmo-faq-main">
  <header class="qrmo-faq-hero">
    <div class="qrmo-faq-hero__inner">
      <span class="qrmo-faq-hero__mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="6" height="6" rx="1.2"/><rect x="14.5" y="3.5" width="6" height="6" rx="1.2"/><rect x="3.5" y="14.5" width="6" height="6" rx="1.2"/><path d="M14.5 14.5h2.5v2.5h-2.5zM20.5 14.5v2.5M14.5 20.5h2.5M20 20.5h.5"/></svg></span>
      <h1 class="qrmo-faq-title">Sıkça sorulan sorular</h1>
      <p class="qrmo-faq-lead">QR Menu Official hakkında en çok sorulan soruların kısa cevapları. Aradığınızı bulamazsanız ekibimiz yardımcı olur.</p>

      <div class="qrmo-faq-search-wrap">
        <label class="qrmo-faq-sr" for="qrmo-faq-search">SSS ara</label>
        <div class="qrmo-faq-search-box">
          <svg class="qrmo-faq-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
          <input type="search" id="qrmo-faq-search" class="qrmo-faq-search" name="q" autocomplete="off" spellcheck="false" placeholder="Soru ya da konu arayın…" aria-controls="qrmo-faq-results-status" data-qrmo-faq-search>
          <kbd class="qrmo-faq-kbd" aria-hidden="true">/</kbd>
        </div>
        <div class="qrmo-faq-suggest" aria-label="Sık aranan konular">
          ${["Fiyat", "Kurulum", "Alerjen", "Çoklu dil", "QR kod", "Garson çağırma"]
            .map((t) => `<button type="button" class="qrmo-faq-suggest__btn" data-qrmo-faq-suggest="${escapeHtml(t)}">${escapeHtml(t)}</button>`)
            .join("\n          ")}
        </div>
        <p class="qrmo-faq-sr" id="qrmo-faq-results-status" role="status" aria-live="polite"></p>
      </div>
    </div>
  </header>

  <div class="qrmo-faq-layout qrmo-faq-inner">
    <nav class="qrmo-faq-nav" aria-label="SSS kategorileri">
      <ul class="qrmo-faq-nav__list" data-qrmo-faq-nav>
        ${buildCategoryNav()}
      </ul>
    </nav>
    <div class="qrmo-faq-panels" data-qrmo-faq-panels>
      ${buildPanels()}
    </div>
  </div>

  <section class="qrmo-faq-cta" aria-labelledby="qrmo-faq-cta-title">
    <div class="qrmo-faq-cta__panel">
      <span class="qrmo-faq-hero__mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5h16v10H9l-5 4v-14Z"/><path d="M8.5 10h7"/></svg></span>
      <h2 id="qrmo-faq-cta-title" class="qrmo-faq-cta__title">Cevabı bulamadınız mı?</h2>
      <p class="qrmo-faq-cta__text">Ekibimiz işletmenize uygun çözümü birlikte netleştirsin.</p>
      <div class="qrmo-faq-cta__actions">
        <a class="qrmo-faq-btn qrmo-faq-btn--solid" href="${link("/iletisim/")}">İletişime Geçin</a>
        <a class="qrmo-faq-btn qrmo-faq-btn--ghost" href="${link("/paketler/")}">Paketleri İnceleyin</a>
      </div>
    </div>
  </section>
</main>

</body>
</html>
`;
}

for (const o of OUTPUTS) {
  fs.writeFileSync(o.file, applyGlobal(renderPage(o.rel, o.assets), { rel: o.rel, current: "sss", skip: "qrmo-faq-main" }), "utf8");
  console.log(`Wrote ${o.file} (${FAQ_ITEMS.length} FAQ items)`);
}
