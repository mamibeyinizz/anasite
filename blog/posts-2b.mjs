/* =========================================================
   BLOG — 2. PAKET (2/2). posts.mjs bu diziyi POSTS'a ekler.
   Kurallar posts.mjs başlığındakiyle aynıdır: kanıtsız oran/ciro vaadi yok,
   ürün iddiaları paketler/packages-data.js ile sınırlı.
========================================================= */

export const POSTS_2B = [
  /* ------------------------------------------------------------------ 11 */
  {
    slug: "restoran-menude-alerjen-bilgisi",
    category: "mevzuat",
    date: "2026-11-10",
    readMin: 8,
    title: "Restoran Menüsünde Alerjen Bilgisi: Neden Önemli, Nasıl Gösterilir?",
    seoTitle: "Menüde Alerjen Bilgisi Nasıl Gösterilir? Restoran Rehberi",
    description:
      "Restoran ve kafe menüsünde alerjen bilgisi nasıl gösterilir? 14 temel alerjen, mutfakta çapraz bulaşma, garsonun rolü ve dijital menüde alerjen filtresi.",
    excerpt:
      "Gıda alerjisi olan bir misafir için yanlış bilgi verilmiş bir tabak ciddi bir sağlık sorunudur. Alerjen bilgisini menüde açıkça göstermek hem misafiri hem işletmeyi korur.",
    cover: "restoran-menude-alerjen-bilgisi",
    coverAlt: "Menü kartında buğday, süt, yumurta ve fıstık simgelerini gösteren illüstrasyon",
    answer:
      "Alerjen bilgisi, her ürünün hangi alerjenleri içerdiğinin menüde yazı ve simgeyle gösterilmesidir. Bilgi mutfakla birlikte reçeteden doğrulanmalı, çapraz bulaşma riski belirtilmeli ve garsonlar bu bilgiye hâkim olmalıdır. Dijital menüde alerjen tanımlandığında misafir, istemediği alerjeni içeren ürünleri filtreleyebilir.",
    body: `
<p class="qb-note">Bu yazı genel bilgilendirme amaçlıdır; tıbbi ya da hukuki görüş değildir. İşletmeniz için güncel yükümlülükleri Tarım ve Orman Bakanlığı'nın ve Resmî Gazete'nin güncel metinlerinden doğrulayın.</p>

<h2 id="neden">Alerjen bilgisi neden bu kadar önemli?</h2>
<p>Gıda alerjisi olan biri için tek bir yanlış bilgi, hafif bir rahatsızlıktan ciddi bir sağlık sorununa kadar sonuç doğurabilir. Misafir çoğu zaman garsona sorar; garson mutfağa sorar; mutfaktaki kişi de reçeteyi ezberden hatırlamaya çalışır. Zincirin herhangi bir halkasındaki hata misafire yansır.</p>
<p>Menüde yazılı ve doğrulanmış alerjen bilgisi bu zinciri kısaltır: misafir bilgiyi kendisi okur, garson aynı bilgiye bakar, mutfak bilgiyi bir kez doğru girer.</p>

<h2 id="mevzuat">Mevzuat ne diyor?</h2>
<p>Türkiye'de gıda bilgilerinin tüketiciye sunulması, Türk Gıda Kodeksi kapsamındaki etiketleme ve tüketiciyi bilgilendirme yönetmeliğiyle düzenlenir. Bu düzenleme alerjen bilgisini önemli bilgiler arasında sayar ve ambalajsız sunulan gıdalar için de tüketicinin bilgilendirilmesini öngörür. Avrupa Birliği'nde aynı konu 1169/2011 sayılı tüketiciyi gıda konusunda bilgilendirme tüzüğüyle düzenlenir ve 14 alerjen grubunu listeler.</p>
<p>Ayrıntılar ve işletmenize düşen somut yükümlülük zaman içinde değişebileceği için, güncel metni resmî kaynaklardan kontrol etmenizi öneririz.</p>

<h2 id="14-alerjen">14 temel alerjen grubu</h2>
<p>AB tüzüğünün ekinde sayılan ve Türk mevzuatında da esas alınan alerjen grupları şunlardır:</p>
<div class="qb-table-wrap"><table>
  <thead><tr><th>Alerjen</th><th>Menüde sık görüldüğü yerler</th></tr></thead>
  <tbody>
    <tr><td>Gluten içeren tahıllar (buğday, arpa, çavdar, yulaf)</td><td>Ekmek, makarna, börek, pane, sos kıvamlaştırıcı</td></tr>
    <tr><td>Süt ve süt ürünleri</td><td>Peynir, tereyağı, krema, yoğurt, tatlılar</td></tr>
    <tr><td>Yumurta</td><td>Hamur işleri, mayonez, pane harcı, tatlılar</td></tr>
    <tr><td>Yer fıstığı</td><td>Soslar, tatlılar, kavrulmuş garnitür</td></tr>
    <tr><td>Sert kabuklu yemişler (fındık, ceviz, badem, antep fıstığı vb.)</td><td>Baklava, kadayıf, salata, pesto</td></tr>
    <tr><td>Susam</td><td>Simit, tahin, humus, hamburger ekmeği</td></tr>
    <tr><td>Balık</td><td>Balık yemekleri, bazı soslar</td></tr>
    <tr><td>Kabuklular (karides, yengeç)</td><td>Deniz ürünleri, makarna</td></tr>
    <tr><td>Yumuşakçalar (midye, kalamar)</td><td>Midye dolma, kalamar tava</td></tr>
    <tr><td>Soya</td><td>Soslar, hazır karışımlar</td></tr>
    <tr><td>Kereviz</td><td>Çorbalar, et suyu, salata</td></tr>
    <tr><td>Hardal</td><td>Soslar, marinasyon, sandviç</td></tr>
    <tr><td>Sülfitler</td><td>Kuru meyve, şarap, sirke</td></tr>
    <tr><td>Acı bakla (lupin)</td><td>Bazı unlar ve hamur işleri</td></tr>
  </tbody>
</table></div>

<h2 id="mutfak">Bilgiyi mutfakta doğru toplamak</h2>
<ol>
  <li><strong>Reçeteden çalışın.</strong> Her ürünün bütün malzemelerini, soslar ve garnitürler dahil, yazılı hale getirin.</li>
  <li><strong>Hazır ürünlerin etiketine bakın.</strong> Satın aldığınız sos, baharat karışımı ya da hamurun etiketinde alerjen bilgisi yazar.</li>
  <li><strong>Çapraz bulaşmayı belirtin.</strong> Aynı fritözde pane ürün ve patates kızartılıyorsa, patatesin "gluten izi içerebilir" olarak belirtilmesi dürüst olandır.</li>
  <li><strong>Değişiklikleri güncelleyin.</strong> Tedarikçi ya da reçete değiştiğinde alerjen bilgisi de değişebilir.</li>
</ol>

<h2 id="gosterim">Menüde nasıl gösterilmeli?</h2>
<ul>
  <li><strong>Simge ve yazı birlikte.</strong> Yalnızca simge kullanmak, simgeyi bilmeyen misafir için yetersizdir.</li>
  <li><strong>Her ürünün yanında.</strong> Menünün sonundaki genel bir dipnot ("ürünlerimiz alerjen içerebilir") misafire hangi ürünün güvenli olduğunu söylemez.</li>
  <li><strong>Misafirin dilinde.</strong> Turist misafir için alerjen bilgisi de çevrilmelidir. Bkz. <a href="@/blog/turist-icin-cok-dilli-menu/">çok dilli menü rehberi</a>.</li>
  <li><strong>"Glutensiz" gibi iddialarda dikkat.</strong> Çapraz bulaşma riski varsa bir ürünü kesin dille "glutensiz" diye sunmak yanıltıcı olabilir.</li>
</ul>

<h2 id="dijital">Dijital menüde alerjen filtresi</h2>
<p>Basılı menüde alerjen bilgisini her ürünün altına sığdırmak zordur. Dijital menüde ürün detayında alerjenler simgeleriyle gösterilebilir; misafir de istemediği alerjeni seçip o alerjeni içeren ürünleri listeden çıkarabilir.</p>
<p>QR Menu Official'da alerjen tanımları ve <a href="@/moduller/akilli-filtreleme/">Akıllı Filtreleme</a> Temel paketten itibaren vardır. Filtre, yalnızca ürünlere girdiğiniz alerjen bilgisine dayanır; sistem bir ürünün içeriğini kendisi tahmin etmez. Misafir menüde "glutensiz" ya da "sütsüz" gibi bir arama yaptığında da, o alerjen tanımlıysa onu içermeyen ürünler listelenir.</p>

<h2 id="garson">Garsonun rolü</h2>
<p>Yazılı bilgi garsonun yerini tutmaz. Alerjisini söyleyen misafiri mutfağa bildirmek, emin olunmayan bir soruda "kontrol edip geliyorum" demek ve tahminle cevap vermemek, ekibin her üyesinin bilmesi gereken kurallardır.</p>

<div class="qb-cta-inline">
  <p><strong>Alerjen filtresinin telefonda nasıl çalıştığını görün.</strong> Demo menüde filtre panelini açın.</p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Restoranlarda alerjen bilgisi vermek zorunlu mu?", a: "Türk Gıda Kodeksi kapsamındaki tüketiciyi bilgilendirme düzenlemesi alerjen bilgisini önemli bilgiler arasında sayar. İşletmenize düşen güncel yükümlülüğü Tarım ve Orman Bakanlığı ve Resmî Gazete kaynaklarından doğrulayın." },
      { q: "Kaç tane temel alerjen vardır?", a: "AB'nin 1169/2011 sayılı tüzüğü 14 alerjen grubunu sayar: gluten içeren tahıllar, kabuklular, yumurta, balık, yer fıstığı, soya, süt, sert kabuklu yemişler, kereviz, hardal, susam, sülfitler, acı bakla ve yumuşakçalar." },
      { q: "Menünün sonuna genel bir alerjen uyarısı yazmak yeterli mi?", a: "Genel bir uyarı, misafire hangi ürünün hangi alerjeni içerdiğini söylemez. Bilgiyi ürün bazında göstermek daha güvenli ve kullanışlıdır." },
      { q: "Çapraz bulaşma menüde belirtilmeli mi?", a: "Aynı ekipmanda hazırlanan ürünlerde alerjen izi kalma riski varsa bunu belirtmek dürüst olandır. Bu durumda ürünü kesin dille 'alerjensiz' diye sunmaktan kaçının." },
      { q: "Dijital menü alerjenleri otomatik algılar mı?", a: "Hayır. QR Menu Official'da alerjen filtresi, ürünlere girdiğiniz alerjen bilgisine dayanır. Doğru filtre için bilginin mutfakla birlikte doğru girilmesi gerekir." }
    ],
    sources: [
      { label: "EUR-Lex — (AB) 1169/2011 sayılı tüketiciyi gıda konusunda bilgilendirme tüzüğü", url: "https://eur-lex.europa.eu/eli/reg/2011/1169/oj" },
      { label: "T.C. Tarım ve Orman Bakanlığı", url: "https://www.tarimorman.gov.tr/" },
      { label: "Mevzuat Bilgi Sistemi", url: "https://www.mevzuat.gov.tr/" }
    ],
    related: ["turist-icin-cok-dilli-menu", "dijital-menu-nasil-hazirlanir", "karekod-fiyat-listesi-yonetmeligi"],
    products: [
      { label: "Akıllı Filtreleme modülü", path: "moduller/akilli-filtreleme/" },
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Çoklu Dil modülü", path: "moduller/coklu-dil/" }
    ]
  },

  /* ------------------------------------------------------------------ 12 */
  {
    slug: "menude-olmayan-urun-aramalari",
    category: "karlilik",
    date: "2026-11-09",
    readMin: 7,
    title: "Menüde Olmayan Ürünü Arayan Müşteri: Arama Verisiyle Menü Nasıl Geliştirilir?",
    seoTitle: "Müşteri Menüde Ne Arıyor? Arama Verisiyle Menü Geliştirme",
    description:
      "Misafirler dijital menüde neyi arıyor ve bulamıyor? Bulunamayan arama verisini okumak, menüye ürün eklemek ya da adlandırmayı düzeltmek için pratik rehber.",
    excerpt:
      "Misafir menüde 'limonata' yazıp sonuç alamıyorsa iki ihtimal vardır: ya bu ürün yok, ya da sizde başka bir adla duruyor. İkisi de bilmeniz gereken bir şeydir.",
    cover: "menude-olmayan-urun-aramalari",
    coverAlt: "Menü arama kutusu, büyüteç ve bulunamayan arama listesini gösteren illüstrasyon",
    answer:
      "Dijital menüde misafirlerin arayıp bulamadığı kelimeler, menünüzdeki eksiklerin ve adlandırma sorunlarının doğrudan göstergesidir. Bu listeyi düzenli okuyun: sık aranan bir ürün yoksa eklemeyi değerlendirin, varsa ama farklı adla duruyorsa ürün adını ya da açıklamasını misafirin kullandığı kelimeye göre düzeltin.",
    body: `
<h2 id="neden">Basılı menüde göremediğiniz bir veri</h2>
<p>Basılı menüde misafirin aklından ne geçtiğini bilemezsiniz. Garsona "milkshake var mı?" diye soran misafir, "yok" cevabını alır ve konu orada kapanır. Kimse bunu not etmez; aynı soru haftada kaç kez sorulduğu bilinmez.</p>
<p>Dijital menüde arama kutusu olduğunda bu sorular yazılı hale gelir. Misafir aradığı şeyi kendisi yazar; sonuç çıkmadıysa, bu bir kayıttır.</p>

<h2 id="ne-anlatir">Bulunamayan aramalar size ne anlatır?</h2>
<h3 id="eksik-urun">Gerçekten eksik bir ürün</h3>
<p>Aynı kelime düzenli olarak aranıyor ve menünüzde karşılığı yoksa, misafirleriniz bu ürünü bekliyor demektir. Bu, menüye eklemeyi değerlendirmek için somut bir başlangıç noktasıdır.</p>
<h3 id="farkli-ad">Var ama farklı adla duran ürün</h3>
<p>Misafir "kola" arıyor, menüde ürün marka adıyla duruyor; misafir "sufle" arıyor, menüde "çikolatalı volkan" yazıyor. Ürün var ama bulunamıyor. Bu durumda ürün adını değiştirmek ya da açıklamaya misafirin kullandığı kelimeyi eklemek yeterlidir.</p>
<h3 id="kategori">Beklenen bir kategori</h3>
<p>"Vegan", "çocuk menüsü", "glutensiz" gibi aramalar tek bir üründen çok bir ihtiyacı gösterir. Bu ürünler sizde varsa etiket ya da filtre bilgisini eksiksiz girmek, yoksa küçük bir seçki oluşturmak düşünülebilir.</p>
<h3 id="yazim">Yazım farkları</h3>
<p>"Kahvalti", "lahmacun", "laktozsuz" gibi aramalar Türkçe karakter kullanmadan ya da farklı yazımla gelir. İyi bir arama bu farkları tolere etmelidir; tolere etmiyorsa kaybettiğiniz aramaları da bu listede görürsünüz.</p>

<h2 id="nasil-okunur">Listeyi nasıl okumalı?</h2>
<ol>
  <li><strong>Tek seferlik aramalara takılmayın.</strong> Bir kez aranan bir kelime karar için yeterli değildir; tekrar eden aramalara bakın.</li>
  <li><strong>Dönem seçin.</strong> Haftalık ya da aylık bakmak, sezon etkisini görmenizi sağlar. Yazın soğuk içecek, kışın sıcak tatlı aramaları artabilir.</li>
  <li><strong>Garsonlara danışın.</strong> Arama listesindeki kelimeleri garsonların masada duydukları sorularla karşılaştırın.</li>
  <li><strong>Değişikliği yapıp tekrar bakın.</strong> Bir ürünün adını değiştirdiyseniz, sonraki dönemde o kelimenin listeden düşüp düşmediğini kontrol edin.</li>
</ol>

<h2 id="karar">Ürün eklemeden önce düşünülmesi gerekenler</h2>
<p>Çok aranan bir ürünü menüye eklemek her zaman doğru karar değildir. Mutfağınızda bu ürünü yapabilecek ekipman ve malzeme var mı? Ürünün maliyeti ve satış fiyatı kârlı bir aralığa düşüyor mu? Mevcut bir ürünü yavaşlatır mı? Bu soruların cevabı için <a href="@/blog/menu-muhendisligi-nedir/">menü mühendisliği</a> yaklaşımı yardımcı olur.</p>

<h2 id="qr-menu-official">QR Menu Official'da bulunamayan aramalar</h2>
<p>QR Menu Official'ın Plus paketindeki <a href="@/moduller/qr-analytics/">Menü Analitiği</a>, misafirlerin menüde arayıp sonuç alamadığı kelimeleri "Menüde Bulunamayan Aramalar" listesinde gösterir. Misafir kelimeyi harf harf yazarken oluşan ara aramalar tek bir arama olarak birleştirilir; liste, seçtiğiniz dönemde her kelimenin kaç kez arandığını verir.</p>
<p>Menü araması ürün adı ve açıklamasının yanında kategori adlarında, tanımlıysa malzeme ve alerjen adlarında ve seçilen dildeki çevirilerde de arar; "100 tl altı" gibi fiyat ifadelerini fiyat aralığına çevirir. Bu yüzden listede kalan kelimeler, menünüzde gerçekten karşılığı olmayan ya da misafirin bulamadığı ürünlerdir.</p>
<p class="qb-note">Arama verisi bir ilgi göstergesidir, satış verisi değildir. Bir ürünün çok aranması, menüye eklendiğinde aynı oranda satacağı anlamına gelmez.</p>

<div class="qb-cta-inline">
  <p><strong>Menü analitiği Plus pakette.</strong> Paketlerin içeriğini karşılaştırın.</p>
  <a class="qb-btn" href="@/paketler/">Paketleri İncele <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Bulunamayan arama ne demek?", a: "Misafirin dijital menüdeki arama kutusuna yazdığı ve hiçbir ürünle eşleşmeyen kelimedir. Menüde eksik bir ürünü ya da yanlış adlandırılmış bir ürünü gösterebilir." },
      { q: "Çok aranan her ürünü menüye eklemeli miyim?", a: "Hayır. Arama ilgi göstergesidir; ekipman, maliyet ve kârlılık açısından değerlendirmeden ürün eklemek doğru olmayabilir." },
      { q: "Misafir Türkçe karakter kullanmadan ararsa ürün bulunur mu?", a: "QR Menu Official'ın menü araması 'ı' ve 'i' gibi farkları tolere eder; örneğin 'kahvalti' araması 'Kahvaltı' ürünlerini bulur." },
      { q: "Bulunamayan aramalar kişisel veri içerir mi?", a: "Liste, aranan kelimeleri ve sayılarını gösterir. Misafirin adı ya da iletişim bilgisi tutulmaz." },
      { q: "Hangi pakette bulunamayan aramalar listesi var?", a: "QR Menu Official'da Menü Analitiği ve bulunamayan aramalar listesi Plus pakette sunulur." }
    ],
    sources: [
      { label: "QR Menu Official — Menü Analitiği modül sayfası", url: "https://qrmenuofficial.com/moduller/qr-analytics/" },
      { label: "QR Menu Official — Akıllı Filtreleme modül sayfası", url: "https://qrmenuofficial.com/moduller/akilli-filtreleme/" }
    ],
    related: ["menu-muhendisligi-nedir", "restoran-fiyat-artisi-menuye-nasil-yansitilir", "dijital-menu-nasil-hazirlanir"],
    products: [
      { label: "Menü Analitiği modülü", path: "moduller/qr-analytics/" },
      { label: "Menü Mühendisliği modülü", path: "moduller/menu-muhendisligi/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  },

  /* ------------------------------------------------------------------ 13 */
  {
    slug: "restoran-siparis-hatalari",
    category: "servis",
    date: "2026-11-08",
    readMin: 7,
    title: "Restoranlarda Sipariş Hataları Neden Olur ve Nasıl Azaltılır?",
    seoTitle: "Restoran Sipariş Hataları: Nedenleri ve Çözüm Yolları",
    description:
      "Yanlış giden sipariş, unutulan ekstra, karışan masa: restoranda sipariş hatalarının nedenleri ve el yazısı, sözlü iletim ile yoğun saat sorunlarına pratik çözümler.",
    excerpt:
      "Yanlış giden bir tabak, mutfakta boşa giden malzeme, bekleyen bir misafir ve özür dileyen bir garson demektir. Hataların çoğu birkaç tekrar eden noktadan doğar.",
    cover: "restoran-siparis-hatalari",
    coverAlt: "Mutfak fişi, karışmış sipariş notları ve düzenli sipariş ekranını gösteren illüstrasyon",
    answer:
      "Restoranda sipariş hataları çoğunlukla dört noktada doğar: misafirle garson arasındaki yanlış anlaşılma, okunmayan ya da eksik not, mutfağa sözlü iletim ve masa karışıklığı. Siparişi yazılı, masa numaralı ve ekstralarıyla birlikte mutfağa ileten bir akış bu noktaların çoğunu azaltır.",
    body: `
<h2 id="maliyet">Bir sipariş hatasının gerçek maliyeti</h2>
<p>Yanlış giden bir tabağın maliyeti yalnızca yeniden yapılan yemek değildir. Mutfakta zaman kaybedilir, misafir bekler, garson özür diler ve aynı süre içinde diğer masalar ihmal edilir. Yoğun bir akşamda birkaç hata, bütün servisin ritmini bozabilir.</p>

<h2 id="nedenler">Hatalar nereden doğar?</h2>
<h3 id="anlasma">Yanlış anlaşılma</h3>
<p>Gürültülü bir salonda "az acılı" ile "acısız" karışabilir; misafir "patates yerine salata" derken garson bunu not etmeyi unutabilir. Özellikle porsiyon, pişirme derecesi ve ekstra tercihleri yanlış anlaşılmaya açıktır.</p>
<h3 id="not">Okunmayan ya da eksik not</h3>
<p>Aceleyle yazılmış bir sipariş fişi, mutfakta farklı okunabilir. Kısaltmalar kişiden kişiye değişir; yeni bir aşçı ya da garson bu kısaltmaları bilmeyebilir.</p>
<h3 id="sozlu">Sözlü iletim</h3>
<p>Siparişin mutfağa bağırarak ya da kapıdan söylenerek iletilmesi, yoğun saatte bilginin kaybolmasına yol açar. Kimin neyi duyduğu belli olmaz.</p>
<h3 id="masa">Masa karışıklığı</h3>
<p>Benzer siparişler veren iki masa, birleştirilen masalar ya da yer değiştiren misafirler, tabağın yanlış masaya gitmesine neden olabilir.</p>
<h3 id="menu">Menüdeki belirsizlik</h3>
<p>Porsiyonu, yanında ne geldiği ya da hangi ekstraların seçilebileceği menüde açık değilse, bu belirsizlik siparişe de taşınır.</p>

<h2 id="cozumler">Hataları azaltmanın yolları</h2>
<h3 id="tekrar">Siparişi tekrar edin</h3>
<p>Garsonun siparişi alırken özellikle ekstra ve tercihleri misafire tekrar okuması basit ama etkili bir alışkanlıktır.</p>
<h3 id="standart">Kısaltmaları standart hale getirin</h3>
<p>Fişte kullanılan kısaltmaları yazılı bir listeye dönüştürüp mutfağa ve salona asın. Yeni personel ilk gün bu listeyi öğrenir.</p>
<h3 id="yazili">Siparişi yazılı ve masa numaralı iletin</h3>
<p>Siparişin mutfağa yazılı, masa numarasıyla ve ekstralarıyla birlikte ulaşması, sözlü iletimin hatalarını ortadan kaldırır. Bu bir fiş yazıcısı, bir ekran ya da masadan verilen dijital sipariş olabilir.</p>
<h3 id="menu-net">Menüyü netleştirin</h3>
<p>Porsiyon seçeneklerini, yanında gelenleri ve seçilebilir ekstraları menüde açıkça yazın. Misafir neyi seçtiğini net görürse, siparişi de net verir.</p>

<h2 id="qr-siparis">Masadan QR ile sipariş</h2>
<p>Misafirin siparişi masadaki karekodla açılan menüden kendisinin vermesi, yanlış anlaşılma ve okunmayan not kaynaklı hataların önemli bir kısmını ortadan kaldırır: misafir porsiyonu ve ekstrayı kendisi seçer, sipariş yazılı ve masa numarasıyla gelir.</p>
<p>QR Menu Official'da QR ile sipariş Pro paketten itibaren vardır. Sipariş, masa bilgisiyle birlikte <a href="@/moduller/servis-paneli/">Servis Paneli</a>'ne düşer; porsiyon ve ekstralar <a href="@/moduller/restoran-menu/">Restoran Menü</a> modülünde tanımladığınız seçeneklerden gelir. Masaya ait olmayan birinin o masa adına sipariş vermesini zorlaştırmak için siparişler imzalı ve süresi sınırlı bir masa oturumuna bağlanır.</p>
<p class="qb-note">Masadan sipariş, garsonun masaya gitmesini ortadan kaldırmaz. Misafirin sorusu, önerisi ya da özel bir isteği için garson hâlâ oradadır.</p>

<h2 id="olcum">Hataları kaydedin</h2>
<p>Hangi hatanın ne sıklıkla olduğunu bilmeden çözüm bulmak zordur. Bir ay boyunca geri dönen her tabağı kısa bir notla kaydedin: ne oldu, hangi masa, hangi saat, nedeni neydi. Bu liste, en çok hangi noktaya odaklanmanız gerektiğini gösterir.</p>

<div class="qb-cta-inline">
  <p><strong>Masadan siparişin servis panelinde nasıl göründüğünü görün.</strong> Pro ve Plus demo menülerini açın.</p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Restoranda en sık sipariş hatası nedir?", a: "Genellikle ekstra ve tercihlerin (pişirme derecesi, çıkarılacak malzeme, garnitür değişimi) yanlış anlaşılması ya da not edilmemesidir." },
      { q: "Sipariş fişi yerine ekran kullanmak hataları azaltır mı?", a: "Siparişin yazılı ve masa numarasıyla iletilmesi, sözlü iletim ve okunmayan not kaynaklı hataları azaltır. Fiş yazıcısı da ekran da bu amaca hizmet eder." },
      { q: "QR ile sipariş verince garsona gerek kalmaz mı?", a: "Kalır. QR sipariş, notu taşıma ve yanlış anlaşılma kısmını azaltır; misafirle ilgilenme ve servis garsonun işidir." },
      { q: "Masada oturmayan biri QR ile sipariş verebilir mi?", a: "QR Menu Official'da siparişler imzalı ve süresi sınırlı bir masa oturumuna bağlanır; bu, masaya ait olmayan siparişleri zorlaştırır. Mutlak bir güvenlik iddiası değildir." },
      { q: "Hangi pakette QR ile sipariş var?", a: "QR Menu Official'da QR ile sipariş ve servis paneli Pro paketten itibaren sunulur." }
    ],
    sources: [
      { label: "QR Menu Official — Servis Paneli modül sayfası", url: "https://qrmenuofficial.com/moduller/servis-paneli/" },
      { label: "QR Menu Official — Masa Oturum Güvenliği modül sayfası", url: "https://qrmenuofficial.com/moduller/masa-oturum-guvenligi/" }
    ],
    related: ["garson-eksikligi-az-personelle-servis", "garson-cagirma-sistemi", "dijital-menu-nasil-hazirlanir"],
    products: [
      { label: "Servis Paneli modülü", path: "moduller/servis-paneli/" },
      { label: "Masa Oturum Güvenliği", path: "moduller/masa-oturum-guvenligi/" },
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" }
    ]
  },

  /* ------------------------------------------------------------------ 14 */
  {
    slug: "restoran-menu-tasarimi",
    category: "qr-menu",
    date: "2026-11-07",
    readMin: 8,
    title: "Restoran Menü Tasarımı: Telefonda Okunan ve Seçimi Kolaylaştıran Menü İçin İlkeler",
    seoTitle: "Restoran Menü Tasarımı: Mobil Menü İçin 10 İlke",
    description:
      "İyi bir restoran menüsü nasıl tasarlanır? Kategori sırası, ürün açıklaması, fotoğraf, fiyat gösterimi ve telefonda okunabilirlik için uygulanabilir ilkeler.",
    excerpt:
      "Menü, misafirin elindeki ilk satış aracıdır. Karışık, uzun ve okunmayan bir menü misafiri en tanıdık ürüne iter; düzenli bir menü ise seçmeyi kolaylaştırır.",
    cover: "restoran-menu-tasarimi",
    coverAlt: "Telefon ekranında kategori sekmeleri, ürün fotoğrafları ve fiyatlarla düzenlenmiş menüyü gösteren illüstrasyon",
    answer:
      "İyi bir restoran menüsü az sayıda net kategoriden oluşur, her üründe kısa ve somut bir açıklama ile gerçek bir fotoğraf taşır, fiyatı okunur şekilde gösterir ve telefonda tek elle rahatça kaydırılır. Tasarımın amacı süs değil, misafirin aradığını hızla bulup karar vermesidir.",
    body: `
<h2 id="amac">Menü tasarımının asıl amacı</h2>
<p>Menü bir broşür değil, bir karar aracıdır. Misafir masaya oturduğunda birkaç dakika içinde ne yiyeceğine karar vermek ister. Menü bu kararı kolaylaştırıyorsa iyi tasarlanmıştır; uzatıyorsa, ne kadar şık görünürse görünsün işini yapmıyordur.</p>
<p>Bugün misafirlerin önemli bir kısmı menüye telefonla bakıyor. Bu yüzden aşağıdaki ilkeler, basılı menünün yanında mobil menü için de geçerlidir.</p>

<h2 id="ilkeler">10 ilke</h2>
<h3 id="ilke-1">1. Kategorileri azaltın ve mantıklı sıralayın</h3>
<p>Misafirin yemek yeme sırasını izleyin: başlangıçlar, ana yemekler, tatlılar, içecekler. Çok fazla kategori, misafiri sekmeler arasında kaybettirir. Benzer kategorileri birleştirmek çoğu zaman daha iyidir.</p>
<h3 id="ilke-2">2. Ürün adını tutarlı yazın</h3>
<p>Büyük-küçük harf, kısaltma ve marka adı kullanımında tutarlı olun. "tatlı", "TATLILAR" ve "Tatlılar" aynı menüde dağınık bir izlenim bırakır.</p>
<h3 id="ilke-3">3. Açıklamayı kısa ve somut tutun</h3>
<p>Ana malzeme, pişirme yöntemi ve yanında gelen. "Şefin özel lezzeti" gibi ifadeler bilgi vermez; "Odun ateşinde pişmiş kuzu şiş, közlenmiş biber ve bulgur pilavı ile" verir.</p>
<h3 id="ilke-4">4. Gerçek ve tutarlı fotoğraf kullanın</h3>
<p>Fotoğraf, misafirin önüne gelecek tabağı göstermelidir. Aynı ışıkta, aynı açıdan ve aynı arka planla çekilmiş fotoğraflar menüye düzen verir. Stok fotoğraf, misafiri yanlış beklentiye sokar.</p>
<h3 id="ilke-5">5. Fiyatı okunur gösterin</h3>
<p>Fiyat, ürün adıyla aynı satırda ya da hemen altında, net bir yazı tipiyle durmalıdır. Kampanyalı fiyatlarda eski ve yeni fiyatın açıkça ayrılması gerekir.</p>
<h3 id="ilke-6">6. Seçenekleri görünür kılın</h3>
<p>Porsiyon, ekstra ve değişim seçenekleri menüde yazılı değilse misafir bunları bilmez; garson da her masada aynı şeyi anlatmak zorunda kalır.</p>
<h3 id="ilke-7">7. Öne çıkarmak istediğinizi işaretleyin</h3>
<p>"Şefin önerisi", "yeni" ya da "vegan" gibi rozetler misafirin gözünü yönlendirir. Ama her ürüne rozet koyarsanız hiçbiri öne çıkmaz. Hangi ürünleri öne çıkaracağınıza karar vermek için <a href="@/blog/menu-muhendisligi-nedir/">menü mühendisliği</a> yaklaşımı yardımcı olur.</p>
<h3 id="ilke-8">8. Okunabilirliği ihmal etmeyin</h3>
<p>Telefonda gövde metni rahat okunacak büyüklükte olmalı, yazı ile zemin arasında yeterli kontrast bulunmalı. Koyu zeminde ince ve küçük yazı, özellikle dış mekânda okunmaz. Web erişilebilirlik yönergeleri, normal metin için en az 4,5:1 kontrast oranı önerir.</p>
<h3 id="ilke-9">9. Aramayı ve filtreyi kolaylaştırın</h3>
<p>Uzun bir menüde arama kutusu ve alerjen, vegan gibi filtreler misafirin aradığını hızla bulmasını sağlar. Filtreler ancak ürün bilgisi eksiksiz girildiğinde doğru çalışır.</p>
<h3 id="ilke-10">10. Hızlı açılsın</h3>
<p>Misafir menüyü masada, çoğu zaman mobil veriyle açar. Büyük ve sıkıştırılmamış görseller menünün geç açılmasına yol açar. Fotoğrafları web için küçültmek ve modern biçimlerde (ör. WebP) sunmak, açılış süresini kısaltır.</p>

<h2 id="hatalar">Sık yapılan hatalar</h2>
<ul>
  <li>Basılı menünün fotoğrafını ya da PDF'ini dijital menü olarak kullanmak.</li>
  <li>Her ürüne uzun paragraf açıklama yazmak.</li>
  <li>Fotoğrafı olan ve olmayan ürünleri düzensiz karıştırmak.</li>
  <li>Fiyatı küçük ve soluk yazmak.</li>
  <li>Satıştan kalkan ürünü menüde bırakmak.</li>
</ul>

<h2 id="dijital">Dijital menüde bu ilkeleri uygulamak</h2>
<p>QR Menu Official'ın <a href="@/moduller/restoran-menu/">Restoran Menü</a> modülü, kategoriler, ürün fotoğrafı, açıklama, porsiyon ve ekstra seçenekleri ile ürün rozetlerini Temel paketten itibaren sunar. Biten bir ürünü tek dokunuşla "tükendi" olarak işaretleyebilir, kampanyalı fiyatları ayrı gösterebilirsiniz. Menü hazırlarken adım adım ilerlemek için <a href="@/blog/dijital-menu-nasil-hazirlanir/">dijital menü hazırlama rehberine</a> de bakabilirsiniz.</p>

<div class="qb-cta-inline">
  <p><strong>Bu ilkelerin uygulandığı bir menüyü telefonunuzda görün.</strong></p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Bir restoran menüsünde kaç kategori olmalı?", a: "Kesin bir sayı yoktur. Misafirin yemek sırasını izleyen ve benzer ürünleri birleştiren az sayıda net kategori, uzun bir sekme listesinden daha kolay gezilir." },
      { q: "Her ürüne fotoğraf koymak gerekli mi?", a: "Gerekli değil ama fotoğrafı olan ürünlerde gerçek ve tutarlı fotoğraf kullanmak önemlidir. Stok fotoğraf misafiri yanlış beklentiye sokar." },
      { q: "Ürün açıklaması ne kadar uzun olmalı?", a: "Bir ya da iki kısa cümle: ana malzeme, pişirme yöntemi ve yanında gelen. Uzun paragraflar telefonda okunmaz." },
      { q: "Dijital menü neden yavaş açılır?", a: "En sık neden büyük ve sıkıştırılmamış görsellerdir. Fotoğrafları web için küçültmek ve WebP gibi modern biçimlerde sunmak açılışı hızlandırır." },
      { q: "PDF menüyü dijital menü olarak kullanabilir miyim?", a: "Kullanılabilir ama telefonda yakınlaştırma gerektirir, arama ve filtre sunmaz ve her değişiklikte yeniden yüklenmelidir." }
    ],
    sources: [
      { label: "W3C — WCAG 2.1, Kontrast (en az) başarı ölçütü", url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" },
      { label: "web.dev — Görselleri optimize etme", url: "https://web.dev/learn/images" },
      { label: "QR Menu Official — Restoran Menü modül sayfası", url: "https://qrmenuofficial.com/moduller/restoran-menu/" }
    ],
    related: ["dijital-menu-nasil-hazirlanir", "menu-muhendisligi-nedir", "qr-menu-fiyatlari"],
    products: [
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Akıllı Filtreleme modülü", path: "moduller/akilli-filtreleme/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  },

  /* ------------------------------------------------------------------ 15 */
  {
    slug: "qr-menu-fiyatlari",
    category: "qr-menu",
    date: "2026-11-06",
    readMin: 7,
    title: "QR Menü Fiyatları: Ücret Neye Göre Değişir, Neyi Karşılaştırmalı?",
    seoTitle: "QR Menü Fiyatları 2026: Ücret Neye Göre Değişir?",
    description:
      "QR menü fiyatları neye göre değişir? Aylık ve yıllık ücret, paketlerin içeriği, gizli maliyetler ve teklif karşılaştırırken sorulması gereken sorular.",
    excerpt:
      "İki QR menü teklifinin fiyatı yakın görünse de içerdikleri çok farklı olabilir. Doğru karşılaştırma, fiyattan önce neyin dahil olduğuna bakmaktır.",
    cover: "qr-menu-fiyatlari",
    coverAlt: "Üç paket kartı, fiyat etiketleri ve QR kodlu masa kartını gösteren illüstrasyon",
    answer:
      "QR menü fiyatı, sistemin yalnızca menü mü yoksa sipariş, garson çağrısı ve analitik gibi servis özellikleri de mi sunduğuna, ödeme modeline (aylık ya da yıllık) ve kurulum, çoklu dil ve destek gibi kalemlerin dahil olup olmadığına göre değişir. Teklifleri karşılaştırırken aylık ücret kadar neyin dahil olduğuna bakın.",
    body: `
<h2 id="neden-farkli">Fiyatlar neden bu kadar farklı?</h2>
<p>"QR menü" adı altında çok farklı ürünler satılır. Bir ucunda bir PDF'i karekoda bağlayan basit hizmetler, diğer ucunda masadan sipariş, garson çağrısı, servis ekranı ve analitik sunan sistemler vardır. Fiyat farkı da çoğu zaman bu kapsam farkından gelir.</p>

<h2 id="belirleyenler">Fiyatı belirleyen başlıca kalemler</h2>
<h3 id="kapsam">Kapsam: yalnızca menü mü, servis de mi?</h3>
<p>Yalnızca menü gösteren bir sistemle, masadan gelen sipariş ve çağrıları bir servis paneline düşüren sistem aynı şey değildir. İkincisi işletmenin servis akışının parçası olur ve daha fazla özellik içerir.</p>
<h3 id="odeme">Ödeme modeli</h3>
<p>Çoğu sistem aylık abonelikle çalışır; yıllık ödemede indirim sunulabilir. Tek seferlik ödeme modellerinde güncelleme ve destek kapsamını ayrıca sorun.</p>
<h3 id="dil">Çoklu dil</h3>
<p>Turist misafiri olan işletmeler için önemlidir. Bazı sistemlerde ek ücretlidir; çevirinin nasıl girildiğini (elle, dosyayla, otomatik) de sorun.</p>
<h3 id="kurulum">Kurulum ve menü girişi</h3>
<p>Menünün sisteme kimin tarafından girileceği, toplu aktarma (ör. CSV) olup olmadığı ve fotoğrafların nasıl ekleneceği, gizli bir iş yükü ya da ek maliyet olabilir.</p>
<h3 id="baski">Karekod baskısı</h3>
<p>Karekodların masa kartı, stand ya da etiket olarak basılması genellikle ayrı bir maliyettir. Masa bazlı kod gerekiyorsa masa sayınız baskı maliyetini belirler.</p>
<h3 id="odeme-alma">Ödeme alma</h3>
<p>Sistem online ödeme alıyorsa, abonelik dışında işlem başına komisyon olabilir. Ödeme almayan sistemlerde bu kalem yoktur.</p>

<h2 id="sorular">Teklif karşılaştırırken sorulacak sorular</h2>
<ol>
  <li>Fiyat aylık mı, yıllık mı? KDV dahil mi?</li>
  <li>Ürün ve kategori sayısında sınır var mı?</li>
  <li>Fiyatı ve ürünü kendim mi güncelliyorum, yoksa talep mi açıyorum?</li>
  <li>Çoklu dil, alerjen ve filtre dahil mi?</li>
  <li>Masa bazlı karekod var mı? Garson çağrısı ve sipariş hangi pakette?</li>
  <li>Sistem ödeme alıyor mu? Alıyorsa komisyon ne kadar?</li>
  <li>Aboneliği bırakırsam menü verilerimi dışa aktarabilir miyim?</li>
  <li>Destek hangi kanaldan ve hangi saatlerde?</li>
</ol>

<h2 id="qr-menu-official">QR Menu Official paketleri</h2>
<p>Şeffaflık için kendi fiyatlarımızı da yazıyoruz. Kasım 2026 itibarıyla aylık fiyatlar şöyledir; güncel fiyat ve paket içeriği için her zaman <a href="@/paketler/">paketler sayfasını</a> esas alın.</p>
<div class="qb-table-wrap"><table>
  <thead><tr><th>Paket</th><th>Aylık</th><th>Kimin için</th><th>Öne çıkanlar</th></tr></thead>
  <tbody>
    <tr><td>Temel</td><td>749 TL</td><td>Menüsünü dijitalleştirmek isteyen işletmeler</td><td>Dijital QR menü, panelden ürün ve fiyat yönetimi, CSV aktarma, porsiyon ve ekstra, rozetler, kampanya ve kombo, akıllı filtreleme, çoklu dil, QR masa</td></tr>
    <tr><td>Pro</td><td>1.490 TL</td><td>Masa ve servis akışını düzenlemek isteyen işletmeler</td><td>Temel'e ek olarak QR ile sipariş, servis paneli, garson çağrısı, hesap talebi, personel rolleri, masa oturum güvenliği, açılış ekranı</td></tr>
    <tr><td>Plus</td><td>2.990 TL</td><td>Menüsünü veriyle yönetmek isteyen işletmeler</td><td>Pro'ya ek olarak menü analitiği, yorum ve geri bildirim, maliyet ve reçete, menü mühendisliği, menü asistanı</td></tr>
  </tbody>
</table></div>
<p>Yıllık ödemede 12 ay kullanım için 10 aylık ücret ödenir. Sistem online ödeme almaz; sipariş ve hesap talepleri servis paneline iletilir, ödeme işletmenin kendi yöntemiyle alınır.</p>

<h2 id="hangisi">Hangi paket size uygun?</h2>
<ul>
  <li><strong>Yalnızca menünüzü dijitalleştirmek istiyorsanız</strong> ve garson çağrısı ya da masadan sipariş gerekmiyorsa Temel yeterlidir.</li>
  <li><strong>Garson az, masa çoksa</strong> ve çağrıların, siparişlerin bir ekranda toplanmasını istiyorsanız Pro'ya bakın.</li>
  <li><strong>Hangi ürünün kâr getirdiğini ve misafirin menüde ne aradığını</strong> görmek istiyorsanız Plus'taki analitik ve menü mühendisliği işinize yarar.</li>
</ul>

<div class="qb-cta-inline">
  <p><strong>Paketleri yan yana karşılaştırın.</strong> Her özelliğin hangi pakette olduğu tek tabloda.</p>
  <a class="qb-btn" href="@/paketler/">Paketleri İncele <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "QR menü fiyatları ne kadar?", a: "Kapsama göre değişir. Yalnızca menü gösteren sistemler ile sipariş, garson çağrısı ve analitik sunan sistemler arasında belirgin fiyat farkı vardır. QR Menu Official'da Kasım 2026 itibarıyla aylık fiyatlar Temel 749 TL, Pro 1.490 TL ve Plus 2.990 TL'dir." },
      { q: "Yıllık ödemede indirim var mı?", a: "QR Menu Official'da yıllık ödemede 12 ay kullanım için 10 aylık ücret ödenir." },
      { q: "QR menü sistemi ödeme alır mı?", a: "Sisteme göre değişir. QR Menu Official ödeme almaz; sipariş ve hesap talepleri servis paneline iletilir." },
      { q: "Karekod baskısı fiyata dahil mi?", a: "Çoğu sistemde baskı ayrı bir maliyettir. QR Menu Official'da karekodları panelden PNG ya da PDF olarak indirip istediğiniz matbaada bastırabilirsiniz." },
      { q: "Teklif karşılaştırırken en çok neye dikkat etmeliyim?", a: "Aylık ücretten önce kapsamı karşılaştırın: güncellemeyi kendiniz yapıp yapamadığınız, çoklu dil, masa bazlı kod, sipariş ve garson çağrısı, veri dışa aktarma ve destek." }
    ],
    sources: [
      { label: "QR Menu Official — Paketler ve fiyatlar", url: "https://qrmenuofficial.com/paketler/" },
      { label: "QR Menu Official — Modüller", url: "https://qrmenuofficial.com/moduller/" }
    ],
    related: ["qr-menu-nedir", "restoran-menu-tasarimi", "garson-eksikligi-az-personelle-servis"],
    products: [
      { label: "Paketler ve fiyatlar", path: "paketler/" },
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Servis Paneli modülü", path: "moduller/servis-paneli/" }
    ]
  }
];
