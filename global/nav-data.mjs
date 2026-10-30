/* =========================================================
   QR MENU OFFICIAL — GLOBAL HEADER / FOOTER: TEK VERİ KAYNAĞI
   Bağlantılar `rel` (sayfanın kök dizine göre göreli yolu) ile birleştirilir;
   böylece site alt dizinde de (GitHub Pages /anasite/) kökte de çalışır.
   Modül adları, kategorileri ve cümleleri moduller/module-data.js'ten gelir.
   ========================================================= */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const MOD = require("../moduller/module-data.js");

export const SITE = {
  brand: "QR Menu Official",
  wordmark: "QR MENU OFFICIAL",
  tagline: "Menü, garson çağrısı ve servis paneli tek sistemde.",
  logo: "assets/brand/qr-menu-official-logo-v4.svg",
  logoCompact: "assets/brand/qr-menu-official-logo-v4-compact.svg",
  year: new Date().getFullYear()
};

/**
 * Dönüşüm CTA'ları — href boşken ve path yokken UI görünür kalır, sahte URL üretilmez.
 * `href` olduğu gibi yazılır (mutlak veya harici adres). Site içi sayfalar `path` alır;
 * render katmanı bunu sayfa derinliğine göre göreli yola çevirir (`iletisim/` → `../../iletisim/`).
 *
 * Slot → kullanım:
 *   primary    — İletişime Geçin (header, hero, footer) → /iletisim/
 *   secondary  — Canlı Menüyü Gör → /canli-menu/ (demo adresleri o sayfada)
 *   packagesLink — Paketleri İnceleyin (path)
 *   contact    — Bize Ulaşın → /iletisim/
 *   transition — Geçiş İçin Bilgi Alın → /iletisim/#talep (S9 kaldırıldı; slot yedek)
 *   final      — Geçiş İçin Bilgi Alın (S12) → /iletisim/#talep (index.html'de doğrudan <a>)
 */
export const CONVERSION = {
  primary: { label: "İletişime Geçin", href: "", path: "iletisim/" },
  secondary: { label: "Canlı Menüyü Gör", href: "", path: "canli-menu/" },
  packagesLink: { label: "Paketleri İnceleyin", path: "paketler/" },
  contact: {
    label: "Bize Ulaşın",
    href: "",
    path: "iletisim/"
  },
  transition: { label: "Geçiş İçin Bilgi Alın", href: "", path: "iletisim/#talep" },
  final: { label: "Geçiş İçin Bilgi Alın", href: "", path: "iletisim/#talep" }
};

/** Pending CTA tıklanınca gösterilen metinler (frontend; build ile qrmo-conversion-config.js). */
export const CONVERSION_PENDING = {
  default: "Bu bağlantı henüz etkin değil.",
  primary:
    "Bu bağlantı henüz etkin değil. Görüşme kanalı yakında eklenecek.",
  secondary: "Canlı menü adresi henüz tanımlanmadı.",
  transition: "Bu adım henüz etkin değil; iletişim kanalı yakında eklenecek.",
  final: "Bu adım henüz etkin değil; iletişim kanalı yakında eklenecek."
};

/* Header çubuk CTA (primary dönüşüm) */
export const CTA = { label: CONVERSION.primary.label, href: CONVERSION.primary.href };

/* Masaüstü / drawer ana gezinme (HEADER V3 hiyerarşisi, gerçek yollar) */
export const NAV = [
  { key: "home", label: "Ana Sayfa", path: "", drawerSubtitle: "QR Menu Official dünyasını keşfedin" },
  { key: "moduller", label: "Çözümler", path: "moduller/", drawerSubtitle: "İşletmeniz için akıllı dijital araçlar" },
  { key: "paketler", label: "Paketler & Fiyatlar", path: "paketler/", drawerSubtitle: "İşletmenize uygun planı seçin" },
  {
    key: "canli",
    label: CONVERSION.secondary.label,
    conversionSlot: "secondary",
    drawerSubtitle: "Demo menüyü telefonunuzda deneyin"
  },
  { key: "sss", label: "S.S.S.", drawerLabel: "Sıkça Sorulan Sorular", path: "sss/", drawerSubtitle: "Karar vermeden önce sorulanlar" }
  /* "Bize Ulaşın" burada yok: birincil CTA (İletişime Geçin) zaten /iletisim/'e gider; iki ayrı bağlantı aynı sayfaya gitmesin. */
];

export const DRAWER = {
  eyebrow: "RESTORANLAR İÇİN DİJİTAL ÇÖZÜMLER",
  titleLine1: "Restoranınızı",
  titleLine2: "Dijitalde Büyütün.",
  description:
    "Menü, masa ve servis tek sistemde: misafir kendi dilinde seçer, ekibiniz talepleri tek panelden yönetir.",
  solutionsHeading: "Çözümlerimiz",
  trustTitle: "Neden QR Menu Official?",
  trustItems: [
    "Misafir uygulama indirmeden, tarayıcıdan açar",
    "Fiyat ve ürünleri tek panelden güncellersiniz",
    "Temel, Pro ve Plus: işletmenize uygun paket"
  ],
  bottomNote: ""
};

/* Drawer çözümler grid — modül slug'ları gerçek /moduller/<slug>/ yollarına gider.
   Sıra satış önceliğidir; ad + açıklama hedef sayfanın gerçekte anlattığıyla eşleşir.
   İkon sırası render.mjs I.sol ile aynıdır (menü, servis, asistan, dil, grafik, yorum). */
export const DRAWER_SOLUTIONS = [
  { name: "Dijital QR Menü", desc: "Ürün ve fiyatları tek panelden yönetin", slug: "restoran-menu" },
  { name: "Garson & Hesap İsteme", desc: "Talepler servis paneline düşer", slug: "servis-paneli" },
  { name: "Menü Asistanı", desc: "Misafirin sorusunu menünüzden yanıtlar", slug: "menu-asistani" },
  { name: "Çoklu Dil", desc: "Menü misafirin dilinde açılır", slug: "coklu-dil" },
  { name: "Menü Mühendisliği", desc: "Kârlı ürünü öne çıkarın", slug: "menu-muhendisligi" },
  { name: "Yorum & Geri Bildirim", desc: "Puan ve yorumları panelde toplayın", slug: "yorum-geri-bildirim" }
];

/* Çözümler menüsü: kategori → modüller (footer; gerçek /moduller/<slug>/ yolları) */
export const SOLUTIONS = MOD.categories.map((c) => ({
  id: c.id,
  name: c.name,
  lead: c.lead,
  modules: MOD.modules
    .filter((m) => m.category === c.id)
    .map((m) => ({ name: m.name, tagline: m.tagline, path: `moduller/${m.slug}/` }))
}));

export const HUB = { label: "Tüm modülleri görün", path: "moduller/" };

/* Footer V4 — marka metni, CTA kartı, gezinme (yalnızca gerçek route'lar) */
export const FOOTER = {
  description:
    "Restoran ve kafelerin menülerini kolayca yönetebileceği, müşterilerine modern bir deneyim sunabileceği dijital menü çözümleri.",
  ctaEyebrow: "Dijital menüye geçiş",
  ctaTitle: "Menünüzü dijitale taşıyın.",
  ctaDescription: "İşletmeniz için modern bir QR menü oluşturmak üzere ilk adımı atın.",
  ctaButton: CONVERSION.primary.label,
  signature: "QR Menu Official"
};

/** Sosyal URL repo'da tanımlı değilse boş dizi (placeholder üretilmez). */
export const FOOTER_SOCIAL = [];

/** Alt satırda ayrı yasal bağlantı yok; yasal sayfalar "Yasal Bilgiler" kolonundadır. */
export const FOOTER_LEGAL = [];

/* Başlık = içerik: her kolon yalnızca adının vadettiği bağlantıları taşır; aynı hedef iki kez geçmez.
   `url` verilirse (tel: gibi) olduğu gibi yazılır; aksi hâlde `path` sayfa derinliğine göre göreli olur. */
export const FOOTER_GROUPS = [
  {
    id: "product",
    title: "Ürün",
    links: [
      { label: "Ana Sayfa", path: "", key: "home" },
      { label: "Çözümler", path: "moduller/", key: "moduller" },
      { label: "Paketler & Fiyatlar", path: "paketler/", key: "paketler" },
      { label: CONVERSION.secondary.label, conversionSlot: "secondary", key: "canli" }
    ]
  },
  {
    id: "solutions",
    title: "Popüler Çözümler",
    links: [
      { label: "Dijital QR Menü", path: "moduller/restoran-menu/" },
      { label: "QR Masa", path: "moduller/qr-masa/" },
      { label: "Servis Paneli", path: "moduller/servis-paneli/" },
      { label: "Menü Asistanı", path: "moduller/menu-asistani/" },
      { label: "Çoklu Dil", path: "moduller/coklu-dil/" }
    ]
  },
  {
    id: "support",
    title: "Destek ve İletişim",
    links: [
      { label: "Sıkça Sorulan Sorular", path: "sss/", key: "sss" },
      { label: "Talep Formu", path: "iletisim/#talep", key: "iletisim" },
      { label: "0542 204 35 87", url: "tel:+905422043587" }
    ]
  },
  {
    id: "legal",
    title: "Yasal Bilgiler",
    links: [
      { label: "Gizlilik ve KVKK", path: "gizlilik/" },
      { label: "Çerez Politikası", path: "cerez-politikasi/" },
      { label: "Kullanım Şartları", path: "kullanim-sartlari/" }
    ]
  }
];
