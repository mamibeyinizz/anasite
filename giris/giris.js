/* /giris/ — giriş, üye ol, parola sıfırlama, e-posta doğrulama. API: ../hesap/hesap.js (window.QRMO_ACC). */
(function () {
  "use strict";
  var A = window.QRMO_ACC;
  if (!A) return;
  var $ = function (id) { return document.getElementById(id); };
  var panels = { login: $("ac-panel-login"), signup: $("ac-panel-signup"), forgot: $("ac-panel-forgot"), reset: $("ac-panel-reset") };
  var tabs = { login: $("ac-tab-login"), signup: $("ac-tab-signup") };
  var title = $("ac-title"), sub = $("ac-sub"), state = $("ac-state"), after = $("ac-after");
  var TEXT = {
    login: ["Hesabınıza giriş yapın.", "Paket satın almak ve siparişlerinizi görmek için giriş yapın.", "Giriş Yap"],
    signup: ["Hesap oluşturun.", "Satın alma için üyelik gerekir. Birkaç saniye sürer, kart bilgisi istenmez.", "Üye Ol"],
    forgot: ["Parolanızı sıfırlayın.", "E-posta adresinizi yazın; size bir sıfırlama bağlantısı gönderelim.", "Parolamı Unuttum"],
    reset: ["Yeni parolanızı belirleyin.", "Bu bağlantıyla yeni bir parola seçin. Diğer cihazlardaki oturumlarınız kapanır.", "Yeni Parola"],
    verify: ["E-posta doğrulama", "", "E-posta Doğrulama"]
  };
  var q = new URLSearchParams(location.search);
  var next = A.safeNext(q.get("next") || "");
  var goto_ = next ? "../" + next : "../hesabim/";
  var token = { reset: q.get("sifirla") || "", verify: q.get("dogrula") || "" };

  function say(msg, kind) { state.textContent = msg || ""; if (kind) state.setAttribute("data-kind", kind); else state.removeAttribute("data-kind"); }
  function btn(href, label, primary) {
    var a = document.createElement("a"); a.className = "qrmo-ac-btn ts-btn " + (primary ? "qrmo-ac-btn--primary" : "qrmo-ac-btn--ghost"); a.href = href; a.textContent = label; return a;
  }

  function show(mode, focus) {
    ["login", "signup", "forgot", "reset"].forEach(function (k) { panels[k].hidden = k !== mode; });
    var tabbed = mode === "login" || mode === "signup";
    $("ac-tabs").hidden = !tabbed;
    if (tabbed) ["login", "signup"].forEach(function (k) { tabs[k].setAttribute("aria-selected", k === mode ? "true" : "false"); tabs[k].tabIndex = k === mode ? 0 : -1; });
    title.textContent = TEXT[mode][0]; sub.textContent = TEXT[mode][1]; sub.hidden = !TEXT[mode][1];
    after.hidden = true; say("");
    document.title = TEXT[mode][2] + " | QR Menu Official";
    try {
      var u = new URL(location.href);
      if (mode === "signup") u.searchParams.set("sekme", "uye"); else u.searchParams.delete("sekme");
      history.replaceState(null, "", u);
    } catch (e) {}
    if (focus) { if (tabbed) tabs[mode].focus(); else { var f = panels[mode].querySelector("input"); if (f) f.focus(); } }
  }
  Object.keys(tabs).forEach(function (k) {
    tabs[k].addEventListener("click", function () { show(k, false); });
    tabs[k].addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); show(k === "login" ? "signup" : "login", true); }
      if (e.key === "Home") { e.preventDefault(); show("login", true); }
      if (e.key === "End") { e.preventDefault(); show("signup", true); }
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-mode]"), function (b) {
    b.addEventListener("click", function () {
      var m = b.getAttribute("data-mode");
      if (m === "forgot") panels.forgot.elements.email.value = panels.login.elements.email.value;
      show(m, true);
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-toggle-pw]"), function (b) {
    b.addEventListener("click", function () {
      var i = $(b.getAttribute("data-toggle-pw")), shown = i.type === "text";
      i.type = shown ? "password" : "text"; b.textContent = shown ? "Göster" : "Gizle";
    });
  });

  /* --- doğrulama (sunucu aynı kuralları uygular) --- */
  var RULES = {
    name: function (v) { return v.trim().length < 3 || v.trim().indexOf(" ") < 0 ? "Ad ve soyadınızı yazın." : ""; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Geçerli bir e-posta adresi yazın."; },
    password: function (v, form) { return form === panels.login ? (v ? "" : "Parolanızı yazın.") : (v.length < 10 ? "Parola en az 10 karakter olmalı." : ""); },
    again: function (v, form) { return v === form.elements.password.value ? "" : "Parolalar eşleşmiyor."; },
    terms: function (v, form, input) { return input.checked ? "" : "Devam etmek için onaylayın."; }
  };
  function setErr(input, msg) {
    var e = $(input.id + "-e"); if (e) e.textContent = msg || "";
    if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  }
  function check(input, form) { var r = RULES[input.name]; if (!r) return true; var m = r(input.value, form, input); setErr(input, m); return !m; }
  function validate(form) {
    var first = null;
    Array.prototype.forEach.call(form.elements, function (i) { if (RULES[i.name] && !check(i, form) && !first) first = i; });
    if (first) { first.focus(); say("Lütfen işaretli alanları düzeltin.", "err"); }
    return !first;
  }
  Object.keys(panels).forEach(function (k) {
    var form = panels[k];
    form.addEventListener("focusout", function (e) { var i = e.target; if (i.getAttribute && i.getAttribute("aria-invalid")) check(i, form); });
    form.addEventListener("input", function (e) { var i = e.target; if (i.getAttribute && i.getAttribute("aria-invalid")) check(i, form); });
  });
  function serverFields(form, res) {
    var f = res.data && res.data.fields, first = null;
    if (!f) return false;
    Object.keys(f).forEach(function (n) { var i = form.elements[n]; if (i) { setErr(i, f[n]); if (!first) first = i; } });
    if (first) first.focus();
    return !!first;
  }

  function submit(form, button, call, busy, idle, onOk) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); say("");
      if (!validate(form)) return;
      button.disabled = true; button.textContent = busy;
      call().then(function (res) {
        button.disabled = false; button.textContent = idle;
        if (res.status === 200 || res.status === 201) { onOk(res); return; }
        if (res.status === 409 && res.data.error === "email_taken" && form === panels.signup) {
          panels.login.elements.email.value = form.elements.email.value.trim();
          show("login", false); panels.login.elements.password.focus();
          say("Bu e-posta ile zaten bir hesap var. Parolanızla giriş yapın.", "err"); return;
        }
        if ((res.status === 422 || res.status === 409) && serverFields(form, res)) { say("Lütfen işaretli alanları düzeltin.", "err"); return; }
        say(A.message(res), "err");
      });
    });
  }
  function signedIn() { A.flag(true); say("Yönlendiriliyorsunuz…", "ok"); location.href = goto_; }
  var L = panels.login, S = panels.signup, F = panels.forgot, R = panels.reset;
  submit(L, $("al-submit"), function () { return A.login({ email: L.elements.email.value.trim(), password: L.elements.password.value }); }, "Giriş yapılıyor…", "Giriş yap", signedIn);
  submit(S, $("as-submit"), function () { return A.register({ name: S.elements.name.value, email: S.elements.email.value.trim(), password: S.elements.password.value, terms: S.elements.terms.checked }); }, "Hesap oluşturuluyor…", "Hesap oluştur", signedIn);
  submit(F, $("af-submit"), function () { return A.forgot({ email: F.elements.email.value.trim() }); }, "Gönderiliyor…", "Sıfırlama bağlantısı gönder", function () {
    say("Bu adres kayıtlıysa sıfırlama bağlantısı gönderildi. Gelen kutunuzu ve istenmeyen klasörünü kontrol edin; bağlantı 1 saat geçerlidir.", "ok");
  });
  submit(R, $("ar-submit"), function () { return A.reset({ token: token.reset, password: R.elements.password.value }); }, "Güncelleniyor…", "Parolayı güncelle", function () {
    A.flag(false); R.reset(); show("login", false);
    say("Parolanız güncellendi. Yeni parolanızla giriş yapabilirsiniz.", "ok");
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
  });

  /* --- açılış modu --- */
  function verifyMode() {
    ["login", "signup", "forgot", "reset"].forEach(function (k) { panels[k].hidden = true; });
    $("ac-tabs").hidden = true; title.textContent = TEXT.verify[0]; sub.hidden = true; document.title = TEXT.verify[2] + " | QR Menu Official";
    say("E-posta adresiniz doğrulanıyor…");
    A.verify({ token: token.verify }).then(function (res) {
      after.textContent = ""; after.hidden = false;
      if (res.status === 200) {
        say(res.data.kind === "email" ? "Yeni e-posta adresiniz onaylandı. Bundan sonra bu adresle giriş yapın." : "E-posta adresiniz doğrulandı.", "ok");
        after.appendChild(btn("../hesabim/", "Hesabıma git", true));
      } else {
        say(A.message(res), "err");
        after.appendChild(btn("../hesabim/", "Hesabıma git", true));
      }
    });
  }
  if (token.verify) { verifyMode(); return; }
  if (token.reset) { show("reset", false); return; }

  show(q.get("sekme") === "uye" ? "signup" : "login", false);
  if (q.get("silindi")) say("Hesabınız ve bilgileriniz silindi.", "ok");
  A.me().then(function (res) {
    if (res.status === 200 && res.data.authenticated) { A.flag(true); location.replace(goto_); }
    else if (res.status === 200) A.flag(false);
    else if (res.status === 0 || res.status === 404 || res.status >= 500) say(A.message(res), "err");
  });
})();
