#!/usr/bin/env node
/* =========================================================
   QR MENU OFFICIAL — /moduller/ SAYFA ÜRETİCİSİ
   Kullanım:  node moduller/build.js

   Girdi : moduller/module-data.js      (modül içerikleri)
           paketler/packages-data.js    (paket matrisi — source of truth)
   Çıktı : moduller/<slug>/index.html   (her modül için)
           moduller/index.html          (modül dizini)

   Neden statik üretim? Başlık, meta açıklama, canonical ve tüm içerik
   HTML'de hazır gelir (SEO); sayfa JS'siz de tam okunur. Ortak tasarım
   yalnızca module-page.css; ortak davranış module-page.js.
========================================================= */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const MOD = require(path.join(ROOT, "module-data.js"));

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "..", "paketler", "packages-data.js"), "utf8"), sandbox);
const PKG = sandbox.window.QRMO_PRICING;

/* ---------- yardımcılar ---------- */

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const up = (s) => s.toLocaleUpperCase("tr");

const ICON = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 12h10"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/></svg>'
};

const pkgIdx = (id) => PKG.packages.findIndex((p) => p.id === id);
const featureById = (id) => PKG.features.find((f) => f.id === id);

/* Modülün paketi = kapsadığı özelliklerin en düşük paketi. */
function modulePackage(m) {
  let min = PKG.packages.length - 1;
  m.featureIds.forEach((fid) => {
    const f = featureById(fid);
    if (!f) throw new Error(`[${m.slug}] packages-data.js içinde özellik yok: ${fid}`);
    min = Math.min(min, pkgIdx(f.from));
  });
  return { index: min, pkg: PKG.packages[min] };
}

const bySlug = {};
MOD.modules.forEach((m) => { bySlug[m.slug] = m; });

/* ---------- doğrulama ---------- */

const problems = [];
const seenTitle = new Set(), seenDesc = new Set();
MOD.modules.forEach((m) => {
  modulePackage(m);
  if (seenTitle.has(m.seo.title)) problems.push(`${m.slug}: title tekrar`);
  if (seenDesc.has(m.seo.description)) problems.push(`${m.slug}: description tekrar`);
  seenTitle.add(m.seo.title); seenDesc.add(m.seo.description);
  const full = `${m.seo.title} | ${MOD.site.brand}`;
  if (full.length > 70) problems.push(`${m.slug}: title ${full.length} karakter (>70)`);
  if (m.seo.description.length < 70 || m.seo.description.length > 175) problems.push(`${m.slug}: description ${m.seo.description.length} karakter`);
  m.related.forEach((r) => { if (!bySlug[r.slug]) problems.push(`${m.slug}: ilgili modül yok: ${r.slug}`); if (r.slug === m.slug) problems.push(`${m.slug}: kendine link`); });
});
PKG.features.forEach((f) => { if (f.page && !bySlug[f.page]) problems.push(`packages-data feature ${f.id}: page=${f.page} modül yok`); });

/* ---------- mockup üreticileri (temsili arayüz) ---------- */

function qrPattern() {
  /* Dekoratif, kodlanmamış desen: 11×11 ızgara + üç arama karesi. Taranabilir değildir. */
  const n = 11, cells = [];
  const finder = (r, c) => (r < 3 && c < 3) || (r < 3 && c > n - 4) || (r > n - 4 && c < 3);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const on = finder(r, c) ? true : ((r * 7 + c * 13 + r * c) % 3 === 0);
    cells.push(`<i${on ? ' class="on"' : ""}></i>`);
  }
  return `<span class="qrmo-mod-qr">${cells.join("")}</span>`;
}

const MOCK = {
  phone(s) {
    return `<div class="qrmo-mod-phone">
      <div class="qrmo-mod-phone-bar">${esc(s.title)}</div>
      <div class="qrmo-mod-phone-search">${esc(s.search)}</div>
      <div class="qrmo-mod-row-btns">${(s.actions || []).map((a) => `<span class="qrmo-mod-btn-ghost">${esc(a)}</span>`).join("")}</div>
      ${(s.active || []).length ? `<div class="qrmo-mod-active">${s.active.map((a) => `<span class="qrmo-mod-pill is-on">${esc(a)} ×</span>`).join("")}</div>` : ""}
      ${(s.tabs || []).length ? `<div class="qrmo-mod-tabs">${s.tabs.map((t, i) => `<span class="${i === 0 ? "is-on" : ""}">${esc(t)}</span>`).join("")}</div>` : ""}
      <ul class="qrmo-mod-cards">${s.items.map((it) => `<li class="${it.off ? "is-off" : ""}">
        <span class="qrmo-mod-thumb"></span>
        <span class="qrmo-mod-card-body"><strong>${esc(it.n)}</strong><small>${esc(it.m)}</small></span>
        <span class="qrmo-mod-card-side"><b>${esc(it.p)}</b>${it.tag ? `<em>${esc(it.tag)}</em>` : ""}</span></li>`).join("")}</ul></div>`;
  },
  panel(s) {
    return `<div class="qrmo-mod-panel">
      <div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong>${s.status ? `<span class="qrmo-mod-status">${esc(s.status)}</span>` : ""}</div>
      ${(s.rows || []).map((r) => `<div class="qrmo-mod-field"><span>${esc(r.l)}</span><b>${esc(r.v)}</b></div>`).join("")}
      ${(s.toggles || []).length ? `<div class="qrmo-mod-toggles">${s.toggles.map((t) => `<span class="qrmo-mod-toggle${t.on ? " is-on" : ""}"><i></i>${esc(t.l)}</span>`).join("")}</div>` : ""}
      ${s.result ? `<p class="qrmo-mod-result">${esc(s.result)}</p>` : ""}
      ${s.list ? `<div class="qrmo-mod-list"><span>${esc(s.list.l)}</span>${s.list.items.map((i) => `<b>${esc(i)}</b>`).join("")}</div>` : ""}
    </div>`;
  },
  table(s) {
    return `<div class="qrmo-mod-panel"><div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong></div>
      <div class="qrmo-mod-table${s.qr ? " has-qr" : ""}" style="--cols:${s.cols.length}">
        <div class="qrmo-mod-tr is-head">${s.cols.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
        ${s.rows.map((r) => `<div class="qrmo-mod-tr">${r.map((c) => `<span>${esc(c)}</span>`).join("")}</div>`).join("")}
      </div>${s.qr ? `<div class="qrmo-mod-qrrow">${qrPattern()}<small>QR önizleme (desen temsilidir, taranmaz)</small></div>` : ""}</div>`;
  },
  chips(s) {
    return `<div class="qrmo-mod-panel"><div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong></div>
      <div class="qrmo-mod-active">${s.chips.map((c, i) => `<span class="qrmo-mod-pill${i === 0 ? " is-on" : ""}">${esc(c)}</span>`).join("")}</div>
      ${s.note ? `<p class="qrmo-mod-note">${esc(s.note)}</p>` : ""}</div>`;
  },
  filter(s) {
    return `<div class="qrmo-mod-panel"><div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong></div>
      ${s.sections.map((sec) => `<div class="qrmo-mod-fsec"><span class="qrmo-mod-flabel">${esc(sec.l.toLocaleUpperCase("tr"))}</span>
        ${sec.pills ? `<div class="qrmo-mod-active">${sec.pills.map((p, i) => `<span class="qrmo-mod-pill${(sec.sel || []).includes(i) ? " is-on" : ""}">${esc(p)}</span>`).join("")}</div>` : ""}
        ${sec.range ? `<div class="qrmo-mod-range">${sec.range.map((r) => `<span>${esc(r)}</span>`).join("")}</div>` : ""}</div>`).join("")}
      <div class="qrmo-mod-row-btns is-end">${s.actions.map((a, i) => `<span class="${i ? "qrmo-mod-btn-solid" : "qrmo-mod-btn-ghost"}">${esc(a)}</span>`).join("")}</div></div>`;
  },
  chat(s) {
    return `<div class="qrmo-mod-panel"><div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong></div>
      <div class="qrmo-mod-chat">${s.messages.map((m) => `<p class="is-${m.from}">${esc(m.text)}</p>`).join("")}</div>
      ${s.hint ? `<p class="qrmo-mod-note">${esc(s.hint)}</p>` : ""}</div>`;
  },
  kanban(s) {
    return `<div class="qrmo-mod-panel"><div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong></div>
      <div class="qrmo-mod-kanban">${s.columns.map((c) => `<div class="qrmo-mod-col"><span class="qrmo-mod-col-h">${esc(c.n)}<b>${c.cards.length}</b></span>
        ${c.cards.map((k) => `<div class="qrmo-mod-kcard${k.s ? " is-" + k.s : ""}"><em>${esc(k.k)}</em><strong>${esc(k.t)}</strong></div>`).join("")}</div>`).join("")}</div></div>`;
  },
  bars(s) {
    return `<div class="qrmo-mod-panel"><div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong></div>
      <div class="qrmo-mod-bars">${s.rows.map((r) => `<div><span>${esc(r.l)}</span><i style="--w:${Number(r.w)}%"></i></div>`).join("")}</div>
      <p class="qrmo-mod-note">Çubuk uzunlukları örnektir; gerçek veri değildir.</p></div>`;
  },
  flow(s) {
    return `<div class="qrmo-mod-panel"><div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong></div>
      <ol class="qrmo-mod-flow">${s.steps.map((t, i) => `<li><span>${i + 1}</span>${esc(t)}</li>`).join("")}</ol></div>`;
  },
  rating(s) {
    const stars = (n) => Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? "on" : ""}">${ICON.star}</i>`).join("");
    return `<div class="qrmo-mod-panel"><div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong></div>
      ${s.criteria.map((c, i) => `<div class="qrmo-mod-field"><span>${esc(c)}</span><span class="qrmo-mod-stars">${stars(i % 2 ? 4 : 5)}</span></div>`).join("")}
      <div class="qrmo-mod-textarea">${esc(s.comment)}</div>
      <div class="qrmo-mod-row-btns is-end"><span class="qrmo-mod-btn-solid">Gönder</span></div></div>`;
  },
  reviews(s) {
    return `<div class="qrmo-mod-panel"><div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong></div>
      ${s.rows.map((r) => `<div class="qrmo-mod-review"><span class="qrmo-mod-thumb"></span><span class="qrmo-mod-card-body"><strong>${esc(r.n)}</strong><small>${esc(r.s)}</small></span>
        <span class="qrmo-mod-row-btns">${r.a.map((a) => `<span class="qrmo-mod-btn-ghost">${esc(a)}</span>`).join("")}</span></div>`).join("")}</div>`;
  },
  matrix(s) {
    return `<div class="qrmo-mod-panel"><div class="qrmo-mod-panel-head"><strong>${esc(s.title)}</strong></div>
      <div class="qrmo-mod-matrix"><span class="qrmo-mod-axis-y">${esc(s.axes[1])}</span>
        <div class="qrmo-mod-mgrid">${s.cells.map((c, i) => `<div class="qrmo-mod-mcell is-${i}"><strong>${esc(c.n)}</strong><small>${esc(c.d)}</small></div>`).join("")}</div>
        <span class="qrmo-mod-axis-x">${esc(s.axes[0])}</span></div></div>`;
  }
};

function mock(spec, label) {
  const fn = MOCK[spec.type];
  if (!fn) throw new Error("Bilinmeyen mock tipi: " + spec.type);
  return `<figure class="qrmo-mod-figure">
    <div class="qrmo-mod-mock" role="img" aria-label="${esc("Temsili arayüz çizimi: " + label)}">${fn(spec)}</div>
    <figcaption>${esc(MOD.mockCaption)}</figcaption></figure>`;
}

/* ---------- ortak parçalar ---------- */

function head({ title, description, url, breadcrumb, cssPath, jsPath }) {
  const ld = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b[0], item: b[1] }))
  };
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow">
<meta name="theme-color" content="#0D2B22">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(MOD.site.brand)}">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<link rel="stylesheet" href="${cssPath}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script defer src="${jsPath}"></script>
</head>`;
}

function topbar(rel, backLabel, backHref) {
  return `<a class="qrmo-mod-skip" href="#icerik">İçeriğe geç</a>
<header class="qrmo-mod-topbar">
  <div class="qrmo-mod-inner qrmo-mod-topbar-in">
    <a class="qrmo-mod-back" href="${backHref}">${ICON.back}<span>${esc(backLabel)}</span></a>
    <a class="qrmo-mod-toplink" href="${rel}paketler/">${esc(MOD.site.pricingLabel)}</a>
  </div>
</header>`;
}

function footer(rel) {
  return `<footer class="qrmo-mod-footer">
  <div class="qrmo-mod-inner qrmo-mod-footer-in">
    <p><strong>${esc(MOD.site.brand)}</strong></p>
    <nav aria-label="Alt bağlantılar">
      <a href="${rel}">Ana sayfa</a>
      <a href="${rel}moduller/">Modüller</a>
      <a href="${rel}paketler/">Paketler</a>
    </nav>
  </div>
</footer>`;
}

const pkgChip = (pkg) => `<span class="qrmo-mod-chip">${esc(pkg.name)} paket</span>`;

/* ---------- modül sayfası ---------- */

function renderModule(m) {
  const rel = "../../";
  const { index: minIdx, pkg } = modulePackage(m);
  const url = `${MOD.site.baseUrl}/moduller/${m.slug}/`;
  const totalItems = m.groups.reduce((n, g) => n + g.items.length, 0);
  const openAll = totalItems <= 6;

  const groups = m.groups.map((g, gi) => `
      <details class="qrmo-mod-group"${g.open || openAll ? " open" : ""}>
        <summary><h3>${esc(g.title)}</h3><span class="qrmo-mod-count">${g.items.length}</span><span class="qrmo-mod-chev">${ICON.chev}</span></summary>
        <ul class="qrmo-mod-items">${g.items.map((it) => `
          <li><h4>${esc(it.t)}</h4><p>${esc(it.d)}</p></li>`).join("")}
        </ul>
      </details>`).join("");

  const featureNames = m.featureIds.map((fid) => featureById(fid).name);
  const tiers = PKG.packages.map((p, i) => {
    const inc = i >= minIdx;
    return `<li class="${inc ? "is-in" : "is-out"}${i === minIdx ? " is-min" : ""}">
        <span class="qrmo-mod-tier-name">${esc(p.name)}</span>
        <span class="qrmo-mod-tier-tag">${esc(p.tagline)}</span>
        <span class="qrmo-mod-tier-state">${inc ? ICON.check : ICON.dash}<span>${inc ? "Dahil" : "Dahil değil"}</span></span></li>`;
  }).join("");

  const related = m.related.map((r) => {
    const rm = bySlug[r.slug];
    return `<li><a href="../${rm.slug}/">
        <span class="qrmo-mod-rel-top"><strong>${esc(rm.name)}</strong>${pkgChip(modulePackage(rm).pkg)}</span>
        <span class="qrmo-mod-rel-why">${esc(r.why)}</span>
        <span class="qrmo-mod-rel-go">${ICON.arrow}</span></a></li>`;
  }).join("");

  const body = `
<main id="icerik" class="qrmo-mod">

  <!-- 1. HERO -->
  <section class="qrmo-mod-hero" aria-labelledby="qrmo-mod-h1">
    <div class="qrmo-mod-inner qrmo-mod-hero-grid">
      <div class="qrmo-mod-hero-copy">
        <p class="qrmo-mod-eyebrow">MODÜLLER • ${esc(up(m.name))}</p>
        <h1 class="qrmo-mod-title" id="qrmo-mod-h1">${esc(m.hero.h1)}</h1>
        <p class="qrmo-mod-lead">${esc(m.hero.lead)}</p>
        <ul class="qrmo-mod-points">${m.hero.points.map((pt) => `
          <li><span class="qrmo-mod-point-ico">${ICON.check}</span><span class="qrmo-mod-point-txt"><strong>${esc(pt.t)}</strong><small>${esc(pt.d)}</small></span></li>`).join("")}
        </ul>
        <p class="qrmo-mod-hero-pkg">${pkgChip(pkg)}<span>${esc(pkg.tagline)}</span></p>
        <div class="qrmo-mod-actions">
          <a class="qrmo-mod-cta" href="${rel}paketler/"><span>${esc(MOD.site.pricingLabel)}</span>${ICON.arrow}</a>
          <a class="qrmo-mod-textlink" href="../">Tüm modüller</a>
        </div>
      </div>
      <div class="qrmo-mod-hero-visual">${mock(m.view.mock, m.name)}</div>
    </div>
  </section>

  <!-- 2. PROBLEM → ÇÖZÜM -->
  <section class="qrmo-mod-ps" aria-labelledby="qrmo-mod-ps-h">
    <div class="qrmo-mod-inner">
      <h2 class="qrmo-mod-sr" id="qrmo-mod-ps-h">Sorun ve çözüm</h2>
      <div class="qrmo-mod-ps-grid">
        <div class="qrmo-mod-ps-col">
          <p class="qrmo-mod-label">SORUN</p>
          <p class="qrmo-mod-statement">${esc(m.problem.title)}</p>
          <p class="qrmo-mod-body">${esc(m.problem.text)}</p>
          <p class="qrmo-mod-scene"><span>Örnek bir an</span>${esc(m.problem.scene)}</p>
        </div>
        <div class="qrmo-mod-ps-col is-solution">
          <p class="qrmo-mod-label">ÇÖZÜM</p>
          <p class="qrmo-mod-statement">${esc(m.solution.title)}</p>
          <p class="qrmo-mod-body">${esc(m.solution.text)}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. ÖZELLİKLER -->
  <section class="qrmo-mod-features" id="ozellikler" aria-labelledby="qrmo-mod-f-h">
    <div class="qrmo-mod-inner qrmo-mod-split">
      <div class="qrmo-mod-head">
        <p class="qrmo-mod-eyebrow">ÖZELLİKLER</p>
        <h2 class="qrmo-mod-h2" id="qrmo-mod-f-h">${esc(m.name)} neler sunar?</h2>
        <p class="qrmo-mod-body">Aşağıdaki başlıklar ürünün mevcut davranışını anlatır.</p>
      </div>
      <div class="qrmo-mod-groups" data-qrmo-groups>${groups}
      ${m.notes && m.notes.length ? `
        <aside class="qrmo-mod-notes" aria-labelledby="qrmo-mod-n-h">
          <h3 id="qrmo-mod-n-h">Bilmeniz gerekenler</h3>
          <ul>${m.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
        </aside>` : ""}
      </div>
    </div>
  </section>

  <!-- 4. NASIL ÇALIŞIR? -->
  <section class="qrmo-mod-steps" aria-labelledby="qrmo-mod-s-h">
    <div class="qrmo-mod-inner">
      <div class="qrmo-mod-head">
        <p class="qrmo-mod-eyebrow">NASIL ÇALIŞIR?</p>
        <h2 class="qrmo-mod-h2" id="qrmo-mod-s-h">${m.steps.length} adımda ${esc(m.name)}.</h2>
      </div>
      <ol class="qrmo-mod-steplist">${m.steps.map((s, i) => `
        <li><span class="qrmo-mod-stepno" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join("")}
      </ol>
    </div>
  </section>

  <!-- 5. ARAYÜZ -->
  <section class="qrmo-mod-view${m.view.flip ? " is-flip" : ""}" aria-labelledby="qrmo-mod-v-h">
    <div class="qrmo-mod-inner qrmo-mod-view-grid">
      <div class="qrmo-mod-head">
        <p class="qrmo-mod-eyebrow">ARAYÜZ</p>
        <h2 class="qrmo-mod-h2" id="qrmo-mod-v-h">İşletme tarafında nasıl görünür?</h2>
        <p class="qrmo-mod-body">${esc(m.view.intro)}</p>
      </div>
      <div class="qrmo-mod-view-visual">${mock(m.view.mock2, m.name + " yönetim ekranı")}</div>
    </div>
  </section>

  <!-- 6. KİMLER İÇİN? -->
  <section class="qrmo-mod-audience" aria-labelledby="qrmo-mod-a-h">
    <div class="qrmo-mod-inner">
      <div class="qrmo-mod-head">
        <p class="qrmo-mod-eyebrow">KİMLER İÇİN?</p>
        <h2 class="qrmo-mod-h2" id="qrmo-mod-a-h">Bu modül kimin işine yarar?</h2>
      </div>
      <ul class="qrmo-mod-who">${m.audience.map((a) => `
        <li><h3>${esc(a.who)}</h3><p>${esc(a.text)}</p></li>`).join("")}
      </ul>
    </div>
  </section>

  <!-- 7. PAKET BİLGİSİ -->
  <section class="qrmo-mod-package" aria-labelledby="qrmo-mod-p-h">
    <div class="qrmo-mod-inner qrmo-mod-split">
      <div class="qrmo-mod-head">
        <p class="qrmo-mod-eyebrow">PAKET BİLGİSİ</p>
        <h2 class="qrmo-mod-h2" id="qrmo-mod-p-h">${esc(pkg.name)} pakette yer alır.</h2>
        <p class="qrmo-mod-body">${esc(m.name)}, <strong>${esc(pkg.name)}</strong> paketinde${minIdx < PKG.packages.length - 1 ? " ve üzerindeki paketlerde" : ""} kullanılabilir. Kapsadığı paket özellikleri: ${esc(featureNames.join(", "))}.</p>
      </div>
      <ol class="qrmo-mod-tiers">${tiers}</ol>
    </div>
  </section>

  <!-- 8. İLGİLİ MODÜLLER -->
  <section class="qrmo-mod-related" aria-labelledby="qrmo-mod-r-h">
    <div class="qrmo-mod-inner">
      <div class="qrmo-mod-head">
        <p class="qrmo-mod-eyebrow">İLGİLİ MODÜLLER</p>
        <h2 class="qrmo-mod-h2" id="qrmo-mod-r-h">Birlikte çalıştığı modüller.</h2>
      </div>
      <ul class="qrmo-mod-rel">${related}</ul>
    </div>
  </section>

  <!-- 9. CTA -->
  <section class="qrmo-mod-final-wrap" aria-labelledby="qrmo-mod-c-h">
    <div class="qrmo-mod-inner">
      <div class="qrmo-mod-final">
        <div>
          <h2 class="qrmo-mod-h2" id="qrmo-mod-c-h">Hangi paketle kullanabileceğinizi görün.</h2>
          <p class="qrmo-mod-lead">Üç paketi ve paketlerdeki özellikleri karşılaştırın.</p>
        </div>
        <a class="qrmo-mod-cta is-on-dark" href="${rel}paketler/"><span>${esc(MOD.site.pricingLabel)}</span>${ICON.arrow}</a>
      </div>
    </div>
  </section>

</main>`;

  return head({
    title: `${m.seo.title} | ${MOD.site.brand}`, description: m.seo.description, url,
    breadcrumb: [["Ana Sayfa", MOD.site.baseUrl + "/"], ["Modüller", MOD.site.baseUrl + "/moduller/"], [m.name, url]],
    cssPath: "../module-page.css", jsPath: "../module-page.js"
  }) + `\n<body class="qrmo-mod-page">\n` + topbar(rel, "Tüm modüller", "../") + body + "\n" + footer(rel) + "\n</body>\n</html>\n";
}

/* ---------- modül dizini ---------- */

function renderIndex() {
  const rel = "../";
  const url = `${MOD.site.baseUrl}/moduller/`;
  const sections = PKG.packages.map((p, i) => {
    const mods = MOD.modules.filter((m) => modulePackage(m).index === i);
    if (!mods.length) return "";
    return `
    <section class="qrmo-mod-hubgroup" aria-labelledby="qrmo-mod-hub-${p.id}">
      <div class="qrmo-mod-inner qrmo-mod-split">
        <div class="qrmo-mod-head">
          <p class="qrmo-mod-eyebrow">${esc(up(p.name))} PAKET</p>
          <h2 class="qrmo-mod-h2" id="qrmo-mod-hub-${p.id}">${esc(p.tagline)}</h2>
        </div>
        <ul class="qrmo-mod-hublist">${mods.map((m) => `
          <li><a href="${m.slug}/"><span><strong>${esc(m.name)}</strong><small>${esc(m.tagline)}</small></span>${ICON.arrow}</a></li>`).join("")}
        </ul>
      </div>
    </section>`;
  }).join("");

  const body = `
<main id="icerik" class="qrmo-mod">
  <section class="qrmo-mod-hero is-hub" aria-labelledby="qrmo-mod-h1">
    <div class="qrmo-mod-inner">
      <p class="qrmo-mod-eyebrow">QR MENU OFFICIAL • MODÜLLER</p>
      <h1 class="qrmo-mod-title" id="qrmo-mod-h1">Ürünün parçalarını tek tek inceleyin.</h1>
      <p class="qrmo-mod-lead">Menüden servise, servisten veriye: her modül kendi sayfasında, gerçek davranışıyla anlatılır.</p>
      <div class="qrmo-mod-actions">
        <a class="qrmo-mod-cta" href="${rel}paketler/"><span>${esc(MOD.site.pricingLabel)}</span>${ICON.arrow}</a>
      </div>
    </div>
  </section>${sections}
</main>`;

  return head({
    title: `Modüller — Ürün Özellikleri | ${MOD.site.brand}`,
    description: "QR Menu Official modülleri: restoran menü, QR masa, çeviri, filtreleme, servis paneli, analitik ve daha fazlası. Her modülün ne yaptığını ve hangi pakette olduğunu görün.",
    url, breadcrumb: [["Ana Sayfa", MOD.site.baseUrl + "/"], ["Modüller", url]],
    cssPath: "module-page.css", jsPath: "module-page.js"
  }) + `\n<body class="qrmo-mod-page">\n` + topbar(rel, "Ana sayfa", rel) + body + "\n" + footer(rel) + "\n</body>\n</html>\n";
}

/* ---------- yaz ---------- */

if (problems.length) {
  console.error("Doğrulama uyarıları:\n - " + problems.join("\n - "));
  if (process.argv.includes("--strict")) process.exit(1);
}

MOD.modules.forEach((m) => {
  const dir = path.join(ROOT, m.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), renderModule(m));
});
fs.writeFileSync(path.join(ROOT, "index.html"), renderIndex());

/* Site haritası: mevcut bir dağıtım sistemi varsayılmaz; dosya yalnızca üretilir.
   robots.txt'e eklemek veya mevcut sitemap'e katmak dağıtım tarafının işidir. */
const urls = [`${MOD.site.baseUrl}/paketler/`, `${MOD.site.baseUrl}/moduller/`]
  .concat(MOD.modules.map((m) => `${MOD.site.baseUrl}/moduller/${m.slug}/`));
fs.writeFileSync(path.join(ROOT, "..", "sitemap-paketler-moduller.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join("\n") + `\n</urlset>\n`);

console.log(`${MOD.modules.length} modül sayfası + dizin + sitemap üretildi.`);
