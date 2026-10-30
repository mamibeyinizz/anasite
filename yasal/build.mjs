#!/usr/bin/env node
/* =========================================================
   QR MENU OFFICIAL — YASAL SAYFA ÜRETİCİSİ
   Kullanım:  node yasal/build.mjs
   Çıktı:     gizlilik/index.html · cerez-politikasi/index.html · kullanim-sartlari/index.html
   İçerik:    yasal/legal-data.mjs · Tasarım: yasal/yasal.css
   Global header/footer applyGlobal() ile yerleştirilir (sss/build.mjs ile aynı yol).
   GitHub Pages Node çalıştırmaz: yerelde çalıştırılır, sonuç commit edilir.
========================================================= */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { applyGlobal } from "../global/inject.mjs";
import { PAGES, UPDATED } from "./legal-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const BASE = "https://qrmenuofficial.com";
const REL = "../";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderPage(page) {
  const url = `${BASE}/${page.slug}/`;
  const sections = page.sections
    .map(
      (s) => `
      <section class="qrmo-legal-sec" id="${s.id}" aria-labelledby="${s.id}-baslik">
        <h2 class="qrmo-legal-h2" id="${s.id}-baslik">${esc(s.h2)}</h2>${s.html.replaceAll("{rel}", REL)}
      </section>`
    )
    .join("");
  const toc = page.sections.map((s) => `<li><a href="#${s.id}">${esc(s.h2)}</a></li>`).join("");
  const others = PAGES.filter((p) => p.slug !== page.slug)
    .map((p) => `<li><a class="qrmo-legal-more-link" href="${REL}${p.slug}/"><span>${esc(p.nav)}</span><span aria-hidden="true">→</span></a></li>`)
    .join("");

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: page.nav, item: url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.title)} | QR Menu Official</title>
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="index,follow">
<meta name="theme-color" content="#0D2B22">
<meta name="color-scheme" content="light">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="QR Menu Official">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${esc(page.title)} | QR Menu Official">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<link rel="stylesheet" href="../yasal/yasal.css">
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
<!-- QRMO:HEAD:START -->
<!-- QRMO:HEAD:END -->
</head>
<body class="qrmo-legal-page">
<!-- QRMO:HEADER:START -->
<!-- QRMO:HEADER:END -->
<main class="qrmo-legal" id="icerik">
  <header class="qrmo-legal-hero">
    <div class="qrmo-legal-inner">
      <p class="qrmo-legal-kicker"><span aria-hidden="true"></span>YASAL</p>
      <h1 class="qrmo-legal-h1">${esc(page.h1)}</h1>
      <p class="qrmo-legal-lead">${esc(page.lead)}</p>
      <p class="qrmo-legal-meta">Son güncelleme: ${UPDATED}</p>
    </div>
  </header>

  <div class="qrmo-legal-inner qrmo-legal-body">
    <nav class="qrmo-legal-toc" aria-label="Sayfa içindekiler">
      <p class="qrmo-legal-toc-title">İçindekiler</p>
      <ol>${toc}</ol>
    </nav>
    <article class="qrmo-legal-article">${sections}
    </article>
  </div>

  <section class="qrmo-legal-more qrmo-legal-inner" aria-label="Diğer yasal metinler">
    <p class="qrmo-legal-more-title">Diğer yasal metinler</p>
    <ul class="qrmo-legal-more-list">${others}</ul>
  </section>
</main>
<!-- QRMO:FOOTER:START -->
<!-- QRMO:FOOTER:END -->
</body>
</html>
`;
}

for (const page of PAGES) {
  const dir = path.join(root, page.slug);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "index.html");
  fs.writeFileSync(file, applyGlobal(renderPage(page), { rel: REL, current: "legal", skip: "icerik" }), "utf8");
  console.log(`Wrote ${page.slug}/index.html (${page.sections.length} bölüm)`);
}
