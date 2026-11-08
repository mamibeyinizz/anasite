# Yorum & Feedback — Instagram Reels

Güncel: **v4** (`out/yorum-feedback-reels-v4.mp4`, `out/cover.png`). 20 sn, 1080×1920, 30 fps, H.264 + AAC (−14 LUFS, ≤ −2 dBTP). v2/v3 arşivdir.
Google, ödül, indirim kodu ve eşik anlatımı **yoktur** (bkz. `/PRODUCT_POLICY_RISKS.md`).

| Sahne | Süre | İçerik |
|---|---|---|
| Kanca | 0–2 | "**Tek bir 1 yıldız**, onlarca müşteriyi uzaklaştırabilir." · halka 1. yıldızın merkezinde, dokunuşla dolar |
| Bildirim | 2–5 | "O puan **önce size** gelsin." · e-posta kartı, düşük puan satırları vurgulanır |
| Puanlama | 5–8,5 | "5 kriter, **tek dokunuş**." · 5 satır tek düzende |
| İletişim | 8,5–10,5 | Aynı cihazda adım geçişi · "İletişim bilgisi **isteğe bağlı**." |
| Panel | 10,5–16,5 | "**Olumsuzlar** tek sekmede." · sekmeye dokunuş, çubuklar dolar |
| CTA | 16,5–20 | Logo · değer cümlesi · DM'e “DEMO” yaz · @qrmenuofficial (tek eksen, 48 px aralık) |

**Grid:** üst 270 / alt 340 px boş, yan 120 px. Başlık kutusu 300–434 (2 × 56/1.2, metin alta hizalı), başlık→içerik 48 px, içerik 482'den başlar. Cihaz tek boyut 840×1040, konum (120, 482).
**Cihaz ekranları HTML ile çizilir** (ürünün renk, kart ve yıldız stiliyle): gerçek form dar ekranda uzun etiketleri ("Fiyat / Performans") yıldızların üstüne sarıyor; tek düzen ve ≥36 px metin için yeniden çizim gerekli. `shots/` artık yalnızca referanstır.

## Kaynaklar
- `shots/`: test sitesindeki gerçek "Bizi Değerlendirin" formu (`capture.js`); v4'te referans (alan adları, renkler).
- Panel kartı ve e-posta bildirimi HTML ile yeniden çizildi (gerçek düzen, demo veri). Bildirim başlığı `qrm_cf_notify_admin` konusuyla aynıdır (`[Site] Yeni form gönderimi: <form adı>`), form ayarından açılır.
- Font: `assets/fonts/manrope-var-*.woff2`. Müzik: `music.py` ile sentezlenir (harici dosya yok).

## Çalıştırma
```sh
node capture.js          # isteğe bağlı: form görüntülerini yeniden al
python3 music.py 20      # out/music_raw.wav
node render.js           # out/yorum-feedback-reels-v4.mp4 + out/cover.png
python3 verify.py        # ffprobe, LUFS/true peak, statik kare, boş içerik, piksel satır hizası + 0,5 sn kontak sheet
node probe.js            # her 0,5 sn DOM: metin ≥36 px, satır hizası, başlık→içerik 48 px, güvenli alan, cihaz boyutu, CTA ekseni
node snap.js 0 4 17      # tek tek kare önizleme
```
Kontak sheet'teki kırmızı çerçeve güvenli alanı (üst 270, alt 340, yan 120 px) gösterir.
