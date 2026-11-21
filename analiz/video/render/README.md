# Çoklu Dil Reels — render hattı

1080×1920, 30 fps, 28 sn. Üç boyutlu sahne three.js (yerel kopya: `../vendor/three/`, r160, MIT) ile kurulur; her kare `window.frame(t)` ile
deterministik çizilir ve Playwright (swiftshader) ile PNG/JPEG'e alınır; ffmpeg birleştirir.

```
python3 analiz/video/render/tex-hazirla.py                         # ekran/*.png → render/tex/*.jpg (kırpma; arayüz yeniden çizilmez)
node analiz/video/render/render.mjs --out /tmp/kare --workers 4    # 840 kare (≈80 sn, 4 işçi)
python3 analiz/video/render/kapanis.py /tmp/kare                   # son 0,7 sn → ilk kareye çapraz geçiş
analiz/video/encode.sh /tmp/kare analiz/video/out/coklu-dil-reels.mp4
node analiz/video/render/render.mjs --olc 1 --out analiz/video/out # güvenli bölge + en küçük yazı ölçümü (out/guvenli-bolge.json)
node analiz/video/render/render.mjs --times 0,10.6,19 --out /tmp/on  # tek kare önizleme
```
`node` için `playwright` gerekir (`NODE_PATH`). Ses: `analiz/video/ses/anlatim.mp3` konursa `encode.sh` -14 LUFS'a normalize edip ekler; yoksa sessiz AAC kanalı yazar.

Panel ekranları (salt okunur): `tools/panel-video/giris-env.js` (kimlik bilgisi yalnız `PANEL_HOST/PANEL_USER/PANEL_PASS` ortam değişkenlerinden),
`ceviri-ekran.js`, `ceviri-kutular.js`. Oturum çerezleri `tools/panel-video/w/` (gitignore'da) altına yazılır ve iş bitince silinir.

## v2 (düzeltme turu)
```
python3 analiz/video/render/ses-uret.py                              # ambient bed (ses/ambient-bed.wav, git'e girmez)
node analiz/video/render/render.mjs --out /tmp/kare2 --workers 4     # 840 kare
analiz/video/encode-v2.sh /tmp/kare2 analiz/video/out/coklu-dil-reels_v2.mp4
python3 analiz/video/render/dogrula-v2.py /tmp/kare2                  # ffprobe, LUFS, boş kare, kontrast, güvenli bölge, altyazı, kontrol kareleri
```
v1 kaynağı: `render/scene-v1.mjs`, `render/index-v1.html` (v1 mp4: `out/coklu-dil-reels.mp4`). Rapor: `video-v2-rapor.md`.
