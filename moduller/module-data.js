/* =========================================================
   QR MENU OFFICIAL — /moduller/ İÇERİK VERİSİ
   Modül sayfalarının TÜM içeriği yalnızca burada tanımlanır.
   Tasarım koduna (build.js, module-page.css) dokunmadan metin,
   özellik, adım, ilgili modül değiştirilebilir; ardından:

       node moduller/build.js

   çalıştırılarak 10 sayfa + /moduller/ dizini yeniden üretilir.

   PAKET BİLGİSİ burada yazılmaz: featureIds → ../paketler/packages-data.js
   içindeki özelliklerin `from` alanından hesaplanır (source of truth).

   İÇERİK KURALI: features[].items[] yalnızca qr-menu-suite kodunda
   doğrulanmış davranışı anlatır. `src` alanı doğrulama kaynağıdır
   (sayfada görünmez). hero/problem/audience metinleri pazarlama
   copy'sidir; ürün davranışıyla çelişmemelidir.
   ========================================================= */

(function (root, factory) {
  var data = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else root.QRMO_MODULES = data;
})(this, function () {
  return {

    site: {
      baseUrl: "https://qrmenuofficial.com",
      brand: "QR Menu Official",
      pricingLabel: "Paketleri İncele"
    },

    /* Mockup alt yazısı: gerçek ekran görüntüsü izlenimi verilmez. */
    mockCaption: "Temsili arayüz çizimi — gerçek ekran görüntüsü değildir; örnek içerik kullanılmıştır.",

    modules: [

      /* ===================================================
         1. RESTORAN MENÜ
      =================================================== */
      {
        slug: "restoran-menu",
        name: "Restoran Menü",
        tagline: "Menü, fiyat ve stok tek panelde.",
        featureIds: ["qr-menu", "menu-yonetimi", "csv-aktar", "porsiyon-ekstra", "kampanya-combo", "rozetler"],
        seo: {
          title: "Restoran Menü — Dijital QR Menü Yönetimi",
          description: "Kategori, ürün, fiyat, alerjen, porsiyon ve kampanyaları tek panelden yönetin; menünüz müşterinin telefonunda aranabilir ve filtrelenebilir açılsın."
        },
        hero: {
          h1: "Baskı menüyü bırakın, menünüzü panelden yönetin.",
          lead: "Kategoriler, ürünler, fiyatlar ve alerjen bilgisi tek yerde durur. Müşteri menüyü QR ile telefonundan açar, arar ve filtreler.",
          points: [
            { t: "Fiyat, stok ve açıklama tek panelde", d: "Ürünü ekler, gizler ya da tükendi işaretlersiniz." },
            { t: "CSV ve JSON ile aktarım", d: "Ürünleri tabloyla yükler, menüyü JSON olarak yedeklersiniz." },
            { t: "Müşteri telefonda arar ve filtreler", d: "Arama, filtre ve sıralama menünün içinde durur." }
          ]
        },
        problem: {
          title: "Menü basılı kaldığı sürece her değişiklik bir iştir.",
          text: "Fiyat değişir, bir ürün biter, yeni bir kampanya başlar. Basılı menü bunların hiçbirini takip etmez; güncel tutmak baskı ve zaman demektir.",
          scene: "Öğle servisi başlamadan tatlı bitmiş. Basılı menüde hâlâ yazıyor; müşteri isteyince garson tek tek anlatmak zorunda kalıyor."
        },
        solution: {
          title: "Menü panelden güncellenir, müşteri güncelini görür.",
          text: "Ürünü panelde tükendi işaretlersiniz: menüde yerinde kalır, üzerinde etiket görünür ve sepete eklenemez. İsterseniz belirlediğiniz saatte yeniden satışa açılır."
        },
        groups: [
          {
            title: "Menü içeriği", open: true,
            items: [
              { t: "Kategoriler ve ürünler", d: "Menü bölümlerini ve ürünleri panelden ekler, düzenler, gizler veya silersiniz. Gizlenen ürün menüden tamamen kalkar.", src: "trait-admin-pages.php (Ürünler, Kategoriler)" },
              { t: "Ürün bilgileri", d: "Açıklama, fiyat, kalori, gramaj, protein–karbonhidrat–yağ, hazırlanış süresi, acılık seviyesi ve et menşei girilir; alkol ve domuz türevi içerdiğini işaretleyebilirsiniz. Bu bilgiler ürün detayında gösterilir.", src: "trait-ajax.php (detay modalı), trait-import-export.php (sütunlar)" },
              { t: "Alerjenler ve malzemeler", d: "14 hazır alerjen tanımı ürünlere atanır; malzemeleri ayrıca tanımlarsınız. Gösterilen alerjen bilgisi sizin girdiğiniz veriye dayanır.", src: "trait-helpers.php get_allergen_definitions()" },
              { t: "Porsiyon ve ekstralar", d: "Ürüne tek bir taban fiyat verilir; “Büyük +40 ₺” gibi porsiyon farkları ve “sos +10 ₺” gibi ekstralar bu fiyatın üzerine eklenir. Ekstra listeleri birden çok üründe yeniden kullanılır.", src: "class-porsiyon.php, class-ekstra.php" },
              { t: "Rozetler", d: "Popüler, Yeni, Önerilen ve İndirimli rozetleri hazır gelir; “Hızlı Servis” gibi kendi rozetlerinizi de tanımlarsınız.", src: "class-filtre.php ozellik_kartlari(), class-ozel-rozet.php" },
              { t: "Kombin ürün", d: "İki ürünü seçip tek bir kombin fiyatıyla sunarsınız.", src: "admin-kombin-meta.php" }
            ]
          },
          {
            title: "Stok ve servis saatleri",
            items: [
              { t: "Tükendi", d: "Tükendi işaretlenen ürün menüde görünmeye devam eder; üzerine etiket basılır ve sipariş/tıklama akışı kapanır.", src: "class-tukendi.php" },
              { t: "Belirlediğiniz saatte yeniden satışa açma", d: "Tükenen ürünü belirlediğiniz saate kadar tükendi bırakırsınız; süre dolunca yeniden satışa açılır. Zamanlama WordPress’in zamanlanmış görev sistemine dayanır.", src: "urunum-yok/class-cron.php, trait-admin-pages.php (Tükenen Ürünler)" },
              { t: "Malzeme bazlı tükendi", d: "Bir malzeme bittiğinde, onu kullanan ürünleri aynı anda belirlediğiniz saate kadar tükendi işaretlersiniz.", src: "urunum-yok/class-stock.php" },
              { t: "Kategori servis saatleri", d: "“Kahvaltı 07:00–11:00, hafta içi” gibi bir kural kategoriye bir kez yazılır; tek ürün için ezilebilir. Servis dışındaki ürün menüden kalkmaz; saat etiketi görünür ve sepete eklenemez.", src: "class-servis-saati.php" }
            ]
          },
          {
            title: "Fiyat ve kampanyalar",
            items: [
              { t: "Toplu fiyat kampanyası", d: "Kapsamdaki ürünlere toplu indirim veya zam uygularsınız. İndirim orijinal fiyatı değiştirmez; kaldırdığınızda fiyatlar eskisine döner. Zam ise fiyatı kalıcı olarak günceller.", src: "class-kampanya.php, class-kampanya-db.php" },
              { t: "Kampanya görselleri", d: "Sayfanın en üstünde kendi kendine dönen kampanya görselleri gösterirsiniz; geçiş süresi ayarlanır.", src: "shortcode-banner-slider.php, module.php" },
              { t: "Öne çıkanlar", d: "Menünün üstünde kayan bir şeritte öne çıkarmak istediğiniz ürünleri gösterirsiniz.", src: "shortcode-slider.php, module.php" }
            ]
          },
          {
            title: "Sepet ve sipariş",
            items: [
              { t: "Sepet ile sipariş", d: "Menüde sepet ile sipariş, Diğer Ayarlar’dan etkinleştirilir; müşteri ürünleri sepete ekleyip siparişi gönderir. Bu, Pro paketindeki QR sipariş özelliğidir ve siparişler Servis Paneli’ne düşer.", src: "trait-admin-pages.php (Sepet ile Sipariş), qr-chatbot/module.php ([qmo_sepet])" }
            ]
          },
          {
            title: "Arama, filtre ve sıralama",
            items: [
              { t: "Arama ve filtre paneli", d: "Müşteri menüde ürün arar; alerjen, kalori, fiyat ve ürün özelliği filtrelerini uygular. Ayrıntılar Akıllı Filtreleme sayfasında.", src: "trait-frontend.php, class-filtre.php" },
              { t: "Sıralama", d: "Önerilen sıra, A–Z, fiyat, protein, karbonhidrat ve acılık ölçütleriyle sıralanır.", src: "class-filtre.php siralama_secenekleri()" }
            ]
          },
          {
            title: "Aktarma, yedekleme ve görünüm",
            items: [
              { t: "CSV ile toplu ürün aktarımı", d: "Örnek dosyayı indirir, ürünlerinizi tabloda hazırlar ve yüklersiniz. Fiyatı geçersiz satırlar aktarımdan sonra bildirilir.", src: "trait-import-export.php" },
              { t: "JSON ile yedekleme", d: "Tüm menü ürünlerini JSON olarak dışa aktarır, geri yüklerken ürün kimliğiyle eşleşen kayıtların üzerine yazarsınız.", src: "trait-import-export.php (MENÜ YEDEKLEME)" },
              { t: "Görünüm", d: "Beş hazır renk paleti (Premium Altın, Klasik Turuncu, Koyu Tema, Modern Mavi, Doğal Yeşil), yazı tipi ve renk ayarları vardır. Menü sayfaya kısa kod veya Elementor bileşeniyle eklenir.", src: "trait-admin-pages.php get_color_palettes(), class-elementor-widget.php" }
            ]
          }
        ],
        notes: [
          "Ürün, fiyat, alerjen ve besin bilgilerini siz girersiniz; sistem bu bilgileri kendiliğinden üretmez.",
          "Kampanyalar panelden başlatılır ve geri alınır; saat veya güne göre otomatik başlayıp biten kampanya bu sürümde çalışmaz."
        ],
        steps: [
          { t: "Kategorileri ve ürünleri girin", d: "Panelden tek tek ekleyin ya da CSV dosyasıyla toplu aktarın." },
          { t: "Bilgileri tamamlayın", d: "Fiyat, alerjen, porsiyon, ekstra ve rozetleri ürüne işleyin." },
          { t: "Görünümü seçin", d: "Renk paletini ve yazı tipini belirleyin; menüyü sayfanıza ekleyin." },
          { t: "Güncel tutun", d: "Fiyat veya stok değiştiğinde panelde güncelleyin; müşteri menüyü güncel haliyle açar." }
        ],
        view: {
          intro: "Müşteri telefonunda menü, işletme tarafında ürün düzenleme ekranı.",
          mock: { type: "phone", title: "Menü", search: "Ürün ara…", actions: ["Filtrele", "Sırala"], tabs: ["Çorbalar", "Ana Yemek", "Tatlı"],
            items: [
              { n: "Mercimek Çorbası", m: "180 kcal · 10 dk", p: "95 ₺", tag: "Popüler" },
              { n: "Örnek Ürün", m: "Menüde görünür, sepete eklenemez", p: "—", tag: "Tükendi", off: true },
              { n: "Örnek Kombin", m: "İki ürün, tek fiyat", p: "—", tag: "Kombin" }
            ] },
          mock2: { type: "panel", title: "Ürün düzenle", rows: [
              { l: "Başlık", v: "Mercimek Çorbası" }, { l: "Fiyat", v: "95" }, { l: "Kategori", v: "Çorbalar" },
              { l: "Kalori (kcal)", v: "180" }, { l: "Hazırlanış süresi (dk)", v: "10" }, { l: "Alerjenler", v: "Seçilebilir liste" }
            ], toggles: [{ l: "Vegan", on: true }, { l: "Vejetaryen", on: true }, { l: "Popüler", on: true }, { l: "Tükendi", on: false }] }
        },
        audience: [
          { who: "Restoranlar", text: "Fiyatı, ürünü ve stoğu sık değişen menüler." },
          { who: "Kafeler", text: "Kahvaltı gibi saate bağlı bölümleri olan menüler." },
          { who: "Oteller", text: "Restoran ve bar menülerini birden çok dilde sunan işletmeler." },
          { who: "İşletme yöneticileri", text: "Menüyü ekibin farklı üyeleri adına tek panelden yönetmek isteyenler." }
        ],
        related: [
          { slug: "qr-masa", why: "Her masanın QR kodu bu menüye açılır." },
          { slug: "akilli-filtreleme", why: "Menüdeki arama ve filtre paneli." },
          { slug: "coklu-dil", why: "Menüyü müşterinin diline çevirin." }
        ]
      },

      /* ===================================================
         2. QR MASA
      =================================================== */
      {
        slug: "qr-masa",
        name: "QR Masa",
        tagline: "Her masaya kendi QR kodu.",
        featureIds: ["qr-masa"],
        seo: {
          title: "QR Masa — Masa Bazlı QR Kod Oluşturma",
          description: "Masalarınızı tanımlayın, her biri için yazdırılabilir QR kod üretin. Müşteri hangi masadan okuttuğu bilgisiyle menüye girer."
        },
        hero: {
          h1: "Her masaya kendi QR kodu.",
          lead: "Masaları panelde tanımlayın; her biri için yazdırılabilir bir QR kod üretilsin. Müşteri, hangi masadan okuttuğu bilgisiyle menüye girer.",
          points: [
            { t: "Masa başına ayrı adres", d: "Her masa /?masa=… biçiminde kendi adresine sahiptir." },
            { t: "Toplu oluşturma", d: "Ön ek ve aralıkla tek seferde en fazla 200 masa." },
            { t: "PNG ve PDF çıktı", d: "Tek tek ya da tüm masalar için tek PDF olarak indirilir." }
          ]
        },
        problem: {
          title: "Tek bir genel QR kodu, hangi masadan geldiğini bilmez.",
          text: "Aynı kodu her masaya koyduğunuzda menü açılır ama işletme masa bilgisini kaybeder. Garson çağrısı, hesap isteği ve sipariş için masanın bilinmesi gerekir.",
          scene: "Bir çağrı geldi ama hangi masadan olduğu belli değil. Ekip salonu dolaşıp masa masa soruyor."
        },
        solution: {
          title: "Her masanın kendi adresi vardır.",
          text: "Masa adı yazıldığında bir adres üretilir (örneğin “Masa 31” için /?masa=masa-31). QR kod bu adrese gider; menü masa bilgisiyle açılır."
        },
        groups: [
          {
            title: "Masa tanımı", open: true,
            items: [
              { t: "Tek masa oluşturma", d: "Masa adını yazarsınız; adres otomatik üretilir (“Masa 31” → masa-31, “VIP Salon” → vip-salon).", src: "masalar-sayfasi.php" },
              { t: "Toplu oluşturma", d: "Bir ön ek ve numara aralığı girersiniz (örneğin ic-masa, 1–10); ic-masa-1 … ic-masa-10 tek seferde açılır. Var olan masalar atlanır; tek seferde en fazla 200 masa açılır.", src: "class-qmo-masalar.php TOPLU_AZAMI" },
              { t: "Gruba göre listeleme", d: "Ortak ön eke sahip masalar (ic-masa, bahce gibi) grup olarak listelenir; listeyi gruba göre süzebilirsiniz.", src: "class-qmo-masalar.php grup_adi()" },
              { t: "Düzenleme ve silme", d: "Masa adı düzenlenir, masa silinir. Silinen masadaki açık oturumlar da kapanır.", src: "masalar-sayfasi.php" }
            ]
          },
          {
            title: "QR kod çıktısı",
            items: [
              { t: "PNG ve PDF indirme", d: "Her masa için QR kodu PNG veya PDF olarak indirirsiniz. QR üretimi tarayıcıda yapılır.", src: "masalar-sayfasi.php, module.php" },
              { t: "Tümünü yazdır", d: "Listedeki her masa için masa adı ve QR kod içeren, masa başına bir sayfalık tek bir PDF indirilir.", src: "masalar-sayfasi.php" }
            ]
          },
          {
            title: "Masa bilgisinin kullanımı",
            items: [
              { t: "Aktif masa bilgisi", d: "Kısa kod, müşteriye hangi masada olduğunu gösterir (“Masa 7”). Masa bilgisi doğrulanmış oturumdan okunur, adresten değil.", src: "module.php [qr_aktif_masa]" },
              { t: "Masaya bağlı özellikler", d: "Garson çağırma, hesap isteme ve sipariş (Pro) ile masa bazlı raporlar (Plus) bu masa bilgisiyle çalışır.", src: "qr-chatbot/module.php, qr-analiz/masalar-sayfasi.php" }
            ]
          }
        ],
        notes: [
          "QR kod menü sayfanıza yönlenir; kodun çalışması için menü sayfanızın yayında olması gerekir.",
          "Masanın QR’ı okutan kişiye bağlanması ve oturum süreleri ayrı bir modülün (Masa Oturum Güvenliği, Pro) konusudur."
        ],
        steps: [
          { t: "Masaları tanımlayın", d: "Tek tek ya da ön ek ve aralıkla toplu olarak oluşturun." },
          { t: "QR kodları indirin", d: "PNG, PDF ya da tüm masalar için tek PDF olarak alın." },
          { t: "Masalara yerleştirin", d: "Çıktıları ilgili masaya koyun." },
          { t: "Müşteri okutur", d: "Menü, masa bilgisiyle açılır." }
        ],
        view: {
          flip: true,
          intro: "Masa listesi ve toplu oluşturma formu.",
          mock: { type: "table", title: "QR Kodlar", cols: ["Masa adı", "Adres", "İndir"],
            rows: [["Masa 1", "/?masa=masa-1", "PNG · PDF"], ["ic-masa-2", "/?masa=ic-masa-2", "PNG · PDF"], ["VIP Salon", "/?masa=vip-salon", "PNG · PDF"]], qr: true },
          mock2: { type: "panel", title: "Toplu oluştur", rows: [
              { l: "Slug öneki", v: "ic-masa" }, { l: "Başlangıç", v: "1" }, { l: "Bitiş", v: "10" }
            ], result: "ic-masa-1 … ic-masa-10 oluşturulur" }
        },
        audience: [
          { who: "Restoranlar", text: "Salon ve bahçe gibi bölümleri numaralı masalara ayrılmış işletmeler." },
          { who: "Kafeler", text: "Masa bazlı servis yapan, masa numarası olan kafeler." },
          { who: "Oteller", text: "Havuz başı, restoran ve teras gibi alanlarda ayrı masa grupları olanlar." },
          { who: "İşletme yöneticileri", text: "Masa listesini ve QR çıktılarını tek yerden yönetmek isteyenler." }
        ],
        related: [
          { slug: "restoran-menu", why: "QR kodun açtığı menü." },
          { slug: "masa-oturum-guvenligi", why: "Masa oturumunu imzalar ve süre ile sınırlar." },
          { slug: "servis-paneli", why: "Masa bilgisiyle gelen çağrılar burada görünür." }
        ]
      },

      /* ===================================================
         3. AKILLI ÇEVİRİ
      =================================================== */
      {
        slug: "coklu-dil",
        name: "Çoklu Dil",
        tagline: "Menü müşterinin dilinde açılır.",
        featureIds: ["coklu-dil"],
        seo: {
          title: "Çoklu Dil — Çok Dilli Dijital Menü",
          description: "30 dil arasından menünüzde göstereceğiniz dilleri seçin; çevirileri CSV ile toplu girin. Müşteri dil seçiciyle menüyü kendi dilinde açar."
        },
        hero: {
          h1: "Menünüz müşterinin kendi dilinde açılsın.",
          lead: "30 dil arasından menünüzde göstereceğiniz dilleri seçin. Çevirileri CSV dosyasıyla toplu girersiniz; müşteri dil seçiciyle kendi diline geçer.",
          points: [
            { t: "30 dil seçeneği", d: "Menüde göstereceğiniz dilleri siz seçersiniz." },
            { t: "CSV tabanlı çeviri", d: "Çeviriler tabloya yazılır; otomatik makine çevirisi yoktur." },
            { t: "Ürün, kategori ve alerjen", d: "Bu içerikler ve sabit metinler aynı dosyada toplanır." }
          ]
        },
        problem: {
          title: "Yabancı misafire menüyü anlatmak zaman alır.",
          text: "Menü tek dilde olduğunda ürün içeriğini, alerjeni ve fiyatı anlatmak garsona kalır. Her dil için ayrı baskı menü hazırlamak ise güncelleme yükünü katlar.",
          scene: "Masada iki misafir menüye bakıp çeviri uygulaması açıyor; garson ürünleri tek tek anlatıyor."
        },
        solution: {
          title: "Çeviriler tek tabloda toplanır, menüye siz girersiniz.",
          text: "Ürün, kategori, alerjen ve sabit metinler bir CSV dosyasında toplanır. Dil sütunlarını doldurup yüklediğinizde menü seçilen dillerde açılır."
        },
        groups: [
          {
            title: "Diller", open: true,
            items: [
              { t: "30 dil", d: "Türkçe, English, Deutsch, Français, Español, Italiano, Русский, العربية, 中文, 日本語, 한국어 dahil 30 dil arasından menüde göstereceklerinizi seçersiniz. Türkçe orijinal dildir.", src: "ceviri.php qrmenu_get_langs()" },
              { t: "Dil seçici", d: "Yalnızca bayrak ya da bayrak ve dil adı gösteren iki seçici vardır; buton renkleri ayarlanır.", src: "module.php (qrmenu_flags_only / qrmenu_flags_text), diller-sayfasi.php" },
              { t: "Sağdan sola diller", d: "Arapça, İbranice ve Farsça sağdan sola yazılır.", src: "dil.php rma_ceviri_rtl_diller()" },
              { t: "Fiyat biçimi", d: "Sayı ayracı dile göre değişir (1.234,56 veya 1,234.56). Tek para birimi kullanılır; kur çevrimi yoktur.", src: "fiyat.php" }
            ]
          },
          {
            title: "Neler çevrilir?",
            items: [
              { t: "Menü içeriği", d: "Menü ürünleri, kategoriler ve alerjenler; ayrıca seçtiğiniz sayfalar başlıklarıyla birlikte çevrilir.", src: "kapsam-sayfasi.php" },
              { t: "Sabit arayüz metinleri", d: "“Filtrele”, “Sırala”, “Ürün ara…” gibi menünün sabit metinleri hazır bir listeyle gelir; ek metinleri elle listeye yazabilirsiniz.", src: "ui-stringler.php" },
              { t: "Metin toplama", d: "Sitede henüz çevrilmemiş sabit metinleri bulur ve listeye ekler; sonraki dışa aktarımda CSV’ye çıkar.", src: "metin-toplama-sayfasi.php" },
              { t: "Tema ve eklenti metinleri", d: "İsterseniz tema ve diğer eklentilerin bastığı sabit metinler (alt bilgi, formlar gibi) de çevrilir.", src: "diller-sayfasi.php" }
            ]
          },
          {
            title: "CSV ile çalışma",
            items: [
              { t: "CSV dışa aktar", d: "Çeviri dosyasını indirir, yalnızca dil sütunlarını doldurursunuz. Virgül veya noktalı virgül ayracıyla indirilir (Google E-Tablolar için virgül).", src: "csv-disa-sayfasi.php" },
              { t: "CSV içe aktar", d: "Doldurduğunuz dosyayı yüklersiniz; ayraç otomatik algılanır.", src: "csv-ice-sayfasi.php" },
              { t: "Sistem durumu", d: "Her dil için kaç çeviri yazıldığı, hangilerinin eskidiği veya yetim kaldığı görünür.", src: "hub-sayfasi.php" }
            ]
          },
          {
            title: "Arama motorları",
            items: [
              { t: "Dil adreste görünür", d: "Seçilen dil adreste yer alır (?lang=en) ve alternatif dil etiketleri (hreflang) yayınlanır; çevrilmiş sayfaların arama motorlarınca ayrı adres olarak görülmesi için.", src: "dil.php rma_ceviri_hreflang_etiketleri()" }
            ]
          }
        ],
        notes: [
          "Bu modül otomatik makine çevirisi yapmaz. Çevirileri siz veya çevirmeniniz CSV’ye yazarsınız; çeviri kalitesi girdiğiniz metne bağlıdır.",
          "Çevirisi girilmeyen alan Türkçe (orijinal) haliyle görünür."
        ],
        steps: [
          { t: "Dilleri seçin", d: "Menüde göstereceğiniz dilleri işaretleyin." },
          { t: "Kapsamı belirleyin", d: "Hangi ürün, kategori ve sayfaların çevrileceğini seçin; CSV’yi indirin." },
          { t: "Dil sütunlarını doldurun", d: "Çevirileri siz ya da çevirmeniniz yazın." },
          { t: "Yükleyin", d: "CSV’yi içe aktarın; müşteri dil seçiciyle diline geçer." }
        ],
        view: {
          intro: "Dil seçimi ve CSV çeviri tablosu.",
          mock: { type: "chips", title: "Menüde gösterilecek diller", chips: ["🇹🇷 Türkçe", "🇬🇧 English", "🇩🇪 Deutsch", "🇫🇷 Français", "🇪🇸 Español", "🇷🇺 Русский", "🇸🇦 العربية"], note: "Türkçe orijinal dildir; her zaman listede kalır." },
          mock2: { type: "table", title: "Çeviri CSV’si", cols: ["Alan", "Türkçe", "English"],
            rows: [["Ürün adı", "Mercimek Çorbası", "Doldurun"], ["Kategori", "Çorbalar", "Doldurun"], ["Sabit metin", "Filtrele", "Doldurun"]] }
        },
        audience: [
          { who: "Restoranlar", text: "Farklı dilden misafir ağırlayan menüler." },
          { who: "Kafeler", text: "Turistik bölgede yabancı müşteriye hizmet verenler." },
          { who: "Oteller", text: "Misafirlerine restoran ve bar menüsünü kendi dilinde sunmak isteyenler." },
          { who: "İşletme yöneticileri", text: "Çevirileri tek dosyada toplayıp çevirmene teslim etmek isteyenler." }
        ],
        related: [
          { slug: "restoran-menu", why: "Çevrilen menü içeriği burada tutulur." },
          { slug: "akilli-filtreleme", why: "Filtre panelinin metinleri de çevrilir." },
          { slug: "menu-asistani", why: "Asistanın sabit mesajları da çeviri altyapısından geçer." }
        ]
      },

      /* ===================================================
         4. AKILLI FİLTRELEME
      =================================================== */
      {
        slug: "akilli-filtreleme",
        name: "Akıllı Filtreleme",
        tagline: "Müşteri menüyü kendi ihtiyacına göre süzer.",
        featureIds: ["filtreler"],
        seo: {
          title: "Akıllı Filtreleme — Alerjen ve Kalori Filtresi",
          description: "Müşteri menüde ürün arar; alerjen hariç tutar, kalori ve fiyat aralığı seçer, ürün özelliğine göre süzer ve sıralar."
        },
        hero: {
          h1: "Müşteri menüyü kendi ihtiyacına göre süzsün.",
          lead: "Alerjen, kalori, fiyat ve ürün özelliği filtreleri ile arama ve sıralama tek panelde: müşteri menüyü kendisi daraltır.",
          points: [
            { t: "14 alerjeni hariç tutma", d: "Seçilen alerjeni içeren ürünler sonuçtan çıkar." },
            { t: "Kalori ve fiyat aralığı", d: "En az ve en çok değer girilir." },
            { t: "Arama ve sıralama", d: "Ürün arama; fiyat, protein, karbonhidrat ve acılığa göre sıralama." }
          ]
        },
        problem: {
          title: "Uzun menüde aradığını bulmak zordur.",
          text: "Alerjisi olan, kalorisine dikkat eden ya da bütçesi belli olan müşteri menüyü satır satır tarar veya garsona sorar. Bu, hem müşteriyi hem ekibi yavaşlatır.",
          scene: "Süt alerjisi olan bir misafir, hangi ürünlerde süt olmadığını öğrenmek için menüyü baştan sona okuyor."
        },
        solution: {
          title: "Filtre paneli menüyü müşteri adına daraltır.",
          text: "Müşteri hariç tutacağı alerjenleri, kalori ve fiyat aralığını ya da ürün özelliğini seçer; menü yalnızca uygun ürünleri gösterir."
        },
        groups: [
          {
            title: "Filtreler", open: true,
            items: [
              { t: "Alerjenleri hariç tut", d: "14 alerjen için ayrı kart bulunur; seçilen alerjeni içeren ürünler sonuçtan çıkar.", src: "class-filtre.php alerjen_kartlari(), haric_alerjenler()" },
              { t: "Kalori aralığı", d: "En az ve en çok kcal girilir. Kalorisi girilmemiş ürün, kalori filtresi kullanıldığında sonuçta yer almaz.", src: "class-filtre.php aralikta()" },
              { t: "Fiyat aralığı", d: "En az ve en çok fiyat girilir; kampanyalı ürünlerde geçerli fiyata bakılır.", src: "class-filtre.php (PHP katmanı notu)" },
              { t: "Ürün özellikleri", d: "Popüler, Yeni, Önerilen ve İndirimli özelliklerine göre süzülür.", src: "class-filtre.php ozellik_kartlari()" }
            ]
          },
          {
            title: "Arama ve sıralama",
            items: [
              { t: "Ürün arama", d: "Menünün üstündeki arama kutusuyla ürün aranır.", src: "trait-frontend.php (Ürün ara…)" },
              { t: "Sıralama", d: "Önerilen sıra, A→Z, ucuzdan pahalıya, pahalıdan ucuza, en proteinli, en az karbonhidratlı, en acı ve en az acı.", src: "class-filtre.php siralama_secenekleri()" },
              { t: "Uygula ve sıfırla", d: "Seçimler “Uygula” ile menüye işlenir; uygulanan filtreler menüde etiket olarak görünür ve “Sıfırla” ile temizlenir.", src: "trait-frontend.php (rma-panel-btn-apply / reset)" }
            ]
          },
          {
            title: "Ürün detayında görünen bilgiler",
            items: [
              { t: "Diyet etiketleri", d: "Vegan, Vejetaryen ve Glütensiz olarak işaretlediğiniz ürünlerde bu etiket ürün detayında görünür.", src: "trait-ajax.php (rma_attr)" },
              { t: "Besin ve hazırlık bilgisi", d: "Girildiyse kalori, gramaj, protein, karbonhidrat, yağ, hazırlanış süresi ve acılık seviyesi ürün detayında gösterilir.", src: "trait-ajax.php" }
            ]
          }
        ],
        notes: [
          "Filtreler sizin girdiğiniz ürün bilgisine dayanır: alerjen atanmamış veya kalorisi girilmemiş ürün için sonuç doğru çıkmaz. Sistem içerikten alerjen algılamaz.",
          "Vegan, vejetaryen ve glütensiz bilgisi ürün detayında etiket olarak görünür; bu sürümde ayrı bir filtre kartı değildir.",
          "Alerjen filtresi bir yardımcıdır; ciddi alerji durumunda müşteriyi ekibinize danışmaya yönlendirmenizi öneririz."
        ],
        steps: [
          { t: "Ürün bilgisini girin", d: "Alerjenleri, kaloriyi ve fiyatı ürünlere işleyin." },
          { t: "Müşteri paneli açar", d: "Menüdeki “Filtrele” ile filtre ve sıralama paneli açılır." },
          { t: "Filtreleri seçer", d: "Hariç tutulacak alerjenleri, aralıkları ve özellikleri işaretler." },
          { t: "Uygular", d: "Menü yalnızca uygun ürünleri gösterir." }
        ],
        view: {
          flip: true,
          intro: "Müşteri tarafındaki filtre paneli ve sonuç görünümü.",
          mock: { type: "filter", title: "Filtrele ve Sırala",
            sections: [
              { l: "Sırala", pills: ["Önerilen", "A → Z", "Ucuzdan Pahalıya"] },
              { l: "Alerjenleri Hariç Tut", pills: ["Glüten", "Süt / Laktoz", "Yumurta", "Fındık / Kuruyemiş"], sel: [1] },
              { l: "Kalori", range: ["En az (kcal)", "En çok (kcal)"] },
              { l: "Fiyat", range: ["En az", "En çok"] },
              { l: "Ürün Özellikleri", pills: ["Popüler", "Yeni", "Önerilen", "İndirimli"] }
            ], actions: ["Sıfırla", "Uygula"] },
          mock2: { type: "phone", title: "Menü", search: "Ürün ara…", actions: ["Filtrele"], active: ["Süt / Laktoz hariç"], tabs: [],
            items: [
              { n: "Örnek Ürün A", m: "Filtreye uygun", p: "—", tag: "Vegan" },
              { n: "Örnek Ürün B", m: "Filtreye uygun", p: "—", tag: "" }
            ] }
        },
        audience: [
          { who: "Restoranlar", text: "Geniş menüsü olan, alerjen sorusu sık gelen işletmeler." },
          { who: "Kafeler", text: "Kalori ve diyet bilgisini menüde göstermek isteyenler." },
          { who: "Oteller", text: "Farklı beslenme ihtiyaçlarıyla gelen misafirlere hizmet verenler." },
          { who: "İşletme yöneticileri", text: "Alerjen ve besin bilgisini tek yerden güncel tutmak isteyenler." }
        ],
        related: [
          { slug: "restoran-menu", why: "Filtrelerin dayandığı ürün bilgisi burada girilir." },
          { slug: "coklu-dil", why: "Filtre panelinin metinleri seçilen dile çevrilir." },
          { slug: "qr-analytics", why: "Filtre kullanımı raporda görünür." }
        ]
      },

      /* ===================================================
         5. MENÜ ASİSTANI
      =================================================== */
      {
        slug: "menu-asistani",
        name: "Menü Asistanı",
        tagline: "Menü hakkındaki soruları sohbetle yanıtlar.",
        featureIds: ["asistan"],
        seo: {
          title: "Menü Asistanı — Menü Sorularını Yanıtlayan Asistan",
          description: "Google Gemini tabanlı Menü Asistanı, menünüzdeki ürünlere dayanarak soruları yanıtlar; garson, hesap ve açık onaylı sipariş akışlarıyla birlikte çalışır."
        },
        hero: {
          h1: "Müşterinin menü sorularını asistan yanıtlasın.",
          lead: "Menünüzdeki ürünlere dayanarak soruları yanıtlayan, Google Gemini tabanlı bir sohbet asistanı. Görünümünü, karşılama mesajını ve davranış sınırlarını siz belirlersiniz.",
          points: [
            { t: "Menü verisine dayanır", d: "Yanıtlar menünüzdeki ürün ve bilgilere dayandırılır." },
            { t: "Bilmediğini söyler", d: "Cevaplanamayan sorular ayrı bir listede toplanır." },
            { t: "Ekibiniz devralabilir", d: "İnsan desteği gereken görüşmeleri canlı sohbetle yönetirsiniz." }
          ]
        },
        problem: {
          title: "Aynı sorular yoğun saatte ekibi meşgul eder.",
          text: "“İçinde ne var?”, “Acı mı?”, “Ne önerirsiniz?” gibi sorular her masada yeniden sorulur. Garsonun bu sorulara ayırdığı süre, servis hızından düşer.",
          scene: "Üç masa aynı anda soru soruyor; garson bir masada ürünü anlatırken diğer ikisi bekliyor."
        },
        solution: {
          title: "Sık sorulanlar sohbetle karşılanır; cevaplanamayanlar size gelir.",
          text: "Asistan menü ve restoran bilginize dayanarak yanıt verir. Karşılığı olmayan soruda bilmediğini söyler, soru listenize düşer; gerekirse ekibiniz görüşmeyi devralır."
        },
        groups: [
          {
            title: "Nasıl yanıt verir?", open: true,
            items: [
              { t: "Menü verisine dayanır", d: "Yanıtlar menünüzdeki ürün, fiyat ve açıklamalara ve restoran bilgilerine dayandırılır; menüde olmayan ürün veya fiyat uydurmaması talimat olarak verilir.", src: "ajax-chat.php (talimatlar)" },
              { t: "Bilmediğini söyler", d: "Menü veya restoran bilgisinde karşılığı olmayan soruda bilmediğini belirtir. Bu sorular “Cevaplanamayan Sorular” listesine düşer.", src: "ajax-chat.php qmo_chat_bilemedi_talimati(), sayfa-cevaplanamayan.php" },
              { t: "Ürün önerisi", d: "Menüdeki ürünleri önerir. Hangi ürünlerin önerileceğini Ürün Önerileri ekranından yönetirsiniz; Öneri Raporu önerilerin sepete ve siparişe yansımasını gösterir.", src: "sayfa-oneri.php, sayfa-oneri-rapor.php" },
              { t: "Tükenen ürün", d: "Tükendi işaretli bir ürün için sipariş oluşturmaz.", src: "ajax-chat.php (sipariş kuralı 6)" }
            ]
          },
          {
            title: "Servis akışlarıyla birlikte",
            items: [
              { t: "Garson ve hesap", d: "Sohbetten garson çağırma ve hesap isteme tetiklenebilir; talepler Servis Paneli’ne düşer.", src: "module.php (CALL_WAITER / CALL_BILL)" },
              { t: "Adım adım sipariş", d: "Sipariş; ürün, adet ve toplam özetiyle ve müşterinin açık onayıyla ilerler. Onay ifadesi yoksa sipariş bloğu yürürlüğe girmez.", src: "ajax-chat.php (sipariş akışı, satır 463–493)" }
            ]
          },
          {
            title: "İşletme kontrolü",
            items: [
              { t: "Asistan profili ve görünüm", d: "Asistanın adını, karşılama mesajını, simgesini ve renklerini belirlersiniz; müşterinin tek dokunuşla soracağı hazır soruları tanımlarsınız.", src: "admin-sayfa.php (Asistan Profili, Görünüm, Hazır Sorular)" },
              { t: "Görünürlük", d: "Asistanın hangi müşterilere, hangi cihazlarda ve hangi saatlerde gösterileceğini belirlersiniz.", src: "sayfa-gorunurluk.php" },
              { t: "Sohbet geçmişi ve canlı sohbet", d: "Geçmiş görüşmeleri incelersiniz; insan desteği gereken görüşmeleri devralıp müşteriyle doğrudan yazışırsınız.", src: "sayfa-gecmis.php, sayfa-canli-sohbet.php" },
              { t: "Sınırlar", d: "Oturum başına mesaj sayısını sınırlar (varsayılan 25) ve yanıtlanmayacak kelimeleri tanımlarsınız; bu kelimeleri içeren mesaja sabit bir yanıt verilir.", src: "oturum-ayarlari.php, ajax-chat.php qmo_chatbot_yasakli_mi()" }
            ]
          },
          {
            title: "Yapay zekâ motoru",
            items: [
              { t: "Google Gemini", d: "Asistan Google Gemini kullanır. Bağlantı, yönetim ekranında girdiğiniz bir API anahtarıyla kurulur (Google AI Studio’dan alınır); kullanılacak model adı ayarlanabilir, boşsa gemini-3-flash-preview kullanılır.", src: "admin-sayfa.php qmo_chatbot_sayfa_gemini(), helpers.php qmo_gemini_model()" }
            ]
          }
        ],
        notes: [
          "Yapay zekâ yanıtları hatalı veya eksik olabilir. Asistan yalnızca menünüze ve girdiğiniz bilgiye dayanır; eksik bilgi eksik yanıt üretir.",
          "Alerjen ve sağlık konularında verdiği yanıt tıbbi tavsiye değildir; menüde girdiğiniz veriyi yansıtır.",
          "Asistanın çalışması için yönetim ekranında bir Gemini API anahtarı tanımlı olmalıdır; anahtar yoksa asistan yanıt veremez.",
          "Garson, hesap ve sipariş akışları Pro paketindeki servis özellikleriyle birlikte çalışır."
        ],
        steps: [
          { t: "Anahtarınızı bağlayın", d: "Yönetim ekranındaki AI Motoru bölümüne Gemini API anahtarını girin." },
          { t: "Asistanı hazırlayın", d: "Adını, görünümünü ve hazır soruları belirleyin." },
          { t: "Müşteri sorar", d: "Menüde sohbeti açar; sorusunu yazar ya da hazır soruya dokunur." },
          { t: "Eksikleri tamamlayın", d: "Cevaplanamayan sorulara bakın; menü bilgisini tamamlayın veya görüşmeyi devralın." }
        ],
        view: {
          intro: "Müşteri tarafında sohbet, işletme tarafında yönetim.",
          mock: { type: "chat", title: "Menü Asistanı", messages: [
              { from: "user", text: "Acı olmayan bir ana yemek önerir misiniz?" },
              { from: "bot", text: "Menüde acılık seviyesi “Acısız” girilmiş ürünler var. İsterseniz bunlardan birini önereyim." },
              { from: "user", text: "Bu ürünün içinde süt var mı?" },
              { from: "bot", text: "Bu bilgi menüde girilmemiş. Garsonumuza danışabilirsiniz." }
            ], hint: "Kurgusal örnek sohbet" },
          mock2: { type: "panel", title: "AI Motoru", status: "Google Gemini — Bağlı", rows: [
              { l: "Bağlantı anahtarı", v: "••••••••" }, { l: "Kullanılacak model", v: "gemini-3-flash-preview" }
            ], list: { l: "Cevaplanamayan Sorular", items: ["Örnek soru 1", "Örnek soru 2"] } }
        },
        audience: [
          { who: "Restoranlar", text: "Yoğun saatte menü sorularının servisi yavaşlattığı işletmeler." },
          { who: "Kafeler", text: "Ürün içeriği ve öneri sorusu sık gelen kafeler." },
          { who: "Oteller", text: "Misafirlerine menüyü kendi başlarına keşfettirmek isteyenler." },
          { who: "İşletme yöneticileri", text: "Müşterilerin en çok neyi sorduğunu görmek isteyenler." }
        ],
        related: [
          { slug: "servis-paneli", why: "Sohbetten gelen garson ve hesap talepleri burada toplanır." },
          { slug: "restoran-menu", why: "Asistanın dayandığı menü bilgisi burada girilir." },
          { slug: "qr-analytics", why: "Sohbet mesajları etkileşim raporunda sayılır." }
        ]
      },

      /* ===================================================
         6. SERVİS PANELİ
      =================================================== */
      {
        slug: "servis-paneli",
        name: "Servis Paneli",
        tagline: "Masalardan gelen istekler tek ekranda.",
        featureIds: ["servis-paneli", "garson-cagir", "hesap-iste", "qr-siparis", "personel-rolu"],
        seo: {
          title: "Servis Paneli — Garson, Hesap ve Sipariş Takibi",
          description: "Garson çağrısı, hesap isteği ve siparişler tek panelde toplanır. Ekibiniz kayıtları Bekliyor’dan Tamamlandı’ya taşır; sesli uyarı ve bildirim desteklenir."
        },
        hero: {
          h1: "Masalardan gelen istekler tek ekranda.",
          lead: "Garson çağrısı, hesap isteği ve siparişler bir panelde toplanır; ekibiniz her kaydı Bekliyor’dan Tamamlandı’ya taşır.",
          points: [
            { t: "Tek panelde üç kayıt tipi", d: "Sipariş, garson ve hesap kayıtları birlikte görünür." },
            { t: "Durum akışı", d: "Kartlar Bekliyor’dan Tamamlandı’ya taşınır." },
            { t: "Sesli uyarı ve bekleme renkleri", d: "Bekleyen kartlar sarıya ve kırmızıya döner." }
          ]
        },
        problem: {
          title: "Çağrı gözden kaçtığında müşteri bekler.",
          text: "Garsonu elle çağırmak, sesle dikkat çekmek ya da mutfağa not iletmek yoğun serviste kolay kaçar; kimin neyle ilgilendiği de belli olmaz.",
          scene: "Bir masa hesap istiyor, iki masa su bekliyor. Kimin hangisine gittiği garsonlar arasında belli değil."
        },
        solution: {
          title: "Her istek bir kart olur, her kartın bir durumu vardır.",
          text: "Müşteri masasından butona basar; kayıt panelde masa adıyla görünür. Ekibiniz kartı Hazırlanıyor ve Serviste gibi durumlara taşır."
        },
        groups: [
          {
            title: "Panel", open: true,
            items: [
              { t: "Üç kayıt tipi", d: "Sipariş, Garson ve Hesap kayıtları aynı panelde toplanır; tipe ve masa adına göre süzülür.", src: "class-qrms-sp-veri.php tipler()" },
              { t: "Durum sütunları", d: "Bekliyor, Hazırlanıyor, Serviste, Tamamlandı ve İptal sütunları vardır; kartlardaki düğmelerle durum değiştirilir. Dar ekranda sütunlar sekmeye dönüşür.", src: "class-qrms-sp-veri.php durumlar(), panel-sayfasi.php" },
              { t: "Bekleme uyarısı", d: "Tamamlanmamış bir kart, belirlediğiniz süreleri aştıkça sarıya ve kırmızıya döner (varsayılan 3 ve 7 dakika).", src: "class-qrms-sp-veri.php (esik_sari 180, esik_kirmizi 420), panel.js aciliyet()" }
            ]
          },
          {
            title: "Uyarılar",
            items: [
              { t: "Sesli uyarı", d: "Yeni kayıt geldiğinde sesli uyarı verilebilir; panelden açılıp kapatılır.", src: "ayarlar-sayfasi.php, panel.js" },
              { t: "Bildirim", d: "Panelin “Bildirim” düğmesiyle tarayıcı bildirimi istenir; bunun için tarayıcı izni gerekir.", src: "panel-sayfasi.php" },
              { t: "Yenileme aralığı", d: "Panel kayıtları belirli aralıklarla yeniler (varsayılan 5 saniye; 3–60 arasında ayarlanır).", src: "class-qrms-sp-veri.php (yenileme)" }
            ]
          },
          {
            title: "Müşteri tarafı",
            items: [
              { t: "Garson çağır ve hesap iste", d: "Müşteri tek dokunuşla garson çağırır ya da hesap ister; iki düğme birlikte veya ayrı basılabilir.", src: "qr-chatbot/module.php ([garson_butonu], [hesap_iste_butonu], [ikili_buton])" },
              { t: "QR üzerinden sipariş", d: "Müşteri menüden sepete ürün ekleyip siparişi gönderir; sipariş panele kart olarak düşer.", src: "qr-chatbot/module.php ([qmo_sepet], rest-order.php)" }
            ]
          },
          {
            title: "Personel erişimi",
            items: [
              { t: "Servis rolü", d: "Garson ve mutfak personeli için dar bir rol vardır; bu rolle giren kullanıcı panelden başka ekran görmez, menüyü ve ayarları göremez.", src: "class-qrms-sp-rol.php" },
              { t: "Tamamlananlar", d: "Tamamlanan kayıtların panelde ne kadar süre görüneceğini (varsayılan 2 saat) ayarlarsınız.", src: "class-qrms-sp-veri.php (tamam_penceresi)" }
            ]
          }
        ],
        notes: [
          "Panel talebi personele gösterir; talebin ne kadar sürede karşılanacağı işletmenin operasyonuna bağlıdır.",
          "Ödeme altyapısı yoktur. “Hesap iste”, hesabın masaya getirilmesi talebidir.",
          "Sesli uyarı ve bildirim için panelin tarayıcıda açık olması ve bildirim izni verilmesi gerekir."
        ],
        steps: [
          { t: "Müşteri istekte bulunur", d: "Masasından garson çağırır, hesap ister ya da sipariş verir." },
          { t: "Kart panele düşer", d: "Kayıt, masa adı ve tipiyle Bekliyor sütununda görünür." },
          { t: "Ekip ilgilenir", d: "Kart Hazırlanıyor ve Serviste durumlarına taşınır." },
          { t: "Tamamlanır", d: "Kayıt Tamamlandı’ya geçer; iptal edilen kayıtlar İptal’e alınır." }
        ],
        view: {
          flip: true,
          intro: "Takip ekranı ve panel ayarları.",
          mock: { type: "kanban", title: "Servis Paneli", columns: [
              { n: "Bekliyor", cards: [{ k: "Garson", t: "Masa 4", s: "warn" }, { k: "Hesap", t: "Masa 9", s: "" }] },
              { n: "Hazırlanıyor", cards: [{ k: "Sipariş", t: "Masa 2", s: "" }] },
              { n: "Serviste", cards: [{ k: "Sipariş", t: "Masa 7", s: "" }] }
            ] },
          mock2: { type: "panel", title: "Servis Paneli Ayarları", rows: [
              { l: "Sarı uyarı (saniye)", v: "180" }, { l: "Kırmızı uyarı (saniye)", v: "420" },
              { l: "Yenileme aralığı (saniye)", v: "5" }, { l: "Tamamlananları göster (saat)", v: "2" }
            ], toggles: [{ l: "Yeni kayıt geldiğinde sesli uyar", on: true }] }
        },
        audience: [
          { who: "Restoranlar", text: "Masa servisi yapan, garson ve mutfak arasında hız arayan işletmeler." },
          { who: "Kafeler", text: "Yoğun saatte çağrıları gözden kaçırmak istemeyenler." },
          { who: "Oteller", text: "Restoran ve bar servisini birden çok ekiple yürütenler." },
          { who: "İşletme yöneticileri", text: "Hangi talebin hangi durumda olduğunu tek ekranda görmek isteyenler." }
        ],
        related: [
          { slug: "qr-masa", why: "Çağrıların masa bilgisi buradan gelir." },
          { slug: "masa-oturum-guvenligi", why: "Çağrı ve sipariş, doğrulanmış masa oturumuyla korunur." },
          { slug: "menu-asistani", why: "Sohbetten de garson ve hesap talebi doğabilir." }
        ]
      },

      /* ===================================================
         7. QR ANALYTICS
      =================================================== */
      {
        slug: "qr-analytics",
        name: "QR Analytics",
        tagline: "Menünüzde ne olduğunu raporlarda görün.",
        featureIds: ["analytics"],
        seo: {
          title: "QR Analytics — Menü, Ürün ve Masa Raporları",
          description: "Menü görüntüleme, tekil ziyaretçi, ürün tıklaması, masa hareketi ve sepet verilerini Bugün, Son 7 gün, Bu ay ya da özel aralıkla raporlayın."
        },
        hero: {
          h1: "Menünüzde ne olduğunu görün.",
          lead: "Menü okutma, tekil ziyaretçi, ürün tıklaması, masa ve sepet hareketleri tek raporda; Bugün, Son 7 gün, Bu ay ya da özel aralıkla.",
          points: [
            { t: "Menü görüntüleme ve ürün tıklama", d: "Günlük, haftalık, aylık ve saatlik grafikle izlenir." },
            { t: "Masaya göre hareket", d: "Hiç okutulmayan masalar da listelenir." },
            { t: "CSV dışa aktarma", d: "Rapor sayfaları CSV olarak indirilir." }
          ]
        },
        problem: {
          title: "Hangi ürüne bakıldığı tahminle yönetilir.",
          text: "Hangi ürünün ilgi gördüğü, hangi masanın QR’ının hiç okutulmadığı, sepete konan ürünün neden gönderilmediği çoğu zaman görülmez.",
          scene: "Menünün altındaki bir tatlı hiç tıklanmıyor ama kimse fark etmiyor; başka bir masanın QR kodu ise hiç okutulmamış."
        },
        solution: {
          title: "Kullanım verisi raporlara dönüşür.",
          text: "Menüdeki hareketler kaydedilir ve Genel Bakış, Ürünler, Masalar, Sepet & Sipariş ile Müşteri Etkileşimi raporlarında gösterilir."
        },
        groups: [
          {
            title: "Menü ve ürün", open: true,
            items: [
              { t: "Genel bakış", d: "Menü görüntüleme, ürün tıklama ve tekil ziyaretçi; günlük, haftalık, aylık ve saatlik grafikle izlenir.", src: "genel-sayfasi.php, hub-sayfasi.php" },
              { t: "Ürünler", d: "En çok ve en az tıklanan ürünler, kategori dağılımı, ürün detayının açılma oranı ve filtre kullanımı gösterilir.", src: "urunler-sayfasi.php" }
            ]
          },
          {
            title: "Masalar",
            items: [
              { t: "Masalara göre hareket", d: "Hangi masadan kaç hareket geldiği, masa grupları ve hiç okutulmayan masalar listelenir; masasız (doğrudan) erişim ayrı görünür.", src: "masalar-sayfasi.php" }
            ]
          },
          {
            title: "Sepet ve sipariş",
            items: [
              { t: "Sepet hunisi", d: "Sepete eklenen, gönderilen ve terk edilen siparişler dönüşüm hunisinde gösterilir.", src: "sepet-sayfasi.php" },
              { t: "Ürün bazlı görünüm", d: "En çok ciro getiren ürünler ile en çok sepete eklenip gönderilmeyen ürünler listelenir.", src: "sepet-sayfasi.php" },
              { t: "Engellenen siparişler", d: "Tükendi olduğu için engellenen siparişler ve sipariş hataları ayrı raporlanır.", src: "sepet-sayfasi.php" }
            ]
          },
          {
            title: "Müşteri etkileşimi",
            items: [
              { t: "Etkileşim raporu", d: "Chatbot mesajları, yorum ve form gönderimleri, dil seçimi dağılımı, galeri görüntüleme ve açılış ekranı gösterimi raporlanır.", src: "etkilesim-sayfasi.php, acilis-sayfasi.php" }
            ]
          },
          {
            title: "Veri yönetimi",
            items: [
              { t: "CSV dışa aktarma", d: "Rapor sayfaları CSV olarak indirilebilir.", src: "urunler-sayfasi.php, masalar-sayfasi.php, sepet-sayfasi.php" },
              { t: "Saklama süresi", d: "Ham kayıtların saklanacağı gün sayısını ayarlarsınız; süresi dolanlar günlük görevle silinir. 0 yazarsanız temizlik kapanır.", src: "sistem-sayfasi.php" }
            ]
          }
        ],
        notes: [
          "Bu bir geçmiş kullanım raporudur; tahmin veya yapay zekâ analizi içermez.",
          "Sepet ve sipariş verisi, sipariş özelliklerinin (Pro) kullanılmasına; etkileşim verisi ilgili modüllerin açık olmasına bağlıdır. Paketinizde olmayan bir modülün kategorisi raporda kapalı görünür.",
          "Tekil ziyaretçi sayısı IP adresinin özetine göre hesaplanır; aynı ağdan bağlanan farklı kişiler tek sayılabilir.",
          "Az ziyaret alan bir menüde raporlar da az veri gösterir."
        ],
        steps: [
          { t: "Müşteri menüyü kullanır", d: "Menü açılır, ürünlere bakılır, sepete ürün eklenir." },
          { t: "Hareketler kaydedilir", d: "Görüntüleme, tıklama ve masa bilgisi ile birlikte saklanır." },
          { t: "Dönemi seçin", d: "Bugün, Son 7 gün, Bu ay ya da özel tarih aralığı." },
          { t: "Raporu okuyun", d: "Sayfaları inceleyin, gerekirse CSV olarak indirin." }
        ],
        view: {
          intro: "Ürün sıralaması ve sepet hunisi. Çizimlerde gerçek veri yoktur.",
          mock: { type: "bars", title: "En Çok Tıklanan Ürünler", rows: [
              { l: "Örnek Ürün A", w: 92 }, { l: "Örnek Ürün B", w: 71 }, { l: "Örnek Ürün C", w: 48 }, { l: "Örnek Ürün D", w: 26 }
            ] },
          mock2: { type: "bars", title: "Dönüşüm hunisi", rows: [
              { l: "Sepete eklenen", w: 100 }, { l: "Gönderilen", w: 64 }, { l: "Terk edilen", w: 36 }
            ] }
        },
        audience: [
          { who: "Restoranlar", text: "Hangi ürünlerin ilgi gördüğünü görmek isteyenler." },
          { who: "Kafeler", text: "Hangi masa gruplarının QR’ı kullandığını izlemek isteyenler." },
          { who: "Oteller", text: "Farklı alanlardaki menü kullanımını karşılaştırmak isteyenler." },
          { who: "İşletme yöneticileri", text: "Kararlarını kullanım verisiyle desteklemek isteyenler." }
        ],
        related: [
          { slug: "menu-muhendisligi", why: "Satış ve etkileşim verisi maliyetle birleştirilir." },
          { slug: "qr-masa", why: "Masa raporu, masaların tanımına dayanır." },
          { slug: "yorum-geri-bildirim", why: "Yorum ve form gönderimleri etkileşim raporunda sayılır." }
        ]
      },

      /* ===================================================
         8. MASA OTURUM GÜVENLİĞİ
      =================================================== */
      {
        slug: "masa-oturum-guvenligi",
        name: "Masa Oturum Güvenliği",
        tagline: "QR’ı okutan kişi masaya bağlanır.",
        featureIds: ["oturum-guvenligi"],
        seo: {
          title: "Masa Oturum Güvenliği — İmzalı Masa Oturumu",
          description: "Müşteri QR’ı okuttuğunda imzalı bir masa oturumu başlar. Oturum süresi, hareketsizlik limiti ve isteğe bağlı sayfa kilidi sizin ayarınızla sınırlanır."
        },
        hero: {
          h1: "Masadaki QR’ı okutan kişi masaya bağlansın.",
          lead: "Müşteri QR’ı okuttuğunda imzalı bir masa oturumu başlar. Oturumun süresi ve hareketsizlik limiti sizin belirlediğiniz değerlerle sınırlanır.",
          points: [
            { t: "İmzalı masa oturumu", d: "Masa bilgisi HMAC-SHA256 ile imzalanan çerezde tutulur." },
            { t: "Ayarlanabilir süreler", d: "Varsayılan 90 dakika toplam, 30 dakika hareketsizlik." },
            { t: "Kayıtsız masa adresi", d: "Kayıtlı olmayan masa adresinde kilit ekranı gösterilir." }
          ]
        },
        problem: {
          title: "QR adresi herkesin görebildiği bir bağlantıdır.",
          text: "Adres başka yerde paylaşılırsa ya da masa adı elle yazılırsa, o masa adına çağrı veya sipariş gelebilir. Masa bilgisinin doğrulanması gerekir.",
          scene: "Masa 5’in adresi bir arkadaş grubunda paylaşılmış; restoranın dışından Masa 5 adına çağrı geliyor."
        },
        solution: {
          title: "Masa bilgisi imzalanır, süresi sınırlanır.",
          text: "QR okutulduğunda masa, zaman ve masa sürümü imzalı bir çerezde saklanır. İstemci bu çerezi değiştiremez; süre dolunca oturum kapanır."
        },
        groups: [
          {
            title: "Oturum", open: true,
            items: [
              { t: "İmzalı oturum", d: "Masa adı, veriliş zamanı ve son işlem zamanı HMAC-SHA256 ile imzalanır; müşteri başka bir masa adına oturum oluşturamaz.", src: "_qmo-ortak/class-qmo-oturum.php" },
              { t: "Kayıtsız masa adresi", d: "Adreste kayıtlı olmayan bir masa varsa kilit ekranı gösterilir.", src: "masa-dogrulama.php" },
              { t: "Kilit ekranı dili", d: "Kilit ekranı adres, çerez ve tarayıcı diline göre seçilen aktif dilde açılır.", src: "masa-dogrulama.php qmo_kilit_ekrani_dili()" }
            ]
          },
          {
            title: "Limitler",
            items: [
              { t: "Maksimum oturum süresi", d: "QR okutulduktan sonra oturumun toplam ömrü (varsayılan 90 dakika).", src: "oturum-ayarlari.php, class-qmo-oturum.php" },
              { t: "Hareketsizlik limiti", d: "Belirlenen süre işlem yapılmazsa oturum kilitlenir (varsayılan 30 dakika). Sayaç sayfa gezinmesinde de yenilenir.", src: "oturum-ayarlari.php" },
              { t: "Mesaj limiti", d: "Oturum başına Menü Asistanı mesajı sınırlanır (varsayılan 25).", src: "oturum-ayarlari.php" },
              { t: "Masa silinince", d: "Bir masa silindiğinde o masadaki açık oturumlar da kapanır.", src: "qr-masa/masalar-sayfasi.php" }
            ]
          },
          {
            title: "Kapsam",
            items: [
              { t: "Oturum gerektiren özellikler", d: "Menü Asistanı ve sepet gibi bileşenler sayfaya değil oturuma bağlıdır; geçerli oturum yoksa bilgi kutusu gösterilir.", src: "masa-dogrulama.php (başlık notu)" },
              { t: "İsteğe bağlı sayfa kilidi", d: "Korunacak sayfa adreslerini yazarsınız; boş bırakılırsa sayfa kilidi kapalıdır. Ana sayfa hiçbir koşulda kilitlenmez.", src: "oturum-ayarlari.php, masa-dogrulama.php" }
            ]
          }
        ],
        notes: [
          "Bu mekanizma mutlak güvenlik vaadi değildir; masayı QR’ı okutan kişiye bağlar ve oturumu süreyle sınırlar.",
          "Menü varsayılan olarak herkese açıktır; oturum, çağrı, sipariş ve sohbet gibi masaya bağlı özellikleri korur."
        ],
        steps: [
          { t: "Müşteri QR’ı okutur", d: "Adres masa bilgisini taşır: /?masa=masa-31." },
          { t: "Masa doğrulanır", d: "Masa kayıtlıysa imzalı oturum çerezi verilir." },
          { t: "Özellikler açılır", d: "Garson çağırma, sipariş ve sohbet bu oturumla çalışır." },
          { t: "Süre dolar", d: "Maksimum süre veya hareketsizlik limiti aşılınca oturum kapanır." }
        ],
        view: {
          flip: true,
          intro: "Oturum akışı ve oturum limitleri ekranı.",
          mock: { type: "flow", title: "Masa oturumu", steps: ["QR okutulur", "Masa doğrulanır", "İmzalı oturum", "Süre veya limit dolar"] },
          mock2: { type: "panel", title: "Oturum Limitleri", rows: [
              { l: "Maksimum oturum süresi (dk)", v: "90" }, { l: "Hareketsizlik limiti (dk)", v: "30" },
              { l: "Oturum başına chatbot mesajı", v: "25" }, { l: "Korunacak sayfa slug’ları", v: "boş: kilit kapalı" }
            ] }
        },
        audience: [
          { who: "Restoranlar", text: "Masa adına gelen çağrı ve siparişin doğrulanmasını isteyenler." },
          { who: "Kafeler", text: "QR adresinin dışarıda paylaşılmasından çekinenler." },
          { who: "Oteller", text: "Farklı alanlarda ayrı masa oturumları yönetenler." },
          { who: "İşletme yöneticileri", text: "Oturum sürelerini kendi servis düzenine göre ayarlamak isteyenler." }
        ],
        related: [
          { slug: "qr-masa", why: "Doğrulanan masalar burada tanımlanır." },
          { slug: "servis-paneli", why: "Doğrulanmış masa adıyla gelen çağrılar." },
          { slug: "menu-asistani", why: "Sohbet oturuma bağlıdır ve mesaj limitiyle sınırlanır." }
        ]
      },

      /* ===================================================
         9. YORUM & GERİ BİLDİRİM
      =================================================== */
      {
        slug: "yorum-geri-bildirim",
        name: "Yorum & Geri Bildirim",
        tagline: "Müşterinin görüşü size ulaşsın.",
        featureIds: ["geri-bildirim"],
        seo: {
          title: "Yorum & Geri Bildirim — Puanlama ve Form Modülü",
          description: "Çoklu kriterli puanlama formu, iletişim formu ve kendi geri bildirim formlarınız. Gelen yorumları siz yayınlar, yayından kaldırır ya da silersiniz."
        },
        hero: {
          h1: "Müşterinin görüşü size ulaşsın.",
          lead: "Çoklu kriterli puanlama formu, iletişim formu ve kendi oluşturacağınız geri bildirim formları. Gelen yorumları siz yayınlar, yayından kaldırır ya da silersiniz.",
          points: [
            { t: "Beş puanlama kriteri", d: "Adlarını değiştirir, istediğinizi kapatırsınız." },
            { t: "Kendi formlarınız", d: "Form oluşturucuyla geri bildirim formu hazırlarsınız." },
            { t: "Yorum yönetimi", d: "Yorumları yayınlar, yayından kaldırır ya da silersiniz." }
          ]
        },
        problem: {
          title: "Geri bildirimin kolay bir yolu yoksa size ulaşmaz.",
          text: "Aksayan bir nokta müşterinin aklında kalır ama bunu size söyleyeceği bir yer yoksa işletme bunu öğrenemez.",
          scene: "Bir müşteri hizmet hızından memnun kalmadı, hesabı ödeyip çıktı. Ekip bunu hiç duymadı."
        },
        solution: {
          title: "Puanlama ve form menünün içinde durur.",
          text: "Müşteri kriterleri puanlar, yorumunu yazar; yorum panelinize düşer. Ek sorular için kendi formunuzu oluşturursunuz."
        },
        groups: [
          {
            title: "Yorum formu", open: true,
            items: [
              { t: "Çoklu kriterli puanlama", d: "Beş puanlama kriteri vardır (varsayılan: Yemek Lezzeti, Hizmet Hızı, Temizlik, Atmosfer, Fiyat / Performans). Adlarını değiştirir, istediğinizi kapatırsınız.", src: "settings.php crit_1..5" },
              { t: "Yorum ve görsel", d: "Müşteri puanın yanında yorum yazar. Yorum formuna görsel yükleme seçeneği ayrıca açılabilir (varsayılan olarak kapalıdır).", src: "forms/review-form.php, review-media.php" },
              { t: "Yorum listesi", d: "Yayınlanan yorumlar kısa kodla sayfanızda listelenebilir.", src: "frontend/shortcode-reviews.php ([qr_menu_reviews])" }
            ]
          },
          {
            title: "Yönetim",
            items: [
              { t: "Yorum yönetimi", d: "Gelen yorumları okur; yayınlar, yayından kaldırır ya da silersiniz. Bekleyen ve yayındaki yorum sayıları görünür.", src: "admin/menu.php (Tüm Yorumlar), admin/dashboard.php" },
              { t: "Olumlu ve olumsuz sekmeleri", d: "Yorum listesinde puana göre Olumlu ve Olumsuz sekmeleri bulunur; ayrım eşiği varsayılan olarak 3,0’dır.", src: "settings.php QRM_PRO_SENTIMENT_THRESHOLD" },
              { t: "Onay ve spam koruması", d: "Yorumların yayına alınma biçimini ayarlarsınız; form basit bir doğrulama sorusuyla spam’e karşı korunur.", src: "admin/menu.php (Puanlama & Ayarlar), security.php" }
            ]
          },
          {
            title: "Formlar",
            items: [
              { t: "İletişim formu", d: "Kısa kodla sayfanıza eklenen bir iletişim formu vardır.", src: "frontend/shortcode-contact.php" },
              { t: "Form oluşturucu", d: "Kendi geri bildirim formlarınızı oluşturursunuz: metin, uzun metin, e-posta, telefon, sayı, puan, tarih, seçim ve onay kutusu alanları. Gönderimler panelde listelenir.", src: "forms/functions.php, admin/custom-form-builder.php, admin/form-submissions.php" }
            ]
          },
          {
            title: "İsteğe bağlı ek ayarlar",
            items: [
              { t: "Google yorum bağlantısı", d: "Modülde, müşteriye Google yorum sayfasına giden bir bağlantı gösteren isteğe bağlı bir ayar ekranı vardır; adresi siz girersiniz.", src: "settings.php google_review_*" },
              { t: "İndirim kodu", d: "Müşteriye kod verilebilen ve kodların yönetildiği isteğe bağlı bir ekran vardır.", src: "admin/reward-codes.php, admin/rewards.php" }
            ]
          },
          {
            title: "Raporlar ve veri",
            items: [
              { t: "Raporlar", d: "Kriter bazlı puan ortalamaları, masaya göre dağılım ve saat dilimine göre yorum sayısı ile ortalama puan gösterilir.", src: "admin/reports.php, forms/functions.php" },
              { t: "CSV dışa aktarma", d: "Yorumlar ve form gönderimleri CSV olarak indirilebilir.", src: "admin/export-csv.php" },
              { t: "Kişisel veri araçları", d: "Onay metni ve aydınlatma sayfası bağlantısı eklenebilir; kişisel veri dışa aktarma ve silme araçları bulunur.", src: "consent.php, privacy.php" }
            ]
          }
        ],
        notes: [
          "Yorumlar ve form gönderimleri müşteri verisi içerebilir; aydınlatma ve saklama yükümlülükleri işletmenin sorumluluğundadır.",
          "Google yorum bağlantısı ve indirim kodu isteğe bağlıdır; kullanımı ilgili platformun politikalarına ve mevzuata uygun olmalıdır, bu sorumluluk işletmeye aittir.",
          "Raporlar, gelen yorum sayısı kadar anlamlıdır; az yorumda ortalamalar sınırlı bilgi verir."
        ],
        steps: [
          { t: "Kriterleri belirleyin", d: "Puanlanacak kriterleri adlandırın; form görünümünü ayarlayın." },
          { t: "Formu sayfaya ekleyin", d: "Kısa kodla yorum veya iletişim formunu yerleştirin." },
          { t: "Müşteri gönderir", d: "Puanlar, yorum yazar; isterse görsel ekler." },
          { t: "Siz yönetirsiniz", d: "Yorumları yayınlar ya da kaldırır, raporları incelersiniz." }
        ],
        view: {
          intro: "Müşteri tarafında puanlama formu, işletme tarafında yorum yönetimi.",
          mock: { type: "rating", title: "Değerlendirme", criteria: ["Yemek Lezzeti", "Hizmet Hızı", "Temizlik", "Atmosfer", "Fiyat / Performans"], comment: "Yorumunuz" },
          mock2: { type: "reviews", title: "Tüm Yorumlar", rows: [
              { n: "Örnek yorum 1", s: "Yayında", a: ["Yayından kaldır", "Sil"] },
              { n: "Örnek yorum 2", s: "Bekliyor", a: ["Yayınla", "Sil"] }
            ] }
        },
        audience: [
          { who: "Restoranlar", text: "Hizmet ve lezzet hakkında düzenli geri bildirim toplamak isteyenler." },
          { who: "Kafeler", text: "Müşteri görüşünü menü içinden almak isteyenler." },
          { who: "Oteller", text: "Farklı konularda kendi sorularını sormak isteyenler." },
          { who: "İşletme yöneticileri", text: "Geri bildirimleri masa ve saat bazında incelemek isteyenler." }
        ],
        related: [
          { slug: "qr-analytics", why: "Yorum ve form gönderimleri etkileşim raporunda sayılır." },
          { slug: "menu-muhendisligi", why: "Menüyü veriyle iyileştirmek için maliyet ve satış tarafı." },
          { slug: "qr-masa", why: "Yorumlar masa bilgisiyle ilişkilendirilebilir." }
        ]
      },

      /* ===================================================
         10. MENÜ MÜHENDİSLİĞİ
      =================================================== */
      {
        slug: "menu-muhendisligi",
        name: "Menü Mühendisliği",
        tagline: "Hangi ürün kazandırıyor, hangisi kaybettiriyor?",
        featureIds: ["menu-muhendisligi", "maliyet-recete"],
        seo: {
          title: "Menü Mühendisliği — Maliyet ve Menü Matrisi",
          description: "Ürün maliyetlerinizi ve reçetelerinizi girin; satış verisiyle birleştirilerek her ürün Yıldız, Çok Satan, Gizli Fırsat ya da Zayıf Performans grubuna yerleşir."
        },
        hero: {
          h1: "Hangi ürün kazandırıyor, hangisi kaybettiriyor?",
          lead: "Ürün maliyetlerinizi girin; satış ve etkileşim verisiyle birleştirilsin. Her ürün Kasavana–Smith matrisinde dört gruptan birine yerleşir ve yanında ne yapılacağı yazar.",
          points: [
            { t: "Maliyet ve reçete", d: "Ürün maliyetini elle girer ya da reçeteden hesaplatırsınız." },
            { t: "Dört gruplu matris", d: "Yıldız, Çok Satan, Gizli Fırsat ve Zayıf Performans." },
            { t: "Veri girişi gerekir", d: "Maliyeti girilmeyen ürün matrise alınmaz." }
          ]
        },
        problem: {
          title: "En çok satan ürün, en çok kazandıran olmayabilir.",
          text: "Satış adedine bakmak kârlılığı göstermez; maliyeti yüksek bir ürün çok satsa da az kazandırabilir. Kârlı ama az satan ürünler ise fark edilmez.",
          scene: "Menünün en çok satan çorbası, malzeme maliyeti yüzünden çok az kâr bırakıyor; en kârlı tatlı ise menünün sonunda kalmış."
        },
        solution: {
          title: "Popülerlik ve kârlılık aynı matriste birleşir.",
          text: "Ürünü hem satış payına hem birim kâr katkısına göre değerlendirir; her ürün dört gruptan birine girer ve bir aksiyon cümlesi alır."
        },
        groups: [
          {
            title: "Maliyet girişi", open: true,
            items: [
              { t: "Manuel maliyet", d: "Ürünün birim maliyetini doğrudan girersiniz.", src: "class-qrms-mm-maliyet.php (manuel)" },
              { t: "Reçeteden maliyet", d: "Ürünün reçetesine malzeme ve miktar satırları girersiniz; maliyet malzeme birim fiyatlarından hesaplanır.", src: "class-qrms-mm-maliyet.php (recete)" },
              { t: "Malzeme fiyatları", d: "Malzemelerin birim fiyatı kg, litre veya adet üzerinden girilir; reçetede gram, ml veya adet yazılır. Fiyat değiştiğinde reçeteli ürünlerin maliyeti yeniden hesaplanır.", src: "class-qrms-mm-maliyet.php birimler(), malzeme-sayfasi.php" },
              { t: "Fire yüzdesi", d: "Reçete maliyetine eklenmek üzere fire yüzdesi (0–50) ayarlanır.", src: "class-qrms-mm-maliyet.php (fire_yuzdesi)" }
            ]
          },
          {
            title: "Matris",
            items: [
              { t: "İki eksen", d: "Popülerlik: ürünün satış adedinin menü içindeki payı. Kârlılık: birim katkı payı (fiyat − maliyet). Popülerlik eşiği eşit dağılımın %70’idir (0,5–1,0 arasında ayarlanır); kârlılık eşiği adetle ağırlıklı ortalama katkı payıdır.", src: "class-qrms-mm-hesap.php" },
              { t: "Dört grup", d: "Yıldız (çok satıyor, çok kazandırıyor), Çok Satan (çok satıyor, az kazandırıyor), Gizli Fırsat (kârlı ama az satıyor) ve Zayıf Performans.", src: "class-qrms-mm-hesap.php kutular(), kutu_anlami()" },
              { t: "Aksiyon cümlesi", d: "Her grup için genel bir yönlendirme yazılır; örneğin Gizli Fırsat için görünürlüğü artırmak, Çok Satan için maliyeti düşürmek ya da küçük bir zam denemek.", src: "class-qrms-mm-hesap.php aksiyon()" }
            ]
          },
          {
            title: "Rapor",
            items: [
              { t: "Menü performansı raporu", d: "Dönem ve kategoriye göre süzülür; ürün ayrıntısı ve CSV dışa aktarma bulunur.", src: "rapor-sayfasi.php, export-csv.php" },
              { t: "Eksik maliyet listesi", d: "Fiyatı veya maliyeti girilmemiş ürünler ayrı listelenir; “Eksik maliyetleri gir” ile tamamlanır.", src: "rapor-sayfasi.php" }
            ]
          }
        ],
        notes: [
          "Bu modül veri girişi gerektirir: maliyeti veya fiyatı girilmeyen ürün matrise alınmaz.",
          "Satış verisi sipariş akışından gelir. Toplam satış 20 adedin altındaysa popülerlik görüntülenme ve sepete ekleme verisiyle tahmin edilir; rapor bunu ekranda açıkça belirtir.",
          "Aksiyon cümleleri genel yönlendirmedir; sonuç garantisi vermez. Karar sizindir."
        ],
        steps: [
          { t: "Malzeme fiyatlarını girin", d: "Kullandığınız malzemelerin birim fiyatını kaydedin." },
          { t: "Maliyetleri tanımlayın", d: "Ürün maliyetini elle girin ya da reçeteden hesaplatın." },
          { t: "Raporu açın", d: "Dönem ve kategoriyi seçin; matris oluşur." },
          { t: "Aksiyon alın", d: "Her ürünün grubuna göre fiyat, görünürlük ya da reçete kararı verin." }
        ],
        view: {
          flip: true,
          intro: "Matris ve maliyet girişi. Çizimlerde gerçek veri yoktur.",
          mock: { type: "matrix", title: "Menü Performansı", axes: ["Popülerlik →", "Kârlılık →"], cells: [
              { n: "Gizli Fırsat", d: "Kârlı ama yeterince satmıyor." }, { n: "Yıldız", d: "Çok satıyor ve çok kazandırıyor." },
              { n: "Zayıf Performans", d: "Ne satıyor ne kazandırıyor." }, { n: "Çok Satan", d: "Çok satıyor ama az kazandırıyor." }
            ] },
          mock2: { type: "table", title: "Reçete ve maliyet", cols: ["Malzeme", "Miktar", "Birim fiyat"],
            rows: [["Malzeme 1", "… g", "… ₺/kg"], ["Malzeme 2", "… ml", "… ₺/lt"], ["Malzeme 3", "… adet", "… ₺/adet"]] }
        },
        audience: [
          { who: "Restoranlar", text: "Menü fiyatlarını maliyete göre gözden geçirmek isteyenler." },
          { who: "Kafeler", text: "Reçeteli ürünlerinin maliyetini takip etmek isteyenler." },
          { who: "Oteller", text: "Çok sayıda ürünü olan menüleri veriyle sadeleştirmek isteyenler." },
          { who: "İşletme yöneticileri", text: "Menü kararlarını satış ve maliyet verisine dayandırmak isteyenler." }
        ],
        related: [
          { slug: "qr-analytics", why: "Satış ve etkileşim verisi bu raporlardan gelir." },
          { slug: "restoran-menu", why: "Ürün, fiyat ve malzeme bilgisi burada tutulur." },
          { slug: "yorum-geri-bildirim", why: "Müşteri görüşünü menü kararlarına ekleyin." }
        ]
      }
    ]
  };
});
