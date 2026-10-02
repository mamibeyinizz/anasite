/* Header / footer HTML üreticileri. Yalnızca string döndürür; dosya yazmaz. */
import {
  SITE,
  CTA,
  CONVERSION,
  NAV,
  DRAWER,
  DRAWER_SOLUTIONS,
  HUB,
  FOOTER,
  FOOTER_SOCIAL,
  FOOTER_LEGAL,
  FOOTER_GROUPS
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

function conversionTargetUrl(rel, slot) {
  const c = CONVERSION[slot];
  if (!c) return null;
  if (c.href) return c.href;
  if (c.path != null && c.path !== "") return href(rel, c.path);
  return null;
}

function renderPrimaryCta(rel, { drawer = false } = {}) {
  const label = CTA.label || CONVERSION.primary.label;
  const url = CTA.href ? CTA.href : conversionTargetUrl(rel, "primary");
  const cls = `qrmo-gh-cta${drawer ? " qrmo-gh-cta--drawer" : ""}`;
  const inner = `<span class="qrmo-gh-qr-icon">${I.qr}</span><span>${esc(label)}</span>${drawer ? '<span aria-hidden="true">→</span>' : ""}`;
  if (url) return `<a class="${cls}" href="${esc(url)}">${inner}</a>`;
  return `<button class="${cls} qrmo-gh-cta--pending" type="button" data-qrmo-cta="primary">${inner}</button>`;
}

function renderFooterCtaBtn(rel) {
  const label = FOOTER.ctaButton || CONVERSION.primary.label;
  const url = CTA.href ? CTA.href : conversionTargetUrl(rel, "primary");
  const inner = `<span>${esc(label)}</span>${I.arrow}`;
  if (url) return `<a class="qrmo-gf-cta-btn" href="${esc(url)}">${inner}</a>`;
  return `<button class="qrmo-gf-cta-btn qrmo-gf-cta-btn--pending" type="button" data-qrmo-cta="primary">${inner}</button>`;
}

function renderNavDesktopItem(rel, n, current, exact) {
  if (n.ctaPlaceholder) {
    return `<li class="qrmo-gh-item"><button type="button" class="qrmo-gh-link qrmo-gh-link--pending" data-qrmo-cta="${esc(n.ctaPlaceholder)}">${esc(n.label)}</button></li>`;
  }
  if (n.conversionSlot) {
    const url = conversionTargetUrl(rel, n.conversionSlot);
    if (url) {
      return `<li class="qrmo-gh-item"><a class="qrmo-gh-link" href="${esc(url)}"${cur(n.key, current, exact)}>${esc(n.label)}</a></li>`;
    }
  }
  return `<li class="qrmo-gh-item"><a class="qrmo-gh-link" href="${href(rel, n.path)}"${cur(n.key, current, exact)}>${esc(n.label)}</a></li>`;
}

function renderDrawerNavCard(rel, n, current, exact) {
  const icon = I.nav[n.key] || I.nav.home;
  const sub = n.drawerSubtitle
    ? `<span class="qrmo-gh-d-card-sub">${esc(n.drawerSubtitle)}</span>`
    : "";
  const body = `
      <span class="qrmo-gh-d-card-left">
        <span class="qrmo-gh-d-card-icon">${icon}</span>
        <span class="qrmo-gh-d-card-text">
          <span class="qrmo-gh-d-card-title">${esc(n.label)}</span>
          ${sub}
        </span>
      </span>
      <span class="qrmo-gh-d-card-arrow" aria-hidden="true">↗</span>`;
  if (n.ctaPlaceholder) {
    return `
      <button class="qrmo-gh-d-card qrmo-gh-d-card--pending" type="button" data-qrmo-cta="${esc(n.ctaPlaceholder)}">
        ${body}
      </button>`;
  }
  if (n.conversionSlot) {
    const url = conversionTargetUrl(rel, n.conversionSlot);
    if (url) {
      return `
      <a class="qrmo-gh-d-card" href="${esc(url)}"${cur(n.key, current, exact)}>
        ${body}
      </a>`;
    }
  }
  return `
      <a class="qrmo-gh-d-card" href="${href(rel, n.path)}"${cur(n.key, current, exact)}>
        ${body}
      </a>`;
}

function renderFooterLink(rel, l, current) {
  if (l.conversionSlot) {
    const url = conversionTargetUrl(rel, l.conversionSlot);
    if (url) {
      return `<li><a href="${esc(url)}"${l.key ? cur(l.key, current, false) : ""}>${esc(l.label)}</a></li>`;
    }
  }
  if (l.ctaPlaceholder || l.path == null) {
    return `<li><button type="button" class="qrmo-gf-link-pending" data-qrmo-cta="${esc(l.ctaPlaceholder || "secondary")}">${esc(l.label)}</button></li>`;
  }
  return `<li><a href="${href(rel, l.path)}"${l.key ? cur(l.key, current, false) : ""}>${esc(l.label)}</a></li>`;
}

export function renderHeader({ rel = "", current = "", skip = "icerik", exact = false } = {}) {
  const brand = `<a class="qrmo-gh-brand" href="${href(rel, "")}" aria-label="${esc(SITE.brand)} ana sayfa"><img class="qrmo-gh-logo qrmo-gh-logo--full" src="${href(rel, SITE.logo)}" alt="${esc(SITE.brand)}" width="194" height="78" decoding="async" fetchpriority="high"><img class="qrmo-gh-logo qrmo-gh-logo--compact" src="${href(rel, SITE.logoCompact)}" alt="${esc(SITE.brand)}" width="165" height="44" decoding="async" fetchpriority="high"></a>`;

  const desktopItems = NAV.map((n) => renderNavDesktopItem(rel, n, current, exact)).join("");

  const drawerLinks = NAV.map((n) => renderDrawerNavCard(rel, n, current, exact)).join("");

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

  const drawerNote = DRAWER.bottomNote
    ? `<p class="qrmo-gh-drawer-note">${esc(DRAWER.bottomNote)}</p>`
    : "";

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
      ${renderPrimaryCta(rel)}
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
      ${renderPrimaryCta(rel, { drawer: true })}
      ${drawerNote}
    </div>
  </div>
</header>`;
}

const I_SOCIAL = {
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"></circle></svg>`,
  facebook: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 8h3V4h-3c-3.1 0-5 1.9-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z"></path></svg>`
};

export function renderFooter({ rel = "", current = "" } = {}) {
  const brand = `<a class="qrmo-gf-brand-link" href="${href(rel, "")}" aria-label="${esc(SITE.brand)} ana sayfa">
      <img class="qrmo-gf-logo qrmo-gf-logo--full" src="${href(rel, SITE.logo)}" alt="${esc(SITE.brand)}" width="194" height="78" decoding="async" loading="lazy">
      <img class="qrmo-gf-logo qrmo-gf-logo--compact" src="${href(rel, SITE.logoCompact)}" alt="${esc(SITE.brand)}" width="165" height="44" decoding="async" loading="lazy">
    </a>`;

  const socials = FOOTER_SOCIAL.length
    ? `<div class="qrmo-gf-socials" aria-label="Sosyal medya bağlantıları">${FOOTER_SOCIAL.map(
        (s) =>
          `<a class="qrmo-gf-social-link" href="${esc(s.url)}" aria-label="${esc(s.label)}">${I_SOCIAL[s.icon] || ""}</a>`
      ).join("")}</div>`
    : "";

  const navCols = FOOTER_GROUPS.map(
    (g) => `
      <details class="qrmo-gf-col" open>
        <summary><span class="qrmo-gf-h">${esc(g.title)}</span>${I.chev}</summary>
        <ul class="qrmo-gf-links">${g.links.map((l) => renderFooterLink(rel, l, current)).join("")}</ul>
      </details>`
  ).join("");

  const legal = FOOTER_LEGAL.length
    ? `<div class="qrmo-gf-legal-links">${FOOTER_LEGAL.map((l) => `<a href="${href(rel, l.path)}">${esc(l.label)}</a>`).join("")}</div>`
    : "";

  return `<footer class="qrmo-gf" data-qrmo-gf aria-labelledby="qrmo-gf-title">
  <div class="qrmo-gf-in">
    <h2 class="qrmo-gf-sr-only" id="qrmo-gf-title">${esc(SITE.brand)} Footer</h2>
    <div class="qrmo-gf-top">
      <section class="qrmo-gf-brand" aria-label="${esc(SITE.brand)}">
        ${brand}
        <p class="qrmo-gf-brand-desc">${esc(FOOTER.description)}</p>
        ${socials}
      </section>
      <section class="qrmo-gf-cta" aria-label="QR Menü başlangıç çağrısı">
        <p class="qrmo-gf-cta-label">${esc(FOOTER.ctaEyebrow)}</p>
        <h3 class="qrmo-gf-cta-title">${esc(FOOTER.ctaTitle)}</h3>
        <p class="qrmo-gf-cta-desc">${esc(FOOTER.ctaDescription)}</p>
        ${renderFooterCtaBtn(rel)}
      </section>
    </div>
    <nav class="qrmo-gf-nav" aria-label="Footer navigasyonu">${navCols}
    </nav>
    <div class="qrmo-gf-bottom">
      <p class="qrmo-gf-copy">© ${SITE.year} ${esc(SITE.wordmark)}. Tüm hakları saklıdır.</p>
      ${legal}
    </div>
    <div class="qrmo-gf-signature">${esc(FOOTER.signature)}</div>
  </div>
</footer>`;
}
