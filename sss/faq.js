/**
 * /sss/ — kategori filtresi, arama, deep link, klavye
 */
(function () {
  "use strict";

  var root = document.body;
  if (!root || !root.matches("[data-qrmo-faq-root]")) return;

  var searchInput = document.querySelector("[data-qrmo-faq-search]");
  var statusEl = document.getElementById("qrmo-faq-results-status");
  var panelsWrap = document.querySelector("[data-qrmo-faq-panels]");
  var navButtons = Array.prototype.slice.call(
    document.querySelectorAll("[data-qrmo-faq-nav] .qrmo-faq-nav__btn")
  );
  var chips = Array.prototype.slice.call(
    document.querySelectorAll("[data-qrmo-faq-chips] .qrmo-faq-chip")
  );
  var panels = Array.prototype.slice.call(
    document.querySelectorAll("[data-qrmo-faq-panel]")
  );
  var allItems = Array.prototype.slice.call(
    document.querySelectorAll("[data-qrmo-faq-item]")
  );

  var activeCat = panels.length ? panels[0].getAttribute("data-qrmo-faq-panel") : "";

  function normalizeTr(s) {
    if (!s) return "";
    return s
      .toLocaleLowerCase("tr")
      .replace(/ı/g, "i")
      .replace(/İ/g, "i")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c");
  }

  function itemText(details) {
    var q = details.querySelector(".qrmo-faq-item__q-text");
    var a = details.querySelector(".qrmo-faq-item__a");
    return normalizeTr((q ? q.textContent : "") + " " + (a ? a.textContent : ""));
  }

  var itemIndex = allItems.map(function (el) {
    return { el: el, text: itemText(el), cat: el.closest("[data-qrmo-faq-panel]").getAttribute("data-qrmo-faq-panel") };
  });

  function setCurrentCat(catId) {
    activeCat = catId;
    navButtons.forEach(function (btn) {
      var on = btn.getAttribute("data-qrmo-faq-cat") === catId;
      btn.setAttribute("aria-current", on ? "true" : "false");
    });
    chips.forEach(function (chip) {
      var on = chip.getAttribute("data-qrmo-faq-cat") === catId;
      chip.setAttribute("aria-current", on ? "true" : "false");
    });
    panels.forEach(function (panel) {
      var on = panel.getAttribute("data-qrmo-faq-panel") === catId;
      if (on) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });
  }

  function closeOthersInPanel(openDetails) {
    var panel = openDetails.closest("[data-qrmo-faq-panel]");
    if (!panel) return;
    panel.querySelectorAll("details[open]").forEach(function (d) {
      if (d !== openDetails) d.removeAttribute("open");
    });
  }

  allItems.forEach(function (details) {
    details.addEventListener("toggle", function () {
      if (details.open) closeOthersInPanel(details);
    });
  });

  function activateCategory(catId, opts) {
    opts = opts || {};
    root.classList.remove("qrmo-faq--search");
    if (searchInput && !opts.keepSearch) searchInput.value = "";
    setCurrentCat(catId);
    clearSearchFilter();
    if (statusEl) statusEl.textContent = "";
  }

  function onCatClick(catId) {
    activateCategory(catId);
    var panel = document.getElementById("qrmo-faq-panel-" + catId);
    if (panel && panelsWrap) {
      var topbar = document.querySelector(".qrmo-faq-topbar");
      var offset = (topbar ? topbar.offsetHeight : 56) + 12;
      var y = panel.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }

  navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      onCatClick(btn.getAttribute("data-qrmo-faq-cat"));
    });
  });
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      onCatClick(chip.getAttribute("data-qrmo-faq-cat"));
    });
  });

  function clearSearchFilter() {
    itemIndex.forEach(function (row) {
      row.el.removeAttribute("hidden");
    });
    panels.forEach(function (panel) {
      panel.querySelectorAll("[data-qrmo-faq-item]").forEach(function (d) {
        d.removeAttribute("hidden");
      });
    });
  }

  function applySearch(q) {
    var needle = normalizeTr(q.trim());
    if (!needle) {
      root.classList.remove("qrmo-faq--search");
      clearSearchFilter();
      setCurrentCat(activeCat);
      if (statusEl) statusEl.textContent = "";
      return;
    }
    root.classList.add("qrmo-faq--search");
    panels.forEach(function (p) {
      p.removeAttribute("hidden");
    });
    var visible = 0;
    itemIndex.forEach(function (row) {
      var match = row.text.indexOf(needle) !== -1;
      if (match) visible++;
      row.el.toggleAttribute("hidden", !match);
    });
    panels.forEach(function (panel) {
      var any = panel.querySelector("[data-qrmo-faq-item]:not([hidden])");
      panel.toggleAttribute("hidden", !any);
    });
    if (statusEl) {
      statusEl.textContent =
        visible === 0
          ? "Eşleşen soru bulunamadı."
          : visible + " soru listeleniyor.";
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      applySearch(searchInput.value);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
    if (e.key === "Escape" && searchInput && document.activeElement === searchInput) {
      searchInput.value = "";
      applySearch("");
      searchInput.blur();
    }
  });

  function openDeepLink(id) {
    var el = document.getElementById(id);
    if (!el || !el.matches("details")) return;
    var panel = el.closest("[data-qrmo-faq-panel]");
    if (panel) {
      var cat = panel.getAttribute("data-qrmo-faq-panel");
      activateCategory(cat, { keepSearch: true });
    }
    el.setAttribute("open", "");
    closeOthersInPanel(el);
    requestAnimationFrame(function () {
      var topbar = document.querySelector(".qrmo-faq-topbar");
      var offset = (topbar ? topbar.offsetHeight : 56) + 16;
      var y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "auto" });
    });
  }

  function handleHash() {
    var hash = window.location.hash.replace(/^#/, "");
    if (hash && document.getElementById(hash)) openDeepLink(hash);
  }

  window.addEventListener("hashchange", handleHash);
  handleHash();
})();
