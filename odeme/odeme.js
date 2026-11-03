/* /odeme/ — paket + dönem seçimi, doğrulama, test/live ödeme geçişi.
   Veri: window.QRMO_PRICING (../paketler/packages-data.js) · Ayar: window.QRMO_CHECKOUT (odeme-config.js).
   Test modunda ağ isteği yapılmaz, hiçbir şey saklanmaz. */
(function () {
  "use strict";
  var P = window.QRMO_PRICING, C = window.QRMO_CHECKOUT || { mode: "test" };
  if (!P || !P.packages) return;

  var $ = function (id) { return document.getElementById(id); };
  var form = $("qrmo-pay-form"), elPlans = $("qrmo-pay-plans"), elPeriod = $("qrmo-pay-period"),
      elSum = $("qrmo-pay-sum"), elNote = $("qrmo-pay-note"), btn = $("qrmo-pay-submit"),
      elDone = $("qrmo-pay-done"), live = C.mode === "live";
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
        var b = el("span", "qrmo-pay-badge ts-capb", "2 ay bedava");
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
    try {
      var u = new URL(location.href);
      u.searchParams.set("paket", state.plan); u.searchParams.set("donem", state.period);
      history.replaceState(null, "", u);
    } catch (e) {}
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

  function finishTest(c) {
    var pk = pkg(state.plan), ref = "TEST-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    $("qrmo-pay-done-text").textContent = c.name + ", " + pk.name + " paketi (" + periodLabel(state.period).toLowerCase() + ") için test siparişiniz oluşturuldu.";
    var dl = $("qrmo-pay-done-list"); dl.textContent = "";
    [["Referans", ref], ["Paket", pk.name], ["Dönem", periodLabel(state.period)], ["Tutar", money(pk.price[state.period])], ["İşletme", c.business], ["E-posta", c.email]]
      .forEach(function (r) { dl.appendChild(row(r[0], r[1])); });
    form.closest(".qrmo-pay-grid").hidden = true;
    elDone.hidden = false; elDone.focus(); window.scrollTo(0, 0);
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
    var c = customer();
    if (!live) { finishTest(c); return; }
    btn.disabled = true;
    goLive(c).catch(function (err) {
      btn.disabled = false;
      showNote(err.message === "noprovider" ? "Bu paket ve dönem için ödeme bağlantısı tanımlanmamış." : "Ödeme başlatılamadı. Lütfen tekrar deneyin ya da bizimle iletişime geçin.");
    });
  });

  $("qrmo-pay-reset").addEventListener("click", function () {
    form.reset(); Array.prototype.forEach.call(form.querySelectorAll("[aria-invalid]"), function (i) { setErr(i, ""); });
    elDone.hidden = true; form.closest(".qrmo-pay-grid").hidden = false; showNote(""); render(); window.scrollTo(0, 0);
  });

  if (live) {
    $("qrmo-pay-mode").hidden = true;
    $("qrmo-pay-provider").querySelector("p").textContent = "Ödeme adımında güvenli ödeme sayfasına yönlendirilirsiniz. Kart bilgileriniz bu sitede girilmez.";
  }
  if (P.priceNote) elNote.textContent = P.priceNote;
  else elNote.textContent = "Tutarlara vergi dahil olup olmadığı ve fatura koşulları bu sayfada yayımlanmamıştır.";

  buildPeriod(); render();
})();
