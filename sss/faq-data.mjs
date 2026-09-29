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
    "QR menü, sipariş, garson çağrısı, çoklu dil, Menü Asistanı, analytics ve paketler hakkında 50 kısa cevap. Ürünün gerçek özelliklerine dayanır.",
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
      T(
        "Evet. Ürün listesi noktalı virgül veya virgül ayraçlı CSV ile toplu yüklenebilir; aynı başlık ve kategori anahtarıyla eşleşen satırlar güncellenir, yeni satırlar eklenir. Geçersiz fiyatlı satırlar atlanır; sonuç ekranında kaç kaydın eklendiği veya güncellendiği bildirilir."
      ),
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
      T(
        "Kampanya modülüyle belirli ürün veya kapsamlar için fiyat artışı veya indirim tanımlanabilir; durumu panelden açıp kapatabilirsiniz. Saat ve gün bazlı otomatik zamanlama altyapısı kodda vardır, ancak yönetim arayüzünde her senaryo henüz sunulmayabilir — kampanyayı aktif ettiğinizde geçerli kurallar menüde uygulanır."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-arama-siralama",
    categoryId: "menu-urun",
    question: "Menüde arama ve sıralama var mı?",
    answer: [
      T(
        "Evet. Müşteri menü içinde metin araması yapabilir; sıralama seçenekleri (örneğin fiyat veya isim) menü ayarlarına bağlıdır. Bu, uzun listelerde ürün bulmayı kolaylaştırır."
      ),
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
    question: "Masayı kapatmak oturumu ne yapar?",
    answer: [
      T(
        "Masa kapatıldığında o masaya bağlı eski oturum belirteçleri geçersiz olur; yeni müşteri QR okutunca yeni oturum başlar. Bu, bitmiş hesabın yanlışlıkla devam etmesini engellemeye yardımcı olur."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-masa-sayisi",
    categoryId: "qr-masa",
    question: "Kaç masa tanımlanabilir?",
    answer: [
      T(
        "Masa kayıtları panelden eklenir; pratik üst sınır işletmenizin ihtiyacına ve barındırma kapasitesine bağlıdır. Paketinizde QR masa modülü açıksa tüm masalarınızı aynı akışla yönetebilirsiniz."
      ),
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
        "Evet. Müşteri menüden garson çağrısı gönderir; talep servis paneline düşer. Yanıt süresi personel yoğunluğunuza bağlıdır — sistem çağrıyı kaydeder ve bildirir, servis hızını tek başına garanti etmez."
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
        "Hayır. Ürün sipariş, çağrı ve menü etkileşimi sunar; kartla veya cüzdanla online tahsilat altyapısı içermez. Açılış ekranında kabul ettiğiniz ödeme yöntemleri bilgi amaçlı gösterilebilir, ancak tahsilat menü içinde yapılmaz."
      ),
    ],
  },
  {
    id: "qrmo-faq-q-siparis-servis-paneli",
    categoryId: "siparis-servis",
    question: "Sipariş ve çağrılar ekibe nasıl ulaşır?",
    answer: [
      T(
        "Gelen sipariş ve çağrılar servis panelinde listelenir; sesli uyarı ve tarayıcı bildirimi açılabilir. Personel ekrandan talebi görüp operasyonel olarak karşılar. "
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
    question: "QR menüde vegan ürünler filtrelenebilir mi?",
    answer: [
      T(
        "Evet. Vegan, vejetaryen, glutensiz gibi filtreler ürün meta verisine göre çalışır; ürünü vegan olarak işaretlemediyseniz filtrede görünmez. "
      ),
      L("/moduller/akilli-filtreleme/", "Akıllı filtreleme"),
      T(" hangi filtrelerin mevcut olduğunu özetler."),
    ],
  },
  {
    id: "qrmo-faq-q-filtre-veri",
    categoryId: "dil-alerjen",
    question: "Filtreler hangi verilere dayanır?",
    answer: [
      T(
        "Otomatik tahmin yapmaz. Alerjen taksonomisi, vegan/vejetaryen bayrakları ve benzeri alanlar panelde doldurulduğunda filtreler devreye girer. Eksik veri, filtrenin o ürünü göstermemesi anlamına gelir."
      ),
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
    question: "Menü Asistanı kullanım limitleri nelerdir?",
    answer: [
      T(
        "Kötüye kullanımı önlemek için varsayılan sınırlar vardır: oturum başına yaklaşık 25 mesaj, IP başına saatlik 120 istek ve günlük toplam 2000 soru bandı (ayarlarla değiştirilebilir). Dakika başına kısa süreli ek sınır da uygulanabilir."
      ),
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
      T(
        "Güncel liste fiyatları (TL): Temel aylık 749 / yıllık 7.490; Pro aylık 1.490 / yıllık 14.900; Plus aylık 2.990 / yıllık 29.900. Yıllık planda 12 ay kullanım için 10 ay ödeme modeli uygulanır. Vergi ve fatura koşulları için "
      ),
      L("/paketler/", "paketler sayfasındaki"),
      T(" güncel notlara bakın."),
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
      T(
        "Temel dijital menü çekirdeğini; Pro masa servisi ve servis panelini; Plus ise analytics, geri bildirim, maliyet/recete analizi ve Menü Asistanını ekler. Her üst paket bir alt paketin modüllerini içerir — ayrıntılı liste "
      ),
      L("/paketler/", "paketler"),
      T(" karşılaştırmasında."),
    ],
  },
];

export function assertFaqData() {
  if (FAQ_ITEMS.length !== 50) {
    throw new Error(`Expected 50 FAQ items, got ${FAQ_ITEMS.length}`);
  }
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
  const expected = {
    "qr-nedir": 6,
    "menu-urun": 7,
    "qr-masa": 6,
    "siparis-servis": 6,
    "dil-alerjen": 6,
    "menu-asistani": 5,
    "analytics-muhendislik": 6,
    "guvenlik-teknik": 4,
    "paketler-fiyat": 4,
  };
  for (const [id, n] of Object.entries(expected)) {
    if (counts[id] !== n) {
      throw new Error(`Category ${id}: expected ${n} items, got ${counts[id]}`);
    }
  }
}

assertFaqData();
