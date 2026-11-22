# ig-templates — tek JSON'dan Instagram görseli

1. **Yeni görsel:** `data/<id>.json` yaz (şema: `data/dil-kanca-A.json`, `dil-kanit.json`, `dil-cumle-koyu.json`); `NODE_PATH=/opt/node-tools/node_modules node render.mjs data/<id>.json` → `out/<id>.jpg`; v2 için `check.mjs data/v2/*.json` → `out/v2/` (PNG arşivi `out/**/arsiv/`). Kural ihlalinde (ör. "metin çok uzun") HATA verir, çıktı üretmez.
2. **Test:** `node check.mjs data/<id>.json [...]` — mürekkep sınırları, kontrast, 330 px satır yüksekliği, yasak içerik, font, JPG, arka plan, ekran hash. Kırmızıda çıkış kodu 1 ve `out/<id>.jpg` silinir. Gerçek ekran dosyası bilerek değişirse: `--ekran-hash-guncelle`.
3. **Grid planı:** `plan/grid-plan.json` (en yeni → en eski) → `node ritim.mjs` (yatay/dikey aynı aile/zemin uyarısı + önerilen sıra, `out/ritim-oneri.json`).
4. **Önizleme:** `node onizleme.mjs --oneri` → `out/onizleme-grid.jpg` (hesabın grid ekranına yerleştirilmiş montaj), `out/onizleme-sheet.jpg`, `out/330/*.jpg`.
5. **Sprite:** `node sprites/uret.mjs` → `assets/figur/*.png` + `manifest.json` (v5 3B malzemesi; yeni prop eklemek için `sprites/sprite.mjs`).

Tüm renk/boyut/marj değerleri `tokens.json`'da. Aileler: `kanca` (koyu, Reels/post34), `kanit` (krem, post34, gerçek ekran + büyüteç), `cumle` (koyu|krem, post34).
