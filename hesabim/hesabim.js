/* /hesabim/ — hesap özeti, siparişler, profil, güvenlik.
   API: ../hesap/hesap.js (window.QRMO_ACC) · Fiyat/paket verisi: ../paketler/packages-data.js (window.QRMO_PRICING). */
(function () {
  "use strict";
  var A = window.QRMO_ACC, P = window.QRMO_PRICING || { packages: [], features: [], currency: "TL" };
  if (!A) return;
  var $ = function (id) { return document.getElementById(id); };
  var data = null;
  var PERIOD = { monthly: "Aylık", annual: "Yıllık" };

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
  function money(n) { return n.toLocaleString("tr-TR") + " " + (P.currency || "TL"); }
  function pkg(id) { return P.packages.filter(function (x) { return x.id === id; })[0]; }
  function featName(id) { var f = (P.features || []).filter(function (x) { return x.id === id; })[0]; return f ? f.name : id; }
  function date(iso) {
    var d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  }
  function say(node, msg, kind) { node.textContent = msg || ""; if (kind) node.setAttribute("data-kind", kind); else node.removeAttribute("data-kind"); }
  function setErr(input, msg) {
    var e = $(input.id + "-e"); if (e) e.textContent = msg || "";
    if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  }
  function clearErrs(form) { Array.prototype.forEach.call(form.elements, function (i) { if (i.id) setErr(i, ""); }); }
  function serverErrs(form, res) {
    var f = res.data && res.data.fields, first = null;
    if (!f) return false;
    Object.keys(f).forEach(function (n) { var i = form.elements[n]; if (i) { setErr(i, f[n]); if (!first) first = i; } });
    if (first) first.focus();
    return !!first;
  }

  /* ---------- yükleme ---------- */
  function fail(res) {
    $("ac-load").hidden = false; $("ac-app").hidden = true;
    $("ac-load-text").textContent = "Hesabınıza ulaşılamadı.";
    var s = $("ac-load-sub"); s.hidden = false; s.textContent = A.message(res);
    $("ac-retry").hidden = false;
  }
  function load() {
    $("ac-retry").hidden = true; $("ac-load-sub").hidden = true; $("ac-load-text").textContent = "Hesabınız yükleniyor…";
    A.me().then(function (res) {
      if (res.status === 200 && res.data.authenticated) { A.flag(true); data = res.data; $("ac-load").hidden = true; $("ac-app").hidden = false; render(); route(false); return; }
      if (res.status === 200) { A.flag(false); location.replace("../giris/?next=hesabim/"); return; }
      fail(res);
    });
  }
  $("ac-retry").addEventListener("click", load);

  /* ---------- bölümler ---------- */
  var IDS = ["genel", "siparisler", "profil", "guvenlik"];
  function route(focus) {
    var id = (location.hash || "").replace("#", ""); if (IDS.indexOf(id) < 0) id = "genel";
    IDS.forEach(function (k) { $(k).hidden = k !== id; });
    Array.prototype.forEach.call($("ac-nav").querySelectorAll("a"), function (a) {
      if (a.getAttribute("data-panel") === id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (focus) $(id).focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", function () { route(true); });

  /* ---------- çizim ---------- */
  function stat(cls, label, value, extra) {
    var d = el("div", "qrmo-ac-stat" + (cls ? " " + cls : ""));
    d.appendChild(el("dt", "ts-cap", label));
    d.appendChild(el("dd", "ts-h4", value));
    if (extra) d.appendChild(el("dd", "ts-cap", extra));
    return d;
  }
  function link(href, cls, text) { var a = el("a", cls, text); a.setAttribute("href", href); return a; }

  function render() {
    var c = data.customer, orders = data.orders || [], last = orders[0], lp = last ? pkg(last.plan) : null;
    var first = c.name.split(" ")[0];
    $("ac-hello").textContent = "Merhaba, " + first + ".";
    $("ac-meta").textContent = c.email + " · Üye olma: " + date(c.created_at);

    var st = clear($("ac-stats"));
    st.appendChild(stat("qrmo-ac-stat--plan", "Paketiniz", lp ? lp.name : "Seçilmedi", lp ? PERIOD[last.period] + " · test siparişi" : "Paket seçerek başlayın"));
    st.appendChild(stat("", "Siparişler", String(orders.length), orders.length ? "Son sipariş: " + date(last.created_at) : "Henüz sipariş yok"));
    st.appendChild(stat("", "Alan adı", c.domain || "Kaydedilmedi", c.domain ? "Lisans bu alan adına bağlanır" : "Profil bölümünden ekleyin"));

    /* sıradaki adım */
    var h = $("ac-next-h"), t = $("ac-next-text"), act = clear($("ac-next-actions"));
    if (!orders.length) {
      h.textContent = "Paketinizi seçin.";
      t.textContent = "Size uygun paketi seçip aboneliği birkaç adımda tamamlayın. Bilgileriniz ödeme sayfasında hazır gelir.";
      act.appendChild(link("../paketler/", "qrmo-ac-btn qrmo-ac-btn--primary ts-btn", "Paketleri incele"));
      act.appendChild(link("../canli-menu/", "qrmo-ac-btn qrmo-ac-btn--ghost ts-btn", "Canlı menüyü gör"));
    } else if (!c.domain) {
      h.textContent = "WordPress alan adınızı ekleyin.";
      t.textContent = "Lisansınız alan adınıza bağlanır. Alan adını şimdi kaydederseniz kurulum adımı hızlanır.";
      act.appendChild(link("#profil", "qrmo-ac-btn qrmo-ac-btn--primary ts-btn", "Alan adını ekle"));
      act.appendChild(link("../canli-menu/", "qrmo-ac-btn qrmo-ac-btn--ghost ts-btn", "Canlı menüyü gör"));
    } else {
      h.textContent = "Canlı menüyü deneyin.";
      t.textContent = "Menünüzün misafir tarafında nasıl göründüğünü demo üzerinde telefonunuzdan inceleyin.";
      act.appendChild(link("../canli-menu/", "qrmo-ac-btn qrmo-ac-btn--primary ts-btn", "Canlı menüyü gör"));
      act.appendChild(link("../iletisim/", "qrmo-ac-btn qrmo-ac-btn--ghost ts-btn", "Bize ulaşın"));
    }

    /* profil tamamlama */
    var items = [["Ad soyad", c.name], ["E-posta", c.email], ["İşletme adı", c.business], ["Telefon", c.phone], ["WordPress alan adı", c.domain]];
    var done = items.filter(function (i) { return i[1]; }).length;
    $("ac-complete-text").textContent = "Profil " + done + "/" + items.length + " tamam.";
    $("ac-meter").style.width = Math.round(done / items.length * 100) + "%";
    var cl = clear($("ac-checklist"));
    items.forEach(function (i) {
      var li = el("li"), dot = el("span", "qrmo-ac-dot" + (i[1] ? " is-done" : ""));
      dot.setAttribute("aria-hidden", "true");
      dot.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>';
      li.appendChild(dot);
      var name = el("span", "", i[0]); li.appendChild(name);
      if (i[1]) { li.appendChild(el("span", "ts-cap qrmo-ac-soft", "Tamam")); }
      else li.appendChild(link("#profil", "ts-link", "Ekle"));
      cl.appendChild(li);
    });

    renderOrders(orders, lp, last);
    fillProfile();
  }

  function renderOrders(orders, lp, last) {
    var ul = clear($("ac-orders")), empty = $("ac-orders-empty");
    $("ac-orders-sub").textContent = orders.length ? orders.length + " sipariş" : "";
    empty.hidden = orders.length > 0;
    orders.forEach(function (o) {
      var pk = pkg(o.plan), li = el("li", "qrmo-ac-order");
      var main = el("div", "qrmo-ac-order-main");
      main.appendChild(el("p", "ts-bodyb", (pk ? pk.name : o.plan) + " · " + (PERIOD[o.period] || o.period)));
      main.appendChild(el("p", "ts-cap", "Sipariş no: " + o.ref + " · " + date(o.created_at)));
      var badge = el("span", "qrmo-ac-badge qrmo-ac-badge--test ts-capb", o.status === "test" ? "Test siparişi" : o.status);
      var bw = el("p"); bw.appendChild(badge); main.appendChild(bw);
      li.appendChild(main);
      if (pk) {
        var pr = el("div", "qrmo-ac-order-price");
        pr.appendChild(el("p", "ts-bodyb qrmo-ac-num", money(pk.price[o.period])));
        pr.appendChild(el("p", "ts-cap", o.period === "annual" ? "/ yıl" : "/ ay"));
        li.appendChild(pr);
      }
      ul.appendChild(li);
    });
    $("ac-orders-note").textContent = orders.length && data.test_orders
      ? "Ödeme sistemi bağlanana kadar siparişler test kaydıdır; ücret çekilmez."
      : "";
    var card = $("ac-plan-card");
    card.hidden = !lp;
    if (lp) {
      $("ac-plan-h").textContent = lp.name + " paketi kapsamı";
      $("ac-plan-sum").textContent = lp.summary;
      $("ac-plan-lead").textContent = lp.highlightsLead || "";
      var list = clear($("ac-plan-list"));
      (lp.highlights || []).forEach(function (id) { list.appendChild(el("li", "", featName(id))); });
    }
  }

  /* ---------- profil ---------- */
  var pf = $("ac-profile");
  function fillProfile() {
    var c = data.customer;
    pf.elements.name.value = c.name; pf.elements.email.value = c.email;
    pf.elements.business.value = c.business; pf.elements.phone.value = c.phone; pf.elements.domain.value = c.domain;
  }
  pf.addEventListener("submit", function (e) {
    e.preventDefault(); clearErrs(pf); say($("ap-state"), "");
    var f = pf.elements;
    if (f.name.value.trim().length < 3 || f.name.value.trim().indexOf(" ") < 0) { setErr(f.name, "Ad ve soyadınızı yazın."); f.name.focus(); say($("ap-state"), "Lütfen işaretli alanları düzeltin.", "err"); return; }
    var btn = $("ap-submit"); btn.disabled = true;
    A.profile({ name: f.name.value, business: f.business.value, phone: f.phone.value, domain: f.domain.value }).then(function (res) {
      btn.disabled = false;
      if (res.status === 200 && res.data.authenticated) { data = res.data; render(); say($("ap-state"), "Değişiklikler kaydedildi.", "ok"); return; }
      if (res.status === 401) { A.flag(false); location.replace("../giris/?next=hesabim/"); return; }
      if (res.status === 422 && serverErrs(pf, res)) { say($("ap-state"), "Lütfen işaretli alanları düzeltin.", "err"); return; }
      say($("ap-state"), A.message(res), "err");
    });
  });

  /* ---------- parola ---------- */
  var kf = $("ac-pass");
  kf.addEventListener("submit", function (e) {
    e.preventDefault(); clearErrs(kf); say($("ak-state"), "");
    var f = kf.elements, bad = null;
    function need(input, msg) { setErr(input, msg); if (!bad) bad = input; }
    if (!f.current.value) need(f.current, "Mevcut parolanızı yazın.");
    if (f.password.value.length < 10) need(f.password, "Parola en az 10 karakter olmalı.");
    if (f.again.value !== f.password.value) need(f.again, "Parolalar eşleşmiyor.");
    if (bad) { bad.focus(); say($("ak-state"), "Lütfen işaretli alanları düzeltin.", "err"); return; }
    var btn = $("ak-submit"); btn.disabled = true;
    A.password({ current: f.current.value, password: f.password.value }).then(function (res) {
      btn.disabled = false;
      if (res.status === 200) { kf.reset(); say($("ak-state"), "Parolanız güncellendi. Diğer cihazlardaki oturumlar kapatıldı.", "ok"); return; }
      if (res.status === 401) { A.flag(false); location.replace("../giris/?next=hesabim/"); return; }
      if (res.status === 422 && serverErrs(kf, res)) { say($("ak-state"), "Lütfen işaretli alanları düzeltin.", "err"); return; }
      say($("ak-state"), A.message(res), "err");
    });
  });

  /* ---------- çıkış / silme ---------- */
  function logout() {
    A.logout().then(function () { A.flag(false); location.href = "../giris/"; });
  }
  $("ac-logout").addEventListener("click", logout);
  $("ac-logout2").addEventListener("click", logout);

  var df = $("ac-delete");
  df.addEventListener("submit", function (e) {
    e.preventDefault(); clearErrs(df); say($("ad-state"), "");
    if (!df.elements.password.value) { setErr(df.elements.password, "Parolanızı yazın."); df.elements.password.focus(); return; }
    var btn = $("ad-submit"); btn.disabled = true;
    A.remove({ password: df.elements.password.value }).then(function (res) {
      btn.disabled = false;
      if (res.status === 200) { A.flag(false); location.href = "../"; return; }
      if (res.status === 422 && serverErrs(df, res)) return;
      say($("ad-state"), A.message(res), "err");
    });
  });

  load();
})();
