/* =========================================================
   QR MENU OFFICIAL — YASAL SAYFALAR: TEK VERİ KAYNAĞI
   Üretim: node yasal/build.mjs  →  /gizlilik/ · /cerez-politikasi/ · /kullanim-sartlari/

   İçerik yalnızca sitenin gerçekte yaptığına dayanır (iletişim formu e-posta taslağı
   hazırlar, sunucuya kaydetmez; çerez yoktur, yalnızca sessionStorage kullanılır;
   üçüncü taraf betik/yazı tipi/harita/ölçüm aracı yoktur). Bunlardan biri değişirse
   (ör. GA4, Meta pixel, form sunucusu eklenirse) ilgili metin AYNI değişiklikte güncellenir.

   Metinlerde {rel} sayfa derinliğine göre göreli yol ön ekidir ("../").
   Hukuki inceleme: ticaret unvanı, adres, MERSİS/VERBİS ve yetkili mahkeme bilgisi
   henüz repoda yoktur; sahibi eklemelidir (bkz. README "Bilinçli olarak açık kalan konular").
========================================================= */

export const UPDATED = "30 Ekim 2026";

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
<p><strong>Site kullanımı.</strong> Sitenin kendisi çerez kullanmaz; reklam, analiz veya takip aracı bulunmaz (ayrıntı: <a href="{rel}cerez-politikasi/">Çerez Politikası</a>). Barındırma hizmetini veren sağlayıcı, sitenin güvenliği ve çalışması için IP adresi, tarayıcı bilgisi ve erişim zamanı gibi sunucu kayıtlarını tutabilir.</p>`
      },
      {
        id: "toplama-yontemi",
        h2: "Verilerin toplanma yöntemi",
        html: `
<p>İletişim formundaki “talebi e-posta taslağına aktar” düğmesi, yazdıklarınızı cihazınızdaki e-posta uygulamasında bir taslağa dönüştürür. Site bu bilgileri bir sunucuya kaydetmez; bilgileriniz, e-postayı siz gönderdiğinizde bize ulaşır.</p>
<p>Telefonla veya e-postayla bize doğrudan ulaştığınızda bilgileriniz sizin ilettiğiniz kadarıyla alınır.</p>`
      },
      {
        id: "amac-ve-hukuki-sebep",
        h2: "İşleme amaçları ve hukuki sebepleri",
        html: `
<ul>
  <li><strong>Talebinizi yanıtlamak, çözüm ve paketler hakkında bilgi vermek, ön görüşmeyi yürütmek.</strong> Hukuki sebep: bir sözleşmenin kurulması için gerekli olması (KVKK m.5/2-c) ve meşru menfaat (m.5/2-f).</li>
  <li><strong>Ürün ve paket duyuruları göndermek.</strong> Yalnızca formdaki “Ürün ve paket duyuruları almak istiyorum” kutusunu işaretlediyseniz yapılır. Hukuki sebep: açık rıza; ticari elektronik iletiler için ayrıca onayınız aranır. Onayınızı istediğiniz zaman geri alabilirsiniz.</li>
  <li><strong>Siteyi ve iletişim kanallarını güvenli tutmak, hukuki yükümlülükleri yerine getirmek.</strong> Hukuki sebep: hukuki yükümlülük (m.5/2-ç) ve meşru menfaat (m.5/2-f).</li>
</ul>`
      },
      {
        id: "aktarim",
        h2: "Verilerin aktarılması",
        html: `
<p>Kişisel verileriniz pazarlama amacıyla üçüncü kişilere satılmaz veya devredilmez.</p>
<p>Talebiniz e-posta ile iletildiğinden, bilgileriniz sizin ve bizim e-posta hizmeti sağlayıcılarımız üzerinden geçer. Bu sağlayıcıların sunucuları yurt dışında olabilir; bu durumda aktarım KVKK m.9 hükümlerine uygun olarak gerçekleşir. Yetkili kamu kurum ve kuruluşlarına yalnızca mevzuattan doğan yükümlülüklerle sınırlı olarak bilgi verilebilir.</p>`
      },
      {
        id: "saklama",
        h2: "Saklama süresi",
        html: `
<p>Verileriniz, işleme amacının gerektirdiği süre boyunca saklanır. Amaç sona erdiğinde veya talebiniz üzerine silinir, yok edilir ya da anonim hâle getirilir (KVKK m.7). Mevzuatın daha uzun bir saklama süresi öngördüğü haller saklıdır.</p>`
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
      "QR Menu Official sitesi çerez kullanmaz; yalnızca tarayıcı oturumu boyunca tutulan iki arayüz tercihi vardır.",
    lead: "Bu site çerez kullanmaz, reklam veya takip aracı yüklemez. Tarayıcınızda tuttuğu iki küçük arayüz tercihi aşağıda yazılıdır.",
    sections: [
      {
        id: "ozet",
        h2: "Kısaca",
        html: `
<ul>
  <li>Site çerez (cookie) yerleştirmez.</li>
  <li>Reklam, ziyaretçi analizi veya sosyal medya takip aracı yoktur.</li>
  <li>Yazı tipi, harita, video gibi üçüncü taraf içerik yüklenmez; sayfalar yalnızca kendi alan adımızdan çalışır.</li>
</ul>`
      },
      {
        id: "tarayici-depolamasi",
        h2: "Tarayıcı oturum depolaması",
        html: `
<p>Sitenin iki arayüz tercihi, tarayıcınızın oturum depolamasında (sessionStorage) tutulur. Bu bilgiler sunucuya gönderilmez ve sekmeyi kapattığınızda silinir.</p>
<ul>
  <li><strong>Açılış ekranı bilgisi.</strong> Ana sayfadaki açılış animasyonunu aynı oturumda tekrar göstermemek için.</li>
  <li><strong>Karşılaştırma görünümü.</strong> Paketler sayfasındaki karşılaştırma tablosunun görünüm tercihini hatırlamak için.</li>
</ul>
<p>Bu bilgiler sizi tanımlamaz ve iki işlevin çalışması dışında kullanılmaz.</p>`
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
<p>Tarayıcı ayarlarınızdan site verilerini istediğiniz zaman silebilir veya depolamayı engelleyebilirsiniz. Depolama kapalıyken site çalışmaya devam eder; yalnızca yukarıdaki iki tercih hatırlanmaz.</p>`
      },
      {
        id: "degisiklik",
        h2: "Değişiklik olursa",
        html: `
<p>Siteye ziyaretçi analizi veya benzeri bir araç eklenirse bu politika önce güncellenir ve gereken yerde onayınız alınır. Kişisel verilerin işlenmesi için <a href="{rel}gizlilik/">Gizlilik Politikası ve KVKK Aydınlatma Metni</a>’ne bakın.</p>`
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
