/* =========================================================
   QR MENU OFFICIAL — YASAL SAYFALAR: TEK VERİ KAYNAĞI
   Üretim: node yasal/build.mjs  →  /gizlilik/ · /cerez-politikasi/ · /kullanim-sartlari/

   İçerik yalnızca sitenin gerçekte yaptığına dayanır (iletişim formu e-posta taslağı
   hazırlar, sunucuya kaydetmez; üçüncü taraf betik/yazı tipi/harita/reklam aracı yoktur).
   Müşteri hesabı (/giris/, /hesabim/, /odeme/) kişisel veriyi KENDİ sunucumuza kaydeder ve zorunlu bir
   oturum çerezi yazar (backend/src/Account/Accounts.php, backend/migrations/004_customers.sql).
   Ziyaret ölçümü YALNIZCA onayla çalışır ve kendi sunucumuza yazar (global/src/analytics.js →
   /api/collect → backend/src/Site/Collector.php; saklama süresi backend/config: retention_days).
   Bunlardan biri değişirse (ör. GA4, Meta pixel, form sunucusu eklenirse, saklama süresi
   değişirse) ilgili metin AYNI değişiklikte güncellenir.

   Metinlerde {rel} sayfa derinliğine göre göreli yol ön ekidir ("../").
   Hukuki inceleme: ticaret unvanı, adres, MERSİS/VERBİS ve yetkili mahkeme bilgisi
   henüz repoda yoktur; sahibi eklemelidir (bkz. README "Bilinçli olarak açık kalan konular").
========================================================= */

export const UPDATED = "6 Kasım 2026";

/* =========================================================
   SATICI BİLGİLERİ — /mesafeli-satis/ sayfası bunlardan beslenir.
   BOŞ ALAN UYDURMA: gerçek bilgileri site sahibi doldurur. Alanlardan biri boşken sayfa
   sarı "DOLDURULMALI" işaretiyle üretilir, noindex olur ve footer'a bağlanmaz.
   Hepsi dolunca: node yasal/build.mjs && node global/build.mjs
========================================================= */
export const SELLER = {
  unvan: "",        // Ticaret unvanı (şahıs işletmesiyse ad soyad + işletme adı)
  adres: "",        // Açık adres (tebligat adresi)
  vergi: "",        // Vergi dairesi ve vergi / TC numarası
  mersis: "",       // MERSİS no (şahıs işletmesinde yoksa "yoktur" yazın)
  telefon: "+90 542 204 35 87",
  eposta: "",       // Şirket alan adlı e-posta (iletişim sayfasındakiyle aynı olsun)
  kep: "",          // KEP adresi (yoksa "yoktur" yazın)
  mahkeme: "",      // Yetkili mahkeme / icra dairesi (örn. "İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri")
  kdv: "",          // Fiyatlara KDV durumu: "KDV dahildir" ya da "KDV hariçtir, ödeme ekranında eklenir"
  odemeYontemi: "", // Örn. "Kredi/banka kartı (iyzico üzerinden)"; ödeme sağlayıcısı bağlanınca yazın
  yenileme: ""      // "Dönem sonunda otomatik yenilenir" ya da "Yenileme her seferinde sizin onayınızla yapılır"
};
export const SELLER_COMPLETE = Object.values(SELLER).every((v) => String(v).trim() !== "");

const f = (v, label) =>
  String(v).trim() !== "" ? v : `<mark class="qrmo-legal-todo">DOLDURULMALI: ${label}</mark>`;



export const PAGES = [
  {
    slug: "gizlilik",
    nav: "Gizlilik ve KVKK",
    title: "Gizlilik Politikası ve KVKK Aydınlatma Metni",
    h1: "Gizlilik Politikası ve KVKK Aydınlatma Metni",
    description:
      "QR Menu Official sitesinde hangi kişisel verilerin, neden ve nasıl işlendiği; 6698 sayılı KVKK kapsamındaki haklarınız.",
    lead: "İletişim formunu doldurduğunuzda, bize yazdığınızda ya da hesap açtığınızda hangi bilgilerinizin işlendiğini, neden işlendiğini ve haklarınızı bu sayfada bulabilirsiniz.",
    sections: [
      {
        id: "kapsam",
        h2: "Kapsam",
        html: `
<p>Bu metin, qrmenuofficial.com sitesini ziyaret edenler, site üzerinden bizimle iletişime geçenler ve sitede hesap açanlar içindir.</p>
<p>Canlı demo menüler ayrı alt alan adlarında (temel, test ve full ile başlayan qrmenuofficial.com adresleri) çalışır. Hizmeti kullanan işletmelerin kendi menü ve panel verileri de bu metnin kapsamı dışındadır.</p>`
      },
      {
        id: "veri-sorumlusu",
        h2: "Veri sorumlusu",
        html: `
<p>Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla <strong>QR Menu Official</strong> tarafından işlenir.</p>
<p>Telefon ve e-posta kanallarına <a href="{rel}iletisim/">iletişim sayfasından</a> ulaşabilirsiniz.</p>
<!-- TODO (site sahibi): ticaret unvanı, açık adres, MERSİS no ve gerekiyorsa VERBİS bilgisini ekleyin. -->`
      },
      {
        id: "islenen-veriler",
        h2: "İşlenen kişisel veriler",
        html: `
<p><strong>İletişim formu.</strong> Formda yazdığınız ad, işletme adı, telefon numarası, e-posta adresi (isteğe bağlı), işletme türü, ilgilendiğiniz konu, mesajınızın içeriği ve onay tercihleriniz.</p>
<p><strong>Telefon ve e-posta.</strong> Bize doğrudan arayarak veya yazarak ilettiğiniz bilgiler.</p>
<p><strong>Hesap (üye olursanız).</strong> Ad soyad, e-posta adresi ve parolanız; isteğe bağlı olarak işletme adı, telefon numarası ve WordPress alan adı. Parolanız düz metin olarak saklanmaz, yalnızca geri döndürülemez bir özeti tutulur. Ayrıca üyelik ve son giriş zamanı, kullanım şartlarını kabul ettiğiniz an ve oturum kayıtlarınız (oturum anahtarınızın özeti ve geçerlilik süresi) saklanır. E-posta doğrulama, parola sıfırlama ve e-posta değiştirme için üretilen tek kullanımlık bağlantıların yalnızca özeti ve geçerlilik süresi tutulur; bu bağlantılar e-posta adresinize gönderilir. Ekibimiz lisansınızı hesabınıza bağladıysa lisans bilgileriniz (firma adı, paket, modüller, başlangıç ve bitiş tarihi, etkinleştirilen alan adı, son doğrulama zamanı) ve lisans anahtarınız hesabınızda gösterilir; anahtarı görüntülemeniz denetim amacıyla kaydedilir. Paket seçip siparişi tamamladığınızda sipariş kaydınız (paket, dönem, referans numarası ve tarih) hesabınıza eklenir; kart bilgisi bu sitede alınmaz ve saklanmaz.</p>
<p><strong>Site kullanımı (yalnızca onayınızla).</strong> Çerez çubuğunda “Kabul Et”i seçerseniz şunlar kaydedilir: ziyaret ettiğiniz sayfalar ve zamanı, tıkladığınız bağlantı ve düğmelerin adı, sayfada ne kadar kaydırdığınız, sayfada geçirdiğiniz etkin süre, tarayıcı türü, işletim sistemi, cihaz türü, ekran boyutu ve dil, sizi siteye getiren adres veya kampanya etiketi (utm), IP adresiniz, IP adresinden türetilen ülke bilgisi ve tarayıcınızda saklanan rastgele bir ziyaretçi kimliği. Form alanlarına yazdıklarınız, tuş vuruşlarınız ve sayfalardaki metin içerikleri okunmaz. Giriş, hesap ve ödeme sayfaları ölçüme hiç dahil edilmez. “Reddet”i seçerseniz veya tarayıcınız “Do Not Track” / “Global Privacy Control” sinyali gönderiyorsa bunların hiçbiri saklanmaz ve gönderilmez (ayrıntı: <a href="{rel}cerez-politikasi/">Çerez Politikası</a>).</p>
<p><strong>Sunucu kayıtları.</strong> Barındırma hizmetini veren sağlayıcı, sitenin güvenliği ve çalışması için IP adresi, tarayıcı bilgisi ve erişim zamanı gibi sunucu kayıtlarını onayınızdan bağımsız olarak tutabilir.</p>`
      },
      {
        id: "toplama-yontemi",
        h2: "Verilerin toplanma yöntemi",
        html: `
<p>İletişim formundaki “talebi e-posta taslağına aktar” düğmesi, yazdıklarınızı cihazınızdaki e-posta uygulamasında bir taslağa dönüştürür. Site bu bilgileri bir sunucuya kaydetmez; bilgileriniz, e-postayı siz gönderdiğinizde bize ulaşır.</p>
<p>Hesap oluşturma, giriş, profil ve sipariş adımlarında yazdıklarınız, iletişim formundan farklı olarak, güvenli bağlantıyla sunucumuza gönderilir ve orada saklanır.</p>
<p>Telefonla veya e-postayla bize doğrudan ulaştığınızda bilgileriniz sizin ilettiğiniz kadarıyla alınır.</p>
<p>Ziyaret ölçümü verileri, onay verdiğinizde tarayıcınızdaki küçük bir betik aracılığıyla ve otomatik yollarla kendi sunucumuza gönderilir. Üçüncü taraf bir analiz veya reklam hizmeti kullanılmaz.</p>`
      },
      {
        id: "amac-ve-hukuki-sebep",
        h2: "İşleme amaçları ve hukuki sebepleri",
        html: `
<ul>
  <li><strong>Talebinizi yanıtlamak, çözüm ve paketler hakkında bilgi vermek, ön görüşmeyi yürütmek.</strong> Hukuki sebep: bir sözleşmenin kurulması için gerekli olması (KVKK m.5/2-c) ve meşru menfaat (m.5/2-f).</li>
  <li><strong>Hesabınızı oluşturmak ve yönetmek, girişinizi doğrulamak, siparişlerinizi göstermek ve sipariş adımında bilgilerinizi hazır getirmek.</strong> Hukuki sebep: bir sözleşmenin kurulması veya ifası için gerekli olması (KVKK m.5/2-c); hesap güvenliği (oturum ve parola doğrulama) için meşru menfaat (m.5/2-f).</li>
  <li><strong>Ürün ve paket duyuruları göndermek.</strong> Yalnızca formdaki “Ürün ve paket duyuruları almak istiyorum” kutusunu işaretlediyseniz yapılır. Hukuki sebep: açık rıza; ticari elektronik iletiler için ayrıca onayınız aranır. Onayınızı istediğiniz zaman geri alabilirsiniz.</li>
  <li><strong>Sitenin hangi sayfa ve düğmelerinin kullanıldığını anlamak, içeriği ve paket anlatımını iyileştirmek.</strong> Yalnızca çerez çubuğunda “Kabul Et”i seçtiyseniz yapılır. Hukuki sebep: açık rıza (KVKK m.5/1). Rızanızı çerez politikasındaki “Tercihlerimi değiştir” düğmesiyle istediğiniz zaman geri alabilirsiniz; geri alma geleceğe yöneliktir.</li>
  <li><strong>Siteyi ve iletişim kanallarını güvenli tutmak, hukuki yükümlülükleri yerine getirmek.</strong> Hukuki sebep: hukuki yükümlülük (m.5/2-ç) ve meşru menfaat (m.5/2-f).</li>
</ul>`
      },
      {
        id: "aktarim",
        h2: "Verilerin aktarılması",
        html: `
<p>Kişisel verileriniz pazarlama amacıyla üçüncü kişilere satılmaz veya devredilmez. Ziyaret ölçümü verileri yalnızca bizim yönettiğimiz sunucuda tutulur ve reklam ağlarıyla ya da üçüncü taraf analiz hizmetleriyle paylaşılmaz.</p>
<p>Hesap e-postaları (doğrulama ve parola sıfırlama bağlantıları) da e-posta hizmeti sağlayıcısı üzerinden gönderilir. Talebiniz e-posta ile iletildiğinden, bilgileriniz sizin ve bizim e-posta hizmeti sağlayıcılarımız üzerinden geçer. Bu sağlayıcıların sunucuları yurt dışında olabilir; bu durumda aktarım KVKK m.9 hükümlerine uygun olarak gerçekleşir. Yetkili kamu kurum ve kuruluşlarına yalnızca mevzuattan doğan yükümlülüklerle sınırlı olarak bilgi verilebilir.</p>`
      },
      {
        id: "saklama",
        h2: "Saklama süresi",
        html: `
<p>Ziyaret ölçümü verileri en fazla 180 gün saklanır, ardından otomatik olarak silinir. Bu süre dolmadan silinmesini isterseniz aşağıdaki başvuru yolunu kullanabilirsiniz; tarayıcınızdaki ziyaretçi kimliğini (ekranda “tarayıcı depolaması”) göndermeniz kaydı bulmamızı kolaylaştırır.</p>
<p>Hesap verileriniz, hesabınız açık olduğu sürece saklanır. Hesabım sayfasındaki “Hesabı sil” işlemiyle profil bilgileriniz, siparişleriniz ve oturumlarınız silinir. Oturum kayıtları varsayılan olarak 30 gün geçerlidir; süresi dolanlar silinir. Vergi ve muhasebe mevzuatının fatura ve ödeme kayıtları için öngördüğü saklama yükümlülükleri saklıdır.</p>
<p>Diğer verileriniz, işleme amacının gerektirdiği süre boyunca saklanır. Amaç sona erdiğinde veya talebiniz üzerine silinir, yok edilir ya da anonim hâle getirilir (KVKK m.7). Mevzuatın daha uzun bir saklama süresi öngördüğü haller saklıdır.</p>`
      },
      {
        id: "haklariniz",
        h2: "KVKK m.11 kapsamındaki haklarınız",
        html: `
<p>Hesap sahipleri profil bilgilerini Hesabım sayfasından görebilir, düzeltebilir ve hesabını silebilir.</p>
<p>Veri sahibi olarak şu haklara sahipsiniz:</p>
<ul>
  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi talep etme</li>
  <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
  <li>Yurt içinde veya yurt dışında verilerinizin aktarıldığı üçüncü kişileri bilme</li>
  <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
  <li>Mevzuattaki şartlar çerçevesinde verilerin silinmesini veya yok edilmesini isteme</li>
  <li>Düzeltme, silme veya yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
  <li>İşlenen verilerin yalnızca otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç doğmasına itiraz etme</li>
  <li>Kanuna aykırı işleme nedeniyle zarar görmeniz hâlinde zararın giderilmesini talep etme</li>
</ul>`
      },
      {
        id: "basvuru",
        h2: "Başvuru yolu",
        html: `
<p>Haklarınıza ilişkin taleplerinizi <a href="{rel}iletisim/#talep">iletişim sayfasındaki</a> telefon veya e-posta kanallarından, kimliğinizi doğrulamamıza yarayacak bilgilerle birlikte iletebilirsiniz. Başvurunuz, niteliğine göre en geç otuz gün içinde yanıtlanır.</p>
<p>Yanıttan memnun kalmazsanız Kişisel Verileri Koruma Kurulu’na şikâyette bulunma hakkınız saklıdır.</p>`
      },
      {
        id: "guncellemeler",
        h2: "Güncellemeler",
        html: `
<p>Bu metin, site veya mevzuat değiştikçe güncellenir. Geçerli sürüm her zaman bu sayfadadır; en son güncelleme tarihi sayfanın başında yazar.</p>`
      }
    ]
  },

  {
    slug: "cerez-politikasi",
    nav: "Çerez Politikası",
    title: "Çerez Politikası",
    h1: "Çerez Politikası",
    description:
      "QR Menu Official sitesi ölçüm veya reklam çerezi yerleştirmez; giriş yaparsanız yalnızca oturumunuzu sürdüren zorunlu bir çerez yazılır. Ziyaret ölçümü yalnızca onayınızla çalışır; tercihinizi buradan değiştirebilirsiniz.",
    lead: "Bu site ölçüm veya reklam amaçlı çerez (cookie) yerleştirmez ve reklam aracı yüklemez. Giriş yaparsanız yalnızca oturumunuzu sürdüren zorunlu bir çerez yazılır. Ziyaret ölçümü yalnızca sizin onayınızla ve kendi sunucumuzda yapılır; tercihinizi aşağıdan istediğiniz zaman değiştirebilirsiniz.",
    sections: [
      {
        id: "ozet",
        h2: "Kısaca",
        html: `
<ul>
  <li>Site, ölçüm ya da reklam için çerez (cookie) yerleştirmez; tarayıcı depolamasını (localStorage, sessionStorage) kullanır.</li>
  <li>Yalnızca <strong>giriş yaparsanız</strong> oturumunuzu sürdüren, zorunlu bir oturum çerezi yazılır (ayrıntı aşağıda). Çıkış yaptığınızda silinir.</li>
  <li>Ziyaret ölçümü <strong>yalnızca “Kabul Et” derseniz</strong> çalışır. “Reddet” derseniz veya tarayıcınız Do Not Track / Global Privacy Control sinyali gönderiyorsa hiçbir kimlik saklanmaz, sunucuya hiçbir şey gönderilmez.</li>
  <li>Reklam, sosyal medya takibi veya üçüncü taraf analiz aracı yoktur; yazı tipi, harita, video gibi üçüncü taraf içerik yüklenmez.</li>
</ul>`
      },
      {
        id: "tercihler",
        h2: "Tercihlerim",
        html: `
<p>Ziyaret ölçümü tercihinizi değiştirmek için aşağıdaki düğmeye basın; çerez çubuğu yeniden açılır. “Reddet”i seçtiğinizde tarayıcınızdaki ziyaretçi kimliği silinir.</p>
<p><button type="button" class="qrmo-legal-pref-btn" data-qrmo-consent-open>Tercihlerimi değiştir</button></p>`
      },
      {
        id: "oturum-cerezi",
        h2: "Oturum çerezi (giriş yaparsanız)",
        html: `
<p>Hesabınıza giriş yaptığınızda tarayıcınıza bir oturum çerezi yazılır. Bu çerez hizmetin sunulması için zorunludur, bu nedenle ölçüm tercihinizden bağımsızdır ve ayrıca onay istenmez. Ölçüm, reklam veya profilleme için kullanılmaz.</p>
<ul>
  <li><strong>__Host-qrc_session</strong> (güvenli bağlantıda; aksi halde qrc_session). Rastgele üretilmiş oturum anahtarı; sunucuda yalnızca özeti tutulur. HttpOnly (sayfadaki betikler okuyamaz), Secure ve SameSite=Lax özellikleriyle yazılır. Varsayılan geçerlilik süresi 30 gündür; çıkış yaptığınızda, parolanızı değiştirdiğinizde (diğer cihazlarda) veya hesabınızı sildiğinizde sona erer.</li>
  <li><strong>qrmo_hesap</strong> (localStorage). Yalnızca menüdeki “Giriş Yap” bağlantısının “Hesabım” olarak görünmesi için tutulan “oturum var” işaretidir; kişisel veri içermez ve sunucuya gönderilmez.</li>
</ul>
<p>Çerezi tarayıcı ayarlarından silebilir veya engelleyebilirsiniz; bu durumda giriş yapamaz ve sipariş veremezsiniz, site diğer sayfalarda çalışmaya devam eder.</p>`
      },
      {
        id: "olcum-depolamasi",
        h2: "Ziyaret ölçümü (onayla)",
        html: `
<p>“Kabul Et” derseniz tarayıcınızda şu kayıtlar tutulur ve sayfa görüntüleme, tıklanan bağlantı/düğme adı, kaydırma derinliği ve etkin süre gibi olaylar kendi sunucumuza gönderilir:</p>
<ul>
  <li><strong>qrmo_consent</strong> (localStorage). Tercihinizi hatırlamak için; onay ya da red bilgisi.</li>
  <li><strong>qrmo_vid</strong> (localStorage). Rastgele üretilmiş anonim ziyaretçi kimliği; aynı tarayıcıdan gelen ziyaretleri birbirine bağlar. Adınız, e-postanız veya telefonunuzla ilişkilendirilmez. Tarayıcı verilerini silerek ya da “Reddet”i seçerek kaldırabilirsiniz.</li>
  <li><strong>qrmo_sid, qrmo_seen, qrmo_ctx</strong> (sessionStorage). Aynı ziyaretin sayfalarını bir araya getirmek için oturum kimliği ve son etkinlik zamanı; sekme kapanınca silinir.</li>
</ul>
<p>Sunucuya ayrıca IP adresiniz ve tarayıcınızın bildirdiği bilgiler (tarayıcı, işletim sistemi, cihaz türü, ekran boyutu, dil) ulaşır. Veriler en fazla 180 gün saklanır. Ayrıntı ve haklarınız için <a href="{rel}gizlilik/">Gizlilik Politikası ve KVKK Aydınlatma Metni</a>’ne bakın.</p>`
      },
      {
        id: "tarayici-depolamasi",
        h2: "Arayüz tercihleri (sessionStorage)",
        html: `
<p>Sitenin iki arayüz tercihi, ölçüm onayından bağımsız olarak tarayıcınızın oturum depolamasında (sessionStorage) tutulur. Bu bilgiler sunucuya gönderilmez ve sekmeyi kapattığınızda silinir.</p>
<ul>
  <li><strong>Açılış ekranı bilgisi.</strong> Ana sayfadaki açılış animasyonunu aynı oturumda tekrar göstermemek için.</li>
  <li><strong>Karşılaştırma görünümü.</strong> Paketler sayfasındaki karşılaştırma tablosunun görünüm tercihini hatırlamak için.</li>
</ul>`
      },
      {
        id: "demo-menuler",
        h2: "Canlı demo menüler",
        html: `
<p>Canlı demo menüler ayrı alt alan adlarında çalışır. Bu demolarda masa oturumu ve menü tercihlerinin çalışması için çerez veya tarayıcı depolaması kullanılabilir. Demolara gerçek kişisel veri girmemenizi öneririz.</p>`
      },
      {
        id: "yonetim",
        h2: "Tarayıcınızdan yönetme",
        html: `
<p>Tarayıcı ayarlarınızdan site verilerini istediğiniz zaman silebilir veya depolamayı engelleyebilirsiniz. Depolama kapalıyken site çalışmaya devam eder; ölçüm yapılmaz ve yukarıdaki arayüz tercihleri hatırlanmaz. Çerezleri engellerseniz hesabınıza giriş yapamazsınız.</p>`
      },
      {
        id: "degisiklik",
        h2: "Değişiklik olursa",
        html: `
<p>Ölçüm kapsamı veya saklama süresi değişirse bu politika aynı anda güncellenir ve gereken yerde onayınız yeniden istenir. Kişisel verilerin işlenmesi için <a href="{rel}gizlilik/">Gizlilik Politikası ve KVKK Aydınlatma Metni</a>’ne bakın.</p>`
      }
    ]
  },

  {
    slug: "kullanim-sartlari",
    nav: "Kullanım Şartları",
    title: "Kullanım Şartları",
    h1: "Kullanım Şartları",
    description:
      "QR Menu Official sitesinin kullanımına, fiyat ve paket bilgilerine, demo menülere ve içeriğe ilişkin şartlar.",
    lead: "Bu siteyi kullanarak aşağıdaki şartları kabul etmiş olursunuz. Site çözümleri tanıtır; hesap açıp paket seçebilirsiniz. Ödeme adımı şu anda test modundadır ve ücret çekilmez.",
    sections: [
      {
        id: "kapsam",
        h2: "Kapsam",
        html: `
<p>Bu şartlar, qrmenuofficial.com sitesinin ve sitede yer alan sayfaların kullanımı için geçerlidir. Siteyi kullanmaya devam etmeniz, şartları kabul ettiğiniz anlamına gelir.</p>`
      },
      {
        id: "sitenin-amaci",
        h2: "Sitenin amacı",
        html: `
<p>Site, QR Menu Official çözümlerini tanıtır ve paket satın almak için hesap açmanıza olanak tanır. Hesap açmak ücretsizdir ve satın alma yükümlülüğü doğurmaz. Ödeme adımı şu anda test modundadır: ücret çekilmez, kart bilgisi alınmaz ve test siparişi bağlayıcı bir sözleşme oluşturmaz. Gerçek ödeme açıldığında bu şartlar güncellenir. Hizmete ilişkin talepler <a href="{rel}iletisim/">iletişim sayfasındaki</a> kanallarla iletilir.</p>`
      },
      {
        id: "hesabiniz",
        h2: "Hesabınız",
        html: `
<p>Hesap açarken doğru ve güncel bilgi vermeniz, parolanızı gizli tutmanız ve başkasıyla paylaşmamanız beklenir. Hesabınızla yapılan işlemlerden, parolanızın sizin kusurunuzla başkalarının eline geçmesi hâlinde siz sorumlusunuz. Hesabınızın izinsiz kullanıldığından şüphelenirseniz parolanızı Hesabım sayfasından değiştirin ve <a href="{rel}iletisim/">bize bildirin</a>.</p>
<p>Hesabınızı istediğiniz zaman Hesabım sayfasından silebilirsiniz; bu işlem profil bilgilerinizi ve sipariş kayıtlarınızı kalıcı olarak siler. Verilerin nasıl işlendiği <a href="{rel}gizlilik/">Gizlilik Politikası ve KVKK Aydınlatma Metni</a>’ndedir.</p>`
      },
      {
        id: "fiyat-paket",
        h2: "Fiyat ve paket bilgileri",
        html: `
<p><a href="{rel}paketler/">Paketler sayfasındaki</a> fiyatlar ve özellik listeleri bilgilendirme amaçlıdır; değişebilir ve bağlayıcı bir teklif ya da sözleşme oluşturmaz. Paket kapsamı, ücret ve ödeme koşulları, hizmet başlamadan önce ayrıca netleştirilir.</p>
<p>Modüllerin hangisinin açık olacağı seçtiğiniz pakete ve lisansa göre belirlenir.</p>`
      },
      {
        id: "iptal-iade",
        h2: "İptal ve iade",
        html: `
<ul>
<li><strong>Aylık üyelik:</strong> Taahhüt yoktur. İstediğiniz zaman iptal edebilirsiniz; iptal, içinde bulunulan ödeme döneminin sonunda geçerli olur.</li>
<li><strong>Yıllık üyelik:</strong> Kurulum ücreti alınmaz.</li>
<li><strong>İade:</strong> Hizmetin başlamasından itibaren ilk 14 gün içinde iade talep edebilirsiniz. Abonelik bedeli iade edilir; sizin adınıza alınmış alan adı ve hosting için yapılan gerçek maliyet iade tutarından düşülür.</li>
</ul>
<p>İptal ve iade talebinizi <a href="{rel}iletisim/">iletişim sayfasındaki</a> kanallardan iletebilirsiniz. Tüketici sıfatıyla sahip olduğunuz yasal haklar bu şartlardan etkilenmez.</p>
<!-- TODO (site sahibi): 14 günlük iade süresi ve alan adı/hosting düşümü ticari karardır; yasal cayma süresi ve B2B/tüketici ayrımı için hukuki inceleme yapın. İade yöntemi (havale/kart iadesi) ve süreyi ekleyin. -->`
      },
      {
        id: "gorseller",
        h2: "Görseller ve örnek veriler",
        html: `
<p>Sitedeki ekran görüntüleri, çizimler ve istatistik ekranları “örnek veri” veya “temsili görünüm” olarak anlatılan, gösterim amaçlı içeriklerdir; gerçek bir işletmenin verisi değildir.</p>`
      },
      {
        id: "demo-menuler",
        h2: "Canlı demo menüler",
        html: `
<p><a href="{rel}canli-menu/">Canlı demo menüler</a> ürünü denemeniz içindir. Demolarda yaptığınız sipariş, garson çağrısı ve yorum gibi denemeler gösterim amaçlıdır. Demo ortamına gerçek kişisel veri girmeyin.</p>`
      },
      {
        id: "fikri-mulkiyet",
        h2: "Fikri mülkiyet",
        html: `
<p>Sitedeki yazılar, tasarım, logo ve görseller QR Menu Official’a aittir. Yazılı izin olmadan kopyalanamaz, çoğaltılamaz veya başka bir yerde yayımlanamaz.</p>`
      },
      {
        id: "sorumluluk",
        h2: "Sorumluluğun sınırı",
        html: `
<p>Sitedeki bilgiler özenle hazırlanır; ancak sitenin kesintisiz çalışacağı ya da bilgilerin her zaman güncel ve eksiksiz olacağı garanti edilmez. Hata bulursanız <a href="{rel}iletisim/">bize bildirebilirsiniz</a>.</p>`
      },
      {
        id: "veri-ve-degisiklik",
        h2: "Kişisel veriler ve değişiklikler",
        html: `
<p>Kişisel verilerinizin nasıl işlendiğini <a href="{rel}gizlilik/">Gizlilik Politikası ve KVKK Aydınlatma Metni</a>’nde, tarayıcı depolamasını <a href="{rel}cerez-politikasi/">Çerez Politikası</a>’nda bulabilirsiniz.</p>
<p>Bu şartlar zaman zaman güncellenebilir; geçerli sürüm bu sayfadadır. Şartlara Türk hukuku uygulanır.</p>
<!-- TODO (site sahibi): yetkili mahkeme / icra dairesi bilgisini ve ticaret unvanını ekleyin. -->`
      }
    ]
  },
  {
    slug: "mesafeli-satis",
    nav: "Mesafeli Satış",
    title: "Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu",
    h1: "Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu",
    description:
      "QR Menu Official paketi satın almadan önce bilmeniz gerekenler: satıcı bilgileri, hizmetin kapsamı, fiyat, cayma ve iade koşulları, lisans doğrulaması.",
    lead: "Bir paket satın almadan önce okumanız için hazırlanmıştır. Ödemeyi onaylamadan önce bu metni okuduğunuzu ve kabul ettiğinizi bildirirsiniz.",
    noindexUnlessComplete: true,
    updated: "9 Kasım 2026",
    sections: [
      {
        id: "satici",
        h2: "Satıcı bilgileri",
        html: () => `
<ul>
<li><strong>Ticaret unvanı:</strong> ${f(SELLER.unvan, "ticaret unvanı")}</li>
<li><strong>Adres:</strong> ${f(SELLER.adres, "açık adres")}</li>
<li><strong>Vergi dairesi / numarası:</strong> ${f(SELLER.vergi, "vergi dairesi ve numarası")}</li>
<li><strong>MERSİS no:</strong> ${f(SELLER.mersis, "MERSİS no")}</li>
<li><strong>Telefon:</strong> ${f(SELLER.telefon, "telefon")}</li>
<li><strong>E-posta:</strong> ${f(SELLER.eposta, "e-posta")}</li>
<li><strong>KEP adresi:</strong> ${f(SELLER.kep, "KEP adresi")}</li>
<li><strong>Web sitesi:</strong> qrmenuofficial.com</li>
</ul>
<p>Bu metinde “Satıcı” yukarıdaki kişi veya işletmeyi, “Alıcı” sipariş sırasında kendi adına ya da temsil ettiği işletme adına bilgi veren kişiyi anlatır. Alıcının ad, işletme adı, e-posta, telefon ve alan adı bilgisi sipariş ve hesap kaydındadır.</p>`
      },
      {
        id: "hizmet",
        h2: "Satılan hizmet ve temel nitelikleri",
        html: `
<p>Satıcı, Alıcı’nın WordPress sitesinde kullanacağı <strong>QR Menu Suite</strong> eklentisinin lisansını, seçilen pakete (Temel, Pro veya Plus) dahil modüllerle birlikte, seçilen dönem (aylık veya yıllık) boyunca kullanım hakkı olarak sunar. Paketlerin içeriği <a href="{rel}paketler/">Paketler</a>, modüllerin ayrıntısı <a href="{rel}moduller/">Modüller</a> sayfasındadır; sipariş özetinde seçtiğiniz paket ve dönem yazar.</p>
<ul>
<li>Lisans <strong>tek bir alan adına</strong> bağlanır. İlk doğrulamada hangi alan adıyla etkinleştirildiyse o alan adı kilitlenir.</li>
<li>Eklentiyi çalıştıracak WordPress sitesi, alan adı ve barındırma hizmeti paket fiyatına dahil değildir; ayrıca belirtilmedikçe Alıcı’ya aittir.</li>
<li>Menü Asistanı ve Servis Paneli gibi üçüncü taraf hizmet anahtarı isteyen modüller için gereken hesap ve anahtarlar ayrıca belirtilmedikçe Alıcı’ya aittir; bu hizmetlerin kendi ücretleri olabilir.</li>
<li>Hizmet <strong>yazılım lisansıdır</strong>; fiziksel ürün gönderilmez.</li>
</ul>`
      },
      {
        id: "fiyat",
        h2: "Fiyat ve ödeme",
        html: () => `
<ul>
<li><strong>Toplam fiyat:</strong> Ödeme ekranındaki sipariş özetinde yazan, seçtiğiniz paket ve dönemin bedelidir. Sipariş vermeden önce o tutarı görürsünüz. Güncel liste fiyatları <a href="{rel}paketler/">Paketler</a> sayfasındadır.</li>
<li><strong>Vergi:</strong> ${f(SELLER.kdv, "KDV durumu")}.</li>
<li><strong>Ödeme yöntemi:</strong> ${f(SELLER.odemeYontemi, "ödeme yöntemi")}. Kart bilgileriniz bu sitede alınmaz ve saklanmaz; ödeme, ödeme sağlayıcısının güvenli sayfasında yapılır.</li>
<li><strong>Yenileme:</strong> ${f(SELLER.yenileme, "yenileme şekli")}.</li>
<li><strong>Ek maliyet:</strong> Ödeme sağlayıcısı veya bankanızın alabileceği komisyonlar dışında, sipariş özetinde görmediğiniz bir bedel istenmez.</li>
</ul>`
      },
      {
        id: "ifa",
        h2: "Teslim ve hizmetin başlaması",
        html: `
<p>Ödeme onaylandıktan sonra lisans anahtarınız hesabınıza bağlanır ve <a href="{rel}hesabim/">Hesabım</a> sayfasında görünür; eklentiyi kurup anahtarı girdiğinizde lisans etkinleşir. Lisansın hesabınıza tanımlanması ödemeden sonra en geç <strong>30 gün</strong> içinde yapılır; genellikle çok daha kısa sürer. Lisans bir kez etkinleştiğinde hizmetin ifasına başlanmış sayılır.</p>
<p>Hizmetin ifasına başlanmasına siparişi onaylayarak açıkça izin vermiş olursunuz.</p>`
      },
      {
        id: "cayma",
        h2: "Cayma, iptal ve iade",
        html: `
<p><strong>Tüketici iseniz</strong> (hizmeti ticari veya mesleki amaç dışında satın alıyorsanız), sözleşmeden <strong>14 gün</strong> içinde gerekçe göstermeden ve ceza ödemeden cayma hakkınız vardır. Süre sözleşmenin kurulduğu günden başlar. Cayma hakkını, bu sayfadaki iletişim bilgilerine yazılı veya e-postayla bildirerek kullanırsınız; ayrıca <a href="{rel}iletisim/">iletişim sayfasını</a> kullanabilirsiniz.</p>
<p>Elektronik ortamda anında ifa edilen hizmetlerde ve onayınızla ifasına başlanan hizmetlerde cayma hakkı mevzuatta sınırlanmıştır. Siz yine de iade ister ve bu yüzden hizmeti kullanmaya başlamadıysanız talebiniz değerlendirilir.</p>
<p><strong>İşletme olarak</strong> (restoran, kafe vb. kendi işiniz için) satın alıyorsanız kanundaki tüketici cayma hakkı size uygulanmaz. Bununla birlikte <a href="{rel}kullanim-sartlari/#iptal-iade">Kullanım Şartları’ndaki iptal ve iade koşulları</a> (aylık üyelikte dönem sonunda iptal; hizmetin başlamasından itibaren ilk 14 gün içinde iade talebi) sizin için de geçerlidir.</p>
<p>İade onaylandığında bedel, ödemeyi yaptığınız yönteme, en geç 14 gün içinde iade edilir. Alıcı adına alınmış alan adı veya barındırma varsa gerçek maliyeti iade tutarından düşülür.</p>`
      },
      {
        id: "lisans-dogrulama",
        h2: "Lisans doğrulaması",
        html: `
<p>Eklenti, lisansın geçerli olduğunu doğrulamak için günde bir kez ve kurulum sırasında qrmenuofficial.com sunucusuna lisans anahtarını ve sitenizin alan adını gönderir; sunucu lisansın durumunu ve açılacak modülleri imzalı bir cevapla bildirir.</p>
<ul>
<li>Sunucuya ulaşılamazsa sitenizdeki menü çalışmaya devam eder.</li>
<li>Lisans geçersiz sayılırsa (iptal, süre dolması, başka alan adında kullanım) modüller <strong>24 saat sonra</strong> kapanır. Lisansı yeniden geçerli yaptığınızda modüller geri gelir.</li>
</ul>`
      },
      {
        id: "kullanim",
        h2: "Kullanım hakkı ve sorumluluk",
        html: `
<ul>
<li>Lisans kişiye ve alan adına özeldir; devredilemez, kiralanamaz, başka alan adlarında kullanılamaz. Eklentinin kaynak kodu ve tasarımı Satıcı’ya aittir.</li>
<li>Menü, fiyat ve görsellerin doğruluğundan, alerjen bildirimlerinden ve sitenizin yasal yükümlülüklerinden Alıcı sorumludur.</li>
<li>Satıcı, hizmeti özenle sunar; ancak WordPress, barındırma, alan adı ve üçüncü taraf hizmetlerden kaynaklanan kesintilerden sorumlu değildir. Emredici hukuk kuralları saklıdır.</li>
<li>Mücbir sebepler (doğal afet, yaygın elektrik veya internet kesintisi, resmî karar vb.) süresince taraflar yükümlülüklerini yerine getiremedikleri için sorumlu tutulmaz.</li>
</ul>`
      },
      {
        id: "veri",
        h2: "Kişisel veriler",
        html: `
<p>Sipariş ve hesap bilgileriniz <a href="{rel}gizlilik/">Gizlilik Politikası ve KVKK Aydınlatma Metni</a>’nde anlatıldığı şekilde işlenir. Faturalandırma için istenen bilgiler vergi mevzuatı gereği saklanır.</p>`
      },
      {
        id: "uyusmazlik",
        h2: "Şikâyet ve uyuşmazlık",
        html: () => `
<p>Şikâyetlerinizi önce yukarıdaki iletişim bilgilerinden bize iletin. Tüketici iseniz uyuşmazlıklar için, yürürlükteki parasal sınırlara göre, yerleşim yerinizdeki veya işlemin yapıldığı yerdeki <strong>Tüketici Hakem Heyeti</strong>’ne ya da <strong>Tüketici Mahkemesi</strong>’ne başvurabilirsiniz. İşletme olarak satın alıyorsanız yetkili merci: ${f(SELLER.mahkeme, "yetkili mahkeme ve icra daireleri")}. Sözleşmeye Türk hukuku uygulanır.</p>`
      },
      {
        id: "yururluk",
        h2: "Onay ve yürürlük",
        html: `
<p>Alıcı, ödeme ekranında bu metni okuduğunu, ön bilgileri aldığını ve elektronik ortamda onayladığını bildirdiğinde sözleşme kurulur. Onaylanan sürüm, sipariş kaydıyla birlikte hesabınızda saklanan sipariş referansıyla ilişkilendirilir. Metin değiştiğinde yeni siparişler için yeni sürüm geçerli olur; mevcut siparişiniz verdiğiniz andaki koşullara tabidir.</p>
<p>Ödeme adımı şu anda test modundadır: gerçek ödeme açılana kadar bu metin bağlayıcı bir satış doğurmaz.</p>`
      }
    ]
  }
];
