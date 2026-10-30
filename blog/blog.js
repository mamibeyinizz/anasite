/* /blog/ — kategori filtresi (JS yoksa tüm yazılar görünür) */
(function () {
  var btns = document.querySelectorAll(".qb-cat");
  var featured = document.querySelector(".qb-featured .qb-card");
  var cards = document.querySelectorAll("[data-qb-grid] .qb-card");
  var empty = document.querySelector("[data-qb-empty]");
  if (!btns.length) return;
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter");
      btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      var shown = 0;
      cards.forEach(function (c) {
        var ok = f === "all" || c.getAttribute("data-cat") === f;
        c.hidden = !ok;
        if (ok) shown++;
      });
      if (featured) featured.hidden = !(f === "all" || featured.getAttribute("data-cat") === f);
      if (empty) empty.hidden = shown > 0;
    });
  });
})();
