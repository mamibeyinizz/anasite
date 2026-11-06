/* /odeme/ — paket + dönem seçimi, doğrulama, test/live ödeme geçişi.
   Veri: window.QRMO_PRICING (../paketler/packages-data.js) · Ayar: window.QRMO_CHECKOUT (odeme-config.js).
   Satın alma için hesap gerekir (../hesap/hesap.js). Test modunda ücret çekilmez; giriş yapmış müşterinin
   test siparişi hesabına kaydedilir. */
(function () {
  "use strict";
  var P = window.QRMO_PRICING, C = window.QRMO_CHECKOUT || { mode: "test" };
  if (!P || !P.packages) return;

  var $ = function (id) { return document.getElementById(id); };
  var form = $("qrmo-pay-form"), elPlans = $("qrmo-pay-plans"), elPeriod = $("qrmo-pay-period"),
      elSum = $("qrmo-pay-sum"), elNote = $("qrmo-pay-note"), btn = $("qrmo-pay-submit"),
      elDone = $("qrmo-pay-done"), live = C.mode === "live";
  var ACC = window.QRMO_ACC, acct = null, acctState = "loading", acctRes = null;
  var PERIODS = [["monthly", "Aylık", "İstediğiniz zaman iptal"], ["annual", "Yıllık", "12 ay kullanım, 10 ay ödeme"]];
  var state = { plan: P.packages[1] ? P.packages[1].id : P.packages[0].id, period: P.defaultPeriod || "monthly" };

  /* URL: ?paket=pro&donem=yillik */
  try {
    var q = new URLSearchParams(location.search), p = q.get("paket"), d = (q.get("donem") || "").toLowerCase();
    if (p && P.packages.some(function (x) { return x.id === p; })) state.plan = p;
    if (d === "annual" || d === "yillik" || d === "yıllık") state.period = "annual";
    if (d === "monthly" || d === "aylik" || d === "aylık") state.period = "monthly";
  } catch (e) {}

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function money(n) { return n.toLocaleString("tr-TR") + " " + (P.currency || "TL"); }
  function pkg(id) { return P.packages.filter(function (x) { return x.id === id; })[0]; }
  function featName(id) { var f = P.features.filter(function (x) { return x.id === id; })[0]; return f ? f.name : id; }
  function periodLabel(k) { return PERIODS.filter(function (x) { return x[0] === k; })[0][1]; }
  function saving(pk) { return pk.price.monthly * P.annual.usedMonths - pk.price.annual; }

  function radio(group, value, checked, onChange) {
    var i = el("input"); i.type = "radio"; i.name = group; i.value = value; i.checked = checked;
    i.addEventListener("change", function () { if (i.checked) onChange(value); });
    return i;
  }

  function buildPeriod() {
    elPeriod.textContent = "";
    PERIODS.forEach(function (pr) {
      var lab = el("label", "qrmo-pay-opt-card");
      lab.appendChild(radio("period", pr[0], state.period === pr[0], function (v) { state.period = v; render(); }));
      var t = el("span", "qrmo-pay-opt-text");
      t.appendChild(el("span", "ts-bodyb", pr[1]));
      t.appendChild(el("span", "ts-cap", pr[2]));
      lab.appendChild(t);
      if (pr[0] === "annual") {
        var free = P.annual.usedMonths - P.annual.payMonths;
        var b = el("span", "qrmo-pay-badge ts-capb", free > 0 ? free + " ay bedava" : "Yıllık");
        lab.appendChild(b);
      }
      elPeriod.appendChild(lab);
    });
  }

  function buildPlans() {
    elPlans.textContent = "";
    P.packages.forEach(function (pk) {
      var lab = el("label", "qrmo-pay-opt-card qrmo-pay-plan");
      lab.appendChild(radio("plan", pk.id, state.plan === pk.id, function (v) { state.plan = v; render(); }));
      var t = el("span", "qrmo-pay-opt-text");
      var head = el("span", "qrmo-pay-plan-head");
      head.appendChild(el("span", "ts-h4", pk.name));
      if (pk.badge) head.appendChild(el("span", "qrmo-pay-badge ts-capb", pk.badge));
      t.appendChild(head);
      t.appendChild(el("span", "ts-cap", pk.tagline));
      t.appendChild(el("span", "ts-cap qrmo-pay-plan-sum", pk.summary));
      lab.appendChild(t);
      var pr = el("span", "qrmo-pay-plan-price");
      pr.appendChild(el("span", "ts-bodyb qrmo-pay-num", money(pk.price[state.period])));
      pr.appendChild(el("span", "ts-cap", state.period === "annual" ? "/ yıl" : "/ ay"));
      lab.appendChild(pr);
      elPlans.appendChild(lab);
    });
  }

  function row(k, v, strong) {
    var r = el("div", "qrmo-pay-sum-row");
    r.appendChild(el("dt", strong ? "ts-bodyb" : "ts-body", k));
    r.appendChild(el("dd", (strong ? "ts-bodyb" : "ts-body") + " qrmo-pay-num", v));
    return r;
  }

  function buildSummary() {
    var pk = pkg(state.plan), annual = state.period === "annual", total = pk.price[state.period];
    elSum.textContent = "";
    var top = el("div", "qrmo-pay-sum-top");
    top.appendChild(el("p", "ts-h4", pk.name + " · " + periodLabel(state.period)));
    top.appendChild(el("p", "ts-cap", pk.summary));
    elSum.appendChild(top);

    var dl = el("dl", "qrmo-pay-sum-list");
    if (annual) {
      dl.appendChild(row("Aylık fiyat × 12", money(pk.price.monthly * P.annual.usedMonths)));
      dl.appendChild(row("Yıllık indirim", "− " + money(saving(pk))));
    }
    dl.appendChild(row(annual ? "Bugün ödenecek (12 ay)" : "Bugün ödenecek (1 ay)", money(total), true));
    elSum.appendChild(dl);
    elSum.appendChild(el("p", "ts-cap qrmo-pay-renew", annual
      ? "12 aylık kullanım için tek seferde tahsil edilen tutardır."
      : "Her ay aynı tutar tahsil edilir. Taahhüt yok, istediğiniz zaman iptal edebilirsiniz."));

    var inc = el("div", "qrmo-pay-inc");
    inc.appendChild(el("p", "ts-capb", pk.highlightsLead));
    var ul = el("ul", "qrmo-pay-inc-list ts-cap");
    pk.highlights.forEach(function (id) { ul.appendChild(el("li", "", featName(id))); });
    inc.appendChild(ul);
    elSum.appendChild(inc);
  }

  function render() {
    buildPlans(); buildSummary();
    btn.textContent = live ? "Ödemeye geç · " : "Test ödemesini tamamla · ";
    btn.textContent += money(pkg(state.plan).price[state.period]);
    $("qrmo-pay-bar-btn").textContent = live ? "Ödemeye geç" : "Devam et";
    try {
      var u = new URL(location.href);
      u.searchParams.set("paket", state.plan); u.searchParams.set("donem", state.period);
      history.replaceState(null, "", u);
    } catch (e) {}
    if (acctState === "out") updateGate();
  }

  /* --- hesap kapısı --- */
  var elAcct = $("qrmo-pay-acct"), elAcctText = $("qrmo-pay-acct-text"), elAcctAct = $("qrmo-pay-acct-actions");
  function nextPath() { return "odeme/?paket=" + encodeURIComponent(state.plan) + "&donem=" + encodeURIComponent(state.period); }
  function gateBtn(href, label, primary) {
    var a = el("a", "qrmo-pay-acct-btn ts-btn" + (primary ? " qrmo-pay-acct-btn--primary" : ""), label);
    a.setAttribute("href", href); return a;
  }
  function updateGate() {
    elAcct.setAttribute("data-state", acctState === "in" ? "in" : acctState === "loading" ? "loading" : acctState === "out" ? "out" : "err");
    elAcctAct.textContent = "";
    if (acctState === "loading") { elAcctText.textContent = "Hesabınız kontrol ediliyor…"; return; }
    if (acctState === "in") {
      elAcctText.textContent = acct.customer.email + " hesabıyla devam ediyorsunuz.";
      elAcctAct.appendChild(gateBtn("../hesabim/", "Hesabım", false)); return;
    }
    if (acctState === "out") {
      elAcctText.textContent = "Aboneliği tamamlamak için hesabınıza giriş yapın ya da üye olun. Seçtiğiniz paket ve dönem korunur.";
      elAcctAct.appendChild(gateBtn("../giris/?next=" + encodeURIComponent(nextPath()), "Giriş yap", true));
      elAcctAct.appendChild(gateBtn("../giris/?sekme=uye&next=" + encodeURIComponent(nextPath()), "Üye ol", false)); return;
    }
    elAcctText.textContent = ACC ? ACC.message(acctRes || { status: 0, data: {} }) : "Hesap hizmetine şu an ulaşılamıyor.";
  }
  function prefill() {
    if (!acct) return;
    var c = acct.customer, f = form.elements;
    [["name", c.name], ["business", c.business], ["email", c.email], ["phone", c.phone], ["domain", c.domain]].forEach(function (p) {
      if (f[p[0]] && !f[p[0]].value && p[1]) f[p[0]].value = p[1];
    });
  }
  function loadAccount() {
    if (!ACC) { acctState = "err"; updateGate(); return; }
    ACC.me().then(function (res) {
      acctRes = res;
      if (res.status === 200 && res.data.authenticated) { acct = res.data; acctState = "in"; ACC.flag(true); prefill(); }
      else if (res.status === 200) { acctState = "out"; ACC.flag(false); }
      else acctState = "err";
      updateGate();
    });
  }

  /* --- doğrulama --- */
  var RULES = {
    name: function (v) { return v.trim().length < 3 || v.indexOf(" ") < 0 ? "Ad ve soyadınızı yazın." : ""; },
    business: function (v) { return v.trim().length < 2 ? "İşletme adını yazın." : ""; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Geçerli bir e-posta adresi yazın."; },
    phone: function (v) { return !v.trim() || v.replace(/\D/g, "").length >= 10 ? "" : "Telefonu alan koduyla yazın."; },
    domain: function (v) { return !v.trim() || /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(v.trim()) ? "" : "Alan adını ornek.com biçiminde yazın."; }
  };
  function setErr(input, msg) {
    var e = $(input.id + "-e"); if (e) e.textContent = msg;
    if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  }
  function check(input) {
    var msg = input.type === "checkbox" ? (input.checked ? "" : "Devam etmek için onaylayın.") : RULES[input.name](input.value);
    setErr(input, msg); return !msg;
  }
  function validate() {
    var first = null;
    Array.prototype.forEach.call(form.elements, function (i) {
      if ((RULES[i.name] || i.type === "checkbox") && !check(i) && !first) first = i;
    });
    if (first) first.focus();
    return !first;
  }
  form.addEventListener("focusout", function (e) { var i = e.target; if (i.getAttribute && i.getAttribute("aria-invalid") && (RULES[i.name] || i.type === "checkbox")) check(i); });
  form.addEventListener("input", function (e) { var i = e.target; if (i.getAttribute && i.getAttribute("aria-invalid")) check(i); });

  /* --- gönderim --- */
  function customer() {
    var f = form.elements;
    return { name: f.name.value.trim(), business: f.business.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), domain: f.domain.value.trim() };
  }
  function showNote(msg) { elNote.textContent = msg || ""; }

  function finishTest(c, ref) {
    var pk = pkg(state.plan);
    $("qrmo-pay-done-text").textContent = c.name + ", " + pk.name + " paketi (" + periodLabel(state.period).toLowerCase() + ") için test siparişiniz oluşturuldu ve hesabınıza eklendi.";
    var dl = $("qrmo-pay-done-list"); dl.textContent = "";
    [["Referans", ref], ["Paket", pk.name], ["Dönem", periodLabel(state.period)], ["Tutar", money(pk.price[state.period])], ["İşletme", c.business], ["E-posta", c.email]]
      .forEach(function (r) { dl.appendChild(row(r[0], r[1])); });
    form.closest(".qrmo-pay-grid").hidden = true;
    elDone.hidden = false; bar.classList.add("is-off"); elDone.focus(); window.scrollTo(0, 0);
  }

  /* Test modu: bilgileri profile işler, siparişi hesaba kaydeder. */
  function saveTestOrder(c) {
    btn.disabled = true;
    var keep = ACC.profile({ name: c.name, business: c.business, phone: c.phone, domain: c.domain });
    return keep.then(function () { return ACC.order({ plan: state.plan, period: state.period }); }).then(function (res) {
      btn.disabled = false;
      if (res.status === 201 && res.data.ref) { finishTest(c, res.data.ref); return; }
      if (res.status === 401) { acctState = "out"; updateGate(); showNote("Oturumunuz sona ermiş. Lütfen yeniden giriş yapın."); return; }
      showNote(res.status === 403 && res.data.error === "orders_closed" ? "Test siparişleri şu an kapalı." : ACC.message(res));
    });
  }

  function goLive(c) {
    var body = { plan: state.plan, period: state.period, customer: c };
    if (C.endpoint) {
      return fetch(C.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then(function (r) { if (!r.ok) throw new Error("http"); return r.json(); })
        .then(function (j) { if (!j || !j.url) throw new Error("url"); location.href = j.url; });
    }
    var link = C.links && C.links[state.plan] && C.links[state.plan][state.period];
    if (link) { location.href = link; return Promise.resolve(); }
    return Promise.reject(new Error("noprovider"));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault(); showNote("");
    if (!validate()) { showNote("Lütfen işaretli alanları düzeltin."); return; }
    if (acctState !== "in") {
      if (acctState === "out") { location.href = "../giris/?next=" + encodeURIComponent(nextPath()); return; }
      showNote(acctState === "loading" ? "Hesabınız kontrol ediliyor, birkaç saniye sonra tekrar deneyin." : "Hesap hizmetine ulaşılamadığı için sipariş verilemiyor.");
      elAcct.scrollIntoView({ block: "center" }); return;
    }
    var c = customer();
    if (!live) { saveTestOrder(c); return; }
    btn.disabled = true;
    goLive(c).catch(function (err) {
      btn.disabled = false;
      showNote(err.message === "noprovider" ? "Bu paket ve dönem için ödeme bağlantısı tanımlanmamış." : "Ödeme başlatılamadı. Lütfen tekrar deneyin ya da bizimle iletişime geçin.");
    });
  });

  $("qrmo-pay-reset").addEventListener("click", function () {
    form.reset(); Array.prototype.forEach.call(form.querySelectorAll("[aria-invalid]"), function (i) { setErr(i, ""); });
    elDone.hidden = true; form.closest(".qrmo-pay-grid").hidden = false; showNote(""); prefill(); render(); window.scrollTo(0, 0);
  });

  /* Mobil: özet ekranın altında kaldığı için toplam + düğme sabit çubukta; özet görününce gizlenir. */
  var bar = $("qrmo-pay-bar"), barTotal = $("qrmo-pay-bar-total");
  function syncBar() {
    var pk = pkg(state.plan);
    barTotal.textContent = money(pk.price[state.period]);
    $("qrmo-pay-bar-label").textContent = pk.name + " · " + periodLabel(state.period);
  }
  var baseRender = render; render = function () { baseRender(); syncBar(); };
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (en) { bar.classList.toggle("is-off", en[0].isIntersecting || !elDone.hidden); }, { threshold: 0.15 })
      .observe(document.querySelector(".qrmo-pay-summary"));
  }

  if (live) {
    $("qrmo-pay-mode").hidden = true;
    $("qrmo-pay-provider").querySelector("p").textContent = "Ödeme adımında güvenli ödeme sayfasına yönlendirilirsiniz. Kart bilgileriniz bu sitede girilmez.";
  }
  if (P.priceNote) elNote.textContent = P.priceNote;
  else elNote.textContent = "Tutarlara vergi dahil olup olmadığı ve fatura koşulları bu sayfada yayımlanmamıştır.";

  buildPeriod(); render(); loadAccount();
})();
