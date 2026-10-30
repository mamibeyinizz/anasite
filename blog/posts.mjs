/* =========================================================
   QR MENU OFFICIAL — BLOG: TEK VERİ KAYNAĞI
   Üretim: node blog/build.mjs
   Kurallar (CONTENT_STRATEGY.md): kanıtsız oran/ciro vaadi yok; ürün iddiaları
   paketler/packages-data.js ve moduller/module-data.js ile sınırlıdır.
   Gövde HTML'inde iç bağlantılar "@/yol/" ile yazılır; build göreli yola çevirir.
   h2'ler id taşır; içindekiler bunlardan üretilir.
========================================================= */

export const CATEGORIES = [
  { id: "qr-menu", name: "QR Menü", lead: "Dijital menüye geçiş, kurulum ve seçim rehberleri." },
  { id: "mevzuat", name: "Mevzuat", lead: "Fiyat listesi ve tüketici kurallarının işletmeye etkisi." },
  { id: "karlilik", name: "Menü & Kârlılık", lead: "Maliyet, fiyat ve menü mühendisliği." },
  { id: "servis", name: "Servis & Operasyon", lead: "Masa, garson çağrısı ve servis akışı." }
];

export const AUTHOR = { name: "QR Menu Official Editör Ekibi", url: "https://qrmenuofficial.com/" };

export const POSTS = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: "qr-menu-nedir",
    category: "qr-menu",
    featured: true,
    date: "2026-10-30",
    readMin: 9,
    title: "QR Menü Nedir? Restoran ve Kafeler İçin Kapsamlı Rehber",
    seoTitle: "QR Menü Nedir, Nasıl Çalışır? Restoran ve Kafe Rehberi",
    description:
      "QR menü nedir, nasıl çalışır, PDF menüden farkı ne? Restoran ve kafeler için seçim kriterleri, mevzuat notu ve geçiş adımları tek rehberde.",
    excerpt:
      "QR menü, masadaki kodu okutan misafirin menüyü uygulama indirmeden tarayıcıda açmasıdır. Ama PDF yüklemekle yönetilebilir bir menü sistemi kurmak aynı şey değil.",
    cover: "qr-menu-nedir",
    coverAlt: "Masada duran QR kodlu kart ve telefonda açılmış dijital menü ekranını gösteren koyu yeşil illüstrasyon",
    answer:
      "QR menü, masaya veya kapıya konan karekodun telefon kamerasıyla okutulmasıyla açılan web tabanlı menüdür. Misafir uygulama indirmez; işletme fiyat ve ürünleri panelden günceller, menü yeniden basılmadan güncel kalır.",
    body: `
<h2 id="tanim">QR menü tam olarak nedir?</h2>
<p>QR menü, bir karekodun içine menü sayfasının adresinin yazılmasıdır. Misafir telefonunun kamerasını koda tuttuğunda tarayıcı açılır ve menü yüklenir. Arada indirilecek bir uygulama, oluşturulacak bir hesap yoktur.</p>
<p>Burada önemli bir ayrım var: karekod yalnızca bir <strong>kapıdır</strong>. Asıl farkı kapının arkasındaki sayfa belirler. Aynı karekod bir PDF dosyasına da, mobil için tasarlanmış ve panelden yönetilen bir menüye de gidebilir.</p>

<h2 id="nasil-calisir">QR menü nasıl çalışır?</h2>
<ol>
  <li><strong>Menü verisi hazırlanır.</strong> Kategoriler, ürünler, fiyatlar, açıklamalar, görseller ve varsa alerjen bilgileri girilir.</li>
  <li><strong>Menünün bir web adresi olur.</strong> Bu adres işletmeye özeldir.</li>
  <li><strong>Adres karekoda dönüştürülür.</strong> Kod masa kartına, kapı tabelasına veya peçeteliğe basılır.</li>
  <li><strong>Misafir okutur, menü açılır.</strong> Telefonun yerleşik kamerası çoğu cihazda karekodu doğrudan tanır.</li>
  <li><strong>İşletme günceller.</strong> Fiyat veya ürün değiştiğinde karekod aynı kalır; yalnızca menü verisi değişir.</li>
</ol>
<p>Son madde, QR menüyü basılı menüden ayıran temel noktadır: fiyat değiştiğinde matbaaya gitmek gerekmez.</p>

<h3 id="masa-bazli">Masa bazlı karekod ne işe yarar?</h3>
<p>Her masaya ayrı karekod verildiğinde menü, misafirin hangi masada oturduğunu bilerek açılır. Tek başına menü için bu gerekli değildir; ama garson çağrısı, hesap isteği veya masadan sipariş gibi işlemler eklenecekse talebin hangi masadan geldiği bilinmek zorundadır. QR Menu Official'da bu, <a href="@/moduller/qr-masa/">QR Masa</a> modülüyle yapılır: masaları tanımlar, her biri için yazdırılabilir kod üretirsiniz.</p>

<h2 id="pdf-farki">PDF menü ile dijital menü arasındaki fark</h2>
<p>Pek çok işletme dijital menüye basılı menünün PDF'ini karekoda bağlayarak başlar. Hızlıdır, ama birkaç sorunu beraberinde getirir:</p>
<div class="qb-table-wrap"><table>
  <thead><tr><th>Konu</th><th>PDF menü</th><th>Panelden yönetilen dijital menü</th></tr></thead>
  <tbody>
    <tr><td>Telefonda okuma</td><td>Yakınlaştırma ve kaydırma gerekir</td><td>Ekrana göre düzenlenir</td></tr>
    <tr><td>Fiyat güncelleme</td><td>Dosya yeniden hazırlanıp yüklenir</td><td>Ürün kaydında değiştirilir</td></tr>
    <tr><td>Arama ve filtre</td><td>Yok</td><td>Ürün verisi girildiyse mümkün</td></tr>
    <tr><td>Çoklu dil</td><td>Her dil için ayrı dosya</td><td>Dil seçici ile aynı menü</td></tr>
    <tr><td>Garson çağrısı / sipariş</td><td>Yok</td><td>Sistem destekliyorsa eklenebilir</td></tr>
    <tr><td>Ölçüm</td><td>Yok denecek kadar sınırlı</td><td>Görüntüleme ve ürün tıklaması izlenebilir</td></tr>
  </tbody>
</table></div>
<p>PDF menü "yanlış" değildir; küçük ve nadiren değişen bir menü için yeterli olabilir. Ama fiyatlarınız sık değişiyorsa ya da menüyü servis akışına bağlamak istiyorsanız yönetilebilir bir sisteme ihtiyaç duyarsınız.</p>

<h2 id="mevzuat">QR menü yasal mı? Fiziki fiyat listesi gerekiyor mu?</h2>
<p>Kısa cevap: Türkiye'de masalardaki fiyat listesi karekodla gösterilebilir, ancak misafir isterse fiyat listesinin fiziksel olarak da gösterilmesi gerekir. Fiyat Etiketi Yönetmeliği'nde 11 Ekim 2025 tarihli Resmî Gazete'de yayımlanan değişiklik bu hükmü getirmiştir. Ayrıntıları ve işletme için uygulama listesini <a href="@/blog/karekod-fiyat-listesi-yonetmeligi/">karekodla fiyat listesi rehberimizde</a> anlattık.</p>
<p class="qb-note">Bu yazı hukuki danışmanlık değildir. Güncel metin için Resmî Gazete'yi ve Ticaret Bakanlığı duyurularını esas alın.</p>

<h2 id="secim">İyi bir QR menü sisteminde nelere bakmalı?</h2>
<h3 id="secim-yonetim">1. Güncelleme ne kadar kolay?</h3>
<p>Ürün, fiyat ve kategori değişikliğini kimin, hangi ekrandan, kaç adımda yaptığına bakın. Çok sayıda ürününüz varsa toplu aktarma (ör. CSV) önemli hale gelir.</p>
<h3 id="secim-mobil">2. Telefonda gerçekten okunuyor mu?</h3>
<p>Demo menüyü kendi telefonunuzda, dış mekân ışığında ve zayıf bağlantıda açın. Görsellerin geç yüklenmesi ve küçük yazı, misafirin ilk izlenimini belirler.</p>
<h3 id="secim-veri">3. Ürün bilgisi ne kadar derin tutulabiliyor?</h3>
<p>Porsiyon, ekstra, alerjen, kalori, rozet gibi alanlar yalnızca girildiğinde işe yarar. Filtreler bu veriye dayanır; sistem bunları kendisi "bilmez".</p>
<h3 id="secim-dil">4. Turist misafiriniz var mı?</h3>
<p>Çoklu dil desteğinde çevirinin nasıl girildiğini sorun: elle mi, toplu dosyayla mı, otomatik mi? Otomatik çeviri kolaydır ama yemek adlarında hata riski taşır; kontrolü siz yapmalısınız.</p>
<h3 id="secim-servis">5. Menünün ötesine geçmesi gerekiyor mu?</h3>
<p>Garson çağrısı, hesap talebi ve masadan sipariş gibi özellikler, menüyü bir servis aracına çevirir. Bunlar için talebin düştüğü bir <a href="@/moduller/servis-paneli/">servis paneli</a> gerekir. Ödeme alıp almadığını ayrıca sorun; her sistem ödeme altyapısı değildir.</p>
<h3 id="secim-olcum">6. Neyi ölçebiliyorsunuz?</h3>
<p>Menü görüntüleme ve ürün tıklaması, hangi ürünün ilgi gördüğünü gösterir. Ancak bu veri kasa satışıyla aynı şey değildir; ikisini karıştırmayın.</p>

<h2 id="adimlar">QR menüye geçiş: 7 adımlık kontrol listesi</h2>
<ol>
  <li>Mevcut menüyü tek bir tabloda toplayın: kategori, ürün adı, açıklama, fiyat.</li>
  <li>Porsiyon farkları ve ekstraları ayrı sütunlarda belirleyin.</li>
  <li>Alerjen ve içerik bilgisini mutfakla birlikte doğrulayın.</li>
  <li>Ürün fotoğraflarını aynı ışık ve açıyla, yatay ya da kare çekin.</li>
  <li>Masaları numaralandırın; masa bazlı kod kullanacaksanız listeyi çıkarın.</li>
  <li>Kodları dayanıklı malzemeye basın, okunabilirliği farklı telefonlarla test edin.</li>
  <li>Fiziki fiyat listesini talep halinde gösterebilecek şekilde hazır tutun.</li>
</ol>
<p>Menünüzü hazırlarken sık yapılan hataları <a href="@/blog/dijital-menu-nasil-hazirlanir/">dijital menü hazırlama rehberinde</a> ayrıca ele aldık.</p>

<div class="qb-cta-inline">
  <p><strong>Bir QR menünün telefonda nasıl göründüğünü görmek ister misiniz?</strong> Temel, Pro ve Plus paketlerinin demo menülerini kendi telefonunuzda açabilirsiniz.</p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "QR menü için müşterinin uygulama indirmesi gerekir mi?", a: "Hayır. Karekod okutulduğunda menü telefonun tarayıcısında açılır. Çoğu güncel telefonun kamerası karekodu doğrudan tanır." },
      { q: "QR menü ile PDF menü aynı şey mi?", a: "Değil. PDF menü basılı menünün dosyasıdır; telefonda yakınlaştırma gerektirir ve her değişiklikte yeniden yüklenir. Panelden yönetilen dijital menü ekrana göre düzenlenir ve ürün bazında güncellenir." },
      { q: "Fiyat değişince karekodu yeniden basmam gerekir mi?", a: "Karekod menünün adresini taşıdığı sürece hayır. Fiyatı panelden değiştirirsiniz; aynı kod güncel menüyü açar." },
      { q: "Yalnızca QR menü kullanmak yeterli mi?", a: "Fiyat Etiketi Yönetmeliği'ndeki 2025 değişikliğine göre masada fiyat listesi karekodla gösterilebilir; ancak tüketici isterse fiziksel olarak da gösterilmelidir. Güncel metni Resmî Gazete'den kontrol edin." },
      { q: "QR menü sipariş ve ödeme de alır mı?", a: "Sisteme göre değişir. QR Menu Official'da Pro paketten itibaren masadan sipariş, garson çağrısı ve hesap talebi servis paneline düşer; sistem ödeme tahsil etmez." }
    ],
    sources: [
      { label: "T.C. Ticaret Bakanlığı — Fiyat etiketinde yeni dönem başlıyor", url: "https://ticaret.gov.tr/haberler/fiyat-etiketinde-yeni-donem-basliyor" },
      { label: "Resmî Gazete — 11.10.2025 tarihli ve 33044 sayılı sayı", url: "https://www.resmigazete.gov.tr/eskiler/2025/10/20251011.htm" },
      { label: "ISO/IEC 18004 — QR Code bar code symbology specification", url: "https://www.iso.org/standard/62021.html" }
    ],
    related: ["dijital-menu-nasil-hazirlanir", "karekod-fiyat-listesi-yonetmeligi", "garson-cagirma-sistemi"],
    products: [
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "QR Masa modülü", path: "moduller/qr-masa/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: "karekod-fiyat-listesi-yonetmeligi",
    category: "mevzuat",
    date: "2026-10-30",
    readMin: 7,
    title: "Karekodla Fiyat Listesi: Restoran ve Kafeler İçin Yönetmelik Rehberi",
    seoTitle: "Karekodla Fiyat Listesi Yönetmeliği: Restoran Rehberi",
    description:
      "Fiyat Etiketi Yönetmeliği'nde 2025 değişikliği: masada karekodlu fiyat listesi, fiziki liste yükümlülüğü ve servis ücreti yasağı. İşletme için uyum listesi.",
    excerpt:
      "2025 değişikliğiyle masadaki fiyat listesi karekodla gösterilebilir hale geldi. Ama 'sadece QR' yeterli değil: misafir isterse fiziki listeyi göstermeniz gerekiyor.",
    cover: "karekod-fiyat-listesi-yonetmeligi",
    coverAlt: "Kapı önünde fiyat listesi panosu ve yanında karekodlu masa kartını gösteren illüstrasyon",
    answer:
      "Fiyat Etiketi Yönetmeliği'nde 11 Ekim 2025'te yürürlüğe giren değişiklikle lokanta, restoran, kafe ve pastanelerde masadaki fiyat listesi karekodla da gösterilebilir. Tüketici talep ederse fiyat listesi fiziksel olarak da gösterilmek zorundadır.",
    body: `
<p class="qb-note">Bu yazı genel bilgilendirme amaçlıdır, hukuki görüş değildir. Kurallar değişebilir; işletmeniz için güncel metni Resmî Gazete ve Ticaret Bakanlığı kaynaklarından doğrulayın.</p>

<h2 id="ne-degisti">2025 değişikliğiyle ne değişti?</h2>
<p>Ticaret Bakanlığı'nın duyurusuna göre Fiyat Etiketi Yönetmeliği'ndeki değişiklikler 11.10.2025 tarihli ve 33044 sayılı Resmî Gazete'de yayımlanarak yürürlüğe girdi. Yiyecek-içecek işletmelerini ilgilendiren başlıklar şunlar:</p>
<ul>
  <li><strong>Karekod tanımı eklendi.</strong> Yönetmelikte karekod, fiyat listesine erişimi sağlayan görsel olarak tanımlandı.</li>
  <li><strong>Masada karekod kullanılabilir.</strong> Lokanta, restoran, kafe, pastane ve benzeri işyerlerinde masalardaki fiyat listeleri karekodla da gösterilebilir.</li>
  <li><strong>Fiziki liste talep halinde zorunlu.</strong> Tüketici isterse işletme fiyat listesini fiziksel olarak da göstermekle yükümlüdür.</li>
  <li><strong>Elektronik sisteme bildirim.</strong> Kriterleri Bakanlıkça belirlenen işletmeler, fiyat listesi bilgilerini Bakanlığın elektronik sistemine aktarmakla yükümlü tutuldu.</li>
</ul>

<h2 id="onceki-durum">Önceki kural neydi?</h2>
<p>1 Ocak 2024'ten itibaren uygulanan düzenlemeyle yiyecek-içecek işletmelerinin fiyat listelerini giriş kapısında ve masalarda bulundurması istenmiş, tüketicinin fiyatı görmek için karekod okutmak zorunda bırakılmaması hedeflenmişti. 2025 değişikliği karekodu masada geçerli bir gösterim yolu olarak tanımladı, ama fiziki listeyi tamamen kaldırmadı.</p>

<h2 id="kapi">Kapı önündeki fiyat listesi ne olacak?</h2>
<p>Haberlerin ve Bakanlık açıklamalarının ortak noktası, misafirin içeri girmeden fiyatı görebilmesidir. Karekod düzenlemesi masadaki listeye ilişkindir. Kapıdaki listeyi karekodla değiştirmeden önce güncel metni ve il müdürlüğünüzün uygulamasını kontrol edin.</p>

<h2 id="servis-ucreti">Servis, masa ve kuver ücreti alınabilir mi?</h2>
<p>Bakanlık açıklamalarına göre hangi ad altında olursa olsun servis, masa veya kuver ücreti talep edilemez; bahşiş tüketicinin isteğine bağlıdır. Menüde ya da hesapta bu tür bir kalem kullanıyorsanız gözden geçirin.</p>

<h2 id="uyum-listesi">İşletmeler için uyum kontrol listesi</h2>
<ol>
  <li><strong>Kapıda okunabilir bir fiyat listesi</strong> bulundurun.</li>
  <li><strong>Masadaki karekodun gerçekten fiyat listesine gittiğinden</strong> emin olun; kodu okutup fiyatların göründüğünü test edin.</li>
  <li><strong>Talep edilirse gösterilecek basılı bir liste</strong> hazır tutun ve personelinize nerede durduğunu söyleyin.</li>
  <li><strong>Tüm fiyatlar aynı olsun.</strong> Kapıdaki, masadaki, karekoddaki ve kasadaki fiyat birbirini tutmalıdır.</li>
  <li><strong>Güncelleme sırasını belirleyin.</strong> Fiyat değiştiğinde önce dijital menü, ardından basılı liste ve kapı panosu güncellensin; tarih not edilsin.</li>
  <li><strong>Hesapta adı ne olursa olsun servis ücreti kalemi kullanmayın.</strong></li>
  <li><strong>Bildirim yükümlülüğünü kontrol edin.</strong> İşletmenizin elektronik sisteme aktarım kriterlerine girip girmediğini Bakanlık duyurularından takip edin.</li>
</ol>

<h3 id="fiyat-tutarliligi">Fiyat tutarlılığını nasıl korursunuz?</h3>
<p>Uyumsuzluk çoğunlukla bir yerin güncellenip diğerinin unutulmasından doğar. Basılı listeyi dijital menüyle aynı kaynaktan çıkarmak riski azaltır: fiyatı tek yerde değiştirir, basılı listeyi oradan alırsınız. QR Menu Official'da fiyatlar <a href="@/moduller/restoran-menu/">tek panelden</a> güncellenir; toplu indirim veya zam da panelden uygulanabilir.</p>

<h2 id="qr-menu-avantaji">Karekod düzenlemesi işletmeye ne kazandırır?</h2>
<p>Masadaki karekod geçerli bir gösterim yolu olunca, sık değişen fiyatlar için her masaya yeniden basılı liste koyma yükü hafifler. Dijital menü ayrıca ürün açıklaması, görsel, alerjen ve dil seçeneği gibi basılı listenin taşıyamadığı bilgileri sunabilir. Yine de bu bir "basılıdan tamamen kurtulma" düzenlemesi değildir.</p>
<p>Dijital menünün temellerini merak ediyorsanız <a href="@/blog/qr-menu-nedir/">QR menü nedir rehberimize</a> göz atın.</p>

<div class="qb-cta-inline">
  <p><strong>Fiyatlarınızı tek panelden güncelleyin.</strong> Paketlerde hangi menü özelliklerinin olduğunu karşılaştırın.</p>
  <a class="qb-btn" href="@/paketler/">Paketleri İnceleyin <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Restoranda yalnızca QR menü kullanmak yasak mı?", a: "2025 değişikliğiyle masada fiyat listesi karekodla gösterilebilir. Ancak tüketici talep ederse fiyat listesinin fiziksel olarak da gösterilmesi gerekir; yani basılı liste hazır olmalıdır." },
      { q: "Değişiklik ne zaman yürürlüğe girdi?", a: "Ticaret Bakanlığı'na göre değişiklikler 11.10.2025 tarihli ve 33044 sayılı Resmî Gazete'de yayımlanarak yürürlüğe girdi." },
      { q: "Servis ücreti almak serbest mi?", a: "Bakanlık açıklamalarına göre servis, masa veya kuver ücreti hangi ad altında olursa olsun talep edilemez; bahşiş isteğe bağlıdır." },
      { q: "Fiyat listesini Bakanlığa bildirmek zorunlu mu?", a: "Kriterleri Bakanlıkça belirlenen işletmeler için evet. İşletmenizin bu kapsamda olup olmadığını Bakanlık duyurularından takip edin." }
    ],
    sources: [
      { label: "T.C. Ticaret Bakanlığı — Fiyat etiketinde yeni dönem başlıyor", url: "https://ticaret.gov.tr/haberler/fiyat-etiketinde-yeni-donem-basliyor" },
      { label: "Resmî Gazete — 11.10.2025 tarihli ve 33044 sayılı sayı", url: "https://www.resmigazete.gov.tr/eskiler/2025/10/20251011.htm" },
      { label: "Mevzuat Bilgi Sistemi — Fiyat Etiketi Yönetmeliği", url: "https://www.mevzuat.gov.tr/" }
    ],
    related: ["qr-menu-nedir", "dijital-menu-nasil-hazirlanir", "menu-muhendisligi-nedir"],
    products: [
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Sıkça sorulan sorular", path: "sss/" }
    ]
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: "menu-muhendisligi-nedir",
    category: "karlilik",
    date: "2026-10-30",
    readMin: 10,
    title: "Menü Mühendisliği Nedir? Restoran Menüsünde Kârlılık Analizi",
    seoTitle: "Menü Mühendisliği Nedir? Adım Adım Restoran Menü Analizi",
    description:
      "Menü mühendisliği nedir, nasıl yapılır? Katkı payı ve popülerlik hesabı, yıldız-at-bulmaca-köpek matrisi, örnek tablo ve her grup için aksiyon listesi.",
    excerpt:
      "Çok satan ürün her zaman en çok kazandıran ürün değildir. Menü mühendisliği, her ürünü satış adedi ve tabak başına katkısıyla birlikte okumanın yöntemidir.",
    cover: "menu-muhendisligi-nedir",
    coverAlt: "Dört bölgeye ayrılmış popülerlik ve kârlılık matrisi üzerinde yıldız, at, soru işareti ve köpek simgeleri",
    answer:
      "Menü mühendisliği, menüdeki her ürünü iki ölçüye göre sınıflandırma yöntemidir: ne kadar satıldığı (popülerlik) ve satış fiyatından maliyet düşüldükten sonra tabak başına ne bıraktığı (katkı payı). Sonuç dört gruptur: yıldız, at, bulmaca ve köpek.",
    body: `
<h2 id="tanim">Menü mühendisliği ne demek?</h2>
<p>Menü mühendisliği, Michael Kasavana ve Donald Smith'in 1982'de yayımladığı yöntemle yaygınlaşmış bir menü analizidir. Temel fikri basittir: bir ürünü değerlendirmek için yalnızca kaç adet satıldığına değil, her satışta işletmeye ne bıraktığına da bakılır. Türkiye'de turizm ve gastronomi alanında bu yöntemi otel ve restoran menüleri üzerinde uygulayan akademik çalışmalar bulunur.</p>

<h2 id="iki-olcu">Hangi iki ölçü kullanılır?</h2>
<h3 id="katki-payi">Katkı payı</h3>
<p><strong>Katkı payı = Satış fiyatı − Ürün maliyeti.</strong> Burada maliyet, tabağa giren malzemelerin maliyetidir (reçete maliyeti). Kira ve personel gibi sabit giderler bu hesaba girmez; onlar katkı paylarının toplamından karşılanır.</p>
<h3 id="populerlik">Popülerlik</h3>
<p>Bir ürünün, aynı kategorideki toplam satış içindeki payıdır. Kasavana-Smith yaklaşımında yaygın eşik, kategorideki ürün sayısına göre beklenen payın %70'idir. Örneğin kategoride 10 ürün varsa her birinin beklenen payı %10'dur; %7'nin üzerinde satan ürün "popüler" sayılır.</p>

<h2 id="matris">Dört grup: yıldız, at, bulmaca, köpek</h2>
<div class="qb-matrix" role="table" aria-label="Menü mühendisliği matrisi">
  <div role="row"><div class="qb-matrix__cell qb-matrix__cell--plow" role="cell"><strong>At</strong><span>Popüler, katkısı düşük</span></div><div class="qb-matrix__cell qb-matrix__cell--star" role="cell"><strong>Yıldız</strong><span>Popüler, katkısı yüksek</span></div></div>
  <div role="row"><div class="qb-matrix__cell qb-matrix__cell--dog" role="cell"><strong>Köpek</strong><span>Az satıyor, katkısı düşük</span></div><div class="qb-matrix__cell qb-matrix__cell--puzzle" role="cell"><strong>Bulmaca</strong><span>Az satıyor, katkısı yüksek</span></div></div>
</div>
<p class="qb-caption">Dikey eksen popülerlik, yatay eksen katkı payıdır.</p>

<h2 id="adim-adim">Menü mühendisliği adım adım nasıl yapılır?</h2>
<ol>
  <li><strong>Dönemi seçin.</strong> Bir ay gibi, menünün değişmediği bir zaman aralığı alın.</li>
  <li><strong>Kategori bazında çalışın.</strong> Tatlıyı ana yemekle karşılaştırmak yanıltır.</li>
  <li><strong>Her ürünün satış adedini çıkarın.</strong> Kaynak, kasa veya adisyon kayıtlarıdır.</li>
  <li><strong>Reçete maliyetini hesaplayın.</strong> Malzeme miktarı × birim fiyat; fire payını da ekleyin.</li>
  <li><strong>Katkı payını bulun</strong> ve kategorinin ağırlıklı ortalama katkı payını hesaplayın (toplam katkı ÷ toplam adet).</li>
  <li><strong>Popülerlik eşiğini hesaplayın</strong> (1 ÷ ürün sayısı × 0,70).</li>
  <li><strong>Her ürünü dört gruptan birine yerleştirin.</strong></li>
</ol>

<h3 id="ornek">Örnek hesap (temsili rakamlarla)</h3>
<p>Aşağıdaki tablo yöntemi göstermek için uydurulmuş <strong>temsili</strong> değerler içerir; gerçek bir işletmeye ait değildir.</p>
<div class="qb-table-wrap"><table>
  <thead><tr><th>Ürün</th><th>Adet</th><th>Fiyat</th><th>Maliyet</th><th>Katkı</th><th>Grup</th></tr></thead>
  <tbody>
    <tr><td>Ürün A</td><td>120</td><td>400</td><td>140</td><td>260</td><td>Yıldız</td></tr>
    <tr><td>Ürün B</td><td>150</td><td>320</td><td>170</td><td>150</td><td>At</td></tr>
    <tr><td>Ürün C</td><td>30</td><td>450</td><td>150</td><td>300</td><td>Bulmaca</td></tr>
    <tr><td>Ürün D</td><td>25</td><td>300</td><td>180</td><td>120</td><td>Köpek</td></tr>
  </tbody>
</table></div>
<p>Dört ürün için popülerlik eşiği %17,5'tir (¼ × 0,70). Toplam 325 adette Ürün C (%9,2) ve D (%7,7) eşiğin altında kalır. Ağırlıklı ortalama katkı yaklaşık 200'dür; A ve C bunun üzerindedir.</p>

<h2 id="aksiyonlar">Her grup için ne yapılır?</h2>
<h3 id="yildiz">Yıldız: koruyun</h3>
<p>Reçeteyi ve sunumu standart tutun, menüde görünür yerde bırakın. Fiyat hassasiyetini küçük adımlarla test edebilirsiniz.</p>
<h3 id="at">At: maliyeti gözden geçirin</h3>
<p>Misafir seviyor ama tabak başına az bırakıyor. Porsiyonu, pahalı bir bileşeni veya garnitürü yeniden düşünün; yüksek katkılı bir yan ürünle birlikte önerin.</p>
<h3 id="bulmaca">Bulmaca: görünür yapın</h3>
<p>Kazandırıyor ama az seçiliyor. Adını ve açıklamasını iyileştirin, iyi bir fotoğraf ekleyin, menüde öne alın veya "Önerilen" gibi bir rozetle işaretleyin. Personelin önerebilmesi için tadımını yaptırın.</p>
<h3 id="kopek">Köpek: karar verin</h3>
<p>Menüden çıkarmayı, yeniden kurgulamayı veya fiyatlamayı değerlendirin. Bazı ürünler başka bir ürünün satışını taşıdığı için (ör. çocuk menüsü) bilerek tutulur; bu kararı veriyle verin.</p>

<h2 id="hatalar">Sık yapılan hatalar</h2>
<ul>
  <li><strong>Maliyeti tahmin etmek.</strong> Analiz, maliyet verisi kadar doğrudur. Malzeme fiyatı değiştiğinde maliyet de güncellenmelidir.</li>
  <li><strong>Kategorileri karıştırmak.</strong> İçecekle ana yemek aynı matriste kıyaslanmaz.</li>
  <li><strong>Tek seferlik yapmak.</strong> Fiyatlar ve maliyetler değiştikçe analiz düzenli tekrarlanmalıdır.</li>
  <li><strong>Menü görüntülemesini satış sanmak.</strong> Dijital menüde bir ürünün çok tıklanması, çok satıldığı anlamına gelmez.</li>
</ul>

<h2 id="dijital">Menü mühendisliği dijital menüde nasıl yapılır?</h2>
<p>Tabloyla yapılabilir; ama ürün ve fiyat zaten dijital menüdeyse maliyeti de aynı yerde tutmak iş yükünü azaltır. QR Menu Official'ın <a href="@/moduller/menu-muhendisligi/">Menü Mühendisliği</a> modülünde malzeme birim fiyatı ve reçeteden ürün maliyeti hesaplanır ya da maliyet doğrudan girilir; ürünler satış ve maliyet verisine göre popülerlik ve kârlılık gruplarına yerleştirilir. <strong>Maliyeti girilmeyen ürün matrise alınmaz</strong> — yöntem sizin verinizle çalışır, kendi kendine kârlılık üretmez.</p>
<p>Analiz sonrası bulmaca ürünleri öne çıkarmak için menü düzeni de önemlidir; <a href="@/blog/dijital-menu-nasil-hazirlanir/">dijital menü hazırlama rehberine</a> bakın.</p>

<div class="qb-cta-inline">
  <p><strong>Ürünlerinizin popülerlik ve kârlılığını yan yana görün.</strong> Menü Mühendisliği Plus pakette yer alır.</p>
  <a class="qb-btn" href="@/moduller/menu-muhendisligi/">Modülü İnceleyin <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Menü mühendisliği için hangi veriler gerekir?", a: "Belirli bir dönemdeki ürün bazlı satış adetleri, satış fiyatları ve her ürünün reçete maliyeti. Maliyet verisi olmadan katkı payı hesaplanamaz." },
      { q: "Popülerlik eşiği nasıl hesaplanır?", a: "Kasavana-Smith yaklaşımında yaygın kullanım: (1 ÷ kategorideki ürün sayısı) × 0,70. Bu oranın üzerinde pay alan ürün popüler kabul edilir." },
      { q: "Menü mühendisliği ne sıklıkla yapılmalı?", a: "Sabit bir kural yoktur. Malzeme fiyatları, menü fiyatları veya menü içeriği değiştiğinde analizin tekrarlanması anlamlıdır." },
      { q: "Köpek ürünleri hemen menüden çıkarmalı mıyım?", a: "Her zaman değil. Bazı ürünler başka satışları desteklediği veya belirli bir misafir grubunu karşıladığı için tutulabilir. Karar verirken maliyet ve satış verisini birlikte değerlendirin." },
      { q: "Dijital menüdeki tıklama verisi satış verisi yerine kullanılabilir mi?", a: "Hayır. Tıklama ilgiyi gösterir; satış adedi için kasa veya sipariş kayıtları gerekir." }
    ],
    sources: [
      { label: "Kasavana, M. L. & Smith, D. I. (1982). Menu Engineering: A Practical Guide to Menu Analysis", url: "https://search.worldcat.org/search?q=Menu+Engineering+Kasavana+Smith+1982" },
      { label: "DergiPark — Menü mühendisliği üzerine Türkçe akademik çalışmalar", url: "https://dergipark.org.tr/tr/search?q=men%C3%BC+m%C3%BChendisli%C4%9Fi" },
      { label: "YÖK Açık Bilim — Yiyecek içecek işletmelerinde menü mühendisliği ve fiyatlama yöntemlerinin analizi", url: "https://acikbilim.yok.gov.tr/handle/20.500.12812/150035" }
    ],
    related: ["dijital-menu-nasil-hazirlanir", "qr-menu-nedir", "garson-cagirma-sistemi"],
    products: [
      { label: "Menü Mühendisliği modülü", path: "moduller/menu-muhendisligi/" },
      { label: "QR Analytics modülü", path: "moduller/qr-analytics/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: "dijital-menu-nasil-hazirlanir",
    category: "qr-menu",
    date: "2026-10-30",
    readMin: 8,
    title: "Dijital Menü Nasıl Hazırlanır? Kafe ve Restoranlar İçin Adım Adım",
    seoTitle: "Dijital Menü Nasıl Hazırlanır? Kafe ve Restoran Rehberi",
    description:
      "Kafe ve restoran için dijital menü hazırlama: ürün tablosu, kategori yapısı, açıklama yazımı, fotoğraf, alerjen, çoklu dil ve yayına alma kontrol listesi.",
    excerpt:
      "İyi bir dijital menü, basılı menünün telefona taşınmış hali değildir. Kategori sırasından ürün açıklamasına kadar küçük kararlar, misafirin menüde ne kadar rahat gezindiğini belirler.",
    cover: "dijital-menu-nasil-hazirlanir",
    coverAlt: "Telefon ekranında kategori sekmeleri ve ürün kartları bulunan dijital menü taslağı illüstrasyonu",
    answer:
      "Dijital menü hazırlamak için önce tüm ürünleri kategori, ad, açıklama, fiyat, porsiyon ve alerjen sütunları olan tek bir tabloda toplayın; kategorileri misafirin sipariş sırasına göre dizin; ürün fotoğraflarını aynı standartta çekin; menüyü bir dijital menü sistemine aktarıp karekodu masalarda test ederek yayına alın.",
    body: `
<h2 id="tablo">1. Bütün menüyü tek tabloda toplayın</h2>
<p>Dijital menünün temeli bir tablodur. Her satır bir ürün, her sütun bir bilgi olsun: kategori, ürün adı, kısa açıklama, fiyat, porsiyon seçenekleri, ekstralar, alerjenler, varsa kalori. Bu tablo hem menüyü sisteme aktarmayı hızlandırır hem de mutfakla bilgi doğrulamayı kolaylaştırır. QR Menu Official'da ürünler örnek dosyaya göre hazırlanıp <strong>CSV ile toplu aktarılabilir</strong>; fiyatı geçersiz satırlar aktarımdan sonra bildirilir.</p>

<h2 id="kategori">2. Kategorileri sipariş sırasına göre dizin</h2>
<p>Misafir menüde genellikle yukarıdan aşağı ilerler. Kahvaltı, başlangıç, ana yemek, tatlı, içecek gibi doğal bir sıra izleyin. Kafede sıcak ve soğuk içecekleri ayırmak, "kahve" altında 30 ürünlük bir liste bırakmaktan daha okunur olur.</p>
<ul>
  <li>Kategori adlarını kısa tutun; telefonda sekme olarak görünecekler.</li>
  <li>Tek ürünlük kategori açmayın; benzer bir kategoriyle birleştirin.</li>
  <li>Sezonluk ürünleri ayrı kategoride değil, ilgili kategoride rozetle gösterin.</li>
</ul>

<h2 id="aciklama">3. Ürün açıklamalarını misafir için yazın</h2>
<p>İyi açıklama üç soruya cevap verir: içinde ne var, nasıl hazırlanıyor, neden seçilmeli. 1–2 cümle yeterlidir.</p>
<div class="qb-compare">
  <div><span class="qb-compare__tag qb-compare__tag--weak">Zayıf</span><p>Tavuk sote.</p></div>
  <div><span class="qb-compare__tag">Daha iyi</span><p>Közlenmiş biber ve mantarla sotelenmiş tavuk but, tereyağlı pilav ile.</p></div>
</div>
<p>Abartılı sıfatlar yerine somut malzeme ve pişirme yöntemi kullanın. Misafir alerjen veya içerik sorusunu personele sormadan önce açıklamada cevabını aramalıdır.</p>

<h2 id="fiyat">4. Porsiyon ve ekstraları fiyattan ayırın</h2>
<p>"Küçük / büyük" veya "ekstra peynir" gibi seçenekleri ayrı ürün olarak açmak menüyü kalabalıklaştırır. Ürüne taban fiyat verip porsiyon farkı ve ekstraları bunun üzerine eklemek daha düzenlidir. Aynı ekstra listesi (ör. süt seçenekleri) birçok üründe tekrar kullanılabilir.</p>

<h2 id="foto">5. Fotoğrafları tek standartta çekin</h2>
<ul>
  <li>Aynı ışık, aynı açı, aynı zemin. Gün ışığı alan bir masa çoğu zaman yeterlidir.</li>
  <li>Kare veya yatay kadraj seçin ve tüm menüde koruyun.</li>
  <li>Tabağı gerçek porsiyonla çekin; misafirin beklentisi fotoğraftan oluşur.</li>
  <li>Görselleri yüklemeden önce küçültün; büyük dosyalar mobil veride menüyü yavaşlatır.</li>
</ul>
<p>Her ürüne fotoğraf şart değildir. Öne çıkarmak istediğiniz ürünlere öncelik verin; <a href="@/blog/menu-muhendisligi-nedir/">menü mühendisliğinde</a> "bulmaca" grubundaki ürünler iyi bir başlangıç noktasıdır.</p>

<h2 id="alerjen">6. Alerjen ve içerik bilgisini doğrulayın</h2>
<p>Alerjen bilgisi mutfakla birlikte, reçeteye bakılarak girilmelidir. Dijital menüdeki "glutensiz" veya "alerjen hariç tut" filtresi yalnızca bu bilgi girildiyse çalışır; sistem bir ürünün içeriğini kendiliğinden bilemez. Reçete değiştiğinde menüdeki bilgi de değişmelidir.</p>
<p>Misafir alerjen, kalori veya fiyat aralığına göre süzmek istiyorsa <a href="@/moduller/akilli-filtreleme/">Akıllı Filtreleme</a> bu veriyi kullanır.</p>

<h2 id="dil">7. Yabancı misafiriniz varsa dil seçeneği ekleyin</h2>
<p>Turistik bölgedeki bir işletme için menünün İngilizce, Arapça veya Rusça gibi dillerde açılması doğrudan sipariş kolaylığıdır. Çevirileri yemek adlarını bilen biriyle kontrol edin; birebir çeviri bazen yanlış beklenti yaratır. <a href="@/moduller/coklu-dil/">Çoklu Dil</a> modülünde göstereceğiniz dilleri seçer, çevirileri CSV ile toplu girebilirsiniz.</p>

<h2 id="rozet">8. Rozet ve kampanyayı ölçülü kullanın</h2>
<p>"Yeni", "Popüler", "Önerilen" gibi rozetler misafirin gözünü yönlendirir; ama her ürüne rozet koymak hiçbirini öne çıkarmaz. Kategori başına bir-iki rozet yeterlidir. Kampanyaları menünün üstünde görselle göstermek, ürün listesinin içine gömmekten daha etkilidir.</p>

<h2 id="yayin">9. Yayına almadan önce test edin</h2>
<ol>
  <li>Menüyü en az iki farklı telefonda (Android ve iPhone) açın.</li>
  <li>Mobil veriyle, Wi-Fi olmadan yükleme süresine bakın.</li>
  <li>Masa kartındaki karekodu farklı mesafe ve ışıkta okutun.</li>
  <li>Rastgele beş ürünün fiyatını kasadaki fiyatla karşılaştırın.</li>
  <li>Bir personele menüde belirli bir ürünü bulmasını isteyin; nerede zorlandığını not edin.</li>
</ol>
<p>Fiyat listesine ilişkin yükümlülükleri unutmayın: misafir isterse basılı listeyi gösterebilmelisiniz. Ayrıntılar <a href="@/blog/karekod-fiyat-listesi-yonetmeligi/">karekodla fiyat listesi rehberinde</a>.</p>

<div class="qb-cta-inline">
  <p><strong>Hazırladığınız menünün telefonda nasıl görüneceğini merak ediyor musunuz?</strong> Demo menüyü açıp deneyin.</p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Dijital menü hazırlamak için tasarım bilgisi gerekir mi?", a: "Hazır bir dijital menü sistemi kullanıyorsanız genellikle gerekmez; tasarım sistemin şablonundan gelir. Sizin işiniz doğru ve düzenli ürün verisi hazırlamaktır." },
      { q: "Her ürüne fotoğraf koymak şart mı?", a: "Hayır. Fotoğraf eklemek istediğiniz ürünleri seçin ve hepsini aynı standartta çekin. Kalitesiz bir fotoğraf, fotoğrafsız üründen daha kötü izlenim bırakabilir." },
      { q: "Menüyü sisteme tek tek mi girmem gerekir?", a: "Sisteme bağlıdır. QR Menu Official'da ürünler örnek dosyaya göre hazırlanıp CSV ile toplu aktarılabilir." },
      { q: "Alerjen filtresi otomatik çalışır mı?", a: "Hayır. Filtre, ürünlere girilmiş alerjen bilgisine dayanır. Bilgiyi mutfakla birlikte doğrulayıp girmeniz gerekir." }
    ],
    sources: [
      { label: "T.C. Ticaret Bakanlığı — Fiyat etiketinde yeni dönem başlıyor", url: "https://ticaret.gov.tr/haberler/fiyat-etiketinde-yeni-donem-basliyor" },
      { label: "web.dev — Görselleri optimize etme", url: "https://web.dev/learn/images" }
    ],
    related: ["qr-menu-nedir", "menu-muhendisligi-nedir", "karekod-fiyat-listesi-yonetmeligi"],
    products: [
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Çoklu Dil modülü", path: "moduller/coklu-dil/" },
      { label: "Akıllı Filtreleme modülü", path: "moduller/akilli-filtreleme/" }
    ]
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: "garson-cagirma-sistemi",
    category: "servis",
    date: "2026-10-30",
    readMin: 8,
    title: "Garson Çağırma Sistemi: QR ile Masadan Servis Talebi Nasıl Yönetilir?",
    seoTitle: "Garson Çağırma Sistemi Nedir? QR Menüyle Masadan Çağrı",
    description:
      "Garson çağırma sistemi nedir, buton ile QR çağrı arasındaki fark ne? Hesap talebi, servis paneli, personel rolleri ve kurulum öncesi kontrol listesi.",
    excerpt:
      "Yoğun saatte el kaldıran misafiri fark etmek zordur. QR tabanlı çağrı, talebi masa bilgisiyle bir ekrana düşürür; ama asıl işi o ekranı kimin, nasıl izlediği belirler.",
    cover: "garson-cagirma-sistemi",
    coverAlt: "Masa numaralı çağrı kartlarının sıralandığı servis paneli ekranı ve zil simgesi illüstrasyonu",
    answer:
      "Garson çağırma sistemi, misafirin masadan bir butona veya QR menüdeki bir düğmeye dokunarak personele haber vermesini sağlar. QR tabanlı sistemde talep, masa bilgisiyle birlikte personelin izlediği bir servis paneline düşer; personel talebi görüp karşılar.",
    body: `
<h2 id="neden">Garson çağırma sistemi neden gerekir?</h2>
<p>Yoğun saatte garsonun dikkati sipariş taşımak, masa toplamak ve mutfakla konuşmak arasında bölünür. El kaldıran misafiri fark etmek gecikebilir; misafir de birini yakalamak için beklemek zorunda kalır. Çağrı sistemi bu talebi görünür bir kayda çevirir: hangi masa, ne istedi, ne zaman istedi.</p>

<h2 id="turler">Hangi türleri var?</h2>
<h3 id="buton">Masa üstü çağrı butonu</h3>
<p>Masaya konan kablosuz bir buton, bir ekrana veya personelin bilekliğine sinyal gönderir. Kurulumu fiziksel cihaz gerektirir; pil, kayıp ve temizlik konularını yönetmeniz gerekir. Genelde yalnızca "çağrı" bilgisini iletir.</p>
<h3 id="qr">QR menü üzerinden çağrı</h3>
<p>Misafir zaten açtığı dijital menüdeki "Garson çağır" veya "Hesap iste" düğmesine dokunur. Ek cihaz yoktur; talebin hangi masadan geldiği masa bazlı karekoddan bilinir. Aynı ekranda sipariş ve hesap talebi de toplanabilir.</p>
<div class="qb-table-wrap"><table>
  <thead><tr><th>Konu</th><th>Fiziksel buton</th><th>QR menü çağrısı</th></tr></thead>
  <tbody>
    <tr><td>Donanım</td><td>Masa başına cihaz</td><td>Basılı masa kodu yeterli</td></tr>
    <tr><td>Talep türü</td><td>Çoğunlukla tek tip çağrı</td><td>Garson, hesap, sipariş ayrımı yapılabilir</td></tr>
    <tr><td>Misafirin telefonu</td><td>Gerekmez</td><td>Gerekir</td></tr>
    <tr><td>Kayıt</td><td>Sisteme göre değişir</td><td>Panelde talep listesi tutulur</td></tr>
  </tbody>
</table></div>
<p>Her işletme için tek doğru yoktur. Misafir profilinizde telefon kullanmak istemeyenler çoksa fiziksel yöntem ya da klasik servis ön planda kalmalıdır.</p>

<h2 id="nasil">QR ile garson çağrısı nasıl çalışır?</h2>
<ol>
  <li>Her masaya kendi karekodu konur.</li>
  <li>Misafir kodu okutur; menü masa bilgisiyle açılır.</li>
  <li>Misafir "Garson çağır" veya "Hesap iste" der.</li>
  <li>Talep, masa numarasıyla servis paneline kart olarak düşer.</li>
  <li>Personel talebi görür, masaya gider ve kartı kapatır.</li>
</ol>
<p>QR Menu Official'da bu akış Pro paketten itibaren gelir: <a href="@/moduller/servis-paneli/">Servis Paneli</a> sipariş, garson çağrısı ve hesap taleplerini aynı ekranda masa bilgisiyle gösterir; sesli uyarı ve masaüstü bildirimi verebilir. <strong>Hesap talebi ödeme almaz</strong>; yalnızca hesabın masaya getirilmesi isteğini iletir.</p>

<h2 id="panel">Asıl iş: paneli kim izleyecek?</h2>
<p>Çağrı sistemi kendi başına servis yapmaz. Talep ekrana düşer; onu fark edecek bir insan gerekir. Kurulumdan önce şu soruları cevaplayın:</p>
<ul>
  <li><strong>Ekran nerede duracak?</strong> Bar, kasa veya pass bölümü gibi personelin sık baktığı bir noktada olmalı.</li>
  <li><strong>Sesli uyarı duyulabilir mi?</strong> Mutfak ve müzik gürültüsünü hesaba katın.</li>
  <li><strong>Kim sorumlu?</strong> Bölge bazlı mı, sıradaki boş garson mu? Kural belirsizse talep "herkesin işi" olup kimsenin işi olmaz.</li>
  <li><strong>Talep ne zaman kapanır?</strong> Personel masaya gittiğinde kapatılmalı; açık kalan kartlar ekranı anlamsızlaştırır.</li>
</ul>

<h2 id="roller">Personel erişimi nasıl ayarlanmalı?</h2>
<p>Garson veya mutfak personelinin menü fiyatlarını ya da işletme ayarlarını görmesine gerek yoktur. Sınırlı bir servis rolü, yalnızca paneli görür. QR Menu Official'da garson ve mutfak için bu tür bir rol bulunur; bu rolle giren kullanıcı menüyü ve ayarları görmez.</p>

<h2 id="kotuye">Masa dışından çağrı yapılabilir mi?</h2>
<p>Masa karekodunun fotoğrafı başka yerden okutulursa ne olur? Bu, QR tabanlı sistemlerde sorulması gereken doğru bir sorudur. QR Menu Official'da karekod okutulduğunda imzalı ve süresi sınırlı bir masa oturumu başlar; süre ve hareketsizlik limitini işletme belirler. Bu, riski azaltan bir önlemdir; gerçek bağlantıya sahip birinin erişimini tamamen engellediği iddia edilemez. Ayrıntılar <a href="@/moduller/masa-oturum-guvenligi/">Masa Oturum Güvenliği</a> sayfasında.</p>

<h2 id="kontrol">Kurulum öncesi kontrol listesi</h2>
<ol>
  <li>Masa listesini çıkarın ve numaraları fiziksel masalarla eşleştirin.</li>
  <li>Panelin duracağı cihazı ve konumunu belirleyin.</li>
  <li>Sesli uyarıyı servis saatinde test edin.</li>
  <li>Kimin hangi talebi karşılayacağını yazılı kurala bağlayın.</li>
  <li>Personele paneli 10 dakikalık bir provayla gösterin.</li>
  <li>İlk haftada açık kalan talepleri ve misafir geri bildirimini izleyin.</li>
</ol>
<p>Masa kodlarının nasıl hazırlanacağını <a href="@/blog/qr-menu-nedir/">QR menü rehberinde</a> anlattık.</p>

<div class="qb-cta-inline">
  <p><strong>Garson çağrısı ve hesap talebinin panele nasıl düştüğünü görün.</strong> Pro ve Plus demo menülerinde deneyebilirsiniz.</p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Garson çağırma sistemi için ek donanım gerekir mi?", a: "Fiziksel buton sistemlerinde evet. QR tabanlı sistemlerde masa başına basılı karekod ve personelin izleyeceği bir ekran (bilgisayar, tablet veya telefon) yeterlidir." },
      { q: "Hesap iste düğmesi ödeme alır mı?", a: "QR Menu Official'da hayır. Hesap talebi yalnızca hesabın masaya getirilmesi isteğini servis paneline iletir; ödeme tahsil edilmez." },
      { q: "Çağrılar personele nasıl bildirilir?", a: "Talep servis paneline masa bilgisiyle kart olarak düşer. Panel sesli uyarı ve masaüstü bildirimi verebilir." },
      { q: "Garsonlar menü fiyatlarını değiştirebilir mi?", a: "Sınırlı servis rolüyle giren personel yalnızca servis panelini görür; menüyü ve ayarları göremez." },
      { q: "Hangi pakette garson çağrısı var?", a: "QR Menu Official'da garson çağrısı, hesap talebi ve servis paneli Pro paketten itibaren sunulur." }
    ],
    sources: [
      { label: "QR Menu Official — Servis Paneli modül sayfası", url: "https://qrmenuofficial.com/moduller/servis-paneli/" },
      { label: "MDN — Notifications API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API" },
      { label: "T.C. Ticaret Bakanlığı — Fiyat etiketinde yeni dönem başlıyor", url: "https://ticaret.gov.tr/haberler/fiyat-etiketinde-yeni-donem-basliyor" }
    ],
    related: ["qr-menu-nedir", "dijital-menu-nasil-hazirlanir", "menu-muhendisligi-nedir"],
    products: [
      { label: "Servis Paneli modülü", path: "moduller/servis-paneli/" },
      { label: "QR Masa modülü", path: "moduller/qr-masa/" },
      { label: "Masa Oturum Güvenliği", path: "moduller/masa-oturum-guvenligi/" }
    ]
  }
];
