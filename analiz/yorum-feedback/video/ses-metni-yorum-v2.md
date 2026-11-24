# Ses metni v2 — Yorum & Feedback Reels (≈28 sn)

Yön: Google puanı ACI olarak geçer; çözüm Google'a yönlendirme değil, sorunun kaynağını (yemek/hizmet/temizlik, masa, saat) görüp işletmeyi geliştirmektir. Yasak: seçici Google yönlendirmesi, yorum karşılığı indirim/ödül, "puan X'ten Y'ye çıkar" vaadi, rakam/yüzde, "garanti", "ücretsiz", "anında".

| # | Süre (≈) | Cümle |
|---|---|---|
| 1 | 0–2,5 | Google puanınız düşük mü? |
| 2 | 2,5–7 | Müşteriniz yemekten memnun ama yine de düşük puan veriyor olabilir. |
| 3 | 7–9 | Neden? Hizmet ya da temizlik. |
| 4 | 9–14 | Yorum ve Feedback modülü menüden bu puanları ayrı ayrı toplar. |
| 5 | 14–19 | Yorum önce panelinize düşer. Yayına çıkacak olanı siz seçersiniz. |
| 6 | 19–24 | Yemek iyi, hizmet zayıf mı? Hangi masada, hangi saatte sorun yaşandığını raporda görürsünüz. |
| 7 | 24–26 | Sorunu görür, işletmenizi geliştirirsiniz. |
| 8 | 26–29 | Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde. |

## ElevenLabs tek blok
```
Google puanınız düşük mü? Müşteriniz yemekten memnun ama yine de düşük puan veriyor olabilir. Neden? Hizmet ya da temizlik. Yorum ve Feedback modülü menüden bu puanları ayrı ayrı toplar. Yorum önce panelinize düşer. Yayına çıkacak olanı siz seçersiniz. Yemek iyi, hizmet zayıf mı? Hangi masada, hangi saatte sorun yaşandığını raporda görürsünüz. Sorunu görür, işletmenizi geliştirirsiniz. Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde.
```
Ses: aynı (Gamze Özdemir, stability 50 / similarity 75, hız 1.0). "Feedback" telaffuzunu dinleyin; kötüyse "fidbek" yazımını deneyin.

## Sahne eşleşmesi (v1 prompt'taki planın yerine)
1 Kanca (ALTIN): "Google puanınız / **düşük** mü?" · 2 Acı (ALTIN): 3 kriter kartı yan yana "YEMEK ✓ / HİZMET ? / TEMİZLİK ?" (metin ≥40 px; ✓ ve ? ikonları nötr, iddia yok) · 3 Dönüş: "Neden?" · 4 Müşteri formu ekranı · 5 Bekleyen yorumlar ekranı + "Önce siz." · 6 Masa/saat raporu ekranı (kriter kolonları vurgulu) · 7 Düşüş uyarısı ya da kriter trend ekranı ("Sorunu gör") · 8 Kapanış.
Ekranlarda Google yönlendirme/ödül/indirim popup'ı, Google linki, ödül kodu ve izinli kişiler bloğu GÖRÜNMEYECEK.
