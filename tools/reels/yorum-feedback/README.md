# Yorum & Feedback — Instagram Reels v2

27 sn, 1080×1920, 30 fps, H.264 + AAC (−14 LUFS). Google, ödül, indirim kodu ve eşik anlatımı **yoktur** (bkz. `/PRODUCT_POLICY_RISKS.md`).

| Sahne | Süre | İçerik (gerçek davranış) |
|---|---|---|
| Kanca | 0–2 | "1 yıldız, 100 müşteri kaybı olabilir." · parmak 1. yıldıza dokunur |
| Puanlama | 2–9 | 5 kriter (Yemek Lezzeti, Hizmet Hızı, Temizlik, Atmosfer, Fiyat / Performans) |
| İletişim | 9–15 | Ad, masa, tarih; telefon ve e-posta isteğe bağlı |
| Panel | 15–21 | Olumlu / olumsuz filtre, puan, masa, kriter kırılımı (tek demo kart) |
| Mesaj | 21–25 | "Memnuniyetsizliği anında duyun, yorumlardan önce çözün." · form e-posta bildirimi |
| CTA | 25–27 | "Demo için DM'e DEMO yaz" · @qrmenuofficial |

## Kaynaklar
- `shots/`: test sitesindeki gerçek "Bizi Değerlendirin" formu (`capture.js`, temiz demo verisi, form gönderilmez).
- Panel kartı ve e-posta bildirimi HTML ile yeniden çizildi (gerçek düzen, demo veri). Bildirim başlığı `qrm_cf_notify_admin` konusuyla aynıdır (`[Site] Yeni form gönderimi: <form adı>`), form ayarından açılır.
- Font: `assets/fonts/manrope-var-*.woff2`. Müzik: `music.py` ile sentezlenir (harici dosya yok).

## Çalıştırma
```sh
node capture.js          # isteğe bağlı: form görüntülerini yeniden al
python3 music.py 27      # out/music_raw.wav
node render.js           # out/yorum-feedback-reels-v2.mp4 + out/cover.png
python3 verify.py        # ffprobe/ses/loudness kontrolleri + out/contact-sheet.png
node snap.js 0 4 17      # tek tek kare önizleme
```
Güvenli alan: üst %14 (0–269 px), alt %20 (1536–1920 px), yanlar 120 px. Kontak sheet'te kırmızı çerçeve bu alanı gösterir.
