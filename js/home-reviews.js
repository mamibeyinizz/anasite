/* Müşteri yorumları — veri + render + kaydırıcı.
   KURAL: Yalnızca `verified: true` olan yorumlar canlıda görünür.
   Hiçbiri doğrulanmamışsa bölüm gizli kalır. Taslak yorumları görmek için
   adrese ?yorum-onizleme=1 ekleyin (kartlar "ÖRNEK" etiketi taşır). */
(function () {
  "use strict";

  var REVIEWS = [
    { name: "Elif T.", role: "Kafe sahibi", place: "İstanbul", module: "Servis paneli", verified: false,
      text: "Yoğun saatlerde artık kimse el kaldırıp garson aramıyor. Çağrı masa numarasıyla panele düşüyor, ekip kimin nereye gideceğini bakmadan biliyor." },
    { name: "Murat A.", role: "Restoran müdürü", place: "Antalya", module: "Çoklu dil", verified: false,
      text: "Yabancı misafir menüyü kendi dilinde açınca sormaya gerek kalmıyor. Garsonlarımız çeviri yapmak yerine siparişle ilgileniyor." },
    { name: "Zeynep K.", role: "Aile restoranı sahibi", place: "İzmir", module: "Menü Asistanı", verified: false,
      text: "“İçinde fıstık var mı?” sorusunu günde kaç kez cevapladığımızı saymıyorduk bile. Şimdi müşteri asistana soruyor, cevabı menüdeki bilgiden alıyor." },
    { name: "Hakan Y.", role: "Pastane işletmecisi", place: "Ankara", module: "Ürün yönetimi", verified: false,
      text: "Fiyat değişince menüyü yeniden bastırmak zorunda değiliz. Panelden güncelliyorum, masadaki QR aynı kalıyor. Bitti dediğimiz ürünü de işaretliyoruz." },
    { name: "Selin D.", role: "Otel F&B müdürü", place: "Bodrum", module: "QR masalar", verified: false,
      text: "Masaları toplu oluşturup QR kodlarını PDF olarak aldık. Baskıya göndermek ve masalara yerleştirmek beklediğimizden çok daha düzenli ilerledi." },
    { name: "Burak Ç.", role: "Kebap salonu sahibi", place: "Gaziantep", module: "Akıllı filtre", verified: false,
      text: "Müşteri acılı, acısız ya da alerjene göre süzüp ne istediğine kendisi ulaşıyor. Menüde dolaşıp bize soran sayısı belirgin şekilde azaldı." },
    { name: "Ayşe N.", role: "Şube müdürü", place: "Bursa", module: "İstatistikler", verified: false,
      text: "En çok hangi ürünün incelendiğini görmek bizim için yeni bir şeydi. Öne çıkarmak istediğimiz ürünleri artık tahminle değil bakarak seçiyoruz." },
    { name: "Emre S.", role: "Sahil kafesi sahibi", place: "Çeşme", module: "Garson çağırma", verified: false,
      text: "Plajda masalar dağınık, garsonun her yeri aynı anda görmesi imkânsız. Masadan çağrı gelince telefona bildirim düşüyor, iş çok rahatladı." },
    { name: "Gamze B.", role: "Servis sorumlusu", place: "Eskişehir", module: "Servis paneli", verified: false,
      text: "Hesap isteyen masa artık unutulmuyor. Talepler tek ekranda sıralı duruyor, hangisinin bekleyip hangisinin tamamlandığı net görünüyor." },
    { name: "Kemal Ö.", role: "Restoran sahibi", place: "Trabzon", module: "Kurulum", verified: false,
      text: "Eklentiyi kurup menüyü girmek düşündüğümüzden kısa sürdü. Ekibe ayrıca eğitim vermemiz gerekmedi, servis ekranını ilk günden kullandılar." }
  ];

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

  track.innerHTML = list.map(function (r) {
    return '<figure class="qrmo-rv__card" role="listitem">' +
      (r.verified ? "" : '<span class="qrmo-rv__sample">ÖRNEK</span>') +
      '<svg class="qrmo-rv__mark" viewBox="0 0 32 24" aria-hidden="true"><path d="M0 24V14.4C0 6.2 4.6 1.2 12 0l1.2 3.6C8.6 5 6.6 7.6 6.4 11H13v13H0Zm19 0V14.4C19 6.2 23.6 1.2 31 0l1 3.6c-4.4 1.4-6.4 4-6.6 7.4H32v13H19Z" fill="currentColor"/></svg>' +
      '<blockquote class="qrmo-rv__quote"><p>' + esc(r.text) + "</p></blockquote>" +
      '<figcaption class="qrmo-rv__who">' +
        '<span class="qrmo-rv__avatar" aria-hidden="true">' + esc(r.name.charAt(0)) + "</span>" +
        '<span class="qrmo-rv__meta"><strong>' + esc(r.name) + "</strong><small>" + esc(r.role) + " · " + esc(r.place) + "</small></span>" +
        '<span class="qrmo-rv__tag">' + esc(r.module) + "</span>" +
      "</figcaption></figure>";
  }).join("");

  section.hidden = false;

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
    if (count) count.textContent = (idx < 10 ? "0" : "") + idx + " / " + (cards.length < 10 ? "0" : "") + cards.length;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max - 2;
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
