# Çoklu Dil Reels v4 — rapor

> **YAYINA HAZIR DEĞİL: anlatım sesi yok.** `ses/anlatim.mp3` bulunmuyor; video yalnız ortam sesi (ambient bed) taşıyor. Dosya eklenince `encode-v2.sh` otomatik miksler.

Çıktı: `out/coklu-dil-reels_v4.mp4` (v1–v3 korundu). Kaynak: `render/layout.js` (tek yerleşim kaynağı), `render/layout_check.mjs` (render öncesi zorunlu test), `render/dogrula-v4.py`. v3 kaynakları `*-v3.*` adıyla yedekte.

## Ölçümler
- ffprobe: 1080×1920, 30 fps, 28,000 sn, H.264 yuv420p, bt709, video 6,51 Mbps. Ses −14,0 LUFS.
- Yerleşim testi (`out/layout.json`, 0,05 sn aralıkla 561 örnek): **ihlal 0**. Başlık+URL birleşimi `ses-metni.md` ile birebir. En düşük kontrast 6,1:1. "Otuz dile kadar." 1,35 sn tam opak. En uzun metinsiz süre 0,2 sn.
- "İhlal 0" kompozisyonun iyi olduğunu kanıtlamaz; doluluk ölçümleri:

| Sahne | Ana nesne | MEDYA bandı (670 px) doluluğu |
|---|---|---|
| 3B grup (0–8 sn) | genişlik ≥660, yükseklik ≥624 px | ≥%93 |
| Telefon (8–17, 22–28 sn) | ≈312×625 px, oran 0,496–0,500, sabit | %93 |
| Panel (17–22 sn) | 920×568 px pencere | %85 |
| Büyüteç | 581×470 (satırlar) · 581×640 (dil listesi) · 581×365 (CTA) | — |

- Ekran içi metin (ölçekli): ürün açıklaması ve dil öğeleri ≈28,4 px, ürün adı ≈34 px, panel alt yazısı ≈36 px.
- Kanıt: `out/sheet-v4-1sn-4x7.jpg`, `out/sheet-v4-{8-12,12-17,19-23,24-28}.jpg` (0,1 sn), `out/kontrol-v4/once-sonra_*.jpg` (v3 | v4), `out/kontrol-v4/kapak-3x4.jpg`, `out/dogrulama-v4.json`.

## 8 bulgu
1. Telefon gerçek telefon değil: **düzeltildi.** Dış kutu ≈312×625, oran 0,496; 860×1800 ekran görüntüsü kırpılmadan tam ekran; boyut sabit. Kanıt: once-sonra_03–05.
2. Panel kırpma hataları: **düzeltildi.** 920×568 pencere; Diller/CSV Dışa Aktar (sol) ve Kapsam/CSV İçe Aktar (sağ) kartları bütün; koyu şerit yok; UV 14 pencerede [0,1] içinde; pencerede kesilen kart/metin kutusu 0. Kanıt: sheet-v4-19-23, layout.json `uv`.
3. CTA'da dil seçici yok: **düzeltildi.** Telefonda dil seçici açık, büyüteçte TR/EN/DE/FR, "dil seçiciyi siz değiştirin" anında seçili dil vurgulu; logo 239 px, ok 60 px, URL 54 px (iki satır). Kanıt: sheet-v4-24-28.
4. Küçük kompozisyon: **düzeltildi.** Doluluk yukarıdaki tabloda.
5. Dil seçici küçük: **düzeltildi.** 9–11 sn büyüteçte 7 öğe, ≈28,4 px. Arapça/Çince öğeleri sığmadığı için gösterilmiyor.
6. Metinsiz geçiş: **düzeltildi.** En uzun boşluk 0,2 sn.
7. Açıklama satırı ≈25 px: **düzeltildi.** ≈28,4 px.
8. Anlatım sesi yok: **düzeltilemedi** (dosya yok).

## Sınırlar
- Büyüteç, ürün satırının yalnız metin sütununu gösterir (satır kartının sol görsel kısmı ve sağ kenarı pencerede kesilir); metin kutuları bütün. Test bunu `satirKartiBuyutecteKenardanKesik: true` olarak raporlar.
- Spec'teki "2,4×" büyütme ≥28 px ile çelişiyordu (ekran görüntüsü telefona 0,33× iner); büyüteç 1,075× doku ölçeğiyle ≥28 px sağlar (telefona göre ≈3,2×).
- Telefon x 81–394 (spec 100–410), büyüteç x 419–1000 (spec 440–1000): telefon oranını (≤0,50) tam ekranla tutarken 24 px boşluk için.
- v3 CTA başlığı "Canlı menüyü telefonunuzda deneyin" kalktı; tek metin katmanı kuralıyla sesli cümleler başlık oldu.
- 3B sahnede garson masayla kısmen örtüşür; masa B/C yok.
- Panel 22,3–22,7 sn'de telefonla 0,4 sn çapraz geçer.
