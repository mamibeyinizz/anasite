/* =========================================================
   QR MENU OFFICIAL — /paketler/ VERİ DOSYASI
   Sayfadaki paket içeriği ve fiyatlar YALNIZCA burada tanımlanır.
   Yıllık tasarruf ayrıca yazılmaz; aylık × 12 − yıllık toplam olarak hesaplanır.

   - Fiyatlar            → packages[].price
   - Paket metinleri     → packages[]
   - Özellik ekle/çıkar  → features[]   (bir satır = bir özellik)
   - Özelliğin paketi    → features[].from  ("temel" | "pro" | "plus")
                           Bir özellik, `from` paketinden itibaren tüm
                           üst paketlerde otomatik "dahil" sayılır.
   - Tek pakete özel     → features[].values  (opsiyonel)
   - İkincil satır       → features[].secondary  (karşılaştırmada ayrıntı alanında)
   - Kart CTA hedefi     → cta.href  (boşsa satın alma adresi üretilmez;
                           düğme cta.finalHref ile iletişim formuna gider)
   - Yardım CTA hedefi   → cta.finalHref  (gerçek iletişim formu, #talep)
   - Modül sayfası       → features[].page
   ========================================================= */

window.QRMO_PRICING = {

  currency: "TL",

  /* Yıllık model: usedMonths ay kullan, payMonths ay öde (12 → 10). */
  annual: { usedMonths: 12, payMonths: 10 },

  defaultPeriod: "monthly", // "monthly" | "annual"

  /* -------------------------------------------------------
     Kart CTA'sı ödeme sayfası değildir. href boş kaldığı sürece
     pasif düğme gösterilir; sahte satın alma adresi üretilmez.
     Alt yardım düğmesi gerçek iletişim sayfasına gider.
     ------------------------------------------------------- */
  cta: {
    /* Satın alma adresi yoktur. href boşken kart düğmesi bu yardım adresine gider. */
    href: "",
    finalHref: "../iletisim/#talep",
    finalLabel: "Paket seçimi için yardım alın",
    pendingNotice:
      "Bu düğme satın alma sayfası açmaz. Paket başvurusu için iletişim kanallarını kullanın."
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
      tagline: "Dijital QR menü",
      summary: "Menünüzü dijitalleştirin ve ürünlerinizi tek panelden yönetin.",
      audience: "Dijital menü isteyen işletmeler",
      subdomain: "temel.qrmenuofficial.com",
      price: { monthly: 749, annual: 7490 },
      variant: "plain",
      ctaLabel: "Temel için iletişime geçin",
      highlightsLead: "Temel özellikler",
      highlights: ["qr-menu", "menu-yonetimi", "coklu-dil", "filtreler", "qr-masa", "kampanya-combo"],
      scenario: {
        title: "Menümü dijitalleştirmek istiyorum.",
        text: "Ürün, fiyat, dil ve QR masa yeterliyse Temel yeter. Garson çağrısı, sipariş ve servis paneli bu pakette yoktur."
      }
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "Dijital menü ve masa servisi",
      summary: "Masa ve servis süreçlerinizi daha düzenli yönetin.",
      audience: "Masa ve servis akışını düzenlemek isteyen işletmeler",
      subdomain: "pro.qrmenuofficial.com",
      price: { monthly: 1490, annual: 14900 },
      variant: "featured",
      badge: "Önerilen",
      recommendReason: "Garson çağrısı, hesap talebi, sipariş ve servis paneli bu pakette Temel’in üzerine eklenir.",
      ctaLabel: "Pro için iletişime geçin",
      highlightsLead: "Temel’e ek olarak",
      highlights: ["garson-cagir", "hesap-iste", "qr-siparis", "servis-paneli", "personel-rolu", "oturum-guvenligi"],
      scenario: {
        title: "Masa ve servis akışımı kolaylaştırmak istiyorum.",
        text: "Garson çağrısı, hesap talebi ve sipariş servis panelinde toplanacaksa önerilen paket Pro’dur. Temel’deki menü de açıktır."
      }
    },
    {
      id: "plus",
      name: "Plus",
      tagline: "Menü, servis ve işletme verisi",
      summary: "İşletmenizi gelişmiş dijital araçlar ve verilerle geliştirin.",
      audience: "İşletmesini veriyle geliştirmek isteyen işletmeler",
      subdomain: "plus.qrmenuofficial.com",
      price: { monthly: 2990, annual: 29900 },
      variant: "dark",
      ctaLabel: "Plus için iletişime geçin",
      highlightsLead: "Pro’ya ek olarak",
      highlights: ["analytics", "geri-bildirim", "menu-muhendisligi", "maliyet-recete", "asistan"],
      scenario: {
        title: "İşletmemi verilerle geliştirmek istiyorum.",
        text: "Menü analitiği, geri bildirim, maliyet, reçete ve menü asistanı da gerekiyorsa Plus, bu araçları Pro’nun üzerine ekler."
      }
    }
  ],

  /* -------------------------------------------------------
     KATEGORİLER — sıra, paket farkını üste taşır.
     ------------------------------------------------------- */
  categories: [
    { id: "servis", name: "Masa ve servis" },
    { id: "isletme", name: "Veri ve gelişmiş araçlar" },
    { id: "menu", name: "Dijital menü" }
  ],

  /* -------------------------------------------------------
     ÖZELLİKLER — güncel paket matrisi.
     "Mobil uygulama" satırı kaldırıldı: ürün kaydı menünün uygulama
     indirmeden tarayıcıda açıldığını söyler; ayrı bir uygulama doğrulanmadı.
     Açılış ekranı, analytics kaynağındaki açılış ekranı kaydına dayanır.
     ------------------------------------------------------- */
  features: [
    { id: "garson-cagir", name: "Garson çağrısı", category: "servis", from: "pro", page: "servis-paneli" },
    { id: "hesap-iste", name: "Hesap talebi", category: "servis", from: "pro", page: "servis-paneli" },
    { id: "qr-siparis", name: "QR ile sipariş", category: "servis", from: "pro", page: "servis-paneli" },
    { id: "servis-paneli", name: "Servis paneli", category: "servis", from: "pro", page: "servis-paneli" },
    { id: "personel-rolu", name: "Personel ve servis rolleri", category: "servis", from: "pro", page: "servis-paneli" },
    { id: "oturum-guvenligi", name: "Masa oturum güvenliği", category: "servis", from: "pro", page: "masa-oturum-guvenligi" },
    { id: "qr-masa", name: "QR masa", category: "servis", from: "temel", page: "qr-masa" },

    { id: "analytics", name: "Menü analitiği", category: "isletme", from: "plus", page: "qr-analytics" },
    { id: "geri-bildirim", name: "Yorum ve geri bildirim", category: "isletme", from: "plus", page: "yorum-geri-bildirim" },
    { id: "menu-muhendisligi", name: "Menü mühendisliği", category: "isletme", from: "plus", page: "menu-muhendisligi" },
    { id: "maliyet-recete", name: "Maliyet ve reçete", category: "isletme", from: "plus", page: "menu-muhendisligi" },
    { id: "asistan", name: "Menü asistanı", category: "isletme", from: "plus", page: "menu-asistani" },

    { id: "acilis-ekrani", name: "Açılış ekranı", category: "menu", from: "pro" },
    { id: "qr-menu", name: "Dijital QR menü", category: "menu", from: "temel", page: "restoran-menu" },
    { id: "menu-yonetimi", name: "Panelden ürün ve fiyat yönetimi", category: "menu", from: "temel", page: "restoran-menu" },
    { id: "coklu-dil", name: "Çoklu dil", category: "menu", from: "temel", page: "coklu-dil" },
    { id: "filtreler", name: "Akıllı filtreleme", category: "menu", from: "temel", page: "akilli-filtreleme" },
    { id: "kampanya-combo", name: "Kampanya ve kombo", category: "menu", from: "temel", page: "restoran-menu" },
    { id: "csv-aktar", name: "CSV ile ürün aktarma", category: "menu", from: "temel", page: "restoran-menu", secondary: true },
    { id: "porsiyon-ekstra", name: "Porsiyon ve ekstra", category: "menu", from: "temel", page: "restoran-menu", secondary: true },
    { id: "rozetler", name: "Ürün rozetleri", category: "menu", from: "temel", page: "restoran-menu", secondary: true }
  ]
};
