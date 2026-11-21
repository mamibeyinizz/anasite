# Claude Code'a verilecek ana prompt — Panel girişi + Çoklu Dil Reels üretimi

Aşağıdaki bloğu olduğu gibi Claude Code'a yapıştırın. Kimlik bilgilerini sohbete/dosyaya yazmayın; terminalde ortam değişkeni olarak verin:
`export PANEL_HOST=plus.qrmenuofficial.com PANEL_USER='…' PANEL_PASS='…'`

---

ROL: Kıdemli motion/web geliştirici. Repo: `anasite` (dal `claude/qr-menu-instagram-strategy-rs76jf`, PR açma). Çalışma dizini: `analiz/video/`.

AMAÇ: Restoran/kafe sahibine yönelik, 1080×1920, 30 fps, 28 sn Reels üret ("Çoklu Dil" modülü). Akış: sahibin acısı → çözümün gerçek ekranla çalışması → modülün panelde nasıl yönetildiği → tek CTA (canlı menüyü dene). Önce şunları OKU ve birebir uy: `analiz/video/ses-metni.md` (v3 metin ve süreler, "CTA v3"), `analiz/video/kurgu-promptu.md` (sahne akışı, tasarım kuralları), `CONTENT_STRATEGY.md` (§1, §7, §9), repo `CLAUDE.md`.

BÖLÜM A — PANEL EKRANLARINI AL (salt okunur)
1. Giriş: `PANEL_HOST/wp-login.php`, kimlik bilgisi yalnızca `process.env.PANEL_USER/PANEL_PASS`. Şifreyi komut satırı argümanı, log, ekran görüntüsü, commit veya dosyaya YAZMA (`tools/panel-video/login.js` şifreyi argv ile alıyor; kullanma, env okuyan küçük bir script yaz). Oturumu `tools/panel-video/w/state-<host>.json` içine kaydet; bu klasör `.gitignore`'da, `git check-ignore` ile doğrula; iş bitince state dosyasını SİL. 2FA/captcha/kilit çıkarsa DUR ve kullanıcıya bildir; aşmaya çalışma.
2. Yalnızca gezin ve ekran görüntüsü al. Hiçbir ayarı kaydetme, dil ekleme/silme, CSV içe aktarma, ürün düzenleme, eklenti etkinleştirme YAPMA (canlı demo sunucusu). Form gönderen butonlara tıklama.
3. Ekranlar (`admin.php?page=…`): `qrms-module-qr-ceviri` (modül hub kartları) · `qrms-cv-diller` (Diller, dil seçici görünümü) · `qrms-cv-ice` (CSV İçe Aktar) · `qrms-cv-disa` (CSV Dışa Aktar) · `qrms-cv-klasik` (çeviri tablosu, ürün × dil). Sayfa açılmazsa `qrms-overview` sol menüsünden "Diller & Çeviriler" yolunu izle.
4. Çekim: viewport 1280×800, deviceScaleFactor 2, `#qrms-shell` yüklenince (`tools/panel-video/lib.js` mantığını kullan). Dosyalar: `ekran/07-panel-diller-ceviriler.png` (ana sahne için en dolu ekran: `qrms-cv-diller` veya `qrms-cv-klasik`), `07b-panel-hub.png`, `07c-panel-csv-ice.png`.
5. Gizlilik: WordPress yönetici çubuğundaki kullanıcı adı/e-posta, lisans anahtarı, API anahtarı alanları ve alan adı dışındaki kişisel veri görünmesin: kırp ya da bulanıklaştır. Boş/yarım ekran gelirse veri UYDURMA; "veri yok" de, 17–23 sn sahnesini tipografiyle kur (sahte panel çizme).
6. İsteğe bağlı: `qrms-cv-diller`'de 6–8 sn gezinti kaydı (kaydırma/üzerine gelme, tıklama yok) → `ekran/07-panel-gezinti.mp4`.

BÖLÜM B — VİDEO
1. Sahneler `kurgu-promptu.md` v3 ile aynı: 1) hook 2) acı 3) dönüş 4) gerçek mobil ekran (01–06 PNG) 5) panel ekranı 6) CTA. Sahne 5: panel ekran görüntüsü 3D monitör/tablet içinde, kamera yaklaşır; yalnızca gerçek arayüz öğelerini (örn. "Diller", "CSV İçe Aktar", dil listesi) altın çerçeveyle vurgula; üç etiket sırayla girer: "Dilleri siz tanımlarsınız" · "Elle ya da CSV" · "30 dile kadar".
2. Teknik: three.js'in yerel kopyası (CDN yok), Playwright + `--use-gl=angle --use-angle=swiftshader`, kare kare render (`window.frame(t)` deseni), 840 kare, paralel işçiler; ffmpeg: H.264 high, yuv420p, bt709 etiketli, AAC 48 kHz stereo, `+faststart`. Şablon olarak `insta/src/aura` boru hattının yapısına bakabilirsin; içeriğini, metnini ve sesini KULLANMA (başka markaya ait).
3. Ses: `ses/anlatim.mp3` varsa -14 LUFS (±1) normalize et ve altyazıyı kelimesi kelimesine eşle; yoksa sessiz render al, altyazıları `ses-metni.md` sürelerine göre koy.
4. Tipografi/renk: Manrope (`assets/fonts`, yerel), #0D2B22 / #C9A84C / #F4F1E8; altı çizili metin yok; en küçük yazı 40 px; Reels güvenli bölge: üst 270, alt 672, yan 65 px. Hareket: transform/opacity, ease-out `cubic-bezier(.22,1,.36,1)`, her sahne ≥1,2 sn.
5. YASAK içerik: "yapay zeka/AI", "otomatik çeviri", yüzde/oran, "anında", "devrim", "ücretsiz", "sınırsız", uydurma müşteri/sonuç, sahte panel arayüzü. Demo dil seçicisi kaydırılabilir uzun bir liste içerir (Türkçe, English, Deutsch, Français, Español, Italiano, Русский, العربية…; panelde "28 dil etkin" yazar). Listeyi gerçek ekranla göster; "30 dile kadar" modül kapasitesidir, sayı olarak yalnızca yazıyla ver.

BÖLÜM C — DOĞRULAMA VE TESLİM
1. `out/` altına her sahneden kontrol karesi ve 4×6 saniye sheet'i; güvenli bölge dışı metin, bozuk kırpma, kişisel veri taraması.
2. `ffprobe`: 1080×1920, 30 fps, 28,0±0,1 sn, bt709, (ses varsa) -14 LUFS ±1.
3. Altyazı = `ses-metni.md` (kelime kelime). Kapak karesi (ilk kare) 3:4 kırpımda okunuyor mu.
4. Commit: yalnızca mp4, kaynak kod, ekran görüntüleri; kimlik bilgisi, state dosyası, `kare/` ara dosyaları HARİÇ. `git status` ile kontrol et, push `claude/qr-menu-instagram-strategy-rs76jf`. PR açma.
5. Rapor: dosya yolları, her sahnenin gerçek ekran mı tipografi mi olduğu, atlanan/yapamadığın adımlar (giriş, 2FA, boş ekran gibi), kalan riskler.

ÇIKIŞ KRİTERİ: "Tüm ekranlar gerçek, hiçbir ayar değiştirilmedi, kimlik bilgisi hiçbir yerde saklanmadı" cümlesini ancak üçü de doğruysa yaz.
