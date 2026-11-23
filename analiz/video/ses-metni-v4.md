# Ses metni v4 — Çoklu Dil Reels (≈27 sn, "siz" dili)

Amaç: v3 metni (ürün özelliği sayımı) yerine acı → çözüm → kanıt → eylem akışı; carousel ve açıklamayla AYNI söylem ("20'den fazla dil", turist siparişini kendi dilinde verir, garson dil bilmek zorunda değil). Yasak: "yapay zeka/AI", yüzde/oran, "ücretsiz", "anında", "devrim", "sınırsız", "CSV" (jargon). 

| # | Süre (≈) | Cümle |
|---|---|---|
| 1 | 0–4,0 | Garsonunuz yabancı dil bilmiyorsa, turist masası sizi bırakıp gidebilir. |
| 2 | 4,0–6,8 | Sipariş yanlış anlaşılır, diğer masalar bekler. |
| 3 | 6,8–9,0 | Çoklu Dil modülü bunu çözüyor. |
| 4 | 9,0–14,0 | Turist QR'ı okutur, dilini seçer. Menü ve sipariş kendi dilinde açılır. |
| 5 | 14,0–18,0 | Ürün adı, açıklama, kategori, hepsi kendi dilinde. |
| 6 | 18,0–23,0 | Dilleri siz seçersiniz. Çevirileri tek tek ya da dosyadan toplu yüklersiniz. Yirmiden fazla dil. |
| 7 | 23,0–25,0 | Garsonunuz dil değil, servis yapsın. |
| 8 | 25,0–29,0 | Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde. |

Düz metin: Garsonunuz yabancı dil bilmiyorsa, turist masası sizi bırakıp gidebilir. Sipariş yanlış anlaşılır, diğer masalar bekler. Çoklu Dil modülü bunu çözüyor. Turist QR'ı okutur, dilini seçer. Menü ve sipariş kendi dilinde açılır. Ürün adı, açıklama, kategori, hepsi kendi dilinde. Dilleri siz seçersiniz. Çevirileri tek tek ya da dosyadan toplu yüklersiniz. Yirmiden fazla dil. Garsonunuz dil değil, servis yapsın. Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde.

Kelime ≈ 66 → ≈ 26–28 sn (2,4 kelime/sn).

## ElevenLabs'e tek blok (kopyala-yapıştır)
```
Garsonunuz yabancı dil bilmiyorsa, turist masası sizi bırakıp gidebilir. Sipariş yanlış anlaşılır, diğer masalar bekler. Çoklu Dil modülü bunu çözüyor. Turist kü ar'ı okutur, dilini seçer. Menü ve sipariş kendi dilinde açılır. Ürün adı, açıklama, kategori, hepsi kendi dilinde. Dilleri siz seçersiniz. Çevirileri tek tek ya da dosyadan toplu yüklersiniz. Yirmiden fazla dil. Garsonunuz dil değil, servis yapsın. Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde.
```
Notlar: "QR" telaffuzu için "kü ar" yazıldı (altyazıda ve ses-metni düz metninde "QR" kalır). Önceki ses: ElevenLabs "Gamze Özdemir – Turkish Female Narrator", stability 50 / similarity 75 (aynı sesi koru ki marka sesi değişmesin). Hız 1.0. Üretimden sonra dosyayı `analiz/video/ses/anlatim-v4.mp3` olarak koyun. Dinleyip şunları kontrol edin: "QR", "kategori", "yirmiden", cümle sonlarında yapay iniş/çıkış, cümleler arası duraklar (≥0,25 sn).
