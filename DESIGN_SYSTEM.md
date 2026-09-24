# Design System — QR Menu Official

Bu doküman, ana satış sitesinin tüm görsel ve yapısal kararları için kalıcı referanstır. Buradaki kurallar bağlayıcıdır; herhangi bir section, sayfa veya component bu dokümana aykırı üretilemez.

Bu dosya yalnızca **kural** tanımlar. Herhangi bir section, layout veya sayfa tasarımı içermez.

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

| Token | Kullanım | Değer (referans) |
|---|---|---|
| `--color-bg` | Ana zemin | `#FFFFFF` |
| `--color-bg-alt` | Alternatif/section zemin | `#F7F7F5` |
| `--color-ink` | Ana metin | `#14151A` |
| `--color-ink-muted` | İkincil metin | `#5B5E68` |
| `--color-border` | Çizgi/ayraç | `#E6E6E2` |
| `--color-brand` | Marka vurgusu (CTA, link, aktif durum) | `#1A5F4A` |
| `--color-brand-dark` | Marka vurgusu hover/basılı | `#123F32` |
| `--color-accent` | İkincil vurgu (opsiyonel, sınırlı kullanım) | `#C9A25D` |
| `--color-danger` | Hata/uyarı | `#B3261E` |
| `--color-success` | Onay/başarı | `#1E7A4C` |

Kurallar:
- Marka rengi (`--color-brand`) sayfada **azınlık** olarak kullanılır: CTA butonları, aktif linkler, küçük vurgu detayları. Büyük renkli bloklar/arka planlar için kullanılmaz.
- `--color-accent` çok sınırlı, tekil vurgu noktalarında (örn. bir rakam, bir alıntı işareti) kullanılır — asla ana CTA rengi olarak kullanılmaz.
- Sayfanın %90'ından fazlası nötr tonlarda (bg, ink, border) kalır.
- Koyu tema bu aşamada tanımlanmamıştır; ileride eklenirse aynı token yapısı üzerinden `data-theme="dark"` ile genişletilir.

---

## 3. Tipografi

### Font ailesi
- **Başlıklar (display/heading)**: Serif veya güçlü karakterli bir editorial serif (örn. "Editorial-style serif") — markanın "dergi" hissini taşır.
- **Gövde metni (body/UI)**: Nötr, okunabilir bir sans-serif (örn. sistem sans veya Inter benzeri).
- Font seçimi kesinleştiğinde bu tabloya font-family değerleri eklenecektir; şu an yalnızca rol tanımı kalıcıdır (serif = başlık, sans = gövde).

### Tipografi hiyerarşisi

| Token | Rol | Yaklaşık boyut (desktop) | Yaklaşık boyut (mobile) |
|---|---|---|---|
| `--text-display` | Hero/ana başlık | 56–72px | 32–40px |
| `--text-h1` | Section başlığı (birincil) | 40–48px | 28–32px |
| `--text-h2` | Section başlığı (ikincil) | 28–32px | 22–24px |
| `--text-h3` | Alt başlık / kart başlığı | 20–22px | 18–19px |
| `--text-body-lg` | Vurgulu gövde metni (lead paragraf) | 18–20px | 16–17px |
| `--text-body` | Standart gövde metni | 16px | 15–16px |
| `--text-small` | Yardımcı/etiket metni | 13–14px | 13px |

Kurallar:
- Satır yüksekliği: başlıklarda `1.1–1.25`, gövde metninde `1.5–1.7`.
- Satır uzunluğu (measure): gövde metni bloklarında yaklaşık `60–75` karakter/satır; daha uzun blok gerekiyorsa metin ikiye bölünür.
- Bir section içinde en fazla 2 seviye başlık hiyerarşisi kullanılır (örn. h2 + h3); daha derin iç içe başlık yapısı kurulmaz.
- Ağırlık (font-weight) skalası sınırlıdır: Regular (400), Medium (500), Semibold (600). Bold (700+) yalnızca çok istisnai vurgularda.

---

## 4. Breakpoint Sistemi

Mobile-first yaklaşım esastır; stiller önce mobil için yazılır, sonra `min-width` ile büyütülür.

| Token | Aralık | Hedef |
|---|---|---|
| `--bp-mobile` | `0–599px` | Telefon |
| `--bp-tablet` | `600–1023px` | Tablet / küçük laptop |
| `--bp-desktop` | `1024–1439px` | Standart masaüstü |
| `--bp-desktop-lg` | `1440px+` | Geniş ekran |

Kurallar:
- Medya sorguları yalnızca `min-width` ile yukarı doğru kurulur (mobile-first). `max-width` sorguları yalnızca istisnai düzeltmelerde kullanılır.
- Tasarım 3 ana kırılımda test edilir: **375px (mobil)**, **768px (tablet)**, **1440px (desktop)**. Bu üç genişlikte de taşma ve kırılma olmamalıdır.

---

## 5. Max-Width ve Grid Sistemi

| Token | Değer | Kullanım |
|---|---|---|
| `--container-max` | `1200px` | Standart içerik container'ı |
| `--container-max-narrow` | `760px` | Metin ağırlıklı bloklar (uzun paragraf, alıntı) |
| `--container-max-wide` | `1440px` | Tam genişlik görsel/vurgu section'ları |
| `--gutter` | `24px` (mobile) / `40px` (tablet) / `64px` (desktop) | Container yan boşluğu |

Grid:
- Temel grid **12 kolon**dur, `--gutter` kadar kolon aralığıyla.
- Mobilde grid genellikle **tek kolona** düşer; tablet'te section'a göre **2 kolon**, desktop'ta gerektiğinde **12 kolonun alt kümeleri** (örn. 6+6, 4+8, 3+3+3+3) kullanılır.
- Grid, görsel dolgu amacıyla değil, **anlam ilişkisini** yansıtmak için bölünür (örn. problem solda / sonuç sağda).

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

| Token | Değer | Kullanım |
|---|---|---|
| `--radius-sm` | `6px` | Etiket, badge, küçük UI elemanı |
| `--radius-md` | `12px` | Buton, input, küçük kart |
| `--radius-lg` | `20px` | Büyük kart, panel |
| `--radius-xl` | `28px` | Görsel çerçeveleri, öne çıkan bloklar |
| `--radius-pill` | `999px` | Pill-buton, tag |

Kural: Sayfa genelinde en fazla 2–3 radius değeri birlikte kullanılır (örn. buton için `md`, kart için `lg`). Rastgele karışık radius kullanımı yasaktır.

---

## 8. Buton Sistemi

### Varyantlar
- **Primary**: `--color-brand` zemin, beyaz metin. Ana CTA'lar için (tek section'da genellikle 1 adet).
- **Secondary**: şeffaf/ghost zemin, `--color-ink` metin, `--color-border` çerçeve. İkincil aksiyonlar için.
- **Text/Link buton**: zemin yok, alt çizgi veya ok ikonuyla desteklenen metin linki. Düşük öncelikli aksiyonlar için.

### Boyutlar
| Token | Yükseklik | Kullanım |
|---|---|---|
| `--btn-lg` | 56px | Hero / ana CTA |
| `--btn-md` | 48px | Section içi standart CTA |
| `--btn-sm` | 40px | Yardımcı/ikincil aksiyon |

Kurallar:
- Bir section içinde en fazla **1 primary buton** bulunur; birden fazla CTA gerekiyorsa ikincisi mutlaka `secondary` veya `text` varyantıdır.
- Buton metni her zaman net bir eylem bildirir ("Demo iste", "Fiyatları gör"); belirsiz metin ("Devam et", "Tıkla") kullanılmaz.
- Buton içi yatay padding dikeyin en az 2 katıdır (örn. 48px yükseklik → min 24px yan padding).

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

- İkonlar **açıklayıcı**, tekil çizgi (line/outline) stilinde, tutarlı bir ikon setinden gelir. Emoji, karışık stil ikon (bazısı dolu bazısı çizgi) kullanılmaz.
- İkon, metnin yerine geçmez; her zaman bir metinle birlikte anlam taşır. Salt dekoratif/anlamsız ikon kullanılmaz.
- Standart ikon boyutları: `20px` (metin içi/inline), `24px` (buton/liste), `32–40px` (öne çıkan tekil vurgu).
- İkon rengi varsayılan olarak `--color-ink` veya `--color-ink-muted`; marka rengi yalnızca gerçek bir vurgu/aktif durum ifade ediyorsa kullanılır.

---

## 11. Görsel / Mockup Kullanımı

- Ürün görselleri gerçek arayüz ekran görüntüsü/mockup temellidir; soyut illüstrasyon veya stok görsel "SaaS klişesi" (el sıkışan insanlar, jenerik grafik ikonlar) kullanılmaz.
- Mockup'lar cihaz çerçevesiyle (telefon/tablet frame) veya sade bir kart/panel çerçevesiyle sunulur; gölge ve perspektif abartılı olmaz.
- Bir section'da en fazla **1 ana görsel/mockup odağı** olur; birden fazla görsel varsa biri baskın, diğerleri destekleyicidir (hiyerarşi net olmalı).
- Görseller her zaman `alt` metniyle birlikte, gerçek ürün bağlamını yansıtır; kurgusal/yanıltıcı arayüz ekranı üretilmez.

---

## 12. Responsive Kurallar ve Mobile-First Davranış

- Tüm CSS **mobil stil temel alınarak** yazılır; tablet/desktop stiller `min-width` media query ile eklenir.
- Mobilde:
  - Grid tek kolona düşer.
  - Yatay scroll/taşma sıfır tolerans.
  - Dokunma hedefleri (buton, link) minimum `44x44px`.
  - Büyük görseller mobilde yeniden kadrajlanır/kırpılır, sadece küçültülmez.
- Tablet, mobil ile desktop arasında **kendi ara durumu** olarak ele alınır; doğrudan desktop grid'inin küçültülmüş hali değildir.
- Section spacing mobilde oransal olarak azalır (bkz. madde 6) ama hiyerarşi (hangi boşluk daha büyük) korunur.

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
