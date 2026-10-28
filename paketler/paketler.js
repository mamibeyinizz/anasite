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

  var toggleRadios = {};
  var toggleRoot = null;
  var toggleSlider = null;
  var toggleKnob = null;
  var toggleListEl = null;
  var toggleLiveEl = null;
  var toggleKickerName = null;
  var toggleKickerCount = null;
  var togglePainted = false;
  var togglePrevIds = [];
  var toggleCountVal = 0;
  var toggleDrag = null;
  var toggleIgnoreClick = false;

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
    toggleLiveEl = el("p", {
      class: "qrmo-pricing-sr",
      id: "qrmo-pricing-switch-live",
      "aria-live": "polite"
    });

    var panel = el("div", { class: "qrmo-pricing-switch-panel" });
    var kicker = el("p", { class: "qrmo-pricing-switch-kicker" });
    toggleKickerName = el("span", { class: "qrmo-pricing-switch-kicker-name" });
    toggleKickerCount = el("span", { class: "qrmo-pricing-switch-kicker-count" });
    kicker.appendChild(toggleKickerName);
    kicker.appendChild(document.createTextNode(" · "));
    kicker.appendChild(toggleKickerCount);
    kicker.appendChild(document.createTextNode(" özellik"));

    toggleListEl = el("ul", {
      class: "qrmo-pricing-switch-list",
      id: "qrmo-pricing-switch-list"
    });

    toggleRoot = el("div", {
      class: "qrmo-pricing-toggle",
      role: "radiogroup",
      "aria-label": "Paket seçin"
    });
    toggleRoot.style.setProperty("--qp-toggle-i", String(Math.max(0, rank(activePkg))));

    var track = el("div", { class: "qrmo-pricing-toggle-track" });
    track.appendChild(el("span", { class: "qrmo-pricing-toggle-star", "aria-hidden": "true", style: "left:18%;top:28%" }));
    track.appendChild(el("span", { class: "qrmo-pricing-toggle-star", "aria-hidden": "true", style: "left:46%;top:62%" }));
    track.appendChild(el("span", { class: "qrmo-pricing-toggle-star", "aria-hidden": "true", style: "left:78%;top:22%" }));

    toggleSlider = el("div", { class: "qrmo-pricing-toggle-slider", "aria-hidden": "true" });
    toggleSlider.appendChild(el("span", { class: "qrmo-pricing-toggle-halo is-1" }));
    toggleSlider.appendChild(el("span", { class: "qrmo-pricing-toggle-halo is-2" }));
    toggleSlider.appendChild(el("span", { class: "qrmo-pricing-toggle-halo is-3" }));
    toggleKnob = el("span", { class: "qrmo-pricing-toggle-knob" });
    var motif = el("span", { class: "qrmo-pricing-toggle-motif" });
    motif.appendChild(el("i"));
    motif.appendChild(el("i"));
    motif.appendChild(el("i"));
    toggleKnob.appendChild(motif);
    toggleSlider.appendChild(toggleKnob);
    track.appendChild(toggleSlider);

    var hits = el("div", { class: "qrmo-pricing-toggle-hits" });
    var labels = el("div", { class: "qrmo-pricing-toggle-labels", "aria-hidden": "true" });
    P.forEach(function (pkg, i) {
      var b = el("button", {
        class: "qrmo-pricing-toggle-hit",
        type: "button",
        role: "radio",
        id: "qrmo-pricing-toggle-" + pkg.id,
        "aria-controls": "qrmo-pricing-switch-list",
        "aria-label": (pkg.badge ? pkg.name + " paketi, önerilen" : pkg.name + " paketi")
      });
      b.addEventListener("click", function () {
        if (toggleIgnoreClick) return;
        selectTab(pkg.id, false);
      });
      b.addEventListener("keydown", onToggleKey);
      toggleRadios[pkg.id] = b;
      hits.appendChild(b);
      labels.appendChild(el("span", {
        class: "qrmo-pricing-toggle-label",
        "data-pkg": pkg.id,
        text: pkg.name
      }));
      b.setAttribute("data-i", String(i));
    });
    track.appendChild(hits);
    toggleRoot.appendChild(track);
    toggleRoot.appendChild(labels);
    bindToggleDrag(track);

    var dock = el("div", { class: "qrmo-pricing-toggle-dock" }, toggleRoot);
    panel.appendChild(kicker);
    panel.appendChild(toggleListEl);
    panel.appendChild(dock);

    wrap.appendChild(toggleLiveEl);
    wrap.appendChild(panel);
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
      var pt = e.touches ? e.touches[0] : e;
      if (!pt) return;
      var dx = Math.abs(pt.clientX - toggleDrag.x0);
      if (dx > 8) toggleDrag.moved = true;
      var i = indexFromX(pt.clientX);
      toggleRoot.style.setProperty("--qp-toggle-i", String(i));
      toggleDrag.hover = i;
    }
    function onUp(e) {
      if (!toggleDrag) return;
      var pt = (e.changedTouches && e.changedTouches[0]) || e;
      var i = pt && typeof pt.clientX === "number" ? indexFromX(pt.clientX) : toggleDrag.hover;
      if (i == null) i = rank(activePkg);
      var id = P[i].id;
      var moved = toggleDrag.moved;
      toggleDrag = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      if (moved) {
        toggleIgnoreClick = true;
        window.setTimeout(function () { toggleIgnoreClick = false; }, 280);
        selectTab(id, false);
      }
    }
    track.addEventListener("pointerdown", function (e) {
      if (e.button != null && e.button !== 0) return;
      toggleDrag = { x0: e.clientX, moved: false, hover: rank(activePkg) };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    });
    track.addEventListener("touchstart", function (e) {
      var t = e.touches[0];
      if (!t) return;
      toggleDrag = { x0: t.clientX, moved: false, hover: rank(activePkg) };
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onUp);
    }, { passive: true });
  }

  function selectTab(id, focus) {
    if (id !== activePkg) {
      activePkg = id;
      updateSwitcher(false);
    } else {
      syncToggleChrome(true);
    }
    if (focus && toggleRadios[id]) toggleRadios[id].focus();
  }

  function syncToggleChrome(pop) {
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
    if (toggleKnob && pop && !reduceMotion()) {
      toggleKnob.classList.remove("is-pop");
      void toggleKnob.offsetWidth;
      toggleKnob.classList.add("is-pop");
    }
  }

  function paintSwitchList(included, pkg, enterIds) {
    toggleListEl.textContent = "";
    var stagger = 0;
    D.categories.forEach(function (cat) {
      var rows = included.filter(function (f) { return f.category === cat.id; });
      if (!rows.length) return;
      toggleListEl.appendChild(el("li", { class: "qrmo-pricing-switch-cat" },
        el("p", { class: "qrmo-pricing-switch-cat-title", text: cat.name })));
      rows.forEach(function (f) {
        var fresh = isFreshFeature(f, pkg);
        var enter = enterIds && enterIds[f.id];
        var row = el("li", {
          class: "qrmo-pricing-switch-item" + (fresh ? " is-fresh" : "") + (enter ? " is-enter" : ""),
          "data-feat": f.id
        });
        if (enter) row.style.setProperty("--stagger", String(stagger++));
        row.appendChild(el("span", { class: "qrmo-pricing-tick", "aria-hidden": "true" }, icon("check")));
        row.appendChild(el("span", { class: "qrmo-pricing-switch-item-name" }, featLabel(f)));
        toggleListEl.appendChild(row);
      });
    });
  }

  function updateSwitcher(first) {
    if (openTip) closeTip(openTip);
    var pkg = pkgById(activePkg);
    syncToggleChrome(!first);
    var included = includedFeatures(pkg);
    var nextIds = included.map(function (f) { return f.id; });
    var nextSet = {};
    nextIds.forEach(function (id) { nextSet[id] = true; });
    var enterIds = {};
    if (togglePainted) {
      nextIds.forEach(function (id) {
        if (togglePrevIds.indexOf(id) < 0) enterIds[id] = true;
      });
    }

    toggleKickerName.textContent = pkg.name;
    animateCount(toggleKickerCount, toggleCountVal, included.length);
    toggleCountVal = included.length;
    toggleLiveEl.textContent = pkg.name + " paketi seçildi, " + included.length + " özellik";

    function commit() {
      paintSwitchList(included, pkg, togglePainted && !reduceMotion() ? enterIds : null);
      togglePrevIds = nextIds;
      togglePainted = true;
    }

    if (first || !togglePainted || reduceMotion()) {
      commit();
      return;
    }

    var leaving = false;
    Array.prototype.forEach.call(toggleListEl.children, function (li) {
      var id = li.getAttribute("data-feat");
      if (id && !nextSet[id]) {
        li.classList.add("is-leave");
        leaving = true;
      }
    });
    window.setTimeout(commit, leaving ? 160 : 40);
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
