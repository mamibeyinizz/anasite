/* =========================================================
   QR MENU OFFICIAL — YASAL SAYFALAR: TEK VERİ KAYNAĞI
   Üretim: node yasal/build.mjs  →  /gizlilik/ · /cerez-politikasi/ · /kullanim-sartlari/

   İçerik yalnızca sitenin gerçekte yaptığına dayanır (iletişim formu e-posta taslağı
   hazırlar, sunucuya kaydetmez; üçüncü taraf betik/yazı tipi/harita/reklam aracı yoktur).
   Ziyaret ölçümü YALNIZCA onayla çalışır ve kendi sunucumuza yazar (global/src/analytics.js →
   /api/collect → backend/src/Site/Collector.php; saklama süresi backend/config: retention_days).
   Bunlardan biri değişirse (ör. GA4, Meta pixel, form sunucusu eklenirse, saklama süresi
   değişirse) ilgili metin AYNI değişiklikte güncellenir.

   Metinlerde {rel} sayfa derinliğine göre göreli yol ön ekidir ("../").
   Hukuki inceleme: ticaret unvanı, adres, MERSİS/VERBİS ve yetkili mahkeme bilgisi
   henüz repoda yoktur; sahibi eklemelidir (bkz. README "Bilinçli olarak açık kalan konular").
========================================================= */

export const UPDATED = "31 Ekim 2026";

export const PAGES = [
  {
    slug: "gizlilik",
    nav: "Gizlilik ve KVKK",
    title: "Gizlilik Politikası ve KVKK Aydınlatma Metni",
    h1: "Gizlilik Politikası ve KVKK Aydınlatma Metni",
    description:
      "QR Menu Official sitesinde hangi kişisel verilerin, neden ve nasıl işlendiği; 6698 sayılı KVKK kapsamındaki haklarınız.",
    lead: "İletişim formunu doldurduğunuzda ya da bize yazdığınızda hangi bilgilerinizin işlendiğini, neden işlendiğini ve haklarınızı bu sayfada bulabilirsiniz.",
    sections: [
      {
        id: "kapsam",
        h2: "Kapsam",
        html: `
<p>Bu metin, qrmenuofficial.com sitesini ziyaret edenler ve site üzerinden bizimle iletişime geçenler içindir.</p>
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
<p><strong>Site kullanımı (yalnızca onayınızla).</strong> Çerez çubuğunda “Kabul Et”i seçerseniz şunlar kaydedilir: ziyaret ettiğiniz sayfalar ve zamanı, tıkladığınız bağlantı ve düğmelerin adı, sayfada ne kadar kaydırdığınız, sayfada geçirdiğiniz etkin süre, tarayıcı türü, işletim sistemi, cihaz türü, ekran boyutu ve dil, sizi siteye getiren adres veya kampanya etiketi (utm), IP adresiniz, IP adresinden türetilen ülke bilgisi ve tarayıcınızda saklanan rastgele bir ziyaretçi kimliği. Form alanlarına yazdıklarınız, tuş vuruşlarınız ve sayfalardaki metin içerikleri okunmaz. “Reddet”i seçerseniz veya tarayıcınız “Do Not Track” / “Global Privacy Control” sinyali gönderiyorsa bunların hiçbiri saklanmaz ve gönderilmez (ayrıntı: <a href="{rel}cerez-politikasi/">Çerez Politikası</a>).</p>
<p><strong>Sunucu kayıtları.</strong> Barındırma hizmetini veren sağlayıcı, sitenin güvenliği ve çalışması için IP adresi, tarayıcı bilgisi ve erişim zamanı gibi sunucu kayıtlarını onayınızdan bağımsız olarak tutabilir.</p>`
      },
      {
        id: "toplama-yontemi",
        h2: "Verilerin toplanma yöntemi",
        html: `
<p>İletişim formundaki “talebi e-posta taslağına aktar” düğmesi, yazdıklarınızı cihazınızdaki e-posta uygulamasında bir taslağa dönüştürür. Site bu bilgileri bir sunucuya kaydetmez; bilgileriniz, e-postayı siz gönderdiğinizde bize ulaşır.</p>
<p>Telefonla veya e-postayla bize doğrudan ulaştığınızda bilgileriniz sizin ilettiğiniz kadarıyla alınır.</p>
<p>Ziyaret ölçümü verileri, onay verdiğinizde tarayıcınızdaki küçük bir betik aracılığıyla ve otomatik yollarla kendi sunucumuza gönderilir. Üçüncü taraf bir analiz veya reklam hizmeti kullanılmaz.</p>`
      },
      {
        id: "amac-ve-hukuki-sebep",
        h2: "İşleme amaçları ve hukuki sebepleri",
        html: `
<ul>
  <li><strong>Talebinizi yanıtlamak, çözüm ve paketler hakkında bilgi vermek, ön görüşmeyi yürütmek.</strong> Hukuki sebep: bir sözleşmenin kurulması için gerekli olması (KVKK m.5/2-c) ve meşru menfaat (m.5/2-f).</li>
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
<p>Talebiniz e-posta ile iletildiğinden, bilgileriniz sizin ve bizim e-posta hizmeti sağlayıcılarımız üzerinden geçer. Bu sağlayıcıların sunucuları yurt dışında olabilir; bu durumda aktarım KVKK m.9 hükümlerine uygun olarak gerçekleşir. Yetkili kamu kurum ve kuruluşlarına yalnızca mevzuattan doğan yükümlülüklerle sınırlı olarak bilgi verilebilir.</p>`
      },
      {
        id: "saklama",
        h2: "Saklama süresi",
        html: `
<p>Ziyaret ölçümü verileri en fazla 180 gün saklanır, ardından otomatik olarak silinir. Bu süre dolmadan silinmesini isterseniz aşağıdaki başvuru yolunu kullanabilirsiniz; tarayıcınızdaki ziyaretçi kimliğini (ekranda “tarayıcı depolaması”) göndermeniz kaydı bulmamızı kolaylaştırır.</p>
<p>Diğer verileriniz, işleme amacının gerektirdiği süre boyunca saklanır. Amaç sona erdiğinde veya talebiniz üzerine silinir, yok edilir ya da anonim hâle getirilir (KVKK m.7). Mevzuatın daha uzun bir saklama süresi öngördüğü haller saklıdır.</p>`
      },
      {
        id: "haklariniz",
        h2: "KVKK m.11 kapsamındaki haklarınız",
        html: `
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
      "QR Menu Official sitesi çerez yerleştirmez; ziyaret ölçümü yalnızca onayınızla, tarayıcı depolamasında tutulan anonim bir kimlikle çalışır. Tercihinizi buradan değiştirebilirsiniz.",
    lead: "Bu site çerez (cookie) yerleştirmez ve reklam aracı yüklemez. Ziyaret ölçümü yalnızca sizin onayınızla ve kendi sunucumuzda yapılır; tercihinizi aşağıdan istediğiniz zaman değiştirebilirsiniz.",
    sections: [
      {
        id: "ozet",
        h2: "Kısaca",
        html: `
<ul>
  <li>Site çerez (cookie) yerleştirmez; tarayıcı depolamasını (localStorage, sessionStorage) kullanır.</li>
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
<p>Tarayıcı ayarlarınızdan site verilerini istediğiniz zaman silebilir veya depolamayı engelleyebilirsiniz. Depolama kapalıyken site çalışmaya devam eder; ölçüm yapılmaz ve yukarıdaki arayüz tercihleri hatırlanmaz.</p>`
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
    lead: "Bu siteyi kullanarak aşağıdaki şartları kabul etmiş olursunuz. Site tanıtım amaçlıdır; satın alma ve ödeme bu sitede yapılmaz.",
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
<p>Site, QR Menu Official çözümlerini tanıtır. Bu sitede hesap oluşturulmaz, satın alma ya da ödeme yapılmaz. Hizmete ilişkin talepler <a href="{rel}iletisim/">iletişim sayfasındaki</a> kanallarla iletilir.</p>`
      },
      {
        id: "fiyat-paket",
        h2: "Fiyat ve paket bilgileri",
        html: `
<p><a href="{rel}paketler/">Paketler sayfasındaki</a> fiyatlar ve özellik listeleri bilgilendirme amaçlıdır; değişebilir ve bağlayıcı bir teklif ya da sözleşme oluşturmaz. Paket kapsamı, ücret ve ödeme koşulları, hizmet başlamadan önce ayrıca netleştirilir.</p>
<p>Modüllerin hangisinin açık olacağı seçtiğiniz pakete ve lisansa göre belirlenir.</p>`
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
  }
];
