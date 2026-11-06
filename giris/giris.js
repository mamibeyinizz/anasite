/* /giris/ — giriş ve üye ol. API: ../hesap/hesap.js (window.QRMO_ACC). */
(function () {
  "use strict";
  var A = window.QRMO_ACC;
  if (!A) return;
  var $ = function (id) { return document.getElementById(id); };
  var tabs = { login: $("ac-tab-login"), signup: $("ac-tab-signup") };
  var panels = { login: $("ac-panel-login"), signup: $("ac-panel-signup") };
  var title = $("ac-title"), sub = $("ac-sub"), state = $("ac-state");
  var TEXT = {
    login: ["Hesabınıza giriş yapın.", "Paket satın almak ve siparişlerinizi görmek için giriş yapın."],
    signup: ["Hesap oluşturun.", "Satın alma için üyelik gerekir. Birkaç saniye sürer, kart bilgisi istenmez."]
  };
  var q = new URLSearchParams(location.search);
  var next = A.safeNext(q.get("next") || "");

  function say(msg, kind) { state.textContent = msg || ""; if (kind) state.setAttribute("data-kind", kind); else state.removeAttribute("data-kind"); }

  function show(which, focus) {
    ["login", "signup"].forEach(function (k) {
      var on = k === which;
      tabs[k].setAttribute("aria-selected", on ? "true" : "false");
      tabs[k].tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
    });
    title.textContent = TEXT[which][0];
    sub.textContent = TEXT[which][1];
    say("");
    document.title = (which === "login" ? "Giriş Yap" : "Üye Ol") + " | QR Menu Official";
    try {
      var u = new URL(location.href);
      if (which === "signup") u.searchParams.set("sekme", "uye"); else u.searchParams.delete("sekme");
      history.replaceState(null, "", u);
    } catch (e) {}
    if (focus) tabs[which].focus();
  }
  Object.keys(tabs).forEach(function (k) {
    tabs[k].addEventListener("click", function () { show(k, false); });
    tabs[k].addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); show(k === "login" ? "signup" : "login", true); }
    });
  });

  /* Parola göster/gizle */
  Array.prototype.forEach.call(document.querySelectorAll("[data-toggle-pw]"), function (b) {
    b.addEventListener("click", function () {
      var i = $(b.getAttribute("data-toggle-pw")), shown = i.type === "text";
      i.type = shown ? "password" : "text";
      b.textContent = shown ? "Göster" : "Gizle";
      b.setAttribute("aria-pressed", shown ? "false" : "true");
    });
  });

  /* Doğrulama (sunucu aynı kuralları uygular) */
  var RULES = {
    name: function (v) { return v.trim().length < 3 || v.trim().indexOf(" ") < 0 ? "Ad ve soyadınızı yazın." : ""; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Geçerli bir e-posta adresi yazın."; },
    password: function (v, form) { return form === panels.login ? (v ? "" : "Parolanızı yazın.") : (v.length < 10 ? "Parola en az 10 karakter olmalı." : ""); },
    terms: function (v, form, input) { return input.checked ? "" : "Devam etmek için onaylayın."; }
  };
  function setErr(input, msg) {
    var e = $(input.id + "-e"); if (e) e.textContent = msg || "";
    if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  }
  function check(input, form) {
    var rule = RULES[input.name]; if (!rule) return true;
    var msg = rule(input.value, form, input); setErr(input, msg); return !msg;
  }
  function validate(form) {
    var first = null;
    Array.prototype.forEach.call(form.elements, function (i) { if (RULES[i.name] && !check(i, form) && !first) first = i; });
    if (first) first.focus();
    return !first;
  }
  [panels.login, panels.signup].forEach(function (form) {
    form.addEventListener("focusout", function (e) { var i = e.target; if (i.getAttribute && i.getAttribute("aria-invalid")) check(i, form); });
    form.addEventListener("input", function (e) { var i = e.target; if (i.getAttribute && i.getAttribute("aria-invalid")) check(i, form); });
  });

  function applyServerFields(form, res) {
    var f = res.data && res.data.fields, shown = false;
    if (!f) return false;
    Object.keys(f).forEach(function (name) {
      var input = form.elements[name]; if (!input) return;
      setErr(input, f[name]);
      if (!shown) { input.focus(); shown = true; }
    });
    return shown;
  }

  function done(res) {
    A.flag(true);
    say("Giriş yapıldı. Yönlendiriliyorsunuz…", "ok");
    location.href = next ? "../" + next : "../hesabim/";
  }

  function submit(form, btn, call, busy, idle) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); say("");
      if (!validate(form)) { say("Lütfen işaretli alanları düzeltin.", "err"); return; }
      btn.disabled = true; btn.textContent = busy;
      call().then(function (res) {
        if (res.status === 200 || res.status === 201) { done(res); return; }
        btn.disabled = false; btn.textContent = idle;
        if (res.status === 422 || res.status === 409) { if (applyServerFields(form, res)) { say("Lütfen işaretli alanları düzeltin.", "err"); return; } }
        say(A.message(res), "err");
      });
    });
  }
  var L = panels.login, S = panels.signup;
  submit(L, $("al-submit"), function () { return A.login({ email: L.elements.email.value.trim(), password: L.elements.password.value }); }, "Giriş yapılıyor…", "Giriş yap");
  submit(S, $("as-submit"), function () {
    return A.register({ name: S.elements.name.value, email: S.elements.email.value.trim(), business: S.elements.business.value, password: S.elements.password.value, terms: S.elements.terms.checked });
  }, "Hesap oluşturuluyor…", "Hesap oluştur");

  show(q.get("sekme") === "uye" ? "signup" : "login", false);

  /* Zaten oturum açıksa doğrudan hedefe git. */
  A.me().then(function (res) {
    if (res.status === 200 && res.data.authenticated) { A.flag(true); location.replace(next ? "../" + next : "../hesabim/"); }
    else if (res.status === 200) A.flag(false);
    else if (res.status === 0 || res.status === 404 || res.status >= 500) say(A.message(res), "err");
  });
})();
