/* =========================================================
   BLOG — 3. PAKET (2/2). posts.mjs bu diziyi POSTS'a ekler.
   Konular seo/content-calendar.csv'den; kurallar posts.mjs başlığındakiyle aynı.
========================================================= */

export const POSTS_3B = [
  /* ------------------------------------------------------------------ 21 */
  {
    slug: "pdf-menu-mu-dijital-menu-mu",
    category: "qr-menu",
    date: "2026-10-31",
    readMin: 6,
    title: "PDF Menü mü, Dijital Menü mü? QR Kodlu Menüde Doğru Seçim",
    seoTitle: "PDF Menü mü Dijital Menü mü? QR Kod Menü Karşılaştırması",
    description:
      "QR koda PDF menü bağlamak yeterli mi? PDF menü ile panelden yönetilen dijital menünün telefonda okunma, güncelleme, arama, dil ve ölçüm açısından karşılaştırması.",
    excerpt:
      "Basılı menünün PDF'ini karekoda bağlamak en hızlı başlangıçtır. Ama misafir telefonda yakınlaştırıp kaydırırken siz de her fiyat değişikliğinde dosyayı yeniden hazırlarsınız.",
    cover: "pdf-menu-mu-dijital-menu-mu",
    coverAlt: "Sol tarafta PDF menü sayfası, sağ tarafta telefona uyumlu dijital menü ekranını gösteren illüstrasyon",
    answer:
      "PDF menü, basılı menünün dosyasının karekoda bağlanmasıdır; kurulumu hızlıdır ama telefonda yakınlaştırma gerektirir ve her değişiklikte yeniden yüklenir. Dijital menü ise telefona göre düzenlenir, ürün bazında güncellenir, arama, filtre ve çoklu dil sunabilir. Az ürünlü ve nadiren değişen menüler için PDF yeterli olabilir; sık değişen menülerde dijital menü daha pratiktir.",
    body: `
<h2 id="fark">Temel fark</h2>
<p>Her ikisinde de misafir masadaki karekodu okutur. Fark, kodun arkasında ne olduğudur: PDF menüde sabit bir dosya, dijital menüde ise ürünlerin tek tek yönetildiği bir sayfa.</p>

<h2 id="karsilastirma">Yan yana karşılaştırma</h2>
<div class="qb-table-wrap"><table>
  <thead><tr><th>Ölçüt</th><th>PDF menü</th><th>Dijital menü</th></tr></thead>
  <tbody>
    <tr><td>Kurulum</td><td>Hızlı: mevcut dosya yüklenir</td><td>Ürünler bir kez sisteme girilir</td></tr>
    <tr><td>Telefonda okuma</td><td>Yakınlaştırma ve kaydırma gerekir</td><td>Ekrana göre düzenlenir</td></tr>
    <tr><td>Fiyat güncelleme</td><td>Dosya yeniden hazırlanır ve yüklenir</td><td>Ürün kaydında değiştirilir</td></tr>
    <tr><td>Biten ürün</td><td>Dosya değişmedikçe menüde kalır</td><td>Tek dokunuşla kapatılır</td></tr>
    <tr><td>Arama ve filtre</td><td>Yok</td><td>Ürün verisi girildiyse var</td></tr>
    <tr><td>Çoklu dil</td><td>Her dil için ayrı dosya</td><td>Dil seçiciyle aynı menü</td></tr>
    <tr><td>Açılış hızı</td><td>Dosya boyutuna bağlı; büyük PDF yavaş açılır</td><td>Görseller optimize edildiyse hızlı</td></tr>
    <tr><td>Ölçüm</td><td>Yok denecek kadar sınırlı</td><td>Görüntüleme ve ürün ilgisi izlenebilir</td></tr>
  </tbody>
</table></div>

<h2 id="ne-zaman-pdf">PDF menü ne zaman yeterli?</h2>
<ul>
  <li>Menünüz kısa ve yılda bir iki kez değişiyorsa.</li>
  <li>Turist misafiriniz azsa ve tek dil yeterliyse.</li>
  <li>Garson çağrısı ya da masadan sipariş gibi bir ihtiyacınız yoksa.</li>
</ul>
<p>Bu durumda dosyanın telefonda okunur olması için PDF'i yatay değil dikey, büyük yazıyla ve küçük dosya boyutuyla hazırlayın.</p>

<h2 id="ne-zaman-dijital">Dijital menü ne zaman gerekir?</h2>
<ul>
  <li>Fiyatlarınız sık değişiyorsa.</li>
  <li>Biten ürünü menüden hızla kaldırmanız gerekiyorsa.</li>
  <li>Yabancı misafiriniz çoksa.</li>
  <li>Alerjen, vegan gibi bilgileri filtrelenebilir sunmak istiyorsanız.</li>
  <li>Menüyü garson çağrısı ve siparişle servis akışına bağlamak istiyorsanız.</li>
</ul>

<h2 id="yasal">Yasal açıdan fark var mı?</h2>
<p>Fiyat Etiketi Yönetmeliği'ndeki 2025 değişikliği, masada fiyat listesinin karekodla gösterilmesine izin verir; karekodun bir PDF'e ya da dijital menüye gitmesi arasında ayrım yapmaz. Her iki durumda da misafir isterse fiziksel liste gösterilmelidir. Ayrıntılar için <a href="@/blog/karekod-fiyat-listesi-yonetmeligi/">karekodla fiyat listesi rehberine</a> bakın.</p>

<h2 id="gecis">PDF'ten dijital menüye geçiş</h2>
<p>Elinizdeki PDF, dijital menünün ilk taslağıdır: kategorileri ve ürünleri bir tabloya aktarıp sisteme toplu yükleyebilirsiniz. Adım adım anlatım için <a href="@/blog/dijital-menu-nasil-hazirlanir/">dijital menü hazırlama rehberine</a> bakın. QR Menu Official'da CSV ile toplu ürün aktarma Temel paketten itibaren vardır.</p>

<div class="qb-cta-inline">
  <p><strong>Farkı telefonunuzda görün.</strong> Dijital menü demosunu açın.</p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "QR koda PDF menü bağlamak yasal mı?", a: "Fiyat Etiketi Yönetmeliği masada karekodla fiyat listesi gösterimine izin verir ve PDF ile dijital menü arasında ayrım yapmaz. Misafir isterse fiziksel liste gösterilmelidir." },
      { q: "PDF menü neden telefonda zor okunur?", a: "PDF sabit sayfa düzeninde olduğu için telefon ekranına göre yeniden düzenlenmez; misafir yakınlaştırıp kaydırmak zorunda kalır." },
      { q: "PDF menüyü dijital menüye nasıl çeviririm?", a: "Ürünleri ve fiyatları bir tabloya aktarıp dijital menü sistemine toplu yükleyebilirsiniz. QR Menu Official'da CSV ile aktarma Temel pakettedir." },
      { q: "PDF menü için de karekod gerekir mi?", a: "Evet. Karekod PDF dosyasının adresini taşır; dosyayı değiştirirken adres aynı kalırsa basılı kodu yenilemeniz gerekmez." },
      { q: "Dijital menü daha hızlı mı açılır?", a: "Görselleri optimize edilmiş bir dijital menü genellikle büyük bir PDF'ten hızlı açılır. Sonuç, dosya ve görsel boyutuna bağlıdır." }
    ],
    sources: [
      { label: "T.C. Ticaret Bakanlığı — Fiyat etiketinde yeni dönem başlıyor", url: "https://ticaret.gov.tr/haberler/fiyat-etiketinde-yeni-donem-basliyor" },
      { label: "web.dev — Görselleri optimize etme", url: "https://web.dev/learn/images" }
    ],
    related: ["qr-menu-nedir", "dijital-menu-nasil-hazirlanir", "restoran-menu-tasarimi"],
    products: [
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Çoklu Dil modülü", path: "moduller/coklu-dil/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  },

  /* ------------------------------------------------------------------ 22 */
  {
    slug: "restoran-cirosu-artirma",
    category: "karlilik",
    date: "2026-10-30",
    readMin: 8,
    title: "Restoran Cirosunu Etkileyen 10 Operasyonel Kalem",
    seoTitle: "Restoran Cirosu Nasıl Artırılır? 10 Operasyonel Kalem",
    description:
      "Restoran cirosu nasıl artırılır? Masa devri, bekleme süresi, ortalama hesap, menü düzeni, tükenen ürün ve geri dönen misafir gibi ölçülebilir 10 operasyonel kalem.",
    excerpt:
      "Ciroyu tek bir hamle değil, her gün tekrarlanan küçük kalemler belirler. Bu kalemleri ölçmeden neyi iyileştirdiğinizi bilemezsiniz.",
    cover: "restoran-cirosu-artirma",
    coverAlt: "Masa devri, saat ve hesap fişi simgelerini gösteren illüstrasyon",
    answer:
      "Restoran cirosu, kabaca misafir sayısı ile misafir başına harcamanın çarpımıdır. İkisini de etkileyen operasyonel kalemler vardır: masa devri, sipariş ve servis süresi, ortalama hesap, menü düzeni, tükenen ürün yönetimi, geri dönen misafir ve yerel görünürlük. Her kalemi ölçüp birer birer iyileştirmek, tek bir büyük kampanyadan daha kalıcı sonuç verir.",
    body: `
<p class="qb-note">Bu yazı kalıcı bir sonuç garanti etmez; her işletmenin koşulu farklıdır. Amaç, ölçülebilir kalemleri ve bunları nasıl izleyeceğinizi göstermektir.</p>

<h2 id="formul">Ciroyu iki parçada düşünün</h2>
<p><strong>Ciro ≈ Misafir sayısı × Misafir başına harcama</strong></p>
<p>Misafir sayısını; masa sayısı, açık saatler, masa devri ve yeni ile geri dönen misafir belirler. Misafir başına harcamayı ise menü düzeni, öneri, porsiyon seçenekleri ve fiyat belirler.</p>

<h2 id="kalemler">10 kalem</h2>
<h3 id="k1">1. Masa devri</h3>
<p>Yoğun saatte bir masanın oturma ile kalkma arasında geçen süre. Misafiri acele ettirmeden, bekleme sürelerini kısaltarak masa devri iyileşebilir.</p>
<h3 id="k2">2. Oturma ile sipariş arası süre</h3>
<p>Misafirin menüye bakıp sipariş verene kadar beklediği süre. Menüyü masaya getirme ve sipariş alma gecikmesi burada birikir. Bkz. <a href="@/blog/qr-ile-masadan-siparis/">QR ile masadan sipariş</a>.</p>
<h3 id="k3">3. Sipariş ile servis arası süre</h3>
<p>Mutfağın hızı ve siparişin doğru iletilmesi. Yanlış giden tabak bu süreyi uzatır. Bkz. <a href="@/blog/restoran-siparis-hatalari/">sipariş hataları</a>.</p>
<h3 id="k4">4. Hesap isteme süresi</h3>
<p>Misafirin hesap istedikten sonra beklediği süre, masanın boşalmasını geciktirir ve son izlenimi belirler.</p>
<h3 id="k5">5. Ortalama hesap</h3>
<p>Masa başına ya da kişi başına ortalama harcama. Doğru öneri, porsiyon ve kombo seçenekleri bu rakamı etkiler. Bkz. <a href="@/blog/restoranda-ek-satis/">ek satış</a>.</p>
<h3 id="k6">6. Menü düzeni</h3>
<p>Misafirin kârlı ürünleri fark edip etmediği, menünün düzenine bağlıdır. Bkz. <a href="@/blog/restoran-menu-tasarimi/">menü tasarımı</a>.</p>
<h3 id="k7">7. Ürün kârlılığı</h3>
<p>Çok satan bir ürünün düşük kâr bırakması ciroyu artırırken kârı artırmayabilir. Bkz. <a href="@/blog/menu-muhendisligi-nedir/">menü mühendisliği</a>.</p>
<h3 id="k8">8. Tükenen ürün yönetimi</h3>
<p>Menüde duran ama biten bir ürün, misafirin hayal kırıklığı ve garsonun açıklama süresi demektir. Biten ürünü hızla kapatmak bu kaybı azaltır.</p>
<h3 id="k9">9. Geri dönen misafir</h3>
<p>Memnun misafirin tekrar gelmesi, yeni misafir kazanmaktan genellikle daha az emek ister. Geri bildirimi toplayıp şikâyetleri hızla çözmek burada belirleyicidir.</p>
<h3 id="k10">10. Yerel görünürlük</h3>
<p>Yakındaki birinin sizi bulması. Bkz. <a href="@/blog/google-isletme-profili-restoran-yerel-seo/">Google İşletme Profili rehberi</a> ve <a href="@/blog/restoran-google-yorumlari-nasil-artirilir/">Google yorumları</a>.</p>

<h2 id="olcum">Nasıl ölçülür?</h2>
<p>Bu kalemlerin çoğu kasa ve rezervasyon kayıtlarınızdan, bir kısmı ise birkaç vardiya boyunca yapılacak basit gözlemle ölçülebilir. Her ay aynı yöntemle ölçüp değişikliğin etkisini karşılaştırın. Aynı anda birden fazla şeyi değiştirmek, hangisinin işe yaradığını görmeyi zorlaştırır.</p>

<h2 id="qr-menu-official">QR Menu Official hangi kalemlere dokunur?</h2>
<ul>
  <li><strong>2, 4:</strong> QR ile sipariş ve hesap talebi (Pro).</li>
  <li><strong>5, 6, 8:</strong> Porsiyon, ekstra, kombo, rozet ve tükendi işareti (Temel).</li>
  <li><strong>7:</strong> Maliyet ve menü mühendisliği (Plus).</li>
  <li><strong>9:</strong> Yorum ve geri bildirim (Plus).</li>
</ul>
<p>Menü analitiği verileri (görüntüleme, ürün tıklaması, aranan kelimeler) ilgi göstergesidir; kasa satışının yerini tutmaz.</p>
`,
    faq: [
      { q: "Restoran cirosu nasıl hesaplanır?", a: "Belirli bir dönemdeki toplam satış tutarıdır. Kabaca misafir sayısı ile misafir başına ortalama harcamanın çarpımı olarak düşünülebilir." },
      { q: "Ciroyu artırmanın en hızlı yolu nedir?", a: "Tek bir hızlı yol yoktur. Bekleme sürelerini kısaltmak, menüde kârlı ürünleri görünür kılmak ve biten ürünü hızla kapatmak gibi ölçülebilir kalemler üzerinde çalışmak daha kalıcı sonuç verir." },
      { q: "Ciro artarken kâr neden artmayabilir?", a: "Çok satan ürünlerin kârlılığı düşükse ya da maliyetler satıştan hızlı artıyorsa ciro artışı kâra yansımayabilir. Ürün bazında kârlılığı izlemek gerekir." },
      { q: "Masa devri nasıl iyileştirilir?", a: "Misafiri acele ettirmeden sipariş, servis ve hesap aşamalarındaki bekleme sürelerini kısaltarak." },
      { q: "QR menü ciroyu artırır mı?", a: "Garanti edilemez. QR menü bekleme sürelerini, tükenen ürün yönetimini ve menüdeki görünürlüğü etkileyebilir; sonuç işletmeye göre değişir." }
    ],
    sources: [
      { label: "TÜİK — Hizmet sektörü istatistikleri", url: "https://data.tuik.gov.tr/" },
      { label: "QR Menu Official — Paketler ve fiyatlar", url: "https://qrmenuofficial.com/paketler/" }
    ],
    related: ["restoranda-ek-satis", "menu-muhendisligi-nedir", "garson-eksikligi-az-personelle-servis"],
    products: [
      { label: "Paketler ve fiyatlar", path: "paketler/" },
      { label: "Servis Paneli modülü", path: "moduller/servis-paneli/" },
      { label: "Menü Mühendisliği modülü", path: "moduller/menu-muhendisligi/" }
    ]
  },

  /* ------------------------------------------------------------------ 23 */
  {
    slug: "ucretsiz-qr-menu",
    category: "qr-menu",
    date: "2026-10-29",
    readMin: 6,
    title: "Ücretsiz QR Menü Araçlarının Sınırları: Ne Zaman Yeterli, Ne Zaman Değil?",
    seoTitle: "Ücretsiz QR Menü Yeterli mi? Sınırlar ve Dikkat Edilecekler",
    description:
      "Ücretsiz QR menü araçları ne zaman yeterli? Reklam, kalıcı adres, güncelleme, veri sahipliği ve marka görünümü açısından dikkat edilmesi gerekenler.",
    excerpt:
      "Ücretsiz bir QR menü aracıyla başlamak mantıklı olabilir. Ama masalara basılan kod yıllarca kalır; aracın sınırlarını baştan bilmek, ileride yeniden baskı masrafından kurtarır.",
    cover: "ucretsiz-qr-menu",
    coverAlt: "Hediye kutusu, QR kodlu masa kartı ve soru işaretini gösteren illüstrasyon",
    answer:
      "Ücretsiz QR menü araçları kısa ve nadiren değişen menüler için yeterli olabilir. Seçmeden önce kodun kalıcı olup olmadığını, menüde reklam gösterilip gösterilmediğini, fiyatı kendiniz güncelleyip güncelleyemediğinizi ve verilerinizi dışa aktarıp aktaramadığınızı kontrol edin; çünkü basılı kodu değiştirmek ileride masraf çıkarır.",
    body: `
<h2 id="neden-ucretsiz">Ücretsiz araçla başlamak mantıklı mı?</h2>
<p>Yeni açılan ya da menüsü çok küçük bir işletme için ücretsiz bir araç, dijital menüyü denemenin kolay yoludur. Sorun, ücretsiz aracın sınırlarının genellikle kod masaya basıldıktan sonra fark edilmesidir.</p>

<h2 id="kontrol">Seçmeden önce kontrol edilecekler</h2>
<h3 id="kalici">Kod kalıcı mı?</h3>
<p>Bazı araçlar "dinamik" kodu belirli bir süre ya da okutma sayısıyla sınırlar; süre dolunca kod çalışmayabilir. Masalara basılmış yüzlerce kodu yenilemek hem masraf hem de o arada çalışmayan bir menü demektir.</p>
<h3 id="reklam">Menüde reklam var mı?</h3>
<p>Misafirin menüyü açtığında başka bir markanın reklamını görmesi işletmenin imajını etkiler.</p>
<h3 id="guncelleme">Güncellemeyi kim yapıyor?</h3>
<p>Fiyatı kendiniz değiştirebiliyor musunuz, yoksa dosyayı her seferinde yeniden mi yüklüyorsunuz?</p>
<h3 id="veri">Veriler kimin?</h3>
<p>Aracı bırakırsanız menünüzü dışa aktarabilir misiniz? Menünün adresi sizin alan adınızda mı, aracın alan adında mı?</p>
<h3 id="sinirlar">Ürün ve dil sınırı var mı?</h3>
<p>Ücretsiz sürümlerde ürün sayısı, dil ya da görsel sınırı olabilir.</p>
<h3 id="destek">Bir sorun olduğunda kime ulaşacaksınız?</h3>
<p>Cumartesi akşamı menü açılmıyorsa, kimden ve ne kadar sürede yardım alabileceğinizi bilmek önemlidir.</p>

<h2 id="ne-zaman-yeter">Ne zaman yeterli?</h2>
<ul>
  <li>Menünüz kısa ve nadiren değişiyorsa.</li>
  <li>Tek dil yeterliyse.</li>
  <li>Garson çağrısı, masadan sipariş ya da ölçüme ihtiyacınız yoksa.</li>
  <li>Kodun kalıcı olduğundan ve reklam gösterilmediğinden eminseniz.</li>
</ul>

<h2 id="ne-zaman-degil">Ne zaman yetersiz kalır?</h2>
<ul>
  <li>Fiyatlarınız sık değişiyorsa ve hızlı güncellemeniz gerekiyorsa.</li>
  <li>Yabancı misafiriniz çoksa.</li>
  <li>Alerjen ve diyet filtreleri sunmak istiyorsanız.</li>
  <li>Menüyü servis akışına (çağrı, sipariş, hesap) bağlamak istiyorsanız.</li>
  <li>Menünün sizin markanızla, reklamsız görünmesini istiyorsanız.</li>
</ul>

<h2 id="maliyet">Gerçek maliyeti hesaplayın</h2>
<p>Ücretsiz bir aracın maliyeti sıfır değildir: güncellemeye harcanan zaman, ileride yeniden basılacak kodlar ve araç değiştirildiğinde menünün yeniden girilmesi de maliyettir. Ücretli bir sistemi değerlendirirken neye bakmanız gerektiğini <a href="@/blog/qr-menu-programi-secimi/">QR menü programı seçimi</a> ve <a href="@/blog/qr-menu-fiyatlari/">QR menü fiyatları</a> yazılarında anlattık.</p>

<div class="qb-cta-inline">
  <p><strong>Reklamsız, panelden yönetilen bir menünün nasıl göründüğüne bakın.</strong></p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Ücretsiz QR menü güvenilir mi?", a: "Araca göre değişir. Kodun kalıcı olup olmadığını, menüde reklam gösterilip gösterilmediğini ve verilerinizi dışa aktarıp aktaramadığınızı kontrol edin." },
      { q: "Ücretsiz QR kodun süresi dolar mı?", a: "Bazı araçlarda dinamik kodlar süre ya da okutma sayısıyla sınırlıdır. Seçmeden önce aracın koşullarını okuyun." },
      { q: "Ücretsiz araçtan ücretli sisteme geçerken kodları yeniden basmam gerekir mi?", a: "Kod aracın adresine gidiyorsa genellikle evet. Bu yüzden baştan kalıcı bir adres seçmek ileride masraftan kurtarır." },
      { q: "Ücretsiz QR menüde garson çağrısı olur mu?", a: "Genellikle hayır. Garson çağrısı ve sipariş bir servis ekranı gerektirdiği için çoğunlukla ücretli sistemlerde bulunur." },
      { q: "Canva ile QR menü yapılır mı?", a: "Tasarım araçlarıyla menü görseli ya da PDF hazırlayıp karekoda bağlayabilirsiniz. Bu bir PDF menüdür; panelden ürün bazında yönetilen dijital menüden farklıdır." }
    ],
    sources: [
      { label: "ISO/IEC 18004 — QR Code bar code symbology specification", url: "https://www.iso.org/standard/62021.html" },
      { label: "QR Menu Official — Paketler ve fiyatlar", url: "https://qrmenuofficial.com/paketler/" }
    ],
    related: ["qr-menu-programi-secimi", "qr-menu-fiyatlari", "pdf-menu-mu-dijital-menu-mu"],
    products: [
      { label: "Paketler ve fiyatlar", path: "paketler/" },
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "QR Masa modülü", path: "moduller/qr-masa/" }
    ]
  },

  /* ------------------------------------------------------------------ 24 */
  {
    slug: "qr-menu-guvenligi",
    category: "servis",
    date: "2026-10-28",
    readMin: 7,
    title: "QR Menü Güvenliği: Masa Oturumu Neyi Çözer, Neyi Çözmez?",
    seoTitle: "QR Menü Güvenliği: Masa Oturumu Neyi Çözer?",
    description:
      "QR menüde masada olmayan biri sipariş verebilir mi? Masa oturumu, süre sınırı ve kilit ekranının neyi çözdüğü, neyi çözmediği ve sahte karekoda karşı önlemler.",
    excerpt:
      "Karekodun fotoğrafını çeken biri, masada olmadan menüyü açabilir. Masadan sipariş ve garson çağrısı varsa bu bir sorun olabilir. Peki ne kadarı önlenebilir?",
    cover: "qr-menu-guvenligi",
    coverAlt: "Kalkan, kilit simgesi ve masa QR kodunu gösteren illüstrasyon",
    answer:
      "QR menüde masa oturumu, siparişin ve çağrının yalnızca kayıtlı bir masadan ve sınırlı bir süre içinde verilmesini sağlar. Oturum süresi dolduğunda ya da hesap kapandığında yeni sipariş için kodun yeniden okutulması gerekir. Ancak kodun gerçek fotoğrafına sahip biri süre içinde menüyü açabilir; hiçbir yöntem bunu tamamen engellemez.",
    body: `
<h2 id="risk">Risk nerede?</h2>
<p>Yalnızca menü gösteren bir QR kodda risk düşüktür: menüyü başka biri görse de bir şey değişmez. Masadan sipariş ve garson çağrısı devreye girdiğinde ise iki durum önemli hale gelir:</p>
<ul>
  <li><strong>Uzaktan sipariş ya da çağrı:</strong> Kodun fotoğrafı paylaşılırsa, masada olmayan biri o masa adına talep gönderebilir.</li>
  <li><strong>Sahte karekod:</strong> Masadaki kodun üzerine başka bir kod yapıştırılarak misafir farklı bir sayfaya yönlendirilebilir.</li>
</ul>

<h2 id="oturum">Masa oturumu nedir?</h2>
<p>Misafir masadaki kodu okuttuğunda, o masaya bağlı ve süresi sınırlı bir oturum açılır. Sipariş ve çağrılar bu oturum üzerinden gönderilir. Oturum dışarıdan değiştirilemeyecek şekilde imzalıdır ve yalnızca sisteme kayıtlı masalar için açılır.</p>

<h2 id="cozer">Neyi çözer?</h2>
<ul>
  <li><strong>Kayıtsız masa adresleri:</strong> Sistemde tanımlı olmayan bir masa adresiyle oturum açılamaz; misafire bir kilit ekranı gösterilir.</li>
  <li><strong>Eski fotoğraflar:</strong> Oturum süresi dolduğunda yeni talep için kodun yeniden okutulması gerekir. Günler önce çekilmiş bir fotoğrafla açılan eski oturum çalışmaz.</li>
  <li><strong>Hesap sonrası talepler:</strong> Hesap tamamlandığında oturum sona erer; masadan kalkan misafirin telefonundan yeni sipariş gitmez.</li>
  <li><strong>Açık oturumun değiştirilmesi:</strong> Oturum imzalı olduğu için, açılmış bir oturumun masa bilgisi ya da süresi sonradan değiştirilemez.</li>
</ul>

<h2 id="cozmez">Neyi çözmez?</h2>
<ul>
  <li><strong>Gerçek kodun fotoğrafı:</strong> Kodun gerçek fotoğrafına sahip biri, oturum süresi içinde menüyü açabilir. Masa oturumu bunu tamamen engellemez; yalnızca süreyi sınırlar.</li>
  <li><strong>Başka bir kayıtlı masanın adresi:</strong> Masa adresleri tahmin edilebilir biçimdeyse (masa-1, masa-2), adresi değiştiren biri kayıtlı başka bir masa için de oturum açabilir. Servis panelinde masayla uyuşmayan talepleri kontrol etmek bu yüzden önemlidir.</li>
  <li><strong>Sahte karekod:</strong> Masadaki kodun üzerine yapıştırılan sahte bir kod, sistemin dışında kalır. Bunun önlemi fiziksel kontroldür.</li>
</ul>
<p class="qb-note">"Hacklenemez" ya da "tamamen güvenli" gibi iddialar gerçekçi değildir. Amaç riski azaltmak ve kötüye kullanımı zorlaştırmaktır.</p>

<h2 id="pratik">İşletme için pratik önlemler</h2>
<ol>
  <li>Karekodları değiştirilmesi zor bir şekilde basın: lamine kart, gömme stand ya da kalıcı etiket.</li>
  <li>Garsonlar günlük açılışta kodların yerinde ve sağlam olduğunu kontrol etsin.</li>
  <li>Servis panelinde gelen bir talep şüpheliyse masayı kontrol edin.</li>
  <li>Oturum süresini işletmenizin ortalama oturma süresine göre ayarlayın.</li>
  <li>Misafire menünün adresini (alan adınızı) gösterin; farklı bir adres açılırsa fark edebilsin.</li>
</ol>

<h2 id="qr-menu-official">QR Menu Official'da masa oturum güvenliği</h2>
<p>Pro paketten itibaren sunulan <a href="@/moduller/masa-oturum-guvenligi/">Masa Oturum Güvenliği</a>'nde oturum imzalıdır ve yalnızca kayıtlı masalar için açılır. Varsayılan süre toplam 90 dakika ve 30 dakika hareketsizliktir; işletme bu süreleri ayarlayabilir. Hesap tamamlandığında oturum sona erer. Kayıtlı olmayan ya da geçersiz bir masa adresinde misafire "Oturum Gerekli" kilit ekranı gösterilir.</p>
`,
    faq: [
      { q: "QR menüde masada olmayan biri sipariş verebilir mi?", a: "Masa oturumu olmayan sistemlerde kodun fotoğrafıyla mümkün olabilir. Masa oturumu bunu süreyle sınırlar ve kayıtsız masa adreslerini engeller; ancak gerçek kodun fotoğrafına sahip birini süre içinde tamamen engellemez." },
      { q: "Masa oturumu ne kadar sürer?", a: "QR Menu Official'da varsayılan süre toplam 90 dakika ve 30 dakika hareketsizliktir; işletme ayarlayabilir. Hesap tamamlandığında oturum sona erer." },
      { q: "Sahte karekoda karşı ne yapılabilir?", a: "Kodları değiştirilmesi zor şekilde basmak ve garsonların günlük kontrol yapması en etkili önlemdir. Sahte kod sistemin dışında kaldığı için yazılımla engellenemez." },
      { q: "QR menü hacklenebilir mi?", a: "Hiçbir sistem için 'hacklenemez' demek gerçekçi değildir. İmzalı ve süresi sınırlı oturum gibi önlemler kötüye kullanımı zorlaştırır." },
      { q: "Yalnızca menü gösteren QR kodda güvenlik önemli mi?", a: "Risk düşüktür; menüyü başkasının görmesi bir şey değiştirmez. Sipariş ve garson çağrısı eklendiğinde masa oturumu önem kazanır." }
    ],
    sources: [
      { label: "QR Menu Official — Masa Oturum Güvenliği modül sayfası", url: "https://qrmenuofficial.com/moduller/masa-oturum-guvenligi/" },
      { label: "OWASP — Session Management Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" }
    ],
    related: ["qr-ile-masadan-siparis", "garson-cagirma-sistemi", "qr-menu-nedir"],
    products: [
      { label: "Masa Oturum Güvenliği", path: "moduller/masa-oturum-guvenligi/" },
      { label: "Servis Paneli modülü", path: "moduller/servis-paneli/" },
      { label: "QR Masa modülü", path: "moduller/qr-masa/" }
    ]
  },

  /* ------------------------------------------------------------------ 25 */
  {
    slug: "kombo-menu",
    category: "karlilik",
    date: "2026-10-27",
    readMin: 6,
    title: "Kampanya ve Kombo Menü Nasıl Kurgulanır?",
    seoTitle: "Kombo Menü ve Restoran Kampanyası Nasıl Kurgulanır?",
    description:
      "Kombo menü ve restoran kampanyası nasıl hazırlanır? Doğru ürün eşleştirmesi, fiyat ve kârlılık hesabı, menüde gösterim ve kampanyayı zamanında kapatmak için rehber.",
    excerpt:
      "İyi kurgulanmış bir kombo, misafire kolay bir seçim, işletmeye öngörülebilir bir satış sunar. Kötü kurgulanmış bir kombo ise kârı sessizce eritir.",
    cover: "kombo-menu",
    coverAlt: "Hamburger, patates ve içecekten oluşan kombo tabağı ve indirim etiketini gösteren illüstrasyon",
    answer:
      "Kombo menü, birlikte sık tercih edilen ürünlerin (ana yemek, yan ürün, içecek) tek fiyatla sunulmasıdır. Kurgularken kombo fiyatının ürünlerin toplam maliyetini rahatça karşıladığından emin olun, kârlı ürünleri komboya dahil edin, menüde net gösterin ve kampanyaların başlangıç ve bitişini önceden planlayıp elle kapatmayı unutmayın.",
    body: `
<h2 id="neden">Kombo neden işe yarar?</h2>
<p>Kombo, misafirin karar verme yükünü azaltır: ana yemeği seçen misafir, yanına ne alacağını ayrıca düşünmez. İşletme açısından ise içecek ve yan ürün gibi kârlı ürünlerin satışını ana yemeğe bağlar.</p>

<h2 id="eslestirme">1. Doğru ürünleri eşleştirin</h2>
<ul>
  <li>Misafirlerinizin zaten birlikte sipariş ettiği ürünlere bakın. Garsonlar bu eşleşmeleri genellikle bilir.</li>
  <li>Kârlı ürünleri (içecek, yan ürün, tatlı) komboya dahil edin.</li>
  <li>Hazırlaması mutfağı zorlayan ürünleri yoğun saat kombolarına koymayın.</li>
</ul>

<h2 id="fiyat">2. Fiyatı ve kârlılığı hesaplayın</h2>
<p>Kombo fiyatı, ürünlerin ayrı ayrı toplamından düşük olmalıdır ki misafir için anlamlı olsun; ama ürünlerin toplam maliyetini rahatça karşılamalıdır. Her kombo için şunu hesaplayın:</p>
<p><strong>Kombo katkısı = Kombo fiyatı − Kombodaki ürünlerin toplam maliyeti</strong></p>
<p>Bu tutarı, ürünlerin ayrı ayrı satıldığındaki katkıyla karşılaştırın. Kombo, ayrı satıştan daha düşük katkı bırakıyorsa satış adedini artırması gerekir. Maliyet hesabı için <a href="@/blog/recete-maliyeti-hesaplama/">reçete maliyeti rehberine</a> bakın.</p>

<h2 id="gosterim">3. Menüde net gösterin</h2>
<ul>
  <li>Kombonun içinde ne olduğunu tek satırda yazın.</li>
  <li>Kombo fiyatını ve varsa ayrı alındığındaki toplamı açıkça gösterin.</li>
  <li>İçecek veya yan ürün seçimi varsa seçenekleri belirtin.</li>
  <li>Kampanyanın geçerli olduğu gün ve saatleri yazın.</li>
</ul>

<h2 id="kampanya">4. Kampanyayı planlayın ve zamanında kapatın</h2>
<p>Süreli kampanyalar (öğle menüsü, hafta içi indirimi) misafire bir neden sunar. Ama süresi geçmiş bir kampanyanın menüde kalması, misafirle tartışmaya ve güven kaybına yol açar. Kampanyanın başlangıç ve bitiş tarihini önceden belirleyin ve bitişte kampanyayı kapatmayı birinin görevi yapın.</p>

<h2 id="olcum">5. Sonucu ölçün</h2>
<p>Birkaç hafta sonra kombonun satış adedine ve bıraktığı katkıya bakın. Hiç satmayan ya da kârı eriten bir komboyu değiştirmekten çekinmeyin. Kampanyanın etkisini ölçmek için aynı dönemde başka büyük değişiklik yapmamaya çalışın.</p>

<h2 id="qr-menu-official">QR Menu Official'da kampanya ve kombo</h2>
<p>Kampanya ve kombo tanımları Temel paketten itibaren <a href="@/moduller/restoran-menu/">Restoran Menü</a> modülündedir; kampanyalı fiyat menüde ayrıca gösterilir ve kampanya görselleri menüde banner olarak yayınlanabilir. Kampanyalar panelden açılıp kapatılır; belirli saatlerde kendiliğinden devreye giren bir zamanlama varmış gibi planlamayın. Ek satış için öneri ilkelerini <a href="@/blog/restoranda-ek-satis/">ek satış yazısında</a> anlattık.</p>
`,
    faq: [
      { q: "Kombo menü nedir?", a: "Birlikte sık tercih edilen ürünlerin (örneğin ana yemek, yan ürün ve içecek) tek bir fiyatla sunulmasıdır." },
      { q: "Kombo fiyatı nasıl belirlenir?", a: "Ürünlerin ayrı ayrı toplamından düşük, ama toplam maliyeti rahatça karşılayacak şekilde. Kombo katkısını ayrı satıştaki katkıyla karşılaştırın." },
      { q: "Hangi ürünler komboya konmalı?", a: "Misafirlerin zaten birlikte tercih ettiği ve işletme için kârlı olan ürünler. Mutfağı yoğun saatte zorlayan ürünlerden kaçının." },
      { q: "Kampanya süresi geçince ne olur?", a: "Menüde kalırsa misafirle tartışmaya yol açabilir. Bitiş tarihini önceden belirleyip kampanyayı zamanında kapatmak gerekir." },
      { q: "QR Menu Official kampanyaları otomatik başlatır mı?", a: "Kampanyalar panelden açılıp kapatılır. Belirli saatlerde kendiliğinden devreye giren bir zamanlama özelliği varmış gibi planlamayın." }
    ],
    sources: [
      { label: "QR Menu Official — Restoran Menü modül sayfası", url: "https://qrmenuofficial.com/moduller/restoran-menu/" },
      { label: "T.C. Ticaret Bakanlığı — Fiyat etiketinde yeni dönem başlıyor", url: "https://ticaret.gov.tr/haberler/fiyat-etiketinde-yeni-donem-basliyor" }
    ],
    related: ["restoranda-ek-satis", "recete-maliyeti-hesaplama", "menu-fiyatlandirma"],
    products: [
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Menü Mühendisliği modülü", path: "moduller/menu-muhendisligi/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  }
];
