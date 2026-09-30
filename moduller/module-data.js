/* =========================================================
   QR MENU OFFICIAL — /moduller/ İÇERİK VERİSİ
   Modül sayfalarının TÜM içeriği yalnızca burada tanımlanır.
   Değişiklikten sonra:

       node moduller/build.js

   çalıştırılarak 10 sayfa + /moduller/ dizini yeniden üretilir.

   PAKET BİLGİSİ burada yazılmaz: featureIds → ../paketler/packages-data.js
   içindeki özelliklerin `from` alanından hesaplanır (source of truth).
   SSS BAĞLANTILARI: faq[] → ../sss/faq-data.mjs içindeki soru kimlikleri;
   bağlantı metni sorunun kendisidir (build doğrular).

   İÇERİK KATMANLARI
   - PRIMARY  : hero, shift, stage.title/text, story.title — görünür ana mesaj
   - SECONDARY: stage.callouts, visual (temsili arayüz) — ürünün bunu nasıl yaptığı
   - DETAIL   : groups[] (akordeon) + notes[] — teknik/ikincil bilgi, SEO içeriği

   İÇERİK KURALI: groups[].items[] yalnızca qr-menu-suite kodunda doğrulanmış
   davranışı anlatır; `src` doğrulama kaynağıdır (sayfada görünmez). Diğer
   metinler pazarlama copy'sidir ve ürün davranışıyla çelişmez.
   Arayüz çizimleri temsilidir; içerikleri örnektir ("Örnek veri" rozeti ve
   sahne altı notu sayfada görünür).

   SUNUM ALANLARI
   - order     : bölüm sırası  (hero · shift · stage · story · capabilities ·
                 proof · details · related · closing)
   - hero.layout : "split" (metin + görsel) | "center" (görsel öncelikli)
   - stage.theme : "dark" | "light"   stage.layout : "split" | "wide"
   - story.type  : "pipeline" | "pairs" | "compare" | "timeline"
   - visual      : temsili arayüz tanımı (frame + blocks) — bkz. build.js MOCK
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
      tagline: "Masadan servise dijital restoran sistemi.",
      pricingLabel: "Paketleri İnceleyin",
      modulesLabel: "Diğer modülleri görün"
    },

    /* Sahne altı notu: gerçek ekran görüntüsü izlenimi verilmez. */
    mockCaption: "Temsili arayüz çizimi; örnek içerik kullanılmıştır, gerçek ekran görüntüsü değildir.",
    mockCaptionShort: "Temsili arayüz · örnek içerik",

    categories: [
      { id: "menu", name: "Menü", lead: "Müşterinin telefonunda açılan menü: içerik, dil ve filtre." },
      { id: "servis", name: "Masa & Servis", lead: "Masadan gelen talebin ekibinize ulaştığı akış." },
      { id: "isletme", name: "Akıllı İşletme", lead: "Menüyü soru, kullanım verisi, geri bildirim ve maliyetle yöneten araçlar." }
    ],

    hub: {
      h1: "Menüden servise, tek sistem.",
      lead: "QR Menu Official on modülden oluşur: müşterinin gördüğü menü, masadan gelen servis akışı ve işletmeyi veriyle yöneten araçlar. Her modülün ne yaptığını ve hangi pakette olduğunu kendi sayfasında görün.",
      closingTitle: "Hangi modül hangi pakette?",
      closingText: "Temel, Pro ve Plus paketlerini ve içerdikleri modülleri yan yana karşılaştırın."
    },

    modules: [

      /* ===================================================
         1. RESTORAN MENÜ — visual-first + yönetim hikâyesi
      =================================================== */
      {
        slug: "restoran-menu",
        name: "Restoran Menü",
        category: "menu",
        cue: "menu",
        tagline: "Menü, fiyat ve stok tek panelde.",
        featureIds: ["qr-menu", "menu-yonetimi", "csv-aktar", "porsiyon-ekstra", "kampanya-combo", "rozetler"],
        seo: {
          title: "Restoran Menü — Dijital QR Menü Yönetimi",
          description: "Kategori, ürün, fiyat, alerjen, porsiyon ve kampanyaları tek panelden yönetin; menünüz müşterinin telefonunda aranabilir ve filtrelenebilir açılsın."
        },
        faq: ["qrmo-faq-q-urun-nasil-eklenir", "qrmo-faq-q-tukendi-urun", "qrmo-faq-q-csv-aktarim"],
        order: ["hero", "story", "stage", "capabilities", "details", "related", "closing"],

        hero: {
          layout: "center",
          h1: "Menünüzü tek panelden yönetin.",
          lead: "Fiyatı, stoğu ve ürün bilgisini panelde güncellersiniz; müşteri menüyü QR ile telefonunda güncel haliyle açar.",
          proof: ["Tükendi ve servis saati etiketleri", "Porsiyon, ekstra ve kombin", "CSV ile toplu aktarım"],
          visual: {
            frame: "scene", layout: "duo",
            alt: "Temsili arayüz: solda ürün düzenleme ekranında Mercimek Çorbası’nın fiyatı, kategorisi, alerjeni ve rozetleri; sağda aynı ürünün müşteri telefonundaki menüde görünümü.",
            items: [
              { frame: "window", theme: "light", title: "Ürünler › Ürün düzenle", blocks: [
                { b: "head", title: "Mercimek Çorbası", badge: "Yayında" },
                { b: "fields", items: [{ l: "Fiyat (₺)", v: "95" }, { l: "Kategori", v: "Çorbalar" }, { l: "Kalori (kcal)", v: "180" }, { l: "Hazırlanış (dk)", v: "10" }] },
                { b: "chips", label: "Alerjenler", items: ["Glüten", "Süt / Laktoz", "Kereviz", "Hardal"], on: [2] },
                { b: "toggles", items: [{ l: "Popüler", on: true }, { l: "Vegan", on: true }, { l: "Tükendi", on: false }] },
                { b: "btns", items: ["Önizle", "Güncelle"], solid: 1 }
              ] },
              { frame: "phone", theme: "light", blocks: [
                { b: "appbar", title: "Menü", sub: "Masa 12" },
                { b: "search", text: "Ürün ara…" },
                { b: "tabs", items: ["Çorbalar", "Ana Yemek", "Tatlı"], on: 0 },
                { b: "item", n: "Mercimek Çorbası", m: "180 kcal · 10 dk", p: "95 ₺", tag: "Popüler" },
                { b: "item", n: "Ezogelin Çorbası", m: "Menüde kalır, sepete eklenemez", p: "85 ₺", tag: "Tükendi", off: true },
                { b: "item", n: "Çorba + Pide", m: "İki ürün, tek fiyat", p: "120 ₺", tag: "Kombin" }
              ] }
            ]
          }
        },

        story: {
          type: "pairs",
          kicker: "TEK MERKEZ",
          title: "Panelde değiştirin, menüde görünsün.",
          text: "Menüdeki her değişiklik aynı panelden yapılır. Müşteri bir sonraki açılışta güncel menüyü görür.",
          cols: ["PANELDE", "MÜŞTERİNİN MENÜSÜNDE"],
          rows: [
            { k: "Fiyat", a: "Fiyatı güncellersiniz.", b: "Menü yeni fiyatla açılır; baskı gerekmez." },
            { k: "Stok", a: "Ürünü tükendi işaretlersiniz; isterseniz belirlediğiniz saatte satışa döner.", b: "Ürün menüde kalır, etiketi görünür ve sepete eklenemez." },
            { k: "Porsiyon & ekstra", a: "“Büyük +40 ₺” ya da “sos +10 ₺” gibi seçenekler tanımlarsınız.", b: "Seçenekler ürünün taban fiyatının üzerine eklenir." },
            { k: "Kampanya & kombin", a: "Toplu indirim uygular ya da iki ürünü tek fiyatla sunarsınız.", b: "İndirimi kaldırdığınızda fiyatlar eskisine döner." },
            { k: "Servis saati", a: "Kategoriye “Kahvaltı 07:00–11:00” kuralını bir kez yazarsınız.", b: "Saat dışındaki ürün etiketiyle görünür, sepete eklenemez." }
          ]
        },

        stage: {
          theme: "dark", layout: "split",
          kicker: "MÜŞTERİ TARAFI",
          title: "Müşterinin telefonunda menü.",
          text: "Menü uygulama indirmeden tarayıcıda açılır. Müşteri arar, filtreler, ürünün ayrıntısına iner.",
          visual: {
            frame: "scene", layout: "pair",
            alt: "Temsili arayüz: müşteri telefonunda menü listesi (arama, filtre, rozet ve tükendi etiketi) ve Mercimek Çorbası’nın besin, alerjen ve porsiyon bilgisini gösteren ürün detayı.",
            items: [
              { frame: "phone", theme: "light", blocks: [
                { b: "appbar", title: "Menü", sub: "Masa 12" },
                { b: "search", text: "Ürün ara…" },
                { b: "btns", items: ["Filtrele", "Sırala"], hot: 1 },
                { b: "tabs", items: ["Kahvaltı", "Çorbalar", "Tatlı"], on: 1 },
                { b: "item", n: "Mercimek Çorbası", m: "180 kcal · 10 dk", p: "95 ₺", tag: "Popüler" },
                { b: "item", n: "Ezogelin Çorbası", m: "Menüde kalır, sepete eklenemez", p: "85 ₺", tag: "Tükendi", off: true, hot: 2 },
                { b: "item", n: "Yayla Çorbası", m: "210 kcal · 12 dk", p: "90 ₺", tag: "Yeni" }
              ] },
              { frame: "phone", theme: "light", blocks: [
                { b: "detail", n: "Mercimek Çorbası", c: "Çorbalar", p: "95 ₺", hot: 3,
                  rows: [{ l: "Kalori", v: "180 kcal" }, { l: "Gramaj", v: "300 g" }, { l: "Protein", v: "9 g" }, { l: "Hazırlanış", v: "10 dk" }, { l: "Acılık", v: "Acısız" }],
                  tags: ["Vegan", "Alerjen: Kereviz"] },
                { b: "chips", label: "Porsiyon", items: ["Normal", "Büyük +40 ₺"], on: [0] },
                { b: "chips", label: "Ekstra", items: ["Ekstra ekmek +10 ₺", "Limon"], on: [] }
              ] }
            ]
          },
          callouts: [
            { t: "Arama, filtre ve sıralama", d: "Müşteri ürün arar, filtre uygular, menüyü sıralar." },
            { t: "Durum etiketleri", d: "Tükendi ya da servis saati dışındaki ürün menüde kalır, etiketiyle görünür." },
            { t: "Ürün detayı", d: "Kalori, besin değerleri, hazırlanış süresi, acılık, alerjen, porsiyon ve ekstralar tek ekranda." }
          ]
        },

        capabilities: {
          kicker: "ALTYAPI",
          title: "Bir kez kurun, sonra yalnızca güncelleyin.",
          items: [
            { t: "CSV ile toplu aktarım", d: "Ürünleri örnek tabloda hazırlayıp tek dosyayla yüklersiniz; fiyatı geçersiz satırlar size bildirilir." },
            { t: "JSON ile yedek", d: "Menünün tamamını dışa aktarır, gerektiğinde geri yüklersiniz." },
            { t: "Size ait görünüm", d: "Beş hazır renk paleti, yazı tipi ve renk ayarları. Menü sayfaya kısa kod ya da Elementor bileşeniyle eklenir." }
          ]
        },

        groups: [
          {
            title: "Menü içeriği",
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
          "Kampanyalar panelden başlatılır ve geri alınır; saat veya güne göre otomatik başlayıp biten kampanya bu sürümde çalışmaz.",
          "Sepetle sipariş Pro paketindeki QR sipariş özelliğidir."
        ],
        related: [
          { slug: "qr-masa", why: "Her masanın QR kodu bu menüye açılır." },
          { slug: "akilli-filtreleme", why: "Menüdeki arama ve filtre paneli." },
          { slug: "coklu-dil", why: "Menüyü misafirin dilinde sunun." }
        ]
      },

      /* ===================================================
         2. QR MASA — QR görseli + operasyon akışı
      =================================================== */
      {
        slug: "qr-masa",
        name: "QR Masa",
        category: "servis",
        cue: "qr",
        tagline: "Her masaya kendi QR kodu.",
        featureIds: ["qr-masa"],
        seo: {
          title: "QR Masa — Masa Bazlı QR Kod Oluşturma",
          description: "Masalarınızı tanımlayın, her biri için yazdırılabilir QR kod üretin. Müşteri hangi masadan okuttuğu bilgisiyle menüye girer."
        },
        faq: ["qrmo-faq-q-her-masa-ayri-qr", "qrmo-faq-q-masa-ad-degisince", "qrmo-faq-q-qr-hangi-adres"],
        order: ["hero", "story", "stage", "proof", "details", "related", "closing"],

        hero: {
          layout: "split",
          h1: "Her masanın kendi QR’ı.",
          lead: "Masaları panelde tanımlayın, QR kodlarını PNG ya da PDF olarak indirin. Müşteri menüyü hangi masada olduğu bilgisiyle açar.",
          proof: ["Tek tek ya da toplu oluşturma", "PNG, PDF ve tek dosyada tüm masalar", "Masa bilgisi servis akışına taşınır"],
          visual: {
            frame: "scene", layout: "print",
            alt: "Temsili arayüz: “Masa 12” yazan, QR kodlu yazdırılabilir masa kartı ve arkasında masa adı, adresi ve PNG/PDF indirme seçenekleri olan QR kod listesi.",
            items: [
              { frame: "window", theme: "light", title: "QR Masa › QR Kodlar", blocks: [
                { b: "head", title: "QR Kodlar", badge: "24 masa" },
                { b: "table", cols: ["Masa", "Adres", "İndir"], rows: [["Masa 12", "/?masa=masa-12", "PNG · PDF"], ["ic-masa-3", "/?masa=ic-masa-3", "PNG · PDF"], ["VIP Salon", "/?masa=vip-salon", "PNG · PDF"], ["bahce-2", "/?masa=bahce-2", "PNG · PDF"]], hl: 0 },
                { b: "btns", items: ["Tümünü yazdır (PDF)"], solid: 0 }
              ] },
              { frame: "card", blocks: [
                { b: "qrcard", name: "Masa 12", seed: 12 }
              ] }
            ]
          }
        },

        story: {
          type: "pipeline",
          kicker: "AKIŞ",
          title: "Masa, QR, menü.",
          text: "Kurulum bir kez yapılır; sonrası müşterinin okutmasıdır.",
          nodes: [
            { t: "Masa", d: "“Masa 31” yazarsınız; adresi kendiliğinden üretilir: /?masa=masa-31." },
            { t: "QR", d: "Kodu PNG ya da PDF olarak indirir, tüm masaları tek PDF’te yazdırırsınız." },
            { t: "Menü", d: "Müşteri okutur; menü hangi masada olduğu bilgisiyle açılır." }
          ],
          note: "Garson çağrısı, hesap isteği ve sipariş (Pro) aynı masa bilgisiyle Servis Paneli’ne gelir."
        },

        stage: {
          theme: "light", layout: "split",
          kicker: "TOPLU OLUŞTURMA",
          title: "Onlarca masayı tek seferde açın.",
          text: "Bir ön ek ve numara aralığı girersiniz; masalar QR adresleriyle birlikte oluşur. Ortak ön eke sahip masalar grup olarak listelenir.",
          visual: {
            frame: "window", theme: "light", title: "QR Masa › Masalar",
            alt: "Temsili arayüz: ön ek ic-masa, başlangıç 1, bitiş 10 girilmiş toplu masa oluşturma formu; sonuçta ic-masa-1 ile ic-masa-10 arası masalar ve gruplara göre süzülen masa listesi.",
            blocks: [
              { b: "tabs", items: ["Toplu oluştur", "Tek masa"], on: 0 },
              { b: "fields", cols: 3, items: [{ l: "Ön ek", v: "ic-masa" }, { l: "Başlangıç", v: "1" }, { l: "Bitiş", v: "10" }], hot: 1 },
              { b: "result", text: "ic-masa-1 … ic-masa-10 · 10 masa oluşturulur" },
              { b: "chips", label: "Gruplar", items: ["Tümü", "ic-masa", "bahce", "vip"], on: [1], hot: 2 },
              { b: "table", cols: ["Masa", "Adres"], rows: [["ic-masa-1", "/?masa=ic-masa-1"], ["ic-masa-2", "/?masa=ic-masa-2"], ["VIP Salon", "/?masa=vip-salon"]], hl: 2, hot: 3 }
            ]
          },
          callouts: [
            { t: "Ön ek ve aralık", d: "Tek seferde en fazla 200 masa açılır; var olan masalar atlanır." },
            { t: "Gruplar", d: "ic-masa, bahce gibi ortak ön ekler grup olur; listeyi gruba göre süzersiniz." },
            { t: "Addan adres", d: "“VIP Salon” yazdığınızda adres vip-salon olarak üretilir." }
          ]
        },

        proof: {
          kicker: "BASILI QR",
          title: "Masanın adı değişir, basılı QR aynı kalır.",
          text: "Adres masa oluşturulurken üretilir. Adı değiştirmek QR kodun hedefini değiştirmez; masaya konmuş kod aynı masayı göstermeye devam eder.",
          visual: {
            frame: "window", theme: "light", title: "QR Masa › Masa düzenle",
            alt: "Temsili arayüz: masa adı “Teras 1” olarak değiştirilmiş, adres alanı /?masa=masa-31 olarak aynı kalmış masa düzenleme formu.",
            blocks: [
              { b: "fields", items: [{ l: "Masa adı", v: "Teras 1" }, { l: "Adres (değişmez)", v: "/?masa=masa-31" }] },
              { b: "note", text: "Önceki ad: Masa 31" },
              { b: "btns", items: ["Kaydet"], solid: 0 }
            ]
          },
          facts: [
            { v: "200", l: "masaya kadar tek seferde oluşturma" },
            { v: "PNG · PDF", l: "tek masa için ya da tüm masalar için" },
            { v: "1 sayfa", l: "her masaya, tek PDF dosyasında" }
          ],
          note: "Masa silinirse o masadaki açık oturumlar da kapanır."
        },

        groups: [
          {
            title: "Masa tanımı",
            items: [
              { t: "Tek masa oluşturma", d: "Masa adını yazarsınız; adres otomatik üretilir (“Masa 31” → masa-31, “VIP Salon” → vip-salon).", src: "masalar-sayfasi.php" },
              { t: "Toplu oluşturma", d: "Bir ön ek ve numara aralığı girersiniz (örneğin ic-masa, 1–10); ic-masa-1 … ic-masa-10 tek seferde açılır. Var olan masalar atlanır; tek seferde en fazla 200 masa açılır.", src: "class-qmo-masalar.php TOPLU_AZAMI" },
              { t: "Gruba göre listeleme", d: "Ortak ön eke sahip masalar (ic-masa, bahce gibi) grup olarak listelenir; listeyi gruba göre süzebilirsiniz.", src: "class-qmo-masalar.php grup_adi()" },
              { t: "Düzenleme ve silme", d: "Masa adını değiştirmek QR kodun hedef adresini değiştirmez; basılıp masaya konmuş QR kod aynı masayı göstermeye devam eder. Masa silinirse o masadaki açık oturumlar da kapanır.", src: "class-qmo-masalar.php guncelle() (slug’a dokunulmaz), masalar-sayfasi.php" }
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
        related: [
          { slug: "restoran-menu", why: "QR kodun açtığı menü." },
          { slug: "masa-oturum-guvenligi", why: "Masa oturumunu imzalar ve süreyle sınırlar." },
          { slug: "servis-paneli", why: "Masa bilgisiyle gelen çağrılar burada görünür." }
        ]
      },

      /* ===================================================
         3. ÇOKLU DİL — dil değişimi + önce/sonra
         Görünen ad "Çoklu Dil" (paketler/packages-data.js ve ana sayfa ile
         aynı). URL: /moduller/coklu-dil/
      =================================================== */
      {
        slug: "coklu-dil",
        name: "Çoklu Dil",
        category: "menu",
        cue: "lang",
        tagline: "Menü misafirin dilinde açılır.",
        featureIds: ["coklu-dil"],
        seo: {
          title: "Çoklu Dil — Çok Dilli Dijital Menü",
          description: "30 dil arasından menünüzde göstereceğiniz dilleri seçin; çevirileri CSV ile toplu girin. Müşteri dil seçiciyle menüyü kendi dilinde açar."
        },
        faq: ["qrmo-faq-q-coklu-dil", "qrmo-faq-q-otomatik-ceviri", "qrmo-faq-q-ceviri-csv"],
        order: ["hero", "story", "stage", "capabilities", "details", "related", "closing"],

        hero: {
          layout: "split",
          h1: "Menünüz misafirin dilinde.",
          lead: "Menüde göstereceğiniz dilleri 30 dil arasından seçin. Müşteri dil seçiciyle kendi diline geçer; ürün, kategori ve alerjenler o dilde görünür.",
          proof: ["30 dil, sağdan sola diller dahil", "Ürün, kategori, alerjen ve arayüz metinleri", "Çeviri kontrolü sizde"],
          visual: {
            frame: "phone", theme: "light",
            alt: "Temsili arayüz: dil seçicide English seçili müşteri menüsü; arama kutusu, kategori sekmeleri ve ürün adları İngilizce.",
            blocks: [
              { b: "appbar", title: "Menu", sub: "Table 12" },
              { b: "langs", items: ["TR", "EN", "DE", "AR"], on: 1 },
              { b: "search", text: "Search products…" },
              { b: "tabs", items: ["Soups", "Mains", "Desserts"], on: 0 },
              { b: "item", n: "Lentil Soup", m: "180 kcal · 10 min", p: "95 ₺", tag: "Popular" },
              { b: "item", n: "Yayla Soup", m: "Yogurt and mint", p: "90 ₺", tag: "New" },
              { b: "item", n: "Tomato Soup", m: "160 kcal · 8 min", p: "85 ₺" }
            ]
          }
        },

        story: {
          type: "compare",
          kicker: "AYNI ÜRÜN",
          title: "Misafir, ürünü kendi dilinde okur.",
          text: "Çevirisi girilmiş her alan seçilen dilde görünür. Fiyat aynı kalır; sayı ayracı dile göre değişir.",
          cards: [
            { label: "Türkçe · orijinal", n: "Serpme Kahvaltı", c: "Kahvaltı", m: "2 kişilik", a: "Süt / Laktoz, Yumurta", p: "1.250,00 ₺" },
            { label: "İngilizce", n: "Turkish Breakfast Spread", c: "Breakfast", m: "For 2", a: "Milk / Lactose, Egg", p: "1,250.00 ₺" },
            { label: "Arapça · sağdan sola", rtl: true, n: "فطور تركي مشكّل", c: "الفطور", m: "لشخصين", a: "الحليب / اللاكتوز، البيض", p: "1,250.00 ₺" }
          ],
          note: "Örnek çeviriler. Çevirileri siz ya da çevirmeniniz girersiniz."
        },

        stage: {
          theme: "light", layout: "split",
          kicker: "ÇEVİRİ TABLOSU",
          title: "Çeviriler tek dosyada, kontrol sizde.",
          text: "Bu modül makine çevirisi yapmaz. Çeviri dosyasını indirirsiniz; dil sütunlarını siz ya da çevirmeniniz doldurur, CSV ile geri yüklersiniz.",
          visual: {
            frame: "window", theme: "light", title: "Çoklu Dil › CSV",
            alt: "Temsili arayüz: Alan, Türkçe, English ve Deutsch sütunlarından oluşan çeviri tablosu; bir arayüz metninin Almanca çevirisi boş. Altında her dil için yazılan çeviri sayısı.",
            blocks: [
              { b: "table", cols: ["Alan", "Türkçe", "English", "Deutsch"], hot: 1, rows: [
                ["Ürün", "Mercimek Çorbası", "Lentil Soup", "Linsensuppe"],
                ["Kategori", "Çorbalar", "Soups", "Suppen"],
                ["Alerjen", "Kereviz", "Celery", "Sellerie"],
                ["Arayüz", "Ürün ara…", "Search products…", "—"]
              ], empty: [3, 3] },
              { b: "rank", title: "Sistem durumu", hot: 3, rows: [{ l: "English", v: "4 / 4", w: 100 }, { l: "Deutsch", v: "3 / 4", w: 75 }] },
              { b: "btns", items: ["CSV dışa aktar", "CSV içe aktar"], solid: 1, hot: 2 }
            ]
          },
          callouts: [
            { t: "Eksik çeviri", d: "Çevirisi girilmemiş alan Türkçe haliyle görünür; menüde boşluk kalmaz." },
            { t: "Dışa aktar, doldur, yükle", d: "Dosya virgül ya da noktalı virgülle iner; yüklerken ayraç kendiliğinden algılanır." },
            { t: "Sistem durumu", d: "Her dil için kaç çeviri yazıldığını, hangilerinin eskidiğini görürsünüz." }
          ]
        },

        capabilities: {
          kicker: "MENÜNÜN ÖTESİ",
          title: "Menüyle birlikte arayüz de çevrilir.",
          items: [
            { t: "Arayüz metinleri", d: "“Filtrele”, “Sırala”, “Ürün ara…” gibi sabit metinler hazır listeyle gelir; metin toplama henüz çevrilmemiş olanları bulur." },
            { t: "Dil seçici", d: "Yalnızca bayrak ya da bayrak ve dil adı gösteren iki seçici; buton renklerini siz ayarlarsınız." },
            { t: "Arama motorları", d: "Seçilen dil adreste görünür (?lang=en) ve alternatif dil etiketleri (hreflang) yayınlanır." }
          ]
        },

        groups: [
          {
            title: "Diller",
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
        related: [
          { slug: "restoran-menu", why: "Çevrilen menü içeriği burada tutulur." },
          { slug: "akilli-filtreleme", why: "Filtre panelinin metinleri de çevrilir." },
          { slug: "menu-asistani", why: "Asistanın sabit mesajları da çeviri altyapısından geçer." }
        ]
      },

      /* ===================================================
         4. AKILLI FİLTRELEME — filtre sahnesi + sonuç
      =================================================== */
      {
        slug: "akilli-filtreleme",
        name: "Akıllı Filtreleme",
        category: "menu",
        cue: "filter",
        tagline: "Müşteri aradığı ürünü daha hızlı bulur.",
        featureIds: ["filtreler"],
        seo: {
          title: "Akıllı Filtreleme — Alerjen ve Kalori Filtresi",
          description: "Müşteri menüde ürün arar; alerjen hariç tutar, kalori ve fiyat aralığı seçer, ürün özelliğine göre süzer ve sıralar."
        },
        faq: ["qrmo-faq-q-alerjen-gosterimi", "qrmo-faq-q-arama-siralama"],
        order: ["hero", "shift", "stage", "capabilities", "details", "related", "closing"],

        hero: {
          layout: "split",
          h1: "Müşteri aradığını daha hızlı bulur.",
          lead: "Alerjen, kalori, fiyat ve ürün özelliği filtreleri menünün içinde. Müşteri uzun menüyü kendi ihtiyacına göre daraltır.",
          proof: ["14 alerjeni hariç tutma", "Kalori ve fiyat aralığı", "8 sıralama seçeneği"],
          visual: {
            frame: "phone", theme: "light",
            alt: "Temsili arayüz: “Süt / Laktoz hariç” ve “En çok 500 kcal” filtreleri uygulanmış müşteri menüsü; yalnızca uygun ürünler listeleniyor.",
            blocks: [
              { b: "appbar", title: "Menü", sub: "Masa 5" },
              { b: "search", text: "Ürün ara…" },
              { b: "btns", items: ["Filtrele", "Sırala"], solid: 0 },
              { b: "chips", items: ["Süt / Laktoz hariç ×", "En çok 500 kcal ×"], on: [0, 1] },
              { b: "item", n: "Mercimek Çorbası", m: "180 kcal", p: "95 ₺", tag: "Popüler" },
              { b: "item", n: "Izgara Tavuk", m: "420 kcal", p: "260 ₺" },
              { b: "item", n: "Mevsim Salata", m: "160 kcal", p: "120 ₺", tag: "Yeni" }
            ]
          }
        },

        shift: {
          kicker: "MÜŞTERİ İÇİN NE DEĞİŞİR?",
          title: "Menüyü baştan sona okumak yerine daraltır.",
          cols: ["FİLTRE OLMADAN", "AKILLI FİLTRELEME İLE"],
          rows: [
            { now: "Süt alerjisi olan misafir menüyü satır satır okur.", next: "Sütü hariç tutar; yalnızca uygun ürünleri görür." },
            { now: "Bütçesi belli müşteri fiyatları tek tek karşılaştırır.", next: "Fiyat aralığı girer ya da ucuzdan pahalıya sıralar." },
            { now: "Hafif bir şey arayan, kaloriyi garsona sorar.", next: "Kalori aralığı seçer; menü o aralığa iner." }
          ]
        },

        stage: {
          theme: "dark", layout: "wide",
          kicker: "FİLTRE PANELİ",
          title: "Tek panel, dört filtre, bir sonuç.",
          text: "Müşteri “Filtrele” ile paneli açar, seçimini yapar ve “Uygula”ya dokunur. Menü yalnızca uygun ürünleri gösterir.",
          note: "Filtreler sizin girdiğiniz ürün bilgisine dayanır; sistem içerikten alerjen algılamaz.",
          visual: {
            frame: "scene", layout: "flow",
            alt: "Temsili arayüz: solda sıralama, 14 alerjen, kalori ve fiyat aralığı ile ürün özelliklerinin seçildiği filtre paneli; sağda filtre uygulandıktan sonra etiketleriyle daralmış menü.",
            items: [
              { frame: "phone", theme: "light", blocks: [
                { b: "appbar", title: "Filtrele ve Sırala", close: true },
                { b: "chips", label: "Sırala", items: ["Önerilen", "A → Z", "Ucuzdan Pahalıya", "Pahalıdan Ucuza", "En Proteinli", "En Az Karbonhidratlı", "En Acı", "En Az Acı"], on: [0], size: "s" },
                { b: "chips", label: "Alerjenleri hariç tut", hot: 1, size: "s", on: [1],
                  items: ["Glüten", "Süt / Laktoz", "Yumurta", "Fındık / Kuruyemiş", "Yer Fıstığı", "Soya", "Balık", "Kabuklu Deniz Ürünü", "Susam", "Kereviz", "Hardal", "Lüpin", "Kükürt Dioksit/Sülfit", "Yumuşakça"] },
                { b: "range", label: "Kalori (kcal)", from: "En az", to: "500", hot: 2 },
                { b: "range", label: "Fiyat (₺)", from: "En az", to: "En çok" },
                { b: "chips", label: "Ürün özellikleri", items: ["Popüler", "Yeni", "Önerilen", "İndirimli"], on: [], size: "s" },
                { b: "btns", items: ["Sıfırla", "Uygula"], solid: 1, full: true }
              ] },
              { frame: "phone", theme: "light", blocks: [
                { b: "appbar", title: "Menü", sub: "Masa 5" },
                { b: "chips", items: ["Süt / Laktoz hariç ×", "En çok 500 kcal ×"], on: [0, 1], hot: 3 },
                { b: "note", text: "Önerilen sıra" },
                { b: "item", n: "Mercimek Çorbası", m: "180 kcal", p: "95 ₺", tag: "Popüler" },
                { b: "item", n: "Izgara Tavuk", m: "420 kcal", p: "260 ₺" },
                { b: "item", n: "Mevsim Salata", m: "160 kcal", p: "120 ₺", tag: "Yeni" },
                { b: "item", n: "Humus", m: "240 kcal", p: "110 ₺" }
              ] }
            ]
          },
          callouts: [
            { t: "14 alerjen", d: "Seçilen alerjeni içeren ürünler sonuçtan çıkar." },
            { t: "Kalori ve fiyat aralığı", d: "En az ve en çok değer girilir; kampanyalı üründe geçerli fiyata bakılır." },
            { t: "Uygulanan filtreler görünür", d: "Seçimler menüde etiket olarak durur; “Sıfırla” ile temizlenir." }
          ]
        },

        capabilities: {
          kicker: "ARAMA VE SIRALAMA",
          title: "Filtrenin yanında iki kısa yol daha.",
          items: [
            { t: "Ürün arama", d: "Menünün üstündeki kutuyla ürün adına göre arama." },
            { t: "8 sıralama", d: "Önerilen, A–Z, fiyat, protein, karbonhidrat ve acılığa göre." },
            { t: "Diyet etiketleri", d: "Vegan, Vejetaryen ve Glütensiz işaretli ürünlerde etiket ürün detayında görünür." }
          ]
        },

        groups: [
          {
            title: "Filtreler",
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
        related: [
          { slug: "restoran-menu", why: "Filtrelerin dayandığı ürün bilgisi burada girilir." },
          { slug: "coklu-dil", why: "Filtre panelinin metinleri seçilen dile çevrilir." },
          { slug: "qr-analytics", why: "Filtre kullanımı raporda görünür." }
        ]
      },

      /* ===================================================
         5. MENÜ ASİSTANI — büyük sohbet sahnesi + akış
      =================================================== */
      {
        slug: "menu-asistani",
        name: "Menü Asistanı",
        category: "isletme",
        cue: "chat",
        tagline: "Menü sorularını sohbette yanıtlar.",
        featureIds: ["asistan"],
        seo: {
          title: "Menü Asistanı — Menü Sorularını Yanıtlayan Asistan",
          description: "Google Gemini tabanlı Menü Asistanı, menünüzdeki ürünlere dayanarak soruları yanıtlar; garson, hesap ve açık onaylı sipariş akışlarıyla birlikte çalışır."
        },
        faq: ["qrmo-faq-q-menu-asistani-nedir", "qrmo-faq-q-personel-devralma", "qrmo-faq-q-gemini-kullanimi"],
        order: ["hero", "stage", "story", "capabilities", "details", "related", "closing"],

        hero: {
          layout: "split",
          h1: "Menü sorusu için garson beklenmez.",
          lead: "Menü Asistanı, menünüzdeki ürün ve bilgilere dayanarak soruları yanıtlar ve ürün önerir. Bilmediği soruyu size bırakır.",
          proof: ["Menü verinize dayanır", "Cevaplanamayan sorular listede", "Ekibiniz sohbeti devralabilir"],
          visual: {
            frame: "phone", theme: "dark",
            alt: "Temsili arayüz: Menü Asistanı sohbeti; müşteri acı olmayan bir ana yemek soruyor, asistan menüden Izgara Tavuk’u öneriyor. Altta hazır soru kısayolları.",
            blocks: [
              { b: "appbar", title: "Menü Asistanı", sub: "Çevrimiçi", avatar: true },
              { b: "chat", messages: [
                { from: "bot", text: "Merhaba! Menü hakkında ne öğrenmek istersiniz?" },
                { from: "user", text: "Acı olmayan bir ana yemek önerir misiniz?" },
                { from: "bot", text: "Acılık seviyesi “Acısız” girilmiş ürünlerden Izgara Tavuk’u önerebilirim.", card: { n: "Izgara Tavuk", m: "Ana Yemek · Acısız", p: "260 ₺" } }
              ] },
              { b: "quick", items: ["İçinde ne var?", "Tatlı önerisi", "Garson çağır"] },
              { b: "input", text: "Mesajınızı yazın…" }
            ]
          }
        },

        stage: {
          theme: "dark", layout: "split",
          kicker: "İKİ TARAF",
          title: "Bilmediğini söyler, soruyu size bırakır.",
          text: "Asistan yanıtlarını menünüzdeki ürün, fiyat ve açıklamalara dayandırır. Menüde karşılığı olmayan soruda bilmediğini söyler; soru listenize düşer, gerekirse ekibiniz sohbeti devralır.",
          visual: {
            frame: "scene", layout: "duo",
            alt: "Temsili arayüz: müşteri sohbetinde menüde bilgisi olmayan bir soruya asistanın “bu bilgi menüde girilmemiş” yanıtı ve garson talebi; yanında işletme panelinde Cevaplanamayan Sorular listesi ve Canlı Sohbet sekmesi.",
            items: [
              { frame: "window", theme: "dark", title: "Menü Asistanı › Yönetim", blocks: [
                { b: "tabs", items: ["Cevaplanamayan", "Canlı Sohbet", "Geçmiş"], on: 0 },
                { b: "list", hot: 1, items: [
                  { t: "Bu çorbada süt var mı?", s: "Masa 7 · bugün" },
                  { t: "Glütensiz ekmek var mı?", s: "Masa 3 · bugün" },
                  { t: "Tatlılar ev yapımı mı?", s: "Masa 11 · dün" }
                ] },
                { b: "btns", items: ["Menü bilgisini tamamla", "Sohbeti devral"], solid: 1, hot: 3 }
              ] },
              { frame: "phone", theme: "dark", blocks: [
                { b: "appbar", title: "Menü Asistanı", sub: "Masa 7", avatar: true },
                { b: "chat", messages: [
                  { from: "user", text: "Bu çorbada süt var mı?" },
                  { from: "bot", text: "Bu bilgi menüde girilmemiş. Garsonumuza danışabilirsiniz." },
                  { from: "user", text: "Garson çağırır mısınız?" },
                  { from: "bot", text: "Garson talebiniz iletildi.", hot: 2 }
                ] },
                { b: "input", text: "Mesajınızı yazın…" }
              ] }
            ]
          },
          callouts: [
            { t: "Cevaplanamayan sorular", d: "Menüde karşılığı olmayan soru listeye düşer; eksik bilgiyi menüye eklersiniz." },
            { t: "Servis talebi", d: "Sohbetten garson çağrısı ya da hesap isteği Servis Paneli’ne iletilebilir." },
            { t: "Ekip devralır", d: "İnsan desteği gereken görüşmeyi canlı sohbetten devralırsınız." }
          ]
        },

        story: {
          type: "pipeline",
          kicker: "AKIŞ",
          title: "Sorudan sepete.",
          nodes: [
            { t: "Soru", d: "Müşteri yazar ya da hazır bir soruya dokunur." },
            { t: "Menü verisi", d: "Asistan ürün, fiyat ve açıklamalarınıza bakar." },
            { t: "Öneri", d: "Menüdeki bir ürünü önerir; tükenen ürün için sipariş oluşturmaz." },
            { t: "Sepet", d: "Sipariş ürün, adet ve toplam özetiyle, müşterinin açık onayıyla ilerler." }
          ],
          note: "Garson, hesap ve sipariş akışları Pro paketindeki servis özellikleriyle birlikte çalışır."
        },

        capabilities: {
          kicker: "KONTROL",
          title: "Sınırları siz çizersiniz.",
          items: [
            { t: "Profil ve görünüm", d: "Ad, karşılama mesajı, simge, renkler ve müşterinin tek dokunuşla soracağı hazır sorular." },
            { t: "Görünürlük", d: "Hangi müşterilere, hangi cihazlarda ve hangi saatlerde gösterileceğini belirlersiniz." },
            { t: "Mesaj sınırı", d: "Oturum başına mesaj sayısını sınırlar (varsayılan 25), yanıtlanmayacak kelimeleri tanımlarsınız." }
          ]
        },

        groups: [
          {
            title: "Nasıl yanıt verir?",
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
        related: [
          { slug: "servis-paneli", why: "Sohbetten gelen garson ve hesap talepleri burada toplanır." },
          { slug: "restoran-menu", why: "Asistanın dayandığı menü bilgisi burada girilir." },
          { slug: "qr-analytics", why: "Sohbet mesajları etkileşim raporunda sayılır." }
        ]
      },

      /* ===================================================
         6. SERVİS PANELİ — önce akış, sonra panel
      =================================================== */
      {
        slug: "servis-paneli",
        name: "Servis Paneli",
        category: "servis",
        cue: "kanban",
        tagline: "Masadan gelen talepler tek ekranda.",
        featureIds: ["servis-paneli", "garson-cagir", "hesap-iste", "qr-siparis", "personel-rolu"],
        seo: {
          title: "Servis Paneli — Garson, Hesap ve Sipariş Takibi",
          description: "Garson çağrısı, hesap isteği ve siparişler tek panelde toplanır. Ekibiniz kayıtları Bekliyor’dan Tamamlandı’ya taşır; sesli uyarı ve bildirim desteklenir."
        },
        faq: ["qrmo-faq-q-garson-cagir", "qrmo-faq-q-siparis-servis-paneli", "qrmo-faq-q-online-odeme"],
        order: ["hero", "story", "stage", "proof", "details", "related", "closing"],

        hero: {
          layout: "split",
          h1: "Masadan gelen her talep tek akışta.",
          lead: "Garson çağrısı, hesap isteği ve sipariş masa adıyla servis paneline düşer. Ekibiniz her kaydı Bekliyor’dan Tamamlandı’ya taşır.",
          proof: ["Sesli uyarı ve tarayıcı bildirimi", "Bekleyen kart önce sarıya, sonra kırmızıya döner", "Personel için ayrı servis rolü"],
          visual: {
            frame: "scene", layout: "duo",
            alt: "Temsili arayüz: müşteri telefonunda Siparişi Gönder, Garson Çağır ve Hesap İste düğmeleri; yanında Servis Paneli’nde Bekliyor, Hazırlanıyor ve Serviste sütunlarında masa kartları.",
            items: [
              { frame: "window", theme: "dark", title: "Servis Paneli", blocks: [
                { b: "kanban", cols: [
                  { n: "Bekliyor", cards: [{ k: "Garson", t: "Masa 4", a: "8 dk", s: "late" }, { k: "Hesap", t: "Masa 9", a: "4 dk", s: "warn" }, { k: "Sipariş", t: "Masa 12", a: "şimdi", s: "new" }] },
                  { n: "Hazırlanıyor", cards: [{ k: "Sipariş", t: "Masa 2", a: "2 dk" }] },
                  { n: "Serviste", cards: [{ k: "Sipariş", t: "Masa 7", a: "1 dk" }] }
                ] }
              ] },
              { frame: "phone", theme: "dark", blocks: [
                { b: "appbar", title: "QR Menü", sub: "Masa 12" },
                { b: "item", n: "Mercimek Çorbası", m: "Sepette · 2 adet", p: "190 ₺" },
                { b: "actions", items: [{ t: "Siparişi Gönder", on: true }, { t: "Garson Çağır" }, { t: "Hesap İste" }] }
              ] }
            ]
          }
        },

        story: {
          type: "pipeline",
          kicker: "SERVİS AKIŞI",
          title: "Müşteriden masaya, tek akış.",
          nodes: [
            { t: "Müşteri", d: "Sipariş verir, garson çağırır ya da hesap ister." },
            { t: "Bekliyor", d: "Kayıt masa adı ve tipiyle panele düşer; sesli uyarı verilebilir." },
            { t: "Hazırlanıyor", d: "Ekip kartı, üzerindeki düğmeyle bir sonraki duruma taşır." },
            { t: "Serviste", d: "Sipariş masaya çıkar." },
            { t: "Tamamlandı", d: "Kayıt kapanır; iptal edilenler İptal sütununa alınır." }
          ]
        },

        stage: {
          theme: "dark", layout: "wide",
          kicker: "PANEL",
          title: "Kim neyle ilgileniyor, tek ekranda.",
          text: "Kartlar tipe ve masaya göre süzülür. Tamamlanmamış kart, belirlediğiniz süreyi aşınca rengini değiştirir; gözden kaçan talep görünür hale gelir.",
          visual: {
            frame: "window", theme: "dark", title: "Servis Paneli",
            alt: "Temsili arayüz: Servis Paneli; üstte Tümü, Sipariş, Garson ve Hesap filtreleri ile ses ve bildirim düğmeleri; altta Bekliyor, Hazırlanıyor, Serviste ve Tamamlandı sütunlarında masa kartları, bekleyen kartlar sarı ve kırmızı.",
            blocks: [
              { b: "toolbar", chips: ["Tümü", "Sipariş", "Garson", "Hesap"], on: 0, hot: 1, toggles: [{ l: "Ses", on: true }, { l: "Bildirim", on: true }], hotT: 3 },
              { b: "kanban", cols: [
                { n: "Bekliyor", cards: [{ k: "Garson", t: "Masa 4", a: "8 dk", s: "late", hot: 2 }, { k: "Hesap", t: "Masa 9", a: "4 dk", s: "warn" }, { k: "Sipariş", t: "Masa 12", a: "şimdi", s: "new", m: "2 × Mercimek Çorbası" }] },
                { n: "Hazırlanıyor", cards: [{ k: "Sipariş", t: "Masa 2", a: "2 dk", m: "1 × Izgara Tavuk" }] },
                { n: "Serviste", cards: [{ k: "Sipariş", t: "Masa 7", a: "1 dk", m: "3 × Çay" }] },
                { n: "Tamamlandı", cards: [{ k: "Hesap", t: "Masa 3", a: "12 dk", s: "done" }, { k: "Garson", t: "Masa 5", a: "20 dk", s: "done" }] }
              ] }
            ]
          },
          callouts: [
            { t: "Tipe ve masaya göre süzme", d: "Sipariş, garson ve hesap kayıtları aynı panelde; istediğinizi ayırırsınız." },
            { t: "Bekleme renkleri", d: "Kart varsayılan olarak 3 dakikada sarıya, 7 dakikada kırmızıya döner." },
            { t: "Ses ve bildirim", d: "Yeni kayıtta sesli uyarı; tarayıcı izni verilirse bildirim." }
          ]
        },

        proof: {
          kicker: "AYARLAR",
          title: "Panel sizin servis temponuza uyar.",
          text: "Dar ekranda sütunlar sekmeye dönüşür. Servis rolüyle giren garson ve mutfak personeli panelden başka ekran görmez; menüyü ve ayarları göremez.",
          facts: [
            { v: "5 sn", l: "varsayılan yenileme; 3–60 saniye arası ayarlanır" },
            { v: "3 / 7 dk", l: "varsayılan sarı ve kırmızı uyarı eşiği" },
            { v: "2 saat", l: "tamamlananların panelde kaldığı varsayılan süre" }
          ],
          note: "Ödeme altyapısı yoktur. “Hesap iste”, hesabın masaya getirilmesi talebidir."
        },

        groups: [
          {
            title: "Panel",
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
        related: [
          { slug: "qr-masa", why: "Çağrıların masa bilgisi buradan gelir." },
          { slug: "masa-oturum-guvenligi", why: "Çağrı ve sipariş, doğrulanmış masa oturumuyla çalışır." },
          { slug: "menu-asistani", why: "Sohbetten de garson ve hesap talebi doğabilir." }
        ]
      },

      /* ===================================================
         7. QR ANALYTICS — önce panel, sonra veri hikâyesi
      =================================================== */
      {
        slug: "qr-analytics",
        name: "QR Analytics",
        category: "isletme",
        cue: "chart",
        tagline: "Menünüzün nasıl kullanıldığını görün.",
        featureIds: ["analytics"],
        seo: {
          title: "QR Analytics — Menü, Ürün ve Masa Raporları",
          description: "Menü görüntüleme, tekil ziyaretçi, ürün tıklaması, masa hareketi ve sepet verilerini Bugün, Son 7 gün, Bu ay ya da özel aralıkla raporlayın."
        },
        faq: ["qrmo-faq-q-analytics-nedir", "qrmo-faq-q-pos-verisi-mi", "qrmo-faq-q-analytics-siparis"],
        order: ["hero", "story", "stage", "details", "related", "closing"],

        hero: {
          layout: "center",
          h1: "Menünüzün nasıl kullanıldığını görün.",
          lead: "Menü görüntüleme, ürün tıklaması, masa hareketi ve sepet verisi tek raporda. Kasa satışı değil; QR menünüzdeki kullanım verisi.",
          proof: ["Bugün, son 7 gün, bu ay ya da özel aralık", "Masaya göre hareket", "CSV olarak indirme"],
          visual: {
            frame: "window", theme: "dark", title: "İstatistikler › Genel Bakış", badge: "Örnek veri",
            alt: "Temsili arayüz, örnek veri: İstatistikler genel bakış ekranı; Son 7 gün seçili, menü görüntüleme, ürün tıklama, tekil ziyaretçi ve aktif masa göstergeleri, saatlik hareket grafiği ve en çok tıklanan ürünler listesi.",
            blocks: [
              { b: "tabs", items: ["Bugün", "Son 7 gün", "Bu ay", "Özel"], on: 1 },
              { b: "kpis", items: [
                { l: "Menü görüntüleme", v: "1.284", d: "+6%" },
                { l: "Ürün tıklama", v: "412", d: "+4%" },
                { l: "Tekil ziyaretçi", v: "356", d: "+3%" },
                { l: "Aktif masa", v: "14", d: "" }
              ] },
              { b: "cols", split: "wide", cols: [
                [{ b: "chart", title: "Zaman içindeki hareket", legend: ["Menü görüntüleme", "Ürün tıklama"], bars: [2, 3, 2, 1, 1, 2, 5, 9, 12, 10, 14, 22, 30, 26, 15, 11, 12, 18, 26, 31, 27, 19, 10, 5], bars2: [1, 1, 1, 0, 0, 1, 2, 4, 5, 4, 6, 9, 13, 11, 6, 5, 5, 8, 11, 13, 12, 8, 4, 2], labels: ["00:00", "06:00", "12:00", "18:00"] }],
                [{ b: "rank", title: "En çok ilgi görenler", rows: [{ l: "Izgara Tavuk", s: "Ana Yemek", v: "71", w: 100 }, { l: "Serpme Kahvaltı", s: "Kahvaltı", v: "52", w: 73 }, { l: "Filtre Kahve", s: "İçecek", v: "44", w: 62 }, { l: "Künefe", s: "Tatlı", v: "31", w: 44 }] }]
              ] }
            ]
          }
        },

        story: {
          type: "pairs",
          kicker: "VERİ HİKÂYESİ",
          title: "Dört soru, dört rapor.",
          text: "Bu bir geçmiş kullanım raporudur; tahmin ya da yapay zekâ analizi içermez. Veri, müşterinin QR menüde yaptığı hareketlerden gelir.",
          cols: ["SORU", "RAPOR"],
          rows: [
            { k: "Ürünler", a: "Hangi ürünlere bakılıyor, hangisi hiç açılmıyor?", b: "En çok ve en az tıklanan ürünler, kategori dağılımı, ürün detayının açılma oranı ve filtre kullanımı." },
            { k: "Masalar", a: "Hangi masanın QR’ı hiç okutulmadı?", b: "Masa ve grup bazında hareket; hiç okutulmayan masalar ve masasız erişim ayrı görünür." },
            { k: "Sepet & Sipariş", a: "Sepete konan ürün neden gönderilmedi?", b: "Eklenen, gönderilen ve terk edilen sepetler huni olarak; tükendi yüzünden engellenen siparişler ayrı." },
            { k: "Etkileşim", a: "Müşteri menüde başka neler yapıyor?", b: "Asistan mesajları, yorum ve form gönderimleri, dil seçimi dağılımı." }
          ]
        },

        stage: {
          theme: "light", layout: "split",
          kicker: "MASALAR VE SEPET",
          title: "Salonun hangi köşesi menüyü kullanıyor?",
          text: "Hareket kaydetmeyen masalar listede ayrı görünür. Sepet hunisi, sipariş özelliği açıkken eklenen, gönderilen ve terk edilen sepetleri gösterir.",
          visual: {
            frame: "scene", layout: "stack",
            alt: "Temsili arayüz, örnek veri: masalara göre hareket tablosunda VIP Salon’un hiç okutulmadığı görülüyor; yanında sepete eklenen, gönderilen ve terk edilen siparişleri gösteren sepet hunisi.",
            items: [
              { frame: "window", theme: "light", title: "İstatistikler › Masalar", badge: "Örnek veri", blocks: [
                { b: "table", cols: ["Masa", "Grup", "Hareket"], rows: [["Masa 4", "Salon", "38"], ["bahce-2", "Bahçe", "12"], ["VIP Salon", "VIP", "Hiç okutulmadı"], ["Doğrudan erişim", "Masasız", "21"]], hl: 2, hot: 1 },
                { b: "btns", items: ["CSV indir"], solid: -1, hot: 3 }
              ] },
              { frame: "window", theme: "light", title: "İstatistikler › Sepet & Sipariş", badge: "Örnek veri", blocks: [
                { b: "funnel", hot: 2, rows: [{ l: "Sepete eklenen", v: "100", w: 100 }, { l: "Gönderilen", v: "64", w: 64 }, { l: "Terk edilen", v: "36", w: 36 }] }
              ] }
            ]
          },
          callouts: [
            { t: "Hiç okutulmayan masa", d: "Hareket kaydetmeyen masalar ve masasız erişim listede ayrı görünür." },
            { t: "Sepet hunisi", d: "Sipariş özelliği (Pro) kullanılıyorsa dolar; tükendi yüzünden engellenen siparişler ayrıca raporlanır." },
            { t: "CSV", d: "Rapor sayfalarını CSV olarak indirirsiniz." }
          ]
        },

        groups: [
          {
            title: "Menü ve ürün",
            items: [
              { t: "Genel bakış", d: "Menü görüntüleme, ürün tıklama, tekil ziyaretçi ve aktif masa sayısı gösterilir; günlük, haftalık, aylık ve saatlik grafikle izlenir. Aktif masa sayısı, seçili tarih aralığında en az bir hareket kaydeden masaların sayısıdır (şu anki anlık durum değildir). Göstergeler önceki eşit uzunluktaki dönemle karşılaştırılır.", src: "genel-sayfasi.php, analitik-genel.js (cardTables: seçili aralıkta en az bir hareket olan masa sayısı; değişim rozeti)" },
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
          "Bu bir geçmiş kullanım raporudur; tahmin veya yapay zekâ analizi içermez. Kasa (POS) verisi değildir.",
          "Sepet ve sipariş verisi, sipariş özelliklerinin (Pro) kullanılmasına; etkileşim verisi ilgili modüllerin açık olmasına bağlıdır. Paketinizde olmayan bir modülün kategorisi raporda kapalı görünür.",
          "Tekil ziyaretçi sayısı IP adresinin özetine göre hesaplanır; aynı ağdan bağlanan farklı kişiler tek sayılabilir.",
          "Özel tarih aralığı en fazla 31 gün olabilir.",
          "Az ziyaret alan bir menüde raporlar da az veri gösterir."
        ],
        related: [
          { slug: "menu-muhendisligi", why: "Satış ve etkileşim verisi maliyetle birleştirilir." },
          { slug: "qr-masa", why: "Masa raporu, masaların tanımına dayanır." },
          { slug: "yorum-geri-bildirim", why: "Yorum ve form gönderimleri etkileşim raporunda sayılır." }
        ]
      },

      /* ===================================================
         8. MASA OTURUM GÜVENLİĞİ — güven anlatısı + kontrollü teknik kanıt
      =================================================== */
      {
        slug: "masa-oturum-guvenligi",
        name: "Masa Oturum Güvenliği",
        category: "servis",
        cue: "shield",
        tagline: "Masa oturumu doğrulanmış ve süreli.",
        featureIds: ["oturum-guvenligi"],
        seo: {
          title: "Masa Oturum Güvenliği — İmzalı Masa Oturumu",
          description: "Müşteri QR’ı okuttuğunda imzalı bir masa oturumu başlar. Oturum süresi, hareketsizlik limiti ve isteğe bağlı sayfa kilidi sizin ayarınızla sınırlanır."
        },
        faq: ["qrmo-faq-q-guvenli-mi", "qrmo-faq-q-oturum-dogrulama"],
        order: ["hero", "shift", "story", "proof", "details", "related", "closing"],

        hero: {
          layout: "split",
          h1: "Masa oturumu kontrollü kalsın.",
          lead: "Müşteri QR’ı okuttuğunda o masaya bağlı, doğrulanmış bir oturum başlar. Çağrı, sipariş ve sohbet bu oturumla çalışır; süresini siz belirlersiniz.",
          proof: ["Yalnızca kayıtlı masalara oturum", "Süre ve hareketsizlik limiti", "Menü herkese açık kalır"],
          visual: {
            frame: "scene", layout: "pair",
            alt: "Temsili arayüz: solda kayıtlı Masa 7’de açılmış oturumla garson ve hesap düğmeleri etkin müşteri menüsü; sağda kayıtlı olmayan bir masa adresinde gösterilen “Oturum Gerekli” ekranı.",
            items: [
              { frame: "phone", theme: "light", label: "Kayıtlı masa", blocks: [
                { b: "appbar", title: "Menü", sub: "Masa 7" },
                { b: "session", t: "Masa 7", s: "Aktif masa" },
                { b: "item", n: "Mercimek Çorbası", m: "180 kcal", p: "95 ₺" },
                { b: "item", n: "Izgara Tavuk", m: "420 kcal", p: "260 ₺" },
                { b: "actions", items: [{ t: "Garson Çağır" }, { t: "Hesap İste" }] }
              ] },
              { frame: "phone", theme: "light", label: "Kayıtsız adres", blocks: [
                { b: "lock", t: "Oturum Gerekli" }
              ] }
            ]
          }
        },

        shift: {
          kicker: "NE DEĞİŞİR?",
          title: "Masa bilgisi adreste değil, oturumda.",
          cols: ["OTURUM OLMADAN", "MASA OTURUMUYLA"],
          rows: [
            { now: "Masa bilgisi yalnızca adreste durur; elle değiştirilebilir.", next: "Masa bilgisi imzalı oturumda tutulur; müşteri tarafında değiştirilemez." },
            { now: "Listede olmayan bir masa adıyla talep gelebilir.", next: "Kayıtlı olmayan masa adresinde “Oturum Gerekli” ekranı açılır." },
            { now: "Bir oturumun ne zaman biteceği belli değildir.", next: "Oturum toplam süre ve hareketsizlik limitiyle kapanır." }
          ]
        },

        story: {
          type: "timeline",
          kicker: "OTURUMUN ÖMRÜ",
          title: "Okutmadan kapanışa.",
          steps: [
            { t: "Müşteri QR’ı okutur", d: "Adres masa bilgisini taşır: /?masa=masa-31." },
            { t: "Masa doğrulanır", d: "Masa kayıtlıysa imzalı oturum çerezi verilir." },
            { t: "Özellikler açılır", d: "Garson çağırma, sipariş ve sohbet bu oturumla çalışır." },
            { t: "Süre dolar", d: "Maksimum süre veya hareketsizlik limiti aşılınca oturum kapanır." }
          ],
          visual: {
            frame: "window", theme: "light", title: "Masa 7 · oturum",
            alt: "Temsili çizim: varsayılan 90 dakikalık oturum süresini ve 30 dakikalık hareketsizlik limitini gösteren zaman çubuğu.",
            blocks: [
              { b: "sessionbar", total: "90 dk", idle: "30 dk", now: 38 },
              { b: "fields", items: [{ l: "En uzun oturum", v: "90 dk" }, { l: "Hareketsizlik limiti", v: "30 dk" }] },
              { b: "note", text: "Sayfa gezinmesi de hareketsizlik sayacını yeniler." }
            ]
          }
        },

        proof: {
          kicker: "TEKNİK AYRINTILAR",
          title: "Mekanizma, abartısız.",
          text: "Masa adı, veriliş zamanı ve son işlem zamanı HMAC-SHA256 ile imzalanan bir çerezde tutulur. Bu mutlak bir güvenlik vaadi değildir: masayı QR’ı okutan kişiye bağlar ve oturumu süreyle sınırlar.",
          visual: {
            frame: "window", theme: "light", title: "Masa Oturum Güvenliği › Oturum Limitleri",
            alt: "Temsili arayüz: Oturum Limitleri ekranı; maksimum oturum süresi 90 dakika, hareketsizlik limiti 30 dakika, oturum başına chatbot mesajı 25, korunacak sayfa alanı boş.",
            blocks: [
              { b: "fields", items: [{ l: "Maksimum oturum süresi (dk)", v: "90" }, { l: "Hareketsizlik limiti (dk)", v: "30" }, { l: "Oturum başına chatbot mesajı", v: "25" }, { l: "Korunacak sayfalar", v: "boş: kilit kapalı" }] },
              { b: "btns", items: ["Kaydet"], solid: 0 }
            ]
          },
          facts: [
            { v: "90 dk", l: "varsayılan en uzun oturum" },
            { v: "30 dk", l: "varsayılan hareketsizlik limiti" },
            { v: "25", l: "oturum başına varsayılan asistan mesajı" }
          ],
          note: "Sayfa kilidi isteğe bağlıdır; ana sayfa hiçbir koşulda kilitlenmez."
        },

        groups: [
          {
            title: "Oturum",
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
        related: [
          { slug: "qr-masa", why: "Doğrulanan masalar burada tanımlanır." },
          { slug: "servis-paneli", why: "Doğrulanmış masa adıyla gelen çağrılar." },
          { slug: "menu-asistani", why: "Sohbet oturuma bağlıdır ve mesaj limitiyle sınırlanır." }
        ]
      },

      /* ===================================================
         9. YORUM & GERİ BİLDİRİM — geri bildirim yolculuğu + puanlama
      =================================================== */
      {
        slug: "yorum-geri-bildirim",
        name: "Yorum & Geri Bildirim",
        category: "isletme",
        cue: "stars",
        tagline: "Müşterinin görüşü size ulaşsın.",
        featureIds: ["geri-bildirim"],
        seo: {
          title: "Yorum & Geri Bildirim — Puanlama ve Form Modülü",
          description: "Çoklu kriterli puanlama formu, iletişim formu ve kendi geri bildirim formlarınız. Gelen yorumları siz yayınlar, yayından kaldırır ya da silersiniz."
        },
        faq: [],
        order: ["hero", "story", "stage", "capabilities", "details", "related", "closing"],

        hero: {
          layout: "split",
          h1: "Müşterinin deneyimini sistemli öğrenin.",
          lead: "Müşteri lezzeti, hizmet hızını ve diğer kriterleri menünün içinden puanlar; yorum panelinize düşer. Hangisinin yayında görüneceğine siz karar verirsiniz.",
          proof: ["Beş kriter, adlarını siz belirlersiniz", "Kendi geri bildirim formlarınız", "Kriter, masa ve saate göre rapor"],
          visual: {
            frame: "phone", theme: "light",
            alt: "Temsili arayüz: beş kriterli değerlendirme formu; Yemek Lezzeti, Hizmet Hızı, Temizlik, Atmosfer ve Fiyat / Performans yıldızla puanlanıyor, altında yorum alanı ve Gönder düğmesi.",
            blocks: [
              { b: "appbar", title: "Değerlendirme", sub: "Masa 12" },
              { b: "stars", items: [{ l: "Yemek Lezzeti", n: 5 }, { l: "Hizmet Hızı", n: 3 }, { l: "Temizlik", n: 5 }, { l: "Atmosfer", n: 4 }, { l: "Fiyat / Performans", n: 4 }] },
              { b: "textarea", text: "Çorba çok iyiydi, servis biraz yavaştı." },
              { b: "btns", items: ["Gönder"], solid: 0, full: true }
            ]
          }
        },

        story: {
          type: "pipeline",
          kicker: "GERİ BİLDİRİM YOLCULUĞU",
          title: "Masadan panele, panelden karara.",
          nodes: [
            { t: "Puanlar", d: "Müşteri kriterleri puanlar, yorum yazar; ayar açıksa görsel ekler." },
            { t: "Panele düşer", d: "Yorum puanına göre Olumlu ya da Olumsuz sekmesinde görünür." },
            { t: "Siz karar verirsiniz", d: "Yayınlar, yayından kaldırır ya da silersiniz." },
            { t: "Raporda izlersiniz", d: "Kriter ortalamaları, masaya ve saat dilimine göre dağılım." }
          ]
        },

        stage: {
          theme: "light", layout: "split",
          kicker: "YÖNETİM",
          title: "Yorumlar tek listede, sorun kriter kriter.",
          text: "Olumsuz yorumlar ayrı sekmede toplanır. Hangi kriterde, hangi masada, hangi saatte sorun yaşandığını raporda görürsünüz.",
          visual: {
            frame: "scene", layout: "stack",
            alt: "Temsili arayüz, örnek veri: Tüm Yorumlar ekranında Olumsuz sekmesi seçili, bekleyen bir yorum için Yayınla ve Sil düğmeleri; yanında beş kriterin puan ortalamalarını gösteren rapor.",
            items: [
              { frame: "window", theme: "light", title: "Yorum & Geri Bildirim › Tüm Yorumlar", blocks: [
                { b: "tabs", items: ["Tümü", "Olumlu", "Olumsuz"], on: 2, hot: 1 },
                { b: "reviews", hot: 2, rows: [
                  { n: "“Servis çok yavaştı.”", s: "Masa 4 · 2,4 puan", st: "Bekliyor", a: ["Yayınla", "Sil"] },
                  { n: "“Masa temiz değildi.”", s: "Masa 9 · 2,8 puan", st: "Yayında", a: ["Yayından kaldır"] }
                ] }
              ] },
              { frame: "window", theme: "light", title: "Yorum & Geri Bildirim › Raporlar", badge: "Örnek veri", blocks: [
                { b: "rank", title: "Kriter ortalamaları", hot: 3, rows: [
                  { l: "Yemek Lezzeti", v: "4,6", w: 92 }, { l: "Hizmet Hızı", v: "3,4", w: 68 }, { l: "Temizlik", v: "4,5", w: 90 }, { l: "Atmosfer", v: "4,2", w: 84 }, { l: "Fiyat / Performans", v: "3,9", w: 78 }
                ] }
              ] }
            ]
          },
          callouts: [
            { t: "Olumlu ve olumsuz", d: "Yorumlar puana göre iki sekmeye ayrılır; eşik varsayılan olarak 3,0." },
            { t: "Yayın kararı sizde", d: "Yayınlar, yayından kaldırır ya da silersiniz; yayındakiler kısa kodla sayfanızda listelenebilir." },
            { t: "Kriter raporu", d: "Kriter ortalamaları, masaya göre dağılım, saat dilimine göre yorum sayısı." }
          ]
        },

        capabilities: {
          kicker: "FORMLAR",
          title: "Sormak istediğinizi siz sorun.",
          items: [
            { t: "Form oluşturucu", d: "Metin, e-posta, telefon, sayı, puan, tarih, seçim ve onay kutusu alanlarıyla kendi formlarınızı kurarsınız." },
            { t: "İletişim formu", d: "Kısa kodla sayfanıza eklenir; gönderimler panelde listelenir." },
            { t: "Kişisel veri araçları", d: "Onay metni, aydınlatma sayfası bağlantısı, dışa aktarma ve silme araçları." }
          ]
        },

        groups: [
          {
            title: "Yorum formu",
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
        related: [
          { slug: "qr-analytics", why: "Yorum ve form gönderimleri etkileşim raporunda sayılır." },
          { slug: "menu-muhendisligi", why: "Menüyü veriyle iyileştirmek için maliyet ve satış tarafı." },
          { slug: "qr-masa", why: "Yorumlar masa bilgisiyle ilişkilendirilebilir." }
        ]
      },

      /* ===================================================
         10. MENÜ MÜHENDİSLİĞİ — önce matris, sonra karar
      =================================================== */
      {
        slug: "menu-muhendisligi",
        name: "Menü Mühendisliği",
        category: "isletme",
        cue: "matrix",
        tagline: "Menünün performansını popülerlik ve kârlılıkla görün.",
        featureIds: ["menu-muhendisligi", "maliyet-recete"],
        seo: {
          title: "Menü Mühendisliği — Maliyet ve Menü Matrisi",
          description: "Ürün maliyetlerinizi ve reçetelerinizi girin; satış verisiyle birleştirilerek her ürün Yıldız, Çok Satan, Gizli Fırsat ya da Zayıf Performans grubuna yerleşir."
        },
        faq: ["qrmo-faq-q-menu-muhendisligi-nedir", "qrmo-faq-q-maliyet-gerekli-mi"],
        order: ["hero", "story", "stage", "capabilities", "details", "related", "closing"],

        hero: {
          layout: "center",
          h1: "Hangi ürün gerçekten kazandırıyor?",
          lead: "Ürün maliyetlerinizi girin; satış verisiyle birleşsin. Her ürün popülerlik ve kârlılığa göre dört gruptan birine yerleşir, yanında bir aksiyon cümlesi yazar.",
          proof: ["Kasavana–Smith matrisi", "Reçeteden maliyet hesabı", "Maliyeti girilmeyen ürün matrise alınmaz"],
          visual: {
            frame: "window", theme: "dark", title: "Menü Mühendisliği › Menü Performansı", badge: "Örnek veri",
            alt: "Temsili arayüz, örnek veri: popülerlik ve kârlılık eksenli dört gruplu menü matrisi; Yıldız, Çok Satan, Gizli Fırsat ve Zayıf Performans gruplarında ürünler; seçili Künefe için Gizli Fırsat grubu ve görünürlüğü artırma önerisi.",
            blocks: [
              { b: "cols", split: "wide", cols: [
                [{ b: "matrix", x: "Popülerlik", y: "Kârlılık", quads: [
                  { n: "Gizli Fırsat", d: "Kârlı ama az satıyor", dots: [{ l: "Künefe", on: true }] },
                  { n: "Yıldız", d: "Çok satıyor, çok kazandırıyor", dots: [{ l: "Izgara Tavuk" }, { l: "Serpme Kahvaltı" }] },
                  { n: "Zayıf Performans", d: "Ne satıyor ne kazandırıyor", dots: [{ l: "Örnek Ürün" }] },
                  { n: "Çok Satan", d: "Çok satıyor, az kazandırıyor", dots: [{ l: "Mercimek Çorbası" }, { l: "Filtre Kahve" }] }
                ] }],
                [{ b: "insight", k: "Seçili ürün", n: "Künefe", g: "Gizli Fırsat", d: "Kârlı ama yeterince satmıyor.", a: "Görünürlüğünü artırmayı değerlendirin." }]
              ] }
            ]
          }
        },

        story: {
          type: "pairs",
          kicker: "KARAR",
          title: "En çok satan, en çok kazandıran olmayabilir.",
          text: "Matris ürünü hem satış payına hem birim katkı payına (fiyat − maliyet) göre değerlendirir. Her grup farklı bir karar ister.",
          cols: ["NE ANLATIR", "ÖRNEK YÖNLENDİRME"],
          rows: [
            { k: "Yıldız", a: "Çok satıyor, çok kazandırıyor.", b: "Menünün en güçlü ürünleri; hangilerinin bu grupta olduğunu net görürsünüz." },
            { k: "Çok Satan", a: "Çok satıyor ama az kazandırıyor.", b: "Maliyeti düşürmek ya da küçük bir zam denemek." },
            { k: "Gizli Fırsat", a: "Kârlı ama az satıyor.", b: "Menüde görünürlüğünü artırmak." },
            { k: "Zayıf Performans", a: "Ne satıyor ne kazandırıyor.", b: "Rapor bu ürünler için de bir yönlendirme cümlesi yazar; karar sizindir." }
          ],
          note: "Aksiyon cümleleri genel yönlendirmedir; sonuç garantisi vermez."
        },

        stage: {
          theme: "light", layout: "split",
          kicker: "MALİYET VE REÇETE",
          title: "Maliyet reçeteden hesaplanır.",
          text: "Malzemelerin birim fiyatını bir kez girersiniz; reçetesi olan ürünün maliyeti bu fiyatlardan hesaplanır. İsterseniz maliyeti doğrudan da yazabilirsiniz.",
          visual: {
            frame: "window", theme: "light", title: "Menü Mühendisliği › Reçete", badge: "Örnek hesap",
            alt: "Temsili arayüz, örnek hesap: Mercimek Çorbası reçetesi; kırmızı mercimek 80 gram, soğan 30 gram, tereyağı 10 gram ve birim fiyatları; yüzde 5 fire ile birim maliyet 9,87 TL.",
            blocks: [
              { b: "head", title: "Mercimek Çorbası", badge: "Reçeteden" },
              { b: "table", cols: ["Malzeme", "Miktar", "Birim fiyat"], hot: 1, rows: [["Kırmızı mercimek", "80 g", "60 ₺/kg"], ["Soğan", "30 g", "20 ₺/kg"], ["Tereyağı", "10 g", "400 ₺/kg"]] },
              { b: "fields", items: [{ l: "Fire yüzdesi", v: "%5" }], hot: 2 },
              { b: "total", hot: 3, rows: [{ l: "Malzeme toplamı", v: "9,40 ₺" }, { l: "Fire (%5)", v: "0,47 ₺" }], strong: { l: "Birim maliyet", v: "9,87 ₺" } }
            ]
          },
          callouts: [
            { t: "Birimler", d: "Birim fiyat kg, litre ya da adet üzerinden; reçetede gram, ml ya da adet yazılır." },
            { t: "Fire", d: "Reçete maliyetine %0–50 arası fire eklenir." },
            { t: "Güncel maliyet", d: "Malzeme fiyatı değişince reçeteli ürünlerin maliyeti yeniden hesaplanır." }
          ]
        },

        capabilities: {
          kicker: "RAPOR",
          title: "Rapor, eksikleriyle birlikte.",
          items: [
            { t: "Dönem ve kategori", d: "Raporu döneme ve kategoriye göre süzer, ürün ayrıntısına iner, CSV olarak indirirsiniz." },
            { t: "Eksik maliyet listesi", d: "Fiyatı ya da maliyeti girilmemiş ürünler ayrı listelenir; oradan tamamlarsınız." },
            { t: "Az satışta açık uyarı", d: "Toplam satış 20 adedin altındaysa popülerlik görüntülenme ve sepet verisiyle tahmin edilir; rapor bunu ekranda belirtir." }
          ]
        },

        groups: [
          {
            title: "Maliyet girişi",
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
        related: [
          { slug: "qr-analytics", why: "Satış ve etkileşim verisi bu raporlardan gelir." },
          { slug: "restoran-menu", why: "Ürün, fiyat ve malzeme bilgisi burada tutulur." },
          { slug: "yorum-geri-bildirim", why: "Müşteri görüşünü menü kararlarına ekleyin." }
        ]
      }
    ]
  };
});
