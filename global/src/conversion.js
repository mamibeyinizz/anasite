/* Pending conversion CTA — href yokken dürüst geri bildirim (sahte yönlendirme yok). */
(function () {
  "use strict";

  var cfg = window.QRMO_CONVERSION || {};
  var notices = cfg.pending || {};

  function noticeFor(slot) {
    if (slot && notices[slot]) return notices[slot];
    return notices.default || "Bu bağlantı henüz etkin değil.";
  }

  function noteHost(btn) {
    return (
      btn.closest(
        ".qrmo-hero-v3-cta-group,.qrmo-transition-v1__action,.qrmo-final-cta-v1__action,.qrmo-gf-cta,.qrmo-gh-drawer-bottom,.qrmo-gh-in"
      ) || btn.parentElement
    );
  }

  function showPending(btn, slot) {
    var host = noteHost(btn);
    if (!host) return;
    var n = host.querySelector(".qrmo-cta-note");
    if (!n) {
      n = document.createElement("p");
      n.className = "qrmo-cta-note";
      n.setAttribute("role", "status");
      host.appendChild(n);
    }
    n.textContent = noticeFor(slot);
  }

  function isPendingButton(el) {
    if (!el || el.tagName !== "BUTTON") return false;
    if (el.hasAttribute("data-qrmo-cta") || el.getAttribute("data-cta-target") === "TBD") {
      return true;
    }
    return el.classList.contains("qrmo-hero-v3-cta");
  }

  document.addEventListener("click", function (e) {
    var btn =
      e.target.closest("[data-qrmo-cta]") ||
      e.target.closest('[data-cta-target="TBD"]') ||
      e.target.closest("button.qrmo-hero-v3-cta");
    if (!btn || !isPendingButton(btn)) return;
    if (btn.tagName === "A") return;

    e.preventDefault();
    var slot = btn.getAttribute("data-qrmo-cta");
    if (!slot && btn.closest(".qrmo-final-cta-v1")) slot = "final";
    else if (!slot && btn.closest(".qrmo-transition-v1")) slot = "transition";
    else if (!slot) slot = "primary";
    showPending(btn, slot);
  });
})();
