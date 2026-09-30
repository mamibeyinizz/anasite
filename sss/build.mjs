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

function buildCategoryNav() {
  return FAQ_CATEGORIES.map(
    (cat, i) => `
        <li>
          <button type="button" class="qrmo-faq-nav__btn" data-qrmo-faq-cat="${escapeHtml(cat.id)}" aria-controls="qrmo-faq-panel-${escapeHtml(cat.id)}" id="qrmo-faq-nav-${escapeHtml(cat.id)}"${i === 0 ? ' aria-current="true"' : ""}>
            <span class="qrmo-faq-nav__label">${escapeHtml(cat.title)}</span>
            <span class="qrmo-faq-nav__count" aria-hidden="true">${FAQ_ITEMS.filter((x) => x.categoryId === cat.id).length}</span>
          </button>
        </li>`
  ).join("");
}

function buildMobileChips() {
  return FAQ_CATEGORIES.map(
    (cat, i) => `
        <button type="button" class="qrmo-faq-chip" data-qrmo-faq-cat="${escapeHtml(cat.id)}" aria-controls="qrmo-faq-panel-${escapeHtml(cat.id)}"${i === 0 ? ' aria-current="true"' : ""}>${escapeHtml(cat.title)}</button>`
  ).join("");
}

function buildPanels() {
  return FAQ_CATEGORIES.map((cat, ci) => {
    const items = FAQ_ITEMS.filter((x) => x.categoryId === cat.id);
    const list = items
      .map(
        (item) => `
          <details class="qrmo-faq-item" id="${escapeHtml(item.id)}" data-qrmo-faq-item>
            <summary class="qrmo-faq-item__q">
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
          <h2 class="qrmo-faq-panel__title" id="qrmo-faq-panel-title-${escapeHtml(cat.id)}">${escapeHtml(cat.title)}</h2>
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
    <div class="qrmo-faq-inner qrmo-faq-hero-grid">
      <div class="qrmo-faq-hero-copy">
        <p class="qrmo-faq-eyebrow">QR MENU OFFICIAL • SSS</p>
        <h1 class="qrmo-faq-title">Sık sorulan sorular</h1>
        <p class="qrmo-faq-lead">Menü, masa, sipariş, dil, asistan, analytics ve paketler hakkında kısa cevaplar. Kategorilere göz atın veya arama kutusunu kullanın.</p>
      </div>
      <div class="qrmo-faq-search-wrap">
        <label class="qrmo-faq-search-label" for="qrmo-faq-search">SSS ara</label>
        <input type="search" id="qrmo-faq-search" class="qrmo-faq-search" name="q" autocomplete="off" spellcheck="false" placeholder="Örn. ödeme, çeviri, QR kod…" aria-controls="qrmo-faq-results-status" data-qrmo-faq-search>
        <p class="qrmo-faq-search-hint" id="qrmo-faq-search-hint"><kbd>/</kbd> ile aramaya odaklan</p>
        <p class="qrmo-faq-sr" id="qrmo-faq-results-status" role="status" aria-live="polite"></p>
      </div>
    </div>
  </header>

  <div class="qrmo-faq-chips-wrap qrmo-faq-inner" aria-label="Kategori seçimi">
    <div class="qrmo-faq-chips" data-qrmo-faq-chips>
      ${buildMobileChips()}
    </div>
  </div>

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

  <footer class="qrmo-faq-foot qrmo-faq-inner">
    <p>Cevabını bulamadınız mı? <a href="${link("/paketler/")}">Paketleri inceleyin</a> veya satış ekibinizle iletişime geçin.</p>
  </footer>
</main>

</body>
</html>
`;
}

for (const o of OUTPUTS) {
  fs.writeFileSync(o.file, applyGlobal(renderPage(o.rel, o.assets), { rel: o.rel, current: "sss", skip: "qrmo-faq-main" }), "utf8");
  console.log(`Wrote ${o.file} (${FAQ_ITEMS.length} FAQ items)`);
}
