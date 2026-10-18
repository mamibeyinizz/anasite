/* QR Menu Official — /iletisim/ talep formu
   Gönderim altyapısı yok. Doğrulama sonrası mailto taslağı açılır.
   Taslak açılması, iletinin ulaştığı anlamına gelmez. */
(function () {
  var EMAIL = "muhammedulusoyresmi@gmail.com";
  var MAX_URL = 1800;
  var TOPICS = {
    "qr-menu": "QR menü hakkında bilgi",
    paketler: "Paketler ve fiyatlar",
    "uygun-cozum": "İşletmeme uygun çözüm",
    destek: "Mevcut müşteri desteği",
    diger: "Diğer"
  };
  var TYPES = {
    "": "",
    restoran: "Restoran",
    kafe: "Kafe",
    pastane: "Pastane",
    diger: "Diğer"
  };

  var form = document.getElementById("qrmo-contact-form");
  if (!form) return;

  var submitBtn = document.getElementById("qrmo-contact-submit");
  var status = document.getElementById("qrmo-contact-status");
  var busy = false;
  var tried = false;
  var defaultLabel = submitBtn ? submitBtn.textContent : "";

  form.noValidate = true;

  function oneLine(value) {
    return String(value || "").replace(/[\r\n]+/g, " ").trim();
  }

  function messageText(value) {
    return String(value || "").replace(/\r\n/g, "\n").trim();
  }

  function phoneError(value) {
    var v = oneLine(value);
    if (!v) return "Telefon numaranızı yazın.";
    if (/[^\d\s()+.-]/.test(v)) return "Telefon numarasında yalnızca rakam ve + ( ) - kullanın.";
    var digits = v.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) return "Telefon numarası 10 ile 15 rakam arasında olmalı.";
    if (/^(\d)\1+$/.test(digits)) return "Geçerli bir telefon numarası yazın.";
    return "";
  }

  function emailError(value) {
    var v = oneLine(value);
    if (!v) return "";
    if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      return "E-posta adresini kontrol edin veya alanı boş bırakın.";
    }
    return "";
  }

  function rules() {
    var name = oneLine(form.elements.name.value);
    var business = oneLine(form.elements.business.value);
    var type = form.elements.type.value;
    var topic = form.elements.topic.value;
    var message = messageText(form.elements.message.value);
    return [
      { el: form.elements.name, message: name.length < 2 ? "Adınızı yazın." : "" },
      { el: form.elements.business, message: business.length < 2 ? "İşletme adını yazın." : "" },
      { el: form.elements.phone, message: phoneError(form.elements.phone.value) },
      { el: form.elements.email, message: emailError(form.elements.email.value) },
      {
        el: form.elements.type,
        message: Object.prototype.hasOwnProperty.call(TYPES, type) ? "" : "Listeden bir işletme türü seçin veya alanı boş bırakın."
      },
      {
        el: form.elements.topic,
        message: Object.prototype.hasOwnProperty.call(TOPICS, topic) && topic ? "" : "Bir konu seçin."
      },
      {
        el: form.elements.message,
        message: message.length < 10 ? "Mesajınızı en az 10 karakterle yazın." : ""
      },
      {
        el: form.elements.consent,
        message: form.elements.consent.checked ? "" : "Talebin yanıtlanabilmesi için bu onayı işaretleyin."
      }
    ];
  }

  function hintId(el) {
    var described = (el.getAttribute("aria-describedby") || "").split(/\s+/);
    return described.filter(function (id) {
      return id && id.indexOf("-error") === -1 && document.getElementById(id);
    });
  }

  function setFieldError(el, message) {
    var error = document.getElementById(el.id + "-error");
    var hints = hintId(el);
    if (!error) return;
    if (message) {
      error.hidden = false;
      error.textContent = message;
      el.setAttribute("aria-invalid", "true");
      el.setAttribute("aria-describedby", hints.concat(error.id).join(" "));
    } else {
      error.hidden = true;
      error.textContent = "";
      el.removeAttribute("aria-invalid");
      if (hints.length) el.setAttribute("aria-describedby", hints.join(" "));
      else el.removeAttribute("aria-describedby");
    }
  }

  function validate() {
    var items = rules();
    var first = null;
    var count = 0;
    items.forEach(function (item) {
      setFieldError(item.el, item.message);
      if (item.message) {
        count += 1;
        if (!first) first = item.el;
      }
    });
    return { count: count, first: first };
  }

  function draftText() {
    var topic = TOPICS[form.elements.topic.value] || "";
    var type = TYPES[form.elements.type.value] || "Belirtilmedi";
    var email = oneLine(form.elements.email.value) || "Belirtilmedi";
    var marketing = form.elements.marketing.checked ? "İstiyor" : "İstemiyor";
    return [
      "Kime: " + EMAIL,
      "Konu: QR Menu Official talebi — " + topic,
      "",
      "Ad: " + oneLine(form.elements.name.value),
      "İşletme: " + oneLine(form.elements.business.value),
      "Telefon: " + oneLine(form.elements.phone.value),
      "E-posta: " + email,
      "İşletme türü: " + type,
      "Konu: " + topic,
      "Talebi yanıtlama onayı: Evet",
      "Ürün duyurusu: " + marketing,
      "",
      "Mesaj:",
      messageText(form.elements.message.value)
    ].join("\n");
  }

  function mailtoUrl() {
    var topic = TOPICS[form.elements.topic.value] || "İletişim";
    var subject = "QR Menu Official talebi — " + topic;
    var body = draftText().split("\n").slice(2).join("\n").replace(/^\n/, "");
    return "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        if (document.execCommand("copy")) resolve();
        else reject();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  function renderStatus(mode, draft) {
    status.replaceChildren();
    var title = document.createElement("h3");
    title.id = "qrmo-contact-status-title";
    title.tabIndex = -1;
    title.textContent = mode === "mailto" ? "E-posta taslağı hazır" : "Taslağı kendiniz göndermeniz gerekiyor";

    var lead = document.createElement("p");
    lead.textContent = mode === "mailto"
      ? "E-posta uygulamanız açılmalıdır. İleti, siz gönderene kadar bize ulaşmaz. Uygulama açılmazsa metni kopyalayıp " + EMAIL + " adresine yazın."
      : "Bu metin e-posta bağlantısına sığmadı, bu yüzden uygulama açılmadı. Metni kopyalayıp " + EMAIL + " adresine yapıştırın.";

    var pre = document.createElement("pre");
    pre.className = "qrmo-contact-draft";
    pre.textContent = draft;

    var copy = document.createElement("button");
    copy.type = "button";
    copy.className = "qrmo-contact-copy";
    copy.textContent = "Metni kopyala";

    var note = document.createElement("p");
    note.className = "qrmo-contact-copy-note";
    note.setAttribute("aria-live", "polite");

    copy.addEventListener("click", function () {
      copyText(draft).then(function () {
        note.textContent = "Taslak metni kopyalandı.";
      }).catch(function () {
        note.textContent = "Kopyalanamadı. Metni seçip kopyalayın.";
      });
    });

    status.append(title, lead, pre, copy, note);
    window.setTimeout(function () { title.focus(); }, 0);
  }

  function release(delay) {
    window.setTimeout(function () {
      busy = false;
      if (!submitBtn) return;
      submitBtn.disabled = false;
      submitBtn.removeAttribute("aria-busy");
      submitBtn.textContent = tried ? "Taslağı yeniden hazırla" : defaultLabel;
    }, delay);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (busy) return;
    tried = true;
    var result = validate();
    if (result.count) {
      if (result.first) {
        var invalid = result.first;
        window.setTimeout(function () { invalid.focus(); }, 0);
      }
      return;
    }

    busy = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
      submitBtn.textContent = "Hazırlanıyor";
    }

    var draft = draftText();
    var url = mailtoUrl();
    form.setAttribute("data-draft-url", url);
    if (url.length > MAX_URL) {
      renderStatus("copy", draft);
      release(0);
      return;
    }

    renderStatus("mailto", draft);
    try {
      window.location.href = url;
    } catch (err) {
      renderStatus("copy", draft);
    }
    release(900);
  });

  form.addEventListener("input", function (event) {
    if (!tried) return;
    var target = event.target;
    if (!target || !target.id || !form.contains(target)) return;
    var match = rules().filter(function (item) { return item.el === target; })[0];
    if (match) setFieldError(match.el, match.message);
  });

  form.addEventListener("change", function (event) {
    if (!tried) return;
    var target = event.target;
    if (!target || target.type !== "checkbox") return;
    var match = rules().filter(function (item) { return item.el === target; })[0];
    if (match) setFieldError(match.el, match.message);
  });
})();
