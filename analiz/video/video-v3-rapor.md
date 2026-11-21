# Çoklu Dil Reels v3 — rapor

Çıktı: `out/coklu-dil-reels_v3.mp4` (v1/v2 korundu). Kaynak: `render/layout.js` (tek yerleşim kaynağı), `render/layout_check.mjs` (render öncesi zorunlu test), `render/dogrula-v3.py`.

## Ölçümler
- ffprobe: 1080×1920, 30 fps, 28.000 s, H.264 high yuv420p, bt709 etiketli, video 6,49 Mbps.
- Ses: −14,0 LUFS, tepe −3,9 dBFS. Anlatım dosyası yok; yalnız ambient bed (anlatım sesi eklenmedi).
- Yerleşim testi (`out/layout.json`): 318 örnek (0,1 sn aralık), ihlal 0, telefon genişliği sabit 413,5 px, en düşük kontrast 5,95:1 (189 ölçüm), "Otuz dile kadar." 1,4 sn tam opak.
- Altyazı+başlık birleşimi `ses-metni.md` düz metniyle birebir (True).
- Kanıt: `out/sheet-v3-1sn-4x7.jpg`, `out/sheet-v3-{8-12,12-17,19-23,24-28}.jpg` (0,1 sn), `out/kontrol-v3/once-sonra_*.jpg` (v2 | v3), `out/kontrol-v3/kapak-3x4.jpg`, `out/dogrulama-v3.json`.

## 11 bulgu
1. Telefon ölçeği/kenar: düzeltildi — telefon 400×492 (projeksiyonla 413,5 px), MEDYA 600–1130, kenar boşluğu ≥80. Kanıt: layout.json, once-sonra_03–05.
2. Altyazı: düzeltildi — yalnız 1140–1230 bandı, medyaya ≥24 px; metin–medya kesişimi 0.
3. "Gerçek demo menü" rozeti: düzeltildi — tek satır, başlık ile medya arasında; dil çipleri aynı satırda, çerçeveden ≥16 px.
4–5. Panel: düzeltildi — 780×500 pencere, dikey ortalı, kart/dolly pencere içinde (kırpma = UV penceresi).
6. 05-menu-de: düzeltildi — splash yerine menü listesi; TR/EN/DE/FR aynı durumda, salt okunur çekim.
7. Telefon ölçek sıçraması: düzeltildi — 8–28 sn sabit; yakınlaşma yalnız kırpma.
8. Altyazı geçişi: düzeltildi — eski cümle 0,2 sn'de söner, yenisi sonra gelir; çapraz geçiş yok.
9. CTA: düzeltildi — başlık+URL tek blok (URL 54 px, krem/altın, kontrast ≥4.5), telefon MEDYA'da, tek gerçek logo, opaklık ≥0.9.
10. Ağırlık merkezi y 640–960: düzeltildi — testte kural kontrol edildi (ihlal 0).
11. Masa/müşteri: düzeltilemedi, kaldırıldı — B/C masaları çıkarıldı; misafir–garson kutuları kesişmiyor.

## Dürüst notlar
- Yakınlaşmış telefonda ürün adı ≥28 px, açıklama satırı ≈25 px (pencere genişliği sınırı) — gerekli ≥28 px kuralını açıklama satırında sağlamıyor.
- Altyazılar kısa tek satırlara bölündü; 6. sahne süreleri sıkıştırıldı.
- 26.9–27.2 döngü aralığında kareler bilerek neredeyse boş.
- Anlatım sesi yok.
