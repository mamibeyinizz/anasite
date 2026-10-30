/* QR Menu Official — /canli-menu/
   Paket sekmeleri (WAI-ARIA tabs), QR/masa kartı eşlemesi, fiyat satırı
   (paketler/packages-data.js tek kaynak) ve mobil alt dock.
   JS yoksa sekmeler gizli kalır, üç panel alt alta görünür. */
(function () {
  "use strict";

  var root = document.querySelector(".qrmo-live");
  var tablist = document.querySelector("[data-qrmo-live-tabs]");
  if (!root || !tablist) return;

  var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.qrmo-live-panel[role="tabpanel"]'));
  var tentSub = document.querySelector("[data-qrmo-live-tent-sub]");
  var dock = document.querySelector("[data-qrmo-live-dock]");
  var dockLink = document.querySelector("[data-qrmo-live-dock-link]");
  var dockLabel = document.querySelector("[data-qrmo-live-dock-label]");
  var NAMES = { temel: "Temel", pro: "Pro", plus: "Plus" };

  function pkgFromHash() {
    var h = (location.hash || "").replace("#", "").toLowerCase();
    return NAMES[h] ? h : "";
  }

  function panelFor(pkg) {
    for (var i = 0; i < panels.length; i++) if (panels[i].getAttribute("data-pkg") === pkg) return panels[i];
    return null;
  }

  function select(pkg, opts) {
    opts = opts || {};
    if (!NAMES[pkg]) pkg = "plus";
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-pkg") === pkg;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (on && opts.focus) t.focus();
    });
    panels.forEach(function (p) {
      p.hidden = p.getAttribute("data-pkg") !== pkg;
    });
    root.setAttribute("data-active", pkg);
    if (tentSub) tentSub.textContent = NAMES[pkg] + " demo menüsü açılır";

    var open = panelFor(pkg) && panelFor(pkg).querySelector("[data-qrmo-live-open]");
    if (open && dockLink) {
      dockLink.href = open.href;
      dockLink.setAttribute("data-qrmo-live-open", pkg);
      if (dockLabel) dockLabel.textContent = NAMES[pkg] + " demosunu açın";
    }
    if (opts.updateHash && history.replaceState) {
      history.replaceState(null, "", "#" + pkg);
    }
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      select(tab.getAttribute("data-pkg"), { updateHash: true });
    });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      select(next.getAttribute("data-pkg"), { focus: true, updateHash: true });
    });
  });

  tablist.hidden = false;
  select(pkgFromHash() || "plus");
  window.addEventListener("hashchange", function () {
    var pkg = pkgFromHash();
    if (pkg) select(pkg);
  });

  /* Fiyat satırı — paketler sayfasıyla aynı veri */
  function renderPrices() {
    var D = window.QRMO_PRICING;
    if (!D || !D.packages) return;
    var fmt = new Intl.NumberFormat("tr-TR");
    D.packages.forEach(function (pkg) {
      var el = document.querySelector('[data-qrmo-live-price="' + pkg.id + '"]');
      if (!el || !pkg.price) return;
      el.textContent = "";
      var strong = document.createElement("strong");
      strong.textContent = fmt.format(pkg.price.monthly) + " " + D.currency;
      el.appendChild(document.createTextNode("Aylık "));
      el.appendChild(strong);
      if (D.annual && D.annual.usedMonths > D.annual.payMonths) {
        var small = document.createElement("small");
        small.textContent = "Yıllıkta " + D.annual.usedMonths + " ay, " + D.annual.payMonths + " ay ücretine";
        el.appendChild(small);
      }
      el.hidden = false;
    });
  }
  if (window.QRMO_PRICING) renderPrices();
  else window.addEventListener("load", renderPrices);

  /* Mobil dock: etkin paneldeki demo düğmesi görünmüyorsa alttan göster.
     Son çağrı bölümüne gelince (ve sonrasında) gizlenir (iki birincil düğme üst üste binmesin). */
  var mobile = window.matchMedia("(max-width: 767px)");
  var next = document.querySelector(".qrmo-live-next");
  if (dock && "IntersectionObserver" in window) {
    var openVisible = true;
    var nextVisible = false;
    var sync = function () {
      var show = mobile.matches && !openVisible && !nextVisible;
      dock.hidden = !mobile.matches;
      dock.classList.toggle("is-visible", show);
    };
    var watchOpen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.target.closest(".qrmo-live-panel").hidden) openVisible = en.isIntersecting || en.boundingClientRect.top > 0;
      });
      sync();
    });
    document.querySelectorAll(".qrmo-live-panel [data-qrmo-live-open]").forEach(function (a) {
      watchOpen.observe(a);
    });
    if (next) {
      new IntersectionObserver(function (entries) {
        nextVisible = entries[0].isIntersecting || entries[0].boundingClientRect.top < 0;
        sync();
      }).observe(next);
    }
    if (typeof mobile.addEventListener === "function") mobile.addEventListener("change", sync);
    sync();
  }
})();
