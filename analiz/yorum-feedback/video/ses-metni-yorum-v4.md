# Ses metni v4 — Yorum & Feedback Reels (≈27 sn, ses: Deniz)

Yön (kullanıcı kararı): modülün Google yönlendirmesi ve isteğe bağlı ödül sistemi ANLATILIYOR. Anlatım ürünün gerçek davranışına bağlı: puan eşiğin üstündeyse Google'da değerlendirme daveti, altındaysa yalnızca işletmeye ulaşır; ödül isteğe bağlı. Rakamlı sonuç vaadi (örn. "2,5'ten 5'e") YOK, "garanti" YOK. Kod değişmez.

| # | Süre (≈) | Cümle |
|---|---|---|
| 1 | 0–2,5 | Google puanınız düşük mü? |
| 2 | 2,5–7 | Müşteriniz yemekten memnun ama hizmetten ya da temizlikten memnun olmayabilir. |
| 3 | 7–11 | Yorum ve Feedback modülü menüden bu puanları ayrı ayrı toplar. |
| 4 | 11–17 | Yüksek puan verenleri Google'da değerlendirmeye yönlendirir, düşük puanı önce size ulaştırır. |
| 5 | 17–20 | İsterseniz Google yorumu yapanlara ödül verebilirsiniz. |
| 6 | 20–25 | Hangi masada, hangi saatte sorun yaşandığını raporda görür, işletmenizi geliştirirsiniz. |
| 7 | 25–28 | Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde. |

## ElevenLabs tek blok (Deniz; stability 50–60, similarity 90)
```
Google puanınız düşük mü? Müşteriniz yemekten memnun ama hizmetten ya da temizlikten memnun olmayabilir. Yorum ve Feedback modülü menüden bu puanları ayrı ayrı toplar. Yüksek puan verenleri Google'da değerlendirmeye yönlendirir, düşük puanı önce size ulaştırır. İsterseniz Google yorumu yapanlara ödül verebilirsiniz. Hangi masada, hangi saatte sorun yaşandığını raporda görür, işletmenizi geliştirirsiniz. Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde.
```
"Feedback" kötü okunursa "fidbek" yaz. Dosya: `ses/anlatim-yorum.mp3`.

## Sahne eşleşmesi (v4)
1 Kanca (ALTIN): "Google puanınız / **düşük** mü?" · 2 Acı (ALTIN): YEMEK ✓ / HİZMET ? / TEMİZLİK ? kartları · 3 Dönüş (ZÜMRÜT): "Yorum & Feedback" pill + PUAN · YORUM · RAPOR + müşteri formu ekranı · 4 Yönlendirme: "Yüksek puan → Google'da değerlendir" / "Düşük puan → size" iki yollu şema (düz, metin ≥40 px) + varsa "Google & Ödül" ayar ekranı kırpması (gerçek Google linki/kodu yerine boş/maskelenmiş alan) · 5 Ödül: şema altında "İsteğe bağlı ödül" etiketi (indirim oranı/rakam YAZMA) · 6 Rapor: masa/saat raporu ekranı · 7 Kapanış (ALTIN).
Mahremiyet kuralı aynı: gerçek müşteri adı/telefon/e-posta/IP/yorum metni ve İzinli Kişiler bloğu ekranlarda OLMAYACAK; gerçek Google yorum linki ve gerçek ödül kodu görünmeyecek.
