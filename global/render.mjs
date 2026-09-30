/* Header / footer HTML üreticileri. Yalnızca string döndürür; dosya yazmaz. */
import {
  SITE,
  CTA,
  NAV,
  DRAWER,
  DRAWER_SOLUTIONS,
  SOLUTIONS,
  HUB
} from "./nav-data.mjs";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const svg = (d, w = 1.7) =>
  `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;

const I = {
  chev: svg('<path d="m6 9 6 6 6-6"/>', 2.3),
  arrow: svg('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  qr: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="15" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="15" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.8"/><path d="M15 15H18V18H21V21H15V15ZM18 12V15M12 18H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  nav: {
    home: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/>'),
    moduller: svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h4v4h3v3h-7v-7ZM18 11v3"/>'),
    paketler: svg('<path d="M4 7h16M4 12h16M4 17h16"/><rect x="3" y="3" width="18" height="18" rx="2"/>'),
    canli: svg('<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M9 5h6M10 18h4"/>'),
    iletisim: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>')
  },
  sol: [
    svg('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>'),
    svg('<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h5M8 16h8"/>'),
    svg('<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/><path d="M16 16h4"/>'),
    svg('<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h4M8 17h8"/>'),
    svg('<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>'),
    svg('<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h6M8 17h8"/>')
  ]
};

/* rel: "" | "../" | "../../"; ana sayfa bağlantısı "./" olur. */
const href = (rel, p) => (p === "" ? rel || "./" : rel + p);
const cur = (key, current, exact) =>
  key === current ? ` aria-current="${exact && current === "home" ? "page" : "true"}"` : "";

export function renderHeader({ rel = "", current = "", skip = "icerik", exact = false } = {}) {
  const brand = `<a class="qrmo-gh-brand" href="${href(rel, "")}" aria-label="${esc(SITE.brand)} ana sayfa"><img class="qrmo-gh-logo qrmo-gh-logo--full" src="${href(rel, SITE.logo)}" alt="${esc(SITE.brand)}" width="194" height="78" decoding="async" fetchpriority="high"><img class="qrmo-gh-logo qrmo-gh-logo--compact" src="${href(rel, SITE.logoCompact)}" alt="${esc(SITE.brand)}" width="165" height="44" decoding="async" fetchpriority="high"></a>`;

  const desktopItems = NAV.map(
    (n) =>
      `<li class="qrmo-gh-item"><a class="qrmo-gh-link" href="${href(rel, n.path)}"${cur(n.key, current, exact)}>${esc(n.label)}</a></li>`
  ).join("");

  const drawerLinks = NAV.map((n) => {
    const icon = I.nav[n.key] || I.nav.home;
    return `
      <a class="qrmo-gh-d-card" href="${href(rel, n.path)}"${cur(n.key, current, exact)}>
        <span class="qrmo-gh-d-card-left">
          <span class="qrmo-gh-d-card-icon">${icon}</span>
          <span class="qrmo-gh-d-card-text">
            <span class="qrmo-gh-d-card-title">${esc(n.label)}</span>
            <span class="qrmo-gh-d-card-sub">${esc(n.drawerSubtitle)}</span>
          </span>
        </span>
        <span class="qrmo-gh-d-card-arrow" aria-hidden="true">↗</span>
      </a>`;
  }).join("");

  const solutionCards = DRAWER_SOLUTIONS.map(
    (s, i) => `
        <a class="qrmo-gh-d-sol" href="${href(rel, `moduller/${s.slug}/`)}">
          <span class="qrmo-gh-d-sol-icon">${I.sol[i] || I.sol[0]}</span>
          <span class="qrmo-gh-d-sol-name">${esc(s.name)}</span>
          <span class="qrmo-gh-d-sol-desc">${esc(s.desc)}</span>
        </a>`
  ).join("");

  const trustItems = DRAWER.trustItems
    .map(
      (t) => `
        <div class="qrmo-gh-d-trust-item">
          <span class="qrmo-gh-d-trust-check" aria-hidden="true">✓</span>
          <span>${esc(t)}</span>
        </div>`
    )
    .join("");

  return `<script>document.documentElement.classList.add("qrmo-gh-js")</script>
<a class="qrmo-gh-skip" href="#${esc(skip)}">İçeriğe geç</a>
<header class="qrmo-gh" data-qrmo-gh>
  <div class="qrmo-gh-shell">
    <div class="qrmo-gh-in">
      ${brand}
      <nav class="qrmo-gh-nav" aria-label="Ana menü">
        <ul>${desktopItems}
        </ul>
      </nav>
      <a class="qrmo-gh-cta" href="${href(rel, CTA.path)}"><span class="qrmo-gh-qr-icon">${I.qr}</span><span>${esc(CTA.label)}</span></a>
      <button class="qrmo-gh-burger" type="button" aria-expanded="false" aria-controls="qrmo-gh-drawer" aria-label="Menüyü aç">
        <span class="qrmo-gh-burger-label">MENÜ</span>
        <span class="qrmo-gh-burger-icon" aria-hidden="true"><span></span><span></span><span></span></span>
      </button>
    </div>
  </div>
  <div class="qrmo-gh-backdrop" data-qrmo-gh-backdrop aria-hidden="true"></div>
  <div class="qrmo-gh-drawer" id="qrmo-gh-drawer" role="dialog" aria-modal="true" aria-label="Menü" aria-hidden="true">
    <div class="qrmo-gh-drawer-top">
      <a class="qrmo-gh-drawer-brand" href="${href(rel, "")}">
        <img src="${href(rel, SITE.logoCompact)}" alt="${esc(SITE.brand)}" width="167" height="44" decoding="async">
      </a>
      <button class="qrmo-gh-drawer-close" type="button" aria-label="Menüyü kapat">×</button>
    </div>
    <div class="qrmo-gh-drawer-intro">
      <p class="qrmo-gh-drawer-eyebrow">${esc(DRAWER.eyebrow)}</p>
      <h2 class="qrmo-gh-drawer-title">${esc(DRAWER.titleLine1)}<br>${esc(DRAWER.titleLine2)}</h2>
      <p class="qrmo-gh-drawer-desc">${esc(DRAWER.description)}</p>
    </div>
    <nav class="qrmo-gh-d-cards" aria-label="Mobil menü">${drawerLinks}
    </nav>
    <section class="qrmo-gh-d-section">
      <div class="qrmo-gh-d-section-head">
        <h3 class="qrmo-gh-d-section-title">${esc(DRAWER.solutionsHeading)}</h3>
        <span class="qrmo-gh-d-section-line"></span>
      </div>
      <div class="qrmo-gh-d-sol-grid">${solutionCards}
      </div>
    </section>
    <div class="qrmo-gh-d-trust">
      <h3 class="qrmo-gh-d-trust-title">${esc(DRAWER.trustTitle)}</h3>
      <div class="qrmo-gh-d-trust-list">${trustItems}
      </div>
    </div>
    <div class="qrmo-gh-drawer-bottom">
      <a class="qrmo-gh-cta qrmo-gh-cta--drawer" href="${href(rel, CTA.path)}"><span class="qrmo-gh-qr-icon">${I.qr}</span><span>${esc(CTA.label)}</span><span aria-hidden="true">→</span></a>
      <p class="qrmo-gh-drawer-note">${esc(DRAWER.bottomNote)}</p>
    </div>
  </div>
</header>`;
}

export function renderFooter({ rel = "", current = "" } = {}) {
  const cols = SOLUTIONS.map(
    (g) => `
        <details class="qrmo-gf-col" open>
          <summary><span class="qrmo-gf-h">${esc(g.name)}</span>${I.chev}</summary>
          <ul>${g.modules.map((m) => `<li><a href="${href(rel, m.path)}">${esc(m.name)}</a></li>`).join("")}</ul>
        </details>`
  ).join("");
  const site = NAV.filter((n) => n.key !== "moduller").map(
    (n) => `<li><a href="${href(rel, n.path)}"${cur(n.key, current, false)}>${esc(n.label)}</a></li>`
  ).join("");
  return `<footer class="qrmo-gf" data-qrmo-gf>
  <div class="qrmo-gf-in">
    <div class="qrmo-gf-top">
      <div class="qrmo-gf-brand">
        <a class="qrmo-gh-brand" href="${href(rel, "")}" aria-label="${esc(SITE.brand)} — ana sayfa">${esc(SITE.wordmark)}</a>
        <p>${esc(SITE.tagline)}</p>
        <a class="qrmo-gh-cta" href="${href(rel, CTA.path)}"><span>${esc(CTA.label)}</span>${I.arrow}</a>
      </div>
      <div class="qrmo-gf-cols">${cols}
        <details class="qrmo-gf-col" open>
          <summary><span class="qrmo-gf-h">Site</span>${I.chev}</summary>
          <ul><li><a href="${href(rel, "moduller/")}"${cur("moduller", current, false)}>Modüller</a></li>${site}</ul>
        </details>
      </div>
    </div>
    <div class="qrmo-gf-bottom">
      <p>© ${SITE.year} ${esc(SITE.brand)}. Tüm hakları saklıdır.</p>
    </div>
  </div>
</footer>`;
}
