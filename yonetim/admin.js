/* QR Menu Official — yönetim paneli (vanilla JS, CSP: yalnızca 'self').
   Kullanıcı kaynaklı her değer (tıklama etiketi, başlık, yol…) textContent ile yazılır; innerHTML yalnızca sabit şablonlarda. */
(function () {
  "use strict";

  var API = "/api/admin/";
  var csrf = "";
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- yardımcılar ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(function (x) { add(el, x); });
    else el.appendChild(typeof c === "object" ? c : document.createTextNode(String(c)));
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function fmt(n) { return Number(n || 0).toLocaleString("tr-TR"); }
  function dur(s) { s = Math.round(s || 0); return s < 60 ? s + " sn" : Math.floor(s / 60) + " dk " + (s % 60) + " sn"; }
  var TZ = 3 * 3600 * 1000;
  function local(dt) { return dt ? new Date(dt.replace(" ", "T") + "Z") : null; }
  function when(dt) {
    var d = local(dt);
    return d ? new Date(d.getTime() + TZ).toISOString().slice(0, 16).replace("T", " ") : "";
  }
  function ago(dt) {
    var s = Math.max(0, (Date.now() - local(dt).getTime()) / 1000);
    return s < 60 ? Math.round(s) + " sn önce" : s < 3600 ? Math.round(s / 60) + " dk önce" : s < 86400 ? Math.round(s / 3600) + " sa önce" : Math.round(s / 86400) + " gün önce";
  }
  function qs(o) {
    var p = [];
    for (var k in o) if (o[k] !== "" && o[k] != null) p.push(encodeURIComponent(k) + "=" + encodeURIComponent(o[k]));
    return p.length ? "?" + p.join("&") : "";
  }
  function toast(msg, err) {
    var t = $("toast");
    t.textContent = msg;
    t.className = "toast" + (err ? " err" : "");
    t.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { t.hidden = true; }, err ? 5000 : 2600);
  }
  var ERR = {
    unauthenticated: "Oturum süresi doldu.", invalid_csrf: "Güvenlik anahtarı geçersiz; sayfayı yenileyin.", rate_limited: "Çok fazla istek; biraz bekleyin.",
    slug_taken: "Bu adres (slug) başka yazıda kullanılıyor.", invalid_field: "Alanları kontrol edin.", not_found: "Kayıt bulunamadı.", gd_missing: "Sunucuda GD/WebP yok; görsel yüklenemiyor.",
    unsupported_image: "Yalnızca JPG, PNG veya WebP.", file_too_large: "Dosya 8 MB'dan büyük.", image_dimensions: "Görsel en az 600×300 olmalı.", confirmation_required: "Onay gerekli."
  };
  var FIELD = { title: "Başlık", slug: "Adres", category: "Kategori", seo_title: "SEO başlığı", description: "Meta açıklama (≤165)", excerpt: "Özet", answer: "Kısa cevap", body: "İçerik (en az bir H2)", cover: "Kapak", cover_alt: "Kapak alt metni", published_on: "Yayın tarihi", faq: "SSS", sources: "Kaynaklar (http/https)", products: "Çözümler", related: "İlgili yazılar", slug_taken: "Adres kullanımda", company_name: "Firma adı" };

  function api(method, path, body) {
    var opt = { method: method, credentials: "same-origin", headers: {} };
    if (method !== "GET") opt.headers["X-CSRF-Token"] = csrf;
    if (body instanceof FormData) opt.body = body;
    else if (body !== undefined) { opt.headers["Content-Type"] = "application/json"; opt.body = JSON.stringify(body); }
    return fetch(API + path, opt).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 401) { showLogin(); throw new Error("auth"); }
        if (!r.ok || j.status === "error") {
          var e = new Error(ERR[j.error] || j.error || "Hata " + r.status);
          if (j.fields) e.message += ": " + j.fields.map(function (f) { return FIELD[f] || f; }).join(", ");
          e.code = j.error;
          throw e;
        }
        return j;
      });
    });
  }
  function guard(p) { return p.catch(function (e) { if (e.message !== "auth") toast(e.message, true); throw e; }); }

  function confirmDlg(title, text, label, danger) {
    return new Promise(function (res) {
      var d = $("dlg");
      clear(d);
      add(d, [h("h2", { text: title }), h("p", { text: text }), h("div", { class: "dlg__act" },
        h("button", { class: "btn", type: "button", text: "Vazgeç", onclick: function () { d.close(); res(false); } }),
        h("button", { class: "btn " + (danger ? "btn--danger" : "btn--primary"), type: "button", text: label, onclick: function () { d.close(); res(true); } }))]);
      d.showModal();
    });
  }

  /* ---------- grafikler (SVG; tek seri → renk marka yeşili, ızgara sönük) ---------- */
  var NS = "http://www.w3.org/2000/svg";
  function s(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }
  var tipEl = null;
  function tip(text, x, y) {
    if (!tipEl) { tipEl = h("div", { class: "tip" }); document.body.appendChild(tipEl); }
    if (text == null) { tipEl.hidden = true; return; }
    tipEl.hidden = false;
    tipEl.textContent = text;
    tipEl.style.left = Math.min(window.innerWidth - tipEl.offsetWidth - 8, x + 12) + "px";
    tipEl.style.top = y + 14 + "px";
  }
  function areaChart(series, key, label) {
    var W = 640, H = 200, P = { l: 36, r: 22, t: 10, b: 24 };
    var svg = s("svg", { viewBox: "0 0 " + W + " " + H, class: "chart", role: "img", "aria-label": label + " günlük grafik" });
    var max = Math.max.apply(null, series.map(function (d) { return d[key]; }).concat([1]));
    var step = Math.pow(10, Math.floor(Math.log10(max)));
    max = Math.ceil(max / step) * step;
    var iw = W - P.l - P.r, ih = H - P.t - P.b;
    var X = function (i) { return P.l + (series.length < 2 ? iw / 2 : (i * iw) / (series.length - 1)); };
    var Y = function (v) { return P.t + ih - (v / max) * ih; };
    [0, 0.5, 1].forEach(function (f) {
      var y = Y(max * f);
      svg.appendChild(s("line", { x1: P.l, x2: W - P.r, y1: y, y2: y, stroke: "currentColor", "stroke-opacity": ".12" }));
      var t = s("text", { x: P.l - 6, y: y + 4, "text-anchor": "end" });
      t.textContent = fmt(Math.round(max * f));
      svg.appendChild(t);
    });
    var pts = series.map(function (d, i) { return X(i) + "," + Y(d[key]); });
    svg.appendChild(s("path", { d: "M" + X(0) + "," + Y(0) + " L" + pts.join(" L") + " L" + X(series.length - 1) + "," + Y(0) + "Z", fill: "#1e6b52", "fill-opacity": ".14" }));
    svg.appendChild(s("polyline", { points: pts.join(" "), fill: "none", stroke: "#1e6b52", "stroke-width": 2, "stroke-linejoin": "round" }));
    var every = Math.ceil(series.length / 7);
    series.forEach(function (d, i) {
      if (i % every === 0 || i === series.length - 1) {
        var t = s("text", { x: X(i), y: H - 6, "text-anchor": "middle" });
        t.textContent = d.date.slice(8) + "." + d.date.slice(5, 7);
        svg.appendChild(t);
      }
    });
    var dot = s("circle", { r: 4, fill: "#1e6b52", stroke: "#fff", "stroke-width": 2, visibility: "hidden" });
    svg.appendChild(dot);
    var hit = s("rect", { x: P.l, y: P.t, width: iw, height: ih, fill: "transparent" });
    hit.addEventListener("pointermove", function (e) {
      var r = svg.getBoundingClientRect();
      var px = ((e.clientX - r.left) / r.width) * W;
      var i = Math.max(0, Math.min(series.length - 1, Math.round(((px - P.l) / iw) * (series.length - 1))));
      dot.setAttribute("cx", X(i)); dot.setAttribute("cy", Y(series[i][key])); dot.setAttribute("visibility", "visible");
      tip(series[i].date.split("-").reverse().join(".") + " · " + fmt(series[i][key]) + " " + label, e.clientX, e.clientY);
    });
    hit.addEventListener("pointerleave", function () { dot.setAttribute("visibility", "hidden"); tip(null); });
    svg.appendChild(hit);
    return svg;
  }
  function bars(rows, lk, vk, link) {
    var max = Math.max.apply(null, rows.map(function (r) { return r[vk]; }).concat([1]));
    if (!rows.length) return h("p", { class: "muted", text: "Veri yok." });
    return h("div", null, rows.map(function (r) {
      var svg = s("svg", { viewBox: "0 0 100 6", preserveAspectRatio: "none", "aria-hidden": "true" });
      svg.appendChild(s("rect", { width: 100, height: 6, rx: 3, fill: "currentColor", "fill-opacity": ".08" }));
      svg.appendChild(s("rect", { width: Math.max(1.5, (r[vk] / max) * 100), height: 6, rx: 3, fill: "#1e6b52" }));
      var label = String(r[lk]);
      return h("div", { class: "bar" }, h("span", { class: "bar__l", title: label }, link ? h("a", { href: link(r) }, label) : label), h("span", { class: "num", text: fmt(r[vk]) }), svg);
    }));
  }
  function delta(cur, prev, inv) {
    if (!prev) return h("div", { class: "stat__d muted", text: "önceki dönem: 0" });
    var p = ((cur - prev) / prev) * 100, good = inv ? p <= 0 : p >= 0;
    return h("div", { class: "stat__d " + (good ? "up" : "down"), text: (p >= 0 ? "▲ " : "▼ ") + Math.abs(p).toFixed(0) + "% önceki döneme göre" });
  }
  function stat(k, v, d) { return h("div", { class: "card" }, h("div", { class: "stat__k", text: k }), h("div", { class: "stat__v num", text: v }), d); }
  function table(cols, rows, empty) {
    if (!rows.length) return h("div", { class: "card empty", text: empty || "Kayıt yok." });
    return h("div", { class: "tw" }, h("table", null,
      h("thead", null, h("tr", null, cols.map(function (c) { return h("th", { class: c.r ? "r" : "", text: c.h }); }))),
      h("tbody", null, rows.map(function (r) { return h("tr", null, cols.map(function (c) { return h("td", { class: (c.r ? "r num " : "") + (c.t ? "trunc" : ""), title: c.t ? String(c.v(r) || "") : null }, c.v(r)); })); }))));
  }
  function pager(res, go) {
    var pages = Math.max(1, Math.ceil(res.total / res.per_page));
    return h("div", { class: "pager" }, h("span", { class: "muted small", text: fmt(res.total) + " kayıt · sayfa " + res.page + "/" + pages }),
      h("button", { class: "btn btn--sm", type: "button", text: "‹ Önceki", disabled: res.page <= 1, onclick: function () { go(res.page - 1); } }),
      h("button", { class: "btn btn--sm", type: "button", text: "Sonraki ›", disabled: res.page >= pages, onclick: function () { go(res.page + 1); } }));
  }
  var RANGES = [["today", "Bugün"], ["7d", "7 gün"], ["30d", "30 gün"], ["90d", "90 gün"]];
  var range = (function () { try { return sessionStorage.getItem("adm_range") || "7d"; } catch (e) { return "7d"; } })();
  function rangeSeg(reload) {
    return h("div", { class: "seg", role: "group", "aria-label": "Tarih aralığı" }, RANGES.map(function (r) {
      return h("button", { type: "button", "aria-pressed": String(range === r[0]), text: r[1], onclick: function () { range = r[0]; try { sessionStorage.setItem("adm_range", range); } catch (e) {} reload(); } });
    }));
  }
  function geo(c) { return c || "—"; }
  function who(x) { return [x.device, x.browser, x.os].filter(Boolean).join(" · ") || "—"; }

  /* ---------- görünümler ---------- */
  var V = {};
  var timers = [];
  function every(fn, ms) { timers.push(setInterval(fn, ms)); }

  V.genel = function (view, actions) {
    function load() {
      clear(actions); add(actions, rangeSeg(load));
      guard(api("GET", "analytics/overview" + qs({ range: range }))).then(function (o) {
        var t = o.totals, p = o.previous;
        clear(view);
        add(view, h("div", { class: "stack" },
          h("div", { class: "grid g4" },
            stat("Ziyaretçi", fmt(t.visitors), delta(t.visitors, p.visitors)),
            stat("Oturum", fmt(t.sessions), delta(t.sessions, p.sessions)),
            stat("Sayfa görüntüleme", fmt(t.pageviews), delta(t.pageviews, p.pageviews)),
            stat("Tıklama", fmt(t.clicks), delta(t.clicks, p.clicks)),
            stat("Yeni ziyaretçi", fmt(t.new_visitors), delta(t.new_visitors, p.new_visitors)),
            stat("Ort. süre", dur(t.avg_seconds), delta(t.avg_seconds, p.avg_seconds)),
            stat("Çıkış oranı", "%" + t.bounce_rate, delta(t.bounce_rate, p.bounce_rate, true)),
            h("div", { class: "card" }, h("div", { class: "stat__k", text: "Şu an sitede" }), h("div", { class: "stat__v num", text: fmt(o.live) }), h("a", { href: "#/canli", text: "Canlı görünüm →" }))),
          h("div", { class: "grid g2" },
            h("div", { class: "card" }, h("h2", { text: "Ziyaretçi" }), areaChart(o.series, "visitors", "ziyaretçi")),
            h("div", { class: "card" }, h("h2", { text: "Sayfa görüntüleme" }), areaChart(o.series, "pageviews", "görüntüleme"))),
          h("div", { class: "grid g2" },
            h("div", { class: "card" }, h("h2", { text: "En çok gezilen sayfalar" }), bars(o.top_pages, "path", "views", function () { return "#/sayfalar"; })),
            h("div", { class: "card" }, h("h2", { text: "En çok tıklananlar" }), bars(o.top_clicks.map(function (c) { return { l: (c.label || "(etiketsiz)") + (c.target ? " → " + c.target : ""), n: c.n }; }), "l", "n", function () { return "#/tiklamalar"; }))),
          h("div", { class: "grid g2" },
            h("div", { class: "card" }, h("h2", { text: "Trafik kaynakları" }), bars(o.referrers, "k", "n")),
            h("div", { class: "card" }, h("h2", { text: "Kampanyalar (utm)" }), bars(o.campaigns.map(function (c) { return { l: [c.source, c.medium, c.campaign].filter(Boolean).join(" / "), n: c.n }; }), "l", "n"))),
          h("div", { class: "grid g4" },
            h("div", { class: "card" }, h("h2", { text: "Cihaz" }), bars(o.devices, "key", "count")),
            h("div", { class: "card" }, h("h2", { text: "Tarayıcı" }), bars(o.browsers, "key", "count")),
            h("div", { class: "card" }, h("h2", { text: "İşletim sistemi" }), bars(o.os, "key", "count")),
            h("div", { class: "card" }, h("h2", { text: "Ülke" }), bars(o.countries, "key", "count")))));
      });
    }
    load();
  };

  function sessionRows(list) {
    return table([
      { h: "Başlangıç", v: function (r) { return h("a", { href: "#/oturum/" + r.id, text: when(r.started_at) }); } },
      { h: "Giriş sayfası", t: 1, v: function (r) { return r.landing_path; } },
      { h: "Kaynak", v: function (r) { return r.referrer || r.utm || "(doğrudan)"; } },
      { h: "Cihaz", v: who },
      { h: "Ülke", v: function (r) { return geo(r.country); } },
      { h: "IP", v: function (r) { return r.ip || "—"; } },
      { h: "Sayfa", r: 1, v: function (r) { return r.pageviews; } },
      { h: "Tık", r: 1, v: function (r) { return r.clicks; } },
      { h: "Kaydırma", r: 1, v: function (r) { return "%" + r.max_scroll; } },
      { h: "Süre", r: 1, v: function (r) { return dur(r.active_seconds); } },
      { h: "Ziyaretçi", v: function (r) { return h("a", { href: "#/ziyaretci/" + r.visitor_id, text: "#" + r.visitor_id }); } }
    ], list, "Bu aralıkta oturum yok.");
  }

  V.canli = function (view) {
    function load() {
      guard(api("GET", "analytics/live")).then(function (o) {
        clear(view);
        add(view, h("div", { class: "stack" }, h("div", { class: "card" }, h("div", { class: "stat__k", text: "Son 5 dakikada aktif oturum" }), h("div", { class: "stat__v num", text: fmt(o.count) }), h("span", { class: "muted small", text: "10 saniyede bir yenilenir" })),
          table([
            { h: "Şu an", t: 1, v: function (r) { return h("a", { href: "#/oturum/" + r.id, text: r.exit_path || r.landing_path }); } },
            { h: "Son hareket", v: function (r) { return ago(r.last_activity_at); } },
            { h: "Kaynak", v: function (r) { return r.referrer || "(doğrudan)"; } },
            { h: "Cihaz", v: who }, { h: "Ülke", v: function (r) { return geo(r.country); } },
            { h: "Sayfa", r: 1, v: function (r) { return r.pageviews; } }, { h: "Tık", r: 1, v: function (r) { return r.clicks; } }
          ], o.sessions, "Şu an aktif ziyaretçi yok.")));
      });
    }
    load(); every(load, 10000);
  };

  V.ziyaretciler = function (view) {
    var st = { q: "", page: 1, returning: "" };
    function load() {
      guard(api("GET", "analytics/visitors" + qs({ q: st.q, page: st.page, returning: st.returning }))).then(function (o) {
        var tb = view.querySelector("[data-body]");
        clear(tb);
        add(tb, [table([
          { h: "Kimlik", v: function (r) { return h("a", { href: "#/ziyaretci/" + r.id, text: "#" + r.id + " · " + r.vid }); } },
          { h: "Son görülme", v: function (r) { return when(r.last_seen) + " (" + ago(r.last_seen) + ")"; } },
          { h: "İlk kaynak", v: function (r) { return r.referrer || r.utm_source || "(doğrudan)"; } },
          { h: "Cihaz", v: who }, { h: "Ülke", v: function (r) { return geo(r.country); } }, { h: "IP", v: function (r) { return r.ip || "—"; } },
          { h: "Oturum", r: 1, v: function (r) { return r.sessions; } }, { h: "Sayfa", r: 1, v: function (r) { return r.pageviews; } }, { h: "Tık", r: 1, v: function (r) { return r.clicks; } }
        ], o.visitors, "Ziyaretçi yok."), pager(o, function (p) { st.page = p; load(); })]);
      });
    }
    add(view, [h("div", { class: "toolbar" },
      h("label", null, "Ara (kimlik, ülke, tarayıcı, kaynak)", h("input", { type: "search", maxlength: 60, oninput: function (e) { clearTimeout(load.t); load.t = setTimeout(function () { st.q = e.target.value; st.page = 1; load(); }, 300); } })),
      h("label", null, "Tür", h("select", { onchange: function (e) { st.returning = e.target.value; st.page = 1; load(); } }, h("option", { value: "", text: "Tümü" }), h("option", { value: "1", text: "Dönen ziyaretçi" })))),
      h("div", { "data-body": true })]);
    load();
  };

  V.ziyaretci = function (view, actions, id) {
    guard(api("GET", "analytics/visitors/" + id)).then(function (o) {
      var v = o.visitor;
      add(actions, h("button", { class: "btn btn--danger", type: "button", text: "Bu ziyaretçinin verisini sil", onclick: function () {
        confirmDlg("Ziyaretçi verisini sil", "#" + v.id + " numaralı ziyaretçinin tüm oturum ve olay kayıtları kalıcı olarak silinir.", "Sil", true).then(function (y) {
          if (y) guard(api("DELETE", "analytics/visitors/" + v.id)).then(function () { toast("Silindi"); location.hash = "#/ziyaretciler"; });
        });
      } }));
      var kv = [["Kimlik", "#" + v.id + " · " + v.vid], ["İlk görülme", when(v.first_seen)], ["Son görülme", when(v.last_seen)], ["İlk kaynak", v.referrer || v.utm_source || "(doğrudan)"], ["Cihaz", who(v)], ["Ülke", geo(v.country)], ["Son IP", v.ip || "—"], ["Toplam", v.sessions + " oturum · " + v.pageviews + " sayfa · " + v.clicks + " tıklama"]];
      add(view, h("div", { class: "stack" }, h("div", { class: "card" }, h("dl", { class: "kv" }, kv.map(function (r) { return [h("dt", { text: r[0] }), h("dd", { text: r[1] })]; }))), h("h2", { text: "Oturumlar" }), sessionRows(o.sessions)));
    });
  };

  V.oturumlar = function (view, actions) {
    var page = 1;
    function load() {
      clear(actions); add(actions, rangeSeg(load));
      guard(api("GET", "analytics/sessions" + qs({ range: range, page: page }))).then(function (o) {
        clear(view); add(view, [sessionRows(o.sessions), pager(o, function (p) { page = p; load(); })]);
      });
    }
    load();
  };

  var ICON = { pageview: "Sayfa", click: "Tıklama", outbound: "Dış bağlantı", scroll: "Kaydırma", engage: "Etkin süre" };
  function evText(e) {
    if (e.type === "pageview") return (e.title || e.path) + "  (" + e.path + ")";
    if (e.type === "click" || e.type === "outbound") return "“" + (e.label || "(etiketsiz)") + "”" + (e.target ? " → " + e.target : "") + (e.section ? "  [" + e.section + "]" : "");
    if (e.type === "scroll") return "%" + e.value + " kaydırıldı · " + e.path;
    return e.value + " sn etkin · " + e.path;
  }

  V.oturum = function (view, actions, id) {
    guard(api("GET", "analytics/sessions/" + id)).then(function (o) {
      var x = o.session;
      var kv = [["Başlangıç", when(x.started_at)], ["Son hareket", when(x.last_activity_at)], ["Kaynak", x.referrer_url || x.referrer || "(doğrudan)"], ["Kampanya", x.utm || "—"], ["Cihaz", who(x)], ["Ekran / dil", (x.screen || "—") + " · " + (x.lang || "—")], ["Ülke / IP", geo(x.country) + " · " + (x.ip || "—")], ["Özet", x.pageviews + " sayfa · " + x.clicks + " tıklama · %" + x.max_scroll + " kaydırma · " + dur(x.active_seconds)]];
      add(actions, h("a", { class: "btn", href: "#/ziyaretci/" + x.visitor_id, text: "Ziyaretçiye git" }));
      add(view, h("div", { class: "stack" }, h("div", { class: "card" }, h("dl", { class: "kv" }, kv.map(function (r) { return [h("dt", { text: r[0] }), h("dd", { text: r[1] })]; }))),
        h("div", { class: "card" }, h("h2", { text: "Gezinti akışı" }), h("ol", { class: "tl" }, o.events.map(function (e) {
          return h("li", { class: e.type === "click" || e.type === "outbound" ? "click" : e.type === "pageview" ? "" : "minor" }, h("span", { class: "muted small", text: when(e.at).slice(11) + " · " + ICON[e.type] + "  " }), h("span", { text: evText(e) }));
        })))));
    });
  };

  V.sayfalar = function (view, actions) {
    function load() {
      clear(actions); add(actions, rangeSeg(load));
      guard(api("GET", "analytics/pages" + qs({ range: range }))).then(function (o) {
        clear(view);
        add(view, table([{ h: "Sayfa", t: 1, v: function (r) { return h("a", { href: r.path, target: "_blank", rel: "noopener", text: r.path }); } }, { h: "Başlık", t: 1, v: function (r) { return r.title; } },
          { h: "Görüntüleme", r: 1, v: function (r) { return fmt(r.views); } }, { h: "Tekil ziyaretçi", r: 1, v: function (r) { return fmt(r.visitors); } },
          { h: "Ort. süre", r: 1, v: function (r) { return dur(r.avg_seconds); } }, { h: "Ort. kaydırma", r: 1, v: function (r) { return "%" + r.avg_scroll; } }, { h: "Tıklama", r: 1, v: function (r) { return fmt(r.clicks); } }], o.pages, "Bu aralıkta veri yok."));
      });
    }
    load();
  };

  V.tiklamalar = function (view, actions) {
    function load() {
      clear(actions); add(actions, rangeSeg(load));
      guard(api("GET", "analytics/clicks" + qs({ range: range }))).then(function (o) {
        clear(view);
        add(view, table([{ h: "Düğme / bağlantı", t: 1, v: function (r) { return r.label || "(etiketsiz)"; } }, { h: "Hedef", t: 1, v: function (r) { return r.target || "—"; } }, { h: "Bölüm", v: function (r) { return r.section || "—"; } },
          { h: "Sayfa", t: 1, v: function (r) { return r.path; } }, { h: "Tür", v: function (r) { return h("span", { class: "pill " + (r.type === "outbound" ? "pill--warn" : ""), text: ICON[r.type] }); } },
          { h: "Tık", r: 1, v: function (r) { return fmt(r.count); } }, { h: "Tekil", r: 1, v: function (r) { return fmt(r.visitors); } }, { h: "Son", v: function (r) { return when(r.last_at); } }], o.clicks, "Bu aralıkta tıklama yok."));
      });
    }
    load();
  };

  V.olaylar = function (view, actions) {
    var st = { type: "", path: "", page: 1 };
    function load() {
      clear(actions); add(actions, rangeSeg(load));
      guard(api("GET", "analytics/events" + qs({ range: range, type: st.type, path: st.path, page: st.page, per_page: 50 }))).then(function (o) {
        var tb = view.querySelector("[data-body]"); clear(tb);
        add(tb, [table([{ h: "Zaman", v: function (r) { return when(r.at); } }, { h: "Tür", v: function (r) { return ICON[r.type]; } }, { h: "Olay", t: 1, v: evText }, { h: "Oturum", v: function (r) { return h("a", { href: "#/oturum/" + r.session_id, text: "#" + r.session_id }); } }], o.events, "Olay yok."), pager(o, function (p) { st.page = p; load(); })]);
      });
    }
    add(view, [h("div", { class: "toolbar" },
      h("label", null, "Tür", h("select", { onchange: function (e) { st.type = e.target.value; st.page = 1; load(); } }, h("option", { value: "", text: "Tümü" }), Object.keys(ICON).map(function (k) { return h("option", { value: k, text: ICON[k] }); }))),
      h("label", null, "Sayfa yolu ile başlayan", h("input", { type: "search", placeholder: "/blog/", maxlength: 100, oninput: function (e) { clearTimeout(load.t); load.t = setTimeout(function () { st.path = e.target.value; st.page = 1; load(); }, 300); } }))), h("div", { "data-body": true })]);
    load();
  };

  /* ---------- blog ---------- */
  var BSTATUS = { taslak: ["Taslak", "pill--mut"], yayinda: ["Yayında", ""] };
  V.blog = function (view, actions) {
    add(actions, h("a", { class: "btn btn--primary", href: "#/blog/yeni", text: "+ Yeni yazı" }));
    var st = { q: "", status: "", page: 1 };
    function load() {
      guard(api("GET", "posts" + qs({ q: st.q, status: st.status, page: st.page }))).then(function (o) {
        var cats = {}; o.categories.forEach(function (c) { cats[c.slug] = c.name; });
        var tb = view.querySelector("[data-body]"); clear(tb);
        add(tb, [table([{ h: "Başlık", t: 1, v: function (r) { return h("a", { href: "#/blog/" + r.id, text: r.title }); } }, { h: "Durum", v: function (r) { return h("span", { class: "pill " + BSTATUS[r.status][1], text: BSTATUS[r.status][0] }); } },
          { h: "Kategori", v: function (r) { return cats[r.category] || r.category; } }, { h: "Yayın tarihi", v: function (r) { return r.published_on; } }, { h: "Okuma", r: 1, v: function (r) { return r.read_min + " dk"; } },
          { h: "", v: function (r) { return r.status === "yayinda" ? h("a", { href: "/blog/" + r.slug + "/", target: "_blank", rel: "noopener", text: "Gör →" }) : ""; } }], o.posts, "Yazı yok."), pager(o, function (p) { st.page = p; load(); })]);
      });
    }
    add(view, [h("div", { class: "toolbar" },
      h("label", null, "Ara", h("input", { type: "search", maxlength: 80, oninput: function (e) { clearTimeout(load.t); load.t = setTimeout(function () { st.q = e.target.value; st.page = 1; load(); }, 300); } })),
      h("label", null, "Durum", h("select", { onchange: function (e) { st.status = e.target.value; st.page = 1; load(); } }, h("option", { value: "", text: "Tümü" }), h("option", { value: "yayinda", text: "Yayında" }), h("option", { value: "taslak", text: "Taslak" })))), h("div", { "data-body": true })]);
    load();
  };

  var BLANK = { title: "", slug: "", status: "taslak", category: "", seo_title: "", description: "", excerpt: "", answer: "", body: "", cover: "", cover_alt: "", featured: false, published_on: new Date(Date.now() + TZ).toISOString().slice(0, 10), updated_on: null, faq: [], sources: [], products: [], related: [] };

  V.yazi = function (view, actions, id) {
    var isNew = id === "yeni";
    Promise.all([api("GET", isNew ? "posts?per_page=50" : "posts/" + id), api("GET", "posts?per_page=50")]).then(function (rs) {
      var d = rs[0], post = isNew ? JSON.parse(JSON.stringify(BLANK)) : d.post, cats = d.categories, allPosts = rs[1].posts;
      var covers = d.covers;
      var slugTouched = !isNew;
      function inp(name, label, opts) {
        opts = opts || {};
        var f = h(opts.area ? "textarea" : "input", { name: name, maxlength: opts.max, rows: opts.rows, type: opts.type || (opts.area ? null : "text"), oninput: function () { post[name] = this.value; if (opts.cnt) cnt.textContent = this.value.length + "/" + opts.max; if (name === "title" && !slugTouched) { post.slug = slugify(this.value); form.elements.slug.value = post.slug; } if (name === "slug") slugTouched = true; if (name === "body") prev.innerHTML = previewHtml(this.value); } });
        f.value = post[name] == null ? "" : post[name];
        var cnt = opts.cnt ? h("span", { class: "muted small", text: (f.value.length) + "/" + opts.max }) : null;
        return h("label", null, label, cnt ? [" ", cnt] : null, f);
      }
      function slugify(t) { return t.toLowerCase().replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100); }
      function previewHtml(html) { var t = document.createElement("template"); t.innerHTML = html; t.content.querySelectorAll("script,style,iframe,object,embed,link,meta").forEach(function (n) { n.remove(); }); t.content.querySelectorAll("*").forEach(function (n) { Array.prototype.slice.call(n.attributes).forEach(function (a) { if (/^on/i.test(a.name) || (/^(href|src)$/i.test(a.name) && /^\s*javascript:/i.test(a.value))) n.removeAttribute(a.name); }); }); var div = document.createElement("div"); div.appendChild(t.content); return div.innerHTML; }
      function rep(key, fields, labels, addLabel) {
        var box = h("div", { class: "rep" });
        function draw() {
          clear(box);
          post[key].forEach(function (row, i) {
            var line = h("div", { class: "rep__row" });
            fields.forEach(function (f, j) { var el = h(f === "a" ? "textarea" : "input", { rows: f === "a" ? 2 : null, placeholder: labels[j], "aria-label": labels[j], oninput: function () { row[f] = this.value; } }); el.value = row[f] || ""; line.appendChild(el); });
            line.appendChild(h("button", { class: "btn btn--sm", type: "button", text: "Sil", onclick: function () { post[key].splice(i, 1); draw(); } }));
            box.appendChild(line);
          });
          box.appendChild(h("div", null, h("button", { class: "btn btn--sm", type: "button", text: addLabel, onclick: function () { var o = {}; fields.forEach(function (f) { o[f] = ""; }); post[key].push(o); draw(); } })));
        }
        draw();
        return box;
      }
      var body = inp("body", "İçerik (HTML — H2/H3, paragraf, liste, tablo; bağlantılar için @/yol/ kullanılabilir)", { area: true, rows: 22 });
      var prev = h("div", { class: "editor__prev" });
      prev.innerHTML = previewHtml(post.body);
      var ta = body.querySelector("textarea");
      function wrap(open, close) { var s0 = ta.selectionStart, e0 = ta.selectionEnd, v = ta.value; ta.value = v.slice(0, s0) + open + (v.slice(s0, e0) || "metin") + close + v.slice(e0); post.body = ta.value; prev.innerHTML = previewHtml(ta.value); ta.focus(); }
      var tools = h("div", { class: "tools" }, [["H2", "<h2>", "</h2>\n"], ["H3", "<h3>", "</h3>\n"], ["Paragraf", "<p>", "</p>\n"], ["Kalın", "<strong>", "</strong>"], ["Liste", "<ul>\n  <li>", "</li>\n</ul>\n"], ["Sıralı", "<ol>\n  <li>", "</li>\n</ol>\n"], ["Bağlantı", '<a href="https://">', "</a>"]].map(function (b) { return h("button", { class: "btn btn--sm", type: "button", text: b[0], onclick: function () { wrap(b[1], b[2]); } }); }));
      var up = h("input", { type: "file", accept: "image/jpeg,image/png,image/webp", hidden: true, onchange: function () { var fl = this.files[0]; if (!fl) return; var fd = new FormData(); fd.append("file", fl); fd.append("kind", "inline"); fd.append("name", post.slug || "gorsel"); guard(api("POST", "uploads", fd)).then(function (r) { wrap('<img src="@/' + r.path + '" alt="', '" width="' + r.width + '" height="' + r.height + '">'); toast("Görsel yüklendi; alt metni doldurun."); }); this.value = ""; } });
      tools.appendChild(h("button", { class: "btn btn--sm", type: "button", text: "Görsel ekle", onclick: function () { up.click(); } })); tools.appendChild(up);

      var coverSel = h("select", { name: "cover", onchange: function () { post.cover = this.value; coverImg(); } }, h("option", { value: "", text: "— kapak seçin —" }), covers.map(function (c) { return h("option", { value: c, text: c }); }));
      coverSel.value = post.cover;
      var coverPrev = h("img", { alt: "", width: 240, height: 126, hidden: true });
      function coverImg() { coverPrev.hidden = !post.cover; if (post.cover) coverPrev.src = "/assets/blog/" + post.cover + "-720.webp"; }
      coverImg();
      var coverUp = h("input", { type: "file", accept: "image/jpeg,image/png,image/webp", hidden: true, onchange: function () { var fl = this.files[0]; if (!fl) return; var fd = new FormData(); fd.append("file", fl); fd.append("kind", "cover"); fd.append("name", post.slug || slugify(post.title) || "kapak"); guard(api("POST", "uploads", fd)).then(function (r) { if (!Array.prototype.some.call(coverSel.options, function (o) { return o.value === r.cover; })) coverSel.appendChild(h("option", { value: r.cover, text: r.cover })); coverSel.value = r.cover; post.cover = r.cover; coverImg(); toast("Kapak yüklendi (1200/720/OG üretildi)."); }); this.value = ""; } });

      var relSel = h("select", { multiple: true, size: 5, "aria-label": "İlgili yazılar", onchange: function () { post.related = Array.prototype.filter.call(this.options, function (o) { return o.selected; }).map(function (o) { return o.value; }); } }, allPosts.filter(function (p) { return p.id !== post.id; }).map(function (p) { return h("option", { value: p.slug, text: p.title, selected: post.related.indexOf(p.slug) >= 0 }); }));

      var catSel = h("select", { name: "category", onchange: function () { post.category = this.value; } }, h("option", { value: "", text: "— seçin —" }), cats.map(function (c) { return h("option", { value: c.slug, text: c.name }); }));
      catSel.value = post.category;
      var statusSel = h("select", { onchange: function () { post.status = this.value; } }, h("option", { value: "taslak", text: "Taslak (sitede görünmez)" }), h("option", { value: "yayinda", text: "Yayında" }));
      statusSel.value = post.status;

      var form = h("form", { class: "form", onsubmit: function (e) { e.preventDefault(); save(); } },
        h("div", { class: "card form" },
          inp("title", "Başlık", { max: 200 }), h("div", { class: "row3" }, inp("slug", "Adres (slug)", { max: 100 }), h("label", null, "Kategori", catSel), h("label", null, "Durum", statusSel)),
          h("div", { class: "row3" }, inp("published_on", "Yayın tarihi", { type: "date" }), inp("updated_on", "Güncelleme tarihi (isteğe bağlı)", { type: "date" }), h("label", { class: "chk" }, h("input", { type: "checkbox", checked: post.featured, onchange: function () { post.featured = this.checked; } }), "Blog ana sayfasında öne çıkar"))),
        h("div", { class: "card form" }, h("h2", { text: "SEO ve özet" }), inp("seo_title", "SEO başlığı", { max: 120, cnt: 1 }), inp("description", "Meta açıklama", { area: true, rows: 2, max: 165, cnt: 1 }), inp("excerpt", "Özet (kartlarda ve girişte)", { area: true, rows: 2, max: 500 }), inp("answer", "Kısa cevap (yazının başındaki kutu)", { area: true, rows: 3, max: 2000 })),
        h("div", { class: "card form" }, h("h2", { text: "Kapak" }), h("div", { class: "row2" }, h("label", null, "Kapak görseli", coverSel, h("span", { class: "small muted", text: "Yeni görsel yükleyin: en az 600×300, JPG/PNG/WebP; 1200×630 ve 720×378 WebP ile OG JPG otomatik üretilir." })), h("div", null, coverPrev)), h("div", null, h("button", { class: "btn btn--sm", type: "button", text: "Yeni kapak yükle", onclick: function () { coverUp.click(); } }), coverUp), inp("cover_alt", "Kapak alt metni", { max: 255 })),
        h("div", { class: "card form" }, h("h2", { text: "İçerik" }), tools, h("div", { class: "editor" }, body, h("div", null, h("div", { class: "stat__k", text: "Önizleme (yaklaşık; asıl görünüm sitedeki blog stilidir)" }), prev))),
        h("div", { class: "card form" }, h("h2", { text: "Sık sorulan sorular" }), rep("faq", ["q", "a"], ["Soru", "Cevap"], "+ Soru ekle")),
        h("div", { class: "card form" }, h("h2", { text: "Kaynaklar" }), rep("sources", ["label", "url"], ["Başlık", "https://…"], "+ Kaynak ekle")),
        h("div", { class: "card form" }, h("h2", { text: "İlgili çözümler ve yazılar" }), rep("products", ["label", "path"], ["Etiket", "moduller/qr-masa/"], "+ Çözüm ekle"), h("label", null, "İlgili yazılar (Ctrl/Cmd ile çoklu seçim)", relSel)));

      function save() {
        var payload = JSON.parse(JSON.stringify(post));
        delete payload.id;
        if (!payload.updated_on) payload.updated_on = null;
        var p = isNew ? api("POST", "posts", payload) : api("PATCH", "posts/" + id, payload);
        guard(p).then(function (r) { toast(isNew ? "Yazı oluşturuldu" : "Kaydedildi"); if (isNew) location.hash = "#/blog/" + r.post.id; else { post.slug = r.post.slug; form.elements.slug.value = r.post.slug; } });
      }
      add(actions, [
        !isNew && h("a", { class: "btn", href: post.status === "yayinda" ? "/blog/" + post.slug + "/" : "#/blog/" + id, target: post.status === "yayinda" ? "_blank" : null, rel: "noopener", text: post.status === "yayinda" ? "Sayfayı gör" : "Taslak (yayında değil)" }),
        !isNew && h("button", { class: "btn btn--danger", type: "button", text: "Sil", onclick: function () { confirmDlg("Yazıyı sil", "“" + post.title + "” kalıcı olarak silinir.", "Sil", true).then(function (y) { if (y) guard(api("DELETE", "posts/" + id)).then(function () { toast("Silindi"); location.hash = "#/blog"; }); }); } }),
        h("button", { class: "btn btn--primary", type: "button", text: "Kaydet", onclick: save })]);
      add(view, form);
    });
  };

  /* ---------- lisanslar ---------- */
  var STATE = { aktif: ["Aktif", ""], pasif: ["Pasif", "pill--mut"], suresi_dolmus: ["Süresi dolmuş", "pill--bad"], arsiv: ["Arşiv", "pill--mut"] };
  var MODULES = { "restoran-menu": "Restoran Menü", "yorum-feedback": "Yorum & Feedback", "qr-masa": "QR Masa", "qr-analiz": "QR Analiz", "qr-galeri": "QR Galeri", "qr-ceviri": "QR Çeviri", "qr-chatbot": "QR Chatbot", "qr-calisma-saatleri": "QR Çalışma Saatleri", "qr-masa-oturum-guvenligi": "QR Masa Oturum Güvenliği", "qr-acilis-ekrani": "Açılış Ekranı", "header-footer-builder": "Header Footer Builder", "qr-menu-muhendisligi": "Menü Mühendisliği", "qr-servis-paneli": "Servis Paneli" };

  V.lisanslar = function (view, actions) {
    add(actions, h("a", { class: "btn btn--primary", href: "#/lisans/yeni", text: "+ Yeni lisans" }));
    var st = { q: "", status: "", page: 1 };
    function load() {
      Promise.all([guard(api("GET", "summary")), guard(api("GET", "licenses" + qs({ q: st.q, status: st.status, page: st.page })))]).then(function (rs) {
        var sm = rs[0], o = rs[1];
        var tb = view.querySelector("[data-body]"); clear(tb);
        add(view.querySelector("[data-sum]"), null);
        var sumEl = clear(view.querySelector("[data-sum]"));
        add(sumEl, [stat("Toplam", fmt(sm.total)), stat("Kullanılabilir", fmt(sm.usable)), stat("Pasif", fmt(sm.inactive)), stat("Süresi dolmuş", fmt(sm.expired))]);
        add(tb, [table([{ h: "Firma", v: function (r) { return h("a", { href: "#/lisans/" + r.id, text: r.company_name }); } }, { h: "Durum", v: function (r) { var s = STATE[r.state] || [r.state, ""]; return h("span", { class: "pill " + s[1], text: s[0] }); } },
          { h: "Paket", v: function (r) { return r.tier || "özel"; } }, { h: "Domain", t: 1, v: function (r) { return r.domain || "Henüz aktifleşmedi"; } }, { h: "Modül", r: 1, v: function (r) { return r.modules.length + "/13"; } },
          { h: "Bitiş", v: function (r) { return r.expires_on || "süresiz"; } }, { h: "Ücret", v: function (r) { return r.amount_paid || "—"; } }, { h: "Son görülme", v: function (r) { return r.last_seen_at ? ago(r.last_seen_at) : "—"; } }, { h: "Sürüm", v: function (r) { return r.client_version || "—"; } }], o.licenses, "Lisans yok."), pager(o, function (p) { st.page = p; load(); })]);
      });
    }
    add(view, [h("div", { class: "grid g4", "data-sum": true }), h("div", { class: "toolbar" },
      h("label", null, "Ara (firma, domain)", h("input", { type: "search", maxlength: 80, oninput: function (e) { clearTimeout(load.t); load.t = setTimeout(function () { st.q = e.target.value; st.page = 1; load(); }, 300); } })),
      h("label", null, "Durum", h("select", { onchange: function (e) { st.status = e.target.value; st.page = 1; load(); } }, [["", "Tümü"], ["aktif", "Aktif"], ["kullanilabilir", "Kullanılabilir"], ["pasif", "Pasif"], ["suresi_dolmus", "Süresi dolmuş"]].map(function (x) { return h("option", { value: x[0], text: x[1] }); })))), h("div", { "data-body": true })]);
    load();
  };

  V.lisans = function (view, actions, id) {
    var isNew = id === "yeni";
    Promise.all([api("GET", "tiers"), isNew ? { license: { company_name: "", status: "aktif", tier: null, modules: [], starts_on: "", expires_on: "", amount_paid: "", notes: "" } } : api("GET", "licenses/" + id)]).then(function (rs) {
      var tiers = rs[0].tiers, L = rs[1].license;
      var checks = {};
      var modBox = h("div", { class: "mods" }, Object.keys(MODULES).map(function (slug) {
        var c = h("input", { type: "checkbox", checked: L.modules.indexOf(slug) >= 0 }); checks[slug] = c;
        return h("label", { class: "chk" }, c, MODULES[slug]);
      }));
      var tierSel = h("select", { name: "tier" }, h("option", { value: "", text: "Özel" }), tiers.map(function (t) { return h("option", { value: t.slug, text: t.label }); }));
      tierSel.value = L.tier || "";
      var tierBtns = h("div", { class: "tools" }, tiers.map(function (t) { return h("button", { class: "btn btn--sm", type: "button", text: t.label + " paketini doldur", onclick: function () { Object.keys(checks).forEach(function (k) { checks[k].checked = t.modules.indexOf(k) >= 0; }); tierSel.value = t.slug; } }); }));
      var f = h("form", { class: "form card", onsubmit: function (e) { e.preventDefault(); save(); } },
        h("label", null, "Firma adı", h("input", { name: "company_name", maxlength: 191, required: true, value: L.company_name })),
        tierBtns, h("label", null, "Paket etiketi", tierSel), h("div", null, h("div", { class: "stat__k", text: "Modüller" }), modBox),
        h("div", { class: "row3" }, h("label", null, "Durum", h("select", { name: "status" }, h("option", { value: "aktif", text: "Aktif" }), h("option", { value: "pasif", text: "Pasif" }))), h("label", null, "Başlangıç", h("input", { name: "starts_on", type: "date", value: L.starts_on || "" })), h("label", null, "Son kullanma (boş = süresiz)", h("input", { name: "expires_on", type: "date", value: L.expires_on || "" }))),
        h("label", null, "Alınan ücret", h("input", { name: "amount_paid", maxlength: 64, value: L.amount_paid })), h("label", null, "Notlar (yalnızca yönetim; API'ye gitmez)", h("textarea", { name: "notes", rows: 4, text: L.notes })));
      f.elements.status.value = L.status;
      function save() {
        var v = f.elements, payload = { company_name: v.company_name.value.trim(), status: v.status.value, tier: tierSel.value || null, modules: Object.keys(checks).filter(function (k) { return checks[k].checked; }), starts_on: v.starts_on.value || null, expires_on: v.expires_on.value || null, amount_paid: v.amount_paid.value.trim(), notes: v.notes.value };
        guard(isNew ? api("POST", "licenses", payload) : api("PATCH", "licenses/" + id, payload)).then(function (r) {
          toast("Kaydedildi");
          if (isNew) { keyDialog(r.api_key, "Lisans oluşturuldu").then(function () { location.hash = "#/lisans/" + r.license.id; }); } else route();
        });
      }
      function keyDialog(key, title) {
        return new Promise(function (res) {
          var d = $("dlg"); clear(d);
          add(d, [h("h2", { text: title }), h("p", { class: "small muted", text: "API anahtarını müşteriye iletin. Sonradan “Anahtarı göster” ile yeniden görüntülenebilir." }), h("div", { class: "keybox" }, h("span", { text: key }), h("button", { class: "btn btn--sm", type: "button", text: "Kopyala", onclick: function () { (navigator.clipboard ? navigator.clipboard.writeText(key) : Promise.reject()).then(function () { toast("Kopyalandı"); }, function () { toast("Kopyalanamadı; elle seçin", true); }); } })), h("div", { class: "dlg__act" }, h("button", { class: "btn btn--primary", type: "button", text: "Tamam", onclick: function () { d.close(); res(); } }))]);
          d.showModal();
        });
      }
      var side = [];
      if (!isNew) {
        var kv = [["Durum", (STATE[L.state] || [L.state])[0]], ["Anahtar", L.key_hint || "—"], ["Kayıtlı domain", L.domain || "Henüz aktifleşmedi"], ["Son görülme", L.last_seen_at ? when(L.last_seen_at) + " (" + ago(L.last_seen_at) + ")" : "—"], ["İstemci sürümü", L.client_version || "—"], ["Oluşturulma", when(L.created_at)]];
        var audit = h("div", { class: "card" }, h("h2", { text: "Aktivite geçmişi" }), h("p", { class: "muted small", text: "Yükleniyor…" }));
        guard(api("GET", "audit" + qs({ license: id, per_page: 50 }))).then(function (a) { var items = a.events || a.audit || a.items || []; clear(audit); add(audit, [h("h2", { text: "Aktivite geçmişi" }), items.length ? h("ol", { class: "tl" }, items.map(function (e) { return h("li", { class: "minor" }, h("span", { class: "muted small", text: when(e.occurred_at) + " · " + e.actor + " · " }), h("span", { text: e.action + (e.detail ? " — " + e.detail : "") })); })) : h("p", { class: "muted", text: "Kayıt yok." })]); });
        side = [h("div", { class: "card" }, h("h2", { text: "Durum" }), h("dl", { class: "kv" }, kv.map(function (r) { return [h("dt", { text: r[0] }), h("dd", { text: r[1] })]; })),
          h("div", { class: "tools", style: null }, h("button", { class: "btn btn--sm", type: "button", text: "Anahtarı göster", onclick: function () { guard(api("POST", "licenses/" + id + "/reveal", {})).then(function (r) { keyDialog(r.api_key, "API anahtarı"); }); } }),
            h("button", { class: "btn btn--sm", type: "button", text: "Domain kilidini kaldır", onclick: function () { confirmDlg("Domain kilidi", "Kayıtlı domain silinir; sonraki doğrulamada gelen ilk domain kilitlenir.", "Kaldır").then(function (y) { if (y) guard(api("POST", "licenses/" + id + "/unlock-domain", { confirm: true })).then(function () { toast("Kilit kaldırıldı"); route(); }); }); } }),
            h("button", { class: "btn btn--sm btn--danger", type: "button", text: "Anahtarı yeniden üret", onclick: function () { confirmDlg("Anahtarı yeniden üret", "Eski anahtar hemen geçersiz olur; müşteri eklentisine yenisi girilmelidir.", "Yeniden üret", true).then(function (y) { if (y) guard(api("POST", "licenses/" + id + "/regenerate-key", { confirm: true })).then(function (r) { return keyDialog(r.api_key, "Yeni API anahtarı"); }).then(route); }); } }),
            h("button", { class: "btn btn--sm btn--danger", type: "button", text: "Arşivle", onclick: function () { confirmDlg("Lisansı arşivle", "Lisans doğrulamada geçersiz sayılır ve listeden kalkar.", "Arşivle", true).then(function (y) { if (y) guard(api("POST", "licenses/" + id + "/archive", {})).then(function () { toast("Arşivlendi"); location.hash = "#/lisanslar"; }); }); } }))), audit];
      }
      add(actions, h("button", { class: "btn btn--primary", type: "button", text: "Kaydet", onclick: save }));
      add(view, h("div", { class: "grid g2" }, f, h("div", { class: "stack" }, side)));
    });
  };

  /* ---------- yönlendirme ---------- */
  var NAV = [["genel", "Genel bakış"], ["canli", "Canlı"], ["sep", "Ziyaretçi analitiği"], ["ziyaretciler", "Ziyaretçiler"], ["oturumlar", "Oturumlar"], ["sayfalar", "Gezilen sayfalar"], ["tiklamalar", "Tıklamalar"], ["olaylar", "Olay akışı"], ["sep", "İçerik"], ["blog", "Blog yazıları"], ["sep", "Lisans sunucusu"], ["lisanslar", "Lisanslar"]];
  var TITLES = { genel: "Genel bakış", canli: "Canlı ziyaretçiler", ziyaretciler: "Ziyaretçiler", ziyaretci: "Ziyaretçi", oturumlar: "Oturumlar", oturum: "Oturum", sayfalar: "Gezilen sayfalar", tiklamalar: "Tıklanan düğmeler ve bağlantılar", olaylar: "Olay akışı", blog: "Blog yazıları", yazi: "Blog yazısı", lisanslar: "Lisanslar", lisans: "Lisans" };

  function route() {
    timers.forEach(clearInterval); timers = [];
    var parts = (location.hash.replace(/^#\/?/, "") || "genel").split("/");
    var key = parts[0], arg = parts[1];
    if (key === "blog" && arg) key = "yazi";
    if (key === "lisans" && !arg) key = "lisanslar";
    if (!V[key]) { key = "genel"; arg = null; }
    var nav = key === "yazi" ? "blog" : key === "lisans" ? "lisanslar" : key === "ziyaretci" ? "ziyaretciler" : key === "oturum" ? "oturumlar" : key;
    Array.prototype.forEach.call($("nav").querySelectorAll("a"), function (a) { if (a.dataset.k === nav) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    $("title").textContent = TITLES[key] || "";
    document.title = (TITLES[key] || "Panel") + " | Yönetim";
    var view = clear($("view")), actions = clear($("actions"));
    $("side").classList.remove("open"); $("menu-btn").setAttribute("aria-expanded", "false");
    if (key === "lisanslar" || key === "blog" || key === "yazi" || key === "lisans" || key === "ziyaretci" || key === "oturum") { /* arg ile */ }
    V[key](view, actions, arg);
    view.focus({ preventScroll: true });
  }

  function buildNav() {
    var nav = clear($("nav"));
    NAV.forEach(function (n) { nav.appendChild(n[0] === "sep" ? h("div", { class: "sep", text: n[1] }) : h("a", { href: "#/" + n[0], "data-k": n[0], text: n[1] })); });
  }

  function showLogin() { $("app").hidden = true; $("login").hidden = false; csrf = ""; var u = document.querySelector("#login-form [name=username]"); if (u) u.focus(); }
  function showApp(sess) {
    csrf = sess.csrf_token; $("who").textContent = sess.username;
    $("login").hidden = true; $("app").hidden = false; buildNav(); route();
  }

  $("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, err = $("login-err"); err.hidden = true;
    fetch(API + "login", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: f.username.value, password: f.password.value }) })
      .then(function (r) { return r.json().then(function (j) { return { r: r, j: j }; }); })
      .then(function (x) {
        if (x.r.ok && x.j.status === "ok" || x.r.ok && x.j.csrf_token) { f.password.value = ""; return init(); }
        err.textContent = x.r.status === 429 ? "Çok fazla deneme; bir dakika bekleyin." : x.r.status === 400 && x.j.error === "https_required" ? "Giriş yalnızca HTTPS ile yapılır." : "Kullanıcı adı veya parola hatalı.";
        err.hidden = false;
      }).catch(function () { err.textContent = "Sunucuya ulaşılamadı."; err.hidden = false; });
  });
  $("logout").addEventListener("click", function () { api("POST", "logout", {}).catch(function () {}).then(showLogin); });
  $("menu-btn").addEventListener("click", function () { var o = $("side").classList.toggle("open"); this.setAttribute("aria-expanded", String(o)); });
  window.addEventListener("hashchange", function () { if (!$("app").hidden) route(); });

  function init() {
    fetch(API + "session", { credentials: "same-origin" }).then(function (r) { return r.json(); }).then(function (j) { if (j.authenticated) showApp(j); else showLogin(); }).catch(showLogin);
  }
  init();
})();
