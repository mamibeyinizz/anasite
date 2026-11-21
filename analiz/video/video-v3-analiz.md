# coklu-dil-reels_v3.mp4 — bağımsız analiz

Teknik [Kesin]: 1080×1920, 30 fps, 28,000 sn, H.264 bt709, 6,5 Mbps, ses -14,0 LUFS / -3,9 dBTP. Claude Code raporu: `layout.json` ihlal 0, telefon genişliği sabit 413,5 px, en düşük kontrast 5,95:1.

## v2'den düzelenler (doğrulandı)
Altyazı–medya çakışması yok · güvenli bölge içinde · rozet ve çipler tek satırda, çerçeveye temas yok · DE ekranı artık menü listesi (TR/EN/DE/FR aynı durumda) · telefon ölçeği sabit · panel kırpma penceresi içinde · "Otuz dile kadar" 1,4 sn tam opak · döngü temiz · "Garsonunuz servise dönsün." geri geldi.

## Kalan sorunlar

| # | Önem | Zaman | Bulgu |
|---|---|---|---|
| 1 | Yüksek | 9–17, 23–28 | "Telefon" 400×492 px: oran ≈0,81, gerçek telefon (≈0,46) değil; yuvarlatılmış kare akıllı saate benziyor. Ürün ekranının yarısı kırpık, metin sağ kenarda kesiliyor ("Luxury Turkish breakfast sprea…", "Petit-déjeuner turc généreux po…", "Şalgam épicé (boisson fern…"). |
| 2 | Yüksek | 17–23 | Panel penceresinde kırpma hataları: pencerenin solunda koyu bir şerit (görüntü sınırının dışı örneklenmiş), sağda yarım kesilmiş kartlar ve ikonlar, alt yarı boş krem alan. |
| 3 | Yüksek | 24–28 | CTA cümlesi "dil seçiciyi siz değiştirin" derken ekranda dil seçici yok (yalnız bir ürün satırı kırpığı): mesaj–görsel uyumsuzluğu. Logo ve ok çok küçük. |
| 4 | Orta | genel | Bütün içerik 600–1130 bandında küçük: nesneler tuval yüksekliğinin ~%25–28'i; 3D sahnede figür grubu ≈%30 genişlik. Alt %40 ve üst %17 boş. Kompozisyon "kayıp" ve çekingen. |
| 5 | Orta | 9–11 | Dil seçici (kanıtın en kritik anı) çok küçük; açılır liste ≈8 px. |
| 6 | Orta | 22–23 | Metinsiz ~1 sn geçiş. |
| 7 | Düşük | 13–17 | Ürün açıklama satırı ≈25 px (rapor da kabul ediyor), eşik 28 px. |
| 8 | Bilgi | 0–28 | Ses yalnız ambient bed; anlatım yok: yayına hazır değil. |

## Kök neden
Otomatik yerleşim testi **çakışmayı** ölçüyor, **kompozisyon kalitesini** değil: "ihlal 0" gerçek ama güzel demek değil. Küçüklük kısmen benim v3 promptumdaki sınırlardan: medya ≤780×530 ve telefon 330–420 px genişlik. Bu sınırlar telefonu gerçek oranından saptırdı ve kırpmayı zorunlu kıldı.

## Not
Genel: v1 4/10, v2 5/10, v3 6,5/10 (yerleşim hijyeni 9/10, kompozisyon ve kanıt okunurluğu 5/10). Yayın için ses ve madde 1–3 şart.
