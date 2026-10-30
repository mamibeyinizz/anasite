/**
 * QR Menu Official — /sss/ tek veri kaynağı
 * HTML + JSON-LD build.mjs ile buradan üretilir.
 */

export const SITE = {
  baseUrl: "https://qrmenuofficial.com",
  path: "/sss/",
  brand: "QR Menu Official",
  title: "QR Menü SSS | Menü, Sipariş, Analytics ve Paketler",
  description:
    "QR menü, sipariş, garson çağrısı, çoklu dil, Menü Asistanı, analytics ve paketler hakkında 180'den fazla kısa cevap. Ürünün gerçek özelliklerine dayanır.",
  /** Doğrulanmış global OG görseli yoksa boş bırakılır (meta etiketi üretilmez). */
  ogImage: "",
};

/** @typedef {{ id: string, title: string, count?: number }} FaqCategory */
/** @typedef {{ type: "text", value: string } | { type: "link", href: string, label: string }} AnswerPart */
/** @typedef {{ id: string, categoryId: string, question: string, answer: AnswerPart[] }} FaqItem */

/** @type {FaqCategory[]} */
export const FAQ_CATEGORIES = [
  { id: "qr-nedir", title: "QR Menü Nedir?" },
  { id: "menu-urun", title: "Menü & Ürün Yönetimi" },
  { id: "qr-masa", title: "QR Kod & Masa Yönetimi" },
  { id: "siparis-servis", title: "Sipariş & Servis" },
  { id: "dil-alerjen", title: "Dil, Alerjen & Filtreler" },
  { id: "menu-asistani", title: "Menü Asistanı & AI" },
  { id: "analytics-muhendislik", title: "QR Analytics & Menü Mühendisliği" },
  { id: "guvenlik-teknik", title: "Güvenlik & Teknik" },
  { id: "paketler-fiyat", title: "Paketler & Fiyatlar" },
];

const L = (href, label) => ({ type: "link", href, label });
const T = (value) => ({ type: "text", value });

/** Doğrulanmış modül slug'ları (anasite /moduller/ yapısı) */
export const ALLOWED_MODULE_SLUGS = [
  "restoran-menu",
  "coklu-dil",
  "akilli-filtreleme",
  "qr-masa",
  "masa-oturum-guvenligi",
  "menu-asistani",
  "qr-analytics",
  "menu-muhendisligi",
  "servis-paneli",
  "yorum-geri-bildirim",
];

export const ALLOWED_LINK_HREFS = new Set([
  "/",
  "/paketler/",
  ...ALLOWED_MODULE_SLUGS.map((s) => `/moduller/${s}/`),
]);

/** Her kategoride en az bu kadar soru bulunur. */
export const MIN_PER_CATEGORY = 20;

/** @type {FaqItem[]} */
export const FAQ_ITEMS = [
  /* —— QR Menü Nedir? (6) —— */
  {
    id: "qrmo-faq-q-qr-menu-nedir",
    categoryId: "qr-nedir",
    question: "QR menü nedir?",
    answer: [
      T(
        "QR menü, müşterinin masadaki QR kodu okutarak telefonundan dijital menüyü açmasıdır. Kağıt menü basmadan ürün, fiyat ve açıklamaları güncel tutmanıza yardımcı olur. "
      ),
      L("/moduller/restoran-menu/", "Restoran Menü modülü"),
      T(" menü içeriğinin temelini oluşturur."),
    ],
  },
  {
    id: "qrmo-faq-q-sistem-nedir",
    categoryId: "qr-nedir",
    question: "QR Menu Official tam olarak ne sunar?",
    answer: [
      T(
        "Restoran ve kafeler için WordPress üzerinde çalışan dijital menü ve servis katmanıdır. Müşteri menüyü açar, arar ve filtreler; isteğe bağlı olarak sipariş verir veya garson/hesap çağırır. Talepler masa bilgisiyle servis paneline düşer. Hangi modüllerin açık olduğu lisansınızdaki pakete göre belirlenir."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-nasil-calisir",
    categoryId: "qr-nedir",
    question: "QR menü nasıl çalışır?",
    answer: [
      T(
        "İşletme menüyü yönetim panelinden hazırlar; her masa için QR kod üretilir. Müşteri kodu okutunca menü tarayıcıda açılır ve masa oturumu bağlanır. Menüden seçim, soru, sipariş veya çağrı yapılabilir; açık modüllere göre veriler panelde ve raporlarda görünür. "
      ),
      L("/moduller/qr-masa/", "QR masa"),
      T(" ve oturum adımları bu akışın parçasıdır."),
    ],
  },
  {
    id: "qrmo-faq-q-nasil-olusturulur",
    categoryId: "qr-nedir",
    question: "Restoran için QR menü nasıl oluşturulur?",
    answer: [
      T(
        "Eklenti lisans anahtarıyla etkinleştirildikten sonra kategoriler, ürünler ve fiyatlar panelden girilir; masalar tanımlanıp QR kodları indirilir veya yazdırılır. Süre ve onboarding adımları işletmeye göre değişebilir; net kurulum planı için satış ekibinizle görüşmeniz en doğrusudur."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-uygulama-gerekir-mi",
    categoryId: "qr-nedir",
    question: "QR menü kullanmak için uygulama gerekir mi?",
    answer: [
      T(
        "Müşteri tarafında uygulama indirmek gerekmez. Menü, telefonun kamerası veya QR okuyucusuyla tarayıcıda açılır. İşletme tarafında yönetim WordPress yönetim paneli üzerinden yapılır; servis ekibi için ayrı servis paneli ekranı kullanılır."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-telefondan-acilir-mi",
    categoryId: "qr-nedir",
    question: "QR menü telefondan açılır mı?",
    answer: [
      T(
        "Evet. QR kod, müşteriyi işletmenizin menü adresine yönlendirir; sayfa mobil tarayıcıda okunacak şekilde tasarlanır. İnternet bağlantısı olmadan çalışmaz; güncel menü her zaman sunucudan yüklenir."
      ),
    ],
  },

  /* —— Menü & Ürün Yönetimi (7) —— */
  {
    id: "qrmo-faq-q-urun-nasil-eklenir",
    categoryId: "menu-urun",
    question: "QR menüde ürün nasıl eklenir?",
    answer: [
      T(
        "Yönetim panelinde kategori seçilir veya oluşturulur; ardından ürün kartına ad, açıklama, fiyat ve isteğe bağlı alerjen, görsel gibi alanlar girilir. Kaydettiğiniz anda dijital menüde görünür (gizli veya tükendi işaretli değilse). "
      ),
      L("/moduller/restoran-menu/", "Restoran Menü"),
      T(" modülünde adım adım anlatılır."),
    ],
  },
  {
    id: "qrmo-faq-q-fiyat-nasil-degistirilir",
    categoryId: "menu-urun",
    question: "QR menüde fiyat nasıl değiştirilir?",
    answer: [
      T(
        "Ürünün paneldeki fiyat alanı güncellenir; baskı menüye gerek kalmadan müşteri yeni fiyatı görür. Porsiyon ve ekstra farkları ayrı tanımlanabilir; kampanya veya indirim rozetleri de panelden yönetilir."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-csv-aktarim",
    categoryId: "menu-urun",
    question: "Menüye CSV ile ürün aktarılabilir mi?",
    answer: [
      T("Evet. Örnek dosyayı indirir, ürünlerinizi tabloda hazırlar ve yüklersiniz. Fiyatı geçersiz satırlar aktarımdan sonra bildirilir."),
    ],
  },
  {
    id: "qrmo-faq-q-tukendi-urun",
    categoryId: "menu-urun",
    question: "Tükenen ürün menüde nasıl gösterilir?",
    answer: [
      T(
        "Ürün panelde tükendi olarak işaretlenebilir; menüde görünür kalır ancak sepete eklenemez ve müşteriye uygun etiket gösterilir. İsterseniz ürünü tamamen gizleyerek menüden kaldırabilirsiniz."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-kampanya-yonetimi",
    categoryId: "menu-urun",
    question: "Kampanya ve indirimler nasıl yönetilir?",
    answer: [
      T("Panelden kapsamdaki ürünlere toplu indirim veya zam uygulanır; indirim orijinal fiyatı değiştirmez, kaldırdığınızda fiyatlar eskisine döner. Zam ise fiyatı kalıcı olarak günceller. Kampanyalar panelden başlatılır ve geri alınır; saat veya güne göre otomatik başlayıp biten kampanya bu sürümde çalışmaz."),
    ],
  },
  {
    id: "qrmo-faq-q-arama-siralama",
    categoryId: "menu-urun",
    question: "Menüde arama ve sıralama var mı?",
    answer: [
      T("Evet. Müşteri menüde ürün arar; sıralama Önerilen sıra, A–Z, fiyat, protein, karbonhidrat ve acılık ölçütleriyle yapılır. Ayrıntılar "),
      L("/moduller/akilli-filtreleme/", "Akıllı filtreleme"),
      T(" modülündedir."),
    ],
  },
  {
    id: "qrmo-faq-q-porsiyon-ekstra",
    categoryId: "menu-urun",
    question: "Porsiyon ve ekstra seçenekleri nasıl tanımlanır?",
    answer: [
      T(
        "Her ürüne taban fiyat verilir; “büyük porsiyon +X ₺” gibi farklar ve sos, ek malzeme gibi ekstralar ayrı satırlarla tanımlanır. Ekstra listeleri birden fazla üründe yeniden kullanılabilir."
      ),
    ],
  },

  /* —— QR Kod & Masa Yönetimi (6) —— */
  {
    id: "qrmo-faq-q-qr-kod-olusturma",
    categoryId: "qr-masa",
    question: "Menü QR kodu nasıl oluşturulur?",
    answer: [
      T(
        "Masalar panelde tanımlandıktan sonra her masa için QR görseli oluşturulup indirilebilir veya yazdırılabilir. Kod, o masanın menü adresine gider; müşteri okutunca oturum masa ile eşleşir. "
      ),
      L("/moduller/qr-masa/", "QR masa modülü"),
      T(" bu süreci özetler."),
    ],
  },
  {
    id: "qrmo-faq-q-her-masa-ayri-qr",
    categoryId: "qr-masa",
    question: "Her masa için ayrı QR kod oluşturulabilir mi?",
    answer: [
      T(
        "Evet. Her masanın kendi kodu ve sabit adres anahtarı (slug) vardır; sipariş ve çağrılar doğru masaya düşer. İsterseniz genel giriş QR’ı yerine masa bazlı dağıtım yapabilirsiniz."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-masa-ad-degisince",
    categoryId: "qr-masa",
    question: "Masa adını değiştirince QR kod bozulur mu?",
    answer: [
      T(
        "Hayır. Görünen masa adı panelden güncellenir; yazdırılmış QR’daki teknik adres (slug) değişmez. Böylece basılı kodlar geçerliliğini korur, ekranda yeni masa adı görünür."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-qr-hangi-adres",
    categoryId: "qr-masa",
    question: "QR kod hangi adrese yönlendirir?",
    answer: [
      T(
        "Müşteri, sitenizde masa parametresiyle açılan menü sayfasına gider (örneğin masa slug’ı URL’de yer alır). Dil tercihi varsa ayrıca dil parametresi kullanılabilir."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-masa-kapatma",
    categoryId: "qr-masa",
    question: "Masa silinirse açık oturumlara ne olur?",
    answer: [
      T("Bir masa silindiğinde o masadaki açık oturumlar da kapanır. Yeni müşteri QR kodu okutunca yeni bir oturum başlar."),
    ],
  },
  {
    id: "qrmo-faq-q-masa-sayisi",
    categoryId: "qr-masa",
    question: "Kaç masa tanımlanabilir?",
    answer: [
      T("Toplu oluşturma tek seferde en fazla 200 masa açar; daha fazla masa için işlemi yeni bir aralıkla tekrarlayabilirsiniz. Paketinizde QR masa modülü açıksa tüm masalarınızı aynı akışla yönetebilirsiniz."),
    ],
  },

  /* —— Sipariş & Servis (6) —— */
  {
    id: "qrmo-faq-q-siparis-alinir-mi",
    categoryId: "siparis-servis",
    question: "QR menü ile sipariş alınabilir mi?",
    answer: [
      T(
        "Evet, sepet özelliği panelden açıksa müşteri ürünleri sepete ekleyip sipariş gönderebilir; sipariş masa bilgisiyle servis paneline düşer. Ödeme bu adımda alınmaz — mutfak/servis akışınız devam eder."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-sepet-kapatma",
    categoryId: "siparis-servis",
    question: "Sepet özelliği kapatılabilir mi?",
    answer: [
      T(
        "Evet. Sipariş modülü veya sepet ayarı kapatıldığında müşteri yalnızca menüyü inceler; garson çağrısı gibi diğer modüller ayrıca açık kalabilir. Tercih tamamen işletmenize aittir."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-garson-cagir",
    categoryId: "siparis-servis",
    question: "QR menü ile garson çağrılabilir mi?",
    answer: [
      T(
        "Evet. Müşteri QR menüden garson çağırır; kayıt masa bilgisiyle servis paneline düşer. Personel talebi panelde görür. Yanıt süresi işletmenin temposuna bağlıdır; sistem çağrıyı kaydeder, servis hızını garanti etmez."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-hesap-iste",
    categoryId: "siparis-servis",
    question: "QR menü ile hesap istenebilir mi?",
    answer: [
      T(
        "Evet. Hesap isteği de garson çağrısına benzer şekilde panele iletilir; masa bilgisi eklenir. Ödeme yine fiziksel POS veya kullandığınız yöntemle alınır."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-online-odeme",
    categoryId: "siparis-servis",
    question: "QR menü üzerinden ödeme alınabilir mi?",
    answer: [
      T(
        "Hayır. Servis Paneli’ndeki hesap isteği, hesabın masaya getirilmesini ister; bu bir ödeme alma sistemi değildir. Kartla veya cüzdanla tahsilat menü içinde yapılmaz."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-siparis-servis-paneli",
    categoryId: "siparis-servis",
    question: "Sipariş ve çağrılar ekibe nasıl ulaşır?",
    answer: [
      T(
        "Sipariş, garson çağrısı ve hesap isteği servis panelinde masa bilgisiyle listelenir. Sesli uyarı panelden açılabilir. Tarayıcı bildirimi, panel açıkken ve bildirim izni verildiğinde çalışır. Personel kaydı ekrandan görüp karşılar. "
      ),
      L("/moduller/servis-paneli/", "Servis Paneli"),
      T(" modülünde detaylar yer alır."),
    ],
  },

  /* —— Dil, Alerjen & Filtreler (6) —— */
  {
    id: "qrmo-faq-q-coklu-dil",
    categoryId: "dil-alerjen",
    question: "QR menüde birden fazla dil kullanılabilir mi?",
    answer: [
      T(
        "Evet. Desteklemek istediğiniz diller panelden tanımlanır; müşteri menüyü bu dillerden biriyle görüntüler. "
      ),
      L("/moduller/coklu-dil/", "Çoklu dil modülü"),
      T(" CSV veya elle çeviri girişini anlatır."),
    ],
  },
  {
    id: "qrmo-faq-q-otomatik-ceviri",
    categoryId: "dil-alerjen",
    question: "Menü çevirileri otomatik mi yapılır?",
    answer: [
      T(
        "Hayır. Sistem harici bir çeviri API’sine bağlanarak menüyü kendiliğinden çevirmez. Metinleri siz girersiniz veya CSV ile yüklersiniz; böylece mutfak terimleri ve marka diliniz kontrolünüzde kalır."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-ceviri-csv",
    categoryId: "dil-alerjen",
    question: "Çeviri CSV ile yüklenebilir mi?",
    answer: [
      T(
        "Evet. Çeviri modülü metinleri dışa aktarıp CSV ile toplu güncellemenize izin verir. Yükleme sonrası menü, seçilen dilde kaydettiğiniz metinleri gösterir."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-alerjen-gosterimi",
    categoryId: "dil-alerjen",
    question: "QR menüde alerjen bilgileri gösterilebilir mi?",
    answer: [
      T(
        "Evet. Ürünlere tanımlı alerjenler menüde gösterilebilir; bilgi tamamen sizin girdiğiniz veriye dayanır. Yanlış veya eksik alerjen riski için mutfak ve menü verinizi düzenli güncellemeniz gerekir."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-vegan-filtre",
    categoryId: "dil-alerjen",
    question: "Vegan, vejetaryen ve glütensiz bilgisi gösterilir mi?",
    answer: [
      T("Vegan, vejetaryen veya glütensiz olarak işaretlediğiniz ürünlerde bu etiket ürün detayında görünür. Bu sürümde bunlar ayrı bir filtre kartı değildir; alerjen, kalori, fiyat ve ürün özelliği (Popüler, Yeni, Önerilen, İndirimli) filtreleri vardır. İşaretlemediğiniz üründe etiket görünmez. "),
      L("/moduller/akilli-filtreleme/", "Akıllı filtreleme"),
      T(" hangi filtrelerin mevcut olduğunu özetler."),
    ],
  },
  {
    id: "qrmo-faq-q-filtre-veri",
    categoryId: "dil-alerjen",
    question: "Filtreler hangi verilere dayanır?",
    answer: [
      T("Filtreler sizin girdiğiniz ürün bilgisine dayanır; sistem içerikten alerjen algılamaz. Alerjen atanmamış veya kalorisi girilmemiş ürün için sonuç doğru çıkmaz."),
    ],
  },

  /* —— Menü Asistanı & AI (5) —— */
  {
    id: "qrmo-faq-q-menu-asistani-nedir",
    categoryId: "menu-asistani",
    question: "Menü Asistanı nedir?",
    answer: [
      T(
        "Menüdeki ürün ve açıklamalara dayanarak müşterinin sorularını yanıtlayan sohbet asistanıdır. Menü dışı veya veride olmayan konularda sınırlı kalır; cevaplayamadığı sorular raporlanabilir. "
      ),
      L("/moduller/menu-asistani/", "Menü Asistanı modülü"),
      T(" Plus paket kapsamındadır."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-hangi-sorular",
    categoryId: "menu-asistani",
    question: "Menü Asistanı hangi soruları cevaplayabilir?",
    answer: [
      T(
        "İçerik, fiyat, porsiyon, alerjen ve menüde tanımlı özelliklerle ilgili sorularda yardımcı olur. Rezervasyon, teslimat veya menüde olmayan hizmetler için kesin vaat vermez; bilmediği sorular kayıt altına alınır."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-limitleri",
    categoryId: "menu-asistani",
    question: "Menü Asistanı’nın kullanım sınırları nelerdir?",
    answer: [
      T("Oturum başına mesaj sayısı sınırlıdır (varsayılan 25). Yanıtlanmayacak kelimeler de tanımlanabilir; bu kelimeleri içeren mesaja sabit bir yanıt verilir."),
    ],
  },
  {
    id: "qrmo-faq-q-personel-devralma",
    categoryId: "menu-asistani",
    question: "Personel sohbeti devralabilir mi?",
    answer: [
      T(
        "Evet. Asistan yanıt veremediğinde veya müşteri insan desteği istediğinde personel görüşmeyi devralabilir; böylece tam otomasyon yerine bot + ekip hibrit modeli oluşur."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-gemini-kullanimi",
    categoryId: "menu-asistani",
    question: "Menü Asistanı hangi AI altyapısını kullanır?",
    answer: [
      T(
        "Yanıtlar Google Gemini API anahtarı tanımlandığında bu servis üzerinden üretilir; anahtar ve model yönetim panelinden yapılandırılır. Menü çevirisi için aynı API kullanılmaz — çeviri ayrı, manuel/CSV sürecindedir."
      ),
    ],
  },

  /* —— QR Analytics & Menü Mühendisliği (6) —— */
  {
    id: "qrmo-faq-q-analytics-nedir",
    categoryId: "analytics-muhendislik",
    question: "QR Analytics nedir?",
    answer: [
      T(
        "Menüdeki davranışları (görüntüleme, tıklama, sepet, sipariş gönderimi, asistan mesajları vb.) kaydeden raporlama katmanıdır. Veriler QR menü etkileşimlerinden gelir; harici POS entegrasyonu şart değildir. "
      ),
      L("/moduller/qr-analytics/", "QR Analytics"),
      T(" modülüne bakın."),
    ],
  },
  {
    id: "qrmo-faq-q-hangi-veriler",
    categoryId: "analytics-muhendislik",
    question: "QR menüde hangi veriler takip edilebilir?",
    answer: [
      T(
        "Örnek olaylar: menü görüntüleme, ürün tıklama, filtre kullanımı, sepete ekleme, sipariş gönderme veya iptal, chatbot mesajı. Metrikler paneldeki analytics ekranlarında özetlenir; her metrik lisansınızdaki modüllere bağlıdır."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-pos-verisi-mi",
    categoryId: "analytics-muhendislik",
    question: "Analytics verisi POS’tan mı gelir?",
    answer: [
      T(
        "Hayır. Kayıtlar müşterinin QR menüde yaptığı işlemlerden oluşur. Kasa POS cironuz ayrı sistemlerde kalır; buradaki sipariş sayıları menüden gönderilen sipariş olaylarına dayanır."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-menu-muhendisligi-nedir",
    categoryId: "analytics-muhendislik",
    question: "Menü mühendisliği nedir?",
    answer: [
      T(
        "Ürünlerin menüdeki performansını popülerlik ve kârlılık eksenlerinde sınıflandırmanıza yardımcı olan analizdir (yıldız, çok satan, gizli fırsat, zayıf performans gibi gruplar). Satış verisi yetersizse görüntülenme ve sepet sinyalleriyle desteklenebilir. "
      ),
      L("/moduller/menu-muhendisligi/", "Menü mühendisliği"),
      T(" modülünde anlatılır."),
    ],
  },
  {
    id: "qrmo-faq-q-maliyet-gerekli-mi",
    categoryId: "analytics-muhendislik",
    question: "Menü mühendisliği için maliyet girmek gerekir mi?",
    answer: [
      T(
        "Evet. Kârlılık hesabı için ürün maliyetlerini siz girersiniz; sistem maliyeti bilmeden otomatik kâr iddiasında bulunmaz. Maliyet verisi güncellendikçe matris anlamlı hale gelir."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-analytics-siparis",
    categoryId: "analytics-muhendislik",
    question: "QR Analytics sipariş sayılarını gösterir mi?",
    answer: [
      T(
        "Menüden gönderilen sipariş olayları (order_sent) raporlanabilir; bu, mutfak POS fiş adediyle birebir aynı olmayabilir. Amaç QR kanalındaki talebi görmek, tüm mağaza cirosunu tek başına yansıtmak değildir."
      ),
    ],
  },

  /* —— Güvenlik & Teknik (4) —— */
  {
    id: "qrmo-faq-q-guvenli-mi",
    categoryId: "guvenlik-teknik",
    question: "QR menü güvenli mi?",
    answer: [
      T(
        "Masa oturumu imzalı çerezle doğrulanır; müşteri yalnızca okuttuğu masayla ilişkilendirilir. Bu, rastgele masa numarası yazarak başkasının hesabına müdahale etmeyi zorlaştırır. Yine de mutlak “sıfır risk” iddiası yerine iyi uygulama ve güncel yazılım önerilir. "
      ),
      L("/moduller/masa-oturum-guvenligi/", "Masa oturum güvenliği"),
      T(" modülüne bakın."),
    ],
  },
  {
    id: "qrmo-faq-q-oturum-dogrulama",
    categoryId: "guvenlik-teknik",
    question: "Masa oturumu nasıl doğrulanır?",
    answer: [
      T(
        "QR ile gelen ziyaretçiye masa slug’ına bağlı imzalı bir oturum belirteci verilir; sunucu her istekte imzayı kontrol eder. Oturum süresi ve boşta kalma sınırı vardır; masa kapatılınca eski belirteçler geçersiz olur."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-kurulum",
    categoryId: "guvenlik-teknik",
    question: "QR Menu Official nasıl kurulur?",
    answer: [
      T(
        "WordPress sitesine eklenti yüklenir ve lisans anahtarıyla etkinleştirilir. Modüller lisans sunucusundan doğrulandıktan sonra menü, masa ve servis ekranları panelden yapılandırılır. Self-servis kayıt veya kurulum süresi hakkında kesin süre vaadi verilmez; ihtiyacınıza göre destek ekibinizle plan yapılır."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-modul-lisans",
    categoryId: "guvenlik-teknik",
    question: "Hangi modüller lisansa bağlıdır?",
    answer: [
      T(
        "Paketinizde aktif olan modül listesi lisans doğrulamasıyla belirlenir; kapalı modül menüde veya panelde görünmez. Lisans geçersiz olsa bile mevcut modül listesi ani silinmeyecek şekilde korunabilir, ancak güncelleme senkronu için geçerli lisans gerekir."
      ),
    ],
  },

  /* —— Paketler & Fiyatlar (4) —— */
  {
    id: "qrmo-faq-q-fiyatlar",
    categoryId: "paketler-fiyat",
    question: "QR menü fiyatları ne kadar?",
    answer: [
      T("Güncel liste fiyatları (TL): Temel aylık 749 / yıllık 7.490; Pro aylık 1.490 / yıllık 14.900; Plus aylık 2.990 / yıllık 29.900. Yıllık planda 12 ay kullanım için 10 ay ödeme modeli uygulanır. Vergi ve fatura koşulları satın alma aşamasında netleştirilir. Karşılaştırma için "),
      L("/paketler/", "paketler sayfasına"),
      T(" bakabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-hangi-paket",
    categoryId: "paketler-fiyat",
    question: "Hangi QR menü paketi bana uygun?",
    answer: [
      T(
        "Yalnız dijital menü ve çoklu dil için Temel; garson çağrısı, sipariş ve servis paneli için Pro; analytics, geri bildirim, menü mühendisliği ve Menü Asistanı için Plus uygundur. Karşılaştırma tablosu "
      ),
      L("/paketler/", "paketler"),
      T(" sayfasındadır."),
    ],
  },
  {
    id: "qrmo-faq-q-yillik-indirim",
    categoryId: "paketler-fiyat",
    question: "Yıllık ödeme indirimi var mı?",
    answer: [
      T(
        "Yıllık seçenekte 12 ay kullanım için 10 aylık ödeme esası uygulanır; bu, aylık ödemeye göre tasarruf sağlar. Kesin sözleşme koşulları satın alma anında paylaşılır."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-paket-farki",
    categoryId: "paketler-fiyat",
    question: "Paketler arasındaki temel fark nedir?",
    answer: [
      T("Temel dijital menü çekirdeğini; Pro masa servisini ve servis panelini; Plus ise analytics, geri bildirim, maliyet ve reçete analizi ile Menü Asistanını ekler. Her üst paket bir alt paketin modüllerini içerir; ayrıntılı liste "),
      L("/paketler/", "paketler"),
      T(" karşılaştırmasındadır."),
    ],
  },

  /* —— QR Menü Nedir?: ek sorular —— */
  {
    id: "qrmo-faq-q-dijital-pdf-fark",
    categoryId: "qr-nedir",
    question: "Dijital menü ile PDF menü arasındaki fark nedir?",
    answer: [
      T("PDF menü sabit bir dosyadır; ürün veya fiyat değiştiğinde dosyanın yeniden hazırlanması gerekir. QR Menu Official’da ürünler, fiyatlar ve bilgiler panelden yönetilen kayıtlardır; müşteri menüde arama ve filtreleme yapabilir, açık modüllere göre sipariş verebilir veya garson çağırabilir."),
    ],
  },
  {
    id: "qrmo-faq-q-kagit-menu-yerine",
    categoryId: "qr-nedir",
    question: "QR menü kâğıt menünün yerini tamamen almak zorunda mı?",
    answer: [
      T("Hayır. Dijital menüyü kâğıt menünün yanında ek bir kanal olarak da kullanabilirsiniz. Menüde değişiklik yaptığınızda yalnızca panelden güncelleme yapmanız yeterlidir; böylece basılı menüyü yenileme ihtiyacı azalır."),
    ],
  },
  {
    id: "qrmo-faq-q-kimler-icin",
    categoryId: "qr-nedir",
    question: "QR menü kimler için uygundur?",
    answer: [
      T("Restoran, kafe, kahvaltı salonu ve tatlıcı gibi menüsü olan işletmeler için uygundur. Masa ve servis süreçleri bulunan işletmeler ek olarak sipariş, garson çağrısı ve servis paneli modüllerinden yararlanabilir."),
    ],
  },
  {
    id: "qrmo-faq-q-qr-nasil-okutulur",
    categoryId: "qr-nedir",
    question: "Müşteri QR kodu nasıl okutur?",
    answer: [
      T("Müşteri telefonunun kamerasını veya QR okuyucusunu masadaki koda tutar. Menü, uygulama indirmeye gerek kalmadan telefonun tarayıcısında açılır."),
    ],
  },
  {
    id: "qrmo-faq-q-menu-herkese-acik",
    categoryId: "qr-nedir",
    question: "Menüyü görmek için müşterinin bir işlem yapması gerekir mi?",
    answer: [
      T("Menü varsayılan olarak herkese açıktır. Oturum, çağrı, sipariş ve sohbet gibi masaya bağlı özellikler ise QR okutulduğunda başlayan masa oturumuna bağlıdır."),
    ],
  },
  {
    id: "qrmo-faq-q-altyapi",
    categoryId: "qr-nedir",
    question: "QR Menu Official hangi altyapıda çalışır?",
    answer: [
      T("WordPress üzerinde çalışan bir eklentidir. WordPress 6.0 ve üzeri ile PHP 7.4 ve üzeri sürümleri gerektirir; eklenti lisans anahtarıyla etkinleştirilir."),
    ],
  },
  {
    id: "qrmo-faq-q-menude-hangi-bilgiler",
    categoryId: "qr-nedir",
    question: "Menüde ürünler için hangi bilgiler gösterilebilir?",
    answer: [
      T("Açıklama, fiyat, kalori, gramaj, protein, karbonhidrat ve yağ değerleri, hazırlanış süresi, acılık seviyesi, et menşei ve alerjenler gösterilebilir. Gösterilen bilgi, panelde sizin girdiğiniz veriye dayanır; sistem bu bilgileri kendiliğinden üretmez."),
    ],
  },
  {
    id: "qrmo-faq-q-modul-listesi",
    categoryId: "qr-nedir",
    question: "QR Menu Official hangi modüllerden oluşur?",
    answer: [
      T("Sistem on modülden oluşur: Restoran Menü, Çoklu Dil, Akıllı Filtreleme, QR Masa, Masa Oturum Güvenliği, Menü Asistanı, QR Analytics, Menü Mühendisliği, Servis Paneli ile Yorum ve Geri Bildirim. Hangi modüllerin açık olduğu lisansınızdaki pakete bağlıdır; ayrıntılar modül sayfalarında yer alır."),
    ],
  },
  {
    id: "qrmo-faq-q-menu-sayfasi-ekleme",
    categoryId: "qr-nedir",
    question: "Menü sayfaya nasıl eklenir?",
    answer: [
      T("Menü, WordPress sayfasına kısa kod veya Elementor bileşeniyle eklenir. QR kodlar bu menü sayfasına yönlendirdiği için sayfanın yayında olması gerekir."),
    ],
  },
  {
    id: "qrmo-faq-q-servis-akisi-da-var-mi",
    categoryId: "qr-nedir",
    question: "QR Menu Official yalnızca menü mü sunar, servis akışı da var mı?",
    answer: [
      T("Menünün yanında masa ve servis akışı da vardır. Pro paketten itibaren müşteri garson çağırabilir, hesap isteyebilir ve sipariş gönderebilir; bu talepler servis panelinde masa bilgisiyle toplanır. Yalnızca dijital menü isteyen işletmeler için Temel paket yeterlidir."),
    ],
  },
  {
    id: "qrmo-faq-q-kod-yeniden-basma",
    categoryId: "qr-nedir",
    question: "Menüde değişiklik yapınca QR kodları yeniden basmak gerekir mi?",
    answer: [
      T("Hayır. QR kod menü sayfanıza yönlendirir; ürün, fiyat veya açıklama güncellemeleri kodu değiştirmez. Masa adını değiştirmek de kodun hedef adresini değiştirmez, basılı kodlar aynı masayı göstermeye devam eder."),
    ],
  },
  {
    id: "qrmo-faq-q-musteri-ne-yapar",
    categoryId: "qr-nedir",
    question: "Müşteri QR menüde neler yapabilir?",
    answer: [
      T("Menüyü inceler, ürün arar, alerjen, kalori ve fiyata göre filtreler, dil seçer ve ürün detaylarını görür. Pro pakette sepete ürün ekleyip sipariş gönderebilir, garson çağırabilir ve hesap isteyebilir; Plus pakette Menü Asistanı ile soru sorabilir."),
    ],
  },
  {
    id: "qrmo-faq-q-pos-odeme-sistemi-mi",
    categoryId: "qr-nedir",
    question: "QR Menu Official bir kasa (POS) veya ödeme sistemi midir?",
    answer: [
      T("Hayır. Sistem ödeme almaz; “Hesap iste” yalnızca hesabın masaya getirilmesini ister. Analytics verileri de kasa kayıtlarından değil, menüdeki müşteri hareketlerinden oluşur."),
    ],
  },
  {
    id: "qrmo-faq-q-isletmeye-ne-saglar",
    categoryId: "qr-nedir",
    question: "QR menü işletmeye ne sağlar?",
    answer: [
      T("Menü içeriğinin tek panelden güncellenmesini, çok dilli sunumu ve ürünlerin filtrelenebilir gösterimini sağlar. Pro ve Plus paketlerde servis taleplerinin tek ekranda toplanması ile menü verilerinin raporlanması da eklenir. Sonuçlar işletmenin kullanımına ve operasyonuna bağlıdır."),
    ],
  },

  /* —— Menü & Ürün Yönetimi: ek sorular —— */
  {
    id: "qrmo-faq-q-kategori-yonetimi",
    categoryId: "menu-urun",
    question: "Menü kategorileri nasıl yönetilir?",
    answer: [
      T("Kategoriler panelden eklenir, düzenlenir, gizlenir veya silinir. Her kategoriye servis saati kuralı da tanımlayabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-gizle-sil-fark",
    categoryId: "menu-urun",
    question: "Ürünü gizlemekle tükendi işaretlemek arasındaki fark nedir?",
    answer: [
      T("Gizlenen ürün menüden tamamen kalkar. Tükendi işaretlenen ürün menüde görünmeye devam eder; üzerine etiket basılır ve sipariş ile tıklama akışı kapanır."),
    ],
  },
  {
    id: "qrmo-faq-q-urun-bilgi-alanlari",
    categoryId: "menu-urun",
    question: "Bir ürüne hangi bilgiler girilebilir?",
    answer: [
      T("Açıklama, fiyat, kalori, gramaj, protein, karbonhidrat ve yağ değerleri, hazırlanış süresi, acılık seviyesi ve et menşei girilir. Bu bilgiler ürün detayında gösterilir."),
    ],
  },
  {
    id: "qrmo-faq-q-alkol-domuz-isareti",
    categoryId: "menu-urun",
    question: "Alkol veya domuz türevi içeren ürünler işaretlenebilir mi?",
    answer: [
      T("Evet. Ürünün alkol veya domuz türevi içerdiğini işaretleyebilirsiniz. İşaretleme sizin girdiğiniz bilgiye dayanır."),
    ],
  },
  {
    id: "qrmo-faq-q-tukendi-saatle-acma",
    categoryId: "menu-urun",
    question: "Tükenen ürün belirlediğim saatte yeniden satışa açılabilir mi?",
    answer: [
      T("Evet. Ürünü belirlediğiniz saate kadar tükendi bırakırsınız; süre dolunca ürün yeniden satışa açılır. Zamanlama, WordPress’in zamanlanmış görev sistemine dayanır."),
    ],
  },
  {
    id: "qrmo-faq-q-malzeme-bazli-tukendi",
    categoryId: "menu-urun",
    question: "Bir malzeme bittiğinde o malzemeyi kullanan ürünler nasıl tükendi yapılır?",
    answer: [
      T("Malzeme bazlı tükendi özelliğiyle bir malzeme bittiğinde onu kullanan tüm ürünleri aynı anda belirlediğiniz saate kadar tükendi işaretlersiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-kategori-servis-saatleri",
    categoryId: "menu-urun",
    question: "Kahvaltı gibi belirli saatlerde sunulan ürünler nasıl yönetilir?",
    answer: [
      T("Kategoriye “Kahvaltı 07:00–11:00, hafta içi” gibi bir servis saati kuralı bir kez yazılır; gerekirse tek ürün için bu kural değiştirilebilir. Servis saati dışında ürün menüden kalkmaz, saat etiketi görünür ve ürün sepete eklenemez."),
    ],
  },
  {
    id: "qrmo-faq-q-toplu-fiyat",
    categoryId: "menu-urun",
    question: "Menüde toplu indirim veya zam nasıl uygulanır?",
    answer: [
      T("Panelden kapsamdaki ürünlere toplu indirim veya zam uygulanır. İndirim orijinal fiyatı değiştirmez; kaldırdığınızda fiyatlar eskisine döner. Zam ise fiyatı kalıcı olarak günceller."),
    ],
  },
  {
    id: "qrmo-faq-q-kampanya-gorselleri",
    categoryId: "menu-urun",
    question: "Menünün üstünde kampanya görselleri gösterilebilir mi?",
    answer: [
      T("Evet. Sayfanın en üstünde kendi kendine dönen kampanya görselleri gösterilir; geçiş süresi ayarlanabilir."),
    ],
  },
  {
    id: "qrmo-faq-q-one-cikanlar",
    categoryId: "menu-urun",
    question: "Öne çıkarmak istediğim ürünleri nasıl gösteririm?",
    answer: [
      T("Menünün üstündeki kayan bir şeritte öne çıkarmak istediğiniz ürünleri gösterebilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-kombin-urun",
    categoryId: "menu-urun",
    question: "İki ürünü kombin fiyatla sunabilir miyim?",
    answer: [
      T("Evet. İki ürünü seçip tek bir kombin fiyatıyla sunabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-rozetler",
    categoryId: "menu-urun",
    question: "Ürün rozetleri nelerdir, kendi rozetimi ekleyebilir miyim?",
    answer: [
      T("Popüler, Yeni, Önerilen ve İndirimli rozetleri hazır gelir. “Hızlı Servis” gibi kendi rozetlerinizi de tanımlayabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-json-yedek",
    categoryId: "menu-urun",
    question: "Menü yedeklenebilir mi?",
    answer: [
      T("Evet. Tüm menü ürünleri JSON olarak dışa aktarılabilir. Geri yüklerken ürün kimliğiyle eşleşen kayıtların üzerine yazılır."),
    ],
  },
  {
    id: "qrmo-faq-q-menu-gorunum",
    categoryId: "menu-urun",
    question: "Menünün görünümü özelleştirilebilir mi?",
    answer: [
      T("Evet. Beş hazır renk paleti vardır: Premium Altın, Klasik Turuncu, Koyu Tema, Modern Mavi ve Doğal Yeşil. Ayrıca yazı tipi ve renk ayarları yapılabilir."),
    ],
  },

  /* —— QR Kod & Masa Yönetimi: ek sorular —— */
  {
    id: "qrmo-faq-q-tek-masa-ekleme",
    categoryId: "qr-masa",
    question: "Tek bir masa nasıl eklenir?",
    answer: [
      T("Masa adını yazarsınız; adres otomatik üretilir. Örneğin “Masa 31” adresi masa-31, “VIP Salon” ise vip-salon olur."),
    ],
  },
  {
    id: "qrmo-faq-q-toplu-masa",
    categoryId: "qr-masa",
    question: "Birden fazla masa tek seferde açılabilir mi?",
    answer: [
      T("Evet. Bir ön ek ve numara aralığı girersiniz; örneğin ic-masa ön ekiyle 1–10 aralığı ic-masa-1’den ic-masa-10’a kadar masaları tek seferde açar. Tek seferde en fazla 200 masa açılır."),
    ],
  },
  {
    id: "qrmo-faq-q-masa-gruplama",
    categoryId: "qr-masa",
    question: "Masalar gruplanabilir mi?",
    answer: [
      T("Evet. Ortak ön eke sahip masalar (örneğin ic-masa, bahce) grup olarak listelenir ve liste gruba göre süzülebilir."),
    ],
  },
  {
    id: "qrmo-faq-q-qr-format",
    categoryId: "qr-masa",
    question: "QR kodlar hangi formatta indirilir?",
    answer: [
      T("Her masa için QR kod PNG veya PDF olarak indirilebilir."),
    ],
  },
  {
    id: "qrmo-faq-q-qr-tarayicida",
    categoryId: "qr-masa",
    question: "QR kodlar nerede üretilir?",
    answer: [
      T("QR üretimi tarayıcıda yapılır; panelde masa listesinden kodları görüntüleyip indirirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-tumunu-yazdir",
    categoryId: "qr-masa",
    question: "Tüm masaların QR kodları tek dosyada yazdırılabilir mi?",
    answer: [
      T("Evet. “Tümünü yazdır” seçeneği, listedeki her masa için masa adı ve QR kodu içeren, masa başına bir sayfalık tek bir PDF indirir."),
    ],
  },
  {
    id: "qrmo-faq-q-musteri-masa-gorur",
    categoryId: "qr-masa",
    question: "Müşteri hangi masada olduğunu görebilir mi?",
    answer: [
      T("Evet. Kısa kod, müşteriye bulunduğu masayı gösterir (örneğin “Masa 7”)."),
    ],
  },
  {
    id: "qrmo-faq-q-masa-bilgisi-nereden",
    categoryId: "qr-masa",
    question: "Masa bilgisi nereden okunur?",
    answer: [
      T("Masa bilgisi, doğrulanmış masa oturumundan okunur; adres satırından değil."),
    ],
  },
  {
    id: "qrmo-faq-q-masaya-bagli-ozellikler",
    categoryId: "qr-masa",
    question: "Hangi özellikler masa bilgisiyle çalışır?",
    answer: [
      T("Garson çağırma, hesap isteme ve sipariş (Pro paket) ile masa bazlı raporlar (Plus paket) masa bilgisiyle çalışır."),
    ],
  },
  {
    id: "qrmo-faq-q-qr-calismasi-icin",
    categoryId: "qr-masa",
    question: "QR kodun çalışması için ne gerekir?",
    answer: [
      T("QR kod menü sayfanıza yönlendirir; bu nedenle menü sayfanızın yayında olması gerekir."),
    ],
  },
  {
    id: "qrmo-faq-q-masasiz-erisim",
    categoryId: "qr-masa",
    question: "Masa dışından gelen girişler raporlarda ayrı görünür mü?",
    answer: [
      T("Evet. QR Analytics’te masasız (doğrudan) erişim, masalardan gelen hareketten ayrı gösterilir. Bu rapor Plus paket kapsamındadır."),
    ],
  },
  {
    id: "qrmo-faq-q-okutulmayan-masalar",
    categoryId: "qr-masa",
    question: "Hiç okutulmayan masalar görülebilir mi?",
    answer: [
      T("Evet. QR Analytics’in masa raporu, seçilen tarih aralığında hiç okutulmayan masaları listeler. Bu rapor Plus paket kapsamındadır."),
    ],
  },
  {
    id: "qrmo-faq-q-mevcut-masalar-toplu",
    categoryId: "qr-masa",
    question: "Toplu masa oluştururken mevcut masalar etkilenir mi?",
    answer: [
      T("Hayır. Aynı adı taşıyan mevcut masalar atlanır; yalnızca henüz olmayan masalar açılır."),
    ],
  },
  {
    id: "qrmo-faq-q-oturum-sureleri-nerede",
    categoryId: "qr-masa",
    question: "Masa oturum süreleri nerede ayarlanır?",
    answer: [
      T("Oturum süreleri QR Masa’da değil, Masa Oturum Güvenliği modülünde ayarlanır. Bu modül Pro paket kapsamındadır; ayrıntılar "),
      L("/moduller/masa-oturum-guvenligi/", "Masa Oturum Güvenliği"),
      T(" sayfasındadır."),
    ],
  },

  /* —— Sipariş & Servis: ek sorular —— */
  {
    id: "qrmo-faq-q-servis-paneli-nedir",
    categoryId: "siparis-servis",
    question: "Servis paneli nedir?",
    answer: [
      T("Sipariş, garson çağrısı ve hesap isteğini aynı panelde, masa bilgisiyle toplayan ekrandır. Ekip kayıtları buradan takip eder ve durumlarını günceller."),
    ],
  },
  {
    id: "qrmo-faq-q-panel-durumlari",
    categoryId: "siparis-servis",
    question: "Servis panelinde hangi durum sütunları var?",
    answer: [
      T("Bekliyor, Hazırlanıyor, Serviste, Tamamlandı ve İptal sütunları vardır. Ekip, karttaki düğmeyle durumu günceller."),
    ],
  },
  {
    id: "qrmo-faq-q-bekleme-uyarisi",
    categoryId: "siparis-servis",
    question: "Bekleyen talepler için uyarı var mı?",
    answer: [
      T("Evet. Tamamlanmamış kart, belirlediğiniz süreleri aşınca sarıya ve kırmızıya döner. Varsayılan eşikler 3 ve 7 dakikadır."),
    ],
  },
  {
    id: "qrmo-faq-q-sesli-uyari",
    categoryId: "siparis-servis",
    question: "Yeni kayıtta sesli uyarı çalar mı?",
    answer: [
      T("Sesli uyarı açılabilir ve panelden kapatılabilir. Uyarının duyulması için panelin tarayıcıda açık olması gerekir."),
    ],
  },
  {
    id: "qrmo-faq-q-tarayici-bildirimi",
    categoryId: "siparis-servis",
    question: "Tarayıcı bildirimi nasıl çalışır?",
    answer: [
      T("Bildirim düğmesi tarayıcıdan izin ister. İzin verilmezse veya panel kapalıysa bildirim gelmez."),
    ],
  },
  {
    id: "qrmo-faq-q-yenileme-araligi",
    categoryId: "siparis-servis",
    question: "Servis paneli ne sıklıkla yenilenir?",
    answer: [
      T("Panel kayıtları belirli aralıklarla yenilenir. Varsayılan aralık 5 saniyedir ve 3 ile 60 saniye arasında ayarlanabilir."),
    ],
  },
  {
    id: "qrmo-faq-q-garson-hesap-ayri",
    categoryId: "siparis-servis",
    question: "Garson çağır ve hesap iste düğmeleri ayrı ayrı açılabilir mi?",
    answer: [
      T("Evet. İki düğme birlikte ya da ayrı ayrı açılabilir."),
    ],
  },
  {
    id: "qrmo-faq-q-personel-erisimi",
    categoryId: "siparis-servis",
    question: "Garson ve mutfak personeli panele nasıl erişir?",
    answer: [
      T("Garson ve mutfak personeli için sınırlı bir servis rolü vardır. Bu rolle giren kullanıcı servis panelini görür."),
    ],
  },
  {
    id: "qrmo-faq-q-servis-rolu-sinirlari",
    categoryId: "siparis-servis",
    question: "Servis rolündeki kullanıcı menüyü ve ayarları görebilir mi?",
    answer: [
      T("Hayır. Servis rolü tam yönetici yetkisi değildir; menüyü ve ayarları göremez."),
    ],
  },
  {
    id: "qrmo-faq-q-tamamlananlar",
    categoryId: "siparis-servis",
    question: "Tamamlanan kayıtlar panelde ne kadar kalır?",
    answer: [
      T("Süreyi siz ayarlarsınız. Varsayılan süre 2 saattir."),
    ],
  },
  {
    id: "qrmo-faq-q-panel-suzme",
    categoryId: "siparis-servis",
    question: "Panelde kayıtlar süzülebilir mi?",
    answer: [
      T("Evet. Kayıtlar talep türüne ve masa adına göre süzülebilir."),
    ],
  },
  {
    id: "qrmo-faq-q-talep-karsilanma",
    categoryId: "siparis-servis",
    question: "Talebin oluşması, talebin karşılandığı anlamına gelir mi?",
    answer: [
      T("Hayır. Panel kaydı gösterir; talebi personel karşılar. Süre, işletmenin operasyonuna bağlıdır."),
    ],
  },
  {
    id: "qrmo-faq-q-musteri-siparis-gonderme",
    categoryId: "siparis-servis",
    question: "Müşteri siparişi nasıl gönderir?",
    answer: [
      T("Müşteri menüden ürünleri sepete ekler ve siparişi gönderir. Sipariş, masa bilgisiyle servis paneline kart olarak düşer. Sepetle sipariş, Diğer Ayarlar’dan etkinleştirilir ve Pro paket kapsamındadır."),
    ],
  },
  {
    id: "qrmo-faq-q-panel-mobil",
    categoryId: "siparis-servis",
    question: "Servis paneli dar ekranlarda kullanılabilir mi?",
    answer: [
      T("Evet. Dar ekranda durum sütunları sekmeye dönüşür."),
    ],
  },

  /* —— Dil, Alerjen & Filtreler: ek sorular —— */
  {
    id: "qrmo-faq-q-kac-dil",
    categoryId: "dil-alerjen",
    question: "Kaç dil desteklenir?",
    answer: [
      T("Türkçe, English, Deutsch, Français, Español, Italiano, Русский, العربية, 中文, 日本語 ve 한국어 dahil 30 dil arasından menüde göstereceklerinizi seçersiniz. Türkçe orijinal dildir."),
    ],
  },
  {
    id: "qrmo-faq-q-ceviri-girilmeyen",
    categoryId: "dil-alerjen",
    question: "Çevirisi girilmeyen alan nasıl görünür?",
    answer: [
      T("Çevirisi girilmeyen alan Türkçe (orijinal) haliyle görünür."),
    ],
  },
  {
    id: "qrmo-faq-q-dil-secici",
    categoryId: "dil-alerjen",
    question: "Müşteri dili nasıl seçer?",
    answer: [
      T("Menüde bir dil seçici bulunur. Seçici yalnızca bayrak ya da bayrak ve dil adı gösterecek şekilde ayarlanabilir; buton renkleri de değiştirilebilir."),
    ],
  },
  {
    id: "qrmo-faq-q-sagdan-sola",
    categoryId: "dil-alerjen",
    question: "Arapça gibi sağdan sola yazılan diller desteklenir mi?",
    answer: [
      T("Evet. Arapça, İbranice ve Farsça sağdan sola yazılır."),
    ],
  },
  {
    id: "qrmo-faq-q-fiyat-bicimi",
    categoryId: "dil-alerjen",
    question: "Fiyat gösterimi dile göre değişir mi?",
    answer: [
      T("Sayı ayracı dile göre değişir (1.234,56 veya 1,234.56). Tek para birimi kullanılır; kur çevrimi yapılmaz."),
    ],
  },
  {
    id: "qrmo-faq-q-neler-cevrilir",
    categoryId: "dil-alerjen",
    question: "Hangi içerikler çevrilebilir?",
    answer: [
      T("Menü ürünleri, kategoriler ve alerjenler çevrilir; ayrıca seçtiğiniz sayfalar başlıklarıyla birlikte çevrilebilir. İsterseniz tema ve diğer eklentilerin bastığı sabit metinler de çevrilir."),
    ],
  },
  {
    id: "qrmo-faq-q-sabit-metinler",
    categoryId: "dil-alerjen",
    question: "“Filtrele” veya “Ürün ara…” gibi sabit metinler çevrilir mi?",
    answer: [
      T("Evet. Menünün sabit arayüz metinleri hazır bir listeyle gelir; ek metinleri elle listeye yazabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-metin-toplama",
    categoryId: "dil-alerjen",
    question: "Henüz çevrilmemiş metinleri nasıl bulurum?",
    answer: [
      T("Metin toplama özelliği, sitede henüz çevrilmemiş sabit metinleri bulur ve listeye ekler. Sonraki dışa aktarımda bu metinler CSV’ye çıkar."),
    ],
  },
  {
    id: "qrmo-faq-q-csv-ayrac",
    categoryId: "dil-alerjen",
    question: "Çeviri CSV dosyasında hangi ayraç kullanılır?",
    answer: [
      T("Dosya virgül veya noktalı virgül ayracıyla indirilebilir; Google E-Tablolar için virgül önerilir. Doldurduğunuz dosyayı yüklerken ayraç otomatik algılanır."),
    ],
  },
  {
    id: "qrmo-faq-q-ceviri-durumu",
    categoryId: "dil-alerjen",
    question: "Çevirilerin eksik veya eski olduğunu görebilir miyim?",
    answer: [
      T("Evet. Sistem durumu ekranında her dil için kaç çeviri yazıldığı, hangilerinin eskidiği veya yetim kaldığı görünür."),
    ],
  },
  {
    id: "qrmo-faq-q-dil-arama-motoru",
    categoryId: "dil-alerjen",
    question: "Seçilen dil arama motorlarında görünür mü?",
    answer: [
      T("Seçilen dil adreste yer alır (örneğin ?lang=en) ve alternatif dil etiketleri (hreflang) yayınlanır. Bu, çevrilmiş sayfaların arama motorlarınca ayrı adres olarak görülmesi içindir."),
    ],
  },
  {
    id: "qrmo-faq-q-alerjen-sayisi",
    categoryId: "dil-alerjen",
    question: "Kaç alerjen tanımı hazır gelir?",
    answer: [
      T("14 hazır alerjen tanımı vardır ve ürünlere atanır. Malzemeleri ayrıca tanımlarsınız."),
    ],
  },
  {
    id: "qrmo-faq-q-alerjen-haric-tutma",
    categoryId: "dil-alerjen",
    question: "Müşteri belirli alerjenleri içeren ürünleri nasıl hariç tutar?",
    answer: [
      T("Filtre panelinde 14 alerjen için ayrı kart bulunur. Müşteri bir kartı seçtiğinde o alerjeni içeren ürünler sonuçtan çıkar."),
    ],
  },
  {
    id: "qrmo-faq-q-kalori-fiyat-filtre",
    categoryId: "dil-alerjen",
    question: "Kalori ve fiyat aralığına göre filtreleme yapılabilir mi?",
    answer: [
      T("Evet. En az ve en çok kalori (kcal) ile en az ve en çok fiyat girilebilir. Kalorisi girilmemiş ürün, kalori filtresi kullanıldığında sonuçta yer almaz."),
    ],
  },
  {
    id: "qrmo-faq-q-siralama-olcutleri",
    categoryId: "dil-alerjen",
    question: "Ürünler hangi ölçütlerle sıralanabilir?",
    answer: [
      T("Önerilen sıra, A→Z, ucuzdan pahalıya, pahalıdan ucuza, en proteinli, en az karbonhidratlı, en acı ve en az acı ölçütleriyle sıralanabilir."),
    ],
  },
  {
    id: "qrmo-faq-q-alerjen-tibbi-guvence",
    categoryId: "dil-alerjen",
    question: "Alerjen filtresi sağlık açısından kesin güvence verir mi?",
    answer: [
      T("Hayır. Alerjen filtresi bir yardımcıdır ve girdiğiniz verilere dayanır. Ciddi alerji durumunda müşteriyi ekibinize danışmaya yönlendirmenizi öneririz."),
    ],
  },

  /* —— Menü Asistanı & AI: ek sorular —— */
  {
    id: "qrmo-faq-q-asistan-kaynak",
    categoryId: "menu-asistani",
    question: "Menü Asistanı yanıtlarını nereden alır?",
    answer: [
      T("Yanıtlar menünüzdeki ürün, fiyat ve açıklamalara ve restoran bilgilerine dayandırılır. Menüde olmayan ürün veya fiyat uydurmaması talimat olarak verilir."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-bilmiyorsa",
    categoryId: "menu-asistani",
    question: "Menüde karşılığı olmayan bir soru sorulursa ne olur?",
    answer: [
      T("Asistan bilmediğini belirtir. Bu sorular “Cevaplanamayan Sorular” listesine düşer."),
    ],
  },
  {
    id: "qrmo-faq-q-cevaplanamayan-liste",
    categoryId: "menu-asistani",
    question: "Cevaplanamayan soruları ne için kullanabilirim?",
    answer: [
      T("Müşterilerin sorup menüde karşılık bulamadığı soruları listeden görebilir, menü bilgilerinizi bu doğrultuda tamamlayabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-urun-onerisi",
    categoryId: "menu-asistani",
    question: "Asistan ürün önerir mi?",
    answer: [
      T("Evet. Menüdeki ürünleri önerir. Hangi ürünlerin önerileceğini Ürün Önerileri ekranından yönetirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-oneri-raporu",
    categoryId: "menu-asistani",
    question: "Öneri Raporu ne gösterir?",
    answer: [
      T("Öneri Raporu, asistanın önerilerinin sepete ve siparişe yansımasını gösterir."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-tukenen-urun",
    categoryId: "menu-asistani",
    question: "Asistan tükenen ürün için sipariş oluşturur mu?",
    answer: [
      T("Hayır. Tükendi işaretli bir ürün için sipariş oluşturmaz."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-garson-hesap",
    categoryId: "menu-asistani",
    question: "Asistan üzerinden garson çağrılabilir mi?",
    answer: [
      T("Evet. Sohbetten garson çağırma ve hesap isteme tetiklenebilir; talepler servis paneline düşer. Bu akışlar Pro paketteki servis özellikleriyle birlikte çalışır."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-siparis",
    categoryId: "menu-asistani",
    question: "Asistan sipariş alabilir mi?",
    answer: [
      T("Evet; sipariş ürün, adet ve toplam özetiyle ve müşterinin açık onayıyla ilerler. Onay ifadesi yoksa sipariş yürürlüğe girmez."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-profil",
    categoryId: "menu-asistani",
    question: "Asistanın adı ve görünümü değiştirilebilir mi?",
    answer: [
      T("Evet. Asistanın adını, karşılama mesajını, simgesini ve renklerini belirlersiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-hazir-sorular",
    categoryId: "menu-asistani",
    question: "Müşterinin tek dokunuşla soracağı hazır sorular tanımlanabilir mi?",
    answer: [
      T("Evet. Asistan ekranında müşterinin tek dokunuşla sorabileceği hazır soruları tanımlayabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-gorunurluk",
    categoryId: "menu-asistani",
    question: "Asistanın kimlere ve ne zaman gösterileceğini seçebilir miyim?",
    answer: [
      T("Evet. Asistanın hangi müşterilere, hangi cihazlarda ve hangi saatlerde gösterileceğini belirlersiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-sohbet-gecmisi",
    categoryId: "menu-asistani",
    question: "Müşteri sohbetlerini inceleyebilir miyim?",
    answer: [
      T("Evet. Geçmiş görüşmeleri incelersiniz; insan desteği gereken görüşmeleri devralıp müşteriyle doğrudan yazışabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-yanitlanmayacak-kelimeler",
    categoryId: "menu-asistani",
    question: "Asistanın yanıtlamayacağı kelimeler tanımlanabilir mi?",
    answer: [
      T("Evet. Yanıtlanmayacak kelimeleri tanımlarsınız; bu kelimeleri içeren mesaja sabit bir yanıt verilir."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-hata-payi",
    categoryId: "menu-asistani",
    question: "Asistanın yanıtları hatalı veya eksik olabilir mi?",
    answer: [
      T("Evet. Yapay zekâ yanıtları hatalı veya eksik olabilir. Asistan yalnızca menünüze ve girdiğiniz bilgiye dayanır; eksik bilgi eksik yanıt üretir."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-saglik",
    categoryId: "menu-asistani",
    question: "Asistanın alerjen konusundaki yanıtı tıbbi tavsiye midir?",
    answer: [
      T("Hayır. Alerjen ve sağlık konularında verdiği yanıt tıbbi tavsiye değildir; menüde girdiğiniz veriyi yansıtır."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-anahtar",
    categoryId: "menu-asistani",
    question: "Asistanın çalışması için ne gerekir?",
    answer: [
      T("Yönetim ekranında tanımlı bir Gemini API anahtarı gerekir; anahtar yoksa asistan yanıt veremez. Anahtar Google AI Studio’dan alınır."),
    ],
  },

  /* —— QR Analytics & Menü Mühendisliği: ek sorular —— */
  {
    id: "qrmo-faq-q-analytics-genel-bakis",
    categoryId: "analytics-muhendislik",
    question: "Analytics genel bakışta hangi göstergeler yer alır?",
    answer: [
      T("Menü görüntüleme, ürün tıklama, tekil ziyaretçi ve aktif masa sayısı gösterilir; günlük, haftalık, aylık ve saatlik grafikle izlenir."),
    ],
  },
  {
    id: "qrmo-faq-q-aktif-masa-sayisi",
    categoryId: "analytics-muhendislik",
    question: "Aktif masa sayısı ne anlama gelir?",
    answer: [
      T("Seçili tarih aralığında en az bir hareket kaydeden masaların sayısıdır. Şu anki anlık durumu göstermez."),
    ],
  },
  {
    id: "qrmo-faq-q-tarih-araligi",
    categoryId: "analytics-muhendislik",
    question: "Hangi tarih aralıkları seçilebilir?",
    answer: [
      T("Günlük, haftalık, aylık ve saatlik görünümler vardır. Özel tarih aralığı en fazla 31 gün olabilir."),
    ],
  },
  {
    id: "qrmo-faq-q-onceki-donem",
    categoryId: "analytics-muhendislik",
    question: "Göstergeler önceki dönemle karşılaştırılır mı?",
    answer: [
      T("Evet. Göstergeler önceki eşit uzunluktaki dönemle karşılaştırılır."),
    ],
  },
  {
    id: "qrmo-faq-q-urun-raporu",
    categoryId: "analytics-muhendislik",
    question: "En çok ve en az tıklanan ürünleri görebilir miyim?",
    answer: [
      T("Evet. Ürünler raporunda en çok ve en az tıklanan ürünler, kategori dağılımı, ürün detayının açılma oranı ve filtre kullanımı gösterilir."),
    ],
  },
  {
    id: "qrmo-faq-q-masa-raporu",
    categoryId: "analytics-muhendislik",
    question: "Masalara göre hareket raporu neyi gösterir?",
    answer: [
      T("Hangi masadan kaç hareket geldiğini, masa gruplarını ve hiç okutulmayan masaları listeler. Masasız (doğrudan) erişim ayrı görünür."),
    ],
  },
  {
    id: "qrmo-faq-q-sepet-hunisi",
    categoryId: "analytics-muhendislik",
    question: "Sepet hunisi nedir?",
    answer: [
      T("Sepete eklenen, gönderilen ve terk edilen siparişleri dönüşüm hunisinde gösteren rapordur. Sipariş özelliklerinin (Pro) kullanılmasına bağlıdır."),
    ],
  },
  {
    id: "qrmo-faq-q-engellenen-siparis",
    categoryId: "analytics-muhendislik",
    question: "Tükendi nedeniyle engellenen siparişler raporlanır mı?",
    answer: [
      T("Evet. Tükendi olduğu için engellenen siparişler ve sipariş hataları ayrı raporlanır."),
    ],
  },
  {
    id: "qrmo-faq-q-analytics-csv",
    categoryId: "analytics-muhendislik",
    question: "Analytics raporları indirilebilir mi?",
    answer: [
      T("Evet. Rapor sayfaları CSV olarak indirilebilir."),
    ],
  },
  {
    id: "qrmo-faq-q-ham-kayit-saklama",
    categoryId: "analytics-muhendislik",
    question: "Ham kayıtlar ne kadar süre saklanır?",
    answer: [
      T("Saklanacak gün sayısını siz ayarlarsınız; süresi dolan kayıtlar günlük görevle silinir. 0 yazarsanız temizlik kapanır."),
    ],
  },
  {
    id: "qrmo-faq-q-tekil-ziyaretci",
    categoryId: "analytics-muhendislik",
    question: "Tekil ziyaretçi nasıl hesaplanır?",
    answer: [
      T("IP adresinin özetine göre hesaplanır. Aynı ağdan bağlanan farklı kişiler tek sayılabilir."),
    ],
  },
  {
    id: "qrmo-faq-q-analytics-tahmin-yok",
    categoryId: "analytics-muhendislik",
    question: "Analytics tahmin veya yapay zekâ analizi yapar mı?",
    answer: [
      T("Hayır. Bu bir geçmiş kullanım raporudur; tahmin veya yapay zekâ analizi içermez. Az ziyaret alan bir menüde raporlar da az veri gösterir."),
    ],
  },
  {
    id: "qrmo-faq-q-matris-gruplari",
    categoryId: "analytics-muhendislik",
    question: "Menü mühendisliği matrisinde hangi gruplar vardır?",
    answer: [
      T("Dört grup vardır: Yıldız (çok satıyor, çok kazandırıyor), Çok Satan (çok satıyor, az kazandırıyor), Gizli Fırsat (kârlı ama az satıyor) ve Zayıf Performans. Her grup için genel bir yönlendirme cümlesi yazılır; sonuç garantisi verilmez."),
    ],
  },
  {
    id: "qrmo-faq-q-recete-maliyeti",
    categoryId: "analytics-muhendislik",
    question: "Ürün maliyeti reçeteden nasıl hesaplanır?",
    answer: [
      T("Ürünün reçetesine malzeme ve miktar satırları girilir; maliyet malzeme birim fiyatlarından hesaplanır. Birim fiyat kg, litre veya adet üzerinden, reçete miktarı gram, ml veya adet olarak girilir. İsterseniz 0–50 arası fire yüzdesi de eklenir; maliyeti doğrudan da yazabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-maliyetsiz-urun",
    categoryId: "analytics-muhendislik",
    question: "Maliyeti girilmeyen ürün matrise alınır mı?",
    answer: [
      T("Hayır. Fiyatı veya maliyeti girilmeyen ürün matrise alınmaz; bu ürünler ayrı bir eksik maliyet listesinde gösterilir."),
    ],
  },
  {
    id: "qrmo-faq-q-satis-verisi-az",
    categoryId: "analytics-muhendislik",
    question: "Satış verisi azsa popülerlik nasıl belirlenir?",
    answer: [
      T("Satış verisi sipariş akışından gelir. Toplam satış 20 adedin altındaysa popülerlik, görüntülenme ve sepete ekleme verisiyle tahmin edilir; rapor bunu ekranda açıkça belirtir."),
    ],
  },

  /* —— Güvenlik & Teknik: ek sorular —— */
  {
    id: "qrmo-faq-q-masa-oturumu-nedir",
    categoryId: "guvenlik-teknik",
    question: "Masa oturumu nedir?",
    answer: [
      T("QR kod okutulduğunda başlayan, masaya bağlı imzalı bir oturumdur. Menü Asistanı ve sepet gibi bileşenler sayfaya değil, bu oturuma bağlıdır."),
    ],
  },
  {
    id: "qrmo-faq-q-oturum-imza",
    categoryId: "guvenlik-teknik",
    question: "Oturum nasıl imzalanır?",
    answer: [
      T("Masa adı, veriliş zamanı ve son işlem zamanı HMAC-SHA256 ile imzalanır."),
    ],
  },
  {
    id: "qrmo-faq-q-baska-masa-oturumu",
    categoryId: "guvenlik-teknik",
    question: "Müşteri başka bir masa adına oturum oluşturabilir mi?",
    answer: [
      T("Hayır. Oturum imzalı olduğu için müşteri başka bir masa adına oturum oluşturamaz."),
    ],
  },
  {
    id: "qrmo-faq-q-oturum-suresi",
    categoryId: "guvenlik-teknik",
    question: "Masa oturumu ne kadar sürer?",
    answer: [
      T("QR okutulduktan sonra oturumun toplam ömrü varsayılan olarak 90 dakikadır. Süreyi sizin ayarlarınız belirler."),
    ],
  },
  {
    id: "qrmo-faq-q-hareketsizlik-limiti",
    categoryId: "guvenlik-teknik",
    question: "Hareketsizlik limiti nedir?",
    answer: [
      T("Belirlenen süre işlem yapılmazsa oturum kilitlenir; varsayılan süre 30 dakikadır. Sayaç sayfa gezinmesinde de yenilenir."),
    ],
  },
  {
    id: "qrmo-faq-q-kayitsiz-masa",
    categoryId: "guvenlik-teknik",
    question: "Kayıtlı olmayan bir masa adresiyle girilirse ne olur?",
    answer: [
      T("Adreste kayıtlı olmayan bir masa varsa kilit ekranı gösterilir. Kilit ekranı, adres, çerez ve tarayıcı diline göre seçilen aktif dilde açılır."),
    ],
  },
  {
    id: "qrmo-faq-q-menu-herkese-acik-mi",
    categoryId: "guvenlik-teknik",
    question: "Menü herkese açık mıdır?",
    answer: [
      T("Evet; menü varsayılan olarak herkese açıktır. Oturum, çağrı, sipariş ve sohbet gibi masaya bağlı özellikler korunur."),
    ],
  },
  {
    id: "qrmo-faq-q-oturum-gerektiren",
    categoryId: "guvenlik-teknik",
    question: "Hangi özellikler geçerli oturum ister?",
    answer: [
      T("Menü Asistanı ve sepet gibi bileşenler oturuma bağlıdır; geçerli oturum yoksa bilgi kutusu gösterilir."),
    ],
  },
  {
    id: "qrmo-faq-q-sayfa-kilidi",
    categoryId: "guvenlik-teknik",
    question: "Belirli sayfalar kilitlenebilir mi?",
    answer: [
      T("Evet; isteğe bağlı sayfa kilidi için korunacak sayfa adreslerini yazarsınız. Boş bırakılırsa sayfa kilidi kapalıdır. Ana sayfa hiçbir koşulda kilitlenmez."),
    ],
  },
  {
    id: "qrmo-faq-q-mutlak-guvenlik",
    categoryId: "guvenlik-teknik",
    question: "Bu güvenlik mekanizması mutlak koruma sağlar mı?",
    answer: [
      T("Hayır. Mekanizma masayı QR kodu okutan kişiye bağlar ve oturumu süreyle sınırlar; mutlak bir güvenlik vaadi değildir."),
    ],
  },
  {
    id: "qrmo-faq-q-wp-php-surum",
    categoryId: "guvenlik-teknik",
    question: "Hangi WordPress ve PHP sürümleri gerekir?",
    answer: [
      T("WordPress 6.0 ve üzeri ile PHP 7.4 ve üzeri sürümleri gerekir."),
    ],
  },
  {
    id: "qrmo-faq-q-lisans-alan-adi",
    categoryId: "guvenlik-teknik",
    question: "Lisans anahtarı neye bağlıdır?",
    answer: [
      T("Lisans anahtarı alan adına bağlıdır. Modüller lisansa göre açılır; paketinizde olmayan modül kapalı görünür."),
    ],
  },
  {
    id: "qrmo-faq-q-menu-yedekleme-teknik",
    categoryId: "guvenlik-teknik",
    question: "Menü verisi nasıl yedeklenir?",
    answer: [
      T("Menü ürünleri JSON olarak dışa aktarılabilir. Geri yüklerken ürün kimliğiyle eşleşen kayıtların üzerine yazılır."),
    ],
  },
  {
    id: "qrmo-faq-q-analytics-saklama-teknik",
    categoryId: "guvenlik-teknik",
    question: "Analytics verisi ne kadar saklanır?",
    answer: [
      T("Ham kayıtların saklanacağı gün sayısını ayarlarsınız; süresi dolanlar günlük görevle silinir. 0 yazarsanız temizlik kapanır."),
    ],
  },
  {
    id: "qrmo-faq-q-kisisel-veri-sorumlulugu",
    categoryId: "guvenlik-teknik",
    question: "Yorum ve form verilerindeki kişisel verilerden kim sorumludur?",
    answer: [
      T("Yorumlar ve form gönderimleri müşteri verisi içerebilir; aydınlatma ve saklama yükümlülükleri işletmenin sorumluluğundadır. Onay metni ve aydınlatma sayfası bağlantısı eklenebilir; kişisel veri dışa aktarma ve silme araçları bulunur."),
    ],
  },
  {
    id: "qrmo-faq-q-spam-korumasi",
    categoryId: "guvenlik-teknik",
    question: "Spam yorumlara karşı koruma var mı?",
    answer: [
      T("Yorum formu basit bir doğrulama sorusuyla spam’e karşı korunur. Yorumların yayına alınma biçimini de ayarlarsınız."),
    ],
  },

  /* —— Paketler & Fiyatlar: ek sorular —— */
  {
    id: "qrmo-faq-q-temel-icerik",
    categoryId: "paketler-fiyat",
    question: "Temel pakette neler var?",
    answer: [
      T("Dijital QR menü, panelden ürün ve fiyat yönetimi, CSV ile ürün aktarma, porsiyon ve ekstra, ürün rozetleri, kampanya ve kombo, akıllı filtreleme, çoklu dil ve QR masa Temel pakettedir."),
    ],
  },
  {
    id: "qrmo-faq-q-pro-icerik",
    categoryId: "paketler-fiyat",
    question: "Pro pakette Temel’e ek olarak neler var?",
    answer: [
      T("Açılış ekranı, QR ile sipariş, servis paneli, garson çağrısı, hesap talebi, personel ve servis rolleri ile masa oturum güvenliği Pro pakette Temel’e ek olarak gelir."),
    ],
  },
  {
    id: "qrmo-faq-q-plus-icerik",
    categoryId: "paketler-fiyat",
    question: "Plus pakette Pro’ya ek olarak neler var?",
    answer: [
      T("Menü analitiği, yorum ve geri bildirim, menü mühendisliği, maliyet ve reçete ile Menü Asistanı Plus pakette Pro’ya ek olarak gelir."),
    ],
  },
  {
    id: "qrmo-faq-q-dil-filtre-masa-paket",
    categoryId: "paketler-fiyat",
    question: "Çoklu dil, akıllı filtreleme ve QR masa hangi paketlerde var?",
    answer: [
      T("Üçü de Temel pakette bulunur ve Pro ile Plus paketlerinde de yer alır."),
    ],
  },
  {
    id: "qrmo-faq-q-garson-hesap-paket",
    categoryId: "paketler-fiyat",
    question: "Garson çağrısı ve hesap talebi hangi paketlerde var?",
    answer: [
      T("Pro paketten itibaren vardır; yani Pro ve Plus paketlerinde bulunur, Temel pakette yoktur."),
    ],
  },
  {
    id: "qrmo-faq-q-siparis-paket",
    categoryId: "paketler-fiyat",
    question: "QR ile sipariş hangi paketlerde var?",
    answer: [
      T("QR ile sipariş Pro paketten itibaren vardır; Pro ve Plus paketlerinde bulunur. Temel pakette sipariş özelliği yoktur."),
    ],
  },
  {
    id: "qrmo-faq-q-servis-paneli-paket",
    categoryId: "paketler-fiyat",
    question: "Servis paneli ve personel rolleri hangi paketlerde var?",
    answer: [
      T("Servis paneli ile personel ve servis rolleri Pro paketten itibaren vardır; Pro ve Plus paketlerinde bulunur."),
    ],
  },
  {
    id: "qrmo-faq-q-asistan-paket",
    categoryId: "paketler-fiyat",
    question: "Menü Asistanı hangi pakette var?",
    answer: [
      T("Menü Asistanı Plus paketin kapsamındadır. Asistanın garson, hesap ve sipariş akışları Pro paketteki servis özellikleriyle birlikte çalışır."),
    ],
  },
  {
    id: "qrmo-faq-q-analytics-geri-bildirim-paket",
    categoryId: "paketler-fiyat",
    question: "QR Analytics ile yorum ve geri bildirim hangi pakette var?",
    answer: [
      T("İkisi de Plus paketin kapsamındadır."),
    ],
  },
  {
    id: "qrmo-faq-q-muhendislik-paket",
    categoryId: "paketler-fiyat",
    question: "Menü mühendisliği ile maliyet ve reçete hangi pakette var?",
    answer: [
      T("İkisi de Plus paketin kapsamındadır."),
    ],
  },
  {
    id: "qrmo-faq-q-oturum-guvenligi-paket",
    categoryId: "paketler-fiyat",
    question: "Masa oturum güvenliği hangi paketlerde var?",
    answer: [
      T("Masa oturum güvenliği Pro paketten itibaren vardır; Pro ve Plus paketlerinde bulunur."),
    ],
  },
  {
    id: "qrmo-faq-q-yillik-tutarlar",
    categoryId: "paketler-fiyat",
    question: "Yıllık ödeme tutarları nedir?",
    answer: [
      T("Yıllık tutarlar Temel için 7.490 TL, Pro için 14.900 TL ve Plus için 29.900 TL’dir. Yıllık planda 12 ay kullanım için 10 aylık ödeme esası uygulanır."),
    ],
  },
  {
    id: "qrmo-faq-q-ust-paket-icerir",
    categoryId: "paketler-fiyat",
    question: "Üst paket, alt paketin özelliklerini de içerir mi?",
    answer: [
      T("Evet. Her üst paket bir alt paketin modüllerini içerir; Pro, Temel’in; Plus ise Pro’nun üzerine ek özellikler getirir."),
    ],
  },
  {
    id: "qrmo-faq-q-satin-alma-nasil",
    categoryId: "paketler-fiyat",
    question: "Paket başvurusu nasıl yapılır?",
    answer: [
      T("Satın alma paketler sayfasında tamamlanmaz; paket düğmesi ödeme almaz, iletişim formunu açar. Paket başvurusu için iletişim kanallarını kullanabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-paket-yardim",
    categoryId: "paketler-fiyat",
    question: "Paket seçerken nereden yardım alabilirim?",
    answer: [
      T("İletişim sayfasındaki talep formunu veya iletişim kanallarını kullanarak ekibimizden paket seçimi için yardım alabilirsiniz."),
    ],
  },
  {
    id: "qrmo-faq-q-temel-kimler-icin",
    categoryId: "paketler-fiyat",
    question: "Temel paket kimler için uygundur?",
    answer: [
      T("Menüsünü dijitalleştirmek isteyen işletmeler içindir. Ürün, fiyat, dil ve QR masa yeterliyse Temel paket yeterlidir; garson çağrısı, sipariş ve servis paneli bu pakette yoktur."),
    ],
  },
  {
    id: "qrmo-faq-q-pro-kimler-icin",
    categoryId: "paketler-fiyat",
    question: "Pro paket kimler için uygundur?",
    answer: [
      T("Masa ve servis akışını düzenlemek isteyen işletmeler içindir. Garson çağrısı, hesap talebi ve sipariş servis panelinde toplanacaksa Pro paket yeterlidir; Temel’deki menü de açıktır."),
    ],
  },
  {
    id: "qrmo-faq-q-plus-kimler-icin",
    categoryId: "paketler-fiyat",
    question: "Plus paket kimler için uygundur?",
    answer: [
      T("İşletmesini veriyle geliştirmek isteyen işletmeler içindir. Menü analitiği, geri bildirim, maliyet, reçete ve Menü Asistanı da gerekiyorsa Plus paket bu araçları Pro paketin üzerine ekler."),
    ],
  },
];

export function assertFaqData() {
  const qSet = new Set();
  const idSet = new Set();
  const catIds = new Set(FAQ_CATEGORIES.map((c) => c.id));
  for (const item of FAQ_ITEMS) {
    if (qSet.has(item.question)) throw new Error(`Duplicate question: ${item.question}`);
    qSet.add(item.question);
    if (idSet.has(item.id)) throw new Error(`Duplicate id: ${item.id}`);
    idSet.add(item.id);
    if (!catIds.has(item.categoryId)) throw new Error(`Unknown category: ${item.categoryId}`);
    if (!item.answer.length) throw new Error(`Empty answer: ${item.id}`);
    for (const part of item.answer) {
      if (part.type === "link" && !ALLOWED_LINK_HREFS.has(part.href)) {
        throw new Error(`Disallowed link ${part.href} in ${item.id}`);
      }
    }
  }
  const counts = Object.fromEntries(FAQ_CATEGORIES.map((c) => [c.id, 0]));
  for (const item of FAQ_ITEMS) counts[item.categoryId]++;
  for (const [id, n] of Object.entries(counts)) {
    if (n < MIN_PER_CATEGORY) {
      throw new Error(`Category ${id}: expected at least ${MIN_PER_CATEGORY} items, got ${n}`);
    }
  }
}

assertFaqData();
