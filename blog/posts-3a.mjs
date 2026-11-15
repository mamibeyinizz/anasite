/* =========================================================
   BLOG — 3. PAKET (1/2). posts.mjs bu diziyi POSTS'a ekler.
   Konular seo/content-calendar.csv'den; kurallar posts.mjs başlığındakiyle aynı:
   kanıtsız oran/ciro vaadi yok, ürün iddiaları paketler/packages-data.js ile sınırlı.
========================================================= */

export const POSTS_3A = [
  /* ------------------------------------------------------------------ 16 */
  {
    slug: "qr-menu-programi-secimi",
    category: "qr-menu",
    date: "2026-11-05",
    readMin: 8,
    title: "QR Menü Programı Seçerken Sorulacak 12 Soru",
    seoTitle: "QR Menü Programı Nasıl Seçilir? Sorulacak 12 Soru",
    description:
      "En iyi QR menü programı hangisi? Kendi işletmenize uygun sistemi seçmek için güncelleme, mobil görünüm, çoklu dil, sipariş, veri ve destek üzerine 12 soru.",
    excerpt:
      "Her işletme için 'en iyi' QR menü programı farklıdır. Doğru seçimi listeler değil, sizin ihtiyacınıza göre sorduğunuz sorular belirler.",
    cover: "qr-menu-programi-secimi",
    coverAlt: "Kontrol listesi, onay işaretleri ve telefonda QR menü ekranını gösteren illüstrasyon",
    answer:
      "QR menü programı seçerken önce ihtiyacınızı netleştirin: yalnızca menü mü, yoksa sipariş ve garson çağrısı da mı gerekiyor? Ardından fiyatı kendiniz güncelleyip güncelleyemediğinizi, menünün telefonda nasıl göründüğünü, çoklu dil ve alerjen desteğini, verilerinizi dışa aktarıp aktaramadığınızı ve desteğin nasıl verildiğini sorun.",
    body: `
<h2 id="neden-sorular">Neden liste değil, sorular?</h2>
<p>"En iyi QR menü" listeleri genellikle tek bir ölçüte göre sıralanır ve sizin işletmenizi bilmez. Tek şubeli bir kafe ile yoğun bir restoranın ihtiyacı aynı değildir. Aşağıdaki sorular, teklif aldığınız her sisteme aynı şekilde sorabileceğiniz bir kontrol listesidir.</p>

<h2 id="ihtiyac">Önce ihtiyacınızı yazın</h2>
<p>Teklif istemeden önce üç soruyu kendinize sorun:</p>
<ul>
  <li><strong>Yalnızca menüyü mü dijitalleştirmek istiyorum,</strong> yoksa garson çağrısı ve masadan sipariş de mi gerekiyor?</li>
  <li><strong>Misafirlerim hangi dilleri konuşuyor?</strong></li>
  <li><strong>Menüm ne sıklıkla değişiyor?</strong> Fiyatlar her ay mı, yılda bir mi güncelleniyor?</li>
</ul>

<h2 id="yonetim">Yönetim ve güncelleme</h2>
<h3 id="soru-1">1. Fiyat ve ürünü kendim güncelleyebiliyor muyum?</h3>
<p>Her değişiklik için destek talebi açmak zorundaysanız, fiyatın güncel kalması bir başkasının hızına bağlı olur.</p>
<h3 id="soru-2">2. Toplu aktarma var mı?</h3>
<p>Yüzlerce ürününüz varsa, menüyü tek tek girmek yerine tablo (ör. CSV) ile yükleyebilmek ciddi zaman kazandırır.</p>
<h3 id="soru-3">3. Biten ürünü hızla kapatabiliyor muyum?</h3>
<p>Akşam servisinin ortasında tükenen bir ürünü menüden kaldırmak tek dokunuş sürmelidir.</p>

<h2 id="misafir">Misafir deneyimi</h2>
<h3 id="soru-4">4. Menü telefonda nasıl görünüyor?</h3>
<p>Demo menüyü kendi telefonunuzda, mobil veriyle ve dış mekânda açın. Yavaş açılan ya da küçük yazılı bir menü, misafirin ilk izlenimidir.</p>
<h3 id="soru-5">5. Arama ve filtre var mı?</h3>
<p>Uzun menülerde misafirin aradığını bulması için arama kutusu, alerjen ve vegan gibi filtreler önemlidir. Filtrelerin, ürünlere girdiğiniz bilgiye dayandığını unutmayın.</p>
<h3 id="soru-6">6. Çoklu dil nasıl çalışıyor?</h3>
<p>Çevirinin elle mi, dosyayla mı girildiğini sorun. Ayrıntısı için <a href="@/blog/turist-icin-cok-dilli-menu/">çok dilli menü rehberine</a> bakın.</p>
<h3 id="soru-7">7. Porsiyon, ekstra ve alerjen bilgisi tutulabiliyor mu?</h3>
<p>Bu bilgiler hem misafirin karar vermesine hem de siparişin doğru gitmesine yardımcı olur.</p>

<h2 id="servis">Servis</h2>
<h3 id="soru-8">8. Garson çağrısı ve sipariş hangi pakette?</h3>
<p>Bu özellikler bir servis ekranı gerektirir. Hangi pakette olduklarını ve talebin personele nasıl bildirildiğini sorun.</p>
<h3 id="soru-9">9. Sistem ödeme alıyor mu?</h3>
<p>Ödeme alan sistemlerde işlem başına komisyon olabilir; almayan sistemlerde ödeme sizin yönteminizle yapılır. İkisini karıştırmayın.</p>

<h2 id="veri">Veri ve süreklilik</h2>
<h3 id="soru-10">10. Menü verilerimi dışa aktarabilir miyim?</h3>
<p>Sistemi değiştirmek istediğinizde ürünlerinizi yeniden yazmak zorunda kalmamalısınız.</p>
<h3 id="soru-11">11. Neyi ölçebiliyorum?</h3>
<p>Menü görüntüleme, ürün tıklaması ya da misafirin aradığı kelimeler, menünüzü geliştirmek için veri sağlar. Bu verinin satış verisi olmadığını akılda tutun.</p>
<h3 id="soru-12">12. Destek nasıl verilir?</h3>
<p>Hangi kanaldan, hangi saatlerde ve kurulumda ne kadar yardım alacağınızı sorun.</p>

<h2 id="qr-menu-official">QR Menu Official bu sorulara ne cevap verir?</h2>
<ul>
  <li>Ürün ve fiyatı panelden kendiniz güncellersiniz; CSV ile toplu aktarma, porsiyon, ekstra, rozet ve tükendi işareti Temel paketten itibaren vardır.</li>
  <li>Çoklu dil, akıllı filtreleme ve masa bazlı QR kod Temel pakettedir. Çeviriler elle ya da CSV ile girilir.</li>
  <li>QR ile sipariş, garson çağrısı, hesap talebi ve servis paneli Pro paketten itibaren sunulur. Sistem ödeme almaz.</li>
  <li>Menü analitiği, yorum ve geri bildirim, maliyet ve menü mühendisliği Plus pakettedir.</li>
  <li>Taşıma aracıyla menü, ayarlar ve görseller başka bir siteye aktarılabilir.</li>
</ul>
<p>Fiyatlar ve karşılaştırma için <a href="@/blog/qr-menu-fiyatlari/">QR menü fiyatları yazısına</a> ve <a href="@/paketler/">paketler sayfasına</a> bakın.</p>

<div class="qb-cta-inline">
  <p><strong>Soruların cevabını kendi gözünüzle görün.</strong> Demo menüleri telefonunuzda açın.</p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "En iyi QR menü programı hangisi?", a: "Tek bir cevap yoktur. İşletmenizin yalnızca menüye mi yoksa sipariş ve garson çağrısına da mı ihtiyacı olduğuna, menünün ne sıklıkla değiştiğine ve misafirlerinizin dillerine göre değişir." },
      { q: "QR menü programında hangi özellikler olmalı?", a: "Fiyat ve ürünü kendinizin güncelleyebilmesi, telefonda iyi görünmesi, arama ve filtre, gerekiyorsa çoklu dil ve verilerinizi dışa aktarabilmeniz temel beklentilerdir." },
      { q: "QR menü programı sipariş de alır mı?", a: "Sisteme göre değişir. QR Menu Official'da QR ile sipariş Pro paketten itibaren vardır ve servis paneline düşer; sistem ödeme almaz." },
      { q: "Programı değiştirirsem menümü kaybeder miyim?", a: "Dışa aktarma desteği olan sistemlerde hayır. Teklif alırken verilerinizi dışa aktarıp aktaramayacağınızı mutlaka sorun." },
      { q: "Demo menüyü nasıl değerlendirmeliyim?", a: "Kendi telefonunuzda, mobil veriyle ve dış mekânda açın; ürün aramayı, filtreyi ve dil değiştirmeyi deneyin." }
    ],
    sources: [
      { label: "QR Menu Official — Paketler ve fiyatlar", url: "https://qrmenuofficial.com/paketler/" },
      { label: "QR Menu Official — Modüller", url: "https://qrmenuofficial.com/moduller/" }
    ],
    related: ["qr-menu-fiyatlari", "qr-menu-nedir", "ucretsiz-qr-menu"],
    products: [
      { label: "Paketler ve fiyatlar", path: "paketler/" },
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Servis Paneli modülü", path: "moduller/servis-paneli/" }
    ]
  },

  /* ------------------------------------------------------------------ 17 */
  {
    slug: "qr-ile-masadan-siparis",
    category: "servis",
    date: "2026-11-04",
    readMin: 7,
    title: "QR ile Masadan Sipariş: Nasıl Çalışır, Kime Uygun?",
    seoTitle: "QR ile Masadan Sipariş Sistemi: Nasıl Çalışır?",
    description:
      "QR kod ile masadan sipariş nasıl çalışır? Misafir, garson ve mutfak açısından akış, hangi işletmeye uygun olduğu ve geçiş öncesi dikkat edilmesi gerekenler.",
    excerpt:
      "Misafir masadaki kodu okutur, menüden seçer, sipariş verir. Kulağa basit geliyor; ama doğru kurulmazsa garsonun işini azaltacağına artırabilir.",
    cover: "qr-ile-masadan-siparis",
    coverAlt: "Telefonda sepet ekranı, masa numarası ve servis paneline giden sipariş kartını gösteren illüstrasyon",
    answer:
      "QR ile masadan siparişte misafir masadaki karekodu okutur, menüden ürün, porsiyon ve ekstraları seçer ve siparişi gönderir. Sipariş masa numarasıyla birlikte personelin ekranına düşer. Garsonun not alıp mutfağa taşıma işini azaltır; misafirle ilgilenmeyi ve servisi ortadan kaldırmaz.",
    body: `
<h2 id="akis">Masadan sipariş nasıl işler?</h2>
<ol>
  <li><strong>Misafir masadaki kodu okutur.</strong> Kod masaya özeldir; menü hangi masada açıldığını bilir.</li>
  <li><strong>Menüden seçer.</strong> Ürün, porsiyon ve ekstralar menüde tanımlandığı şekilde seçilir.</li>
  <li><strong>Siparişi gönderir.</strong> Sipariş yazılı olarak, masa numarasıyla gider.</li>
  <li><strong>Personel ekranda görür.</strong> Garson ya da mutfak siparişi panelde görür ve hazırlığa alır.</li>
  <li><strong>Servis ve hesap.</strong> Yemek masaya garsonla gelir; hesap işletmenin kendi yöntemiyle alınır.</li>
</ol>

<h2 id="kime-uygun">Kime uygun, kime değil?</h2>
<div class="qb-table-wrap"><table>
  <thead><tr><th>Uygun olduğu durumlar</th><th>Dikkat edilmesi gereken durumlar</th></tr></thead>
  <tbody>
    <tr><td>Masa sayısı garson sayısına göre fazla</td><td>Misafirle uzun sohbetin deneyimin parçası olduğu fine dining</td></tr>
    <tr><td>Hızlı servis, kafe, bahçe ve teras</td><td>Menüsü sürekli sözlü anlatılan, yazılı olmayan mekânlar</td></tr>
    <tr><td>Yabancı misafiri çok olan işletmeler</td><td>Mutfağın yazılı sipariş akışına hazır olmadığı yerler</td></tr>
  </tbody>
</table></div>
<p>Pek çok işletmede en iyi sonuç, iki yöntemin birlikte sunulmasıyla alınır: isteyen misafir telefondan sipariş verir, isteyen garsona söyler.</p>

<h2 id="faydalar">Kimin işi kolaylaşır?</h2>
<ul>
  <li><strong>Misafir:</strong> Garsonu beklemeden, kendi hızında ve kendi dilinde seçim yapar.</li>
  <li><strong>Garson:</strong> Not alma ve mutfağa taşıma yükü azalır; zamanını servise ve misafire ayırır.</li>
  <li><strong>Mutfak:</strong> Sipariş yazılı ve okunur gelir; ekstralar atlanmaz.</li>
</ul>
<p>Sipariş hatalarının nerelerden doğduğunu <a href="@/blog/restoran-siparis-hatalari/">sipariş hataları yazısında</a> ayrıntılı anlattık.</p>

<h2 id="hazirlik">Geçişten önce hazırlık</h2>
<ol>
  <li>Menüdeki her ürünün porsiyon ve ekstra seçeneklerini netleştirin.</li>
  <li>Masaları numaralandırıp her masaya kendi karekodunu koyun.</li>
  <li>Siparişin düşeceği ekranı (tablet, bilgisayar ya da telefon) belirleyin ve sesli uyarıyı açın.</li>
  <li>Garsonlara akışı anlatın: kim siparişi onaylar, kim mutfağa iletir?</li>
  <li>İlk günlerde masadaki misafire sistemi kısaca tanıtın.</li>
</ol>

<h2 id="guvenlik">Masada olmayan biri sipariş verebilir mi?</h2>
<p>Karekodun fotoğrafı çekilip paylaşılırsa, masada olmayan biri de menüyü açabilir. Bunu zorlaştırmak için siparişleri masaya bağlı, süresi sınırlı bir oturuma bağlamak gerekir. Ayrıntısı için <a href="@/blog/qr-menu-guvenligi/">QR menü güvenliği yazısına</a> bakın.</p>

<h2 id="qr-menu-official">QR Menu Official'da masadan sipariş</h2>
<p>QR ile sipariş Pro paketten itibaren vardır. Sipariş, masa bilgisiyle <a href="@/moduller/servis-paneli/">Servis Paneli</a>'ne düşer; panel sesli uyarı ve masaüstü bildirimi verebilir. Porsiyon ve ekstralar <a href="@/moduller/restoran-menu/">Restoran Menü</a> modülünde tanımladığınız seçeneklerden gelir. Siparişler imzalı ve süresi sınırlı bir masa oturumuna bağlanır. Sistem ödeme almaz.</p>

<div class="qb-cta-inline">
  <p><strong>Masadan siparişi kendi telefonunuzda deneyin.</strong></p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "QR ile sipariş için uygulama indirmek gerekir mi?", a: "Hayır. Misafir karekodu telefon kamerasıyla okutur, menü tarayıcıda açılır ve sipariş oradan verilir." },
      { q: "QR sipariş sistemi ödeme alır mı?", a: "Sisteme göre değişir. QR Menu Official ödeme almaz; sipariş servis paneline iletilir, hesap işletmenin kendi yöntemiyle alınır." },
      { q: "Misafir hem garsona hem telefona sipariş verebilir mi?", a: "Evet. Pek çok işletme iki yöntemi birlikte sunar; misafir hangisini isterse onu kullanır." },
      { q: "Sipariş mutfağa nasıl ulaşır?", a: "Sipariş, masa numarasıyla birlikte personelin izlediği servis paneline düşer. Mutfağa iletim işletmenin kendi düzenine göre yapılır." },
      { q: "Hangi pakette QR ile sipariş var?", a: "QR Menu Official'da QR ile sipariş ve servis paneli Pro paketten itibaren sunulur." }
    ],
    sources: [
      { label: "QR Menu Official — Servis Paneli modül sayfası", url: "https://qrmenuofficial.com/moduller/servis-paneli/" },
      { label: "QR Menu Official — Masa Oturum Güvenliği modül sayfası", url: "https://qrmenuofficial.com/moduller/masa-oturum-guvenligi/" }
    ],
    related: ["restoran-siparis-hatalari", "garson-cagirma-sistemi", "qr-menu-guvenligi"],
    products: [
      { label: "Servis Paneli modülü", path: "moduller/servis-paneli/" },
      { label: "QR Masa modülü", path: "moduller/qr-masa/" },
      { label: "Masa Oturum Güvenliği", path: "moduller/masa-oturum-guvenligi/" }
    ]
  },

  /* ------------------------------------------------------------------ 18 */
  {
    slug: "restoranda-ek-satis",
    category: "karlilik",
    date: "2026-11-03",
    readMin: 7,
    title: "Restoranda Ek Satış: Israrcı Olmadan Öneri Yapmanın Yolları",
    seoTitle: "Restoranda Ek Satış (Upselling): Israrsız Öneri Rehberi",
    description:
      "Restoranda ek satış nasıl yapılır? Garsonun doğru öneri cümleleri, menüde eşleştirme, porsiyon ve ekstra seçenekleri ile misafiri rahatsız etmeden önerinin yolları.",
    excerpt:
      "İyi bir öneri misafire yardım eder; kötü bir öneri satış baskısı gibi hissettirir. Aradaki fark, önerinin misafirin seçimine ne kadar uyduğudur.",
    cover: "restoranda-ek-satis",
    coverAlt: "Ana yemeğin yanında içecek ve tatlı önerisi kartlarını gösteren illüstrasyon",
    answer:
      "Restoranda ek satış, misafirin seçtiği ürüne uyan bir içecek, yan ürün, tatlı ya da daha büyük porsiyon önermektir. Israrsız ek satışın yolu, öneriyi misafirin seçimine göre kişiselleştirmek, tek ve net bir seçenek sunmak ve menüde bu eşleştirmeleri görünür kılmaktır.",
    body: `
<h2 id="tanim">Ek satış nedir, ne değildir?</h2>
<p>Ek satış (upselling), misafirin zaten vereceği siparişe bir şey eklemek ya da daha uygun bir seçeneğe yönlendirmektir: ızgaranın yanına bir içecek, tatlıya bir kahve, küçük porsiyon yerine paylaşımlık tabak. Amaç misafiri istemediği bir şeye ikna etmek değil, deneyimini tamamlayan bir seçeneği hatırlatmaktır.</p>

<h2 id="garson">Garson için öneri ilkeleri</h2>
<h3 id="kisisel">Öneriyi kişiselleştirin</h3>
<p>"Başka bir şey ister misiniz?" sorusu genellikle "hayır" ile biter. "Adana'nın yanına evde yaptığımız şalgam çok gider" ise misafirin seçimine dayanan somut bir öneridir.</p>
<h3 id="tek-secenek">Tek ve net seçenek sunun</h3>
<p>Beş farklı tatlı saymak karar vermeyi zorlaştırır. En uygun bir ya da iki seçeneği söylemek yeterlidir.</p>
<h3 id="zamanlama">Doğru anı seçin</h3>
<p>İçecek önerisi sipariş anında, tatlı ve kahve önerisi ana yemek bittiğinde yapılır. Yemek gelmeden tatlı önermek misafiri bunaltır.</p>
<h3 id="dogruluk">Bildiğinizi önerin</h3>
<p>Garsonun önerdiği ürünü tatmış olması, önerinin samimi görünmesini sağlar. Yeni ürünleri ekibe tattırmak bu yüzden önemlidir.</p>

<h2 id="menu">Menüde ek satışı görünür kılmak</h2>
<ul>
  <li><strong>Eşleştirme önerisi:</strong> Ürün açıklamasında "yanında ayran ile" gibi kısa bir öneri.</li>
  <li><strong>Porsiyon seçenekleri:</strong> Küçük ve büyük porsiyonu yan yana göstermek, misafirin büyük porsiyonu da düşünmesini sağlar.</li>
  <li><strong>Ekstralar:</strong> Ekstra peynir, sos ya da garnitür, misafire seçim özgürlüğü verir.</li>
  <li><strong>Kombo:</strong> Ana yemek, yan ürün ve içeceği bir arada sunmak. Ayrıntısı <a href="@/blog/kombo-menu/">kombo menü yazısında</a>.</li>
  <li><strong>Rozetler:</strong> "Şefin önerisi" gibi işaretler, misafirin gözünü belirli ürünlere yönlendirir.</li>
</ul>

<h2 id="neyi">Neyi önermeli?</h2>
<p>Ek satışın amacı yalnızca hesabı büyütmek değil, kârlı ürünleri öne çıkarmaktır. Hangi ürünün size gerçekten kazandırdığını bilmeden yapılan öneri, düşük kârlı bir ürünü satmanıza da yol açabilir. Bunun için ürün maliyetlerini bilmek gerekir: <a href="@/blog/recete-maliyeti-hesaplama/">reçete maliyeti</a> ve <a href="@/blog/menu-muhendisligi-nedir/">menü mühendisliği</a> yazılarına bakın.</p>

<h2 id="kacinin">Kaçınılması gerekenler</h2>
<ul>
  <li>Her masaya aynı ezber cümleyi söylemek.</li>
  <li>Misafir "hayır" dedikten sonra ısrar etmek.</li>
  <li>Fiyatı söylemeden pahalı bir seçenek önermek.</li>
  <li>Tükenmiş ya da hazırlanması uzun süren bir ürünü önermek.</li>
</ul>

<h2 id="qr-menu-official">QR Menu Official'da ilgili özellikler</h2>
<p>Porsiyon ve ekstra seçenekleri, ürün rozetleri ve kampanya ile kombo tanımları Temel paketten itibaren <a href="@/moduller/restoran-menu/">Restoran Menü</a> modülündedir. Menü önerileri bölümünde öne çıkarmak istediğiniz ürünleri seçebilirsiniz. Plus paketindeki <a href="@/moduller/menu-asistani/">Menü Asistanı</a>, misafirin sorusuna göre menüden ürün önerebilir; cevaplayamadığı soruları raporlar.</p>
`,
    faq: [
      { q: "Upselling ile cross-selling arasındaki fark nedir?", a: "Upselling daha büyük ya da daha üst bir seçeneğe yönlendirmektir (büyük porsiyon gibi). Cross-selling ise seçilen ürüne uyan başka bir ürün önermektir (yemeğin yanına içecek gibi). Günlük kullanımda ikisi de 'ek satış' olarak anılır." },
      { q: "Ek satış misafiri rahatsız eder mi?", a: "Ezber ve ısrarcı öneri eder. Misafirin seçimine uyan, tek ve net bir öneri genellikle yardım olarak algılanır." },
      { q: "Hangi ürünler önerilmeli?", a: "Misafirin seçimine uyan ve işletme için kârlı olan ürünler. Bunun için ürün maliyetlerini bilmek gerekir." },
      { q: "Dijital menü ek satışa yardımcı olur mu?", a: "Porsiyon, ekstra, kombo ve öneri rozetlerinin menüde görünür olması misafirin bu seçenekleri fark etmesini kolaylaştırır. Satışa etkisi işletmeden işletmeye değişir." },
      { q: "Garsonlara ek satış nasıl öğretilir?", a: "Ürünleri tattırmak, her ana yemek için bir eşleştirme önerisi belirlemek ve doğru zamanlamayı rol yaparak çalışmak etkili yöntemlerdir." }
    ],
    sources: [
      { label: "QR Menu Official — Restoran Menü modül sayfası", url: "https://qrmenuofficial.com/moduller/restoran-menu/" },
      { label: "QR Menu Official — Menü Asistanı modül sayfası", url: "https://qrmenuofficial.com/moduller/menu-asistani/" }
    ],
    related: ["kombo-menu", "menu-muhendisligi-nedir", "recete-maliyeti-hesaplama"],
    products: [
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Menü Asistanı modülü", path: "moduller/menu-asistani/" },
      { label: "Menü Mühendisliği modülü", path: "moduller/menu-muhendisligi/" }
    ]
  },

  /* ------------------------------------------------------------------ 19 */
  {
    slug: "recete-maliyeti-hesaplama",
    category: "karlilik",
    date: "2026-11-02",
    readMin: 8,
    title: "Reçete Maliyeti Nasıl Hesaplanır? Fire Payı Dahil Adım Adım",
    seoTitle: "Reçete Maliyeti ve Food Cost Hesaplama: Adım Adım",
    description:
      "Yemek maliyeti ve food cost nasıl hesaplanır? Reçete kartı, gramaj, fire payı, birim maliyet ve maliyet oranı hesabı için örnekli adım adım rehber.",
    excerpt:
      "Bir tabağın size kaça mal olduğunu bilmeden doğru fiyat koyamazsınız. Reçete maliyeti, menüdeki her kararın başlangıç noktasıdır.",
    cover: "recete-maliyeti-hesaplama",
    coverAlt: "Reçete kartı, terazi ve hesap makinesini gösteren illüstrasyon",
    answer:
      "Reçete maliyeti, bir porsiyonda kullanılan her malzemenin gramajının, fire payı eklenmiş birim fiyatıyla çarpılıp toplanmasıyla bulunur. Maliyet oranı (food cost) ise porsiyon maliyetinin vergisiz satış fiyatına bölünüp 100 ile çarpılmasıdır.",
    body: `
<h2 id="neden">Neden reçete maliyeti?</h2>
<p>Malzeme fiyatları değiştikçe aynı tabağın maliyeti de değişir. Reçete maliyetini bilmeyen bir işletme, fiyatını tahminle belirler; artan maliyeti fark ettiğinde kâr çoktan erimiş olabilir.</p>

<h2 id="recete-karti">1. Adım: Reçete kartı hazırlayın</h2>
<p>Her ürün için bir porsiyonda kullanılan bütün malzemeleri gramaj ya da adetle yazın. Garnitür, sos, yağ ve servis ekmeği de maliyetin parçasıdır.</p>

<h2 id="fire">2. Adım: Fire payını hesaplayın</h2>
<p>Satın aldığınız malzemenin tamamı tabağa girmez. Sebzenin kabuğu, etin sinir ve yağ kısmı, pişirme kaybı fire olarak düşer. Fire payını bulmak için malzemeyi temizleyip tartın:</p>
<p><strong>Kullanılabilir oran = Temizlenmiş ağırlık ÷ Satın alınan ağırlık</strong></p>
<p>Örneğin 1.000 g soğanın temizlendikten sonra 900 g kaldığını varsayalım. Kullanılabilir oran 0,90'dır. 1 kg soğana 40 TL ödüyorsanız, kullanılabilir soğanın kilogram maliyeti 40 ÷ 0,90 ≈ 44,4 TL olur.</p>
<p class="qb-note">Örnekteki rakamlar hesap yöntemini göstermek içindir; kendi alış fiyatlarınızı ve tartımlarınızı kullanın.</p>

<h2 id="hesap">3. Adım: Porsiyon maliyetini toplayın</h2>
<div class="qb-table-wrap"><table>
  <thead><tr><th>Malzeme</th><th>Porsiyondaki miktar</th><th>Fire sonrası birim maliyet</th><th>Tutar</th></tr></thead>
  <tbody>
    <tr><td>Kıyma</td><td>150 g</td><td>A TL / kg</td><td>0,150 × A</td></tr>
    <tr><td>Soğan</td><td>30 g</td><td>B TL / kg</td><td>0,030 × B</td></tr>
    <tr><td>Lavaş</td><td>1 adet</td><td>C TL / adet</td><td>C</td></tr>
    <tr><td>Garnitür ve sos</td><td>—</td><td>—</td><td>D</td></tr>
    <tr><td colspan="3"><strong>Porsiyon maliyeti</strong></td><td><strong>Toplam</strong></td></tr>
  </tbody>
</table></div>

<h2 id="oran">4. Adım: Maliyet oranını bulun</h2>
<p><strong>Maliyet oranı (%) = Porsiyon maliyeti ÷ Vergisiz satış fiyatı × 100</strong></p>
<p>Bu oran, satış fiyatının ne kadarının malzemeye gittiğini gösterir. Hangi oranın uygun olduğu, işletmenizin kira, personel ve enerji gibi diğer giderlerine bağlıdır; başka bir işletmenin oranını doğrudan kopyalamak yanıltıcı olabilir.</p>

<h2 id="guncelleme">5. Adım: Düzenli güncelleyin</h2>
<p>Reçete maliyeti bir kez hesaplanıp unutulacak bir rakam değildir. Malzeme fiyatı değiştiğinde ya da tedarikçi değiştirdiğinizde ilgili ürünlerin maliyetini yeniden hesaplayın. Fiyat artışını menüye nasıl yansıtacağınızı <a href="@/blog/restoran-fiyat-artisi-menuye-nasil-yansitilir/">fiyat artışı rehberinde</a> anlattık.</p>

<h2 id="hatalar">Sık yapılan hatalar</h2>
<ul>
  <li>Fire payını hesaba katmamak.</li>
  <li>Sos, yağ, baharat ve servis ekmeğini maliyete eklememek.</li>
  <li>Porsiyonu ölçmeden, göz kararı servis etmek.</li>
  <li>Eski alış fiyatlarıyla hesap yapmak.</li>
  <li>KDV dahil satış fiyatıyla oran hesaplamak.</li>
</ul>

<h2 id="qr-menu-official">QR Menu Official'da maliyet ve reçete</h2>
<p>Plus paketindeki <a href="@/moduller/menu-muhendisligi/">Maliyet ve Reçete</a> ekranında malzeme fiyatlarını ve ürün reçetelerini girersiniz; sistem ürün maliyetini sizin verinizle hesaplar ve menü mühendisliği raporunda kullanır. Maliyet bilgisi girilmeden otomatik hesap yapılmaz.</p>
`,
    faq: [
      { q: "Food cost nedir?", a: "Food cost (yemek maliyeti oranı), bir porsiyonun malzeme maliyetinin vergisiz satış fiyatına oranıdır. Porsiyon maliyeti ÷ satış fiyatı × 100 ile hesaplanır." },
      { q: "Fire payı nasıl hesaplanır?", a: "Malzemeyi temizleyip tartın ve temizlenmiş ağırlığı satın alınan ağırlığa bölün. Birim fiyatı bu orana böldüğünüzde kullanılabilir malzemenin gerçek birim maliyetini bulursunuz." },
      { q: "İdeal maliyet oranı kaçtır?", a: "Tek bir doğru oran yoktur. Uygun oran işletmenin kira, personel ve diğer giderlerine bağlıdır; başka işletmelerin oranını doğrudan uygulamak yanıltıcı olabilir." },
      { q: "Reçete maliyeti ne sıklıkla güncellenmeli?", a: "Malzeme fiyatı ya da tedarikçi değiştiğinde. Fiyatların sık değiştiği dönemlerde düzenli kontrol önerilir." },
      { q: "QR Menu Official maliyeti otomatik hesaplar mı?", a: "Plus paketindeki maliyet ve reçete ekranı, girdiğiniz malzeme fiyatları ve reçetelerle maliyeti hesaplar. Veri girilmeden maliyet üretmez." }
    ],
    sources: [
      { label: "QR Menu Official — Menü Mühendisliği modül sayfası", url: "https://qrmenuofficial.com/moduller/menu-muhendisligi/" },
      { label: "Gelir İdaresi Başkanlığı — KDV", url: "https://www.gib.gov.tr/" }
    ],
    related: ["menu-fiyatlandirma", "menu-muhendisligi-nedir", "restoran-fiyat-artisi-menuye-nasil-yansitilir"],
    products: [
      { label: "Menü Mühendisliği (maliyet ve reçete)", path: "moduller/menu-muhendisligi/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  },

  /* ------------------------------------------------------------------ 20 */
  {
    slug: "menu-fiyatlandirma",
    category: "karlilik",
    date: "2026-11-01",
    readMin: 7,
    title: "Menü Fiyatlandırma Yöntemleri: Restoran Fiyatı Nasıl Belirlenir?",
    seoTitle: "Menü Fiyatlandırma: Restoranda Fiyat Nasıl Belirlenir?",
    description:
      "Restoran menüsünde fiyat nasıl belirlenir? Maliyet artı, katkı payı, rakip ve değer bazlı fiyatlandırma yöntemleri ile menüde fiyat gösterimi için rehber.",
    excerpt:
      "Fiyatı yalnızca maliyete bakarak koyarsanız değeri, yalnızca rakibe bakarak koyarsanız kârı kaçırabilirsiniz. Doğru fiyat, birkaç yöntemin birlikte kullanılmasıyla bulunur.",
    cover: "menu-fiyatlandirma",
    coverAlt: "Fiyat etiketleri, terazi ve menü kartını gösteren illüstrasyon",
    answer:
      "Menü fiyatı belirlenirken önce reçete maliyeti hesaplanır, ardından ürünün işletmeye bırakması gereken katkı, benzer işletmelerin fiyatları ve misafirin ürüne biçtiği değer birlikte değerlendirilir. Tek bir yönteme dayanmak yerine maliyeti taban, değeri tavan kabul etmek daha sağlıklıdır.",
    body: `
<h2 id="taban">Önce tabanı bilin: maliyet</h2>
<p>Hangi yöntemi seçerseniz seçin, ürünün size kaça mal olduğunu bilmeden fiyat koyamazsınız. Hesabın nasıl yapıldığını <a href="@/blog/recete-maliyeti-hesaplama/">reçete maliyeti rehberinde</a> anlattık.</p>

<h2 id="yontemler">Dört temel yöntem</h2>
<h3 id="maliyet-arti">1. Maliyet artı yöntemi</h3>
<p>Porsiyon maliyetine sabit bir çarpan ya da hedef maliyet oranı uygulanır. Uygulaması kolaydır ve her ürünün maliyetini karşılar. Zayıf yanı, misafirin ürüne biçtiği değeri hesaba katmamasıdır: ucuz malzemeli ama çok sevilen bir ürün gereğinden düşük, pahalı malzemeli bir ürün ise satılamayacak kadar yüksek fiyatlanabilir.</p>
<h3 id="katki">2. Katkı payı yöntemi</h3>
<p>Her ürünün, maliyeti çıktıktan sonra işletmeye bıraktığı tutara (katkı payı) odaklanılır. Yüzde yerine tutara bakmak, pahalı malzemeli ürünlerin düşük oranlı ama yüksek tutarlı katkı bırakabileceğini gösterir. <a href="@/blog/menu-muhendisligi-nedir/">Menü mühendisliği</a> bu yöntemi satış adediyle birleştirir.</p>
<h3 id="rakip">3. Rakip bazlı yöntem</h3>
<p>Çevrenizdeki benzer işletmelerin fiyatlarına bakılır. Misafirin beklentisini anlamak için faydalıdır; ama rakibin maliyet yapısını bilmeden onun fiyatını kopyalamak riskli olabilir.</p>
<h3 id="deger">4. Değer bazlı yöntem</h3>
<p>Misafirin ürüne biçtiği değer esas alınır: imza yemekleri, özel sunumlar ya da yerel olarak bilinen lezzetler. Değer, maliyetin çok üstünde bir fiyatı haklı kılabilir; bunun için ürünün gerçekten farklı olması gerekir.</p>

<h2 id="birlikte">Yöntemleri birlikte kullanmak</h2>
<ol>
  <li>Maliyeti hesaplayın; bu, altına inmemeniz gereken tabandır.</li>
  <li>Benzer işletmelerin fiyat aralığına bakın; bu, misafirin beklentisidir.</li>
  <li>Ürünün sizdeki farkını değerlendirin; bu, aralığın neresinde durabileceğinizi belirler.</li>
  <li>Satış adedini ve katkı payını izleyip fiyatı zamanla düzeltin.</li>
</ol>

<h2 id="gosterim">Fiyatı menüde nasıl gösterirsiniz?</h2>
<ul>
  <li>Fiyatı net ve okunur yazın; misafirin fiyatı aramak zorunda kalması güven sarsar.</li>
  <li>Kampanyalı fiyatlarda eski ve yeni fiyatı açıkça ayırın.</li>
  <li>Porsiyon seçeneklerinin fiyatlarını yan yana gösterin.</li>
  <li>Fiyat listesinin Fiyat Etiketi Yönetmeliği'ne uygun olduğundan emin olun. Bkz. <a href="@/blog/karekod-fiyat-listesi-yonetmeligi/">karekodla fiyat listesi rehberi</a>.</li>
</ul>
<p>Menüde fiyat gösterimine dair tasarım ilkelerini <a href="@/blog/restoran-menu-tasarimi/">menü tasarımı yazısında</a> ele aldık.</p>

<h2 id="qr-menu-official">QR Menu Official'da ilgili özellikler</h2>
<p>Fiyat, porsiyon ve kampanyalı fiyat Temel paketten itibaren panelden güncellenir. Plus paketindeki <a href="@/moduller/menu-muhendisligi/">Menü Mühendisliği</a>, girdiğiniz maliyetlerle her ürünün katkı payını ve popülerliğini birlikte gösterir.</p>
`,
    faq: [
      { q: "Menü fiyatı nasıl hesaplanır?", a: "Önce porsiyon maliyeti hesaplanır. Ardından hedef katkı, benzer işletmelerin fiyatları ve ürünün misafir için değeri birlikte değerlendirilerek fiyat belirlenir." },
      { q: "Maliyetin kaç katı fiyat konmalı?", a: "Sabit bir çarpan her işletme için doğru değildir. Uygun çarpan, işletmenin diğer giderlerine ve ürünün değerine bağlıdır." },
      { q: "Rakibin fiyatını kopyalamak doğru mu?", a: "Misafirin beklentisini anlamak için rakip fiyatlarına bakmak faydalıdır; ama rakibin maliyet yapısını bilmeden fiyatını kopyalamak kârı riske atabilir." },
      { q: "Katkı payı nedir?", a: "Satış fiyatından ürün maliyetinin çıkarılmasıyla kalan tutardır; ürünün işletmenin diğer giderlerine ve kârına ne kadar katkı bıraktığını gösterir." },
      { q: "Fiyatlar ne sıklıkla gözden geçirilmeli?", a: "Maliyetler değiştiğinde ve satış verisi biriktiğinde. Düzenli küçük güncellemeler, uzun aralıklı büyük zamlardan daha az fark edilir." }
    ],
    sources: [
      { label: "T.C. Ticaret Bakanlığı — Fiyat etiketinde yeni dönem başlıyor", url: "https://ticaret.gov.tr/haberler/fiyat-etiketinde-yeni-donem-basliyor" },
      { label: "QR Menu Official — Menü Mühendisliği modül sayfası", url: "https://qrmenuofficial.com/moduller/menu-muhendisligi/" }
    ],
    related: ["recete-maliyeti-hesaplama", "menu-muhendisligi-nedir", "restoran-fiyat-artisi-menuye-nasil-yansitilir"],
    products: [
      { label: "Menü Mühendisliği modülü", path: "moduller/menu-muhendisligi/" },
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  }
];
