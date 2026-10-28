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
  var openCats = {};
  D.categories.forEach(function (c, i) { openCats[c.id] = i === 0; });

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
    if (!panel) return;
    panel.style.left = "0";
    panel.style.right = "auto";
    panel.style.top = "calc(100% + 6px)";
    panel.style.bottom = "auto";
    var r = panel.getBoundingClientRect();
    var pad = 10;
    if (r.right > window.innerWidth - pad) {
      panel.style.left = "auto";
      panel.style.right = "0";
    }
    r = panel.getBoundingClientRect();
    if (r.left < pad) {
      panel.style.left = "0";
      panel.style.right = "auto";
    }
    r = panel.getBoundingClientRect();
    if (r.bottom > window.innerHeight - pad) {
      panel.style.top = "auto";
      panel.style.bottom = "calc(100% + 6px)";
    }
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
  }

  function featLabel(f) {
    var wrap = el("span", { class: "qrmo-pricing-feat-label" }, featName(f));
    if (!f.blurb) return wrap;
    tipSeq += 1;
    var pid = "qrmo-pricing-tip-" + f.id + "-" + tipSeq;
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
      role: "region"
    });
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

  /* ---------- 3. MOBİL SEÇİCİ (<768px) ---------- */

  var tabEls = {}, panelEl, introEl, ctaSlot, accLists = {}, accBtns = {};

  function renderSwitcher() {
    var wrap = mount("switcher");

    var tablist = el("div", { class: "qrmo-pricing-tabs", role: "tablist", "aria-label": "Karşılaştırılacak paket" });
    P.forEach(function (pkg) {
      var t = el("button", {
        class: "qrmo-pricing-tab",
        type: "button",
        role: "tab",
        id: "qrmo-pricing-tab-" + pkg.id,
        "aria-controls": "qrmo-pricing-panel"
      },
        el("span", { class: "qrmo-pricing-tab-name", text: pkg.name }),
        pkg.badge ? el("span", { class: "qrmo-pricing-tab-badge", text: pkg.badge }) : null,
        el("span", { class: "qrmo-pricing-tab-price" },
          el("span", { "data-qp": "short", "data-pkg": pkg.id }),
          el("span", { "data-qp": "qualifier", "data-pkg": pkg.id })
        ),
        el("span", { class: "qrmo-pricing-tab-state" })
      );
      t.addEventListener("click", function () { selectTab(pkg.id, false); });
      t.addEventListener("keydown", function (e) {
        var i = rank(pkg.id), n = P.length, to = -1;
        if (e.key === "ArrowRight") to = (i + 1) % n;
        else if (e.key === "ArrowLeft") to = (i - 1 + n) % n;
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = n - 1;
        if (to < 0) return;
        e.preventDefault();
        selectTab(P[to].id, true);
      });
      tabEls[pkg.id] = t;
      tablist.appendChild(t);
    });
    wrap.appendChild(el("div", { class: "qrmo-pricing-switcher" }, tablist));

    introEl = el("p", { class: "qrmo-pricing-switch-intro" });
    panelEl = el("div", { class: "qrmo-pricing-panel", role: "tabpanel", id: "qrmo-pricing-panel", tabindex: "0" });
    panelEl.appendChild(introEl);

    D.categories.forEach(function (cat) {
      var bid = "qrmo-pricing-acc-btn-" + cat.id, pid = "qrmo-pricing-acc-panel-" + cat.id;
      var btn = el("button", {
        class: "qrmo-pricing-acc-btn",
        type: "button",
        id: bid,
        "aria-controls": pid,
        "aria-expanded": "false"
      },
        el("span", { class: "qrmo-pricing-acc-title", text: cat.name }),
        el("span", { class: "qrmo-pricing-acc-count" }),
        icon("chev"));
      var body = el("div", { class: "qrmo-pricing-acc-panel", id: pid, role: "region", "aria-labelledby": bid, hidden: true });
      var list = el("ul", { class: "qrmo-pricing-acc-list" });
      body.appendChild(list);
      btn.addEventListener("click", function () {
        openCats[cat.id] = !openCats[cat.id];
        syncAcc(cat.id);
      });
      accBtns[cat.id] = btn;
      accLists[cat.id] = list;
      panelEl.appendChild(el("div", { class: "qrmo-pricing-acc" }, el("h3", { class: "qrmo-pricing-acc-h" }, btn), body));
    });

    ctaSlot = el("div", { class: "qrmo-pricing-switch-cta" });
    panelEl.appendChild(ctaSlot);
    wrap.appendChild(panelEl);
    updateSwitcher();
  }

  function syncAcc(cid) {
    var open = !!openCats[cid];
    accBtns[cid].setAttribute("aria-expanded", open ? "true" : "false");
    accBtns[cid].parentNode.parentNode.classList.toggle("is-open", open);
    document.getElementById(accBtns[cid].getAttribute("aria-controls")).hidden = !open;
  }

  function selectTab(id, focus) {
    activePkg = id;
    updateSwitcher();
    if (focus) tabEls[id].focus();
  }

  function updateSwitcher() {
    if (openTip) closeTip(openTip);
    var pkg = pkgById(activePkg), i = rank(pkg.id);
    P.forEach(function (p) {
      var on = p.id === activePkg;
      tabEls[p.id].setAttribute("aria-selected", on ? "true" : "false");
      tabEls[p.id].tabIndex = on ? 0 : -1;
      var state = tabEls[p.id].querySelector(".qrmo-pricing-tab-state");
      if (state) state.textContent = on ? "Seçili" : "";
    });
    panelEl.setAttribute("aria-labelledby", "qrmo-pricing-tab-" + pkg.id);

    var added = D.features.filter(function (f) {
      return status(f, pkg).on && (i === 0 || !status(f, P[i - 1]).on);
    }).length;
    introEl.textContent = i === 0
      ? pkg.name + " paketinde " + added + " özellik var."
      : pkg.name + ", " + P[i - 1].name + " paketine " + added + " özellik ekler.";

    D.categories.forEach(function (cat) {
      var feats = D.features.filter(function (f) { return f.category === cat.id; });
      var list = accLists[cat.id], on = 0;
      list.textContent = "";
      feats.forEach(function (f) {
        var s = status(f, pkg);
        if (s.on) on++;
        var li = el("li", { class: s.on ? "is-on" : "is-off" },
          s.on
            ? el("span", { class: "qrmo-pricing-check" }, icon("check"))
            : el("span", { class: "qrmo-pricing-cell-off" }, icon("dash")),
          el("span", { class: "qrmo-pricing-acc-name" },
            featLabel(f),
            s.text ? el("small", { text: s.text }) : null,
            !s.on ? el("small", { text: "Bu pakette yok. " + pkgById(f.from).name + " ile başlar." }) : null,
            el("span", { class: "qrmo-pricing-sr", text: s.on ? " — dahil" : " — bu pakette yok" })
          ));
        list.appendChild(li);
      });
      accBtns[cat.id].querySelector(".qrmo-pricing-acc-count").textContent = on + " / " + feats.length;
      syncAcc(cat.id);
    });

    ctaSlot.textContent = "";
    ctaSlot.appendChild(cta(pkg, pkg.ctaLabel, pkg.variant === "featured" ? "primary" : pkg.variant === "dark" ? "on-dark" : "outline"));
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
