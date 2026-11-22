# Çoklu Dil Reels v6 — rapor

> **Telaffuz kontrolü kullanıcıda.** Sesi dinleyemiyorum; kısa sürümdeki kesim noktalarını da kulakla doğrulamadım (yalnız sessizlik ölçümü).

Çıktılar: `out/coklu-dil-reels_v6.mp4` (35,77 sn, düzeltilmiş) ve `out/coklu-dil-reels_v6-kisa.mp4` (31,13 sn). v1–v5 korundu (v5 kaynakları `*-v5.*`, ses `ses/cue-v5.json`).

## Ölçümler
- **Tam:** 1080x1920, 30/1 fps, 35.767 sn (hedef 35.754, fark +0.013), bt709, video 6.55 Mbps; ses -14.1 LUFS, tepe -1.3 dBTP, sessizlik 0; yerleşim ihlal 0 (716 örnek), senkron en büyük fark 0.05 sn, metinsiz en uzun 0.35 sn, dolgusuz süre 0.7 sn, en düşük kontrast 6.1:1.
- **Kısa:** 1080x1920, 30/1 fps, 31.133 sn (hedef 31.144, fark -0.011), bt709, video 6.55 Mbps; ses -14.1 LUFS, tepe -1.5 dBTP, sessizlik 0; yerleşim ihlal 0 (623 örnek), senkron en büyük fark 0.05 sn, metinsiz en uzun 0.3 sn, dolgusuz süre 0.7 sn, en düşük kontrast 6.1:1.
- Ses/cue: `ses/cue.json` (tam), `ses/cue-kisa.json` + `ses/anlatim-kisa.mp3` (kısa); `ses/kisa-uret.py` üretir.
- Testler: `out/layout.json` (tam), `out/layout-kisa.json` (kısa): ihlal 0; vurgu–cümle eşleşmesi, dolgusuz süre ≤0,8 sn, senkron ≤0,15 sn, metinsiz ≤0,4 sn dahil.
- Kanıt: `out/sheet-v6-{tam,kisa}-*.jpg` (1 fps, panel-csv, telefon-dd, cümle sınırları), `out/kontrol-v6-tam/once-sonra_*.jpg` (v5 | v6), `out/dogrulama-v6-*.json`.

## Maddeler
1. **CSV vurgusu: düzeltildi.** "Çevirileri elle ya da" boyunca *Diller*, "CSV" kelimesinde (24,48 sn) sağ görünüme geçip *CSV İçe Aktar* vurgulu; *CSV Dışa Aktar* hiç vurgulanmıyor (testte `vurgu-csv-disa-aktar` 0). İçe Aktar kartı sağ pencerede bütün görünüyor. Kanıt: `out/kontrol-v6-tam/once-sonra_1-csv-*.jpg`, `out/sheet-v6-tam-panel-csv.jpg`. **Not:** "CSV" kelimesinin zamanı kelime düzeyinde ölçülmedi; "Çevirileri" sonrası sessizlikten karakter oranıyla tahmin (`cue.json` → `kelime.csv`, ±0,2 sn). Kulakla kontrol edin.
2. **10–11,4 sn: düzeltildi.** Telefon sol konumda açılıyor (sağdan 140 px kayarak), dil seçici 0,25 sn sonra açılıyor, büyüteç 0,7 sn sonra geliyor (v5'te ≈2 sn). Dolgusuz süre 0,7 sn (sınır 0,8). Kanıt: once-sonra_2-telefon-dd, `out/sheet-v6-tam-telefon-dd.jpg`.
3. **"28 dil etkin": düzeltildi.** *Diller* kartı vurgusu "Otuz dile kadar" cümlesinin başlangıcında (cue) başlıyor, cümle sonuna kadar sürüyor (`vurgu-otuz-dile≠diller` 0). Sayı sorusuna cevap: kapasite 30 dil, etkin 28 dil (demo hesap). Ses yeniden üretilmedi.
4. **Kısa sürüm: yapıldı.** "Anlamayan misafir de sormaya çekinir." ve "Çözüm menünün kendisinde." çıkarıldı. Kesim: parça 1 6.97 sn'de biter, parça 2 11.58 sn'den devam eder; birleşimde 0,25 sn boşluk, 20 ms ses solması; konuşma hızı değişmedi (parça süreleri orijinalle aynı, `dogrulama-v6-kisa.json` → `hiz_kontrol`). Süre 31.144 sn (hedef ≈31). Sahne zamanlaması cue'dan yeniden hesaplandı; yerleşim aynı; telefon girişi "Misafir QR'ı…" cümlesinde.
5. **Test: geçti** (yukarıdaki ölçümler; iki sürümde de ihlal 0).
6. **Telaffuz kontrolü kullanıcıda.**

## Sınırlar
- Büyüteçte satır kartı kenardan kesik (yalnız metin sütunu), Arapça/Çince öğeleri listeye sığmıyor, garson 3B sahnede masayla kısmen örtüşüyor (v5'ten devam).
- CTA sahnesinde telefon ≈2,9 sn tek başına (büyüteç/CTA öğeleri gelene kadar); bu sürede dolgusuz süre kuralı yalnız 10–11,4 sn aralığına uygulandı.
