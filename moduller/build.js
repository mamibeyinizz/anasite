#!/usr/bin/env node
/* =========================================================
   QR MENU OFFICIAL — /moduller/ SAYFA ÜRETİCİSİ
   Kullanım:  node moduller/build.js  [--strict]

   Girdi : moduller/module-data.js      (modül içerikleri + sunum alanları)
           paketler/packages-data.js    (paket matrisi — source of truth)
           sss/faq-data.mjs             (SSS soru kimlikleri ve metinleri)
   Çıktı : moduller/<slug>/index.html   (her modül için)
           moduller/index.html          (modül dizini)
           sitemap-paketler-moduller.xml

   Neden statik üretim? Başlık, meta açıklama, canonical ve tüm içerik
   HTML'de hazır gelir (SEO); sayfa JS'siz de tam okunur ve kullanılır.
   Ortak tasarım module-page.css; site başlığı/alt bilgisi global/ (applyGlobal).
========================================================= */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { pathToFileURL } = require("url");

const ROOT = __dirname;
const MOD = require(path.join(ROOT, "module-data.js"));

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "..", "paketler", "packages-data.js"), "utf8"), sandbox);
const PKG = sandbox.window.QRMO_PRICING;

/* ---------- yardımcılar ---------- */

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/* İki cümlelik hub başlığı: cümleler ayrı satırda kırılır, punto ve aile değişmez. */
const hubH1 = (s) => {
  const parts = String(s).split(/\.\s+/);
  if (parts.length < 2) return esc(s);
  return parts.map((p, i) => esc(i < parts.length - 1 && !p.endsWith(".") ? p + "." : p)).join("<br>");
};
const up = (s) => String(s).toLocaleUpperCase("tr");
const pad = (n) => String(n).padStart(2, "0");
const join = (arr, fn) => (arr || []).map(fn).join("");

const svg = (d, o = {}) => `<svg viewBox="0 0 24 24" fill="${o.fill || "none"}" stroke="${o.fill ? "none" : "currentColor"}" stroke-width="${o.w || 2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
const ICON = {
  arrow: svg('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  chev: svg('<path d="m6 9 6 6 6-6"/>', { w: 2.2 }),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', { w: 2.6 }),
  dash: svg('<path d="M7 12h10"/>', { w: 2.2 }),
  menu: svg('<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>'),
  x: svg('<path d="M6 6l12 12"/><path d="M18 6 6 18"/>'),
  send: svg('<path d="M4 12h13"/><path d="m12 6 6 6-6 6"/>', { w: 2.4 }),
  lock: svg('<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
  spark: svg('<path d="M12 3.5 13.9 10 20.5 12l-6.6 2L12 20.5 10.1 14 3.5 12l6.6-2L12 3.5Z"/>', { w: 1.6 }),
  bell: svg('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 20.5h4"/>'),
  doc: svg('<path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5v4h4"/>'),
  plus: svg('<path d="M12 5v14"/><path d="M5 12h14"/>', { w: 2.4 })
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

/* "Tüm paketlerde" · "Pro ve Plus paketlerinde" · "Plus paketinde" */
function pkgWhere(minIdx) {
  const names = PKG.packages.slice(minIdx).map((p) => p.name);
  if (names.length === PKG.packages.length) return "tüm paketlerde";
  if (names.length === 1) return `${names[0]} paketinde`;
  return `${names.slice(0, -1).join(", ")} ve ${names[names.length - 1]} paketlerinde`;
}
const pkgShort = (minIdx) => {
  const w = pkgWhere(minIdx);
  return w.charAt(0).toLocaleUpperCase("tr") + w.slice(1);
};

const bySlug = {};
MOD.modules.forEach((m) => { bySlug[m.slug] = m; });
const catById = {};
MOD.categories.forEach((c) => { catById[c.id] = c; });

/* =========================================================
   TEMSİLİ ARAYÜZ (MOCK) — frame + blocks
   Tümü tek bir role="img" kapsayıcısı içinde çizilir; ekran okuyucu
   yalnızca veri dosyasındaki `alt` açıklamasını duyar (tekrar yok).
========================================================= */

/* Dekoratif, kodlanmamış QR benzeri desen. Tek <path>; okutulamaz. */
function qrSvg(seed, n = 21) {
  let s = (seed * 9301 + 49297) % 233280;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const inFinder = (r, c) => (r < 8 && c < 8) || (r < 8 && c > n - 9) || (r > n - 9 && c < 8);
  const finder = (r, c) => {
    const f = (rr, cc) => { const d = Math.max(Math.abs(rr - 3), Math.abs(cc - 3)); return d === 3 || d <= 1; };
    if (r < 7 && c < 7) return f(r, c);
    if (r < 7 && c > n - 8) return f(r, c - (n - 7));
    if (r > n - 8 && c < 7) return f(r - (n - 7), c);
    return false;
  };
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    let on;
    if (inFinder(r, c)) on = finder(r, c);
    else if (r === 6) on = c % 2 === 0;
    else if (c === 6) on = r % 2 === 0;
    else on = rnd() > 0.52;
    if (on) d += `M${c} ${r}h1v1h-1z`;
  }
  return `<svg class="qm-qr" viewBox="-1 -1 ${n + 2} ${n + 2}" aria-hidden="true" focusable="false" shape-rendering="crispEdges"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/><path d="${d}" fill="currentColor"/></svg>`;
}

function barsSvg(a, b) {
  const w = 10, gap = 4, h = 100, max = Math.max(...a, ...(b || [0]));
  let d1 = "", d2 = "";
  a.forEach((v, i) => {
    const x = i * (w + gap);
    const h1 = Math.max(2, Math.round((v / max) * (h - 6)));
    d1 += `M${x} ${h - h1}h${b ? 4.5 : w}v${h1}h-${b ? 4.5 : w}z`;
    if (b) { const h2 = Math.max(2, Math.round((b[i] / max) * (h - 6))); d2 += `M${x + 5.5} ${h - h2}h4.5v${h2}h-4.5z`; }
  });
  const W = a.length * (w + gap) - gap;
  return `<svg class="qm-bars" viewBox="0 0 ${W} ${h}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="s1" d="${d1}"/>${b ? `<path class="s2" d="${d2}"/>` : ""}</svg>`;
}

const hot = (n, html) => (n ? `<div class="qm-h" data-hot="${Number(n)}">${html}</div>` : html);

const BLOCK = {
  head: (k) => `<div class="qm-head"><strong>${esc(k.title)}</strong>${k.badge ? `<em class="qm-pill">${esc(k.badge)}</em>` : ""}</div>`,
  appbar: (k) => `<div class="qm-appbar">${k.avatar ? `<span class="qm-ava">${ICON.spark}</span>` : `<span class="qm-logo">QR</span>`}<span class="qm-appbar-t"><strong>${esc(k.title)}</strong>${k.sub ? `<small>${esc(k.sub)}</small>` : ""}</span>${k.close ? `<span class="qm-x">${ICON.x}</span>` : ""}</div>`,
  search: (k) => `<div class="qm-search">${ICON.search}<span>${esc(k.text)}</span></div>`,
  tabs: (k) => `<div class="qm-tabs">${join(k.items, (t, i) => `<span${i === k.on ? ' class="on"' : ""}>${esc(t)}</span>`)}</div>`,
  langs: (k) => `<div class="qm-langs">${join(k.items, (t, i) => `<span${i === k.on ? ' class="on"' : ""}>${esc(t)}</span>`)}</div>`,
  chips: (k) => `<div class="qm-chips${k.size === "s" ? " qm-chips--s" : ""}">${k.label ? `<span class="qm-lbl">${esc(k.label)}</span>` : ""}<div class="qm-chip-row">${join(k.items, (t, i) => `<span class="qm-chip${(k.on || []).includes(i) ? " on" : ""}">${esc(t)}</span>`)}</div></div>`,
  item: (k) => `<div class="qm-item${k.off ? " off" : ""}"><span class="qm-thumb"></span><span class="qm-item-b"><strong>${esc(k.n)}</strong><small>${esc(k.m)}</small></span><span class="qm-item-s"><b>${esc(k.p)}</b>${k.tag ? `<em${k.off ? ' class="warn"' : ""}>${esc(k.tag)}</em>` : ""}</span></div>`,
  detail: (k) => `<div class="qm-detail"><span class="qm-detail-img"></span><div class="qm-detail-h"><span><strong>${esc(k.n)}</strong><small>${esc(k.c)}</small></span><b>${esc(k.p)}</b></div><div class="qm-kv">${join(k.rows, (r) => `<span><small>${esc(r.l)}</small><b>${esc(r.v)}</b></span>`)}</div><div class="qm-chip-row">${join(k.tags, (t) => `<span class="qm-chip on">${esc(t)}</span>`)}</div></div>`,
  fields: (k) => `<div class="qm-fields${k.cols === 3 ? " qm-fields--3" : ""}">${join(k.items, (f) => `<span class="qm-field"><small>${esc(f.l)}</small><b>${esc(f.v)}</b></span>`)}</div>`,
  toggles: (k) => `<div class="qm-toggles">${join(k.items, (t) => `<span class="qm-tg${t.on ? " on" : ""}"><i></i>${esc(t.l)}</span>`)}</div>`,
  range: (k) => `<div class="qm-range"><span class="qm-lbl">${esc(k.label)}</span><div><span>${esc(k.from)}</span><span${/\d/.test(k.to) ? ' class="on"' : ""}>${esc(k.to)}</span></div></div>`,
  btns: (k) => `<div class="qm-btns${k.full ? " full" : ""}">${join(k.items, (t, i) => `<span class="qm-btn${i === k.solid ? " solid" : ""}">${esc(t)}</span>`)}</div>`,
  note: (k) => `<p class="qm-note">${esc(k.text)}</p>`,
  result: (k) => `<p class="qm-result">${ICON.check}<span>${esc(k.text)}</span></p>`,
  table: (k) => `<div class="qm-table qm-c${k.cols.length}"><div class="qm-tr qm-th">${join(k.cols, (c) => `<span>${esc(c)}</span>`)}</div>${join(k.rows, (r, i) => `<div class="qm-tr${i === k.hl ? " hl" : ""}">${join(r, (c, j) => `<span${k.empty && k.empty[0] === i && k.empty[1] === j ? ' class="empty"' : ""}>${esc(c)}</span>`)}</div>`)}</div>`,
  kanban: (k) => `<div class="qm-kanban qm-k${k.cols.length}">${join(k.cols, (c) => `<div class="qm-col"><span class="qm-col-h">${esc(c.n)}<b>${c.cards.length}</b></span>${join(c.cards, (x) => `<span class="qm-kc${x.s ? " " + x.s : ""}"${x.hot ? ` data-hot="${Number(x.hot)}"` : ""}><span class="qm-kc-top"><em>${esc(x.k)}</em><i>${esc(x.a)}</i></span><strong>${esc(x.t)}</strong>${x.m ? `<small>${esc(x.m)}</small>` : ""}</span>`)}</div>`)}</div>`,
  toolbar: (k) => `<div class="qm-toolbar">${hot(k.hot, `<div class="qm-chip-row">${join(k.chips, (t, i) => `<span class="qm-chip${i === k.on ? " on" : ""}">${esc(t)}</span>`)}</div>`)}${hot(k.hotT, `<div class="qm-toggles qm-toggles--row">${join(k.toggles, (t) => `<span class="qm-tg${t.on ? " on" : ""}"><i></i>${esc(t.l)}</span>`)}</div>`)}</div>`,
  actions: (k) => `<div class="qm-actions">${join(k.items, (a) => `<span class="qm-act${a.on ? " on" : ""}">${a.on ? ICON.send : ICON.bell}${esc(a.t)}</span>`)}</div>`,
  chat: (k) => `<div class="qm-chat">${join(k.messages, (m) => hot(m.hot, `<div class="qm-msg ${m.from === "user" ? "user" : "bot"}"><p>${esc(m.text)}</p>${m.card ? `<span class="qm-mcard"><span class="qm-thumb"></span><span class="qm-item-b"><strong>${esc(m.card.n)}</strong><small>${esc(m.card.m)}</small></span><b>${esc(m.card.p)}</b></span>` : ""}</div>`))}</div>`,
  quick: (k) => `<div class="qm-quick">${join(k.items, (t) => `<span>${esc(t)}</span>`)}</div>`,
  input: (k) => `<div class="qm-input"><span>${esc(k.text)}</span><i>${ICON.send}</i></div>`,
  list: (k) => `<div class="qm-list">${join(k.items, (it) => `<span class="qm-li"><strong>${esc(it.t)}</strong><small>${esc(it.s)}</small></span>`)}</div>`,
  kpis: (k) => `<div class="qm-kpis">${join(k.items, (x) => `<span class="qm-kpi"><small>${esc(x.l)}</small><strong>${esc(x.v)}</strong>${x.d ? `<em>${esc(x.d)}</em>` : ""}</span>`)}</div>`,
  chart: (k) => `<div class="qm-chart"><span class="qm-lbl">${esc(k.title)}</span>${barsSvg(k.bars, k.bars2)}<div class="qm-axis">${join(k.labels, (l) => `<span>${esc(l)}</span>`)}</div>${k.legend ? `<div class="qm-legend">${join(k.legend, (l, i) => `<span class="l${i + 1}">${esc(l)}</span>`)}</div>` : ""}</div>`,
  rank: (k) => `<div class="qm-rank">${k.title ? `<span class="qm-lbl">${esc(k.title)}</span>` : ""}${join(k.rows, (r) => `<div class="qm-rk"><span class="qm-rk-l">${esc(r.l)}${r.s ? `<small>${esc(r.s)}</small>` : ""}</span><b>${esc(r.v)}</b><i style="--w:${Number(r.w)}%"></i></div>`)}</div>`,
  funnel: (k) => `<div class="qm-funnel">${join(k.rows, (r) => `<div class="qm-fn"><span>${esc(r.l)}</span><i style="--w:${Number(r.w)}%"></i><b>${esc(r.v)}</b></div>`)}</div>`,
  stars: (k) => `<div class="qm-stars">${join(k.items, (x) => `<div class="qm-star-row"><span>${esc(x.l)}</span><span class="qm-star" style="--n:${Number(x.n)}"><i></i></span></div>`)}</div>`,
  textarea: (k) => `<div class="qm-ta">${esc(k.text)}</div>`,
  reviews: (k) => `<div class="qm-reviews">${join(k.rows, (r) => `<div class="qm-rev"><span class="qm-rev-b"><strong>${esc(r.n)}</strong><small>${esc(r.s)}</small></span><em class="qm-st${r.st === "Bekliyor" ? " wait" : ""}">${esc(r.st)}</em><span class="qm-btns">${join(r.a, (t, i) => `<span class="qm-btn${i === 0 && r.st === "Bekliyor" ? " solid" : ""}">${esc(t)}</span>`)}</span></div>`)}</div>`,
  matrix: (k) => `<div class="qm-matrix"><span class="qm-ax-y">${esc(k.y)} ↑</span><div class="qm-mgrid">${join(k.quads, (q, i) => `<div class="qm-q qm-q${i}"><strong>${esc(q.n)}</strong><small>${esc(q.d)}</small><span class="qm-dots">${join(q.dots, (d) => `<span class="qm-dot${d.on ? " on" : ""}"><i></i>${esc(d.l)}</span>`)}</span></div>`)}</div><span class="qm-ax-x">${esc(k.x)} →</span></div>`,
  insight: (k) => `<div class="qm-insight"><span class="qm-lbl">${esc(k.k)}</span><strong>${esc(k.n)}</strong><em class="qm-pill">${esc(k.g)}</em><p>${esc(k.d)}</p><p class="qm-insight-a">${ICON.arrow}<span>${esc(k.a)}</span></p></div>`,
  qrcard: (k) => `<div class="qm-qrcard"><span class="qm-qrcard-n">${esc(k.name)}</span>${qrSvg(k.seed || 7)}</div>`,
  session: (k) => `<div class="qm-session">${ICON.check}<span><small>${esc(k.s)}</small><strong>${esc(k.t)}</strong></span></div>`,
  lock: (k) => `<div class="qm-lock"><span class="qm-lock-i">${ICON.lock}</span><strong>${esc(k.t)}</strong><span class="qm-lock-l"></span><span class="qm-lock-l s"></span></div>`,
  sessionbar: (k) => `<div class="qm-sbar"><div class="qm-sbar-row"><span>Oturum süresi</span><b>${esc(k.total)}</b><i style="--w:${Number(k.now)}%"></i></div><div class="qm-sbar-row idle"><span>Hareketsizlik</span><b>${esc(k.idle)}</b><i style="--w:18%"></i></div></div>`,
  total: (k) => `<div class="qm-total">${join(k.rows, (r) => `<span><small>${esc(r.l)}</small><b>${esc(r.v)}</b></span>`)}<span class="strong"><small>${esc(k.strong.l)}</small><b>${esc(k.strong.v)}</b></span></div>`,
  cols: (k) => `<div class="qm-cols${k.split ? " qm-cols--" + k.split : ""}">${join(k.cols, (c) => `<div class="qm-col-in">${blocks(c)}</div>`)}</div>`
};

function block(k) {
  const fn = BLOCK[k.b];
  if (!fn) throw new Error("Bilinmeyen mock bloğu: " + k.b);
  const html = fn(k);
  /* toolbar ve chat işaretçilerini kendi içinde yerleştirir */
  return k.b === "toolbar" ? html : hot(k.hot, html);
}
const blocks = (arr) => join(arr, block);

function frame(f) {
  const th = f.theme === "dark" ? " qm-dark" : "";
  switch (f.frame) {
    case "phone":
      return `<div class="qm-phone${th}"><div class="qm-screen">${blocks(f.blocks)}</div></div>`;
    case "window":
      return `<div class="qm-win${th}"><div class="qm-win-bar"><span class="qm-win-dots"><i></i><i></i><i></i></span><span class="qm-win-t">${esc(f.title)}</span>${f.badge ? `<em class="qm-pill qm-pill--demo">${esc(f.badge)}</em>` : ""}</div><div class="qm-win-body">${blocks(f.blocks)}</div></div>`;
    case "card":
      return `<div class="qm-card">${blocks(f.blocks)}</div>`;
    case "scene":
      return `<div class="qm-scene qm-scene--${f.layout}">${join(f.items, (it, i) => `<div class="qm-si qm-si${i + 1}">${frame(it)}${it.label ? `<span class="qm-si-label">${esc(it.label)}</span>` : ""}</div>`)}</div>`;
    default:
      throw new Error("Bilinmeyen mock çerçevesi: " + f.frame);
  }
}

function figure(spec, { caption = MOD.mockCaptionShort || "Temsili arayüz · örnek içerik", cls = "" } = {}) {
  if (!spec.alt) throw new Error("Mock için alt metni eksik: " + JSON.stringify(spec).slice(0, 80));
  return `<figure class="qrmo-mod-fig${cls ? " " + cls : ""}">
        <div class="qrmo-mod-shot" role="img" aria-label="${esc(spec.alt)}">${frame(spec)}</div>
        <figcaption class="qrmo-mod-cap">${esc(caption)}</figcaption>
      </figure>`;
}

/* =========================================================
   MODÜL İŞARETİ (hub kartları, ilgili modüller) — dekoratif mini çizim
========================================================= */

function cue(key) {
  const inner = {
    menu: "<i></i><i></i><i class=\"off\"></i>",
    qr: qrSvg(3, 13),
    lang: "<b>TR</b><b class=\"on\">EN</b><b>DE</b><b>AR</b>",
    filter: "<b class=\"on\"></b><b></b><b class=\"on\"></b><b></b><u></u>",
    kanban: "<i><b class=\"late\"></b><b></b></i><i><b></b></i><i><b></b><b class=\"done\"></b></i>",
    shield: "<i></i><u></u>",
    chat: "<i></i><i class=\"u\"></i><i></i>",
    chart: "<i style=\"--h:35%\"></i><i style=\"--h:60%\"></i><i style=\"--h:45%\"></i><i style=\"--h:85%\"></i><i style=\"--h:70%\"></i>",
    stars: "<u></u><i style=\"--w:92%\"></i><i style=\"--w:68%\"></i><i style=\"--w:84%\"></i>",
    matrix: "<i></i><i class=\"on\"></i><i></i><i></i>"
  }[key];
  if (inner == null) throw new Error("Bilinmeyen modül işareti: " + key);
  return `<span class="qrmo-mod-cue qrmo-mod-cue--${key}" aria-hidden="true">${inner}</span>`;
}

/* Hub kartı illüstrasyonu. Ayrıntı sayfalarındaki küçük işaret (cue) ayrı kalır.
   Ortak dil: viewBox 200×120, çizgi 1.75, köşe 8–10, krem + altın, orman yeşili zemin.
   Dekoratif: kart bağlantısının adı modül başlığından gelir. */
function moduleArt(key) {
  const cream = "#F4F1E8";
  const gold = "#C9A84C";
  const goldL = "#E8C766";
  const ink = "#0D2B22";
  const sw = 'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
  const star = "M0-7.2 2.1-2.2 7.6-1.6 3.6 2.2 4.6 7.6 0 4.8-4.6 7.6-3.6 2.2-7.6-1.6-2.1-2.2Z";
  const starAt = (x, y, fill, scale) => `<path d="${star}" fill="${fill}" transform="translate(${x} ${y}) scale(${scale || 1})"/>`;
  const scenes = {
    menu: `
      <rect x="46" y="14" width="108" height="92" rx="10" stroke="${cream}" ${sw}/>
      <rect x="58" y="26" width="36" height="10" rx="5" fill="${goldL}"/>
      <rect x="98" y="26" width="24" height="10" rx="5" stroke="${cream}" ${sw}/>
      <rect x="126" y="26" width="16" height="10" rx="5" stroke="${cream}" ${sw} opacity=".45"/>
      <circle cx="68" cy="52" r="7" stroke="${goldL}" ${sw}/>
      <circle cx="68" cy="52" r="2.4" fill="${goldL}"/>
      <path d="M82 52h34" stroke="${cream}" ${sw}/>
      <path d="M128 52h14" stroke="${goldL}" ${sw}/>
      <circle cx="68" cy="72" r="7" stroke="${cream}" ${sw}/>
      <path d="M82 72h28" stroke="${cream}" ${sw} opacity=".8"/>
      <path d="M122 72h20" stroke="${cream}" ${sw} opacity=".8"/>
      <g opacity=".38">
        <circle cx="68" cy="92" r="7" stroke="${cream}" ${sw}/>
        <path d="M82 92h26" stroke="${cream}" ${sw}/>
        <path d="M120 92h22" stroke="${cream}" ${sw}/>
      </g>`,
    qr: `
      <ellipse cx="100" cy="102" rx="66" ry="9" stroke="${cream}" ${sw}/>
      <rect x="72" y="26" width="56" height="70" rx="8" stroke="${cream}" ${sw}/>
      <rect x="82" y="38" width="16" height="16" rx="2" stroke="${goldL}" ${sw}/>
      <rect x="86" y="42" width="8" height="8" fill="${goldL}"/>
      <rect x="104" y="38" width="16" height="16" rx="2" stroke="${cream}" ${sw}/>
      <rect x="108" y="42" width="8" height="8" fill="${cream}"/>
      <rect x="84" y="60" width="5" height="5" fill="${cream}"/>
      <rect x="92" y="60" width="5" height="5" fill="${goldL}"/>
      <rect x="108" y="60" width="5" height="5" fill="${cream}" opacity=".7"/>
      <rect x="100" y="68" width="5" height="5" fill="${cream}"/>
      <rect x="112" y="72" width="5" height="5" fill="${goldL}"/>
      <path d="M84 84h32" stroke="${cream}" ${sw} opacity=".45"/>`,
    kanban: `
      <rect x="22" y="18" width="156" height="84" rx="10" stroke="${cream}" ${sw}/>
      <rect x="34" y="32" width="40" height="58" rx="8" stroke="${cream}" ${sw}/>
      <path d="M46 60c0-8 3.6-13 8-13s8 5 8 13" stroke="${cream}" ${sw}/>
      <path d="M43 60h22" stroke="${cream}" ${sw}/>
      <circle cx="54" cy="66" r="2.2" fill="${cream}"/>
      <rect x="80" y="32" width="40" height="58" rx="8" fill="${goldL}" fill-opacity=".16" stroke="${goldL}" ${sw}/>
      <circle cx="100" cy="54" r="9" stroke="${goldL}" ${sw}/>
      <circle cx="100" cy="54" r="3" fill="${goldL}"/>
      <path d="M86 70h28" stroke="${goldL}" ${sw}/>
      <rect x="126" y="32" width="40" height="58" rx="8" stroke="${cream}" ${sw}/>
      <path d="M136 50h20M136 58h14M136 66h18" stroke="${cream}" ${sw}/>`,
    chart: `
      <rect x="28" y="16" width="144" height="88" rx="10" stroke="${cream}" ${sw}/>
      <path d="M46 86h112" stroke="${cream}" ${sw} opacity=".4"/>
      <rect x="54" y="64" width="14" height="22" rx="4" fill="${cream}" opacity=".4"/>
      <rect x="76" y="52" width="14" height="34" rx="4" fill="${cream}" opacity=".62"/>
      <rect x="98" y="36" width="14" height="50" rx="4" fill="${goldL}"/>
      <rect x="120" y="46" width="14" height="40" rx="4" fill="${cream}" opacity=".5"/>
      <path d="M61 58 83 48 105 34 127 44" stroke="${gold}" ${sw}/>
      <circle cx="105" cy="34" r="3.5" fill="${goldL}"/>`,
    chat: `
      <rect x="24" y="18" width="92" height="34" rx="10" stroke="${cream}" ${sw}/>
      <path d="M40 35h52" stroke="${cream}" ${sw} opacity=".75"/>
      <path d="M40 52 30 64h16" stroke="${cream}" ${sw}/>
      <rect x="72" y="58" width="104" height="44" rx="10" stroke="${goldL}" ${sw}/>
      <circle cx="94" cy="80" r="9" stroke="${goldL}" ${sw}/>
      <circle cx="94" cy="80" r="3" fill="${goldL}"/>
      <path d="M112 74h48" stroke="${goldL}" ${sw}/>
      <path d="M112 88h32" stroke="${cream}" ${sw} opacity=".75"/>
      <path d="M168 50l1.5 3.4 3.6.4-2.7 2.3.8 3.5-3.2-1.9-3.2 1.9.8-3.5-2.7-2.3 3.6-.4Z" fill="${goldL}"/>`,
    matrix: `
      <path d="M40 22v80H172" stroke="${cream}" ${sw}/>
      <path d="M35 32 40 22l5 10" stroke="${cream}" ${sw}/>
      <path d="M162 97l10 5-10 5" stroke="${cream}" ${sw}/>
      <rect x="52" y="34" width="52" height="28" rx="8" stroke="${cream}" ${sw} opacity=".55"/>
      <rect x="112" y="34" width="52" height="28" rx="8" fill="${goldL}"/>
      <rect x="52" y="68" width="52" height="28" rx="8" stroke="${cream}" ${sw} opacity=".32"/>
      <rect x="112" y="68" width="52" height="28" rx="8" stroke="${cream}" ${sw} opacity=".7"/>
      <circle cx="78" cy="48" r="4" stroke="${cream}" ${sw}/>
      ${starAt(138, 48, ink, 0.85)}
      <circle cx="78" cy="82" r="4" fill="${cream}" opacity=".28"/>
      <circle cx="138" cy="82" r="4" fill="${cream}" opacity=".7"/>`,
    filter: `
      <rect x="22" y="16" width="46" height="20" rx="10" stroke="${cream}" ${sw}/>
      <rect x="74" y="16" width="58" height="20" rx="10" fill="${goldL}"/>
      <path d="M90 26l6 6 12-12" stroke="${ink}" ${sw}/>
      <rect x="138" y="16" width="40" height="20" rx="10" stroke="${cream}" ${sw} opacity=".55"/>
      <rect x="22" y="48" width="156" height="18" rx="8" stroke="${cream}" ${sw}/>
      <circle cx="38" cy="57" r="3.5" fill="${goldL}"/>
      <path d="M50 57h78" stroke="${cream}" ${sw} opacity=".8"/>
      <rect x="22" y="72" width="156" height="18" rx="8" stroke="${cream}" ${sw}/>
      <circle cx="38" cy="81" r="3.5" fill="${goldL}"/>
      <path d="M50 81h64" stroke="${cream}" ${sw} opacity=".8"/>
      <g opacity=".42">
        <rect x="22" y="96" width="156" height="16" rx="8" stroke="${cream}" ${sw}/>
        <path d="M50 104h52" stroke="${cream}" ${sw}/>
      </g>`,
    lang: `
      <circle cx="58" cy="60" r="34" stroke="${cream}" ${sw}/>
      <ellipse cx="58" cy="60" rx="14" ry="34" stroke="${cream}" ${sw} opacity=".7"/>
      <path d="M24 60h68M32 44h52M32 76h52" stroke="${cream}" ${sw} opacity=".55"/>
      <rect x="108" y="24" width="40" height="22" rx="8" stroke="${cream}" ${sw}/>
      <rect x="152" y="24" width="40" height="22" rx="8" fill="${goldL}"/>
      <rect x="108" y="54" width="40" height="22" rx="8" stroke="${cream}" ${sw} opacity=".75"/>
      <rect x="152" y="54" width="40" height="22" rx="8" stroke="${cream}" ${sw} opacity=".75"/>
      <text x="128" y="39" text-anchor="middle" fill="${cream}" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700">TR</text>
      <text x="172" y="39" text-anchor="middle" fill="${ink}" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700">EN</text>
      <text x="128" y="69" text-anchor="middle" fill="${cream}" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700">DE</text>
      <text x="172" y="69" text-anchor="middle" fill="${cream}" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700">AR</text>`,
    shield: `
      <path d="M72 16 110 32v26c0 20-14 34-38 42-24-8-38-22-38-42V32L72 16Z" stroke="${cream}" ${sw}/>
      <path d="M58 54l10 10 20-22" stroke="${goldL}" ${sw}/>
      <circle cx="150" cy="58" r="26" stroke="${cream}" ${sw} opacity=".4"/>
      <path d="M150 32a26 26 0 0 1 22 40" stroke="${goldL}" ${sw}/>
      <path d="M150 58V42M150 58l12 8" stroke="${gold}" ${sw}/>
      <circle cx="150" cy="58" r="2.6" fill="${goldL}"/>
      <ellipse cx="108" cy="106" rx="62" ry="7" stroke="${cream}" ${sw} opacity=".55"/>`,
    stars: `
      ${starAt(34, 28, goldL, 0.92)}
      ${starAt(54, 28, goldL, 0.92)}
      ${starAt(74, 28, goldL, 0.92)}
      ${starAt(94, 28, goldL, 0.92)}
      <path d="${star}" fill="${cream}" opacity=".28" transform="translate(114 28) scale(.92)"/>
      <rect x="24" y="48" width="152" height="52" rx="10" stroke="${cream}" ${sw}/>
      <path d="M40 68h84" stroke="${cream}" ${sw} opacity=".85"/>
      <path d="M40 82h56" stroke="${cream}" ${sw} opacity=".5"/>
      <circle cx="158" cy="74" r="16" fill="${goldL}"/>
      <path d="M151 74h14M159 67l7 7-7 7" stroke="${ink}" ${sw}/>`
  };
  const body = scenes[key];
  if (body == null) throw new Error("Bilinmeyen modül görseli: " + key);
  return `<span class="qrmo-mod-card-art"><svg class="qrmo-mod-art" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${body}</svg></span>`;
}

/* =========================================================
   ORTAK SAYFA PARÇALARI
========================================================= */

function head({ title, description, url, breadcrumb, cssPath, extraHead = "" }) {
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
<meta name="theme-color" content="#FDFBF5">
<meta name="color-scheme" content="light">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(MOD.site.brand)}">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<link rel="stylesheet" href="${cssPath}">
${extraHead ? extraHead + "\n" : ""}<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
</head>`;
}

/* Site başlığı ve alt bilgisi global/ altındadır (global/render.mjs); sayfalara
   applyGlobal() ile yerleştirilir. Modül sayfalarında kendi header/footer'ı yoktur. */

function crumbs(items) {
  return `<nav class="qrmo-mod-crumbs qrmo-mod-inner" aria-label="Sayfa konumu"><ol>${join(items, (c, i) => (i === items.length - 1
    ? `<li aria-current="page">${esc(c[0])}</li>`
    : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`))}</ol></nav>`;
}

const kicker = (t, extra = "") => `<p class="qrmo-mod-kicker${extra}">${esc(t)}</p>`;
const caveat = (t) => (t ? `<p class="qrmo-mod-caveat">${ICON.info}<span>${esc(t)}</span></p>` : "");

function ctaRow(rel, back, { dark = false, modulesLabel } = {}) {
  return `<div class="qrmo-mod-actions">
          <a class="qrmo-mod-cta${dark ? " qrmo-mod-cta--ondark" : ""}" href="${rel}paketler/"><span>${esc(MOD.site.pricingLabel)}</span>${ICON.arrow}</a>
          <a class="qrmo-mod-textlink${dark ? " qrmo-mod-textlink--ondark" : ""}" href="${back}">${esc(modulesLabel || MOD.site.modulesLabel)}</a>
        </div>`;
}

/* Modül Design V2: numaralı bölüm işaretçileri (yalnızca designV2 modüllerde). */
const V2_MARKER_LABEL = { story: "story", stage: "stage", capabilities: "capabilities", details: "AYRINTILAR" };

function v2Marker(m, ctx, sectionKey) {
  if (!m.designV2) return "";
  const src = V2_MARKER_LABEL[sectionKey];
  const label = src === "AYRINTILAR" ? src : (m[src] && m[src].kicker);
  if (!label) return "";
  ctx.v2MarkerN = (ctx.v2MarkerN || 0) + 1;
  return `<div class="qrmo-mod-v2-marker"><span class="qrmo-mod-v2-marker-t">${pad(ctx.v2MarkerN)} — ${esc(up(label))}</span><span class="qrmo-mod-v2-marker-rule" aria-hidden="true"></span></div>`;
}

function v2SkipKicker(m, sectionKey) {
  return Boolean(m.designV2 && V2_MARKER_LABEL[sectionKey]);
}

function v2InnerOpen(m, ctx, sectionKey, extraInnerClass = "", mainClass = "") {
  const extra = extraInnerClass ? ` ${extraInnerClass}` : "";
  const main = mainClass ? ` qrmo-mod-v2-main ${mainClass}` : " qrmo-mod-v2-main";
  if (!m.designV2 || !V2_MARKER_LABEL[sectionKey]) return `<div class="qrmo-mod-inner${extra}">`;
  return `<div class="qrmo-mod-inner qrmo-mod-v2-inner${extra}">${v2Marker(m, ctx, sectionKey)}<div class="${main.trim()}">`;
}

function v2InnerClose(m, sectionKey) {
  if (!m.designV2 || !V2_MARKER_LABEL[sectionKey]) return "</div>";
  return "</div></div>";
}

function v2SecClass(m, sectionKey) {
  return m.designV2 && V2_MARKER_LABEL[sectionKey] ? " qrmo-mod-v2-sec" : "";
}

/* Modül context nav — V2 işaretçileriyle aynı etiket kaynağı. */
const CTX_NAV_SKIP = new Set(["hero", "related", "closing"]);

function ctxNavSectionLabel(m, sectionKey) {
  if (sectionKey === "details") return "AYRINTILAR";
  if (m.designV2 && V2_MARKER_LABEL[sectionKey]) {
    const src = V2_MARKER_LABEL[sectionKey];
    if (src === "AYRINTILAR") return src;
    const sec = m[src];
    return sec && sec.kicker ? sec.kicker : "";
  }
  const sec = m[sectionKey];
  return sec && sec.kicker ? sec.kicker : "";
}

function ctxNavSectionHash(sectionKey) {
  if (sectionKey === "details") return "ayrintilar";
  if (sectionKey === "capabilities") return "qrmo-mod-caps-h";
  return `qrmo-mod-${sectionKey}-h`;
}

function ctxNavSections(m) {
  return m.order
    .filter((key) => !CTX_NAV_SKIP.has(key) && (key === "details" || m[key]))
    .map((key) => {
      const label = ctxNavSectionLabel(m, key);
      if (!label) return null;
      return { key, label, hash: ctxNavSectionHash(key) };
    })
    .filter(Boolean);
}

function moduleContextNav(_m) {
  /* Context nav yalnızca anasayfa modül bölgesinde; detay sayfalarında yok. */
  return "";
}

/* =========================================================
   MODÜL SAYFASI BÖLÜMLERİ
========================================================= */

const SECTION = {

  hero(m, ctx) {
    const h = m.hero;
    return `
  <section class="qrmo-mod-sec qrmo-mod-hero qrmo-mod-hero--${h.layout}${m.designV2 ? " qrmo-mod-hero--v2" : ""}" aria-labelledby="qrmo-mod-h1">
    <div class="qrmo-mod-inner qrmo-mod-hero-grid">
      <div class="qrmo-mod-hero-copy">
        <p class="qrmo-mod-kicker qrmo-mod-kicker--hero"><span>${esc(h.kicker || up(catById[m.category].name))}</span><span class="qrmo-mod-kicker-pkg">${esc(pkgShort(ctx.minIdx))}</span></p>
        <h1 class="qrmo-mod-h1" id="qrmo-mod-h1">${esc(h.h1)}</h1>
        <p class="qrmo-mod-lead">${esc(h.lead)}</p>
        <ul class="qrmo-mod-proof">${join(h.proof, (p) => `<li>${ICON.check}<span>${esc(p)}</span></li>`)}</ul>
        ${ctaRow(ctx.rel, "../", { modulesLabel: m.modulesLabel })}
      </div>
      <div class="qrmo-mod-hero-visual">
      ${figure(h.visual, { caption: MOD.mockCaption, cls: "qrmo-mod-fig--hero" })}
      </div>
    </div>
  </section>`;
  },

  shift(m) {
    const s = m.shift;
    return `
  <section class="qrmo-mod-sec qrmo-mod-shift" aria-labelledby="qrmo-mod-shift-h">
    <div class="qrmo-mod-inner">
      <header class="qrmo-mod-sechead">
        ${kicker(s.kicker)}
        <h2 class="qrmo-mod-h2 qrmo-mod-h2--xl" id="qrmo-mod-shift-h">${esc(s.title)}</h2>
      </header>
      <div class="qrmo-mod-shift-cols" aria-hidden="true"><span>${esc(s.cols[0])}</span><span>${esc(s.cols[1])}</span></div>
      <ol class="qrmo-mod-shift-list">${join(s.rows, (r) => `
        <li>
          <p class="qrmo-mod-shift-now"><span class="qrmo-mod-shift-lbl">${esc(s.cols[0])}</span>${esc(r.now)}</p>
          <span class="qrmo-mod-shift-arrow" aria-hidden="true">${ICON.arrow}</span>
          <p class="qrmo-mod-shift-next"><span class="qrmo-mod-shift-lbl">${esc(s.cols[1])}</span>${esc(r.next)}</p>
        </li>`)}
      </ol>
    </div>
  </section>`;
  },

  stage(m, ctx) {
    const s = m.stage;
    if (s.callouts.length > 3) problems.push(`${m.slug}: stage.callouts 3'ten fazla`);
    return `
  <section class="qrmo-mod-sec qrmo-mod-stage-sec${v2SecClass(m, "stage")}" aria-labelledby="qrmo-mod-stage-h">
    ${v2InnerOpen(m, ctx, "stage")}
      <div class="qrmo-mod-stage qrmo-mod-stage--${s.theme} qrmo-mod-stage--${s.layout}">
        <header class="qrmo-mod-stage-head">
          ${v2SkipKicker(m, "stage") ? "" : kicker(s.kicker)}
          <h2 class="qrmo-mod-h2 qrmo-mod-h2--l" id="qrmo-mod-stage-h">${esc(s.title)}</h2>
          <p class="qrmo-mod-text">${esc(s.text)}</p>
          ${caveat(s.note)}
        </header>
        <div class="qrmo-mod-stage-visual">
        ${figure(s.visual)}
        </div>
        <ol class="qrmo-mod-callouts">${join(s.callouts, (c, i) => `
          <li><span class="qrmo-mod-num" aria-hidden="true">${i + 1}</span><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p></li>`)}
        </ol>
      </div>
    ${v2InnerClose(m, "stage")}
  </section>`;
  },

  story(m, ctx) {
    const s = m.story;
    const headHtml = `
      <header class="qrmo-mod-sechead${s.type === "pipeline" ? " qrmo-mod-sechead--center" : ""}">
        ${v2SkipKicker(m, "story") ? "" : kicker(s.kicker)}
        <h2 class="qrmo-mod-h2 qrmo-mod-h2--l" id="qrmo-mod-story-h">${esc(s.title)}</h2>
        ${s.text ? `<p class="qrmo-mod-text">${esc(s.text)}</p>` : ""}
      </header>`;
    let body = "";
    if (s.type === "pipeline") {
      body = `
      <ol class="qrmo-mod-pipe qrmo-mod-pipe--${s.nodes.length}">${join(s.nodes, (n, i) => `
        <li><span class="qrmo-mod-pipe-n" aria-hidden="true">${pad(i + 1)}</span><h3>${esc(n.t)}</h3><p>${esc(n.d)}</p></li>`)}
      </ol>${s.note ? `<div class="qrmo-mod-pipe-note">${caveat(s.note)}</div>` : ""}`;
    } else if (s.type === "pairs") {
      body = `
      <div class="qrmo-mod-pairs">
        <div class="qrmo-mod-pairs-head" aria-hidden="true"><span></span><span>${esc(s.cols[0])}</span><span>${esc(s.cols[1])}</span></div>
        <ul class="qrmo-mod-pairs-list">${join(s.rows, (r) => `
          <li>
            <h3 class="qrmo-mod-pairs-k">${esc(r.k)}</h3>
            <p class="qrmo-mod-pairs-a"><span class="qrmo-mod-pairs-lbl">${esc(s.cols[0])}</span>${esc(r.a)}</p>
            <p class="qrmo-mod-pairs-b"><span class="qrmo-mod-pairs-lbl">${esc(s.cols[1])}</span>${esc(r.b)}</p>
          </li>`)}
        </ul>
      </div>${caveat(s.note)}`;
    } else if (s.type === "compare") {
      const alt = "Temsili çizim: aynı ürün kartı " + s.cards.map((c) => c.label).join(", ") + " dillerinde; ürün adı, kategori, porsiyon, alerjen ve fiyat seçilen dilde.";
      body = `
      <figure class="qrmo-mod-fig qrmo-mod-compare-fig">
        <div class="qrmo-mod-shot qrmo-mod-compare" role="img" aria-label="${esc(alt)}">${join(s.cards, (c) => `
          <div class="qm-lcard"><span class="qm-lcard-lbl">${esc(c.label)}</span>
            <div class="qm-lcard-in"${c.rtl ? ' dir="rtl" lang="ar"' : ""}><span class="qm-detail-img"></span><small>${esc(c.c)}</small><strong>${esc(c.n)}</strong><span class="qm-lcard-m">${esc(c.m)}</span><span class="qm-lcard-a">${esc(c.a)}</span><b>${esc(c.p)}</b></div>
          </div>`)}
        </div>
        <figcaption class="qrmo-mod-cap">${esc(s.note)}</figcaption>
      </figure>`;
    } else if (s.type === "timeline") {
      body = `
      <div class="qrmo-mod-tl-wrap">
        <ol class="qrmo-mod-tl">${join(s.steps, (st, i) => `
          <li><span class="qrmo-mod-tl-n" aria-hidden="true">${pad(i + 1)}</span><div><h3>${esc(st.t)}</h3><p>${esc(st.d)}</p></div></li>`)}
        </ol>
        ${s.visual ? `<div class="qrmo-mod-tl-visual">${figure(s.visual)}</div>` : ""}
      </div>`;
    } else throw new Error(`[${m.slug}] bilinmeyen story.type: ${s.type}`);
    return `
  <section class="qrmo-mod-sec qrmo-mod-story qrmo-mod-story--${s.type}${v2SecClass(m, "story")}" aria-labelledby="qrmo-mod-story-h">
    ${v2InnerOpen(m, ctx, "story")}${headHtml}${body}
    ${v2InnerClose(m, "story")}
  </section>`;
  },

  capabilities(m, ctx) {
    const c = m.capabilities;
    if (c.items.length !== 3) problems.push(`${m.slug}: capabilities 3 madde olmalı`);
    const body = `
      <header class="qrmo-mod-sechead">
        ${v2SkipKicker(m, "capabilities") ? "" : kicker(c.kicker)}
        <h2 class="qrmo-mod-h2 qrmo-mod-h2--m" id="qrmo-mod-caps-h">${esc(c.title)}</h2>
      </header>
      <ul class="qrmo-mod-caps-list">${join(c.items, (it, i) => `
        <li><span class="qrmo-mod-caps-i" aria-hidden="true">${pad(i + 1)}</span><h3>${esc(it.t)}</h3><p>${esc(it.d)}</p></li>`)}
      </ul>`;
    if (m.designV2) {
      return `
  <section class="qrmo-mod-sec qrmo-mod-caps${v2SecClass(m, "capabilities")}" aria-labelledby="qrmo-mod-caps-h">
    ${v2InnerOpen(m, ctx, "capabilities", "", "qrmo-mod-caps-grid")}${body}
    ${v2InnerClose(m, "capabilities")}
  </section>`;
    }
    return `
  <section class="qrmo-mod-sec qrmo-mod-caps" aria-labelledby="qrmo-mod-caps-h">
    <div class="qrmo-mod-inner qrmo-mod-caps-grid">${body}
    </div>
  </section>`;
  },

  proof(m) {
    const p = m.proof;
    return `
  <section class="qrmo-mod-sec qrmo-mod-proofsec" aria-labelledby="qrmo-mod-proof-h">
    <div class="qrmo-mod-inner qrmo-mod-proofgrid${p.visual ? " has-visual" : ""}">
      <div class="qrmo-mod-proof-copy">
        ${kicker(p.kicker)}
        <h2 class="qrmo-mod-h2 qrmo-mod-h2--l" id="qrmo-mod-proof-h">${esc(p.title)}</h2>
        <p class="qrmo-mod-text">${esc(p.text)}</p>
      </div>
      ${p.visual ? `<div class="qrmo-mod-proof-visual">${figure(p.visual)}</div>` : ""}
      <dl class="qrmo-mod-facts">${join(p.facts, (f) => `
        <div><dt>${esc(f.v)}</dt><dd>${esc(f.l)}</dd></div>`)}
      </dl>
      ${p.note ? `<div class="qrmo-mod-proof-note">${caveat(p.note)}</div>` : ""}
    </div>
  </section>`;
  },

  details(m, ctx) {
    const faq = (m.faq || []).map((id) => {
      const q = ctx.faqById[id];
      if (!q) { problems.push(`${m.slug}: SSS kimliği yok: ${id}`); return ""; }
      return `<li><a href="${ctx.rel}sss/#${esc(id)}">${esc(q.question)}</a></li>`;
    }).join("");
    const innerOpen = m.designV2
      ? v2InnerOpen(m, ctx, "details", "", "qrmo-mod-details-grid")
      : `<div class="qrmo-mod-inner qrmo-mod-details-grid">`;
    const innerClose = m.designV2 ? `</div>${v2InnerClose(m, "details")}` : "</div>";
    return `
  <section class="qrmo-mod-sec qrmo-mod-details${v2SecClass(m, "details")}" id="ayrintilar" aria-labelledby="qrmo-mod-det-h">
    ${innerOpen}
      <div class="qrmo-mod-details-side">
        <h2 class="qrmo-mod-h2 qrmo-mod-h2--m" id="qrmo-mod-det-h">${esc(m.detailsTitle || "Tüm özellikler ve sınırlar")}</h2>
        <div class="qrmo-mod-know">
          <h3>Bilmeniz gerekenler</h3>
          <ul>${join(m.notes, (n) => `<li>${esc(n)}</li>`)}</ul>
        </div>${faq ? `
        <div class="qrmo-mod-faqlinks">
          <h3>Sık sorulanlar</h3>
          <ul>${faq}</ul>
        </div>` : ""}
      </div>
      <div class="qrmo-mod-acc">${join(m.groups, (g) => `
        <details class="qrmo-mod-acc-item">
          <summary><h3>${esc(g.title)}</h3><span class="qrmo-mod-acc-count">${g.items.length}<span class="qrmo-mod-sr"> madde</span></span><span class="qrmo-mod-acc-chev">${ICON.chev}</span></summary>
          <ul>${join(g.items, (it) => `
            <li><h4>${esc(it.t)}</h4><p>${esc(it.d)}</p></li>`)}
          </ul>
        </details>`)}
      </div>
    ${innerClose}
  </section>`;
  },

  related(m) {
    return `
  <section class="qrmo-mod-sec qrmo-mod-related" aria-labelledby="qrmo-mod-rel-h">
    <div class="qrmo-mod-inner">
      <header class="qrmo-mod-sechead qrmo-mod-sechead--tight">
        <h2 class="qrmo-mod-h2 qrmo-mod-h2--m" id="qrmo-mod-rel-h">${esc(m.relatedTitle || "Birlikte çalıştığı modüller")}</h2>
      </header>
      <ul class="qrmo-mod-rel">${join(m.related, (r) => {
        const rm = bySlug[r.slug];
        return `
        <li><a class="qrmo-mod-tile" href="../${rm.slug}/">${cue(rm.cue)}<span class="qrmo-mod-tile-b"><span class="qrmo-mod-tile-t">${esc(rm.name)}</span><span class="qrmo-mod-tile-d">${esc(r.why)}</span></span><span class="qrmo-mod-tile-go">${ICON.arrow}</span></a></li>`;
      })}
      </ul>
    </div>
  </section>`;
  },

  closing(m, ctx) {
    const where = pkgWhere(ctx.minIdx);
    const title = (m.closing && m.closing.title) || (ctx.minIdx === 0 ? `${m.name} ${where}.` : `${m.name}, ${where}.`);
    const closingText = (m.closing && m.closing.text) || "Paketleri ve içerdikleri modülleri yan yana karşılaştırın.";
    const tiers = join(PKG.packages, (p, i) => {
      const inc = i >= ctx.minIdx;
      return `
            <li class="${inc ? "is-in" : "is-out"}"><span class="qrmo-mod-tier-n">${esc(p.name)}</span><span class="qrmo-mod-tier-t">${esc(p.tagline)}</span><span class="qrmo-mod-tier-s">${inc ? ICON.check : ICON.dash}${inc ? "Dahil" : "Dahil değil"}</span></li>`;
    });
    return `
  <section class="qrmo-mod-sec qrmo-mod-closing" aria-labelledby="qrmo-mod-close-h">
    <div class="qrmo-mod-inner">
      <div class="qrmo-mod-close">
        <div class="qrmo-mod-close-copy">
          <h2 class="qrmo-mod-h2 qrmo-mod-h2--l" id="qrmo-mod-close-h">${esc(title)}</h2>
          <p class="qrmo-mod-text">${esc(closingText)}</p>
        </div>
        <ol class="qrmo-mod-tiers" aria-label="Paketlere göre ${esc(m.name)}">${tiers}
        </ol>
        ${ctaRow(ctx.rel, "../", { dark: true, modulesLabel: m.modulesLabel })}
      </div>
    </div>
  </section>`;
  }
};

/* ---------- modül sayfası ---------- */

function renderModule(m, faqById) {
  const rel = "../../";
  const { index: minIdx } = modulePackage(m);
  const url = `${MOD.site.baseUrl}/moduller/${m.slug}/`;
  const ctx = { rel, minIdx, faqById };

  const body = m.order.map((key) => {
    if (!SECTION[key]) throw new Error(`[${m.slug}] bilinmeyen bölüm: ${key}`);
    if (!["hero", "details", "related", "closing"].includes(key) && !m[key]) throw new Error(`[${m.slug}] order içinde "${key}" var ama veri yok`);
    return SECTION[key](m, ctx);
  }).join("\n");

  return head({
    title: `${m.seo.title} | ${MOD.site.brand}`, description: m.seo.description, url,
    breadcrumb: [["Ana Sayfa", MOD.site.baseUrl + "/"], ["Modüller", MOD.site.baseUrl + "/moduller/"], [m.name, url]],
    cssPath: "../module-page.css",
    extraHead: '<script defer src="../module-page.js"></script>'
  }) + `
<body class="qrmo-mod-page qrmo-mod-page--detail${m.pageClass ? " " + m.pageClass : ""}"${m.designV2 ? ' id="mod-v2-prototype"' : ""}>
<main id="icerik" class="qrmo-mod" tabindex="-1">
${moduleContextNav(m)}
  ${crumbs([["Ana sayfa", rel], ["Modüller", "../"], [m.name]])}
${body}
</main>
</body>
</html>
`;
}

/* ---------- modül dizini ---------- */

/* Hub hero görseli: dekoratif, temsili. Rakam yok; "Örnek görünüm" etiketi
   grafiklerin canlı veri olmadığını gösterir. Ayrıntı sayfalarında kullanılmaz. */
function hubHeroVisual() {
  return `<div class="qrmo-mod-hero-visual qrmo-hubviz" aria-hidden="true">
      <div class="qrmo-hubviz-card qrmo-hubviz-card--line">
        <div class="qrmo-hubviz-top">
          <p class="qrmo-hubviz-title">Menü Etkileşimi</p>
          <p class="qrmo-hubviz-sample">Örnek görünüm</p>
        </div>
        <svg class="qrmo-hubviz-chart" viewBox="0 0 320 108" fill="none">
          <path d="M4 28h312M4 54h312M4 80h312" stroke="rgba(13,43,34,.08)" stroke-width="1"/>
          <path class="qrmo-hubviz-area" d="M4 80C28 78 48 72 72 70S112 60 140 54 176 38 208 36 260 20 316 18V96H4Z"/>
          <path class="qrmo-hubviz-stroke qrmo-hubviz-stroke--compare" pathLength="100" d="M4 60C36 56 62 66 96 58S150 44 188 50 246 62 316 48"/>
          <path class="qrmo-hubviz-stroke qrmo-hubviz-stroke--main" pathLength="100" d="M4 80C28 78 48 72 72 70S112 60 140 54 176 38 208 36 260 20 316 18"/>
          <circle class="qrmo-hubviz-dot" cx="316" cy="18" r="3.5"/>
        </svg>
        <ul class="qrmo-hubviz-legend">
          <li><span class="qrmo-hubviz-swatch qrmo-hubviz-swatch--main"></span><span>Menü görüntüleme</span></li>
          <li><span class="qrmo-hubviz-swatch qrmo-hubviz-swatch--compare"></span><span>Ürün ilgisi</span></li>
        </ul>
      </div>
      <div class="qrmo-hubviz-card qrmo-hubviz-card--masa">
        <p class="qrmo-hubviz-title">Masa &amp; Servis</p>
        <p class="qrmo-hubviz-live"><span class="qrmo-hubviz-dots"><i></i><i class="is-on"></i><i></i><i></i><i></i></span><span>Aktif masa</span></p>
        <ul class="qrmo-hubviz-pills">
          <li>Garson çağrısı</li>
          <li>Hesap isteği</li>
        </ul>
        <svg class="qrmo-hubviz-spark" viewBox="0 0 180 46" fill="none">
          <path class="qrmo-hubviz-stroke qrmo-hubviz-stroke--masa2" pathLength="100" d="M2 36C22 34 40 38 64 30S100 22 132 26 160 18 178 24"/>
          <path class="qrmo-hubviz-stroke qrmo-hubviz-stroke--masa" pathLength="100" d="M2 32C18 30 28 18 46 20S72 36 92 28 124 12 148 16 168 22 178 14"/>
        </svg>
      </div>
      <div class="qrmo-hubviz-card qrmo-hubviz-card--perf">
        <p class="qrmo-hubviz-title">Menü Performansı</p>
        <div class="qrmo-hubviz-perf">
          <svg class="qrmo-hubviz-ring" viewBox="0 0 88 88" fill="none">
            <circle cx="44" cy="44" r="32" stroke="rgba(13,43,34,.08)" stroke-width="9"/>
            <circle class="qrmo-hubviz-arc qrmo-hubviz-arc--a" cx="44" cy="44" r="32" pathLength="100" transform="rotate(-90 44 44)"/>
            <circle class="qrmo-hubviz-arc qrmo-hubviz-arc--b" cx="44" cy="44" r="32" pathLength="100" transform="rotate(-90 44 44)"/>
            <circle class="qrmo-hubviz-arc qrmo-hubviz-arc--c" cx="44" cy="44" r="32" pathLength="100" transform="rotate(-90 44 44)"/>
          </svg>
          <ul class="qrmo-hubviz-legend qrmo-hubviz-legend--stack">
            <li><span class="qrmo-hubviz-swatch qrmo-hubviz-swatch--view"></span><span>Ürün görüntüleme</span></li>
            <li><span class="qrmo-hubviz-swatch qrmo-hubviz-swatch--cart"></span><span>Sepete ekleme</span></li>
            <li><span class="qrmo-hubviz-swatch qrmo-hubviz-swatch--order"></span><span>Sipariş</span></li>
          </ul>
        </div>
      </div>
    </div>`;
}

/* Hub ürün hikâyesi: statik adımlar. Ayrıntı sayfalarında kullanılmaz. */
function hubStoryVisual(kind) {
  const cream = "#F4F1E8";
  const gold = "#C9A84C";
  const goldL = "#E8C766";
  const goldInk = "#7F6419";
  const ink = "#0D2B22";
  const muted = "#56625B";
  const line = "rgba(13,43,34,.14)";
  const scenes = {
    qr: `
      <rect x="8" y="22" width="118" height="124" rx="14" fill="#fff" stroke="${line}"/>
      <rect x="28" y="38" width="78" height="78" rx="8" fill="${cream}" stroke="${ink}" stroke-width="1.4"/>
      <rect x="34" y="44" width="18" height="18" rx="2" fill="${ink}"/>
      <rect x="82" y="44" width="18" height="18" rx="2" fill="${ink}"/>
      <rect x="34" y="92" width="18" height="18" rx="2" fill="${ink}"/>
      <rect x="40" y="50" width="6" height="6" fill="${cream}"/>
      <rect x="88" y="50" width="6" height="6" fill="${cream}"/>
      <rect x="40" y="98" width="6" height="6" fill="${cream}"/>
      <rect x="58" y="62" width="8" height="8" fill="${ink}"/>
      <rect x="70" y="70" width="8" height="8" fill="${ink}"/>
      <rect x="58" y="78" width="6" height="6" fill="${gold}"/>
      <text x="67" y="132" text-anchor="middle" fill="${ink}" font-size="11" font-weight="800">Masa 12</text>
      <rect x="146" y="16" width="126" height="136" rx="22" fill="${ink}"/>
      <rect x="154" y="28" width="110" height="112" rx="14" fill="${cream}"/>
      <text x="209" y="48" text-anchor="middle" fill="${ink}" font-size="11" font-weight="800">Menü</text>
      <text x="209" y="62" text-anchor="middle" fill="${muted}" font-size="9">Masa 12</text>
      <rect x="166" y="74" width="86" height="10" rx="5" fill="#fff" stroke="${line}"/>
      <rect x="166" y="92" width="86" height="14" rx="6" fill="#fff"/>
      <rect x="166" y="112" width="58" height="14" rx="6" fill="#fff"/>
      <rect x="228" y="112" width="24" height="14" rx="6" fill="${goldL}"/>`,
    menu: `
      <rect x="58" y="10" width="164" height="148" rx="24" fill="${ink}"/>
      <rect x="66" y="22" width="148" height="124" rx="16" fill="${cream}"/>
      <text x="140" y="42" text-anchor="middle" fill="${ink}" font-size="11" font-weight="800">Menü</text>
      <rect x="78" y="52" width="124" height="16" rx="8" fill="#fff" stroke="${line}"/>
      <text x="90" y="63" fill="${muted}" font-size="9">Ürün ara…</text>
      <rect x="78" y="74" width="28" height="14" rx="7" fill="${ink}"/>
      <text x="92" y="84" text-anchor="middle" fill="${cream}" font-size="8" font-weight="800">TR</text>
      <rect x="110" y="74" width="28" height="14" rx="7" fill="#fff" stroke="${gold}" stroke-width="1.4"/>
      <text x="124" y="84" text-anchor="middle" fill="${ink}" font-size="8" font-weight="800">EN</text>
      <rect x="144" y="74" width="58" height="14" rx="7" fill="#fff" stroke="${line}"/>
      <text x="173" y="84" text-anchor="middle" fill="${goldInk}" font-size="8" font-weight="800">Filtrele</text>
      <rect x="78" y="96" width="124" height="20" rx="6" fill="#fff"/>
      <text x="86" y="109" fill="${ink}" font-size="9" font-weight="700">Mercimek Çorbası</text>
      <rect x="78" y="120" width="124" height="20" rx="6" fill="#fff"/>
      <text x="86" y="133" fill="${ink}" font-size="9" font-weight="700">Izgara Tavuk</text>`,
    talep: `
      <rect x="58" y="10" width="164" height="148" rx="24" fill="${ink}"/>
      <rect x="66" y="22" width="148" height="124" rx="16" fill="${cream}"/>
      <text x="140" y="42" text-anchor="middle" fill="${ink}" font-size="11" font-weight="800">QR Menü</text>
      <text x="140" y="56" text-anchor="middle" fill="${muted}" font-size="9">Masa 12</text>
      <rect x="78" y="66" width="124" height="22" rx="8" fill="${ink}"/>
      <text x="140" y="80" text-anchor="middle" fill="${cream}" font-size="10" font-weight="800">Siparişi Gönder</text>
      <rect x="78" y="94" width="124" height="22" rx="8" fill="#fff" stroke="${line}"/>
      <text x="140" y="108" text-anchor="middle" fill="${ink}" font-size="10" font-weight="700">Garson Çağır</text>
      <rect x="78" y="122" width="124" height="22" rx="8" fill="#fff" stroke="${line}"/>
      <text x="140" y="136" text-anchor="middle" fill="${ink}" font-size="10" font-weight="700">Hesap İste</text>`,
    panel: `
      <rect x="16" y="18" width="248" height="132" rx="14" fill="#fff" stroke="${line}"/>
      <rect x="16" y="18" width="248" height="28" rx="14" fill="${ink}"/>
      <rect x="16" y="32" width="248" height="14" fill="${ink}"/>
      <text x="28" y="36" fill="${cream}" font-size="11" font-weight="800">Servis Paneli</text>
      <rect x="168" y="24" width="84" height="16" rx="8" fill="${goldL}"/>
      <text x="210" y="35" text-anchor="middle" fill="${ink}" font-size="8" font-weight="800">Oturum doğrulandı</text>
      <rect x="28" y="56" width="68" height="80" rx="8" fill="${cream}"/>
      <text x="62" y="72" text-anchor="middle" fill="${goldInk}" font-size="8" font-weight="800">Bekliyor</text>
      <rect x="36" y="80" width="52" height="22" rx="5" fill="#fff"/>
      <text x="62" y="94" text-anchor="middle" fill="${ink}" font-size="8" font-weight="700">Sipariş</text>
      <rect x="104" y="56" width="68" height="80" rx="8" fill="${cream}"/>
      <text x="138" y="72" text-anchor="middle" fill="${goldInk}" font-size="8" font-weight="800">Hazırlanıyor</text>
      <rect x="112" y="80" width="52" height="22" rx="5" fill="#fff"/>
      <text x="138" y="94" text-anchor="middle" fill="${ink}" font-size="8" font-weight="700">Garson</text>
      <rect x="180" y="56" width="68" height="80" rx="8" fill="${cream}"/>
      <text x="214" y="72" text-anchor="middle" fill="${goldInk}" font-size="8" font-weight="800">Serviste</text>
      <rect x="188" y="80" width="52" height="22" rx="5" fill="#fff"/>
      <text x="214" y="94" text-anchor="middle" fill="${ink}" font-size="8" font-weight="700">Hesap</text>
      <text x="62" y="122" text-anchor="middle" fill="${muted}" font-size="8">Masa 12</text>
      <text x="138" y="122" text-anchor="middle" fill="${muted}" font-size="8">Masa 12</text>
      <text x="214" y="122" text-anchor="middle" fill="${muted}" font-size="8">Masa 12</text>`
  };
  const inner = scenes[kind];
  if (!inner) throw new Error("Bilinmeyen hub hikâye sahnesi: " + kind);
  return `<svg class="qrmo-mod-hubstory-svg" viewBox="0 0 280 168" fill="none" aria-hidden="true" focusable="false">${inner}</svg>`;
}

function hubStory(H) {
  const S = H.story;
  if (!S || !S.steps || S.steps.length !== 4) throw new Error("hub.story dört adım içermeli");
  const kinds = ["qr", "menu", "talep", "panel"];
  const steps = join(S.steps, (st, i) => `
        <li class="qrmo-mod-hubstory-step">
          <div class="qrmo-mod-hubstory-copy">
            <span class="qrmo-mod-hubstory-n" aria-hidden="true">${pad(i + 1)}</span>
            <h3 class="qrmo-mod-hubstory-h3">${esc(st.title)}</h3>
            <p class="qrmo-mod-hubstory-text">${esc(st.text)}</p>
          </div>
          <figure class="qrmo-mod-hubstory-fig">
            <div class="qrmo-mod-hubstory-shot" role="img" aria-label="${esc(st.alt)}">${hubStoryVisual(kinds[i])}</div>
            <figcaption class="qrmo-mod-cap">${esc(MOD.mockCaptionShort)}</figcaption>
          </figure>
        </li>`);
  return `
  <section class="qrmo-mod-sec qrmo-mod-hubstory" aria-labelledby="qrmo-mod-hubstory-h">
    <div class="qrmo-mod-inner">
      <header class="qrmo-mod-hubstory-head">
        ${kicker(S.kicker)}
        <h2 class="qrmo-mod-h2 qrmo-mod-h2--m" id="qrmo-mod-hubstory-h">${esc(S.title)}</h2>
        <p class="qrmo-mod-text">${esc(S.lead)}</p>
      </header>
      <ol class="qrmo-mod-hubstory-list">${steps}
      </ol>
    </div>
  </section>`;
}

function renderIndex() {
  const rel = "../";
  const url = `${MOD.site.baseUrl}/moduller/`;
  const H = MOD.hub;
  const cats = MOD.categories.map((c) => ({ c, mods: MOD.modules.filter((m) => m.category === c.id) }));

  const jump = join(cats, ({ c, mods }, i) => `
          <li><a href="#${c.id}"><span class="qrmo-mod-jump-n">${pad(i + 1)}</span><strong>${esc(c.name)}</strong><small>${mods.length} modül</small></a></li>`);

  const groups = join(cats, ({ c, mods }, i) => `
  <section class="qrmo-mod-sec qrmo-mod-hubcat" id="${c.id}" aria-labelledby="qrmo-mod-hub-${c.id}">
    <div class="qrmo-mod-inner">
      <header class="qrmo-mod-hubcat-head">
        <span class="qrmo-mod-hubcat-n" aria-hidden="true">${pad(i + 1)}</span>
        <h2 class="qrmo-mod-h2 qrmo-mod-h2--m" id="qrmo-mod-hub-${c.id}">${esc(c.name)}</h2>
        <p class="qrmo-mod-text">${esc(c.lead)}</p>
      </header>
      <ul class="qrmo-mod-hubgrid qrmo-mod-hubgrid--${mods.length}">${join(mods, (m) => {
        const { index } = modulePackage(m);
        return `
        <li><a class="qrmo-mod-card" href="${m.slug}/">
          ${moduleArt(m.cue)}
          <span class="qrmo-mod-card-b">
            <h3>${esc(m.name)}</h3>
            <span class="qrmo-mod-chip">${esc(pkgShort(index))}</span>
            <span class="qrmo-mod-card-d">${esc(m.tagline)}</span>
            <span class="qrmo-mod-card-go">Modülü inceleyin${ICON.arrow}</span>
          </span>
        </a></li>`;
      })}
      </ul>
    </div>
  </section>`);

  const body = `
<main id="icerik" class="qrmo-mod qrmo-mod--hub" tabindex="-1">
  ${crumbs([["Ana sayfa", rel], ["Modüller"]])}
  <section class="qrmo-mod-sec qrmo-mod-hero qrmo-mod-hero--hub" aria-labelledby="qrmo-mod-h1">
    <div class="qrmo-mod-inner">
      <div class="qrmo-mod-hubhero">
        <div class="qrmo-mod-hero-copy">
          <p class="qrmo-mod-kicker qrmo-mod-kicker--hero"><span>MODÜLLER</span><span class="qrmo-mod-kicker-pkg">${MOD.modules.length} modül · 3 paket</span></p>
          <h1 class="qrmo-mod-h1" id="qrmo-mod-h1">${hubH1(H.h1)}</h1>
          <p class="qrmo-mod-lead">${esc(H.lead)}</p>
          <p class="qrmo-mod-note">${esc(H.note)}</p>
          <div class="qrmo-mod-actions">
            <a class="qrmo-mod-cta" href="${rel}iletisim/#talep"><span>Demo Talep Et</span>${ICON.arrow}</a>
          </div>
        </div>
        ${hubHeroVisual()}
      </div>
      <nav class="qrmo-mod-jump" aria-label="Modül grupları">
        <ol>${jump}
        </ol>
      </nav>
    </div>
  </section>
${hubStory(H)}
${groups}
  <section class="qrmo-mod-sec qrmo-mod-closing" aria-labelledby="qrmo-mod-close-h">
    <div class="qrmo-mod-inner">
      <div class="qrmo-mod-close qrmo-mod-close--hub">
        <div class="qrmo-mod-close-copy">
          ${kicker("PAKETLER")}
          <h2 class="qrmo-mod-h2 qrmo-mod-h2--l" id="qrmo-mod-close-h">${esc(H.closingTitle)}</h2>
          <p class="qrmo-mod-text">${esc(H.closingText)}</p>
        </div>
        <div class="qrmo-mod-actions">
          <a class="qrmo-mod-cta qrmo-mod-cta--ondark" href="${rel}paketler/#karsilastirma"><span>Paketleri karşılaştırın</span>${ICON.arrow}</a>
          <a class="qrmo-mod-textlink qrmo-mod-textlink--ondark" href="${rel}iletisim/">İletişime geçin</a>
        </div>
      </div>
    </div>
  </section>
</main>`;

  return head({
    title: `Modüller — Ürün Özellikleri | ${MOD.site.brand}`,
    description: "QR Menu Official modülleri: restoran menü, QR masa, çeviri, filtreleme, servis paneli, analitik ve daha fazlası. Her modülün ne yaptığını ve hangi pakette olduğunu görün.",
    url, breadcrumb: [["Ana Sayfa", MOD.site.baseUrl + "/"], ["Modüller", url]],
    cssPath: "module-page.css"
  }) + `
<body class="qrmo-mod-page">
${body}
</body>
</html>
`;
}

/* ---------- doğrulama ---------- */

const problems = [];
function validate(faqById) {
  const seenTitle = new Set(), seenDesc = new Set();
  MOD.modules.forEach((m) => {
    modulePackage(m);
    if (!catById[m.category]) problems.push(`${m.slug}: kategori yok: ${m.category}`);
    if (seenTitle.has(m.seo.title)) problems.push(`${m.slug}: title tekrar`);
    if (seenDesc.has(m.seo.description)) problems.push(`${m.slug}: description tekrar`);
    seenTitle.add(m.seo.title); seenDesc.add(m.seo.description);
    const full = `${m.seo.title} | ${MOD.site.brand}`;
    if (full.length > 70) problems.push(`${m.slug}: title ${full.length} karakter (>70)`);
    if (m.seo.description.length < 70 || m.seo.description.length > 175) problems.push(`${m.slug}: description ${m.seo.description.length} karakter`);
    if ((m.hero.proof || []).length > 3) problems.push(`${m.slug}: hero.proof 3'ten fazla`);
    m.related.forEach((r) => { if (!bySlug[r.slug]) problems.push(`${m.slug}: ilgili modül yok: ${r.slug}`); if (r.slug === m.slug) problems.push(`${m.slug}: kendine link`); });
    (m.faq || []).forEach((id) => { if (!faqById[id]) problems.push(`${m.slug}: SSS kimliği yok: ${id}`); });
    ["hero", "details", "related", "closing"].forEach((k) => { if (!m.order.includes(k)) problems.push(`${m.slug}: order içinde ${k} yok`); });
    if (m.order[0] !== "hero") problems.push(`${m.slug}: ilk bölüm hero olmalı`);
    if (m.pageClass && !/^[a-z0-9-]+$/.test(m.pageClass)) problems.push(`${m.slug}: pageClass geçersiz`);
  });
  PKG.features.forEach((f) => { if (f.page && !bySlug[f.page]) problems.push(`packages-data feature ${f.id}: page=${f.page} modül yok`); });
}

/* ---------- yaz ---------- */

(async function main() {
  const FAQ = await import(pathToFileURL(path.join(ROOT, "..", "sss", "faq-data.mjs")).href);
  const faqById = {};
  FAQ.FAQ_ITEMS.forEach((q) => { faqById[q.id] = q; });

  validate(faqById);

  const { applyGlobal } = await import(pathToFileURL(path.join(ROOT, "..", "global", "inject.mjs")).href);
  const pages = MOD.modules.map((m) => [m, applyGlobal(renderModule(m, faqById), { rel: "../../", current: "moduller", skip: "icerik" })]);
  const index = applyGlobal(renderIndex(), { rel: "../", current: "moduller", skip: "icerik", exact: true });

  if (problems.length) {
    console.error("Doğrulama uyarıları:\n - " + problems.join("\n - "));
    if (process.argv.includes("--strict")) process.exit(1);
  }

  pages.forEach(([m, html]) => {
    const dir = path.join(ROOT, m.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  });
  fs.writeFileSync(path.join(ROOT, "index.html"), index);

  /* Site haritası: mevcut bir dağıtım sistemi varsayılmaz; dosya yalnızca üretilir.
     robots.txt'e eklemek veya mevcut sitemap'e katmak dağıtım tarafının işidir. */
  const urls = [`${MOD.site.baseUrl}/`, `${MOD.site.baseUrl}/paketler/`, `${MOD.site.baseUrl}/iletisim/`, `${MOD.site.baseUrl}/moduller/`]
    .concat(MOD.modules.map((m) => `${MOD.site.baseUrl}/moduller/${m.slug}/`));
  fs.writeFileSync(path.join(ROOT, "..", "sitemap-paketler-moduller.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join("\n") + `\n</urlset>\n`);

  console.log(`${MOD.modules.length} modül sayfası + dizin + sitemap üretildi.`);
})().catch((e) => { console.error(e); process.exit(1); });
