/* =========================================================
   QR MENU OFFICIAL — /paketler/ RENDER
   İçerik packages-data.js'ten gelir; burada içerik YOK.
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
  var activePkg = P.length > 1 ? P[1].id : P[0].id; // mobil seçici: varsayılan orta paket
  var openCats = {};
  D.categories.forEach(function (c, i) { openCats[c.id] = i === 0; });

  var freeMonths = D.annual.usedMonths - D.annual.payMonths;

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
      chev:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
    };
    s.innerHTML = map[kind];
    s.className = "qrmo-pricing-ico qrmo-pricing-ico-" + kind;
    return s;
  }

  /* Özellik adı: modül sayfası tanımlıysa link, değilse düz metin. */
  function featName(f) {
    if (!f.page || !D.modulePagesBase) return el("span", { text: f.name });
    return el("a", { class: "qrmo-pricing-modlink", href: D.modulePagesBase + f.page + "/", text: f.name });
  }

  function pkgById(id) { return P.filter(function (p) { return p.id === id; })[0]; }
  function rank(id) { return P.indexOf(pkgById(id)); }

  /* Özellik → paket durumu: { on: bool, text: string|null } */
  function status(f, pkg) {
    var v = f.values && f.values[pkg.id];
    if (typeof v === "string") return { on: true, text: v };
    if (v === false) return { on: false, text: null };
    if (v === true) return { on: true, text: null };
    return { on: rank(pkg.id) >= rank(f.from), text: null };
  }

  function price(pkg) {
    var annual = period === "annual";
    var amount = annual ? pkg.price.annual : pkg.price.monthly;
    return {
      amount: fmt.format(amount),
      unit: D.currency + (annual ? " / yıl" : " / ay"),
      short: fmt.format(amount) + " " + D.currency,
      note: annual
        ? fmt.format(pkg.price.monthly) + " " + D.currency + " × " + D.annual.payMonths + " ay · " + freeMonths + " ay ücretsiz"
        : "Aylık ödeme"
    };
  }

  /* CTA: href tanımlıysa <a>, değilse pasif <button> (sahte href yok). */
  function cta(pkg, label, variant, final) {
    var tpl = (final && D.cta.finalHref) || D.cta.href;
    var cls = "qrmo-pricing-btn qrmo-pricing-btn--" + variant;
    var kids = [el("span", { text: label }), icon("arrow")];
    if (tpl) {
      var href = tpl.replace("{id}", pkg ? pkg.id : "");
      var a = el("a", { class: cls, href: href });
      kids.forEach(function (k) { a.appendChild(k); });
      return a;
    }
    var b = el("button", { class: cls, type: "button", "data-cta-pending": "", "data-cta-target": "TBD" });
    b.addEventListener("click", function () { showPending(b); });
    kids.forEach(function (k) { b.appendChild(k); });
    return b;
  }

  /* Hedef TBD iken tıklama: kullanıcıya dürüst bir bilgi gösterir. */
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

      var list = el("ul", { class: "qrmo-pricing-card-list" });
      pkg.highlights.forEach(function (fid) {
        var f = D.features.filter(function (x) { return x.id === fid; })[0];
        if (!f) return;
        list.appendChild(el("li", null, el("span", { class: "qrmo-pricing-check" }, icon("check")), featName(f)));
      });

      var card = el("article", { class: "qrmo-pricing-card qrmo-pricing-card--" + variant, id: "paket-" + pkg.id, "aria-labelledby": "paket-" + pkg.id + "-name" },
        el("header", { class: "qrmo-pricing-card-head" },
          el("h3", { class: "qrmo-pricing-card-name", id: "paket-" + pkg.id + "-name", text: pkg.name }),
          el("p", { class: "qrmo-pricing-card-tagline", text: pkg.tagline }),
          D.showSubdomain && pkg.subdomain ? el("p", { class: "qrmo-pricing-card-sub", text: pkg.subdomain }) : null
        ),
        el("p", { class: "qrmo-pricing-card-summary", text: pkg.summary }),
        el("div", { class: "qrmo-pricing-price" },
          el("p", { class: "qrmo-pricing-price-row" },
            el("span", { class: "qrmo-pricing-amount", "data-qp": "amount", "data-pkg": pkg.id }),
            el("span", { class: "qrmo-pricing-unit", "data-qp": "unit", "data-pkg": pkg.id })
          ),
          el("p", { class: "qrmo-pricing-price-sub", "data-qp": "note", "data-pkg": pkg.id })
        ),
        cta(pkg, pkg.ctaLabel, btnVariant),
        el("div", { class: "qrmo-pricing-audience" },
          el("p", { class: "qrmo-pricing-label", text: "KİMLER İÇİN" }),
          el("p", { text: pkg.audience })
        ),
        el("p", { class: "qrmo-pricing-label qrmo-pricing-card-lead", text: pkg.highlightsLead.toLocaleUpperCase("tr") }),
        list
      );
      wrap.appendChild(card);
    });
  }

  /* ---------- 2. TABLO (≥768px) ---------- */

  function statusCell(f, pkg) {
    var s = status(f, pkg);
    var td = el("td", { class: "qrmo-pricing-cell" + (pkg.variant === "featured" ? " is-featured" : "") });
    if (s.text) {
      td.appendChild(el("span", { class: "qrmo-pricing-cell-text", text: s.text }));
    } else if (s.on) {
      td.appendChild(el("span", { class: "qrmo-pricing-check" }, icon("check")));
      td.appendChild(el("span", { class: "qrmo-pricing-sr", text: "Dahil" }));
    } else {
      td.appendChild(el("span", { class: "qrmo-pricing-cell-off" }, icon("dash")));
      td.appendChild(el("span", { class: "qrmo-pricing-sr", text: "Dahil değil" }));
    }
    return td;
  }

  function renderTable() {
    var wrap = mount("table");
    var table = el("table", { class: "qrmo-pricing-table" });
    table.appendChild(el("caption", { class: "qrmo-pricing-sr", text: "Paketlere göre özellik karşılaştırması" }));

    var colgroup = el("colgroup", null, el("col", { class: "qrmo-pricing-col-label" }));
    P.forEach(function () { colgroup.appendChild(el("col")); });
    table.appendChild(colgroup);

    var hr = el("tr", null, el("th", { scope: "col", class: "qrmo-pricing-th-label" }, el("span", { class: "qrmo-pricing-sr", text: "Özellik" })));
    P.forEach(function (pkg) {
      hr.appendChild(el("th", { scope: "col", class: "qrmo-pricing-th" + (pkg.variant === "featured" ? " is-featured" : "") },
        el("span", { class: "qrmo-pricing-th-name", text: pkg.name }),
        el("span", { class: "qrmo-pricing-th-price" },
          el("span", { "data-qp": "short", "data-pkg": pkg.id }),
          el("span", { class: "qrmo-pricing-th-unit", "data-qp": "unit-only", "data-pkg": pkg.id })
        )
      ));
    });
    table.appendChild(el("thead", null, hr));

    D.categories.forEach(function (cat) {
      var tb = el("tbody");
      tb.appendChild(el("tr", { class: "qrmo-pricing-cat-row" },
        el("th", { scope: "colgroup", colspan: String(P.length + 1), text: cat.name.toLocaleUpperCase("tr") })));
      D.features.filter(function (f) { return f.category === cat.id; }).forEach(function (f) {
        var tr = el("tr", null, el("th", { scope: "row", class: "qrmo-pricing-feature" },
          featName(f),
          f.note ? el("small", { text: f.note }) : null));
        P.forEach(function (pkg) { tr.appendChild(statusCell(f, pkg)); });
        tb.appendChild(tr);
      });
      table.appendChild(tb);
    });

    var fr = el("tr", null, el("td", { class: "qrmo-pricing-foot-label" }));
    P.forEach(function (pkg) {
      fr.appendChild(el("td", { class: "qrmo-pricing-foot-cell" },
        cta(pkg, pkg.name + " paketi seç", pkg.variant === "featured" ? "primary" : "outline")));
    });
    table.appendChild(el("tfoot", null, fr));
    wrap.appendChild(table);
  }

  /* ---------- 3. MOBİL SEÇİCİ (<768px) ---------- */

  var tabEls = {}, panelEl, introEl, ctaSlot, accLists = {}, accBtns = {};

  function renderSwitcher() {
    var wrap = mount("switcher");

    var tablist = el("div", { class: "qrmo-pricing-tabs", role: "tablist", "aria-label": "Karşılaştırılacak paket" });
    P.forEach(function (pkg) {
      var t = el("button", { class: "qrmo-pricing-tab", type: "button", role: "tab", id: "qrmo-pricing-tab-" + pkg.id, "aria-controls": "qrmo-pricing-panel" },
        el("span", { class: "qrmo-pricing-tab-name", text: pkg.name }),
        el("span", { class: "qrmo-pricing-tab-price", "data-qp": "short", "data-pkg": pkg.id })
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
      var btn = el("button", { class: "qrmo-pricing-acc-btn", type: "button", id: bid, "aria-controls": pid, "aria-expanded": "false" },
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
      accBtns[cat.id] = btn; accLists[cat.id] = list;
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
    var pkg = pkgById(activePkg), i = rank(pkg.id);
    P.forEach(function (p) {
      var on = p.id === activePkg;
      tabEls[p.id].setAttribute("aria-selected", on ? "true" : "false");
      tabEls[p.id].tabIndex = on ? 0 : -1;
    });
    panelEl.setAttribute("aria-labelledby", "qrmo-pricing-tab-" + pkg.id);

    var added = D.features.filter(function (f) { return status(f, pkg).on && (i === 0 || !status(f, P[i - 1]).on); }).length;
    introEl.textContent = i === 0
      ? pkg.name + ": " + added + " özellik. " + pkg.tagline + "."
      : P[i - 1].name + "'in tümü + " + added + " yeni özellik. " + pkg.tagline + ".";

    D.categories.forEach(function (cat) {
      var feats = D.features.filter(function (f) { return f.category === cat.id; });
      var list = accLists[cat.id], on = 0;
      list.textContent = "";
      feats.forEach(function (f) {
        var s = status(f, pkg);
        if (s.on) on++;
        var li = el("li", { class: s.on ? "is-on" : "is-off" },
          s.on ? el("span", { class: "qrmo-pricing-check" }, icon("check")) : el("span", { class: "qrmo-pricing-cell-off" }, icon("dash")),
          el("span", { class: "qrmo-pricing-acc-name" },
            featName(f),
            s.text ? el("small", { text: s.text }) : null,
            !s.on ? el("small", { text: pkgById(f.from).name + " paketinde" }) : null,
            el("span", { class: "qrmo-pricing-sr", text: s.on ? " — dahil" : " — dahil değil" })
          ));
        list.appendChild(li);
      });
      accBtns[cat.id].querySelector(".qrmo-pricing-acc-count").textContent = on + " / " + feats.length;
      syncAcc(cat.id);
    });

    ctaSlot.textContent = "";
    ctaSlot.appendChild(cta(pkg, pkg.ctaLabel, pkg.variant === "featured" ? "primary" : "outline"));
  }

  /* ---------- 4. HANGİ PAKET ---------- */

  function renderWhich() {
    var list = mount("which");
    P.forEach(function (pkg) {
      list.appendChild(el("li", { class: "qrmo-pricing-which-item" },
        el("div", { class: "qrmo-pricing-which-pkg" },
          el("p", { class: "qrmo-pricing-label", text: pkg.name.toLocaleUpperCase("tr") }),
          el("p", { class: "qrmo-pricing-which-tag", text: pkg.audience })),
        el("h3", { class: "qrmo-pricing-which-title", text: pkg.scenario.title }),
        el("div", { class: "qrmo-pricing-which-body" },
          el("p", { text: pkg.scenario.text }),
          el("a", { class: "qrmo-pricing-textlink", href: "#paket-" + pkg.id }, pkg.name + " paketini incele ", el("span", { "aria-hidden": "true", text: "→" })))
      ));
    });
  }

  /* ---------- 5. SON CTA ---------- */

  function renderFinal() {
    mount("final-cta").appendChild(cta(null, D.cta.finalLabel, "on-dark", true));
  }

  /* ---------- FİYAT / DÖNEM ---------- */

  function updatePrices(animate) {
    var byPkg = {};
    P.forEach(function (p) { byPkg[p.id] = price(p); });

    root.querySelectorAll("[data-qp]").forEach(function (n) {
      var pr = byPkg[n.getAttribute("data-pkg")];
      var kind = n.getAttribute("data-qp");
      var next = kind === "amount" ? pr.amount
        : kind === "unit" ? pr.unit
        : kind === "note" ? pr.note
        : kind === "short" ? pr.short
        : pr.unit.replace(D.currency + " ", "");
      if (n.textContent !== next) n.textContent = next;
      if (animate && (kind === "amount" || kind === "short")) {
        n.classList.remove("is-swap");
        void n.offsetWidth;
        n.classList.add("is-swap");
      }
    });

    root.querySelectorAll("[data-qp-free]").forEach(function (n) {
      n.textContent = freeMonths + " ay ücretsiz";
    });

    var note = document.getElementById("qrmo-pricing-period-note");
    note.textContent = period === "annual"
      ? "Yıllık fiyatlar gösteriliyor: " + D.annual.usedMonths + " ay kullanın, " + D.annual.payMonths + " ay ödeyin."
      : "Aylık fiyatlar gösteriliyor. Yıllık ödemede " + freeMonths + " ay ücretsiz.";
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

  renderCards();
  renderTable();
  renderSwitcher();
  renderWhich();
  renderFinal();
  bindToggle();
  updatePrices(false);

  if (D.priceNote) {
    var pn = mount("price-note");
    pn.textContent = D.priceNote;
    pn.hidden = false;
  }
})();
