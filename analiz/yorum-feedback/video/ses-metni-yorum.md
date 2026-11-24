# Ses metni — Yorum & Feedback Reels (≈27 sn, "siz" dili)

Akış: acı → neden → çözüm → müşteri tarafı → panel (önce siz) → rapor → uyarı → eylem. Carousel ve açıklamayla aynı söylem. Yasak: rakam/yüzde, "Google'a yönlendirme", "olumlu yorumu Google'a taşıma", "puanınızı yükseltir", "yapay zeka", "ücretsiz", "anında", "devrim", "garanti".

| # | Süre (≈) | Cümle |
|---|---|---|
| 1 | 0–3 | Puanlar düşerken siz farkında mısınız? |
| 2 | 3–7 | Memnun kalmayan misafir şikayetini çoğu zaman size söylemez. |
| 3 | 7–9,5 | Yorum ve Feedback modülü bunu çözüyor. |
| 4 | 9,5–14 | Misafir menüden yemeği, hizmeti, temizliği ayrı ayrı puanlar, yorumunu yazar. |
| 5 | 14–19 | Yorum önce panelinize düşer. Yayına çıkacak olanı siz seçersiniz. |
| 6 | 19–22,5 | Hangi masadan, hangi saatten geldiğini raporda görürsünüz. |
| 7 | 22,5–26 | Yeterli yorum biriktiğinde, bir kriterin puanı düşerse panel sizi uyarır. |
| 8 | 26–29 | Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde. |

Düz metin: Puanlar düşerken siz farkında mısınız? Memnun kalmayan misafir şikayetini çoğu zaman size söylemez. Yorum ve Feedback modülü bunu çözüyor. Misafir menüden yemeği, hizmeti, temizliği ayrı ayrı puanlar, yorumunu yazar. Yorum önce panelinize düşer. Yayına çıkacak olanı siz seçersiniz. Hangi masadan, hangi saatten geldiğini raporda görürsünüz. Yeterli yorum biriktiğinde, bir kriterin puanı düşerse panel sizi uyarır. Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde.

## ElevenLabs tek blok
```
Puanlar düşerken siz farkında mısınız? Memnun kalmayan misafir şikayetini çoğu zaman size söylemez. Yorum ve Feedback modülü bunu çözüyor. Misafir menüden yemeği, hizmeti, temizliği ayrı ayrı puanlar, yorumunu yazar. Yorum önce panelinize düşer. Yayına çıkacak olanı siz seçersiniz. Hangi masadan, hangi saatten geldiğini raporda görürsünüz. Yeterli yorum biriktiğinde, bir kriterin puanı düşerse panel sizi uyarır. Aynı menüyü kendi telefonunuzda deneyin. Bağlantı profilimizde.
```
Aynı ses/ayar (Gamze Özdemir, stability 50 / similarity 75, hız 1.0). Dosya: `analiz/yorum-feedback/video/ses/anlatim-yorum.mp3`. Dinleyip kontrol: "Feedback" telaffuzu, "kriter", cümle sonu inişleri, cümle arası ≥0,25 sn.

## Doğrulama (kod: qr-menu-suite/modules/yorum-feedback)
- Menüde puan + yorum formu, çok kriterli puan, masa bilgisi: modül açıklaması ve rapor kodu [Kesin].
- Yorum önce "bekleyen", onaylanmadan yayına çıkmaz (auto_approve_rating=0 varsayılan) [Kesin].
- Masa/saat/vardiya raporu, kriter trend grafiği, düşüş uyarısı (son 7 gün / önceki 7 gün, en az 5 yorum) [Kesin].
- Not: müşteri hesabında "otomatik onay" açıksa cümle 5 doğru olmaz.
