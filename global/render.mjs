/* Header / footer HTML üreticileri. Yalnızca string döndürür; dosya yazmaz. */
import { SITE, CTA, NAV, SOLUTIONS, HUB } from "./nav-data.mjs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const svg = (d, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
const I = {
  chev: svg('<path d="m6 9 6 6 6-6"/>', 2.3),
  arrow: svg('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  burger: svg('<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>'),
  close: svg('<path d="M6 6l12 12"/><path d="M18 6 6 18"/>')
};

/* rel: "" | "../" | "../../"; ana sayfa bağlantısı "./" olur. */
const href = (rel, p) => (p === "" ? rel || "./" : rel + p);
const cur = (key, current) => (key === current ? ` aria-current="${current === "home" ? "page" : "true"}"` : "");

export function renderHeader({ rel = "", current = "", skip = "icerik", exact = false } = {}) {
  const c = (key) => (key === current ? ` aria-current="${exact ? "page" : "true"}"` : "");
  const brand = `<a class="qrmo-gh-brand" href="${href(rel, "")}" aria-label="${esc(SITE.brand)} — ana sayfa">${esc(SITE.wordmark)}</a>`;

  const mega = `
        <div class="qrmo-gh-mega" id="qrmo-gh-mega" hidden>
          <div class="qrmo-gh-mega-in">${SOLUTIONS.map((g) => `
            <div class="qrmo-gh-mega-col">
              <p class="qrmo-gh-mega-h">${esc(g.name)}</p>
              <ul>${g.modules.map((m) => `
                <li><a href="${href(rel, m.path)}"><span class="qrmo-gh-mega-t">${esc(m.name)}</span><span class="qrmo-gh-mega-d">${esc(m.tagline)}</span></a></li>`).join("")}
              </ul>
            </div>`).join("")}
            <div class="qrmo-gh-mega-side">
              <p class="qrmo-gh-mega-h">Çözümler</p>
              <p class="qrmo-gh-mega-p">${SOLUTIONS.reduce((n, g) => n + g.modules.length, 0)} modül, tek sistem: menü, masa ve servis, işletme.</p>
              <a class="qrmo-gh-mega-all" href="${href(rel, HUB.path)}">${esc(HUB.label)}${I.arrow}</a>
            </div>
          </div>
        </div>`;

  const desktopItems = NAV.map((n) => n.mega
    ? `
        <li class="qrmo-gh-item qrmo-gh-has-mega">
          <a class="qrmo-gh-link" href="${href(rel, n.path)}"${c("moduller")}>${esc(n.label)}</a><button class="qrmo-gh-mega-btn" type="button" aria-expanded="false" aria-controls="qrmo-gh-mega" aria-label="Çözümler alt menüsünü aç veya kapat">${I.chev}</button>${mega}
        </li>`
    : `
        <li class="qrmo-gh-item"><a class="qrmo-gh-link" href="${href(rel, n.path)}"${c(n.key)}>${esc(n.label)}</a></li>`).join("");

  const drawerItems = NAV.map((n) => n.mega
    ? `
          <li class="qrmo-gh-d-item">
            <details class="qrmo-gh-d-group">
              <summary><span>${esc(n.label)}</span>${I.chev}</summary>
              <div class="qrmo-gh-d-sub">${SOLUTIONS.map((g) => `
                <p class="qrmo-gh-d-h">${esc(g.name)}</p>
                <ul>${g.modules.map((m) => `<li><a href="${href(rel, m.path)}">${esc(m.name)}</a></li>`).join("")}</ul>`).join("")}
                <a class="qrmo-gh-d-all" href="${href(rel, HUB.path)}">${esc(HUB.label)}${I.arrow}</a>
              </div>
            </details>
          </li>`
    : `
          <li class="qrmo-gh-d-item"><a class="qrmo-gh-d-link" href="${href(rel, n.path)}"${c(n.key)}>${esc(n.label)}</a></li>`).join("");

  return `<script>document.documentElement.classList.add("qrmo-gh-js")</script>
<a class="qrmo-gh-skip" href="#${esc(skip)}">İçeriğe geç</a>
<header class="qrmo-gh" data-qrmo-gh>
  <div class="qrmo-gh-in">
    ${brand}
    <nav class="qrmo-gh-nav" aria-label="Ana menü">
      <ul>${desktopItems}
      </ul>
    </nav>
    <a class="qrmo-gh-cta" href="${href(rel, CTA.path)}"><span>${esc(CTA.label)}</span>${I.arrow}</a>
    <button class="qrmo-gh-burger" type="button" aria-expanded="false" aria-controls="qrmo-gh-drawer" aria-label="Menüyü aç"><span class="qrmo-gh-burger-i qrmo-gh-i-open">${I.burger}</span><span class="qrmo-gh-burger-i qrmo-gh-i-close">${I.close}</span></button>
  </div>
  <div class="qrmo-gh-backdrop" data-qrmo-gh-backdrop></div>
  <div class="qrmo-gh-drawer" id="qrmo-gh-drawer" role="dialog" aria-modal="true" aria-label="Menü">
    <div class="qrmo-gh-drawer-in">
      <nav aria-label="Mobil menü">
        <ul class="qrmo-gh-d-list">${drawerItems}
        </ul>
      </nav>
      <a class="qrmo-gh-cta qrmo-gh-cta--drawer" href="${href(rel, CTA.path)}"><span>${esc(CTA.label)}</span>${I.arrow}</a>
    </div>
  </div>
</header>`;
}

export function renderFooter({ rel = "", current = "" } = {}) {
  const cols = SOLUTIONS.map((g) => `
        <details class="qrmo-gf-col" open>
          <summary><span class="qrmo-gf-h">${esc(g.name)}</span>${I.chev}</summary>
          <ul>${g.modules.map((m) => `<li><a href="${href(rel, m.path)}">${esc(m.name)}</a></li>`).join("")}</ul>
        </details>`).join("");
  const site = NAV.filter((n) => !n.mega).map((n) => `<li><a href="${href(rel, n.path)}"${cur(n.key, current)}>${esc(n.label)}</a></li>`).join("");
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
          <ul><li><a href="${href(rel, "moduller/")}"${cur("moduller", current)}>Modüller</a></li>${site}</ul>
        </details>
      </div>
    </div>
    <div class="qrmo-gf-bottom">
      <p>© ${SITE.year} ${esc(SITE.brand)}. Tüm hakları saklıdır.</p>
    </div>
  </div>
</footer>`;
}
