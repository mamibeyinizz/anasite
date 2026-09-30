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
  logo: "assets/brand/qr-menu-official-logo.svg",
  logoCompact: "assets/brand/qr-menu-official-logo-compact.svg",
  year: new Date().getFullYear()
};

/* path: kök dizine göre; "" = ana sayfa */
export const CTA = { label: "Menünüzü Oluşturun", path: "paketler/" };

/* Masaüstü / drawer ana gezinme (HEADER V3 hiyerarşisi, gerçek yollar) */
export const NAV = [
  { key: "home", label: "Ana Sayfa", path: "", drawerSubtitle: "QR Menu Official dünyasını keşfedin" },
  { key: "moduller", label: "Çözümler", path: "moduller/", drawerSubtitle: "İşletmeniz için akıllı dijital araçlar" },
  { key: "paketler", label: "Paketler & Fiyatlar", path: "paketler/", drawerSubtitle: "İşletmenize uygun planı seçin" },
  { key: "canli", label: "Canlı Menüyü Gör", path: "moduller/restoran-menu/", drawerSubtitle: "Gerçek QR menü deneyimini inceleyin" },
  /* Gerçek iletişim sayfası henüz yok; mevcut hedef paketler */
  { key: "iletisim", label: "Bize Ulaşın", path: "paketler/", drawerSubtitle: "Sorularınız için bizimle iletişime geçin" }
];

export const DRAWER = {
  eyebrow: "RESTORANLAR İÇİN DİJİTAL ÇÖZÜMLER",
  titleLine1: "Restoranınızı",
  titleLine2: "Dijitalde Büyütün.",
  description:
    "Daha iyi ürün sunumu, daha kolay menü yönetimi ve işletmenize özel akıllı çözümler.",
  solutionsHeading: "Çözümlerimizi Keşfedin",
  trustTitle: "Neden QR Menu Official?",
  trustItems: [
    "Mobil, tablet ve masaüstü uyumlu yapı",
    "Kolay menü yönetimi ve hızlı güncelleme",
    "Restoranınıza özel profesyonel dijital deneyim",
    "Teknik bilgi gerektirmeyen kullanım"
  ],
  bottomNote: "Dakikalar içinde başlayın · Teknik bilgi gerekmez"
};

/* Drawer çözümler grid — modül slug'ları gerçek /moduller/<slug>/ yollarına gider */
export const DRAWER_SOLUTIONS = [
  { name: "Premium QR Menü", desc: "Modern dijital menü deneyimi", slug: "restoran-menu" },
  { name: "Akıllı Menü Yönetimi", desc: "Ürünlerinizi tek panelden yönetin", slug: "menu-muhendisligi" },
  { name: "AI Chatbot", desc: "Müşterilerinizle akıllı iletişim", slug: "menu-asistani" },
  { name: "Çoklu Dil Desteği", desc: "Yabancı müşterilere kolay erişim", slug: "coklu-dil" },
  { name: "Yorum & Geri Bildirim", desc: "Müşteri deneyimini geliştirin", slug: "yorum-geri-bildirim" },
  { name: "Garson & Hesap İsteme", desc: "Servis süreçlerini kolaylaştırın", slug: "servis-paneli" }
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
  ctaButton: "QR Menünüzü Oluşturun",
  signature: "QR Menü Official"
};

/** Sosyal URL repo'da tanımlı değilse boş dizi (placeholder üretilmez). */
export const FOOTER_SOCIAL = [];

/** Alt bilgi yasal sayfaları yok; yalnızca telif (sahte # link yok). */
export const FOOTER_LEGAL = [];

export const FOOTER_GROUPS = [
  {
    id: "product",
    title: "Ürünü Keşfedin",
    links: [
      { label: "Ana Sayfa", path: "", key: "home" },
      { label: "Modüller", path: "moduller/", key: "moduller" },
      { label: "Canlı Menüyü Gör", path: "moduller/restoran-menu/", key: "canli" },
      { label: "Sıkça Sorulan Sorular", path: "sss/" }
    ]
  },
  {
    id: "solutions",
    title: "QR Menü Çözümleri",
    links: [
      { label: "Paketler & Fiyatlar", path: "paketler/", key: "paketler" },
      { label: "Tüm Modüller", path: "moduller/" },
      { label: "Restoran Menü", path: "moduller/restoran-menu/" },
      { label: "Servis Paneli", path: "moduller/servis-paneli/" }
    ]
  },
  {
    id: "support",
    title: "Başlangıç ve Destek",
    links: [
      { label: "Paketleri İnceleyin", path: "paketler/" },
      { label: "Sıkça Sorulan Sorular", path: "sss/" },
      { label: "Bize Ulaşın", path: "paketler/", key: "iletisim" }
    ]
  },
  {
    id: "corporate",
    title: "Kurumsal",
    links: [
      { label: "Modül Merkezi", path: "moduller/" },
      { label: "Paket Karşılaştırma", path: "paketler/" },
      { label: "Menü Asistanı", path: "moduller/menu-asistani/" }
    ]
  },
  {
    id: "legal",
    title: "Yasal Bilgiler",
    links: [
      { label: "Güvenlik & Teknik (SSS)", path: "sss/" },
      { label: "Paketler & Fiyatlar (SSS)", path: "sss/" }
    ]
  },
  {
    id: "contact",
    title: "Bize Ulaşın",
    links: [
      { label: "Paketler & Başvuru", path: "paketler/" },
      { label: "Sıkça Sorulan Sorular", path: "sss/" },
      { label: "Canlı Menü Örneği", path: "moduller/restoran-menu/" }
    ]
  }
];
