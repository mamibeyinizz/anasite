# coklu-dil-reels_v5.mp4 — bağımsız analiz

Teknik [Kesin]: 1080×1920, 30 fps, 35,767 sn, H.264 bt709, 6,5 Mbps; ses -14,2 LUFS, tepe -1,3 dBTP, LRA 2,4 LU (sessizlik yok). Ses/video süre farkı 0,03 sn. Claude Code raporuna göre başlık–ses senkronu ≤0,05 sn, yerleşim ihlali 0.
Sınır: sesi dinleyemem; telaffuz ve ton kontrolü sizde. Senkronu rapordaki cue tablosundan ve kare örneklerinden değerlendirdim.

## Hüküm
Yayına yakın. Kritik tasarım hatası yok; yerleşim, okunurluk, kanıt (büyüteç + panel + dil seçici) ve CTA tutarlı. Bulduğum 1 içerik hatası ve 3 iyileştirme:

| # | Önem | Zaman | Bulgu | Düzeltme |
|---|---|---|---|---|
| 1 | Orta (içerik) | 22,8–24,5 | "Çevirileri elle ya da CSV ile girersiniz." cümlesinin ilk yarısında panelde "CSV Dışa Aktar" (dışarı aktarma) vurgulu; "girersiniz" içe aktarmadır. "CSV İçe Aktar" ancak ~25,5 sn'de geliyor. | Vurguyu "CSV İçe Aktar"a al; "elle" kısmında "Diller", "CSV" kelimesinde "CSV İçe Aktar" vurgulansın. |
| 2 | Düşük | genel | Süre 35,8 sn. Acı bölümü ilk 11 sn, modül anlatımı 19–27 sn, CTA 29–35 sn; orta kısım yavaş. | Kısa sürüm (≈31 sn) A/B: "Anlamayan misafir de sormaya çekinir." ve "Çözüm menünün kendisinde." cümlelerini çıkar. Her ikisinde de CTA aynı. |
| 3 | Düşük | 26,3–27,3 | "Otuz dile kadar." yalnız 0,94 sn; panelde "28 dil etkin" yazıyor. Okuyan, 28'i 30'la karşılaştırabilir. | Cümleyi "Otuz dile kadar çeviri." gibi uzatma (sesi yeniden üretmek gerekir) ya da yeniden üretmeden panelde "28 dil etkin" satırını kırp. |
| 4 | Düşük | 10–11,4 | "Çözüm menünün kendisinde." sırasında ekran yalnız küçük bir telefon; ~1,6 sn dolgusuz. | Telefonu zaten sol konumda aç; büyüteç 0,5 sn erken gelsin. |

## Doğrulananlar
Başlıklar cümle sınırlarına oturuyor (en büyük fark 0,05 sn) · metinsiz boşluk ≤0,35 sn · altyazı yalnız `ses-metni.md` metni (QR, CSV) · panel başlık şeridi "Diller & Çeviriler" var, çapraz geçiş yok, CTA oku kalktı · telefon alt çubuğu kırpıldı · büyüteç kırpık parça kalmadı · dil seçici CTA'da açık.
