# Yerel entegrasyon ve güvenlik doğrulaması — Aşama 14

Tarih: 24 Ekim 2026, 03:31 TSİ.

Kapsam: Aşama 13 düzeltmelerinin çalışan yerel API ve Chrome üzerinde doğrulanması, ardından geçici MariaDB ve MySQL 8 üzerinde `backend/tests/transfer-audit-db.php`. Canlı sunucuya, cPanel’e ve üretim veritabanına bağlanılmadı. Gerçek lisans ve üretim sırrı kullanılmadı. Üretim saat dilimi bu aşamada incelenmedi. Commit, push, PR, merge ve deploy yapılmadı.

Kod tabanı: `anasite` `main` `a22636c`. `backend/` ve `lisans/` izlenmeyen dosyalar olarak duruyor; mevcut içerik silinmedi ve üzerine yazılmadı. Bu aşama uygulama kodunu değiştirmedi. Eklenen dosya bu rapordur.

## Ortam

| Parça | Sürüm / durum |
| --- | --- |
| PHP | 8.3.6 (NTS), 19 Ekim 2026 18:16 TSİ derlemesi |
| MariaDB | 10.11.14-MariaDB-0ubuntu0.24.04.1, yerel soket. Docker yoktu. |
| MySQL | 8.0.46-0ubuntu0.24.04.4, yalnız `127.0.0.1:3307` ve `/tmp/mysql8`. İş bitince kapatıldı. |
| Chrome | 156.0.8078.47, headless, `--no-sandbox` |
| API verisi | Geçici SQLite, sentetik yönetici ve sentetik pepper. Dosyalar iş bitince silindi. |
| TLS | `127.0.0.1` için bir günlük self-signed sertifika. Chrome sertifika hatasını geçecek biçimde açıldı. |

API, PHP yerleşik sunucusunda `127.0.0.1:8765` üzerinde çalıştı. Önünde `127.0.0.1:8443` TLS sonlandırıcısı vardı. PHP’ye giden istek `X-Forwarded-Proto: https` taşıdı. Deneme yapılandırmasında `require_https` açıktı ve `trusted_proxies` yalnız `127.0.0.1` idi. Panel `https://127.0.0.1:8443/lisans/` adresinden, API aynı kaynaktaki `/api` yolundan açıldı. Doğrudan `8765` kapısına yapılan HTTP giriş `403 https_required` döndü ve çerez yazmadı.

## Başarılı testler

Son çalıştırmalar. Ara denemelerdeki yanlış beklentiler ürün hatası değildi; aşağıda ayrıca yazılıdır.

### HTTPS API, birinci tur — 20 kontrol, 0 hata

- Giriş çerezi adı `__Host-qrl_session`. Öznitelikler: `Path=/`, `Max-Age=3600`, `HttpOnly`, `SameSite=Lax`, `Secure`. `Domain` yok.
- Yalnız bu çerez oturum açtı. Düz `qrl_session`, aynı belirteci taşısa da açmadı. İkisi birlikte gelince düz çerez host çerezinin önüne geçmedi.
- Çıkış aynı ada `Max-Age=0` yazdı. Eski belirteç sonraki oturum isteğinde geçersiz kaldı.
- `application/x-www-form-urlencoded` giriş `415 unsupported_media_type` verdi ve `Set-Cookie` yazmadı.
- `text/plain` doğrulama ve lisans yazımı `415`. `application/json; charset=UTF-8` doğrulaması `415` olmadı; eksik alan `400 missing_field` oldu.
- Oturumsuz lisans listesi `401`. CSRF’siz oluşturma ve çıkış `403 invalid_csrf`. Eksik firma ve geçersiz modül `422 invalid_field`. 32 KB üstü gövde `400 invalid_json`. Doğrulama `GET` isteği `405`.
- Bu yanıtların API başlıklarında `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'` ve `Cache-Control: no-store` vardı.
- Panel HTML’i (`/lisans/`) bu başlıkları taşımıyor. Dosyada `default-src 'self'` meta CSP’si var. Bu, Aşama 13’te bırakılan statik dosya sınırıdır.

### HTTPS API, ikinci tur — 23 kontrol, 0 hata

Sentetik kayıtlarla, oturum ve CSRF ile:

- Oluşturma, düzenleme, maskeli ayrıntı, anahtar görüntüleme, yenileme, domain kilidi açma ve arşivleme başarılı oldu.
- Aynı işlemlerin CSRF’siz, onaysız veya geçersiz halleri `403` veya `422` verdi ve istenmeyen yazmayı yapmadı.
- Sözleşme: `active` 200 ve modül listesi (Başlangıç paketinde 3 modül); `domain_mismatch` 200 ve `modules: []`; `inactive` 200 ve `modules` anahtarı yok; `expired` 200 ve `modules: []`; bilinmeyen ve arşivli anahtar `404 invalid` ve `modules` yok. `/v1/validate` ile `/wp-json/qmls/v1/validate` aynı aktif sonucu verdi. Gövdelerde anahtar yoktu. `Cache-Control: no-store` duruyordu.
- Hız sınırı: temiz pencerede sözleşme isteklerinden sonra döngünün 12. çağrısı `429` oldu. Bu, penceredeki 21. doğrulamadır; ilk 20 geçer. Gövde `rate_limited`, `Retry-After` pozitif tam sayı, `Cache-Control: no-store` ve güvenlik başlıkları vardı.

### Chrome — 25 kontrol, 0 hata

Gerçek Chrome, yerel HTTPS. Çerez doğrulaması başarılı sayıldı.

- HTTP 200 ve HTML gövde: “Sunucu JSON yanıtı vermedi. HTTP 200.” Panel açılmadı.
- HTTP 200 ve beklenmeyen JSON: “İstek tamamlanamadı. HTTP 200.” Panel açılmadı.
- Giriş, çıkış ve “Çıkış yapıldı.” metni çalıştı.
- Chrome `__Host-qrl_session` çerezini sakladı: `httpOnly`, `secure`, `sameSite=Lax`, `path=/`, üst alan noktası yok. `document.cookie` bu adı içermiyordu. Çıkıştan sonra çerez kalktı. Eski belirteç geri konunca panel açılmadı.
- Panel akışı: boş firma reddi, oluşturma, maskeli anahtar, gizleme, yeniden gösterme, düzenleme, doğrulama ile domain kilidi, kilit kaldırma, anahtar yenileme, arşiv ve arşivin listeden çıkması.
- Doğrulama sözleşmesi sayfanın kendi `fetch` çağrısıyla da görüldü: `active`, eski yolun aynı sonucu, `domain_mismatch`, `no-store`. Yenilenen anahtar yeniden `active` oldu.
- Yazma isteklerinin hepsi `X-CSRF-Token` taşıdı. Değer kayda geçmedi.
- CSP ihlali yok. Sayfa istisnası yok. Ağ kopması yok. `body` ve `main`, 390 ve 1280 piksel genişlikte taşmadı.
- Konsolda uygulama hatası yok. Kalanlar aşağıda gözlem olarak duruyor.

### Veritabanı — her motorda 28 kontrol, 0 hata, çıkış 0

`QR_AUDIT_IT_ADMIN` yalnız geçici yönetici JSON’uydu. MariaDB bağlantısı işletim sistemi kökünün yerel soketi, MySQL 8 bağlantısı `127.0.0.1:3307` üzerindeki boş parolalı yerel kök idi. İkisi de bu makinenin test süreçleridir. Üretim hesabı aranmadı ve yüklenmedi.

Test kendi `qrl_it_src_*` ve `qrl_it_dst_*` veritabanlarını ve kendi kullanıcılarını açtı, sentetik yazılarla denetimi iki kez çalıştırdı ve kapattı. Sonrasında MariaDB veritabanları yine `information_schema`, `mysql`, `performance_schema`, `qrl_stage5`, `qrl_stage5_fresh`, `sys` idi. MySQL 8 veritabanları yine `information_schema`, `mysql`, `performance_schema`, `qrl_mysql8`, `qrl_mysql8_stage6`, `qrl_mysql8_verify`, `sys` idi. Ek kullanıcı kalmadı. Çıktıda parola ve pepper görünmedi. MariaDB yetki satırındaki parola özeti `[gizli]` idi.

Docker kurulu değildi. Testler mevcut yerel motorlarda çalıştı.

## Başarısız testler

Kabul edilen son çalıştırmalarda başarısız kontrol yok.

İlk Chrome turunda dört kontrol düştü. Üçü, maskenin son dört karakterden ibaret sanılmasından ve ayrıntı yüklenmeden düğmeye basılmasından kaynaklanan sınama hatalarıydı. Biri, panel `/` adresinden verildiği için logo yolunun kırılmasıydı. Panel `/lisans/` altına alınınca logo `200` döndü. Tekrar `25` kontrol, `0` hata.

İlk API sözleşme turunda üç kontrol, maskenin `••••` ve son dört karakter olmasını dört karakterlik eşleşme sanınca düştü. Görüntüleme, eski anahtarın `invalid` olması ve yeni anahtarın `active` olması o turda da geçti. Beklenti düzeltildikten ve hız kovası temizlendikten sonra tekrar `23` kontrol, `0` hata.

## Çalıştırılamayan testler

- Docker ile ayrı bir veritabanı kabı. Docker bu makinede yok.
- Kamuya güvenilen bir sertifika. Çerez denemesi self-signed yerel HTTPS ile yapıldı; bu yüzden çerez sonucu başarısız sayılmadı. Chrome sertifika uyarısını konsola yazdı.
- Canlı sunucu, cPanel, üretim veritabanı, gerçek lisans ve üretim sırrı.
- Üretim saat dilimi. `transfer-audit-db.php` dosyası olduğu gibi çalıştığı için içindeki eski sentetik saat kontrolleri de geçti. Bunlar üretim saati yerine geçmez ve burada yorumlanmadı.
- Aşama 14 sırasında `run.php`, `auth.php`, `licenses.php` ve `transfer-audit.php` yeniden çalıştırılmadı. Aşama 14.1 bu dört paketi çalıştırdı; sonuçlar aşağıdaki bölümdedir.

## Tarayıcı

Tarayıcı testi yapıldı. Bu, güvenilen bir sertifika testi değildir. Sertifika `127.0.0.1` için yerel ve self-signed idi. Chrome, sertifika hatasını geçecek biçimde açıldı; konsol self-signed uyarısını yazdı. Üretim sertifikası ve canlı sunucu kullanılmadı.

Chrome 156, bu self-signed yerel HTTPS üzerinde, panel adresi `/lisans/`. `__Host-qrl_session` Chrome’un çerez kavanozunda görüldü ve çıkışta silindi.

Gözlemler, ürün akışını bozmadı:

- Konsol, self-signed sertifika için uyarı yazdı.
- Chrome `/favicon.ico` istedi. Panelde favicon bağlantısı yok. Yanıt `404`. Başka `4xx` yok.
- Statik HTML yanıtında `X-Frame-Options` ve CSP başlığı yok. Koruma meta CSP ile sınırlı. Çerçeveleme bu yanıtta kapanmıyor.

## Kalan riskler

Aşama 13’teki riskler duruyor. Bu tur onları üretimde kapatmadı.

- `SameSite=Lax` aynı. Boşta oturum kapanmıyor. Süre bu denemede 3600 saniye, örnek yapılandırmada 43200 saniye.
- `__Host-` yalnız HTTPS veya `require_https` açıkken yazılır. Düz HTTP denemesinde giriş zaten `https_required` ile kesildi.
- Güvenilen vekil listesi boşsa `X-Forwarded-Proto` yok sayılır. Bu denemede listeye yalnız yerel vekil yazıldı. Yanlış bir vekil adresi üretimde HTTPS kararını bozar.
- Panel dosyası API önünden geçmediği için tıklama ile çerçevelenmeye karşı sunucu başlığına ihtiyaç duyar. Aşama 14.1 gereken Apache ve nginx satırlarını yazdı. Bu ortamda uygulanmadı ve canlıda doğrulanmadı.
- Favicon `404` üretir. Güvenlik açığı değildir.
- Hız sınırı `REMOTE_ADDR` kovasıdır. Bu denemede tarayıcı ve API aynı `127.0.0.1` adresini paylaştı.
- Yedek hâlâ elle. Web kökü `backend/public/` olmalıdır.
- Tek yönetici rolü her anahtarı görebilir.

## Temizlik

Testin açtığı MariaDB ve MySQL veritabanları ile kullanıcıları testin kendi temizliği sildi. Önceden duran `qrl_stage5`, `qrl_stage5_fresh`, `qrl_mysql8`, `qrl_mysql8_stage6` ve `qrl_mysql8_verify` duruyor. MySQL 8 süreci kapatıldı. PHP ve TLS süreçleri kapatıldı. Sistem MariaDB’ye dokunulmadı. Sentetik SQLite, yapılandırma, sertifika ve yönetici dosyaları silindi. Çıktı dosyalarında parola, oturum belirteci veya lisans anahtarı arandı; eşleşme yoktu.

## Aşama 14.1 — 24 Ekim 2026, 15:18 TSİ

Uygulama kodu, panel ve `SECURITY_AUDIT.md` değiştirilmedi. Canlı sunucuya ve üretim veritabanına bağlanılmadı.

### Birim testleri

| Komut | Sonuç |
| --- | --- |
| `php backend/tests/run.php` | 64 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/auth.php` | 50 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/licenses.php` | 54 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/transfer-audit.php` | 57 kontrol, 0 hata, çıkış 0 |

### Panel çerçeve koruması

`lisans/index.html` satır 8 meta CSP’si şudur: `default-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'`. `frame-ancestors` bu etikette yoktur. CSP’de `frame-ancestors` meta öğesiyle uygulanmaz; tarayıcı meta içindeki bu direktifi yok sayar. Meta politika aynı kaynak, form ve nesne kısıtını taşır. Çerçevelemeyi kapatmaz.

Panel `backend/public/index.php` içinden geçmez. `emit` satır 103–105 `X-Frame-Options: DENY` ve `frame-ancestors 'none'` başlıklarını yalnız API’nin JSON yanıtına yazar. Depoda `.htaccess`, nginx veya Apache yapılandırması yoktur. Bu başlıkları statik HTML’e yazan bir dosya da yoktur.

Yerel kontrol, 24 Ekim 2026 15:18 TSİ civarında, `php -S 127.0.0.1:8771` ile site kökünden yapıldı. Bu HTTP’dir; self-signed HTTPS denemesi değildir. `GET /lisans/` ve `GET /lisans/index.html` ikisi de `200` ve `Content-Type: text/html; charset=UTF-8` döndü. Yanıtta `Content-Security-Policy` ve `X-Frame-Options` başlığı yoktu. Gövde meta CSP’yi içeriyor, `frame-ancestors` içermiyordu. Sunucu hemen kapatıldı. Çerçeveleme bir tarayıcıda yeniden denenmedi; başlığın yokluğu ölçülmüştür, tıklama ile çerçeve saldırısı bu turda çalıştırılmamıştır.

Canlı sunucu yapılandırmasına erişim yoktur. Çözüm, `/lisans/` HTML yanıtına web sunucusunun şu başlıkları eklemesidir. Meta etiketine `frame-ancestors` yazmak bu açığı kapatmaz.

Apache veya cPanel, `lisans` dizini için:

```apache
<IfModule mod_headers.c>
  Header always set Content-Security-Policy "frame-ancestors 'none'"
  Header always set X-Frame-Options "DENY"
</IfModule>
```

nginx. Bu `location` içindeki `add_header` satırları, üst bloktan gelen `add_header` satırlarının yerini alır. Başka başlıklar varsa onlar da bu bloğa yazılmalıdır.

```nginx
location ^~ /lisans/ {
  add_header Content-Security-Policy "frame-ancestors 'none'" always;
  add_header X-Frame-Options "DENY" always;
}
```

`frame-ancestors 'none'` modern tarayıcıda çerçevelemeyi kapatır. `X-Frame-Options: DENY` eski tarayıcılar içindir. Başlık yalnız HTML belgesine yetse de bu dizin kapsamı paneli kaçırmaz. API’nin JSON CSP’si ayrıdır ve panel sayfasının yerine geçmez. Bu yapılandırma bu ortamda uygulanmadı ve canlıda doğrulanmadı.

### Sertifika

Aşama 14’teki Chrome oturumu güvenilen sertifika testi değildir. Kullanılan sertifika yerel self-signed sertifikadır. Üretim sertifikası yoktur.

## Değişen dosyalar

- Aşama 14: `backend/INTEGRATION_AUDIT.md` eklendi.
- Aşama 14.1: aynı dosya güncellendi. Başka dosya değişmedi.
