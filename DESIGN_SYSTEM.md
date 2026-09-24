# Design System — QR Menu Official

Bu doküman, ana satış sitesinin tüm görsel ve yapısal kararları için kalıcı referanstır. Buradaki kurallar bağlayıcıdır; herhangi bir section, sayfa veya component bu dokümana aykırı üretilemez.

Bu dosya yalnızca **kural** tanımlar. Herhangi bir section, layout veya sayfa tasarımı içermez.

---

## 0. Source of Truth

**Existing production UI code is the source of truth for already implemented visual tokens. New site sections must reuse these tokens unless a deliberate design-system change is explicitly approved.**

- Hero V3 (mevcut production kodu), bu dokümanda **[Kesin]** olarak işaretlenen tüm değerlerin doğrulama kaynağıdır.
- Hero V3 kodunda açıkça bulunan renk, tipografi, layout ve component değerleri bu dosyaya **olduğu gibi** aktarılmıştır; hiçbiri yorumlanarak veya genişletilerek değiştirilmemiştir.
- Hero V3'te bulunmayan ama bu dosyada daha önce yer alan değerler (varsayımsal renk/font/spacing) **[Varsayım — doğrulanmadı]** olarak işaretlidir ve resmi token kabul edilmez; yeni section'lar bunları kullanamaz.
- Yeni bir section üretilirken, ilgili görsel token zaten Hero V3'te doğrulanmışsa, o token **aynen** yeniden kullanılır. Yeni bir değere gerçekten ihtiyaç varsa, bu önce açık bir onayla bu dosyaya eklenir; koda doğrudan "tek seferlik" yeni değer yazılmaz.

---

## 1. Tasarım Kimliği

QR Menu Official, **premium editorial SaaS** estetiğine sahiptir.

Bu şu anlama gelir:
- Sayfa bir dergi/editorial yayın gibi nefes alır: bol boşluk, net tipografi hiyerarşisi, az ama güçlü görsel.
- Ürün ciddiyeti öne çıkar; "eğlenceli startup" veya "ajans landing page" tonu kullanılmaz.
- Her section kendi başına sakin durur; sayfa bir bütün olarak akar, parça parça hissettirmez.

### Kesinlikle olmayacaklar

- **WordPress admin görünümü**: gri paneller, kutu içinde kutu, varsayılan form görünümleri, admin-tarzı tablo/liste blokları yasak.
- **Klasik SaaS feature-card kalabalığı**: 3'lü/4'lü/6'lı ikon+başlık+açıklama kutularının art arda tekrarı yasak. Özellikler anlatılırken kartlar değil, editorial anlatım (görsel + bağlamsal metin) tercih edilir.
- **Gereksiz dekoratif eleman**: amaçsız gradient, anlamsız blob/şekil, stok ikon yığını, "hero'da uçuşan 3D obje" gibi süsler yasak. Her görsel öğe bir bilgi taşımalı.
- **Mobilde taşma**: hiçbir section, hiçbir genişlikte yatay scroll veya taşma üretmez.
- **Section'lar arası kopukluk**: renk, spacing ve tipografi geçişleri ani/uyumsuz olamaz; sayfa tek bir tasarım dilinin devamı gibi akmalı.

---

## 2. Marka Renkleri

Renk paleti sade ve kısıtlıdır. Amaç: editorial sakinlik + net bir marka vurgusu.

### [Kesin] — Hero V3'ten doğrulanmış marka renkleri

Aşağıdaki değerler Hero V3 production kodunda açıkça bulunur ve resmi marka paleti olarak kabul edilir.

| Token | Kullanım | Değer |
|---|---|---|
| `--color-deep-forest` | Primary / Deep Forest | `#0D2B22` |
| `--color-secondary-forest` | Secondary Forest | `#173226` |
| `--color-green-hover` | Green Hover | `#1E3D2F` |
| `--color-gold` | Gold | `#C9A84C` |
| `--color-gold-light` | Gold Light | `#E8C766` |
| `--color-off-white` | Off White | `#F4F1E8` |

### TBD — Hero V3'te doğrulanmayan roller

Aşağıdaki rollere karşılık gelen kesin bir değer Hero V3'te bulunmuyor. Bu roller resmi token olarak sabitlenmemiştir; uydurulmamıştır ve marka kaynağından/Hero V3'ün başka bir bileşeninden doğrulandığında girilecektir.

| Token (rol) | Kullanım | Değer |
|---|---|---|
| `--color-danger` | Hata/uyarı | TBD |
| `--color-success` | Onay/başarı | TBD |
| `--color-logo-*` | Logo renkleri (Hero V3 dışında logo asset'i doğrulanmadı) | TBD |

Kurallar:
- Deep Forest (`--color-deep-forest`) ve Secondary Forest (`--color-secondary-forest`) marka zemin/yüzey rengi olarak kullanılır; Gold (`--color-gold`) ve Gold Light (`--color-gold-light`) **sınırlı, tekil vurgu** amacıyla kullanılır (kenarlık, ikon, ince detay) — geniş dolgu/arka plan rengi olarak kullanılmaz.
- Off White (`--color-off-white`) açık zemin/metin karşıtlığı için kullanılır.
- Koyu tema bu aşamada ayrıca tanımlanmamıştır; Hero V3'ün kendisi zaten koyu (deep forest) bir zemin üzerine kuruludur.

---

## 3. Tipografi

### Font ailesi

#### [Kesin] — Hero V3'ten doğrulanmış font stack

```
"Segoe UI", Roboto, Helvetica, Arial, sans-serif
```

Bu, Hero V3'te gövde ve başlıklarda kullanılan gerçek font stack'idir.

**Playfair Display veya başka bir editorial serif, resmi site fontu olarak tanımlanmamıştır.** Hero V3 kodunda serif font kullanımı yoktur; önceki taslakta yer alan "başlıklarda serif" varsayımı Hero V3 ile doğrulanmadığı için kaldırılmıştır ve resmi token değildir.

- **Başlıklar ve gövde metni**: Yukarıdaki sans-serif stack, Hero V3'te hem başlık hem gövde için kullanılır. Ayrı bir başlık fontu (serif veya başka bir aile) şu an doğrulanmamıştır ve **[Varsayım — doğrulanmadı]** kabul edilir; yeni section'larda uydurulmaz.

### [Kesin] — Hero V3'ten doğrulanmış tipografi değerleri (Hero bileşeni)

Aşağıdaki değerler yalnızca Hero V3 bileşeninde doğrulanmıştır; genel site tipografi skalası olarak genişletilmemiştir.

| Öğe | Boyut | Weight | Diğer |
|---|---|---|---|
| Eyebrow | `11px` | `800` | letter-spacing `.19em` |
| H1 | `clamp(32px, 5vw, 58px)` | `800` | line-height `1.14`, letter-spacing `-.025em` |
| Subtitle | `clamp(17px, 2.2vw, 23px)` | `700` | — |
| Description | `clamp(15px, 1.7vw, 17.5px)` | — | line-height `1.65` |
| Feature title | `clamp(14.5px, 1.5vw, 16px)` | `700` | — |
| Feature secondary text | `clamp(12px, 1.2vw, 13.5px)` | — | — |

### TBD — Hero V3 dışındaki genel tipografi skalası

Önceki taslakta yer alan genel `--text-display / --text-h1 / --text-h2 / --text-h3 / --text-body-lg / --text-body / --text-small` skalası Hero V3 kodunda doğrulanmamıştır. Bu tokenlar **resmi değer olarak sabitlenmemiştir**; Hero V3'te doğrulanan tipografi yalnızca yukarıdaki Hero-özel tablodur. Site genelinde kullanılacak h2/h3/body ölçekleri, ilgili section'lar production'a alınırken (veya başka bir doğrulanmış kaynaktan) netleştirilecektir.

Hero V3'ten doğrulanan genel kurallar:
- Ağırlık skalası Hero V3'te `700` ve `800` olarak gözlenmiştir; `400/500/600` gibi ara ağırlıkların genel site kuralı olduğu doğrulanmamıştır.

---

## 4. Breakpoint Sistemi

Mobile-first yaklaşım esastır; stiller önce mobil için yazılır, sonra `min-width` ile büyütülür.

### [Kesin] — Hero V3'ten doğrulanmış breakpoint ve gutter değerleri

| Değer | Karşılık |
|---|---|
| Mobile breakpoint | `900px` (bu noktanın altında Hero tek kolona düşer) |
| Mobile horizontal gutter | `20px` |
| `<=480px` gutter | `16px` |

### TBD — genel site breakpoint skalası

Önceki taslaktaki `--bp-mobile (0–599px)`, `--bp-tablet (600–1023px)`, `--bp-desktop (1024–1439px)`, `--bp-desktop-lg (1440px+)` token'ları Hero V3 kodunda doğrulanmamıştır ve **[Varsayım — doğrulanmadı]** kabul edilir; resmi token olarak sabitlenmemiştir. Hero V3'ün doğruladığı tek kesin kırılım noktası `900px`'dir (mobil/desktop ayrımı için). Ara bir "tablet" kırılımı Hero V3'te ayrıca tanımlanmamıştır.

Kurallar:
- Medya sorguları yalnızca `min-width` ile yukarı doğru kurulur (mobile-first). `max-width` sorguları yalnızca istisnai düzeltmelerde kullanılır.
- Hero V3 doğrulaması: `900px` altı mobil düzen, `<=480px` ve `<=360px` için ayrıca görsel boyut ayarları mevcuttur (bkz. madde 5 ve madde 11).

---

## 5. Max-Width ve Grid Sistemi

### [Kesin] — Hero V3'ten doğrulanmış layout değerleri

| Değer | Karşılık |
|---|---|
| Hero desktop grid | `1.08fr / 0.92fr` (sol içerik / sağ görsel) |
| Desktop/tablet sol içerik padding-left | `5vw` |
| Desktop/tablet sağ görsel padding-right | `5vw` |
| Grid gap | `clamp(24px, 4vw, 56px)` |
| Hero max-width | `none` — desktop'ta Hero inner container tam viewport genişliğinde grid kurar |
| `--qrmo-site-max-width` | `1536px` olarak tanımlı, **ancak** desktop Hero'da inner max-width `none` olduğu için bu değer aktif desktop container sınırı olarak kabul edilmez |

Mobilde (900px altı) Hero tek kolona düşer (bkz. madde 4 ve madde 12).

### TBD — genel site container/grid sistemi

Önceki taslaktaki `--container-max (1200px)`, `--container-max-narrow (760px)`, `--container-max-wide (1440px)`, `--gutter` ve "12 kolon grid" tanımı Hero V3 kodunda doğrulanmamıştır; **[Varsayım — doğrulanmadı]** kabul edilir ve resmi token olarak sabitlenmemiştir. Hero V3'ün doğruladığı tek container/max-width bilgisi yukarıdaki tablodadır. Genel site container sistemi, ilgili section'lar Hero V3 dışında bir production kaynakla doğrulandığında netleştirilecektir.

---

## 6. Section ve Container Spacing

| Token | Değer (desktop) | Değer (mobile) | Kullanım |
|---|---|---|---|
| `--space-section-y` | `120–160px` | `64–80px` | Section üst/alt boşluğu |
| `--space-block` | `48–64px` | `32–40px` | Section içi büyük blok arası |
| `--space-element` | `24–32px` | `16–24px` | İlişkili elemanlar arası (başlık-paragraf, paragraf-CTA) |
| `--space-tight` | `8–12px` | `8px` | Etiket, ikon-metin gibi çok yakın çiftler |

Kurallar:
- İki section arasında görsel "sıkışma" olmaz; `--space-section-y` her section için sabit bir ritim oluşturur.
- Bir section içindeki spacing skalası yalnızca yukarıdaki 4 tokendan seçilir; keyfi ara değerler (örn. "37px") kullanılmaz.

---

## 7. Border Radius

### [Kesin] — Hero V3'ten doğrulanmış radius değerleri

| Değer | Kullanım |
|---|---|
| `11px` | Feature icon radius |
| `12px` | CTA radius |
| `20px` | Hero image radius |

### TBD — genel radius skalası

Önceki taslaktaki `--radius-sm (6px)`, `--radius-lg (20px, "büyük kart" rolüyle)`, `--radius-xl (28px)`, `--radius-pill (999px)` token'ları Hero V3'te bu rolleriyle doğrulanmamıştır; **[Varsayım — doğrulanmadı]** kabul edilir. Not: `12px` (CTA) ve `20px` (Hero image) değerleri Hero V3'te doğrulanmıştır ancak yukarıdaki genel `--radius-md` / `--radius-lg` tanımlarıyla aynı role sahip olduğu **varsayılmaz** — yalnızca yukarıdaki tabloda belirtilen bileşenler için geçerlidir.

Kural: Yeni bir component radius'a ihtiyaç duyarsa, önce Hero V3'te doğrulanmış bir değer (11px / 12px / 20px) tekrar kullanılabilir mi diye kontrol edilir; kullanılamıyorsa yeni değer bu dosyaya açık onayla eklenir.

---

## 8. Buton Sistemi

### [Kesin] — Hero V3'ten doğrulanmış CTA değerleri

| Değer | Karşılık |
|---|---|
| Zemin | Green gradient: `#1E3D2F → #0D2B22` |
| Kenarlık | Gold border, `1.5px` |
| Radius | `12px` (bkz. madde 7) |
| Diğer | Shadow ve subtle hover motion mevcut (Hero V3'te gözlenen davranış; kesin easing/süre değeri kodda ayrıca belirtilmedi) |

### TBD — genel buton varyant/boyut sistemi

Önceki taslaktaki "Primary / Secondary / Text" varyant tanımları ve `--btn-lg (56px) / --btn-md (48px) / --btn-sm (40px)` yükseklik skalası Hero V3 kodunda doğrulanmamıştır; **[Varsayım — doğrulanmadı]** kabul edilir ve resmi token olarak sabitlenmemiştir. Hero V3'ün doğruladığı tek CTA, yukarıdaki tablodaki gradient/gold-border/12px-radius kombinasyonudur.

Kurallar:
- Bir section içinde en fazla **1 primary buton** bulunur; birden fazla CTA gerekiyorsa ikincisi mutlaka daha düşük vurgulu bir varyanttır (varyant detayı TBD).
- Buton metni her zaman net bir eylem bildirir ("Demo iste", "Fiyatları gör"); belirsiz metin ("Devam et", "Tıkla") kullanılmaz.

---

## 9. Kart Sistemi

Kartlar **ölçülü ve amaca özel** kullanılır; genel "her şeyi karta koy" refleksi yasaktır.

Kural olarak kart kullanılabilecek yerler:
- Somut, karşılaştırılabilir birim veren içerikler (örn. tek bir müşteri kanıtı, tek bir plan/paket).
- Bir liste değil, bağımsız bir bilgi biriminin sınırlanması gerektiğinde.

Kart kullanılmaması gereken yerler:
- Genel özellik listeleme (bkz. madde 1 — feature-card kalabalığı yasağı).
- Sadece görsel doldurmak için üretilen tekrarlı bloklar.

### Kart yapı kuralları
| Token | Değer |
|---|---|
| `--card-radius` | `--radius-lg` |
| `--card-padding` | `32–40px` (desktop) / `24px` (mobile) |
| `--card-border` | `1px solid --color-border` |
| `--card-shadow` | yok veya çok hafif (`0 1px 2px rgba(0,0,0,0.04)`), asla ağır/dramatik gölge |

---

## 10. İkon Kullanımı

### [Kesin] — Hero V3'ten doğrulanmış feature icon değerleri

| Değer | Karşılık |
|---|---|
| Zemin | Dark green background (`--color-deep-forest` / `--color-secondary-forest` ailesi) |
| Kenarlık | Gold border |
| İkon rengi | Gold-light |
| Boyut | `clamp(38px, 3vw, 44px)` |
| Radius | `11px` (bkz. madde 7) |
| Ayraç (feature separators) | `rgba(201,168,76,.25)` |

### TBD — genel ikon skalası

Önceki taslaktaki `20px / 24px / 32–40px` genel ikon boyut skalası Hero V3'te bu haliyle doğrulanmamıştır; **[Varsayım — doğrulanmadı]** kabul edilir. Hero V3'ün doğruladığı tek ikon boyutu `clamp(38px, 3vw, 44px)` (feature icon) değeridir.

Kurallar:
- İkonlar **açıklayıcı**, tekil çizgi (line/outline) stilinde, tutarlı bir ikon setinden gelir. Emoji, karışık stil ikon (bazısı dolu bazısı çizgi) kullanılmaz.
- İkon, metnin yerine geçmez; her zaman bir metinle birlikte anlam taşır. Salt dekoratif/anlamsız ikon kullanılmaz.

---

## 11. Görsel / Mockup Kullanımı

### [Kesin] — Hero V3'ten doğrulanmış hero görsel değerleri

| Değer | Karşılık |
|---|---|
| Max-width (desktop) | `480px` |
| Radius | `20px` (bkz. madde 7) |
| Efekt | Subtle dark shadow + subtle gold outline |
| `<=480px` max-width | `260px` |
| `<=360px` max-width | `220px` |
| Mobil davranış | Görsel, içerik bloğunun **altına** taşınır (bkz. madde 4 ve madde 12) |

Kurallar:
- Ürün görselleri gerçek arayüz ekran görüntüsü/mockup temellidir; soyut illüstrasyon veya stok görsel "SaaS klişesi" (el sıkışan insanlar, jenerik grafik ikonlar) kullanılmaz.
- Bir section'da en fazla **1 ana görsel/mockup odağı** olur; birden fazla görsel varsa biri baskın, diğerleri destekleyicidir (hiyerarşi net olmalı).
- Görseller her zaman `alt` metniyle birlikte, gerçek ürün bağlamını yansıtır; kurgusal/yanıltıcı arayüz ekranı üretilmez.

---

## 12. Responsive Kurallar ve Mobile-First Davranış

### [Kesin] — Hero V3'ten doğrulanmış responsive davranış

| Değer | Karşılık |
|---|---|
| Mobile breakpoint | `900px` |
| Mobile horizontal gutter | `20px` |
| `<=480px` gutter | `16px` |
| Layout | `900px` altında tek kolona düşer |
| Metin hizası | Mobilde ortalanır (text-align: center) |
| Görsel konumu | Hero image, içerik bloğunun altına taşınır |
| Görsel boyutu | `<=480px`: max-width `260px`; `<=360px`: max-width `220px` |

### Genel kurallar

- Tüm CSS **mobil stil temel alınarak** yazılır; büyük ekran stilleri `min-width` media query ile eklenir.
- Yatay scroll/taşma sıfır tolerans, tüm genişliklerde.
- "Tablet" için Hero V3'te ayrı bir ara kırılım noktası doğrulanmamıştır (bkz. madde 4); genel siteye özel bir tablet davranışı TBD kabul edilir.

---

## 13. Accessibility (Erişilebilirlik)

- Renk kontrastı: metin/arka plan kontrastı en az **WCAG AA** (normal metin 4.5:1, büyük metin 3:1).
- Tüm interaktif elemanlar klavye ile ulaşılabilir ve **görünür bir focus stiline** sahiptir (bkz. madde 15).
- Görseller anlamlı `alt` metni içerir; dekoratif görseller `alt=""` ile işaretlenir.
- Başlık hiyerarşisi (`h1`→`h2`→`h3`) atlanmadan, mantıksal sırayla kurulur.
- Buton ve linkler anlamlı, bağlamdan bağımsız okunabilir metin taşır ("Detaylar" değil, "Fiyatlandırmayı gör").
- Form elemanları (varsa) her zaman görünür `label` ile eşleşir; yalnızca placeholder ile etiketleme yapılmaz.

---

## 14. `prefers-reduced-motion` Davranışı

- Tüm animasyon ve geçişler `@media (prefers-reduced-motion: reduce)` sorgusuna saygı gösterir.
- Bu sorgu aktifken:
  - Giriş/scroll animasyonları devre dışı bırakılır veya anlık (0–10ms) hale getirilir.
  - Otomatik oynatılan/kayan görsel-metin döngüleri durur veya statik son haliyle gösterilir.
  - Sadece **fonksiyonel** durum geçişleri (örn. hover renk değişimi) minimal ve kısa sürede kalabilir.
- Reduced motion, "eksik deneyim" değil, eşdeğer bir deneyimdir: bilgi kaybı olmamalıdır.

---

## 15. Hover / Focus Durumları

- Her interaktif eleman (buton, link, kart, ikon-buton) için **hover** ve **focus-visible** durumu ayrı ayrı tanımlanır.
- Hover: hafif durum değişimi (renk koyulaşması, hafif `translateY(-2px)` gibi mikro hareket) — asla ani/sert renk sıçraması değil.
- Focus-visible: her zaman görünür bir dış çerçeve/outline (`2px solid --color-brand` veya eşdeğeri, min. `2px` offset ile). `outline: none` yalnızca eşdeğer bir görünür alternatif veriliyorsa kullanılabilir; asla tamamen kaldırılmaz.
- Aktif/basılı (`:active`) durum, hover'dan bir ton daha koyu/kısık olur.
- Dokunmatik cihazlarda hover durumları "yapışık" kalmaz (touch sonrası hover stilinin takılı kalması engellenir).

---

## 16. Animasyon Prensipleri

- Animasyon **anlatıyı destekler**, dikkat dağıtmaz. Amaçsız/dekoratif hareket (sürekli dönen ikon, sonsuz parıltı efekti vb.) kullanılmaz.
- Süre skalası:
  - Mikro etkileşim (hover, focus): `120–180ms`
  - Giriş/görünürlük animasyonu (scroll-in): `240–400ms`
  - Section geçişleri: `400–600ms`
- Easing: doğal/yumuşak eğriler (`ease-out` giriş için, `ease-in-out` durum geçişleri için); sert `linear` yalnızca sürekli/yükleniyor göstergelerinde.
- Bir seferde en fazla 1–2 eleman aynı anda animasyonlanır; sayfanın büyük kısmının aynı anda hareket etmesi yasaktır.

---

## 17. Z-Index Katmanları

| Token | Değer | Kullanım |
|---|---|---|
| `--z-base` | `0` | Normal akış içeriği |
| `--z-raised` | `10` | Section içi öne çıkan panel/kart |
| `--z-sticky` | `100` | Yapışkan header/nav |
| `--z-overlay` | `500` | Sayfa üstü overlay/backdrop |
| `--z-modal` | `1000` | Modal/dialog içerik |
| `--z-toast` | `1100` | Bildirim/toast |

Kural: Bu skalanın dışında keyfi z-index değeri (`z-index: 9999` gibi) kullanılmaz.

---

## 18. CSS Naming Convention

- **BEM benzeri** bir yapı esas alınır: `block__element--modifier`.
  - Örnek: `.hero__title`, `.hero__title--compact`, `.card__cta`.
- Tüm class isimleri **İngilizce**, küçük harf, kebap/BEM karışımı değil, tutarlı BEM formatındadır.
- Global utility class'lar (`--space-*`, `--text-*` gibi token isimlerine paralel, örn. `.u-container`, `.u-visually-hidden`) `u-` öneki ile ayrılır.
- Component'e özel class'lar asla section'a özel isimle çakışmaz (örn. `.hero` component'i başka section içinde tekrar farklı anlamla kullanılmaz).
- ID selector'lar stil için kullanılmaz; ID yalnızca anchor/JS hook amaçlıdır.

---

## 19. Component / Section İzolasyonu

- Her section kendi kapsayıcı class'ı altında **kendi kendine yeten** bir stil bloğu olarak tanımlanır (örn. `.section-problem { }` altında yalnızca o section'a ait alt elemanlar).
- Bir section'ın stili başka bir section'ın DOM yapısına veya class'ına **bağımlı olamaz** (yani section'lar birbirinin varlığını bilmeden de doğru render olmalıdır).
- Ortak/tekrar eden görsel elemanlar (buton, kart, badge) component olarak ayrıştırılır ve tüm section'lar bu ortak component'leri **referans** eder, kendi local kopyasını üretmez.
- Section'lar arası geçişte kullanılan boşluk, renk ve tipografi bu dokümandaki token'lardan gelir; hiçbir section kendi özel/tek seferlik değeri icat etmez.

---

## 20. Genel Bütünlük Kuralı

Yeni bir section, sayfa veya component üretilirken:
1. Önce bu dokümandaki token ve kurallar kontrol edilir.
2. Yeni bir değer (renk, spacing, radius, vb.) gerekiyorsa, önce bu dosyaya eklenir — doğrudan koda "tek seferlik" değer yazılmaz.
3. Tasarım, editorial/premium sadeliği bozacak şekilde genişlemez; "daha fazla eleman ekleyerek zenginleştirme" refleksi reddedilir.

Bu doküman yaşayan bir referanstır; güncellenmesi gerektiğinde yalnızca bu dosya üzerinden, açık gerekçeyle güncellenir.
