/* =========================================================
   QR MENU OFFICIAL — /paketler/ VERİ DOSYASI
   Sayfadaki tüm paket içeriği YALNIZCA burada tanımlanır.
   HTML/CSS/JS'e dokunmadan şunları değiştirebilirsiniz:

   - Fiyatlar            → packages[].price
   - Paket metinleri     → packages[]
   - Özellik ekle/çıkar  → features[]   (bir satır = bir özellik)
   - Özelliğin paketi    → features[].from  ("temel" | "pro" | "plus")
                           Bir özellik, `from` paketinden itibaren tüm
                           üst paketlerde otomatik "dahil" sayılır.
   - Tek pakete özel     → features[].values  (opsiyonel)
     istisna / metin        örn. values: { temel: "Sınırlı" }  → o hücrede metin gösterilir
                                 values: { pro: false }        → o pakette dahil değil
   - CTA hedefi          → cta.href
   - Modül sayfası       → features[].page  (moduller/module-data.js içindeki slug;
                           boşsa özellik adı link olmaz)
   ========================================================= */

window.QRMO_PRICING = {

  currency: "TL",

  /* Yıllık model: usedMonths ay kullan, payMonths ay öde (12 → 10). */
  annual: { usedMonths: 12, payMonths: 10 },

  defaultPeriod: "monthly", // "monthly" | "annual"

  /* -------------------------------------------------------
     CTA HEDEFİ — TBD
     href BOŞ olduğu sürece CTA'lar link değil, pasif <button> olarak
     üretilir (sahte href yok). Hedef netleşince yalnızca href'i doldurun:
       "{id}" → paket kimliği (temel | pro | plus) ile değiştirilir.
       örn: "https://qrmenuofficial.com/iletisim/?paket={id}"
     ------------------------------------------------------- */
  cta: {
    href: "",
    finalHref: "",               // boşsa href kullanılır; o da boşsa pasif <button>
    finalLabel: "Paket seçimi için görüşün"
  },

  /* Modül sayfalarının kök yolu (bu sayfaya göre). */
  modulePagesBase: "../moduller/",

  /* Kartlarda alt adres satırını göster (temel.qrmenuofficial.com). */
  showSubdomain: true,

  /* Boş bırakılırsa gösterilmez. Örn: KDV / ödeme koşulu notu. */
  priceNote: "",

  /* -------------------------------------------------------
     PAKETLER (sıra = yükseklik sırası; yukarıdaki "from" mantığı buna dayanır)
     ------------------------------------------------------- */
  packages: [
    {
      id: "temel",
      name: "Temel",
      tagline: "Dijital QR Menü",
      summary: "Baskı menüden çıkın: menünüzü, fiyatlarınızı ve dillerinizi tek panelden yönetin.",
      audience: "Dijital menü isteyen işletmeler",
      subdomain: "temel.qrmenuofficial.com",
      price: { monthly: 749, annual: 7490 },
      variant: "plain",
      ctaLabel: "Temel paketi seç",
      highlightsLead: "Pakete dahil olanlar",
      highlights: ["qr-menu", "menu-yonetimi", "coklu-dil", "filtreler", "qr-masa", "kampanya-combo"],
      scenario: {
        title: "Menünüzü dijitalleştirin.",
        text: "Baskı menüyü bırakıp ürün, fiyat ve dili tek panelden yönetmek isteyen işletmeler için."
      }
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "Dijital Menü + Restoran Servis Sistemi",
      summary: "Müşteri garsonu, hesabı ve siparişi masasından iletir; talepler servis paneline düşer.",
      audience: "Masa servisini dijitalleştirmek isteyen işletmeler",
      subdomain: "pro.qrmenuofficial.com",
      price: { monthly: 1490, annual: 14900 },
      variant: "featured",
      ctaLabel: "Pro paketi seç",
      highlightsLead: "Temel'in tümü, ayrıca",
      highlights: ["garson-cagir", "hesap-iste", "qr-siparis", "servis-paneli", "personel-rolu", "oturum-guvenligi"],
      scenario: {
        title: "Masa ve servis akışınızı dijitalleştirin.",
        text: "Garson çağrısı, hesap isteği ve sipariş telefondan gelsin; ekibiniz tek ekrandan yönetsin."
      }
    },
    {
      id: "plus",
      name: "Plus",
      tagline: "Dijital Menü + Servis + İşletme Zekâsı",
      summary: "Menü ve servisin üstüne raporlar, geri bildirim, maliyet analizi ve menü asistanı ekler.",
      audience: "İşletmesini veri ve AI ile geliştirmek isteyen işletmeler",
      subdomain: "plus.qrmenuofficial.com",
      price: { monthly: 2990, annual: 29900 },
      variant: "dark",
      ctaLabel: "Plus paketi seç",
      highlightsLead: "Pro'nun tümü, ayrıca",
      highlights: ["analytics", "asistan", "geri-bildirim", "menu-muhendisligi", "maliyet-recete", "mobil-uygulama"],
      scenario: {
        title: "İşletmenizi veriler ve AI ile geliştirin.",
        text: "Neyin sattığını, neyin kazandırdığını ve müşterinin ne düşündüğünü görerek menünüzü veriyle yönetin."
      }
    }
  ],

  /* -------------------------------------------------------
     KATEGORİLER (sıra = karşılaştırmadaki sıra)
     ------------------------------------------------------- */
  categories: [
    { id: "menu",   name: "Menü" },
    { id: "servis", name: "Masa & Servis" },
    { id: "isletme", name: "İşletme" },
    { id: "ai",     name: "AI & Uygulama" }
  ],

  /* -------------------------------------------------------
     ÖZELLİKLER — güncel paket matrisi.
     Galeri, Çalışma Saatleri ve Header & Footer bu matrisin dışındadır
     (ayrı modül sayfası da yoktur); gerekirse yeniden satır olarak eklenir.
     Alanlar: id, name, category, from, note? (opsiyonel kısa açıklama), values? (istisna)
     ------------------------------------------------------- */
  features: [
    // Menü
    { id: "qr-menu",        name: "QR Menü",                        category: "menu",   from: "temel", page: "restoran-menu" },
    { id: "menu-yonetimi",  name: "Menü Yönetimi",                  category: "menu",   from: "temel", page: "restoran-menu" },
    { id: "csv-aktar",      name: "CSV içe aktarma",                category: "menu",   from: "temel", page: "restoran-menu" },
    { id: "coklu-dil",      name: "Çoklu Dil",                      category: "menu",   from: "temel", page: "coklu-dil" },
    { id: "filtreler",      name: "Akıllı Filtreleme",              category: "menu",   from: "temel", page: "akilli-filtreleme" },
    { id: "porsiyon-ekstra", name: "Porsiyon & Ekstra",             category: "menu",   from: "temel", page: "restoran-menu" },
    { id: "kampanya-combo", name: "Kampanya & Combo",               category: "menu",   from: "temel", page: "restoran-menu" },

    { id: "rozetler",       name: "Rozetler",                       category: "menu"  , from: "temel", page: "restoran-menu" },
    { id: "acilis-ekrani",  name: "Açılış Ekranı",                  category: "menu"  , from: "pro" },

    // Masa & Servis
    { id: "qr-masa",        name: "QR Masa",                        category: "servis", from: "temel", page: "qr-masa" },
    { id: "garson-cagir",   name: "Garson Çağır",                   category: "servis", from: "pro", page: "servis-paneli" },
    { id: "hesap-iste",     name: "Hesap İste",                     category: "servis", from: "pro", page: "servis-paneli" },
    { id: "qr-siparis",     name: "QR üzerinden sipariş",           category: "servis", from: "pro", page: "servis-paneli" },
    { id: "servis-paneli",  name: "Servis Paneli",                  category: "servis", from: "pro", page: "servis-paneli" },
    { id: "personel-rolu",  name: "Personel / servis rolü",         category: "servis", from: "pro", page: "servis-paneli" },
    { id: "oturum-guvenligi", name: "Masa oturum güvenliği",        category: "servis", from: "pro", page: "masa-oturum-guvenligi" },

    // İşletme
    { id: "analytics",      name: "QR Analytics",                   category: "isletme", from: "plus", page: "qr-analytics" },
    { id: "geri-bildirim",  name: "Yorum & Geri Bildirim",          category: "isletme", from: "plus", page: "yorum-geri-bildirim" },
    { id: "menu-muhendisligi", name: "Menü Mühendisliği",           category: "isletme", from: "plus", page: "menu-muhendisligi" },
    { id: "maliyet-recete", name: "Maliyet & Reçete",               category: "isletme", from: "plus", page: "menu-muhendisligi" },

    // AI & Uygulama
    { id: "asistan",        name: "Menü Asistanı / Chatbot",        category: "ai",     from: "plus", page: "menu-asistani" },
    { id: "mobil-uygulama", name: "Mobil uygulama",                 category: "ai",     from: "plus" }
  ]
};
