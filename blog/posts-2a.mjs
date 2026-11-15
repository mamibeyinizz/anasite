/* =========================================================
   BLOG — 2. PAKET (1/2). posts.mjs bu diziyi POSTS'a ekler.
   Kurallar posts.mjs başlığındakiyle aynıdır: kanıtsız oran/ciro vaadi yok,
   ürün iddiaları paketler/packages-data.js ile sınırlı.
========================================================= */

export const POSTS_2A = [
  /* ------------------------------------------------------------------ 6 */
  {
    slug: "restoran-fiyat-artisi-menuye-nasil-yansitilir",
    category: "karlilik",
    date: "2026-11-15",
    readMin: 8,
    title: "Restoranlarda Fiyat Artışı Menüye Nasıl Yansıtılır? Misafiri Kaçırmadan Zam Rehberi",
    seoTitle: "Restoranda Fiyat Artışı Nasıl Yapılır? Menüye Zam Rehberi",
    description:
      "Maliyetler artarken menüye zam nasıl yapılır? Hangi ürüne ne zaman zam, porsiyon ve kombo seçenekleri, misafire iletişim ve fiyat etiketi kuralları.",
    excerpt:
      "Girdi maliyetleri her ay değişirken menü fiyatını aynı tutmak kârı eritir; tek seferde büyük zam ise misafiri ürkütür. Aradaki yol, ürün bazında ve verilerle karar vermektir.",
    cover: "restoran-fiyat-artisi-menuye-nasil-yansitilir",
    coverAlt: "Yükselen fiyat grafiği ile menü kartını ve fiyat etiketini gösteren koyu yeşil illüstrasyon",
    answer:
      "Fiyat artışını menünün tamamına aynı oranda yansıtmak yerine ürün bazında karar verin: önce maliyeti en çok artan ve en çok satan ürünleri hesaplayın, artışı küçük ve düzenli adımlarla yapın, porsiyon ve kombo seçenekleriyle misafire alternatif bırakın. Fiyat listesini her değişiklikte güncel tutmak yasal zorunluluktur.",
    body: `
<h2 id="neden-zor">Fiyat artışı neden bu kadar zor bir karar?</h2>
<p>Restoran sahibi iki baskı arasında kalır. Bir yanda et, süt ürünü, yağ, enerji ve kira gibi kalemler düzenli olarak artar. Öbür yanda misafir, her ziyaretinde fiyatın değiştiğini gördüğünde güvenini kaybedebilir. Zammı geciktirmek, artan maliyetin kârdan ödenmesi demektir; aceleyle ve toptan yapılan zam ise müdavim kaybı riskini büyütür.</p>
<p>Bu yüzden asıl soru "zam yapmalı mıyım?" değil, "hangi ürüne, ne kadar ve nasıl?" sorusudur. Bu soruya cevap vermek için önce elinizdeki rakamları netleştirmeniz gerekir.</p>

<h2 id="once-maliyet">1. Adım: Ürün maliyetini tek tek çıkarın</h2>
<p>Menüdeki her ürünün bir reçetesi vardır: hangi malzemeden ne kadar kullanıldığı. Malzemelerin güncel alış fiyatı bu reçeteyle çarpıldığında ürünün maliyeti ortaya çıkar. Satış fiyatından bu maliyeti çıkardığınızda ürün başına kalan katkıyı görürsünüz.</p>
<ul>
  <li><strong>Reçeteyi gramajla yazın.</strong> "Bir avuç peynir" değil, "60 g peynir". Ölçü belirsizse maliyet de belirsizdir.</li>
  <li><strong>Fire payını ekleyin.</strong> Ayıklama, pişirme kaybı ve bozulma maliyetin parçasıdır.</li>
  <li><strong>Alış fiyatını güncel tutun.</strong> Geçen ayın faturasıyla hesaplanan maliyet bugünün kararını yanıltır.</li>
</ul>
<p>Bu hesabı defterde ya da tabloda yapabilirsiniz. QR Menu Official'ın Plus paketinde <a href="@/moduller/menu-muhendisligi/">maliyet ve reçete</a> ekranı, malzeme fiyatlarını ve ürün reçetelerini girdiğinizde ürün maliyetini sizin verinizle hesaplar. Sistem maliyeti kendisi bilmez; doğru sonuç, girdiğiniz verinin doğruluğuna bağlıdır.</p>

<h2 id="hangi-urun">2. Adım: Zammı hangi ürüne yapacağınıza karar verin</h2>
<p>Bütün menüye aynı oranda zam yapmak kolaydır ama adil değildir. Bazı ürünlerin maliyeti hiç değişmemişken bazılarınınki ciddi artmış olabilir. Ürünleri iki soruyla ayırın: <em>Maliyeti ne kadar arttı?</em> ve <em>Ne kadar satıyor?</em></p>
<div class="qb-table-wrap"><table>
  <thead><tr><th>Durum</th><th>Önerilen yaklaşım</th></tr></thead>
  <tbody>
    <tr><td>Maliyeti çok arttı, çok satıyor</td><td>Küçük ve kademeli artış; porsiyonu ya da sunumu gözden geçirin.</td></tr>
    <tr><td>Maliyeti çok arttı, az satıyor</td><td>Fiyatı maliyete göre güncelleyin ya da menüden çıkarmayı değerlendirin.</td></tr>
    <tr><td>Maliyeti az arttı, çok satıyor</td><td>Fiyatı koruyun; menünün "güven ürünü" olarak kalsın.</td></tr>
    <tr><td>Maliyeti az arttı, az satıyor</td><td>Fiyattan önce görünürlüğe bakın: açıklama, fotoğraf, menüdeki yeri.</td></tr>
  </tbody>
</table></div>
<p>Bu ayrımın sistemli hali menü mühendisliğidir. Ayrıntısını <a href="@/blog/menu-muhendisligi-nedir/">menü mühendisliği rehberimizde</a> anlattık.</p>

<h2 id="nasil-yapilir">3. Adım: Artışı nasıl yapacağınızı seçin</h2>
<h3 id="kademeli">Küçük ve düzenli adımlar</h3>
<p>Uzun süre bekleyip tek seferde büyük zam yapmak, misafirin fark etme ihtimalini en yüksek hale getirir. Maliyet değiştikçe küçük güncellemeler yapmak hem kârı korur hem de "bir anda her şey pahalandı" algısını azaltır.</p>
<h3 id="porsiyon">Porsiyon ve seçenek sunmak</h3>
<p>Aynı ürünü küçük ve büyük porsiyonda sunmak, fiyata hassas misafire bir kapı açık bırakır. QR Menu Official'da porsiyon ve ekstra tanımları <a href="@/moduller/restoran-menu/">Restoran Menü</a> modülünde Temel paketten itibaren vardır.</p>
<h3 id="kombo">Kombo ve kampanya</h3>
<p>İçecek, yan ürün ve ana yemeği bir arada sunan kombolar, tek tek ürün fiyatlarının artışını misafir açısından daha anlaşılır kılabilir. Kampanyaları süreli ve net koşullarla anlatın; "her zaman indirim" algısı yaratmayın.</p>
<h3 id="yeniden-tasarim">Ürünü yeniden tasarlamak</h3>
<p>Bazen fiyatı artırmak yerine reçeteyi gözden geçirmek daha doğrudur: pahalanan bir malzemenin yerine benzer kalitede başka bir malzeme, garnitürün değiştirilmesi ya da sunumun sadeleşmesi. Misafire söz verdiğiniz kaliteyi düşürmeden yapılırsa bu, fiyatı korumanın dürüst bir yoludur.</p>

<h2 id="iletisim">Misafire nasıl anlatmalı?</h2>
<ul>
  <li><strong>Gizlemeyin.</strong> Fark edilmeden yapılan porsiyon küçültme, fark edildiğinde zamdan daha çok güven kaybettirir.</li>
  <li><strong>Garsonu hazırlayın.</strong> "Neden pahalandı?" sorusuna kısa ve dürüst bir cevap verebilmeli.</li>
  <li><strong>Değeri gösterin.</strong> Ürün açıklamasında malzemenin kaynağını ve hazırlanışını anlatmak, fiyatın neye karşılık geldiğini görünür kılar.</li>
</ul>

<h2 id="fiyat-listesi">Fiyat listesini güncel tutmak bir zorunluluk</h2>
<p>Fiyat Etiketi Yönetmeliği'ne göre yiyecek-içecek işletmeleri fiyat listesini misafirin görebileceği şekilde bulundurmak zorundadır; 2025 değişikliğiyle masada karekodla gösterim de mümkün hale gelmiştir. Fiyat değiştiğinde basılı menüyü yeniden bastırmak hem masraflı hem yavaştır; bu süre boyunca masadaki fiyatla kasadaki fiyat çelişebilir. Panelden yönetilen bir QR menüde fiyat ürün kaydında değişir ve aynı karekod güncel menüyü açar. Kuralların ayrıntısı için <a href="@/blog/karekod-fiyat-listesi-yonetmeligi/">karekodla fiyat listesi rehberine</a> bakın.</p>
<p class="qb-note">Bu yazı genel bilgilendirmedir, hukuki görüş değildir. Güncel kurallar için Ticaret Bakanlığı duyurularını esas alın.</p>

<h2 id="kontrol-listesi">Zam öncesi kontrol listesi</h2>
<ol>
  <li>Her ürünün güncel maliyetini reçeteyle hesapladım.</li>
  <li>Maliyeti en çok artan ve en çok satan ürünleri ayırdım.</li>
  <li>Artışı ürün bazında ve küçük adımlarla planladım.</li>
  <li>Fiyata hassas misafir için porsiyon ya da kombo seçeneği bıraktım.</li>
  <li>Garsonları değişiklik hakkında bilgilendirdim.</li>
  <li>Masadaki, kapıdaki ve dijital menüdeki fiyatları aynı anda güncelledim.</li>
</ol>

<div class="qb-cta-inline">
  <p><strong>Fiyatları tek ekrandan güncellemek ister misiniz?</strong> Paketleri karşılaştırın; menü ve fiyat yönetimi Temel paketten itibaren dahildir.</p>
  <a class="qb-btn" href="@/paketler/">Paketleri İncele <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Restoranda zam ne sıklıkla yapılmalı?", a: "Sabit bir takvim yerine maliyet değişimine bakın. Maliyet belirgin şekilde arttığında küçük ve ürün bazında güncellemeler, uzun aralıklarla yapılan büyük zamlardan daha az fark edilir." },
      { q: "Bütün menüye aynı oranda zam yapmak doğru mu?", a: "Genellikle hayır. Ürünlerin maliyet artışı farklıdır. Ürün bazında maliyet ve satış adedine bakarak karar vermek hem daha adil hem daha kârlıdır." },
      { q: "Porsiyon küçültmek zam yerine geçer mi?", a: "Misafire açıkça söylenirse bir seçenek olabilir. Fark ettirmeden yapılan porsiyon küçültme, fark edildiğinde güven kaybına yol açar." },
      { q: "Fiyat değiştiğinde QR kodu yeniden basmam gerekir mi?", a: "Panelden yönetilen bir QR menüde hayır. Fiyatı ürün kaydında değiştirirsiniz; aynı karekod güncel fiyatı gösterir." },
      { q: "QR Menu Official ürün maliyetini kendisi hesaplar mı?", a: "Plus paketindeki maliyet ve reçete ekranı, sizin girdiğiniz malzeme fiyatları ve reçetelerle ürün maliyetini hesaplar. Veri girilmeden otomatik maliyet bilgisi üretmez." }
    ],
    sources: [
      { label: "T.C. Ticaret Bakanlığı — Fiyat etiketinde yeni dönem başlıyor", url: "https://ticaret.gov.tr/haberler/fiyat-etiketinde-yeni-donem-basliyor" },
      { label: "TÜİK — Tüketici fiyat endeksi verileri", url: "https://data.tuik.gov.tr/" },
      { label: "QR Menu Official — Menü Mühendisliği modül sayfası", url: "https://qrmenuofficial.com/moduller/menu-muhendisligi/" }
    ],
    related: ["menu-muhendisligi-nedir", "karekod-fiyat-listesi-yonetmeligi", "menude-olmayan-urun-aramalari"],
    products: [
      { label: "Menü Mühendisliği (maliyet ve reçete)", path: "moduller/menu-muhendisligi/" },
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: "garson-eksikligi-az-personelle-servis",
    category: "servis",
    date: "2026-11-14",
    readMin: 8,
    title: "Garson Eksikliği: Az Personelle Restoran Servisi Nasıl Yürütülür?",
    seoTitle: "Garson Eksikliği ve Personel Sorunu: Az Personelle Servis",
    description:
      "Garson bulmak zorlaştığında servis nasıl aksamadan yürür? Salon düzeni, görev paylaşımı, QR ile çağrı ve sipariş, yeni personelin hızlı alışması için pratik rehber.",
    excerpt:
      "Personel bulmak ve tutmak, restoran sahiplerinin en sık dile getirdiği sorunlardan biri. Daha az kişiyle aynı salonu yönetmenin yolu, garsonun zamanını yemeyen işleri ondan almaktır.",
    cover: "garson-eksikligi-az-personelle-servis",
    coverAlt: "Tek garsonun birden çok masayı tablet ekranından takip ettiğini gösteren illüstrasyon",
    answer:
      "Az personelle servis yürütmek için garsonun zamanını en çok alan işleri azaltın: menüyü masaya getirip anlatmak, siparişi not alıp mutfağa taşımak ve salonu dolaşıp kimin ne istediğini aramak. Masadan QR ile menü, garson çağrısı ve sipariş, bu yürüyüşlerin bir kısmını ortadan kaldırır; kalan zamanı karşılama ve servise ayırırsınız.",
    body: `
<h2 id="sorun">Sorun yalnızca "garson yok" değil</h2>
<p>Personel açığı genellikle şu şekilde hissedilir: yoğun saatte bir garson aynı anda beş masadan çağrılır, menü getirmek ve sipariş almak için salonu defalarca turlar, mutfakla salon arasında not taşır. Misafir el kaldırıp bekler; garson ise sürekli koşturduğu halde hiçbir masaya yetişemediğini hisseder.</p>
<p>Bu durumda daha fazla kişi işe almak her zaman mümkün değildir. Ama garsonun gününü dolduran işlerin bir kısmı aslında misafirin kendisinin yapabileceği ya da bir ekranın üstlenebileceği işlerdir.</p>

<h2 id="zaman-nereye">Garsonun zamanı nereye gidiyor?</h2>
<p>Bir vardiyayı gözlemleyip garsonun neyle uğraştığını not edin. Çoğu salonda tablo şuna benzer:</p>
<ul>
  <li><strong>Menü getirmek ve anlatmak:</strong> Masaya oturan herkese menü taşımak, içerik ve fiyat sorularına cevap vermek.</li>
  <li><strong>Sipariş almak:</strong> Masada beklemek, yazmak, mutfağa götürmek, yanlış anlaşılanı düzeltmek.</li>
  <li><strong>Çağrı aramak:</strong> Salonu tarayıp kimin bir şey istediğini fark etmeye çalışmak.</li>
  <li><strong>Hesap:</strong> Hesap isteyen masayı fark etmek, hesabı hazırlamak, getirmek.</li>
  <li><strong>Servis ve karşılama:</strong> Yemeği taşımak, masayı toplamak, misafirle ilgilenmek.</li>
</ul>
<p>Son madde misafirin asıl hatırladığı kısımdır. İlk dördü azaldıkça garsona bu kısım için zaman kalır.</p>

<h2 id="duzen">Salonu az kişiyle yönetmek için düzen</h2>
<h3 id="bolge">Bölge ataması yapın</h3>
<p>Her garsona sabit masa grupları verin. Herkesin her masaya bakması, kimsenin hiçbir masadan sorumlu olmaması demektir. Yoğun saatte bölgeleri küçültüp boş saatte birleştirebilirsiniz.</p>
<h3 id="gorev">Görevleri ayırın</h3>
<p>İki kişilik bir ekipte bile biri karşılama ve sipariş, diğeri servis ve toplama üstlenebilir. Görev ayrımı, aynı masaya iki kişinin gitmesini ve bir masanın unutulmasını önler.</p>
<h3 id="hazirlik">Açılış öncesi hazırlık</h3>
<p>Peçete, sos, çatal-bıçak ve içecek dolaplarının servis başlamadan dolu olması, yoğun saatte depo ile salon arasındaki gereksiz yürüyüşü azaltır.</p>

<h2 id="qr">Masadan QR ile çağrı ve sipariş</h2>
<p>Masaya konan karekod, misafirin menüyü kendi telefonunda açmasını sağlar. Menüyü masaya taşıma işi ortadan kalkar; ürün açıklamaları, fotoğraflar ve fiyatlar misafirin önündedir. Bununla birlikte servis akışına bağlanan bir sistemde misafir:</p>
<ul>
  <li><strong>Garson çağırabilir:</strong> Talep, masa numarasıyla birlikte personelin ekranına düşer.</li>
  <li><strong>Hesap isteyebilir:</strong> Garson, hesabı hazırlayıp masaya ne zaman gideceğini bilir.</li>
  <li><strong>Sipariş verebilir:</strong> Sipariş yazılı olarak gelir; el yazısı ya da yanlış duyma kaynaklı karışıklık azalır.</li>
</ul>
<p>QR Menu Official'da bu talepler Pro paketten itibaren <a href="@/moduller/servis-paneli/">Servis Paneli</a>'ne düşer; panel sesli uyarı ve masaüstü bildirimi verebilir. Sistem ödeme almaz; hesap talebi yalnızca hesabın masaya getirilmesi isteğidir. Konunun ayrıntısını <a href="@/blog/garson-cagirma-sistemi/">garson çağırma sistemi yazımızda</a> anlattık.</p>
<p class="qb-note">QR sistemi garsonun yerini almaz. Misafirle konuşmak, öneri yapmak ve bir sorunu çözmek hâlâ insan işidir. Amaç, garsonun zamanını bunlara ayırabilmesidir.</p>

<h2 id="yeni-personel">Yeni personelin hızlı alışması</h2>
<p>Personel sirkülasyonu yüksekse, yeni gelen birinin menüyü ezberlemesi haftalar alabilir. Bu süreyi kısaltmak için:</p>
<ul>
  <li><strong>Menüyü yazılı ve güncel tutun.</strong> İçerik, alerjen ve porsiyon bilgisi dijital menüde yazılıysa yeni garson da misafir de aynı kaynağa bakar.</li>
  <li><strong>Rol bazlı erişim verin.</strong> Garsonun yalnızca ihtiyaç duyduğu ekranı görmesi hem öğrenmeyi kolaylaştırır hem de ayarların yanlışlıkla değişmesini önler. QR Menu Official'da servis rolü yalnızca servis panelini görür.</li>
  <li><strong>İlk haftayı eşleştirmeyle geçirin.</strong> Deneyimli bir garsonla aynı bölgede çalışmak, yazılı talimattan daha hızlı öğretir.</li>
</ul>

<h2 id="olcum">İşe yarayıp yaramadığını nasıl anlarsınız?</h2>
<p>Değişiklikten önce ve sonra birkaç vardiyayı aynı şekilde gözlemleyin: bir masanın oturduktan sonra sipariş vermesine kadar geçen süre, çağrılara dönüş süresi, yanlış giden sipariş sayısı. Bu basit notlar, hangi değişikliğin gerçekten fark yarattığını gösterir.</p>

<div class="qb-cta-inline">
  <p><strong>Garson çağrısı ve siparişin bir ekranda nasıl göründüğünü görmek ister misiniz?</strong> Pro ve Plus demo menülerini telefonunuzda açın.</p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "QR menü garsonun yerini alır mı?", a: "Hayır. Menü getirme, çağrı arama ve sipariş taşıma gibi işleri azaltır; misafirle ilgilenme, öneri ve servis hâlâ garsonun işidir." },
      { q: "Garson çağrısı için masaya donanım gerekir mi?", a: "QR tabanlı sistemde gerekmez. Masadaki karekod ve personelin izlediği bir ekran (bilgisayar, tablet veya telefon) yeterlidir." },
      { q: "Misafir QR ile sipariş verince ödeme de yapar mı?", a: "QR Menu Official ödeme almaz. Sipariş ve hesap talebi servis paneline iletilir; ödeme işletmenin kendi yöntemiyle alınır." },
      { q: "Yeni garson menüyü nasıl hızlı öğrenir?", a: "Menünün içerik, alerjen ve porsiyon bilgisinin dijital menüde güncel yazılı olması, yeni personelin ve misafirin aynı bilgiye bakmasını sağlar." },
      { q: "Hangi pakette garson çağrısı ve sipariş var?", a: "QR Menu Official'da QR ile sipariş, garson çağrısı, hesap talebi ve servis paneli Pro paketten itibaren sunulur." }
    ],
    sources: [
      { label: "QR Menu Official — Servis Paneli modül sayfası", url: "https://qrmenuofficial.com/moduller/servis-paneli/" },
      { label: "QR Menu Official — QR Masa modül sayfası", url: "https://qrmenuofficial.com/moduller/qr-masa/" },
      { label: "MDN — Notifications API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API" }
    ],
    related: ["garson-cagirma-sistemi", "restoran-siparis-hatalari", "qr-menu-nedir"],
    products: [
      { label: "Servis Paneli modülü", path: "moduller/servis-paneli/" },
      { label: "QR Masa modülü", path: "moduller/qr-masa/" },
      { label: "Masa Oturum Güvenliği", path: "moduller/masa-oturum-guvenligi/" }
    ]
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: "restoran-google-yorumlari-nasil-artirilir",
    category: "isletme",
    date: "2026-11-13",
    readMin: 8,
    title: "Restoran Google Yorumları Nasıl Artırılır? Kurallara Uygun Yöntemler",
    seoTitle: "Restoran Google Yorumu Nasıl Artırılır? Etik Yöntemler",
    description:
      "Restoranınız için daha fazla Google yorumu nasıl alınır? Doğru zamanda istemek, olumsuz yoruma cevap vermek ve Google'ın yasakladığı yöntemlerden uzak durmak.",
    excerpt:
      "Yeni bir şehirde yemek arayan biri önce yorumlara bakar. Daha çok yorum almanın yolu satın almak değil, memnun misafire doğru anda ve kolayca sormaktır.",
    cover: "restoran-google-yorumlari-nasil-artirilir",
    coverAlt: "Telefonda beş yıldızlı yorum kartları ve restoran masasını gösteren illüstrasyon",
    answer:
      "Google yorumlarını artırmanın kurallara uygun yolu, memnun misafire deneyimin hemen ardından kolay bir bağlantıyla yorum bırakmayı hatırlatmaktır. Yorum karşılığında indirim vermek, sahte yorum yazdırmak ya da yalnızca memnun misafirlerden yorum istemek Google'ın politikalarına aykırıdır ve hesabınızı riske atar.",
    body: `
<h2 id="neden-onemli">Yorumlar neden bu kadar önemli?</h2>
<p>Google Haritalar'da "yakınımdaki restoranlar" gibi bir arama yapan biri, listede puanı, yorum sayısını ve son yorumları görür. Google, yerel sonuçlarda işletmelerin sıralanmasında bilinirlik ölçütleri arasında yorumları da saydığını açıkça belirtir. Yani yorumlar hem misafirin karar vermesine hem de işletmenizin görünürlüğüne etki eder.</p>
<p>Ama tek bir sayı peşinde koşmak yanlış yola götürür. Birkaç yüz yorumu olan ve olumsuz yorumlara özenle cevap veren bir işletme, az sayıda ve yalnızca övgü dolu yorumu olan işletmeden çoğu zaman daha güvenilir görünür.</p>

<h2 id="yasak">Önce yapılmaması gerekenler</h2>
<p>Google'ın kullanıcı katkısı politikaları, yorumların sahte ya da teşvikli olmasını yasaklar. Şunlardan uzak durun:</p>
<ul>
  <li><strong>Yorum karşılığında indirim, ikram ya da hediye vermek.</strong> "Yorum yaz, tatlı bizden" teşvikli yorumdur.</li>
  <li><strong>Sahte hesaplarla ya da personel ve yakınlara yorum yazdırmak.</strong></li>
  <li><strong>Yalnızca memnun misafirlerden yorum istemek</strong> ("review gating"). Herkese aynı şekilde sormalısınız.</li>
  <li><strong>Yorum satan hizmetlerden yararlanmak.</strong> Bu yorumlar silinebilir ve işletme profili kısıtlanabilir.</li>
</ul>
<p class="qb-note">Politikalar değişebilir. Güncel kurallar için Google'ın kullanıcı katkısı içerik politikalarını kontrol edin.</p>

<h2 id="dogru-an">Doğru anda, doğru şekilde istemek</h2>
<h3 id="zaman">Zamanlama</h3>
<p>Misafirin yorum yazma ihtimali, deneyimin hemen ardından en yüksektir. Hesap ödendikten ya da yemek bittikten sonra hatırlatmak, ertesi gün gönderilen bir mesajdan daha etkilidir.</p>
<h3 id="kolaylik">Kolaylık</h3>
<p>Yorum bırakmak için Google Haritalar'da işletmeyi aramak zorunda kalan misafir çoğu zaman vazgeçer. Google İşletme Profili, doğrudan yorum ekranını açan bir bağlantı verir. Bu bağlantıyı masa kartına, hesap fişine ya da dijital menüye ekleyin.</p>
<h3 id="dil">Dil</h3>
<p>"Bize 5 yıldız verir misiniz?" demeyin; puanı yönlendirmek de politikalara aykırı sayılabilir. "Deneyiminizi Google'da paylaşırsanız bize ve diğer misafirlere yardımcı olur" gibi tarafsız bir cümle kullanın.</p>

<h2 id="dijital-menu">Dijital menüden geri bildirim akışı</h2>
<p>Misafir masada zaten telefonunu kullanarak menüye bakıyorsa, geri bildirim istemek için en doğal yer orasıdır. QR Menu Official'ın Plus paketindeki <a href="@/moduller/yorum-geri-bildirim/">Yorum ve Geri Bildirim</a> modülü, misafirin deneyimini puanladığı kısa bir form sunar ve Google yorum bağlantınızı eklemenize izin verir. Gelen geri bildirimler panelde toplanır; olumsuz bir deneyimi misafir masadayken öğrenip düzeltme şansı doğar.</p>
<p>Burada dikkat edilmesi gereken nokta, Google'a yönlendirmenin herkese aynı şekilde sunulmasıdır. Geri bildirim formunu iç iyileştirme için kullanın; Google yorumunu yalnızca memnun misafire göstermek için değil.</p>

<h2 id="cevap">Yorumlara cevap vermek</h2>
<p>Gelen her yoruma, özellikle olumsuz olanlara cevap vermek, profilinizi okuyan diğer misafirlere işletmenin ilgili olduğunu gösterir.</p>
<ul>
  <li><strong>Teşekkür edin, özür dileyin, açıklayın.</strong> Savunmaya geçmeden sorunu kabul edin ve ne yaptığınızı söyleyin.</li>
  <li><strong>Kişisel bilgi paylaşmayın.</strong> Misafirin adını, siparişini ya da rezervasyon ayrıntısını herkese açık cevapta yazmayın.</li>
  <li><strong>Konuşmayı özel kanala taşıyın.</strong> Telefon ya da e-posta vererek sorunu birebir çözmeyi önerin.</li>
  <li><strong>Kalıp cevaptan kaçının.</strong> Her yoruma aynı metni yapıştırmak, cevap vermemek kadar kötü görünür.</li>
</ul>

<h2 id="kontrol">Yorum stratejisi kontrol listesi</h2>
<ol>
  <li>Google İşletme Profili'mdeki doğrudan yorum bağlantısını aldım.</li>
  <li>Bağlantıyı masa kartına, fişe ya da dijital menüye ekledim.</li>
  <li>Yorum karşılığında hiçbir teşvik sunmuyorum.</li>
  <li>Herkese aynı şekilde ve tarafsız bir dille soruyorum.</li>
  <li>Olumsuz yorumlara birkaç gün içinde ve kişisel bilgi vermeden cevap veriyorum.</li>
  <li>Yorumlarda tekrar eden şikâyetleri mutfak ve servis ekibiyle konuşuyorum.</li>
</ol>
<p>Yorumlar, yerel görünürlüğün yalnızca bir parçasıdır. Profilin geri kalanı için <a href="@/blog/google-isletme-profili-restoran-yerel-seo/">Google İşletme Profili ve yerel SEO rehberine</a> bakın.</p>
`,
    faq: [
      { q: "Google yorumu karşılığında indirim vermek yasak mı?", a: "Google'ın kullanıcı katkısı politikaları teşvikli yorumları yasaklar. Yorum karşılığında indirim, ikram ya da hediye vermek bu kapsama girer ve yorumların silinmesine yol açabilir." },
      { q: "Yalnızca memnun misafirlerden yorum istemek sorun mu?", a: "Evet. Yalnızca memnun olduğunu düşündüğünüz misafirlere yorum isteği göstermek politikalara aykırı kabul edilir. Herkese aynı şekilde sorun." },
      { q: "Olumsuz yorumu sildirebilir miyim?", a: "Yalnızca Google'ın politikalarını ihlal eden yorumlar (ör. sahte, hakaret içeren, konu dışı) bildirilebilir. Olumsuz ama gerçek bir deneyim anlatan yorum silinmez; en iyi yol özenli bir cevap vermektir." },
      { q: "Yorum bağlantısını nereden bulurum?", a: "Google İşletme Profili yönetim ekranında yorum isteme seçeneği, misafirin doğrudan yorum ekranını açan bir bağlantı verir." },
      { q: "QR Menu Official Google yorumu toplar mı?", a: "Plus paketindeki Yorum ve Geri Bildirim modülü, misafirden puan ve görüş alır ve Google yorum bağlantınızı eklemenize izin verir. Yorumlar Google'da misafirin kendi hesabıyla yazılır." }
    ],
    sources: [
      { label: "Google — Yerel sıralamanızı iyileştirmeye yönelik ipuçları", url: "https://support.google.com/business/answer/7091" },
      { label: "Google Haritalar — Kullanıcı katkısı içerik politikaları", url: "https://support.google.com/contributionpolicy/answer/7400114" },
      { label: "QR Menu Official — Yorum ve Geri Bildirim modül sayfası", url: "https://qrmenuofficial.com/moduller/yorum-geri-bildirim/" }
    ],
    related: ["google-isletme-profili-restoran-yerel-seo", "turist-icin-cok-dilli-menu", "qr-menu-nedir"],
    products: [
      { label: "Yorum ve Geri Bildirim modülü", path: "moduller/yorum-geri-bildirim/" },
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  },

  /* ------------------------------------------------------------------ 9 */
  {
    slug: "google-isletme-profili-restoran-yerel-seo",
    category: "isletme",
    date: "2026-11-12",
    readMin: 9,
    title: "Restoran ve Kafeler İçin Google İşletme Profili ve Yerel SEO Rehberi",
    seoTitle: "Restoran Yerel SEO: Google İşletme Profili Rehberi",
    description:
      "Restoranınız 'yakınımdaki restoran' aramalarında nasıl görünür? Google İşletme Profili ayarları, kategori, fotoğraf, menü bağlantısı ve web sitesinde yerel SEO.",
    excerpt:
      "Yakınında yemek arayan biri çoğu zaman web sitenize değil, Google Haritalar'daki profilinize bakar. Profilin eksiksiz ve güncel olması, bulunmanın ilk şartıdır.",
    cover: "google-isletme-profili-restoran-yerel-seo",
    coverAlt: "Harita iğnesi, restoran vitrini ve arama sonucu kartını gösteren illüstrasyon",
    answer:
      "Restoranın yerel aramalarda görünmesi için Google İşletme Profili'ni eksiksiz doldurun: doğru kategori, adres, telefon ve çalışma saatleri, güncel fotoğraflar ve menü bağlantısı. Google yerel sıralamada alaka düzeyi, mesafe ve bilinirliğe baktığını belirtir; bunlardan ikisini, profili eksiksiz tutarak ve düzenli yorum alarak etkileyebilirsiniz.",
    body: `
<h2 id="nasil-calisir">Google yerel sonuçları nasıl sıralar?</h2>
<p>Google, yerel arama sonuçlarının üç temel ölçüte göre belirlendiğini açıklar:</p>
<ul>
  <li><strong>Alaka düzeyi:</strong> Profilin aranan şeyle ne kadar örtüştüğü. Kategori ve açıklama burada belirleyicidir.</li>
  <li><strong>Mesafe:</strong> İşletmenin arama yapan kişiye ya da aranan konuma uzaklığı. Bunu değiştiremezsiniz.</li>
  <li><strong>Bilinirlik:</strong> İşletmenin ne kadar tanındığı. Yorum sayısı ve puanı, web'de işletme hakkında yazılanlar bu ölçüte katkıda bulunur.</li>
</ul>
<p>Yani mesafe dışındaki iki ölçüt, büyük ölçüde sizin elinizdedir.</p>

<h2 id="profil">Profili eksiksiz doldurmak</h2>
<h3 id="kategori">Ana kategori</h3>
<p>Ana kategori, profilin hangi aramalarda gösterileceğini en çok etkileyen alandır. "Restoran" yerine "Kebapçı", "Kahvaltı salonu" ya da "Kafe" gibi daha belirli bir kategori, aradığınız misafirle eşleşmenizi kolaylaştırır. Ek kategorileri yalnızca gerçekten sunduğunuz hizmetler için ekleyin.</p>
<h3 id="nap">Ad, adres, telefon</h3>
<p>İşletme adı tabelada nasıl yazıyorsa öyle olmalı; ada anahtar kelime eklemek ("Ahmet Usta Kebap En İyi Adana") Google'ın yönergelerine aykırıdır. Adres ve telefon, web sitenizde, sosyal medya hesaplarınızda ve rehber sitelerinde aynı şekilde yazılmalıdır. Farklı kaynaklarda farklı bilgi, hem Google'ı hem misafiri karıştırır.</p>
<h3 id="saat">Çalışma saatleri</h3>
<p>Kapalı olduğu halde "açık" görünen bir restoran, en kötü yorumları alır. Bayram, resmî tatil ve sezonluk değişiklikler için özel saatleri önceden girin.</p>
<h3 id="foto">Fotoğraflar</h3>
<p>Mekânın dışı (misafirin kapıyı bulması için), içi, masalar ve en çok satan yemekler. Gün ışığında, telefonla bile çekilebilir; önemli olan güncel ve gerçek olmasıdır. Profilde misafirlerin yüklediği fotoğraflar da görünür; kendi fotoğraflarınız bunlarla dengelenir.</p>
<h3 id="menu">Menü bağlantısı</h3>
<p>Google İşletme Profili, restoranlar için menü bağlantısı eklemeye izin verir. Bu bağlantının PDF yerine mobilde okunan ve güncel bir menüye gitmesi, profilden gelen misafirin ilk izlenimini belirler. QR menünüzün adresini buraya ekleyebilirsiniz; aynı menü hem masada hem Google'da kullanılmış olur.</p>

<h2 id="paylasim">Profili canlı tutmak</h2>
<ul>
  <li><strong>Gönderiler:</strong> Yeni menü, sezonluk ürün ya da etkinlik duyurusu. Düzenli paylaşım profilin terk edilmediğini gösterir.</li>
  <li><strong>Soru ve cevaplar:</strong> Misafirlerin sorduğu soruları ("otopark var mı?", "çocuk sandalyesi var mı?") cevaplayın.</li>
  <li><strong>Yorumlar:</strong> Düzenli ve kurallara uygun yorum almak bilinirliğe katkıda bulunur. Ayrıntısı <a href="@/blog/restoran-google-yorumlari-nasil-artirilir/">Google yorumları rehberinde</a>.</li>
</ul>

<h2 id="web-sitesi">Web sitenizde yerel SEO</h2>
<p>Profil kadar olmasa da web siteniz de yerel aramalarda rol oynar. Temel adımlar:</p>
<ol>
  <li><strong>Başlık ve açıklamada şehir ve semt:</strong> "Kadıköy'de ev yemekleri" gibi, misafirin gerçekten aradığı ifadeyle.</li>
  <li><strong>Adres, telefon ve harita her sayfada erişilebilir olsun.</strong> Genellikle alt bilgide.</li>
  <li><strong>Yapılandırılmış veri:</strong> Google, yerel işletmeler için <code>Restaurant</code> türünde yapılandırılmış veriyi destekler; adres, saatler ve menü bağlantısı bu şekilde makine tarafından okunur.</li>
  <li><strong>Hızlı ve mobil uyumlu sayfa:</strong> Misafir sizi büyük ihtimalle telefonla, yolda arar. Yavaş açılan bir site, profilden gelen ziyareti kaybettirir.</li>
  <li><strong>Menü metin olarak sayfada olsun.</strong> Görsel olarak yüklenmiş menüyü arama motorları okuyamaz; ürün adları ve açıklamaları metin olarak bulunmalı.</li>
</ol>

<h2 id="hatalar">Sık yapılan hatalar</h2>
<ul>
  <li>Aynı işletme için birden fazla profil açmak.</li>
  <li>İşletme adına şehir ya da anahtar kelime eklemek.</li>
  <li>Taşınma sonrası eski adresi güncellememek.</li>
  <li>Menü bağlantısını eski bir PDF'e bırakmak.</li>
  <li>Olumsuz yorumları cevapsız bırakmak.</li>
</ul>

<div class="qb-cta-inline">
  <p><strong>Google profilinize koyabileceğiniz mobil bir menü mü arıyorsunuz?</strong> Demo menüleri telefonunuzda açıp nasıl göründüğüne bakın.</p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Google İşletme Profili ücretli mi?", a: "Hayır. İşletme profili oluşturmak ve yönetmek ücretsizdir. Ücretli olan, isteğe bağlı Google reklamlarıdır." },
      { q: "İşletme adına anahtar kelime eklersem daha üst sıraya çıkar mıyım?", a: "Bu Google'ın yönergelerine aykırıdır ve profilin askıya alınmasına yol açabilir. Tabelada yazan gerçek adı kullanın." },
      { q: "Menü bağlantısı olarak PDF koymak sorun mu?", a: "Yasak değildir ama PDF telefonda yakınlaştırma gerektirir ve her fiyat değişikliğinde yeniden yüklenmelidir. Mobilde okunan ve güncellenebilen bir menü bağlantısı misafir için daha kullanışlıdır." },
      { q: "Yerel SEO sonuçları ne zaman görülür?", a: "Kesin bir süre yoktur. Profilin eksiksiz doldurulması ve düzenli güncellenmesi, zaman içinde etkisini gösteren sürekli bir çalışmadır." },
      { q: "Web sitem yoksa yerel aramalarda görünebilir miyim?", a: "Evet, Google İşletme Profili tek başına Haritalar'da görünmenizi sağlar. Bir web sitesi ve mobil menü, profilden gelen misafire daha fazla bilgi sunar." }
    ],
    sources: [
      { label: "Google — Yerel sıralamanızı iyileştirmeye yönelik ipuçları", url: "https://support.google.com/business/answer/7091" },
      { label: "Google Search Central — Yerel işletme yapılandırılmış verileri", url: "https://developers.google.com/search/docs/appearance/structured-data/local-business" },
      { label: "Google — İşletmenizi Google'da temsil etme yönergeleri", url: "https://support.google.com/business/answer/3038177" }
    ],
    related: ["restoran-google-yorumlari-nasil-artirilir", "qr-menu-nedir", "turist-icin-cok-dilli-menu"],
    products: [
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" },
      { label: "Çoklu Dil modülü", path: "moduller/coklu-dil/" },
      { label: "Paketler ve fiyatlar", path: "paketler/" }
    ]
  },

  /* ------------------------------------------------------------------ 10 */
  {
    slug: "turist-icin-cok-dilli-menu",
    category: "qr-menu",
    date: "2026-11-11",
    readMin: 7,
    title: "Turist Misafir İçin Çok Dilli Menü: Yabancı Müşteriye Menü Nasıl Hazırlanır?",
    seoTitle: "Çok Dilli Menü: Turist Müşteri İçin İngilizce Menü Rehberi",
    description:
      "Yabancı misafir için İngilizce ve çok dilli menü nasıl hazırlanır? Yemek adlarının çevirisi, alerjen bilgisi, fiyat ve QR menüde dil seçici için pratik rehber.",
    excerpt:
      "Menüyü okuyamayan bir turist ya sipariş vermekten vazgeçer ya da en tanıdık ürünü seçer. Doğru çevrilmiş bir menü, misafire Türk mutfağını keşfetme cesareti verir.",
    cover: "turist-icin-cok-dilli-menu",
    coverAlt: "Telefon ekranında dil seçici ve farklı dillerde menü kartlarını gösteren illüstrasyon",
    answer:
      "Turist misafir için çok dilli menüde yemek adını çevirmekle yetinmeyin: Türkçe adı koruyun, altına kısa ve doğru bir açıklama ekleyin, alerjen ve içerik bilgisini her dilde verin. QR menüde dil seçiciyle aynı menüyü birden çok dilde göstermek, her dil için ayrı menü bastırmaktan daha kolay güncellenir.",
    body: `
<h2 id="neden">Turist misafir menüde neye takılır?</h2>
<p>"Hünkâr beğendi", "İmam bayıldı" ya da "Mercimek çorbası" yabancı bir misafire hiçbir şey anlatmaz. Kelime kelime çevrildiğinde ise anlam tamamen kaybolabilir: "The Imam Fainted" bir yemek adı olarak misafiri meraklandırabilir ama ne yiyeceğini söylemez. Sonuç çoğu zaman şudur: misafir tanıdığı tek ürünü sipariş eder ya da garsona her ürünü tek tek sorar.</p>

<h2 id="ceviri">Yemek adları nasıl çevrilmeli?</h2>
<h3 id="ad-koru">Türkçe adı koruyun</h3>
<p>Yerel yemeğin adı, menünüzün kimliğidir. Adı koruyup altına kısa bir açıklama yazmak, hem misafirin ne sipariş ettiğini anlamasını hem de yemeği garsona Türkçe adıyla söyleyebilmesini sağlar.</p>
<div class="qb-table-wrap"><table>
  <thead><tr><th>Zayıf çeviri</th><th>Daha iyi yaklaşım</th></tr></thead>
  <tbody>
    <tr><td>The Imam Fainted</td><td>İmam Bayıldı — Roasted eggplant stuffed with onion, tomato and garlic, cooked in olive oil</td></tr>
    <tr><td>Sultan's Delight</td><td>Hünkâr Beğendi — Slow-cooked lamb stew on smoky eggplant and cheese purée</td></tr>
    <tr><td>Lentil</td><td>Mercimek Çorbası — Red lentil soup, served with lemon</td></tr>
  </tbody>
</table></div>
<h3 id="aciklama">Açıklamayı kısa ve somut tutun</h3>
<p>Ana malzeme, pişirme yöntemi ve varsa acılık derecesi. "Lezzetli", "eşsiz" gibi sıfatlar çeviride bilgi taşımaz.</p>
<h3 id="kontrol">Çeviriyi bir insana kontrol ettirin</h3>
<p>Otomatik çeviri araçları başlangıç için yardımcı olabilir ama yemek adlarında sık hata yapar. Çeviriyi o dili iyi bilen birine okutmak, menünüzün yabancı misafir gözünde ciddiyetini belirler.</p>

<h2 id="hangi-dil">Hangi dilleri eklemeli?</h2>
<p>Her dili eklemek yerine misafirlerinize bakın. İngilizce çoğu durumda temel tercihtir; bulunduğunuz bölgeye göre Almanca, Rusça, Arapça ya da Farsça gibi diller öne çıkabilir. Garsonlarınıza hangi dilde soru geldiğini sormak, en pratik veri kaynağıdır.</p>

<h2 id="alerjen">Alerjen ve içerik bilgisi her dilde</h2>
<p>Yabancı misafir, alerjisini garsona anlatmakta zorlanabilir. Alerjen bilgisinin menüde, misafirin kendi dilinde ve simgelerle gösterilmesi bu riski azaltır. Ayrıntısı için <a href="@/blog/restoran-menude-alerjen-bilgisi/">alerjen bilgisi rehberine</a> bakın.</p>

<h2 id="fiyat">Fiyat ve para birimi</h2>
<p>Fiyatı Türk lirası olarak açıkça gösterin. Döviz karşılığı yazmak, kur değiştikçe yanlış bilgi verme riski taşır; yazacaksanız tahmini olduğunu belirtin. Servis ücreti ya da kuver gibi kalemler varsa, Fiyat Etiketi Yönetmeliği'ndeki kurallara uygun olduğundan emin olun.</p>

<h2 id="qr-dil">QR menüde dil seçici</h2>
<p>Basılı menüde her dil için ayrı sayfa ya da ayrı menü gerekir; fiyat değiştiğinde hepsi yeniden basılır. QR menüde ise misafir aynı karekodu okutur ve dil seçiciden kendi dilini seçer. Fiyat tek yerde değişir, bütün dillerde güncellenir.</p>
<p>QR Menu Official'da <a href="@/moduller/coklu-dil/">Çoklu Dil</a> modülü Temel paketten itibaren vardır. Çeviriler panelden elle ya da CSV dosyasıyla toplu olarak girilir; sistem otomatik çeviri yapmaz, böylece metnin kontrolü sizde kalır. Misafir menüde arama yaptığında, seçtiği dildeki ürün adlarında da arama yapılır.</p>

<h2 id="kontrol-listesi">Çok dilli menü kontrol listesi</h2>
<ol>
  <li>Misafirlerimin en çok konuştuğu dilleri belirledim.</li>
  <li>Yerel yemek adlarını koruyup altına kısa açıklama yazdım.</li>
  <li>Çeviriyi o dili bilen birine kontrol ettirdim.</li>
  <li>Alerjen bilgisini her dilde ve simgeyle gösterdim.</li>
  <li>Fiyatları Türk lirası olarak net yazdım.</li>
  <li>Garsonların "bu yemekte ne var?" sorusuna kısa bir İngilizce cevabı var.</li>
</ol>

<div class="qb-cta-inline">
  <p><strong>Dil seçicinin telefonda nasıl çalıştığını görün.</strong> Demo menüyü açıp dili değiştirin.</p>
  <a class="qb-btn" href="@/canli-menu/">Canlı Menüyü Gör <span aria-hidden="true">→</span></a>
</div>
`,
    faq: [
      { q: "Yemek adlarını tamamen İngilizceye çevirmeli miyim?", a: "Yerel yemeklerde Türkçe adı korumak ve altına kısa bir açıklama eklemek daha iyi sonuç verir. Misafir hem ne yediğini anlar hem de yemeği garsona adıyla söyleyebilir." },
      { q: "Otomatik çeviri kullanmak yeterli mi?", a: "Başlangıç için yardımcı olabilir ama yemek adlarında sık hata yapar. Çeviriyi o dili iyi bilen birine kontrol ettirmenizi öneririz." },
      { q: "Menüde döviz fiyatı yazmalı mıyım?", a: "Fiyatı Türk lirası olarak net gösterin. Döviz karşılığı yazacaksanız kur değişeceği için tahmini olduğunu belirtin." },
      { q: "QR menüde her dil için ayrı karekod gerekir mi?", a: "Hayır. Dil seçici olan bir QR menüde misafir aynı karekodu okutur ve menüde kendi dilini seçer." },
      { q: "QR Menu Official menüyü otomatik çevirir mi?", a: "Hayır. Çeviriler panelden elle ya da CSV ile toplu olarak girilir. Bu sayede metnin doğruluğunu siz kontrol edersiniz." }
    ],
    sources: [
      { label: "QR Menu Official — Çoklu Dil modül sayfası", url: "https://qrmenuofficial.com/moduller/coklu-dil/" },
      { label: "T.C. Ticaret Bakanlığı — Fiyat etiketinde yeni dönem başlıyor", url: "https://ticaret.gov.tr/haberler/fiyat-etiketinde-yeni-donem-basliyor" },
      { label: "T.C. Kültür ve Turizm Bakanlığı", url: "https://www.ktb.gov.tr/" }
    ],
    related: ["restoran-menude-alerjen-bilgisi", "qr-menu-nedir", "dijital-menu-nasil-hazirlanir"],
    products: [
      { label: "Çoklu Dil modülü", path: "moduller/coklu-dil/" },
      { label: "Akıllı Filtreleme modülü", path: "moduller/akilli-filtreleme/" },
      { label: "Restoran Menü modülü", path: "moduller/restoran-menu/" }
    ]
  }
];
