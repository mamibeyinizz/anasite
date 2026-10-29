/* =========================================================
   QR MENU OFFICIAL — /paketler/ RENDER
   İçerik packages-data.js'ten gelir; fiyat burada yeniden tanımlanmaz.
   Bağımlılık yok. Kapsam: .qrmo-pricing
========================================================= */
(function () {
  "use strict";

  var D = window.QRMO_PRICING;
  var root = document.getElementById("qrmo-pricing");
  if (!D || !root) return;

  var P = D.packages;
  var fmt = new Intl.NumberFormat("tr-TR");
  var period = D.defaultPeriod === "annual" ? "annual" : "monthly";
  var activePkg = P.length > 1 ? P[1].id : P[0].id;

  var freeMonths = D.annual.usedMonths - D.annual.payMonths;
  var modelHolds = P.every(function (p) {
    return p.price.annual === p.price.monthly * D.annual.payMonths;
  });
  var twoMonthOffer = modelHolds && freeMonths === 2;

  /* ---------- yardımcılar ---------- */

  function el(tag, attrs) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === false || v == null) return;
        if (k === "class") n.className = v;
        else if (k === "text") n.textContent = v;
        else n.setAttribute(k, v === true ? "" : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return n;
  }

  function icon(kind) {
    var s = document.createElement("span");
    s.setAttribute("aria-hidden", "true");
    var map = {
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
      dash:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 12h10"/></svg>',
      arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
      chev:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
      info:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 8h.01"/></svg>'
    };
    s.innerHTML = map[kind];
    s.className = "qrmo-pricing-ico qrmo-pricing-ico-" + kind;
    return s;
  }

  function featName(f) {
    if (!f.page || !D.modulePagesBase) return el("span", { text: f.name });
    return el("a", { class: "qrmo-pricing-modlink", href: D.modulePagesBase + f.page + "/", text: f.name });
  }

  var tipSeq = 0;
  var openTip = null;

  function closeTip(box) {
    if (!box) return;
    var btn = box.querySelector(".qrmo-pricing-tip-btn");
    var panel = box.querySelector(".qrmo-pricing-tip-panel");
    if (btn) btn.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
    box.classList.remove("is-open");
    if (openTip === box) openTip = null;
  }

  function placeTip(box) {
    var panel = box.querySelector(".qrmo-pricing-tip-panel");
    var btn = box.querySelector(".qrmo-pricing-tip-btn");
    if (!panel || !btn || panel.hidden) return;
    var pad = 10;
    void panel.offsetWidth;
    var br = btn.getBoundingClientRect();
    panel.style.position = "fixed";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    panel.style.left = "0px";
    panel.style.top = (br.bottom + 6) + "px";
    var r = panel.getBoundingClientRect();
    var left = br.left;
    if (left + r.width > window.innerWidth - pad) left = window.innerWidth - pad - r.width;
    if (left < pad) left = pad;
    panel.style.left = Math.round(left) + "px";
    var top = br.bottom + 6;
    r = panel.getBoundingClientRect();
    if (top + r.height > window.innerHeight - pad) top = br.top - r.height - 6;
    if (top + r.height > window.innerHeight - pad) top = window.innerHeight - pad - r.height;
    if (top < pad) top = pad;
    panel.style.top = Math.round(top) + "px";
  }

  function toggleTip(box) {
    var btn = box.querySelector(".qrmo-pricing-tip-btn");
    var isOpen = btn.getAttribute("aria-expanded") === "true";
    if (openTip && openTip !== box) closeTip(openTip);
    if (isOpen) {
      closeTip(box);
      return;
    }
    btn.setAttribute("aria-expanded", "true");
    box.querySelector(".qrmo-pricing-tip-panel").hidden = false;
    box.classList.add("is-open");
    openTip = box;
    placeTip(box);
    requestAnimationFrame(function () { if (openTip === box) placeTip(box); });
  }

  function featLabel(f) {
    var wrap = el("span", { class: "qrmo-pricing-feat-label" },
      el("span", { class: "qrmo-pricing-feat-name", text: f.name })
    );
    if (!f.blurb) return wrap;
    tipSeq += 1;
    var pid = "qrmo-pricing-tip-" + f.id + "-" + tipSeq;
    var titleId = pid + "-label";
    var btn = el("button", {
      class: "qrmo-pricing-tip-btn",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": pid,
      "aria-label": f.name + " hakkında bilgi"
    }, icon("info"));
    var panel = el("div", {
      class: "qrmo-pricing-tip-panel",
      id: pid,
      hidden: true,
      role: "region",
      "aria-labelledby": titleId
    });
    panel.appendChild(el("p", { class: "qrmo-pricing-sr", id: titleId, text: f.name }));
    panel.appendChild(el("p", { text: f.blurb }));
    var closeBtn = el("button", {
      class: "qrmo-pricing-tip-close",
      type: "button",
      "aria-label": f.name + " bilgisini kapat"
    }, el("span", { "aria-hidden": "true", text: "Kapat" }));
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeTip(box);
      btn.focus();
    });
    panel.appendChild(closeBtn);
    var box = el("span", { class: "qrmo-pricing-tip" }, btn, panel);
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleTip(box);
    });
    wrap.appendChild(box);
    return wrap;
  }

  function bindTipChrome() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !openTip) return;
      var btn = openTip.querySelector(".qrmo-pricing-tip-btn");
      closeTip(openTip);
      if (btn) btn.focus();
    });
    document.addEventListener("pointerdown", function (e) {
      if (!openTip) return;
      if (openTip.contains(e.target)) return;
      closeTip(openTip);
    });
    window.addEventListener("resize", function () {
      if (openTip) placeTip(openTip);
    });
    window.addEventListener("scroll", function () {
      if (openTip) placeTip(openTip);
    }, true);
  }

  function pkgById(id) { return P.filter(function (p) { return p.id === id; })[0]; }
  function rank(id) { return P.indexOf(pkgById(id)); }

  function status(f, pkg) {
    var v = f.values && f.values[pkg.id];
    if (typeof v === "string") return { on: true, text: v };
    if (v === false) return { on: false, text: null };
    if (v === true) return { on: true, text: null };
    return { on: rank(pkg.id) >= rank(f.from), text: null };
  }

  function savingsAmount(pkg) {
    return pkg.price.monthly * D.annual.usedMonths - pkg.price.annual;
  }

  function price(pkg) {
    var annual = period === "annual";
    var amount = annual ? pkg.price.annual : pkg.price.monthly;
    var save = savingsAmount(pkg);
    var note = annual
      ? (modelHolds
        ? D.annual.usedMonths + " ay kullanım için tahsil edilen toplam. " + D.annual.payMonths + " aylık ücrete karşılık gelir."
        : "Seçilen dönem için tahsil edilen yıllık toplam.")
      : "Her ay tahsil edilen tutar.";
    var saveText = "";
    if (annual && save > 0) {
      saveText = D.annual.usedMonths + " aylık ödemeye göre tasarruf: " + fmt.format(save) + " " + D.currency + ".";
    }
    return {
      amount: fmt.format(amount),
      unit: D.currency + (annual ? " / yıl" : " / ay"),
      qualifier: annual ? "Yıllık toplam" : "Aylık tahsilat",
      short: fmt.format(amount) + " " + D.currency,
      note: note,
      save: saveText
    };
  }

  function colMark(pkg) {
    if (pkg.variant === "featured") return " is-featured";
    if (pkg.variant === "dark") return " is-plus";
    return " is-temel";
  }

  /* Satın alma href'i boşsa düğme iletişim formuna gider. Sahte ödeme adresi üretilmez. */
  function cta(pkg, label, variant, final) {
    var purchase = D.cta.href && String(D.cta.href).trim();
    var help = D.cta.finalHref && String(D.cta.finalHref).trim();
    var tpl = final ? help : (purchase || help);
    var cls = "qrmo-pricing-btn qrmo-pricing-btn--" + variant;
    var kids = [el("span", { text: label }), icon("arrow")];
    if (tpl) {
      var href = tpl.replace("{id}", pkg ? pkg.id : "");
      var a = el("a", { class: cls, href: href });
      if (!final && !purchase) a.setAttribute("aria-describedby", "qrmo-pricing-flow-note");
      kids.forEach(function (k) { a.appendChild(k); });
      return a;
    }
    var b = el("button", {
      class: cls,
      type: "button",
      "data-cta-pending": "",
      "aria-describedby": "qrmo-pricing-flow-note"
    });
    b.addEventListener("click", function () { showPending(b); });
    kids.forEach(function (k) { b.appendChild(k); });
    return b;
  }

  function showPending(btn) {
    if (!D.cta.pendingNotice) return;
    var n = btn.nextElementSibling;
    if (!n || !n.classList.contains("qrmo-pricing-cta-note")) {
      n = el("p", { class: "qrmo-pricing-cta-note", role: "status" });
      btn.parentNode.insertBefore(n, btn.nextSibling);
    }
    n.textContent = D.cta.pendingNotice || "";
  }

  function mount(name) { return root.querySelector('[data-qp-mount="' + name + '"]'); }

  /* ---------- 1. KARTLAR ---------- */

  function renderCards() {
    var wrap = mount("cards");
    P.forEach(function (pkg) {
      var variant = pkg.variant || "plain";
      var btnVariant = variant === "featured" ? "primary" : variant === "dark" ? "on-dark" : "outline";

      var previewCount = 3;
      var list = el("ul", { class: "qrmo-pricing-card-list", id: "paket-" + pkg.id + "-feats" });
      pkg.highlights.forEach(function (fid, idx) {
        var f = D.features.filter(function (x) { return x.id === fid; })[0];
        if (!f) return;
        list.appendChild(el("li", {
          class: idx >= previewCount ? "qrmo-pricing-card-feat--rest" : false
        }, el("span", { class: "qrmo-pricing-check" }, icon("check")), featName(f)));
      });

      var moreBtn = null;
      if (pkg.highlights.length > previewCount) {
        moreBtn = el("button", {
          class: "qrmo-pricing-more-feats",
          type: "button",
          "aria-expanded": "false",
          "aria-controls": list.id,
          "aria-label": pkg.name + ": tüm özellikleri gör"
        },
          el("span", { class: "qrmo-pricing-more-feats-text", text: "Tüm özellikleri gör" }),
          icon("chev")
        );
      }

      var card = el("article", {
        class: "qrmo-pricing-card qrmo-pricing-card--" + variant,
        id: "paket-" + pkg.id,
        "aria-labelledby": "paket-" + pkg.id + "-name"
      },
        el("header", { class: "qrmo-pricing-card-head" },
          variant === "dark" ? el("p", { class: "qrmo-pricing-sr", text: "Gelişmiş paket" }) : null,
          el("div", { class: "qrmo-pricing-card-title-row" },
            el("h3", { class: "qrmo-pricing-card-name", id: "paket-" + pkg.id + "-name", text: pkg.name }),
            pkg.badge ? el("p", { class: "qrmo-pricing-badge", text: pkg.badge }) : null
          ),
          el("p", { class: "qrmo-pricing-card-tagline", text: pkg.tagline }),
          pkg.recommendReason ? el("p", { class: "qrmo-pricing-reason", text: pkg.recommendReason }) : null
        ),
        el("div", { class: "qrmo-pricing-price" },
          el("p", { class: "qrmo-pricing-price-row" },
            el("span", { class: "qrmo-pricing-amount", "data-qp": "amount", "data-pkg": pkg.id }),
            el("span", { class: "qrmo-pricing-unit", "data-qp": "unit", "data-pkg": pkg.id })
          ),
          el("p", { class: "qrmo-pricing-qualifier", "data-qp": "qualifier", "data-pkg": pkg.id }),
          el("p", { class: "qrmo-pricing-price-sub", "data-qp": "note", "data-pkg": pkg.id }),
          el("p", { class: "qrmo-pricing-save", "data-qp": "save", "data-pkg": pkg.id, hidden: true })
        ),
        el("p", { class: "qrmo-pricing-card-summary", text: pkg.summary }),
        el("div", { class: "qrmo-pricing-card-body" },
          el("p", { class: "qrmo-pricing-label qrmo-pricing-card-lead", text: pkg.highlightsLead.toLocaleUpperCase("tr") }),
          list,
          moreBtn
        ),
        el("div", { class: "qrmo-pricing-card-actions" },
          cta(pkg, pkg.ctaLabel, btnVariant),
          D.showSubdomain && pkg.subdomain
            ? el("p", { class: "qrmo-pricing-card-sub", text: pkg.subdomain })
            : null
        )
      );
      if (moreBtn) {
        moreBtn.addEventListener("click", function () {
          var open = card.classList.toggle("is-feats-open");
          moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
          moreBtn.setAttribute("aria-label", open
            ? pkg.name + " özelliklerini gizle"
            : pkg.name + ": tüm özellikleri gör");
          moreBtn.querySelector(".qrmo-pricing-more-feats-text").textContent = open
            ? "Gizle"
            : "Tüm özellikleri gör";
        });
      }
      wrap.appendChild(card);
    });
  }

  /* ---------- 2. TABLO (≥768px) ---------- */

  function statusCell(f, pkg) {
    var s = status(f, pkg);
    var td = el("td", { class: "qrmo-pricing-cell" + colMark(pkg) });
    if (s.text) {
      td.appendChild(el("span", { class: "qrmo-pricing-cell-text", text: s.text }));
    } else if (s.on) {
      td.appendChild(el("span", { class: "qrmo-pricing-check" }, icon("check")));
      td.appendChild(el("span", { class: "qrmo-pricing-sr", text: "Dahil" }));
    } else {
      td.appendChild(el("span", { class: "qrmo-pricing-cell-off" }, icon("dash")));
      td.appendChild(el("span", { class: "qrmo-pricing-sr", text: "Bu pakette yok" }));
    }
    return td;
  }

  function appendFeatureRows(table, features) {
    D.categories.forEach(function (cat) {
      var rows = features.filter(function (f) { return f.category === cat.id; });
      if (!rows.length) return;
      var tb = el("tbody");
      tb.appendChild(el("tr", { class: "qrmo-pricing-cat-row" },
        el("th", { scope: "colgroup", colspan: String(P.length + 1), text: cat.name.toLocaleUpperCase("tr") })));
      rows.forEach(function (f) {
        var tr = el("tr", null, el("th", { scope: "row", class: "qrmo-pricing-feature" }, featLabel(f)));
        P.forEach(function (pkg) { tr.appendChild(statusCell(f, pkg)); });
        tb.appendChild(tr);
      });
      table.appendChild(tb);
    });
  }

  function headerCell(pkg) {
    var th = el("th", { scope: "col", class: "qrmo-pricing-th" + colMark(pkg) });
    th.appendChild(pkg.badge
      ? el("span", { class: "qrmo-pricing-th-badge", text: pkg.badge })
      : el("span", { class: "qrmo-pricing-th-badge is-empty", "aria-hidden": "true" }));
    th.appendChild(el("span", { class: "qrmo-pricing-th-name", text: pkg.name }));
    th.appendChild(el("span", { class: "qrmo-pricing-th-role", text: "Paket" }));
    return th;
  }

  function makeTable(features, caption, isMain) {
    var table = el("table", { class: "qrmo-pricing-table" + (isMain ? " qrmo-pricing-table--main" : "") });
    table.appendChild(el("caption", { class: "qrmo-pricing-sr", text: caption }));
    var colgroup = el("colgroup", null, el("col", { class: "qrmo-pricing-col-label" }));
    P.forEach(function () { colgroup.appendChild(el("col")); });
    table.appendChild(colgroup);

    var hr = el("tr", null, el("th", { scope: "col", class: "qrmo-pricing-th-label" }, el("span", { class: "qrmo-pricing-sr", text: "Özellik" })));
    P.forEach(function (pkg) { hr.appendChild(headerCell(pkg)); });
    table.appendChild(el("thead", null, hr));
    appendFeatureRows(table, features);
    return table;
  }

  function renderTable() {
    var wrap = mount("table");
    var primary = D.features.filter(function (f) { return !f.secondary; });
    var secondary = D.features.filter(function (f) { return f.secondary; });
    wrap.appendChild(makeTable(primary, "Temel, Pro ve Plus özellik tablosu", true));
    if (!secondary.length) return;

    var details = el("details", { class: "qrmo-pricing-more" });
    details.appendChild(el("summary", null, "Dijital menüdeki diğer özellikler"));
    details.appendChild(el("p", {
      class: "qrmo-pricing-more-note",
      text: "Bu özellikler Temel paketten itibaren bütün paketlerde vardır."
    }));
    details.appendChild(makeTable(secondary, "Dijital menüdeki diğer özellikler", false));
    wrap.appendChild(details);
  }

  /* ---------- 3. MOBİL PAKET TOGGLE (<768px) ---------- */

  var FLAT_KEY = "qrmo-pricing-compare-flat";
  var toggleRadios = {};
  var toggleRoot = null;
  var toggleListEl = null;
  var toggleLiveEl = null;
  var toggleSumName = null;
  var toggleSumCount = null;
  var toggleSumSub = null;
  var toggleModeBtn = null;
  var togglePanelEl = null;
  var toggleCatCounts = {};
  var toggleOpenRow = null;
  var toggleCountVal = 0;
  var toggleExtraVal = 0;
  var toggleDrag = null;
  var toggleIgnoreClick = false;
  var toggleFlat = false;
  var toggleAccSeq = 0;

  function reduceMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function includedFeatures(pkg) {
    return D.features.filter(function (f) { return status(f, pkg).on; });
  }

  function isFreshFeature(f, pkg) {
    var i = rank(pkg.id);
    if (i <= 0) return false;
    return !status(f, P[i - 1]).on;
  }

  function locative(name) {
    if (name === "Pro") return "Pro’da";
    if (name === "Plus") return "Plus’ta";
    if (name === "Temel") return "Temel’de";
    return name + "’da";
  }

  function dative(name) {
    if (name === "Pro") return "Pro’ya";
    if (name === "Plus") return "Plus’a";
    return name + "’e";
  }

  function readFlat() {
    try { return sessionStorage.getItem(FLAT_KEY) === "1"; } catch (err) { return false; }
  }

  function writeFlat(on) {
    try { sessionStorage.setItem(FLAT_KEY, on ? "1" : "0"); } catch (err) {}
  }

  function haptic() {
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (err) {}
  }

  function featuresFrom(pkgId) {
    return D.features.filter(function (f) { return f.from === pkgId; });
  }

  function closeSwitchAcc() {
    if (!toggleOpenRow) return;
    toggleOpenRow.classList.remove("is-open");
    var btn = toggleOpenRow.querySelector(".qrmo-pricing-switch-row");
    if (btn) btn.setAttribute("aria-expanded", "false");
    toggleOpenRow = null;
  }

  function scrollListStart() {
    if (!togglePanelEl) return;
    var sum = togglePanelEl.querySelector(".qrmo-pricing-switch-summary");
    var y = (sum || togglePanelEl).getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo(0, Math.max(0, y));
  }

  function extraVsLower(pkg) {
    var i = rank(pkg.id);
    if (i <= 0) return 0;
    return includedFeatures(pkg).length - includedFeatures(P[i - 1]).length;
  }

  function animateCount(node, from, to) {
    if (!node) return;
    if (from === to || reduceMotion()) {
      node.textContent = String(to);
      return;
    }
    var start = performance.now();
    var dur = 380;
    function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      node.textContent = String(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderSwitcher() {
    var wrap = mount("switcher");
    toggleFlat = readFlat();
    toggleLiveEl = el("p", {
      class: "qrmo-pricing-sr",
      id: "qrmo-pricing-switch-live",
      "aria-live": "polite"
    });

    togglePanelEl = el("div", { class: "qrmo-pricing-switch-panel" });
    var summary = el("div", { class: "qrmo-pricing-switch-summary" });
    var title = el("p", { class: "qrmo-pricing-switch-sum-title" });
    toggleSumName = el("span", { class: "qrmo-pricing-switch-sum-name" });
    toggleSumCount = el("span", { class: "qrmo-pricing-switch-sum-count" });
    title.appendChild(toggleSumName);
    title.appendChild(document.createTextNode(" · "));
    title.appendChild(toggleSumCount);
    title.appendChild(document.createTextNode(" özellik"));
    toggleSumSub = el("p", { class: "qrmo-pricing-switch-sum-sub" });
    summary.appendChild(title);
    summary.appendChild(toggleSumSub);

    toggleListEl = el("ul", {
      class: "qrmo-pricing-switch-list",
      id: "qrmo-pricing-switch-list"
    });

    toggleModeBtn = el("button", {
      class: "qrmo-pricing-switch-mode",
      type: "button"
    });
    toggleModeBtn.addEventListener("click", function () {
      toggleFlat = !toggleFlat;
      writeFlat(toggleFlat);
      paintSwitchList();
      updateSwitcher(true);
    });

    toggleRoot = el("div", {
      class: "qrmo-pricing-toggle",
      role: "radiogroup",
      "aria-label": "Paket seçin"
    });
    toggleRoot.style.setProperty("--qp-toggle-i", String(Math.max(0, rank(activePkg))));

    var track = el("div", { class: "qrmo-pricing-toggle-track" });
    track.appendChild(el("span", { class: "qrmo-pricing-toggle-thumb", "aria-hidden": "true" }));
    var hits = el("div", { class: "qrmo-pricing-toggle-hits" });
    P.forEach(function (pkg, i) {
      var b = el("button", {
        class: "qrmo-pricing-toggle-hit",
        type: "button",
        role: "radio",
        id: "qrmo-pricing-toggle-" + pkg.id,
        "aria-controls": "qrmo-pricing-switch-list",
        "aria-label": (pkg.badge ? pkg.name + " paketi, önerilen" : pkg.name + " paketi"),
        text: pkg.name
      });
      b.setAttribute("data-i", String(i));
      b.addEventListener("click", function () {
        if (toggleIgnoreClick) return;
        selectTab(pkg.id, false);
      });
      b.addEventListener("keydown", onToggleKey);
      toggleRadios[pkg.id] = b;
      hits.appendChild(b);
    });
    track.appendChild(hits);
    toggleRoot.appendChild(track);
    bindToggleDrag(track);

    var dock = el("div", { class: "qrmo-pricing-toggle-dock" }, toggleRoot);
    togglePanelEl.appendChild(summary);
    togglePanelEl.appendChild(toggleListEl);
    togglePanelEl.appendChild(toggleModeBtn);
    togglePanelEl.appendChild(dock);

    wrap.appendChild(toggleLiveEl);
    wrap.appendChild(togglePanelEl);
    paintSwitchList();
    updateSwitcher(true);
  }

  function onToggleKey(e) {
    var i = rank(activePkg);
    var n = P.length;
    var to = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") to = Math.min(n - 1, i + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = Math.max(0, i - 1);
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = n - 1;
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      selectTab(activePkg, false);
      return;
    }
    if (to < 0 || to === i) return;
    e.preventDefault();
    selectTab(P[to].id, true);
  }

  function bindToggleDrag(track) {
    function indexFromX(clientX) {
      var r = track.getBoundingClientRect();
      var x = clientX - r.left;
      var t = r.width ? x / r.width : 0;
      if (t < 1 / 3) return 0;
      if (t < 2 / 3) return 1;
      return 2;
    }
    function onMove(e) {
      if (!toggleDrag) return;
      var dx = Math.abs(e.clientX - toggleDrag.x0);
      if (dx > 8) toggleDrag.moved = true;
      var i = indexFromX(e.clientX);
      toggleRoot.style.setProperty("--qp-toggle-i", String(i));
      toggleDrag.hover = i;
    }
    function onUp(e) {
      if (!toggleDrag) return;
      var i = typeof e.clientX === "number" ? indexFromX(e.clientX) : toggleDrag.hover;
      if (i == null) i = rank(activePkg);
      var id = P[i].id;
      var moved = toggleDrag.moved;
      toggleDrag = null;
      try { track.releasePointerCapture(e.pointerId); } catch (err) {}
      if (moved) {
        toggleIgnoreClick = true;
        window.setTimeout(function () { toggleIgnoreClick = false; }, 280);
        haptic();
        selectTab(id, false);
      }
    }
    track.addEventListener("pointerdown", function (e) {
      if (e.button != null && e.button !== 0) return;
      toggleDrag = { x0: e.clientX, moved: false, hover: rank(activePkg) };
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
    });
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
  }

  function selectTab(id, focus, scrollStart) {
    if (id !== activePkg) {
      activePkg = id;
      paintSwitchList();
      updateSwitcher(false);
      if (scrollStart) scrollListStart();
    } else {
      syncToggleChrome();
    }
    if (focus && toggleRadios[id]) toggleRadios[id].focus();
  }

  function syncToggleChrome() {
    var pkg = pkgById(activePkg);
    var i = Math.max(0, rank(activePkg));
    toggleRoot.setAttribute("data-pkg", pkg.id);
    toggleRoot.style.setProperty("--qp-toggle-i", String(i));
    P.forEach(function (p) {
      var on = p.id === activePkg;
      var btn = toggleRadios[p.id];
      if (btn) {
        btn.setAttribute("aria-checked", on ? "true" : "false");
        btn.tabIndex = on ? 0 : -1;
        btn.classList.toggle("is-active", on);
      }
    });
  }

  function catCountPair(cat, pkg) {
    var total = D.features.filter(function (f) { return f.category === cat.id; }).length;
    var on = D.features.filter(function (f) { return f.category === cat.id && status(f, pkg).on; }).length;
    return on + "/" + total;
  }

  function catsIn(feats) {
    return D.categories.filter(function (cat) {
      return feats.some(function (f) { return f.category === cat.id; });
    });
  }

  function appendCatBlock(parent, feats, pkg, startIndex, opts) {
    var idx = startIndex || 0;
    var showCount = !!(opts && opts.showCount);
    var used = catsIn(feats);
    var hideCat = used.length <= 1 && !(opts && opts.alwaysCat);
    D.categories.forEach(function (cat) {
      var rows = feats.filter(function (f) { return f.category === cat.id; });
      if (!rows.length) return;
      if (!hideCat) {
        var title = el("p", { class: "qrmo-pricing-switch-cat-title" },
          el("span", { class: "qrmo-pricing-switch-cat-name", text: cat.name })
        );
        if (showCount) {
          title.appendChild(el("span", { class: "qrmo-pricing-switch-cat-count", text: catCountPair(cat, pkg) }));
        }
        parent.appendChild(el("li", { class: "qrmo-pricing-switch-cat" }, title));
      }
      rows.forEach(function (f) {
        parent.appendChild(makeFeatRow(f, pkg, idx++));
      });
    });
    return idx;
  }

  function makeFeatRow(f, pkg, index) {
    toggleAccSeq += 1;
    var pid = "qrmo-pricing-acc-" + f.id + "-" + toggleAccSeq;
    var on = status(f, pkg).on;
    var fresh = on && isFreshFeature(f, pkg);
    var fromPkg = pkgById(f.from) || P[0];
    var mark = el("span", { class: "qrmo-pricing-switch-mark", "aria-hidden": "true" },
      el("span", { class: "qrmo-pricing-tick" }, icon("check")),
      el("span", { class: "qrmo-pricing-dash" }, icon("dash"))
    );
    var name = el("span", { class: "qrmo-pricing-switch-item-name" },
      el("span", { class: "qrmo-pricing-feat-name", text: f.name })
    );
    var fromEl = el("span", { class: "qrmo-pricing-switch-from", text: locative(fromPkg.name) });
    if (!on) {
      fromEl.setAttribute("role", "button");
      fromEl.setAttribute("tabindex", "0");
      fromEl.setAttribute("aria-label", fromPkg.name + " paketine geç");
      function goFrom(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        selectTab(fromPkg.id, false, true);
      }
      fromEl.addEventListener("click", goFrom);
      fromEl.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") goFrom(ev);
      });
    }
    var rowBtn = el(f.blurb ? "button" : "div", {
      class: "qrmo-pricing-switch-row",
      type: f.blurb ? "button" : undefined
    }, mark, name);
    if (f.blurb) {
      rowBtn.setAttribute("aria-expanded", "false");
      rowBtn.setAttribute("aria-controls", pid);
    }
    var main = el("div", { class: "qrmo-pricing-switch-main" }, rowBtn, fromEl);
    var detailInner = el("div", { class: "qrmo-pricing-switch-detail-inner" });
    if (f.blurb) detailInner.appendChild(el("p", { text: f.blurb }));
    var detail = el("div", { class: "qrmo-pricing-switch-detail", id: pid }, detailInner);
    var row = el("li", {
      class: "qrmo-pricing-switch-item" + (fresh ? " is-new" : on ? " is-on" : " is-off"),
      "data-feat": f.id
    }, main, detail);
    row.style.setProperty("--i", String(Math.min(index, 21)));
    if (f.blurb) {
      rowBtn.addEventListener("click", function () {
        var open = row.classList.contains("is-open");
        closeSwitchAcc();
        if (open) return;
        row.classList.add("is-open");
        rowBtn.setAttribute("aria-expanded", "true");
        toggleOpenRow = row;
      });
    }
    return row;
  }

  function makeFold(id, titlePrefix, feats, pkg, open, locked, goPkg) {
    var bodyId = "qrmo-pricing-fold-" + id;
    var head = el("div", { class: "qrmo-pricing-switch-fold-bar" });
    var titleEl = el("span", { class: "qrmo-pricing-switch-fold-title" });
    var tog = el("button", {
      class: "qrmo-pricing-switch-fold-head",
      type: "button",
      "aria-expanded": open ? "true" : "false",
      "aria-controls": bodyId
    },
      titleEl,
      el("span", { class: "qrmo-pricing-switch-fold-chev", "aria-hidden": "true" }, icon("chev"))
    );
    head.appendChild(tog);
    if (goPkg) {
      var go = el("button", {
        class: "qrmo-pricing-switch-go",
        type: "button",
        text: dative(goPkg.name) + " geç"
      });
      go.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        selectTab(goPkg.id, false, true);
      });
      head.appendChild(go);
    }
    var inner = el("ul", { class: "qrmo-pricing-switch-fold-inner" });
    appendCatBlock(inner, feats, pkg, 0, { showCount: false });
    var n = inner.querySelectorAll(".qrmo-pricing-switch-item").length;
    titleEl.textContent = titlePrefix + " · " + n;
    var body = el("div", { class: "qrmo-pricing-switch-fold-body", id: bodyId }, inner);
    var fold = el("li", {
      class: "qrmo-pricing-switch-fold" + (open ? " is-open" : "") + (locked ? " is-locked" : "")
    }, head, body);
    tog.addEventListener("click", function () {
      var on = fold.classList.toggle("is-open");
      tog.setAttribute("aria-expanded", on ? "true" : "false");
    });
    return fold;
  }

  function paintDeltaList() {
    toggleListEl.textContent = "";
    toggleCatCounts = {};
    var pkg = pkgById(activePkg);
    var iSel = rank(activePkg);
    toggleModeBtn.textContent = toggleFlat
      ? "Paket farkına göre gör"
      : "Tüm 21 özelliği tek listede gör";

    if (toggleFlat) {
      appendCatBlock(toggleListEl, D.features, pkg, 0, { showCount: true, alwaysCat: true });
      return;
    }

    var extras = featuresFrom(pkg.id);
    if (iSel === 0) {
      appendCatBlock(toggleListEl, extras, pkg, 0, { showCount: false });
    } else {
      P.slice(0, iSel).forEach(function (lower) {
        var feats = featuresFrom(lower.id);
        var prefix = lower.id === "temel" ? "Temel’in tamamı" : lower.name + " ile gelen";
        toggleListEl.appendChild(makeFold("lower-" + lower.id, prefix, feats, pkg, false, false, null));
      });
      var extraWrap = el("li", { class: "qrmo-pricing-switch-incoming" });
      var extraTitleEl = el("p", { class: "qrmo-pricing-switch-incoming-title" });
      extraWrap.appendChild(extraTitleEl);
      var extraList = el("ul", { class: "qrmo-pricing-switch-incoming-list" });
      appendCatBlock(extraList, extras, pkg, 0, { showCount: false });
      extraTitleEl.textContent = pkg.name.toLocaleUpperCase("tr") + " İLE GELEN · " +
        extraList.querySelectorAll(".qrmo-pricing-switch-item").length;
      extraWrap.appendChild(extraList);
      toggleListEl.appendChild(extraWrap);
    }

    P.slice(iSel + 1).forEach(function (higher) {
      var feats = featuresFrom(higher.id);
      toggleListEl.appendChild(makeFold("teaser-" + higher.id, locative(higher.name), feats, pkg, false, true, higher));
    });
  }

  function paintSwitchList() {
    closeSwitchAcc();
    paintDeltaList();
  }

  function updateSwitcher(first) {
    closeSwitchAcc();
    if (openTip) closeTip(openTip);
    var pkg = pkgById(activePkg);
    syncToggleChrome();
    var included = includedFeatures(pkg);
    var extra = extraVsLower(pkg);

    toggleSumName.textContent = pkg.name;
    animateCount(toggleSumCount, first ? included.length : toggleCountVal, included.length);
    toggleCountVal = included.length;
    if (rank(pkg.id) <= 0) {
      toggleSumSub.textContent = "Başlangıç paketi";
      toggleExtraVal = 0;
    } else {
      var lower = P[rank(pkg.id) - 1];
      toggleSumSub.textContent = "";
      toggleSumSub.appendChild(document.createTextNode(dative(lower.name) + " ek "));
      var extraNode = el("span", { class: "qrmo-pricing-switch-sum-extra" });
      toggleSumSub.appendChild(extraNode);
      toggleSumSub.appendChild(document.createTextNode(" özellik"));
      animateCount(extraNode, first ? extra : toggleExtraVal, extra);
      toggleExtraVal = extra;
    }

    toggleLiveEl.textContent = pkg.name + " seçildi, " + included.length + " özellik";
  }

  /* ---------- 4. HANGİ PAKET ---------- */

  function renderWhich() {
    var list = mount("which");
    P.forEach(function (pkg) {
      list.appendChild(el("li", { class: "qrmo-pricing-which-item" },
        el("div", { class: "qrmo-pricing-which-copy" },
          el("h3", { class: "qrmo-pricing-which-title", text: pkg.scenario.title }),
          el("p", { text: pkg.scenario.text })
        ),
        el("div", { class: "qrmo-pricing-which-pick" },
          el("p", { class: "qrmo-pricing-label", text: "UYGUN PAKET" }),
          el("p", { class: "qrmo-pricing-which-name", text: pkg.name }),
          el("a", { class: "qrmo-pricing-textlink", href: "#paket-" + pkg.id },
            pkg.name + " paketini incele ",
            el("span", { "aria-hidden": "true", text: "→" })
          )
        )
      ));
    });
  }

  /* ---------- 5. SON CTA ---------- */

  function renderFinal() {
    mount("final-cta").appendChild(cta(null, D.cta.finalLabel, "on-dark", true));
  }

  /* ---------- FİYAT / DÖNEM ---------- */

  function periodMessage() {
    if (period === "annual") {
      if (modelHolds) {
        return "Karttaki tutar yıllık toplamdır: " + D.annual.usedMonths + " ay kullanım için tahsil edilir ve " + D.annual.payMonths + " aylık ücrete karşılık gelir. Tasarruf satırı, tahsil edilen tutar değildir.";
      }
      return "Karttaki tutar, yıllık toplam tahsilattır.";
    }
    if (twoMonthOffer) {
      return "Karttaki tutar her ay tahsil edilir. Yıllık toplam, " + D.annual.payMonths + " aylık ücrete karşılık gelir.";
    }
    return "Karttaki tutar her ay tahsil edilir.";
  }

  function updatePrices(animate) {
    var byPkg = {};
    P.forEach(function (p) { byPkg[p.id] = price(p); });

    root.querySelectorAll("[data-qp]").forEach(function (n) {
      var pr = byPkg[n.getAttribute("data-pkg")];
      if (!pr) return;
      var kind = n.getAttribute("data-qp");
      var next = kind === "amount" ? pr.amount
        : kind === "unit" ? pr.unit
        : kind === "note" ? pr.note
        : kind === "save" ? pr.save
        : kind === "qualifier" ? pr.qualifier
        : kind === "short" ? pr.short
        : (period === "annual" ? "yıllık toplam" : "/ ay");
      if (kind === "save") {
        n.hidden = !next;
        n.textContent = next || "";
      } else if (n.textContent !== next) n.textContent = next;
      if (animate && (kind === "amount" || kind === "short")) {
        n.classList.remove("is-swap");
        void n.offsetWidth;
        n.classList.add("is-swap");
      }
    });

    root.querySelectorAll("[data-qp-free]").forEach(function (n) {
      n.textContent = twoMonthOffer ? "2 ay daha az" : "";
      n.hidden = !twoMonthOffer;
    });

    var note = document.getElementById("qrmo-pricing-period-note");
    if (note) note.textContent = periodMessage();
  }

  function bindToggle() {
    var radios = root.querySelectorAll('input[name="qrmo-pricing-period"]');
    radios.forEach(function (r) {
      r.checked = r.value === period;
      r.addEventListener("change", function () {
        if (!r.checked) return;
        period = r.value;
        updatePrices(true);
      });
    });
  }

  /* ---------- BAŞLAT ---------- */

  function syncStickyOffset() {
    var hdr = document.querySelector("[data-qrmo-gh]");
    if (!hdr) return;
    var h = Math.round(hdr.getBoundingClientRect().height);
    if (h > 0) root.style.setProperty("--qp-sticky-top", h + "px");
  }

  function initHeroViz() {
    var nodes = root.querySelectorAll("[data-qp-viz-n]");
    if (!nodes.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodes.forEach(function (n) {
      var end = parseInt(n.getAttribute("data-qp-viz-n"), 10);
      if (!end && end !== 0) return;
      n.textContent = String(end);
      if (reduce) return;
      n.textContent = "0";
      var start = performance.now();
      var dur = 650;
      function tick(now) {
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        n.textContent = String(Math.round(end * eased));
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  renderCards();
  renderTable();
  renderSwitcher();
  bindTipChrome();
  renderWhich();
  renderFinal();
  bindToggle();
  updatePrices(false);
  initHeroViz();
  syncStickyOffset();
  window.addEventListener("resize", syncStickyOffset);
  if (typeof ResizeObserver !== "undefined") {
    var hdrEl = document.querySelector("[data-qrmo-gh]");
    if (hdrEl) new ResizeObserver(syncStickyOffset).observe(hdrEl);
  }

  if (D.priceNote) {
    var pn = mount("price-note");
    pn.textContent = D.priceNote;
    pn.hidden = false;
  }
})();
