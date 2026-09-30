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
  year: new Date().getFullYear()
};

/* path: kök dizine göre; "" = ana sayfa */
export const CTA = { label: "Paketleri İnceleyin", path: "paketler/" };

export const NAV = [
  { key: "home", label: "Ana Sayfa", path: "" },
  { key: "solutions", label: "Çözümler", path: "moduller/", mega: true },
  { key: "paketler", label: "Paketler", path: "paketler/" },
  { key: "sss", label: "SSS", path: "sss/" },
  /* Gerçek bir iletişim sayfası henüz yok (README: iletişim hedefi TBD);
     oluşana kadar mevcut ve gerçek hedef olan Paketler'e bağlanır. */
  { key: "iletisim", label: "İletişim", path: "paketler/" }
];

/* Çözümler menüsü: kategori → modüller (gerçek /moduller/<slug>/ yolları) */
export const SOLUTIONS = MOD.categories.map((c) => ({
  id: c.id,
  name: c.name,
  lead: c.lead,
  modules: MOD.modules
    .filter((m) => m.category === c.id)
    .map((m) => ({ name: m.name, tagline: m.tagline, path: `moduller/${m.slug}/` }))
}));

export const HUB = { label: "Tüm modülleri görün", path: "moduller/" };
