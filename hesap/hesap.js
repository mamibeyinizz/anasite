/* QR MENU OFFICIAL — hesap API istemcisi (giriş, hesabım, ödeme sayfaları ortak kullanır).
   Adres: <body data-api="../api/account">. Oturum çerezi HttpOnly'dir; burada yalnızca CSRF
   belirteci bellekte tutulur. localStorage "qrmo_hesap" yalnızca header etiketi içindir. */
(function () {
  "use strict";
  var base = (document.body && document.body.getAttribute("data-api")) || "../api/account";
  var csrf = "";

  function flag(on) {
    try { if (on) localStorage.setItem("qrmo_hesap", "1"); else localStorage.removeItem("qrmo_hesap"); } catch (e) {}
  }

  /* Her zaman çözülür: { status, data }. status 0 = ağ yok / yanıt JSON değil (statik barındırma). */
  function request(method, path, body) {
    var opt = { method: method, credentials: "same-origin", headers: { Accept: "application/json" } };
    if (csrf && method !== "GET") opt.headers["X-CSRF-Token"] = csrf;
    if (body !== undefined) { opt.headers["Content-Type"] = "application/json"; opt.body = JSON.stringify(body); }
    return fetch(base + path, opt).then(function (r) {
      return r.text().then(function (t) {
        var d = null;
        try { d = JSON.parse(t); } catch (e) {}
        if (d === null || typeof d !== "object") return { status: 0, data: {}, retry: 0 };
        if (d.csrf_token) csrf = d.csrf_token;
        return { status: r.status, data: d, retry: parseInt(r.headers.get("Retry-After") || "0", 10) || 0 };
      });
    }, function () { return { status: 0, data: {}, retry: 0 }; });
  }

  var ERR = {
    unavailable: "Hesap hizmetine şu an ulaşılamıyor. Biraz sonra tekrar deneyin ya da bizimle iletişime geçin.",
    invalid_credentials: "E-posta veya parola hatalı.",
    email_taken: "Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin.",
    https_required: "Bu işlem yalnızca güvenli (https) bağlantıyla yapılabilir.",
    generic: "İşlem tamamlanamadı. Lütfen tekrar deneyin."
  };
  function message(res) {
    if (res.status === 0 || res.status >= 500 || res.status === 404) return ERR.unavailable;
    if (res.status === 429) return "Çok fazla deneme yapıldı. " + (res.retry ? res.retry + " saniye" : "Biraz") + " sonra tekrar deneyin.";
    return ERR[res.data && res.data.error] || ERR.generic;
  }

  /* Yönlendirme hedefi yalnızca site içi bu üç yoldan biri olabilir (açık yönlendirme yok). */
  function safeNext(v) {
    return typeof v === "string" && /^(odeme|hesabim|paketler)\/[A-Za-z0-9_\-?=&%.]*$/.test(v) ? v : "";
  }

  window.QRMO_ACC = {
    me: function () { return request("GET", "/me"); },
    register: function (b) { return request("POST", "/register", b); },
    login: function (b) { return request("POST", "/login", b); },
    logout: function () { return request("POST", "/logout", {}); },
    profile: function (b) { return request("PATCH", "/profile", b); },
    password: function (b) { return request("POST", "/password", b); },
    order: function (b) { return request("POST", "/orders", b); },
    remove: function (b) { return request("DELETE", "", b); },
    flag: flag, message: message, safeNext: safeNext
  };
})();
