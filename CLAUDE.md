# Proje kuralları

## Tipografi / tasarım
- İstenmedikçe hiçbir cümle, kelime veya bağlantının altı çizili olmayacak (`text-decoration: underline`, `border-bottom` ile sahte alt çizgi, `background-size` ile çizgi efekti dahil). Bağlantıları renk, ağırlık veya ok ikonuyla ayırt et.
- İstisna: kullanıcının açıkça istediği yerler.
- Mevcut alt çizgiler yeni bir tasarımda fark edilirse kaldır.

## Yazı tipi ve tipografi ölçeği (tüm sayfalar, yeni sayfalar dahil zorunlu)
- Font ailesi yalnızca **Manrope** (kendi sunucumuzdan, `assets/fonts/`; `@font-face` `global/src/type-scale.css`'in bağlandığı global CSS'te). Başka font ailesi, Google Fonts veya sistem fontu yığını ekleme.
- Tek kaynak: `global/src/type-scale.css` (token'lar `--ts-fs-*`, `--ts-fw-*`, `--ts-lh-*`, `--ts-ls-*`; yardımcı sınıflar `.ts-rol`). Her metin şu 14 rolden birini kullanır; ham `px/rem/clamp()/vw` ile boyut, ham kalınlık yazılmaz.
- Kırılımlar global header ile aynı: mobil ≤640 · tablet 641–960 · masaüstü ≥961. Değerler kırılımda sabittir (akışkan ölçekleme yok).

| Rol | Mobil | Tablet | Masaüstü | Kalınlık | Satır yük. |
|---|---|---|---|---|---|
| display | 44 | 56 | 72 | 800 | 1.08 |
| h1 | 34 | 44 | 56 | 800 | 1.14 |
| h2 | 26 | 34 | 40 | 800 | 1.2 |
| h3 | 22 | 24 | 28 | 700 | 1.28 |
| h4 / kart başlığı | 18 | 19 | 20 | 700 | 1.3 |
| lead | 18 | 19 | 20 | 500 | 1.55 |
| body (gövde) | 16 | 16 | 17 | 400 | 1.6 |
| bodyb (gövde kalın) | 16 | 16 | 17 | 700 | 1.6 |
| btn (buton) | 16 | 16 | 16 | 700 | 1.2 |
| link / menü | 15 | 15 | 15 | 700 | 1.4 |
| form alanı | 16 | 16 | 16 | 400 | 1.4 |
| eyebrow (büyük harf, 0.08em) | 12 | 12 | 13 | 700 | 1.3 |
| cap (caption) | 13 | 13 | 14 | 400 | 1.45 |
| capb (caption kalın) | 13 | 13 | 14 | 700 | 1.45 |

- Kalınlıklar yalnızca 400 / 500 / 700 / 800. En küçük metin 12px. Form alanları 16px (iOS yakınlaşması).
- Başlık hiyerarşisi atlanmaz (tek H1, sonra H2 → H3); küçük etiket için başlık etiketi kullanma, `p`/`span` + eyebrow rolü.
- Kapsam dışı yalnızca: açılış ekranı (splash) ve ürün ekranı maketleri (telefon/demo/panel içi temsili arayüz).
- Yeni sayfa/bölüm eklerken: sayfa `global/dist/qrmo-global.css`'i yüklemeli; yeni sınıflara rol ver (`.ts-rol` ya da `global/src/type-scale-pages.css`); sonra `python3 -m http.server 8123` + `node tools/type-scale-qa.mjs` çalıştırıp yeni sayfanın yolunu o dosyadaki `PAGES` listesine ekle. Rapor "Tüm metinler ölçekte" demeden bitirme.
- Maket kapsam dışı sayılan yeni bir sınıf ekleniyorsa `tools/type-scale-qa.mjs` içindeki `MOCK` seçicisine de eklenmeli.
- Okunabilirlik: açık zeminde metin kontrastı ≥4.5:1 (büyük/kalın metin ≥3:1). Açık zeminde altın metin için `#c9a84c` YASAK (2.1:1); `var(--ts-gold-ink)` (#7f6419) kullan. Soluk metin için `var(--ts-ink-soft)`. Koyu zeminde açık altın/krem kullanılabilir.
- Okuma metni satır uzunluğu ≤38em (≈70 karakter) (`var(--ts-measure)`); başlıklarda `text-wrap: balance`, paragraflarda `pretty` global olarak açıktır (`global/src/type-polish.css`). Sayı/fiyat/sayaç için `font-variant-numeric: tabular-nums`. Metin bağlantı/butonları en az 44px yüksekliğinde dokunma hedefi.
- Font yığınında `"Manrope", "Manrope Fallback", system-ui, …` sırası korunur (Fallback, yüklenme sırasındaki kaymayı azaltan metrik eşlemeli yüzdür). Latin ve latin-ext dosyaları birlikte preload edilir (Türkçe ğ ş İ latin-ext'ten gelir).
- Uzun başlık (çok satıra çıkan makale başlığı): etiket `h1` kalır, görsel boyut h2 rolüdür (`body .qb-article__intro > h1`, `type-polish.css`). Başlık mobilde 3 satırı aşıyorsa aynı varyantı kullan.
- Renk geçersiz kılarken (`color: … !important`) sınıfın hangi zeminlerde (açık/koyu, aktif/pasif kart, buton) kullanıldığını kontrol et; yalnız açık zemindeki duruma uygula. Seçiciyi etiket/bileşenle daralt (örn. `span.qrmo-hm-d`).
- Mobilde H1:H2:H3:H4 oranı en az ~1.2 olmalı (34/26/22/18). Metni 60+ karakterlik bölüm başlığı mobilde h3 rolüne indirilebilir (`.qrmo-mod-h2--m` örneği).
- Aynı kapsayıcıdaki başlık + açıklama çiftinde ikisi aynı rol olmasın (hero özellik satırı: başlık bodyb, açıklama cap). Masaüstü/mobil varyant `span` taşıyan sarmalayıcılarda (`.qrmo-hm-d/m`) rolü sarmalayıcıya ver, sınıfı taşıyan anchor/kapsayıcıya değil.
