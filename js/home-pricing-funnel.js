/* Ana sayfa — kompakt paket kartları (paketler/packages-data.js) */
(function () {
  "use strict";

  var root = document.getElementById("qrmo-home-pricing");
  if (!root || !window.QRMO_PRICING) return;

  var D = window.QRMO_PRICING;
  var mount = root.querySelector("[data-hp-mount='cards']");
  var periodNote = root.querySelector("[data-hp-mount='period-note']");
  if (!mount) return;

  var period = D.defaultPeriod === "annual" ? "annual" : "monthly";
  var fmt = new Intl.NumberFormat("tr-TR");

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") n.textContent = attrs[k];
        else if (k === "html") n.innerHTML = attrs[k];
        else n.setAttribute(k, attrs[k]);
      });
    }
    (kids || []).forEach(function (c) {
      if (c) n.appendChild(c);
    });
    return n;
  }

  function priceFor(pkg) {
    var amount = pkg.price[period];
    var freeMonths = D.annual.usedMonths - D.annual.payMonths;
    return {
      amount: fmt.format(amount),
      unit: D.currency + (period === "annual" ? " / yıl" : " / ay"),
      sub:
        period === "annual"
          ? fmt.format(pkg.price.monthly) +
            " " +
            D.currency +
            " × " +
            D.annual.payMonths +
            " ay · " +
            freeMonths +
            " ay ücretsiz"
          : ""
    };
  }

  function ctaBtn(pkg) {
    var href = D.cta.href || "";
    var label = pkg.ctaLabel || D.cta.finalLabel || "Görüşme Talep Edin";
    var cls =
      "qrmo-hp-btn qrmo-hp-btn--" + (pkg.variant === "featured" ? "primary" : pkg.variant === "dark" ? "on-dark" : "outline");
    if (href) {
      return el("a", { class: cls, href: href.replace("{id}", pkg.id) }, [el("span", { text: label })]);
    }
    var b = el("button", { class: cls, type: "button", "data-qrmo-cta": "primary" }, [el("span", { text: label })]);
    return b;
  }

  function render() {
    mount.replaceChildren();
    D.packages.forEach(function (pkg) {
      var p = priceFor(pkg);
      var card = el(
        "article",
        {
          class:
            "qrmo-hp-card qrmo-hp-card--" +
            (pkg.variant || "plain") +
            (pkg.variant === "featured" ? " is-recommended" : ""),
          id: "home-paket-" + pkg.id
        },
        [
          el("header", { class: "qrmo-hp-card-head" }, [
            pkg.variant === "featured"
              ? el("p", { class: "qrmo-hp-rec", text: "Önerilen" })
              : null,
            el("h3", { class: "qrmo-hp-name", text: pkg.name }),
            el("p", { class: "qrmo-hp-tag", text: pkg.tagline })
          ]),
          el("p", { class: "qrmo-hp-audience", text: pkg.audience }),
          el("div", { class: "qrmo-hp-price" }, [
            el("p", { class: "qrmo-hp-price-row" }, [
              el("span", { class: "qrmo-hp-amount", text: p.amount }),
              el("span", { class: "qrmo-hp-unit", text: p.unit })
            ]),
            p.sub ? el("p", { class: "qrmo-hp-price-sub", text: p.sub }) : null
          ]),
          ctaBtn(pkg)
        ]
      );
      mount.appendChild(card);
    });

    if (periodNote && D.annual) {
      periodNote.hidden = false;
      periodNote.textContent =
        "Yıllık ödeme: " +
        D.annual.usedMonths +
        " ay kullanım, " +
        D.annual.payMonths +
        " ay ödeme (detaylar paketler sayfasında).";
    }
  }

  render();
})();
