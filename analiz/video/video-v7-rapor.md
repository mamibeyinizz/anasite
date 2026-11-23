# Çoklu Dil Reels v7 — kurumsal tema, rapor

> **Telaffuz ve kesim kontrolü kullanıcıda.** Sesi dinleyemiyorum; ses dosyaları (`anlatim.mp3`, `anlatim-kisa.mp3`, cue) v6 ile aynı, yeniden üretilmedi.

Çıktılar: `out/coklu-dil-reels_v7.mp4` (tam) ve `out/coklu-dil-reels_v7-kisa.mp4`. v1–v6 korundu. Kaynak: `render/scene-v7.mjs` (DOM/CSS/SVG, three.js yok), `index-v7.html`, `sunucu-v7.mjs`, `render-v7.mjs`, `test-v7.mjs`, `encode-v7.sh`.

## Ölçümler
- **Tam:** 1080x1920, 30/1 fps, 35.767 sn, bt709, video 6.58 Mbps; ses -14.1 LUFS, tepe -1.3 dBTP, sessizlik 0; test ihlal 0 (716 örnek), en küçük yazı 36 px, en uzun metinsiz 0.35 sn, senkron en büyük fark 0.1 sn, en düşük kontrast 5.52:1.
- **Kısa:** 1080x1920, 30/1 fps, 31.133 sn, bt709, video 6.59 Mbps; ses -14.1 LUFS, tepe -1.5 dBTP, sessizlik 0; test ihlal 0 (623 örnek), en küçük yazı 36 px, en uzun metinsiz 0.3 sn, senkron en büyük fark 0.1 sn, en düşük kontrast 5.52:1.
- Testler (`out/layout-v7*.json`): güvenli bölge (x 65–1015, y 270–1248) ihlali 0; sağ üst 160×160 ihlali 0; en küçük metin ≥36 px; ses–yazı senkronu ≤0,15 sn; metinsiz süre ≤0,4 sn; CSV vurgusu ("elle" → Diller, "CSV" → CSV İçe Aktar, Dışa Aktar hiç vurgulanmaz); kaynak kodda back/elastic/bounce/overshoot/rotate/three yok.
- Kapanış karesi = ilk kare (fark 0): döngü kesilmez. v6 kapanış karesine ek çapraz geçiş gerekmedi (sahne kendi içinde kancaya döner).
- Kanıt: `out/sheet-v7-{tam,kisa}-1sn.jpg`, `out/kontrol-v7/` (6 anahtar kare + v6|v7 karşılaştırmaları), `out/dogrulama-v7-*.json`.

## Yapılanlar
3B figürler, masa, balonlar, hap, three.js sahnesi kaldırıldı. Altın açılış/kapanış, zümrüt orta bölüm; 450 ms perde; köşe ayraçları, %11 nokta ızgarası; Manrope. Hareket yalnız opaklık + 24–48 px kayma + ≤%3 ölçek, ease-out cubic/quint. Telefon/panel düz çerçevede; vurgu = %55 karartma + 3 px altın çerçeve. Acı bölümü dört masalık düz şema. CSV kuralı ve "28 dil etkin" (demo hesap, kapasite 30) v6'daki gibi.

## Sapmalar / riskler
- **CTA'da iki metin katmanı:** sabit "Canlı menüyü telefonunuzda deneyin" + adres + logo; altında konuşulan cümleler ikincil boyda. Tek katman kuralına aykırı; onay beklemeden uygulandı.
- Konuşulan cümleler kancada üç satır, diğerlerinde 76–96 px; CTA altyazısı 56 px. Köşe ayraçları sağ üst kutuya girmesin diye y 420–1260 çerçevesinde; kompozisyon güvenli bölgede olduğundan alt ≈670 px boş.
- Telefon ekranlarındaki gerçek arayüz metni (<36 px) test dışı (ürün ekranı).
- Telefon, "Çözüm menünün kendisinde." yazısıyla çakışmasın diye c5'te giriyor; c4'te (≈2 sn) yalnız yazı var.
- Kısa sürümde c3/c4 yok; perde "Misafir QR'ı…" cümlesinde açılıyor.
- Videoyu gözle yalnız 1 fps kontak sayfasından ve anahtar karelerden inceledim; hareket akıcılığı oynatılarak izlenmedi.
