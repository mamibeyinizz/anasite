# Yorum & Feedback modülü: ürün politika riskleri

Kapsam: `qr-menu-suite/modules/yorum-feedback` (incelenen commit `f372cee`). Bu dosya yalnızca rapordur; ürün kodu değiştirilmedi.

Bağlam: Google, yalnızca memnun müşteriyi yoruma yönlendirmeyi ("review gating") ve yorum karşılığı teşvik vermeyi yasaklıyor. Modül şu an ikisini de yapıyor ve işletme bunu panelden kapatamıyor. Pazarlama metinleri ve Reels videosu bu nedenle Google ve ödül anlatımı olmadan hazırlandı.

---

## 1. Google eşiği kapatılamıyor (review gating)

**Durum:** Ortalama puan eşiğin altındaysa Google yorum butonu hiç gösterilmiyor. Eşik en düşük 3,0'a çekilebiliyor ama kapatılamıyor.

| Yer | Ne yapıyor |
|---|---|
| `includes/settings.php:196` | Varsayılan `google_review_threshold => 3.5` |
| `includes/admin/rewards.php:381` | Paneldeki seçenekler yalnızca `[3, 3.5, 4, 4.5, 5]` |
| `includes/admin/rewards.php:93-94` | Kayıtta değer `max(1, min(5, …))` aralığına sıkıştırılıyor; 0 / "kapalı" kaydedilemiyor |
| `includes/frontend/form-steps.php:882-886` | Form adımında `avg >= threshold` değilse Google CTA gizleniyor, yerine nötr metin gösteriliyor |
| `includes/rewards/popup-render.php:216-221` | Adım panelinde `data-threshold` basılıyor (yukarıdaki JS bunu okuyor) |
| `includes/ajax/submit-review.php:160-167` | Gönderim sonrası `show_google` / `show_reward` aynı eşikle hesaplanıyor |
| `includes/rewards/functions.php:161-162` | Admin "Test Et" simülasyonu aynı eşik kuralını uyguluyor |
| `includes/admin/dashboard.php:740-741` | Panelde eşiği geçen yorumlar "G Adayı" rozetiyle işaretleniyor ("Google'a yönlendirme eşiğinin üzerinde") |

**Önerilen minimal düzeltme:**
- Google CTA'sını puandan bağımsız yapın: `form-steps.php:883`'te `show` değerini `avg !== null` yapın (puan verildiyse herkese göster), `submit-review.php:161`'deki `$calc_avg >= $threshold` koşulunu kaldırın.
- Geriye dönük uyum için eşik ayarını şimdilik silmeyin; `rewards.php:381` seçeneklerine `0 => "Eşik yok (önerilen)"` ekleyin, `rewards.php:94` alt sınırını `0` yapın ve yeni kurulumlarda `settings.php:196` varsayılanını `0` yapın. Uzun vadede ayarı tamamen kaldırın.
- `dashboard.php:740-741`'deki "G Adayı" rozetini kaldırın; eşik kalkınca anlamı kalmıyor.

---

## 2. Ödül, Google tıklamasına ve puana bağlı (teşvikli yorum)

**Durum:** İndirim kodu yalnızca eşiği geçen puana veriliyor ve varsayılan olarak müşterinin Google'a tıklayıp belirli süre sonra sekmeye dönmesini bekliyor. Bu, Google yorumu karşılığı teşvik anlamına geliyor.

| Yer | Ne yapıyor |
|---|---|
| `includes/ajax/submit-review.php:165-173` | `show_reward = $eligible && $reward_on`; kod talep anahtarı yalnızca eşiği geçene üretiliyor |
| `includes/rewards/functions.php:573-575` | Sunucu, eşiğin altındaki puana kod vermeyi reddediyor ("ödül koşulunu karşılamıyor") |
| `includes/settings.php:266` | `qrm_reward_require_return => 1` (varsayılan açık) |
| `includes/rewards/popup-render.php:42-43`, `:343` | `requireReturn` istemciye geçiriliyor |
| `includes/rewards/popup-render.php:419-428`, `:502` | Kod akışı `google_clicked`, ardından `returned` (Google sekmesinden dönüş) olayına bağlı |
| `includes/rewards/events.php:9-10`, `:96-97` | Dönüşüm hunisi Google tıklaması ve dönüşü ödül adımı olarak ölçüyor |
| `includes/settings.php:240` | Varsayılan popup metni "Bizi Google üzerinden puanlayın ve bir sonraki siparişinizde %10 indirim kazanın!" |

**Önerilen minimal düzeltme:**
- Ödülü form gönderimine bağlayın: `functions.php:573-575`'teki puan kontrolünü kaldırın, `submit-review.php:168`'i `$show_reward = $reward_on` yapın.
- `settings.php:266` varsayılanını `0` yapın ve `requireReturn` / `google_clicked` / `returned` koşulunu kod verme yolundan çıkarın (olaylar istatistik olarak kalabilir).
- Popup'ta Google butonu ile ödülü ayırın: ödül "Geri bildiriminiz için teşekkür indirimi" olsun, Google bağlantısı ayrı ve koşulsuz bir seçenek olarak dursun. Varsayılan popup başlık/metin/buton değerlerini buna göre değiştirin.

---

## 3. Düşük puan için özel mesaj alanı yok

**Durum:** Eşiğin altında kalan müşteriye yalnızca nötr bir teşekkür cümlesi gösteriliyor ("Değerlendirmeniz için teşekkür ederiz — formu gönderdiğinizde devam edebilirsiniz."). Ne yaşadığını işletmeye yazabileceği bir alan açılmıyor; sorunun ayrıntısı kayboluyor.

| Yer | Ne yapıyor |
|---|---|
| `includes/rewards/popup-render.php:198-221` | Panelde yalnızca `.qrm-rw-step-cta` ve `.qrm-rw-step-neutral` var |
| `includes/frontend/form-steps.php:884-886` | Düşük puanda yalnızca nötr metin gösteriliyor |

**Önerilen minimal düzeltme:**
- Adım paneline isteğe bağlı bir `textarea` ekleyin (ör. `name="qrm_private_note"`, "Bize özel yazın: ne daha iyi olabilirdi?"). `form-steps.php:886` civarında ortalama düşükse görünür yapın, yüksekse gizli kalsın. Google bağlantısı (madde 1'den sonra) her durumda görünür kalmalı; alan bir alternatif değil, ek seçenektir.
- Değeri mevcut gönderim kaydına yazın (yeni tablo gerekmez; özel form gönderim verisine ekstra alan olarak) ve `qrm_cf_notify_admin` (`includes/forms/functions.php:1104`) e-postasında gösterin.
- Panelde bu notu yorum kartında gösterin.

---

## Pazarlama tarafında yapılanlar (bu dal)
- `moduller/apple-data.js`: "Google yorum yönlendirmesi / İsteğe bağlı indirim kodu" çipleri ve `panel-google.webp` ekranı kaldırıldı; `moduller/yorum-geri-bildirim/index.html` yeniden üretildi. Görsel dosyası silinmedi.
- Reels v2 (`tools/reels/yorum-feedback/`): Google, ödül, eşik ve indirim anlatımı yok.

## Açık kalan küçük riskler
- `panel-yorumlar.webp` ve `adim-2.webp` üst satırında "…Google ödül sisteminiz ve kendi formlarınız burada." yazıyor (panelin kendi açıklama metni). Görseller hâlâ sayfada kullanılıyor.
- `moduller/module-data.js:1591-1592` "Google yorum bağlantısı" ve "İndirim kodu" özelliklerini tarafsız dille anlatıyor; ürün düzeltilene kadar bu ikisinin politika uyarısıyla (`:1606`) birlikte kalması gerekiyor.
