# Yorum & Feedback — Instagram Reels

Güncel: **v3** (`out/yorum-feedback-reels-v3.mp4`, `out/cover.png`). 20 sn, 1080×1920, 30 fps, H.264 + AAC (−14 LUFS). v2 (`out/yorum-feedback-reels-v2.mp4`) arşivdir.
Google, ödül, indirim kodu ve eşik anlatımı **yoktur** (bkz. `/PRODUCT_POLICY_RISKS.md`).

| Sahne | Süre | İçerik (gerçek davranış) |
|---|---|---|
| Kanca | 0–2 | "Tek bir 1 yıldız, onlarca müşteriyi uzaklaştırabilir." · parmak 1. yıldıza dokunur |
| Bildirim | 2–5 | "O puan önce size gelsin." · e-posta kartı (`qrm_cf_notify_admin` konusu), form ayarından açılır |
| Puanlama | 5–8 | 5 kriter tek sahne, yıldızlar hızlı dolar (yalnızca puan kartı kesiti) |
| Panel | 8–13 | Olumsuz sekmesine dokunuş, kriter satırları sayılarla dolar |
| İletişim | 13–16 | Telefon / e-posta kesiti, "isteğe bağlı" |
| CTA | 16–20 | "Demo için DM'e DEMO yaz" · @qrmenuofficial · fayda satırı |

Telefon içi görüntüler sabit kesitlerle gösterilir (kaydırma yok): hiçbir karede yarım satır veya "DEVAM ET" düğmesi görünmez.
Logo: `assets/brand/qr-menu-official-logo-v4-compact.svg`, tüm karelerde sol altta (alt güvenli alanın üstü).

## Kaynaklar
- `shots/`: test sitesindeki gerçek "Bizi Değerlendirin" formu (`capture.js`, temiz demo verisi, form gönderilmez).
- Panel kartı ve e-posta bildirimi HTML ile yeniden çizildi (gerçek düzen, demo veri). Bildirim başlığı `qrm_cf_notify_admin` konusuyla aynıdır (`[Site] Yeni form gönderimi: <form adı>`), form ayarından açılır.
- Font: `assets/fonts/manrope-var-*.woff2`. Müzik: `music.py` ile sentezlenir (harici dosya yok).

## Çalıştırma
```sh
node capture.js          # isteğe bağlı: form görüntülerini yeniden al
python3 music.py 20      # out/music_raw.wav
node render.js           # out/yorum-feedback-reels-v3.mp4 + out/cover.png
python3 verify.py        # ffprobe/ses/loudness/statik kare kontrolleri + out/contact-sheet.png
node probe.js            # her 0,5 sn: en küçük metin (px) ve güvenli alan ihlalleri
node snap.js 0 4 17      # tek tek kare önizleme
```
Güvenli alan: üst %14 (0–269 px), alt %20 (1536–1920 px), yanlar 120 px. Kontak sheet'te kırmızı çerçeve bu alanı gösterir.
