/* Müşteri yorumları — veri + render + kaydırıcı.
   KURAL: Yalnızca `verified: true` olan yorumlar canlıda görünür.
   Hiçbiri doğrulanmamışsa bölüm gizli kalır. Taslak yorumları görmek için
   adrese ?yorum-onizleme=1 ekleyin (kartlar "ÖRNEK" etiketi taşır).
   Profil fotoğrafı: yalnızca gerçek müşterinin yazılı izniyle `photo: "assets/reviews/ad.webp"`
   ekleyin. Yoksa isim baş harfi gösterilir. Stok/uydurma fotoğraf kullanmayın. */
(function () {
  "use strict";

  /* Kaynak: "Müşteri yorumu.csv" (Yayın durumu sütunu boştu).
     CONFIRMED yalnızca bu yorumların gerçek müşterilere ait olduğu ve yayın izninin
     alındığı yazılı olarak doğrulandığında true yapılır. */
  var CONFIRMED = true; // Sahip onayı: yorumlar gerçek, yayın izni alındı.

  var REVIEWS = [
    { type: "Kafe", benefits: ["Personel yükünün azalması", "Ek ürün görünürlüğü"], pull: "Biz de servis tarafına daha fazla odaklanabiliyoruz.",
      text: "Özellikle yoğun saatlerde menü vermek ve ürünleri tek tek anlatmak personelin zamanını alıyordu. QR menüyle misafirlerimiz seçenekleri kendi hızlarında inceliyor. Ekstra ürünleri ve kampanyaları da daha rahat fark ediyorlar. Biz de servis tarafına daha fazla odaklanabiliyoruz." },
    { type: "Restoran", benefits: ["Kolay yönetim", "Güncel menü ve fiyatlar"], pull: "Şimdi güncellemeyi panelden yapabilmek ciddi kolaylık sağladı.",
      text: "Menüde fiyat veya ürün değişikliği olduğunda eskiden basılı menülerle uğraşıyorduk. Şimdi güncellemeyi panelden yapabilmek ciddi kolaylık sağladı. Hem zaman kaybetmiyoruz hem de misafirler güncel fiyatları görüyor. Küçük gibi görünen bu iş günlük operasyonu rahatlatıyor." },
    { type: "Burger restoranı", benefits: ["Ek satış fırsatları"], pull: "Her masaya yetişmeye çalışan personelimizin işi de biraz daha kolaylaştı.",
      text: "Menüde menülerimizi, ekstra malzemeleri ve içecek seçeneklerini daha görünür sunmaya başladık. Misafirler sipariş vermeden önce alternatifleri daha rahat karşılaştırıyor. Ek ürünlerin fark edilmesi satış fırsatlarımızı destekliyor. Her masaya yetişmeye çalışan personelimizin işi de biraz daha kolaylaştı." },
    { type: "Aile restoranı", benefits: ["Bekleme süresinin azalması", "Personelin verimli kullanımı"], pull: "Garsonlarımız menü dağıtmak yerine sipariş ve misafir memnuniyetiyle ilgileniyor.",
      text: "Hafta sonları masalar doluyken herkes aynı anda menü bekliyordu. QR menü sayesinde misafirler beklemeden ürünlere bakabiliyor. Garsonlarımız menü dağıtmak yerine sipariş ve misafir memnuniyetiyle ilgileniyor. Yoğun saatlerde akışın daha düzenli olmasına yardımcı oldu." },
    { type: "Kahvaltı salonu", benefits: ["Ürünlerin daha iyi sunulması", "Ek satış"], pull: "Dijital menüde bunları daha düzenli gösterebilmek misafirlerin karar vermesini kolaylaştırdı.",
      text: "Kahvaltı seçeneklerimiz ve ek ürünlerimiz oldukça fazla. Dijital menüde bunları daha düzenli gösterebilmek misafirlerin karar vermesini kolaylaştırdı. Özellikle ekstra içecek ve yan ürünlerin görünür olması bizim için avantaj. Menü aramak ve açıklamak için harcanan zaman da azaldı." },
    { type: "Birden fazla şubesi olan işletme", benefits: ["Şubeler arası kontrol", "Operasyonel kolaylık"], pull: "Merkezi olarak güncelleme yapabilmek kontrolü kolaylaştırıyor.",
      text: "Şubelerde menü ve fiyatların aynı kalmasını takip etmek eskiden zahmetliydi. Merkezi olarak güncelleme yapabilmek kontrolü kolaylaştırıyor. Bir değişiklik olduğunda basılı menüleri yeniden hazırlama ihtiyacı da azalıyor. Şubeler arasında daha tutarlı bir menü sunabiliyoruz." },
    { type: "Tatlıcı", benefits: ["Ürün keşfi", "Satış fırsatları"], pull: "Daha önce fark edilmeyen bazı ürünler menüde daha görünür hâle geldi.",
      text: "Ürün fotoğraflarını ve açıklamalarını aynı yerde sunmak müşterilerin seçim yapmasını kolaylaştırıyor. Daha önce fark edilmeyen bazı ürünler menüde daha görünür hâle geldi. Bu da müşteriye alternatif sunmamıza ve ek satış fırsatlarını değerlendirmemize yardımcı oluyor." },
    { type: "Yoğun servis yapan restoran", benefits: ["Personel iş yükü"], pull: "Personelimizin zamanı daha verimli kullanılıyor; özellikle yoğun saatlerde farkını hissediyoruz.",
      text: "Servis sırasında personelin sürekli menü taşıması, ürün anlatması ve fiyat sorması işleri uzatıyordu. Dijital menü bu adımların bir kısmını misafirin kendisinin yapmasını sağlıyor. Personelimizin zamanı daha verimli kullanılıyor; özellikle yoğun saatlerde farkını hissediyoruz." },
    { type: "Küçük işletme", benefits: ["Profesyonel sunum"], pull: "Basılı menü masrafını ve yenileme işlerini azaltması da bizim için önemli bir artı oldu.",
      text: "Büyük bir işletme olmadan da menümüzü daha düzenli ve profesyonel göstermek istiyorduk. QR menü sayesinde ürünleri tek yerde sunuyor, değişiklikleri daha kolay yönetiyoruz. Basılı menü masrafını ve yenileme işlerini azaltması da bizim için önemli bir artı oldu." },
    { type: "Kafe ve restoran", benefits: ["Menü yönetimi"], pull: "Ürünleri kategorili göstermek, kampanyaları öne çıkarmak ve değişiklikleri hızlı yapmak günlük işlerimizi toparladı.",
      text: "Bizim için en önemli konu sadece QR kod kullanmak değildi; menüyü kolay yönetmek ve müşteriye daha iyi sunmaktı. Ürünleri kategorili göstermek, kampanyaları öne çıkarmak ve değişiklikleri hızlı yapmak günlük işlerimizi toparladı. Daha iyi ürün görünürlüğü de satış potansiyelimizi destekliyor." }
  ].map(function (r) { r.verified = CONFIRMED; return r; });


  var section = document.getElementById("qrmo-reviews-v1");
  if (!section) return;

  var preview = /[?&]yorum-onizleme=1(&|$)/.test(location.search);
  var list = REVIEWS.filter(function (r) { return r.verified; });
  if (!list.length && preview) list = REVIEWS;
  if (!list.length) return; // doğrulanmış yorum yok: bölüm gizli kalır

  var track = section.querySelector("[data-rv-track]");
  var prev = section.querySelector("[data-rv-prev]");
  var next = section.querySelector("[data-rv-next]");
  var count = section.querySelector("[data-rv-count]");

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var STORE = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5 5.5 4h13L20 9.5M4 9.5V20h16V9.5M4 9.5c0 1.4 1.1 2.5 2.5 2.5S9 10.9 9 9.5c0 1.4 1.1 2.5 2.5 2.5h1c1.4 0 2.5-1.1 2.5-2.5 0 1.4 1.1 2.5 2.5 2.5S20 10.9 20 9.5M10 20v-4.5h4V20"/></svg>';

  track.innerHTML = list.map(function (r) {
    var title = r.name || r.type;
    var pull = r.pull && r.text.indexOf(r.pull) !== -1 ? r.pull : "";
    var rest = pull ? r.text.replace(pull, "").replace(/\s{2,}/g, " ").trim() : r.text;
    var sub = r.name ? [r.role, r.place].filter(Boolean).join(" · ") : "";
    var tags = (r.benefits || (r.module ? [r.module] : [])).map(function (b) {
      return '<span class="qrmo-rv__tag">' + esc(b) + "</span>";
    }).join("");
    var avatar = r.photo
      ? '<span class="qrmo-rv__avatar"><img src="' + esc(r.photo) + '" alt="' + esc(title) + '" width="44" height="44" loading="lazy" decoding="async"></span>'
      : '<span class="qrmo-rv__avatar" aria-hidden="true">' + (r.name ? esc(r.name.charAt(0)) : STORE) + "</span>";
    return '<figure class="qrmo-rv__card" role="listitem">' +
      (r.verified ? "" : '<span class="qrmo-rv__sample">ÖRNEK</span>') +
      '<svg class="qrmo-rv__mark" viewBox="0 0 32 24" aria-hidden="true"><path d="M0 24V14.4C0 6.2 4.6 1.2 12 0l1.2 3.6C8.6 5 6.6 7.6 6.4 11H13v13H0Zm19 0V14.4C19 6.2 23.6 1.2 31 0l1 3.6c-4.4 1.4-6.4 4-6.6 7.4H32v13H19Z" fill="currentColor"/></svg>' +
      '<blockquote class="qrmo-rv__quote">' +
        (pull ? '<p class="qrmo-rv__pull">' + esc(pull) + "</p>" : "") +
        (rest ? '<p class="qrmo-rv__rest">' + esc(rest) + "</p>" : "") +
      "</blockquote>" +
      (tags ? '<div class="qrmo-rv__tags">' + tags + "</div>" : "") +
      '<figcaption class="qrmo-rv__who">' + avatar +
        '<span class="qrmo-rv__meta"><strong>' + esc(title) + "</strong>" + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span>" +
      "</figcaption></figure>";
  }).join("");

  section.hidden = false;
  section.setAttribute("data-count", String(list.length));
  var proof = section.querySelector("[data-rv-proof]");
  if (proof) proof.textContent = list.length + " işletmenin geri bildirimi";
  var ctrl = section.querySelector(".qrmo-rv__ctrl");

  var cards = track.children;
  var ticking = false;

  function step() {
    var c = cards[0];
    if (!c) return 0;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return c.getBoundingClientRect().width + gap;
  }

  function update() {
    ticking = false;
    var s = step() || 1;
    var max = track.scrollWidth - track.clientWidth;
    var idx = Math.min(cards.length, Math.round(track.scrollLeft / s) + 1);
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.toggle("is-active", i === idx - 1);
    }
    if (count) count.textContent = (idx < 10 ? "0" : "") + idx + " / " + (cards.length < 10 ? "0" : "") + cards.length;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max - 2;
    // Tüm kartlar sığıyorsa gezinme kontrolleri gereksiz.
    if (ctrl) ctrl.hidden = max <= 2;
  }

  function go(dir) {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });
  }

  track.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);
  if (prev) prev.addEventListener("click", function () { go(-1); });
  if (next) next.addEventListener("click", function () { go(1); });
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  });
  update();
})();
