# Güvenlik denetimi — Aşama 13

Tarih: 24 Ekim 2026, 02:58 TSİ.

Kapsam: `anasite` deposundaki bağımsız PHP lisans API’si (`backend/`) ve `lisans/` yönetim paneli. Denetim yalnız yerel çalışma kopyasında yapıldı. Canlı sunucuya, cPanel’e veya üretim veritabanına bağlanılmadı. Gerçek lisans, API anahtarı, parola ve üretim sırrı okunmadı ve değiştirilmedi. Saat dilimi bu denetimin konusu değildir; doğrulama anı kuralı değiştirilmedi. `qr-menu-suite` istemcisinin JSON sözleşmesi değiştirilmedi. `qr-menu-license-server` deposuna dokunulmadı (`c866e42`). Commit, push, PR, merge ve deploy yapılmadı.

Kod tabanı: `anasite` `main` `a22636c`. `backend/` ve `lisans/` bu dalda izlenmeyen dosyalardır. Rapor, bu çalışma kopyasındaki kaynak ve testlere dayanır.

## Yöntem

Kaynak, şema, örnek yapılandırma, panel ve mevcut testler okundu. Açık olduğu doğrulanan yerlere sınırlı düzeltme ve regresyon kontrolü eklendi. Ardından mevcut PHP test paketleri yeniden çalıştırıldı. Tarayıcıda yalnız statik panel sayfası açıldı; API ayağa kaldırılmadı. `transfer-audit-db.php` bu turda bir veritabanı motoruna bağlanmadı.

İstemcinin beklediği doğrulama gövdeleri aynı bırakıldı:

| Durum | HTTP | Gövde |
| --- | --- | --- |
| `active` | 200 | `modules` dolu |
| `inactive` | 200 | `modules` anahtarı yok |
| `expired` | 200 | `modules: []` |
| `domain_mismatch` | 200 | `modules: []` |
| `invalid` | 404 | `modules` yok |
| `rate_limited` | 429 | `Retry-After` |

`POST /v1/validate` ve `POST /wp-json/qmls/v1/validate` aynı işleyiciyi kullanır. Yönlendirme yoktur. Suite istemcisi `application/json` gönderir. `415 unsupported_media_type` yalnız JSON olmayan dolu gövdelerde döner; başarılı JSON gövdelerine eklenmez.

## Düzeltilen bulgular

### Orta — Çerez adı ile oturum çalma

Dosya: `backend/src/Admin/Auth.php`, `tokenFromCookie` satır 356–375, `cookieLabel` satır 377–384, `cookie` satır 386–400.

Etki: Güvenli çerez yazılırken ad `qrl_session` idi ve `Domain` özniteliği yoktu. Okuyucu başlıktaki ilk `qrl_session` çiftini alıyordu. Üst alan veya kardeş yoldan gelen aynı adlı bir çerez, tarayıcının önce gönderdiği çift olursa gerçek oturumun önüne geçebilirdi. Birden fazla yönetici varsa kurban, saldırganın oturumuna bağlanabilirdi.

Düzeltme: İstek HTTPS ise veya `require_https` açıksa çerez adı `__Host-` önekini alır. Okuyucu yalnız bu adı kabul eder. Düz `qrl_session` ve başında duran sahte çift yok sayılır. `Set-Cookie` hâlâ `Path=/`, `HttpOnly`, `SameSite=Lax` taşır; güvenli yolda `Secure` vardır ve `Domain` yazılmaz. `__Host-` kuralları `Domain` ve `Path=/` dışında bir yolu da reddeder.

Yerel HTTP (`require_https` false ve istek HTTPS değil) düz adı kullanır. Tarayıcı, `Secure` olmayan `__Host-` çerezini kabul etmez. Bu geliştirme yolu aşağıda kalan risk olarak durur.

Tekrar: `backend/tests/auth.php`. `require_https` açıkken düz çerez oturum açmaz. Düz çerez ile geçersiz `__Host-` çerezi birlikte gelirse istek yetkisiz kalır. Geçerli `__Host-` çerezi oturumu açar. Çıkış aynı adı `Max-Age=0` ile temizler.

### Orta — Doğrulama yanıtında önbellek yasağı yoktu

Dosya: `backend/src/License/Validator.php`, hız sınırı satır 75–82, `result` satır 473–477. `backend/public/index.php`, `emit` satır 106.

Etki: Paylaşılan bir önbellek POST gövdesini saklarsa bir müşterinin `active` ve modül listesi başka bir isteğe dönebilirdi. `429` yanıtı da `Cache-Control` taşımıyordu.

Düzeltme: Doğrulama sonuçları ve `429` başlığı `Cache-Control: no-store` içerir. `emit` aynı başlığı HTTP yanıtına da yazar. Durum gövdeleri ve `Retry-After` aynı kaldı.

Tekrar: `backend/tests/run.php`, “doğrulama önbelleğe kapanır” ve “Retry-After var”.

### Orta — JSON uçları içerik türünü doğrulamıyordu

Dosya: `backend/src/Http/Router.php`, `requireJson` satır 362–380. Çağrılar: doğrulama satır 77, giriş satır 163, lisans yazma satır 261. `backend/public/index.php` satır 65–67 her istekte `CONTENT_TYPE` geçirir.

Etki: Gövde JSON olarak ayrışıyorsa `text/plain` veya form gövdesi de kabul ediliyordu. `SameSite=Lax` çerezi çapraz site POST’unda göndermez. Üst düzey bir HTML formu ise giriş adresine POST atıp kurbanın tarayıcısına saldırgan hesabının çerezini yazabilirdi. Formlar `application/x-www-form-urlencoded` gönderir. Tüm yöneticiler aynı lisans verisini gördüğü için etki hesap karışıklığıdır.

Düzeltme: Dolu gövde varken ortam türü tam olarak `application/json` değilse yanıt `415`, gövde `{"status":"error","error":"unsupported_media_type"}`, başlıklar `Accept: application/json` ve `Cache-Control: no-store` olur. `application/json; charset=UTF-8` kabul edilir. Boş gövde (çıkış) ve `dispatch` çağrısında içerik türü `null` (eski birim testleri) kontrolden geçer. Üretim `index.php` başlığı her zaman geçirir; başlık yoksa boş dizgi reddedilir. Değişen yönetim istekleri CSRF başlığını da ister.

Tekrar: `run.php` JSON olmayan doğrulamayı ve parametreli JSON türünü kontrol eder. `auth.php` JSON olmayan girişin çerez yazmadığını ve parolayı gövdeye koymadığını kontrol eder. `licenses.php` JSON olmayan lisans yazmasının kayıt sayısını değiştirmediğini kontrol eder.

### Düşük — Sürüm ve denetim metninde kontrol karakteri

Dosya: `backend/src/License/Validator.php`, `recordVersion` satır 328, `audit` satır 400–401.

Etki: `client_version` ve doğrulama denetim ayrıntısı CR/LF saklayabiliyordu. Panel ayrıntıyı `textContent` ile basar; bu bir XSS değildi. Satır, günlük veya dışa aktarılan metinde ikinci bir kayıt gibi görünebilirdi.

Düzeltme: `\x00`–`\x1F` ve `\x7F` yazılmadan önce silinir. Denetim ayrıntısı 255 karakterde kesilir. `1.2.0` gibi normal sürümler aynı kalır. İstemci hâlâ bildiği bir anahtarı 32 karaktere kadar sürüm alanına koyabilir; alan reddedilmez.

Tekrar: `run.php`, “sürüm satır sonu denetimde kalmaz”.

### Düşük — API yanıtında çerçeve ve yönlendiren başlıkları yoktu

Dosya: `backend/public/index.php`, `emit` satır 99–112. Panel: `lisans/index.html` satır 8. Metin: `lisans/lisans.js` satır 73.

Etki: JSON API tıklama ile çerçevelenebilir ve yönlendiren başlığı sızdırabilirdi. Başlık adında veya değerinde CR/LF olsaydı `emit` ek başlık üretebilirdi.

Düzeltme: CLI dışı yanıtlar `Content-Type: application/json`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'` ve `Cache-Control: no-store` alır. CR/LF içeren ek başlık atlanır. CLI stderr `Set-Cookie` değerini `(gizli)` yazar. Panel meta CSP’si `default-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'`. `frame-ancestors` meta etiketinde tarayıcılar tarafından yok sayıldığı için yazılmadı. Panel `unsupported_media_type` kodunu sabit metne çevirir.

Tekrar: `auth.php` yerel HTTP giriş yanıtında `nosniff`, `DENY`, `no-referrer` ve `no-store` arar. Statik sayfa yüklemesi aşağıda “test edilmeyenler” bölümündedir.

## İncelenen ve açık sayılmayan yerler

Kimlik doğrulama (`Auth.php`):

- Giriş, o yöneticinin eski oturum satırlarını siler ve 32 baytlık yeni belirteç üretir (satır 290–303). Belirteç çerezde durur; veritabanında SHA-256 özeti vardır. Ekilen çerez bir sonraki girişte geçersiz kalır.
- CSRF sırrı 32 baytlık rastgele değerdir ve `hash_equals` ile karşılaştırılır (satır 197). POST, PUT, PATCH ve DELETE ister. GET oturum ve okuma CSRF istemez.
- Çerez `HttpOnly` ve `SameSite=Lax`. Süre mutlaktır; istek süreyi uzatmaz. Varsayılan 43200 saniye. Süresi dolan satır silinir. Çıkış satırı siler ve çerezi `Max-Age=0` ile temizler.
- Giriş hız sınırı parola kontrolünden önce, IP başına 5 istek / 60 saniyedir (satır 45–47, 70–73). Bilinmeyen kullanıcı için sahte `password_hash` çalışır. Hata gövdesi her iki durumda `invalid_credentials` olur.
- `RequestContext` `X-Forwarded-For` okumaz (satır 40–43). `X-Forwarded-Proto` yalnız `REMOTE_ADDR` değeri `trusted_proxies` içindeyse kabul edilir.

Yetki (`Router.php` satır 231–243):

- Lisans, özet, paket ve denetim uçları `authorize` olmadan veri döndürmez. Eksik CSRF oluşturmayı 403 ile keser ve satır yazmaz. Görüntüleme, yenileme ve kilit açma oturum ve CSRF ister. Yenileme ve kilit açma `confirm: true` ister (`LicenseAdmin.php` satır 1253–1260).

Anahtarlar ve SQL:

- Liste ve ayrıntı `api_key`, HMAC ve şifreli metni basmaz. `key_hint` son dört karakterdir (`present`, satır 1069–1085). Görüntüleme ve yenileme düz anahtarı yalnız yetkili çağırana döner. Denetim eylemleri `anahtar_goruntulendi` ve `anahtar_yenilendi` boş ayrıntı yazar (satır 368, 439).
- `index.php` yakalanan hatada yalnız istisna sınıfını günlüğe yazar (satır 70–71) ve `server_error` döner.
- `bin/create-admin.php` parolayı argv’den almaz. `config.example.php` parola, pepper ve `encryption_key` alanlarını boş bırakır. `.gitignore` `config.php`, `.env`, `storage/`, `backups/` ve dökümleri dışlar.
- Sıralama ve yön beyaz listededir. `LIKE` kaçış kullanır. Lisans kimliği sınırlı tamsayıdır. Kullanıcı metni SQL’e birleştirilmez. `Database.php` emüle edilmiş prepare kullanmaz ve bağlantı hatasının PDO metnini dışarı vermez.

Panel (`lisans.js`):

- `innerHTML`, `outerHTML`, `document.write` ve `eval` yoktur. Hücre, rozet ve hata `textContent` kullanır. `API_BASE` boştur. Anahtar `localStorage` veya `sessionStorage` yazılmaz. CSRF `X-CSRF-Token` başlığındadır.

Şema:

- `migrations/001_schema.sql` `CREATE TABLE IF NOT EXISTS` kullanır. `DROP`, `DELETE FROM` ve `TRUNCATE` yoktur.
- `migrations/002_license_tier.sql` `tier_slug` yoksa ekler. Kayıt silmez.
- Varsayılan yönetici parolası veya dolu üretim sırrı yoktur.

## Kalan riskler

Bu turda kod değiştirilmeden bırakıldı.

- `SameSite=Lax` duruyor. Başka siteden gelen üst düzey GET çerezi gönderir. GET lisans yazmaz.
- Hesap bazlı kilit yoktur. Limit `REMOTE_ADDR` kovasıdır. Boş adres `unknown` kovasında birleşir. Ters vekil istemci adresini `REMOTE_ADDR` yapmazsa herkes vekilin adresini paylaşır. `X-Forwarded-For` bilinçli olarak okunmaz.
- Oturum varsayılan 12 saattir. Boşta kalma zaman aşımı yoktur. Belirteç bir sonraki girişe kadar yenilenmez.
- `require_https` kapalı ve istek HTTP ise `__Host-` kullanılmaz. Bu geliştirme kipinde çerez adı çakışması mümkündür. Örnek yapılandırma `require_https` değerini `true` bırakır.
- `lisans/index.html` `index.php` tarafından servis edilmez. Meta CSP çerçevelemeyi durdurmaz. Çerçeveyi kapatmak web sunucusunun `X-Frame-Options` veya `frame-ancestors` göndermesine bağlıdır.
- Domain kilidi ve kilit açma denetimi domain metnini saklar. Bu, yönetim ekranı içindir. Liste her satırda şifreli anahtarı çözüp son dört karakteri gösterir.
- Web kökü `backend/public/` olmalıdır. Kök `backend/` olur ve PHP çalışmazsa `config.php` indirilebilir. `.gitignore` dosyayı depodan çıkarır; sunucu kökünü değiştirmez.
- Yedek ve geri dönüş `KEY_CUSTODY.md` içindeki elle uygulanan adımdır. Depoda otomatik yedek işi yoktur.
- `QR_REGEN_BARRIER` üretimde doluysa ve `/tmp/` altında var olan bir dosyayı gösterirse yenileme kısa süre bekleyebilir (`LicenseAdmin.php` satır 1389–1418). Ortam değişkeni yokken metot hemen döner.
- Tek yönetici rolü vardır. Oturum açmış her yönetici her anahtarı görüntüleyebilir ve yenileyebilir.
- `415` gövdesindeki `status: error` yeni bir hata kodudur. Suite bilinmeyen durumları `unreachable` sayar. Suite `application/json` gönderdiği için başarılı doğrulama sözleşmesi aynıdır.
- `dispatch` içerik türü olmadan çağrılırsa veya gövde boşsa tür kontrolü yapılmaz. Üretim girişi türü geçirir.

## Testler

24 Ekim 2026, 02:58 TSİ civarında, `anasite` kökünden:

| Komut | Sonuç |
| --- | --- |
| `php backend/tests/run.php` | 64 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/auth.php` | 50 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/licenses.php` | 54 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/transfer-audit.php` | 57 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/transfer-audit-db.php` | `hata_sinifi: ortam_yok`, çıkış 2 |

Son satır bir geçiş değildir. `QR_AUDIT_IT_ADMIN` verilmediği için entegrasyon testi motor açmadı. Bu turdaki değişiklikler `TransferAudit` dosyalarına dokunmaz. Aşama 11’deki MariaDB ve MySQL 8 koşusu bu turda tekrarlanmadı.

Statik panel: `php -S 127.0.0.1:8766` site kökünden HTML, CSS, JS ve SVG için HTTP 200 verdi. Headless Chrome sayfayı yazdı. Açılış bölümü gizliydi, giriş bölümü görünürdü, `modul-restoran-menu` kutusu betik tarafından oluşmuştu. Giriş şeridi “Sunucu JSON yanıtı vermedi. HTTP 200.” idi; bu adreste API yoktu. Chrome zaman aşımı ile kapandı (çıkış 124). Kısa stderr kuyruğunda CSP reddi satırı görülmedi. DBus hataları ortam gürültüsüdür. Sunucu ve Chrome kapatıldı.

## Test edilmeyenler

- Tarayıcının `__Host-` çerezini gerçekten yazması ve reddetmesi. Testler `Cookie` başlığını simüle eder.
- Panelin çalışan API ile girişi, anahtar görüntüleme, arşiv ve çıkışı.
- `transfer-audit-db.php` için MariaDB veya MySQL 8.
- Canlı çerez, canlı sır, canlı veritabanı ve üretim saat dilimi.
- Statik HTML dosyasının başka bir sitede çerçevelenmesi.

## Bu turda değişen dosyalar

- `backend/src/Admin/Auth.php`
- `backend/src/Http/Router.php`
- `backend/src/License/Validator.php`
- `backend/public/index.php`
- `backend/tests/auth.php`
- `backend/tests/licenses.php`
- `backend/tests/run.php`
- `backend/SECURITY_AUDIT.md`
- `lisans/index.html`
- `lisans/lisans.js`

`backend/` ve `lisans/` tamamı `main` üzerinde izlenmeyen durumdadır. Bu dosya listesi Aşama 13 farkıdır. Daha önceki aşamaların izlenmeyen dosyaları silinmedi.
