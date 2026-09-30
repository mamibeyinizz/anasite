#!/usr/bin/env node
/**
 * Homepage S2 product map + S3–S8 reorder / anchor / copy sync.
 * Run from repo root: node tools/homepage-ia-refactor.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "index.html");

function sliceBetween(html, startNeedle, endNeedle) {
  const start = html.indexOf(startNeedle);
  if (start === -1) throw new Error(`Start not found: ${startNeedle.slice(0, 60)}`);
  const end = html.indexOf(endNeedle, start);
  if (end === -1) throw new Error(`End not found after start: ${endNeedle.slice(0, 60)}`);
  return { start, end, chunk: html.slice(start, end) };
}

let html = fs.readFileSync(indexPath, "utf8");

/* --- Replace S2 (features v3 → product map) --- */
const s2Start = "<section class=\"qrmo-features-v3-wrap\"";
const s2End = "<div class=\"qrmo-translation-v3-wrap\" id=\"qrmo-translation-v3-root\">";
const s2Old = sliceBetween(html, s2Start, s2End);
const s2New = fs.readFileSync(path.join(root, "sections/section-2-product-map.html"), "utf8") + "\n\n";
html = html.slice(0, s2Old.start) + s2New + html.slice(s2Old.end);

/* --- Extract S3–S8 blocks --- */
const blocks = {
  translation: sliceBetween(html, s2End, "<section class=\"qrmo-tables-v5\""),
  tables: sliceBetween(html, "<section class=\"qrmo-tables-v5\"", "<section class=\"qrmo-smart-filter-showcase\">"),
  filter: sliceBetween(html, "<section class=\"qrmo-smart-filter-showcase\">", "<section class=\"qrmo-chatbot-feature\">"),
  chatbot: sliceBetween(html, "<section class=\"qrmo-chatbot-feature\">", "<section class=\"qrmo-service-v2\""),
  service: sliceBetween(html, "<section class=\"qrmo-service-v2\"", "<section class=\"qrmo-analytics-v3\""),
  analytics: sliceBetween(html, "<section class=\"qrmo-analytics-v3\"", "<section class=\"qrmo-transition-v1\""),
};

const middleStart = blocks.translation.start;
const middleEnd = blocks.analytics.end;
const newMiddle =
  blocks.translation.chunk +
  blocks.filter.chunk +
  blocks.chatbot.chunk +
  blocks.tables.chunk +
  blocks.service.chunk +
  blocks.analytics.chunk;

html = html.slice(0, middleStart) + newMiddle + html.slice(middleEnd);

/* --- Patch kickers / anchors on reordered sections --- */
const patches = [
  [
    '<div class="qrmo-translation-v3-wrap" id="qrmo-translation-v3-root">',
    '<div class="qrmo-translation-v3-wrap qrmo-home-anchor" id="qrmo-translation-v3-root">',
  ],
  [
    `<span class="qrmo-translation-v3-eyebrow">
      QR Menu Official • Modül
    </span>`,
    `<span class="qrmo-translation-v3-eyebrow">
      01 · MENÜ
    </span>`,
  ],
  [
    "<section class=\"qrmo-smart-filter-showcase\">",
    "<section class=\"qrmo-smart-filter-showcase qrmo-home-anchor\" id=\"qrmo-home-filtre\">",
  ],
  [
    `<div class="qrmo-smart-filter-kicker">
        <span></span>
        <strong>QR MENU OFFICIAL • MODÜL</strong>
      </div>`,
    `<div class="qrmo-smart-filter-kicker">
        <span></span>
        <strong>01 · MENÜ</strong>
      </div>`,
  ],
  [
    "<section class=\"qrmo-chatbot-feature\">",
    "<section class=\"qrmo-chatbot-feature qrmo-home-anchor\" id=\"qrmo-home-asistan\">",
  ],
  [
    `<strong>
          QR MENU OFFICIAL • MODÜL
        </strong>`,
    `<strong>
          01 · MENÜ
        </strong>`,
  ],
  [
    "<section class=\"qrmo-tables-v5\" aria-labelledby=\"qrmo-tables-v5-title\">",
    "<section class=\"qrmo-tables-v5 qrmo-home-anchor\" id=\"qrmo-home-masa\" aria-labelledby=\"qrmo-tables-v5-title\">",
  ],
  [
    `<span class="qrmo-tables-v5__eyebrow">
      QR Menu Official • Modül
    </span>`,
    `<span class="qrmo-tables-v5__eyebrow">
      02 · MASA &amp; SİPARİŞ
    </span>`,
  ],
  [
    "<section class=\"qrmo-service-v2\" aria-labelledby=\"qrmo-service-v2-title\">",
    "<section class=\"qrmo-service-v2 qrmo-home-anchor\" id=\"qrmo-home-servis\" aria-labelledby=\"qrmo-service-v2-title\">",
  ],
  [
    "<strong>QR MENU OFFICIAL • SİPARİŞ & SERVİS</strong>",
    "<strong>03 · SERVİS</strong>",
  ],
];

for (const [from, to] of patches) {
  if (!html.includes(from)) {
    console.warn("Patch skip (not found):", from.slice(0, 50));
    continue;
  }
  html = html.replace(from, to);
}

/* Service copy + feature ids (first service section only — use targeted replace) */
html = html.replace(
  `<h2
        id="qrmo-service-v2-title"
        class="qrmo-service-v2__title"
      >
        Siparişten Hesaba,<br>
        Her Talep Personel Ekranında
      </h2>`,
  `<h2
        id="qrmo-service-v2-title"
        class="qrmo-service-v2__title"
      >
        Garson, hesap ve salon<br>
        tek servis panelinde
      </h2>`
);

html = html.replace(
  `<p class="qrmo-service-v2__lead">
        Müşteriden gelen sipariş, garson ve hesap talepleri
        personel tarafındaki servis akışında toplanır.
      </p>`,
  `<p class="qrmo-service-v2__lead">
        Garson çağrısı ve hesap isteği masa bilgisiyle servis paneline düşer;
        ekip talepleri bu ekrandan izler.
      </p>`
);

html = html.replace(
  `<p class="qrmo-service-v2__description">
        Her işlem masa bilgisiyle birlikte servis akışına iletilir.
        Ekip talepleri tek panel üzerinden takip eder ve masaların
        durumunu buradan yönetir.
      </p>`,
  `<p class="qrmo-service-v2__description">
        Servis Paneli sesli uyarı ve masaüstü bildirimle yeni talebi duyurur.
        Personel / servis rolü, ekibin panel erişimini sınırlar; yanıt hızı
        işletmenizin operasyonuna bağlıdır.
      </p>`
);

html = html.replace(
  `<div class="qrmo-service-v2__feature">

          <div
            class="qrmo-service-v2__feature-icon"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 3h12v18H6z"/>
              <path d="M9 7h6"/>
              <path d="M9 11h6"/>
              <path d="M9 15h3"/>
              <path d="m15 17 1.5 1.5L20 15"/>
            </svg>
          </div>

          <div class="qrmo-service-v2__feature-copy">

            <strong>
              QR Menüden Sipariş
            </strong>

            <p>
              Sipariş özelliği aktif olduğunda müşteri talebi masa bilgisiyle birlikte servis akışına iletilir.
            </p>

          </div>

        </div>


        <div class="qrmo-service-v2__feature">`,
  `<div class="qrmo-service-v2__feature" id="qrmo-home-garson-cagir">`
);

html = html.replace(
  `<div class="qrmo-service-v2__feature">

          <div
            class="qrmo-service-v2__feature-icon"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24">
              <rect x="4" y="6" width="16" height="14" rx="2"/>
              <path d="M8 3v3"/>
              <path d="M16 3v3"/>
              <path d="M7 10h10"/>
              <path d="M8 14h3"/>
              <path d="M13 14h3"/>
            </svg>
          </div>

          <div class="qrmo-service-v2__feature-copy">

            <strong>
              Hesap Talebi Servis Panelinde
            </strong>`,
  `<div class="qrmo-service-v2__feature" id="qrmo-home-hesap-iste">

          <div
            class="qrmo-service-v2__feature-icon"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24">
              <rect x="4" y="6" width="16" height="14" rx="2"/>
              <path d="M8 3v3"/>
              <path d="M16 3v3"/>
              <path d="M7 10h10"/>
              <path d="M8 14h3"/>
              <path d="M13 14h3"/>
            </svg>
          </div>

          <div class="qrmo-service-v2__feature-copy">

            <strong>
              Hesap Talebi Servis Panelinde
            </strong>`
);

/* Add servis paneli + personel feature after hesap block — insert before closing features div */
const servisExtra = `
        <div class="qrmo-service-v2__feature">

          <div class="qrmo-service-v2__feature-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 8h10"/><path d="M7 12h6"/></svg>
          </div>

          <div class="qrmo-service-v2__feature-copy">
            <strong>Servis Paneli</strong>
            <p>Garson, hesap ve sipariş talepleri tek akışta listelenir; sesli uyarı ve bildirimle yeni kayıt duyulur.</p>
          </div>

        </div>

        <div class="qrmo-service-v2__feature">

          <div class="qrmo-service-v2__feature-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3"/><path d="M5 20c1-4 3.5-6 7-6s6 2 7 6"/></svg>
          </div>

          <div class="qrmo-service-v2__feature-copy">
            <strong>Personel / servis rolü</strong>
            <p>Servis paneline erişimi rol bazında ayırır; hangi personelin hangi talepleri gördüğünü kontrol edersiniz.</p>
          </div>

        </div>
`;

html = html.replace(
  `          </div>

        </div>

      </div>



    </div>


    <!-- =====================================================
         RIGHT / ANIMATION (görsel simülasyon)
    ====================================================== -->

    <div class="qrmo-service-v2__visual">`,
  `          </div>

        </div>
${servisExtra}
      </div>



    </div>


    <!-- =====================================================
         RIGHT / ANIMATION (görsel simülasyon)
    ====================================================== -->

    <div class="qrmo-service-v2__visual">`
);

/* Masa section — add Pro modules after benefits */
const masaExtra = `
    <div class="qrmo-tables-v5__pro-modules">
      <h3 class="qrmo-tables-v5__pro-modules-title">Pro ile birlikte</h3>
      <ul class="qrmo-tables-v5__pro-modules-list">
        <li><span>QR Sipariş</span><em class="qrmo-tables-v5__pro-tag">Pro</em></li>
        <li><span>Masa Oturum Güvenliği</span><em class="qrmo-tables-v5__pro-tag">Pro</em></li>
      </ul>
      <p class="qrmo-tables-v5__pro-modules-note">
        QR Masa Temel pakette başlar; sipariş ve imzalı oturum Pro katmanında devreye girer.
        Oturum yalnızca kayıtlı masalarda açılır, süre ve hareketsizlik limiti ayarlanabilir.
      </p>
    </div>
`;

html = html.replace(
  `    </ul>



  </div>

</div>

<script>

(function(){

  /* ========================================================
     QR MENU OFFICIAL
     QR MASA MODÜLÜ — ANIMATION ENGINE
     ======================================================== */`,
  `    </ul>
${masaExtra}



  </div>

</div>

<script>

(function(){

  /* ========================================================
     QR MENU OFFICIAL
     QR MASA MODÜLÜ — ANIMATION ENGINE
     ======================================================== */`
);

const tablesProCss = `
.qrmo-tables-v5__pro-modules{
  margin-top:22px;
  padding-top:18px;
  border-top:1px solid rgba(201,168,76,.22);
}
.qrmo-tables-v5__pro-modules-title{
  margin:0 0 10px;
  font-size:13px;
  font-weight:700;
  letter-spacing:.06em;
  text-transform:uppercase;
  color:rgba(13,43,34,.72);
}
.qrmo-tables-v5__pro-modules-list{
  list-style:none;
  margin:0 0 10px;
  padding:0;
  display:flex;
  flex-direction:column;
  gap:8px;
}
.qrmo-tables-v5__pro-modules-list li{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  font-size:14px;
  color:#0D2B22;
}
.qrmo-tables-v5__pro-tag{
  font-style:normal;
  font-size:10px;
  font-weight:700;
  letter-spacing:.06em;
  text-transform:uppercase;
  padding:2px 7px;
  border-radius:6px;
  border:1px solid rgba(23,50,38,.18);
  background:rgba(23,50,38,.08);
}
.qrmo-tables-v5__pro-modules-note{
  margin:0;
  font-size:12px;
  line-height:1.5;
  color:rgba(13,43,34,.68);
}
.qrmo-home-anchor{
  scroll-margin-top:calc(var(--qrmo-gh-h, 88px) + 16px);
}
`;

if (!html.includes("qrmo-tables-v5__pro-modules{")) {
  html = html.replace(
    ".qrmo-tables-v5{",
    tablesProCss + "\n.qrmo-tables-v5{"
  );
}

/* Replace analytics section HTML from source file (section tag only through closing section) */
const analyticsSrc = fs.readFileSync(path.join(root, "sections/section-8-analytics.html"), "utf8");
const analyticsSection = analyticsSrc.match(/<section class="qrmo-analytics-v3[\s\S]*?<\/section>\s*/);
if (!analyticsSection) throw new Error("Could not read analytics section from source");
const aOld = sliceBetween(html, "<section class=\"qrmo-analytics-v3\"", "<section class=\"qrmo-transition-v1\"");
html = html.slice(0, aOld.start) + analyticsSection[0] + html.slice(aOld.end);

/* Sync analytics CSS block in index from section file */
const analyticsStyle = analyticsSrc.match(/<style>\s*\/\* =+[\s\S]*?QR MENU OFFICIAL — ANALYTICS V3[\s\S]*?<\/style>/);
if (analyticsStyle) {
  const marker = "QR MENU OFFICIAL — ANALYTICS V3 (SECTION 8A)";
  const styleMarkerIdx = html.indexOf(marker);
  if (styleMarkerIdx !== -1) {
    const styleOpen = html.lastIndexOf("<style>", styleMarkerIdx);
    const styleClose = html.indexOf("</style>", styleMarkerIdx) + "</style>".length;
    html = html.slice(0, styleOpen) + analyticsStyle[0] + html.slice(styleClose);
  }
}

/* Sync analytics script from section file */
const analyticsScript = analyticsSrc.match(/<script>[\s\S]*?initAnalyticsDemo[\s\S]*?<\/script>\s*/);
if (analyticsScript) {
  const scriptMarker = "function initAnalyticsDemo";
  const idx = html.indexOf(scriptMarker);
  if (idx !== -1) {
    const scriptStart = html.lastIndexOf("<script>", idx);
    const scriptEnd = html.indexOf("</script>", idx) + "</script>".length;
    html = html.slice(0, scriptStart) + analyticsScript[0] + html.slice(scriptEnd);
  }
}

fs.writeFileSync(indexPath, html);
console.log("homepage-ia-refactor.mjs: index.html updated.");
