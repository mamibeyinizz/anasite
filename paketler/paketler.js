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

  /* ---------- 3. MOBİL HALKA SEÇİCİ (<768px) ---------- */

  var ringBtns = {};
  var ringEllipses = {};
  var ringMarks = {};
  var ringListEl = null;
  var ringLiveEl = null;
  var ringPainted = false;

  function svgNode(tag, attrs) {
    var n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === false || v == null) return;
        n.setAttribute(k, v === true ? "" : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return n;
  }

  function reduceMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function renderSwitcher() {
    var wrap = mount("switcher");
    ringLiveEl = el("p", {
      class: "qrmo-pricing-sr",
      id: "qrmo-pricing-ring-live",
      "aria-live": "polite"
    });
    ringListEl = el("ul", {
      class: "qrmo-pricing-ring-list",
      id: "qrmo-pricing-ring-list"
    });

    var geometry = [
      { cx: 86, cy: 54, rx: 70, ry: 48 },
      { cx: 160, cy: 54, rx: 70, ry: 48 },
      { cx: 234, cy: 54, rx: 70, ry: 48 }
    ];

    var svg = svgNode("svg", {
      class: "qrmo-pricing-rings-svg",
      viewBox: "0 0 320 148",
      focusable: "false",
      "aria-hidden": "true"
    });
    P.forEach(function (pkg, i) {
      var g = geometry[i] || geometry[geometry.length - 1];
      var ell = svgNode("ellipse", {
        class: "qrmo-pricing-ring-oval",
        cx: String(g.cx),
        cy: String(g.cy),
        rx: String(g.rx),
        ry: String(g.ry)
      });
      var mark = svgNode("circle", {
        class: "qrmo-pricing-ring-mark",
        cx: String(g.cx),
        cy: String(g.cy + g.ry - 11),
        r: "3.5"
      });
      var label = svgNode("text", {
        class: "qrmo-pricing-ring-label",
        x: String(g.cx),
        y: "128",
        "text-anchor": "middle"
      }, pkg.name);
      svg.appendChild(ell);
      svg.appendChild(mark);
      svg.appendChild(label);
      ringEllipses[pkg.id] = ell;
      ringMarks[pkg.id] = mark;
    });

    var hits = el("div", { class: "qrmo-pricing-rings-hits" });
    P.forEach(function (pkg) {
      var b = el("button", {
        class: "qrmo-pricing-ring-hit",
        type: "button",
        role: "radio",
        id: "qrmo-pricing-ring-" + pkg.id,
        "aria-controls": "qrmo-pricing-ring-list",
        "aria-label": (pkg.badge ? pkg.name + " paketi, önerilen" : pkg.name + " paketi")
      });
      b.addEventListener("click", function () { selectTab(pkg.id, false); });
      b.addEventListener("keydown", function (e) {
        var i = rank(pkg.id), n = P.length, to = -1;
        if (e.key === "ArrowRight") to = (i + 1) % n;
        else if (e.key === "ArrowLeft") to = (i - 1 + n) % n;
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = n - 1;
        if (to < 0) return;
        e.preventDefault();
        selectTab(P[to].id, true);
      });
      ringBtns[pkg.id] = b;
      hits.appendChild(b);
    });

    var rings = el("div", {
      class: "qrmo-pricing-rings",
      role: "radiogroup",
      "aria-label": "Paket seçin"
    }, svg, hits);

    wrap.appendChild(ringLiveEl);
    wrap.appendChild(el("div", { class: "qrmo-pricing-ring-panel" }, ringListEl));
    wrap.appendChild(rings);
    updateSwitcher();
  }

  function selectTab(id, focus) {
    activePkg = id;
    updateSwitcher();
    if (focus && ringBtns[id]) ringBtns[id].focus();
  }

  function updateSwitcher() {
    if (openTip) closeTip(openTip);
    var pkg = pkgById(activePkg);
    P.forEach(function (p) {
      var on = p.id === activePkg;
      var btn = ringBtns[p.id];
      if (btn) {
        btn.setAttribute("aria-checked", on ? "true" : "false");
        btn.tabIndex = on ? 0 : -1;
        btn.classList.toggle("is-active", on);
      }
      if (ringEllipses[p.id]) ringEllipses[p.id].classList.toggle("is-active", on);
      if (ringMarks[p.id]) ringMarks[p.id].classList.toggle("is-active", on);
    });

    var included = D.features.filter(function (f) { return status(f, pkg).on; });
    ringLiveEl.textContent = pkg.name + " paketi seçili. " + included.length + " özellik.";

    function paintList() {
      ringListEl.textContent = "";
      D.categories.forEach(function (cat) {
        var rows = included.filter(function (f) { return f.category === cat.id; });
        if (!rows.length) return;
        ringListEl.appendChild(el("li", { class: "qrmo-pricing-ring-cat" },
          el("p", { class: "qrmo-pricing-ring-cat-title", text: cat.name })));
        rows.forEach(function (f) {
          ringListEl.appendChild(el("li", { class: "qrmo-pricing-ring-item" },
            el("span", { class: "qrmo-pricing-check" }, icon("check")),
            el("span", { class: "qrmo-pricing-ring-item-name" }, featLabel(f))
          ));
        });
      });
    }

    if (!ringPainted || reduceMotion()) {
      paintList();
      ringPainted = true;
      return;
    }
    ringListEl.classList.add("is-fading");
    window.setTimeout(function () {
      paintList();
      ringListEl.classList.remove("is-fading");
    }, 90);
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
