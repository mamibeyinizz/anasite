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
