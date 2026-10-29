# Canlıya geçiş kontrol listesi

Tarih: 24 Ekim 2026, 19:59 TSİ (aşama 18). Aşama 19 eklemesi: 24 Ekim 2026, 21:09 TSİ. Aşama 20 eklemesi: 24 Ekim 2026, 22:13 TSİ. Aşama 21 eklemesi: 24 Ekim 2026, 23:43 TSİ. Aşama 22 eklemesi: 25 Ekim 2026, 01:02 TSİ. Aşama 23 eklemesi: 25 Ekim 2026, 01:16 TSİ. Aşama 24 eklemesi: 25 Ekim 2026, 01:27 TSİ.

Aktarım yapılmadı. Canlı geçişe onay verilmedi. Bu dosya yedek, geri dönüş ve son kontrol planıdır. Canlı sunucuya, cPanel’e ve üretim veritabanına bağlanılmadı. Gerçek lisans anahtarı ve üretim sırrı okunmadı. DNS, API adresi, migration ve deploy değiştirilmedi. Aşama 19 yalnız yerel paket ön kontrolüdür.

Durum sözcükleri:

- `hazır`: bu çalışma kopyasında kanıtı vardır. Canlı onay değildir.
- `bekliyor`: iş tanımlıdır ve canlı adım durmaktadır.
- `doğrulanmadı`: kanıt yoktur. Kanıtsız madde `hazır` sayılmaz.

## Yedekleme kapsamı

Dört yedek birbirine karışmaz. Biri diğerinin yerine geçmez.

| Kapsam | İçinde ne durur | Dışında ne kalır | Durum |
| --- | --- | --- | --- |
| WordPress dosyaları | Lisans eklentisinin kurulu olduğu WordPress kökü ve `qr-menu-license-server` eklenti dosyaları | `wp-config.php` bu pakete düz konmaz. O dosya sır yedeğidir | `doğrulanmadı` |
| Lisans tabloları ve meta | `qmls_license` yazıları, onların `postmeta` satırları ve `qmls_tiers` option’ı. Önek canlıda `wp_` olmak zorunda değildir | Başka post türleri ve kullanıcı tabloları bu paketin konusu değildir | `doğrulanmadı` |
| Yeni sistem veritabanı | `licenses`, `license_modules`, `tiers`, `tier_modules`, `audit_events`, `admins`, `admin_sessions`, `rate_buckets` | Yazımdan önceki boş şema ile yazımdan sonraki dolu şema ayrı arşivlerdir | `doğrulanmadı` |
| Yapılandırma sırları | `config.php` veya `QR_LICENSE_CONFIG` dosyası. İçinde `key_pepper`, `encryption_key` ve veritabanı parolası birlikte durur | Denetim sayaç raporu, Git ve web kökü | `doğrulanmadı` |

Meta yedeği şu anahtarları da alır: `api_key`, `domain`, `durum`, `allowed_modules`, `expires_at`, `start_date`, `amount_paid`, `notlar`, `client_version`, `last_seen`, `_qmls_audit_log`. Son üçü aktarım alanına girmez. Geri dönüşte WordPress’in kendi haline dönmesi için yedekte dururlar.

### Pepper ve şifreleme anahtarı

`key_pepper` ile `encryption_key` farklı iş yapar ve ikisi de yedekte durur.

- `key_pepper` en az 32 karakterdir. HMAC-SHA256 arama özetini üretir. Değişirse doğrulama `invalid` olur.
- `encryption_key` tam 64 onaltık karakterdir. AES-256-GCM kopyayı açar. Değişirse HMAC aynı kaldığı sürece doğrulama sürebilir. Görüntüleme `key_unavailable` olur.
- İkisi ayrı ayrı yenilenmez. Yedek, çalışan dosyayla bayt bayt aynıdır.
- Denetim aracı pepper dosyasını okur ve `encryption_key` yüklemez. `zaten_mevcut` şifreli kopyanın açıldığını göstermez.
- Bu depoda üretim pepper’ı ve şifreleme anahtarı yoktur. `backend/config.example.php` bu alanları boş bırakır.

### Erişim, şifreleme, bütünlük ve geri yükleme denemesi

1. Arşiv sahibi uygulama kullanıcısıdır. Dosya izni `600`, dizin izni `700` olur.
2. İkinci kopya web kökünün ve Git deposunun dışındadır. `backend/backups/` Git’e girmez ve tek kopya olarak kullanılmaz.
3. Arşiv durduğu yerde şifrelenir. Parola kasası veya şifreli çevrimdışı disk uygundur. Şifre, arşivin yanındaki düz dosyaya yazılmaz.
4. Her arşivin SHA-256 özeti ayrı bir `600` dosyaya yazılır. Geri yüklemeden önce özet yeniden hesaplanır ve karşılaştırılır. Özet komutu dosya gövdesini ekrana basmaz.
5. Geri yükleme denemesi boş SQLite veya geçici bir MySQL üzerinde yapılır. Adımlar `KEY_CUSTODY.md` içindeki kurtarma provasıdır: pepper değişince `invalid`, yalnız şifreleme anahtarı değişince doğrulama sürer ve görüntüleme `key_unavailable` olur, yedek geri gelince ikisi de düzelir. Bu prova bu aşamada yeniden çalıştırılmadı. Durum: `bekliyor`.

### Yedek ve günlük kuralları

Lisans meta yedeği düz `api_key` değerlerini içerir. Bu dosya sırdır.

- Yedek komutunun çıktısı CI günlüğüne, sohbet kaydına, bilete veya e-postaya bağlanmaz.
- `mysqldump` ve WordPress dışa aktarma `--debug` veya ayrıntılı sorgu günlüğü ile çalıştırılmaz.
- Anahtar, pepper, parola ve DSN komut argümanı olmaz. Kabuk geçmişine düşmez.
- `backend/bin/license-audit.php` sayaç basar. Düz anahtar, parola ve pepper basmaz. `import`, `apply`, `write` ve `migrate` komutları yoktur.
- İsteğe bağlı denetim raporu depo dışında ve `0600` olur. Depo içi rapor reddedilir.
- Hata satırı sınıf adıdır. İstisna metni yapılandırma değeri taşıyorsa günlüklemeden önce ayıklanır.
- Özet ve dosya adı günlüğe yazılabilir. Dosya gövdesi yazılmaz.
- Geri yükleme denemesindeki sentetik anahtar prova bitince silinir. Müşteri anahtarı prova için kullanılmaz.

## Geri dönüş

Geri dönüş, yeni PHP uygulamasının `POST /wp-json/qmls/v1/validate` yanıtını kesmesi ve aynı yolun yine WordPress eklentisine düşmesidir. Yeni veritabanı silinmez. WordPress, geçişten hemen önceki yedekten açılır. Müşteri eklentisine yeni sürüm gönderilmez.

### Eski API’ye dönüş koşulları

Aşağıdaki ölçülerden biri tutarsa trafik WordPress yoluna alınır ve yeni uygulamaya doğrulama isteği bırakılmaz:

- Beş dakika içinde doğrulama isteklerinin yüzde 1’inden fazlası HTTP 5xx veya bağlantı hatası verir. Payda, gövdesi loglanmayan istek sayısıdır.
- Önceden kaydedilmiş sentetik kanarya lisans, geçişten önceki durumundan farklı bir `status` alır. Müşteri anahtarı kanarya olmaz.
- Kanarya görüntüleme `key_unavailable` döner veya kanarya doğrulama `invalid` döner.
- `domain_mismatch` sayısı, geçişten önceki aynı uzunluktaki aralığın iki katını aşar. Taban sayım geçişten önce yazılmış olmalıdır. Taban yoksa bu ölçü kullanılmaz.
- İki uç da aynı anda doğrulama yazıyordur. Bunu her iki erişim günlüğindeki bu yolun sayımı gösterir.
- Yedek SHA-256 özeti tutmaz.
- Saat dilimi onayı hâlâ `verilmedi` ise geçiş başlamaz. Başlamış bir geçiş bu yüzden geri alınmaz. O eksik, geçiş öncesi durdurmadır.

### DNS ve uç nokta

`qr-menu-suite` kaynak kodu bu çalışma alanının içinde değildir. Bu aşamada o depo yeniden okunmadı.

Elinde duran kanıt şudur. Eski eklentinin kendi örneği isteği `https://qrmenuofficial.com/wp-json/qmls/v1/validate` adresine gönderir (`qr-menu-license-server/README.md`). Yeni `Router` aynı yolu ve `/v1/validate` yolunu tek işleyiciye bağlar. HTTP yönlendirmesi yoktur (`backend/src/Http/Router.php`). Suite istemcisinin `application/json` gönderdiği `SECURITY_AUDIT.md` içinde kayıtlıdır.

Bu yüzden aynı konakçı bu yolu yeni uygulamaya verdiğinde istemci adresinin değişmesi gerekmez. DNS kaydı da gerekmez. Geri dönüş, o yolun yeniden WordPress’e verilmesidir. Yeni bir alan adı açmak veya istemci içindeki adresi değiştirmek bu planın parçası değildir. Öyle bir değişiklik yapılırsa geri dönüş hem DNS’i hem istemci adresini de geri ister. Bu aşamada ikisi de yapılmadı.

### İki sistemin aynı anda yazması

Eski doğrulama `last_seen`, `client_version` ve boş domain kilidini yazar. Yeni doğrulama `last_seen_at`, `client_version` ve boş domain kilidini yazar. İkisi de ilk boş domaine kilit koyar. Eşzamanlı trafik şu ayrılığı üretir:

- Bir tarafta kilitlenen domain diğer tarafta boş kalabilir veya başka bir domain ile kilitlenebilir.
- Bir tarafta pasif edilen lisans diğer tarafta aktif kalır.
- Modül listesi yalnız düzenlenen tarafta değişir.
- `last_seen` aktarılmaz. İki taraftaki son görülme birbirini tamamlamaz.
- Eski taraf düz anahtar saklar. Yeni taraf HMAC ve şifreli kopya saklar. Yazılar birbirine kopyalanmaz.

Bu depoda iki tarafı birleştiren bir araç yoktur. Geçişte doğrulama trafiği tek tarafta olur. WordPress yolu kapanmadan yeni uygulama yazmaya başlamaz.

### Geri dönüşün lisans haline etkisi

WordPress yedeği geçiş anındaki meta ile açılırsa:

- Durum, WordPress `durum` değerine döner. Geçiş penceresinde yeni panelde yapılan aktif veya pasif değişiklik kaybolur.
- Domain kilidi, yedekteki `domain` meta değerine döner. Yalnız yeni sistemde alınan kilit düşer. İlk sonraki WordPress doğrulaması boş kilide yeniden kilit yazabilir. Yedekteki kilit ile müşterinin o sırada gönderdiği domain farklıysa yanıt `domain_mismatch` olur.
- Modül listesi `allowed_modules` yedeğine döner. Yeni `license_modules` satırları WordPress’e yazılmaz. Paket şablonu lisans satırında değildir. `tier_slug` geri dönüşte WordPress’e taşınmaz.
- `last_seen` yedekteki unix değerine döner. Yeni `last_seen_at` WordPress’e yazılmaz.
- Yeni sistemdeki `archived_at` WordPress `trash` kaydı üretmez.
- `manuel_inceleme` yüzünden yeni sisteme hiç yazılmamış kayıt, WordPress’te zaten kendi halinde duruyordur. Geri dönüş onu ayrıca onarmaz.

## Geçiş ön koşulları

| Madde | Durum | Kanıt ve eksik |
| --- | --- | --- |
| Üretim PHP `date.timezone`, WordPress `timezone_string` ve `gmt_offset` okunur | `doğrulanmadı` | Eski bitiş `strtotime` ile PHP saat dilimindedir. Yeni bitiş o günün `23:59:59 UTC` anıdır ve bu saniye dahildir. `saat_dilimi_onayi` her çıktıda `verilmedi` basar. Değerler bu depoda yoktur |
| Canlı hedefte `uq_licenses_api_key_hmac` benzersiz indeksi ve güncel HMAC tekrarı | `doğrulanmadı` | Şema tanımında indeks vardır. Canlı `SHOW INDEX` ve `GROUP BY api_key_hmac HAVING COUNT(*) > 1` çalıştırılmadı. İndeksin bugün durması, silinmiş eski yinelemeyi göstermez |
| Gerçek kaynak kayıtlarının salt okunur denetimi | `bekliyor` | `license-audit.php` yalnız `synthetic` ve `audit` kabul eder. Yazma komutu yoktur. `audit` bu aşamada hiçbir veritabanına bağlanmadı. Sayaçlar canlı kayıt sayısı değildir |
| Şifreli anahtarın açılması ve pepper uyumu | `doğrulanmadı` | Sentetik turda doğru anahtar açar, yanlış anahtar açmaz, HMAC pepper’a bağlıdır. Canlı satır açılmadı. Denetim pepper’ı, sunucunun kullanacağı `key_pepper` ile aynı olmak zorundadır. `zaten_mevcut` açıldığını göstermez |
| Gerçek HTTPS sertifikası | `doğrulanmadı` | Aşama 14 tarayıcı denemesi yerel self-signed sertifikadır. Güvenilen üretim sertifikası bu ortamda yoktur |
| `/lisans/` çerçeve başlıkları | `doğrulanmadı` | Meta CSP `frame-ancestors` uygulamaz. API JSON başlığı paneli kapsamaz. Apache ve nginx satırları `INTEGRATION_AUDIT.md` içindedir. Aşama 20, 22:13 TSİ: açılan paketin panel dosyalarında bu başlıklar yoktur. Yerel `php -S` ile `/lisans/` ve `/lisans/index.html` HTTP 200 döndü; yanıt başlığında `X-Frame-Options` ve `Content-Security-Policy` yoktu. Canlıda uygulanmadı ve ölçülmedi |
| Yönetici erişimi | `bekliyor` | Yerel oturum, `__Host-` çerez, CSRF ve parola özeti testleri geçer. Canlı yönetici oluşturulmadı. `create-admin.php` parolayı argüman almaz. Örnek yapılandırmada parola yoktur |
| Sırların dağıtımı | `bekliyor` | Plan yukarıdadır. Üretim `config.php` bu depoda yoktur ve bu aşamada yazılmadı |
| Veritabanı izinleri | `bekliyor` | Denetim kullanıcısı yalnız `SELECT` olmalıdır. Yazma yetkisi aracı durdurur. Canlı `SHOW GRANTS` okunmadı. Sentetik MariaDB provası 24 Ekim 2026 17:18 TSİ’de geçici şemada 28 kontrol, 0 hata verdi. Aşama 19, 21:08 TSİ: geçici MariaDB 10.11.14 ve MySQL 8.0.46 üzerinde `transfer-audit-db.php` yeniden 28 kontrol, 0 hata verdi. Aynı geçici uygulama kullanıcısında `SELECT, INSERT, UPDATE, DELETE` sonucu `yerel_yetki: yeterli`; yalnız `SELECT` sonucu `hata_sinifi: yetki`, çıkış 2. Geçici şema ve `qrl_s19` kullanıcıları silindi. Bu satırlar canlı izin değildir |
| İstemci uyumluluğu | `hazır` | Yerel sözleşme: `active`, `inactive`, `expired`, `domain_mismatch`, `invalid`, `rate_limited`. İki yol aynı işleyicidedir. JSON olmayan dolu gövde `415` alır. Bu, canlı müşteri trafiğinin ölçümü değildir |
| Geçiş sonrası gözlem | `bekliyor` | Aşağıdaki gözlem planı yazıldı. Ölçüm başlamadı |

### Gözlem planı

Geçiş onayından sonra ilk saat, gövde loglanmadan sayılır:

- Doğrulama HTTP durumu: 200, 404, 405, 415, 429, 5xx.
- JSON `status` sayımı: `active`, `inactive`, `expired`, `domain_mismatch`, `invalid`, `rate_limited`.
- `Retry-After` yalnız 429 yanıtında ve pozitif tam sayıdır.
- İki erişim günlüğü de aynı yolun tek tarafta kaldığını gösterir.
- Kanarya lisansın durumu ve görüntülemesi, kayda geçirilen beklenen değerle aynıdır. Değer günlüğe yazılmaz.
- Panel `/lisans/` yanıtında `frame-ancestors 'none'` ve `X-Frame-Options: DENY` başlıkları vardır.

Taban sayım geçişten önce yazılmamışsa karşılaştırma yapılmaz. O eksik, geçişi başlatmaz.

## Bu aşamada çalışan testler

24 Ekim 2026, 19:59 TSİ. Üretim veritabanı açılmadı. `transfer-audit-db.php` bu aşamada yeniden çalıştırılmadı. Önceki sentetik MariaDB sonucu canlı başarı sayılmaz. O prova 17:18 TSİ’de geçici şemada 28 kontrol, 0 hata idi.

| Komut | Sonuç |
| --- | --- |
| `php backend/tests/transfer-audit.php` | 80 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/run.php` | 64 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/licenses.php` | 54 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/auth.php` | 50 kontrol, 0 hata, çıkış 0 |

`run.php`, `licenses.php` ve `auth.php` bellek içi SQLite kullanır. `transfer-audit.php` veritabanı açmaz.

## Aşama 19 — yerel yayın ön kontrolü

24 Ekim 2026, 21:09 TSİ. Üretim sunucusu, cPanel ve üretim veritabanı açılmadı. Gerçek lisans anahtarı ve üretim sırrı kullanılmadı. Commit, push, PR ve merge yapılmadı.

### Bu turda çalışan testler

| Komut | Sonuç |
| --- | --- |
| `php backend/tests/run.php` | 64 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/auth.php` | 50 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/licenses.php` | 54 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/transfer-audit.php` | 80 kontrol, 0 hata, çıkış 0 |
| `php backend/tests/release-preflight.php` | 16 kontrol, 0 hata, çıkış 0 |
| `php backend/bin/release-preflight.php self-test` | `paket_dosya: 16`, `web_kok: backend/public`, `https_zorunlu: evet`, `self_test: tamam`, çıkış 0 |
| `php backend/tests/transfer-audit-db.php` MariaDB 10.11.14, soket `/run/mysqld/mysqld.sock` | 28 kontrol, 0 hata, çıkış 0. Geçici sentetik şema |
| `php backend/tests/transfer-audit-db.php` MySQL 8.0.46, soket `/tmp/mysql8/run/mysql.sock`, kapı 3307 | 28 kontrol, 0 hata, çıkış 0. Geçici sentetik şema |
| `php backend/bin/release-preflight.php local` her iki motorda, DML kullanıcısı | `yerel_yetki: yeterli`, `https_zorunlu: evet`, çıkış 0 |
| aynı komut, yalnız `SELECT` kullanıcısı | `hata_sinifi: yetki`, çıkış 2 |

MySQL 8 bu turda yerel olarak açıldı ve test bitince `SHUTDOWN` ile kapatıldı. Kapanış 24 Ekim 2026, 21:08 TSİ. Kapı 3307 dinlemiyor. Sistem MariaDB’si 3306 üzerinde açık bırakıldı. Temizlik sayımı her iki motorda `qrl_it_%` / `qrl_pf_%` şema 0 ve `qrl_s19%` kullanıcı 0 idi. Eski `qrl_stage5` ve `qrl_mysql8` şemalarına dokunulmadı.

Yerel paket listesi kontrolünün durumu `hazır`dır. Bu, çalışma kopyasındaki dosya listesinin kanıtıdır. Canlı sunucu yerleşimi `doğrulanmadı`. Canlı HTTPS, canlı yetki, saat dilimi ve güvenilen sertifika bu turda `hazır` değildir.

### Yayın paketine giren dosyalar

Aşama 21 bu 16 yolu web ve çevrimdışı paket olarak ayırdı. Aşağıdaki liste aşama 19’un tek envanteridir.

Kaynak liste `backend/bin/release-preflight.php` içindeki 16 yoldur:

- `backend/public/index.php`
- `backend/src/Admin/Auth.php`, `backend/src/Http/RequestContext.php`, `backend/src/Http/Router.php`
- `backend/src/License/Keys.php`, `backend/src/License/LicenseAdmin.php`, `backend/src/License/Validator.php`
- `backend/src/Store/Database.php`
- `backend/migrations/001_schema.sql`, `backend/migrations/002_license_tier.sql`
- `backend/config.example.php`
- `backend/bin/create-admin.php`
- `lisans/index.html`, `lisans/lisans.js`, `lisans/lisans.css`
- `assets/brand/qr-menu-official-logo-compact.svg`

`backend/public/` içinde yalnız `index.php` durabilir. API’nin belge kökü bu dizindir. Panel `/lisans/` altından servis edilir. Logo yolu `../assets/brand/qr-menu-official-logo-compact.svg` bu yerleşimde çözülür.

### Yayın paketine girmeyen dosyalar

Ön kontrol `backend/` ve `lisans/` altındaki her dosyayı tarar. Allow-list dışında kalan ve dışlama listesinde olmayan dosya `hata_sinifi: paket` ile durdurur.

Dışarıda kalanlar:

- `backend/tests/` tamamı, buna `transfer-audit-db.php` dahildir
- `backend/bin/license-audit.php`
- `backend/bin/release-preflight.php` — paketle birlikte sunucuya konmaz ve üretimde çalıştırılmaz
- `backend/src/License/TransferAudit.php` — `index.php` bunu yüklemez
- `backend/.gitignore`
- `GO_LIVE_CHECKLIST.md`, `INTEGRATION_AUDIT.md`, `KEY_CUSTODY.md`, `SECURITY_AUDIT.md`, `TRANSFER_READINESS.md`
- `config.php`, `.env`, `.env.*`
- `pem`, `crt`, `key`, `log`, `sql.gz`, `sql.bak`, `dump` uzantılı dosyalar

`config.example.php` kullanıcı, parola, pepper ve `encryption_key` alanlarını boş tutar ve `require_https` değerini `true` bırakır. Boş değilse öz sınama `hata_sinifi: ornek_sir` verir. `.gitignore` `/config.php`, `/.env`, `/backups/`, `*.sql.gz` ve `*.dump` satırlarını taşımak zorundadır.

### Ön kontrolün baktığı yerler

`self-test` veritabanı açmaz. Paket listesini, boş örneği, `.gitignore` kapsamını, HTTPS kuralını ve sentetik yetki satırlarını ölçer. `QR_LICENSE_CONFIG` isteğe bağlıdır. Ayar yoksa sırlar `backend/public/` dışındaki `config.php` dosyasından okunur.

`local` kipi `QR_LICENSE_CONFIG` dosyasını açmaz. `QR_PREFLIGHT_CONFIG` ister. Bu dosya mutlak yol, depo dışı ve grup/diğer izinleri kapalı olmalıdır. `require_https` `false` ise bağlantıdan önce `hata_sinifi: https` döner. DSN `mysql:` olmalı, `dbname` taşımalı ve ya unix soketi ya da `localhost` / `127.0.0.1` / `::1` konağı olmalıdır. Uzak konak bağlantıdan önce `hata_sinifi: yerel_degil` döner. Bağlantı hatası yalnız `hata_sinifi: baglanti` basar. Çıktıda parola, pepper, kullanıcı ve DSN yoktur. `SHOW GRANTS` satırı basılmaz.

Uygulama kullanıcısı sekiz tabloda `SELECT`, `INSERT`, `UPDATE` ve `DELETE` ister: `admins`, `admin_sessions`, `licenses`, `license_modules`, `tiers`, `tier_modules`, `audit_events`, `rate_buckets`. `*.*` üzerindeki `USAGE` kabul edilir. `*.*` üzerindeki yazma, `ALL`, `GRANT OPTION`, `FILE` ve `SUPER` reddedilir. Yalnız `SELECT` yetmez. Denetim kullanıcısının yalnız `SELECT` kuralı `license-audit.php` içindedir. Bu ön kontrol o kuralın yerine geçmez.

### Paketleme riskleri

Tüm çalışma ağacını sıkıştırmak testleri, denetim raporlarını, `license-audit.php` ve bu ön kontrolü pakete alır. Paket, yukarıdaki 16 dosyadan kurulur.

Ön kontrol `assets/` altının tamamını taramaz. Sıkıştırılmış logo dosyasının varlığını ister. Tam logo ve sitenin diğer sayfaları lisans paketinin parçası değildir. Onlar bu kontrolün dışında kalır.

Belge kökü depo kökü veya `backend/` olursa ve PHP çalışmazsa `config.php` indirilebilir. Panel ile API tek belge kökünü, `/lisans/` ve `backend/public` ayrımları olmadan paylaşamaz.

Çerçeve başlıkları paket dosyasında yoktur. Apache ve nginx satırları `INTEGRATION_AUDIT.md` içindedir. Paketi kopyalamak bu başlıkları uygulamaz.

Kamuya açık PHP sürecinde `QR_AUDIT_SOURCE`, `QR_AUDIT_TARGET`, `QR_AUDIT_PEPPER_FILE` ve `QR_AUDIT_REPORT` durmaz. `QR_PREFLIGHT_CONFIG` de durmaz. `local` kipi bu turda yalnız loopback üzerindeki geçici şemalara bağlandı.

### Raporlarla çelişki

`INTEGRATION_AUDIT.md` aşama 14.1 tablosu `transfer-audit.php` için 57 kontrol yazar. O sayı o tarihin koşusudur. Aşama 19 aynı dosyayı 80 kontrol, 0 hata ile bitirdi. İki satır aynı koşu değildir.

`SECURITY_AUDIT.md` o güvenlik turunda `transfer-audit-db.php` için `ortam_yok` ve `transfer-audit.php` için 57 kontrol yazar. Sonraki geçici veritabanı koşuları ayrı tarihtedir. Aşama 19’un sentetik 28/0 sonucu o raporun o günkü kaydını değiştirmez.

İki rapor ile bu liste şu hükümlerde aynıdır: web kökü `backend/public` olur; yerel self-signed sertifika güvenilen sertifika değildir; meta CSP `frame-ancestors` uygulamaz; örnek yapılandırma `require_https` değerini `true` bırakır ve sırları boş tutar; `.gitignore` config, env, yedek ve dökümü dışlar; iki doğrulama yolu tek işleyicidedir; `zaten_mevcut` şifreli kopyanın açıldığını göstermez.

Bu ön kontrol canlı HTTPS, canlı yetki, saat dilimi veya güvenilen sertifika kanıtı üretmez. O maddeler `hazır` değildir. İki denetim raporu bu turda yeniden yazılmadı.

## Aşama 20 — paketin bağımsız doğrulanması

24 Ekim 2026, 22:13 TSİ. Bu ölçüm dört hassas dosyayı web ağacının içinde taşıyordu. Aşama 21 onları web paketinden ayırdı. Yayın paketi, çalışma ağacındaki 16 dosyanın kopyasından kuruldu. Kaynak dosya taşınmadı ve silinmedi. Kopya geçici bir dizinde arşivlendi ve ikinci bir geçici dizine açıldı. Açılan 16 dosyanın SHA-256 özeti kaynakla aynıydı. Doğrulama bitince bu geçici dizin, arşiv ve doğrulama betiği silindi. Canlı sunucuya, cPanel’e ve üretim veritabanına bağlanılmadı. Gerçek sır kullanılmadı. Deploy, DNS, commit, push, PR ve merge yapılmadı.

Paket doğrulamasının çıkış kodu 0’dır. Sonuç satırı `sonuc: 0 hata`dır. Bu, çalışma kopyasından kurulan arşivin kanıtıdır. Canlı yerleşim `doğrulanmadı`.

### Açılan paketin içeriği

- `backend/public/index.php`
- `backend/src/Admin/Auth.php`, `backend/src/Http/RequestContext.php`, `backend/src/Http/Router.php`
- `backend/src/License/Keys.php`, `backend/src/License/LicenseAdmin.php`, `backend/src/License/Validator.php`
- `backend/src/Store/Database.php`
- `backend/migrations/001_schema.sql`, `backend/migrations/002_license_tier.sql`
- `backend/config.example.php`
- `backend/bin/create-admin.php`
- `lisans/index.html`, `lisans/lisans.js`, `lisans/lisans.css`
- `assets/brand/qr-menu-official-logo-compact.svg`

`001_schema.sql` sekiz tabloyu kurar: `admins`, `admin_sessions`, `licenses`, `license_modules`, `tiers`, `tier_modules`, `audit_events`, `rate_buckets`. `002_license_tier.sql` `tier_slug` sütununu ekler. İki dosyada `DROP` ve `TRUNCATE` yoktur. `index.php` yedi sınıfı `backend/src` altından yükler. API girişi `backend/public/index.php` dosyasıdır. Yapılandırma yolu, bu dosyanın bir üst dizinindeki `config.php` veya `QR_LICENSE_CONFIG` değeridir.

On PHP dosyasında `php -l` çıkış kodu 0’dır. Pakette test dizini, `license-audit.php`, `release-preflight.php`, `TransferAudit.php`, markdown rapor, `config.php`, `.env`, sertifika, günlük ve SQL dökümü yoktur.

`config.example.php` içinde kullanıcı, parola, pepper ve `encryption_key` boştur. `require_https` değeri `true`dır. Bu dosya değerleri `require` ile okundu. Örnekteki `127.0.0.1` DSN’i çalıştırılmadı.

Panel dosyaları `lisans/` altındadır. `index.html`, `lisans.css` ve `lisans.js` aynı dizindedir. Logo yolu `../assets/brand/qr-menu-official-logo-compact.svg`dir. `API_BASE` boştur. Üç panel dosyasında `frame-ancestors` ve `X-Frame-Options` yoktur. Pakette `.htaccess` yoktur. Meta CSP `default-src 'self'` taşır ve `frame-ancestors` içermez. `index.php` çerçeve başlıklarını CLI dışı JSON `emit` işlevinde yazar. Bu başlıklar panel HTML’ine ait değildir.

### Yapılandırma eksikliğinin raporu

Açılan pakette `config.php` yoktur.

| Deneme | Süreç çıkışı | Gözlenen rapor |
| --- | --- | --- |
| `QR_LICENSE_CONFIG` yok | 0 | stdout `server_error`, stderr `HTTP 500` |
| DSN boş, sırlar boş | 0 | stdout `server_error`, stderr `HTTP 500` |
| Bellek içi SQLite, pepper boş | 0 | stdout `server_error`, stderr `HTTP 500` |
| Bellek içi SQLite, şifreleme anahtarı geçersiz | 0 | stdout `server_error`, stderr `HTTP 500` |

Dört denemenin birleşik çıktısında geçici dosya yolu, `/agent/`, `SQLSTATE`, yığın izi ve ayar değeri yoktur. HTTP 500 gövdesi yapılandırma eksikliğini `server_error` olarak verir. Süreç çıkış kodu bu dört denemede 0’dır. Web yanıtının durumu stderr satırındaki `HTTP 500` değeridir. Denemeler üretim veritabanına ve MariaDB soketine bağlanmadı.

### Belge kökü

Ölçüm, açılan paketin üzerinde `127.0.0.1:8891` adresindeki yerel `php -S` ile yapıldı. Üç kök sırayla denendi. Sunucu her ölçümden sonra kapatıldı. Kapı 8891 dinlemiyor. Canlı web sunucusu değişmedi.

Paket kökü, depo kökünün karşılığıdır:

- `/lisans/` ve `/lisans/index.html` HTTP 200 ve `text/html` döndü. Yanıt başlığında `X-Frame-Options` ve `Content-Security-Policy` yoktu.
- Logo HTTP 200 ve `image/svg+xml` döndü.
- `/backend/public/index.php` HTTP 500, JSON `server_error` döndü. Bu API yanıtında iki çerçeve başlığı vardı.
- `/backend/migrations/001_schema.sql` HTTP 200 ve `application/x-sql` döndü. Şema metni indirildi.
- `/backend/config.example.php` HTTP 200 döndü. PHP dosyayı çalıştırdığı için gövde boştu.
- `/backend/bin/create-admin.php` HTTP 500 döndü. Gövde yol taşımıyordu.

`backend/` belge kökü seçilirse:

- `/lisans/`, logo ve panel dosyaları HTTP 404 döndü. Panel bu kökün içinde değildir.
- `/public/index.php` HTTP 500 JSON `server_error` döndü. Çerçeve başlıkları bu JSON yanıtındaydı.
- `/migrations/001_schema.sql` HTTP 200 ile şema metnini verdi.
- `/config.example.php` HTTP 200 döndü.
- `/bin/create-admin.php` HTTP 500 döndü.

`backend/public` belge kökü seçilirse:

- `/` ve `/index.php` HTTP 500 JSON `server_error` döndü. Çerçeve başlıkları bu JSON yanıtındaydı.
- Panel dosyaları, logo, migration ve örnek yapılandırma HTTP 404 döndü.
- Uzantısız `/lisans/` yolu ön denetleyiciye düştü ve JSON 500 döndü. Bu yanıt panel sayfası değildir.

Bu ölçümden çıkan paketleme riski şudur. API belge kökü `backend/public` olur. Panel için `/lisans/` ve logo için `/assets/brand/` ayrı konum ister. Depo kökü veya `backend/` belge kökü olursa migration dosyası indirilir. Gerçek `config.php` bu ağaca konursa web kökünün içinde kalır. PHP kapalıysa dosya gövdesi de iner. `create-admin.php` CLI dışında çalışmayı reddeder. Yanlış kökte URL olarak erişilebilir olması bu reddi gereksiz kılar. Doğru kökte bu dosya URL’de değildir.

`/lisans/` çerçeve başlıkları paket dosyalarından gelmez. Ayrı sunucu yapılandırması gerekir. Satırlar `INTEGRATION_AUDIT.md` içindedir. Bu turda o yapılandırma canlıda uygulanmadı.

### Bu turda çalışan birim testleri

Birim test dosyaları değiştirilmedi.

| Komut | Çıkış | Sonuç |
| --- | --- | --- |
| `php backend/tests/run.php` | 0 | 64 kontrol, 0 hata |
| `php backend/tests/auth.php` | 0 | 50 kontrol, 0 hata |
| `php backend/tests/licenses.php` | 0 | 54 kontrol, 0 hata |
| `php backend/tests/transfer-audit.php` | 0 | 80 kontrol, 0 hata |
| `php backend/tests/release-preflight.php` | 0 | 16 kontrol, 0 hata |

### Raporlarla uyum

Aşama 20 ile `INTEGRATION_AUDIT.md` ve `SECURITY_AUDIT.md` aynı hükmü taşır. Web kökü `backend/public` olur. Meta CSP çerçevelemeyi kapatmaz. API JSON başlığı panel sayfasının yerine geçmez. Örnek yapılandırma sırları boştur ve `require_https` açıktır. İki denetim raporundaki 57 kontrol ve `ortam_yok` kayıtları kendi tarihlerine aittir. Bu turun `transfer-audit.php` sonucu 80 kontrol, 0 hata ve çıkış 0’dır. İki rapor bu turda yeniden yazılmadı.

Canlı HTTPS, canlı yetki, saat dilimi ve güvenilen sertifika bu ölçümle `hazır` olmaz.

## Aşama 21 — belge kökü ve hassas dosya koruması

24 Ekim 2026, 23:43 TSİ. Canlı sunucu, cPanel, üretim veritabanı ve gerçek sır kullanılmadı. Deploy, DNS ve aktarım yapılmadı. Commit, push, PR ve merge yapılmadı.

Koruma, dosyayı web paketinin dışına almaktır. `.htaccess` bu kontrolün yerine geçmez. PHP yerleşik sunucusu ve nginx `.htaccess` okumaz. Apache de `AllowOverride` kapalıysa okumaz. cPanel çoğu sitede `.htaccess` açar. Bu, her Apache kurulumunda açık olduğu anlamına gelmez. Bu turda `.htaccess` eklenmedi ve canlı sunucu yapılandırması değişmedi.

### İki paket

Web paketi 12 dosyadır ve belge köküne girebilecek ağaçtır:

- `backend/public/index.php`
- `backend/src` altındaki yedi sınıf
- `lisans/index.html`, `lisans/lisans.js`, `lisans/lisans.css`
- `assets/brand/qr-menu-official-logo-compact.svg`

API girişi `backend/public/index.php` olarak kaldı. Panel yolu `/lisans/` olarak kaldı. Sınıflar `backend/src` altında kaldı. Doğrulama yolları değişmedi.

Çevrimdışı paket 4 dosyadır ve belge köküne konmaz:

- `backend/migrations/001_schema.sql`
- `backend/migrations/002_license_tier.sql`
- `backend/config.example.php`
- `backend/bin/create-admin.php`

Çalışma kopyasında bu dört dosya eski yollarında durur. Testler ve CLI onları oradan okur. Yayın web paketi onları kopyalamaz. `config.example.php` doğrudan HTTP isteğinde 404 döner ve dizi gövdesini basmaz. `create-admin.php` CLI dışında 404 döner. İkisi de `require` ve CLI kullanımını sürdürür.

### Geçici paket ölçümü

`php backend/tests/web-package.php` çıkış 0, 24 kontrol, 0 hata. Sunucu `127.0.0.1` üzerinde açıldı ve kapandı. Üretim hedefi yok.

Web paketinde üç belge kökü denendi: paket kökü, `backend/` ve `backend/public`. Migration, `config.example.php` ve `create-admin.php` yollarının hepsi HTTP 404 döndü. Gövde şema metni ve `key_pepper` taşımıyordu.

Aynı web paketinde `/lisans/index.html` HTTP 200 döndü. Logo HTTP 200 döndü. API girişi, yapılandırma dosyası olmadığı için HTTP 500 ve `server_error` döndü. `backend/` kökünde `/public/index.php` ve `backend/public` kökünde `/index.php` aynı JSON yanıtını verdi.

Çevrimdışı ağaç belge kökü yapılırsa `001_schema.sql` HTTP 200 ile şema metnini verir. Bu ölçülmüştür ve kapatılmış bir kontrol değildir. Aynı ağaçta `config.example.php` ve `create-admin.php` HTTP 404 döndü. Bu 404, PHP dosyayı çalıştırdığı içindir. PHP kapalıysa bu iki dosyanın gövdesi de iner. O durum bu turda ölçülmedi.

| Komut | Çıkış | Sonuç |
| --- | --- | --- |
| `php backend/tests/web-package.php` | 0 | 24 kontrol, 0 hata |
| `php backend/tests/release-preflight.php` | 0 | 17 kontrol, 0 hata |
| `php backend/tests/run.php` | 0 | 64 kontrol, 0 hata |
| `php backend/tests/auth.php` | 0 | 50 kontrol, 0 hata |
| `php backend/tests/licenses.php` | 0 | 54 kontrol, 0 hata |
| `php backend/tests/transfer-audit.php` | 0 | 80 kontrol, 0 hata |

`transfer-audit-db.php` bu turda çalıştırılmadı. Şema ve sınıflandırıcı değişmedi.

### Sunucu yapılandırmasına kalan risk

Şu maddeler `hazır` değildir:

- Çevrimdışı paketi veya çalışma ağacını belge köküne koymak. SQL dosyası HTTP 200 kalır. Bunu kapatmak dosyanın belge kökünde olmamasına ve sunucu kuralına bağlıdır. Kural bu turda canlıda uygulanmadı.
- Gerçek `config.php`. Web paketinde yoktur. `QR_LICENSE_CONFIG` site ağacının dışında bir yolu göstermelidir. Dosya `backend/config.php` olarak yanlış kökün içine konursa kod bunu engellemez.
- `backend/src` web paketindedir. API onu dosya sisteminden yükler. Yanlış belge kökünde PHP dosyaları URL ile erişilebilir. Bu tur onları paketten çıkarmadı. Çıkarmak API yüklemesini bozar.
- Apache için belge kökü yanlışsa `backend/migrations` ve `backend/bin` dizinlerine `Require all denied`, `config.example.php` için aynı yasak gerekir. nginx `.htaccess` kullanmaz. Karşılığı, o yollar için `deny all` taşıyan `location` bloklarıdır. İki metin de örnektir. Canlıda uygulanmadı ve ölçülmedi.
- `/lisans/` çerçeve başlıkları paketle gelmez. Önceki aşamadaki sunucu başlığı gereksinimi durur.

## Aşama 22 — son yerel denetim

25 Ekim 2026, 01:02 TSİ. Test dosyaları değiştirilmedi. Canlı sunucu, cPanel, üretim veritabanı ve gerçek sır açılmadı. Dosya taşınmadı. Import, DNS, deploy ve trafik kesimi yapılmadı. Commit, push, PR ve merge yapılmadı. Canlı geçiş gerçekleşmedi ve onaylanmadı.

Bu bölümdeki üç sözcük önceki tabloların `hazır` / `bekliyor` / `doğrulanmadı` sözcüklerinin yerine geçmez. O tablolar kendi tarihlerinde kalır.

- `yerel doğrulandı`: bu turda yerel test veya paket ölçümü geçti. Canlı onay değildir.
- `canlı kanıt gerekli`: yerel parça canlı ölçümün yerine geçmez.
- `henüz yapılmadı`: işlem yapılmadı.

### Bu turda çalışan testler

| Komut | Çıkış | Sonuç |
| --- | --- | --- |
| `php backend/tests/run.php` | 0 | 64 kontrol, 0 hata |
| `php backend/tests/auth.php` | 0 | 50 kontrol, 0 hata |
| `php backend/tests/licenses.php` | 0 | 54 kontrol, 0 hata |
| `php backend/tests/transfer-audit.php` | 0 | 80 kontrol, 0 hata |
| `php backend/tests/release-preflight.php` | 0 | 17 kontrol, 0 hata |
| `php backend/tests/web-package.php` | 0 | 24 kontrol, 0 hata |

`transfer-audit-db.php` bu turda çalıştırılmadı. Son koşu aşama 19, 24 Ekim 2026, 21:08 TSİ’dir. Geçici MariaDB 10.11.14 ve MySQL 8.0.46 üzerinde 28 kontrol, 0 hata, çıkış 0. MySQL 8 o turdan sonra kapatıldı. O sonuç bu turun başarısı değildir. `qr-menu-suite` kaynak kodu bu turda okunmadı. Tarayıcı ve üretim sertifikası açılmadı.

### Yerel olarak geçen kontroller

Web paketi 12 dosyadır. İçinde SQL migration, `config.example.php`, `create-admin.php`, test, denetim aracı, `config.php` ve sır dosyası yoktur. Çevrimdışı paket bu dört hassas dosyayı ayrı taşır. `release-preflight.php` ve `web-package.php` bunu bu turda geçti. Durum: `yerel doğrulandı`.

`POST /wp-json/qmls/v1/validate` ile `POST /v1/validate` aynı gövdeyi verir. Yönlendirme başlığı yoktur. Gözlenen JSON `status` değerleri `active`, `inactive`, `expired`, `domain_mismatch`, `invalid` ve `rate_limited`dır. Aktif yanıtta `modules` vardır. Pasif ve geçersiz yanıtta `modules` yoktur. Uyuşmazlık ve süre dolmuş yanıtta `modules` boş dizidir. JSON olmayan dolu gövde HTTP 415 ve `unsupported_media_type` alır. `application/json; charset=UTF-8` kabul edilir. Bu, yerel sözleşme testidir. Suite deposu bu turda yoktur. Durum: `yerel doğrulandı`. Canlı müşteri trafiği `canlı kanıt gerekli` kalır.

HTTPS oturumunda çerez adı `__Host-qrl_session` olur. `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/` vardır ve `Domain` yoktur. Düz `qrl_session` bu oturumu açmaz. CSRF’siz çıkış ve yazma reddedilir. Doğrulama ve 429 yanıtında `Cache-Control: no-store` vardır. Yerel HTTP girişinde yanıt başlıkları `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` ve `Cache-Control: no-store` taşır. Bu HTTP denemesi `require_https` kapalı olduğu için `__Host-` ve `Secure` beklemez. API JSON CSP dizesi `index.php` içindedir. Bu turdaki test adı o CSP dizesini doğrulamaz. Durum: çerez, CSRF, `no-store` ve ölçülen başlıklar `yerel doğrulandı`. CSP dizesinin test adı `henüz yapılmadı` sayılır. Canlı başlık ölçümü `canlı kanıt gerekli` kalır.

Sınıflandırıcı kayıt yazmaz. `import`, `apply`, `write` ve `migrate` komutları yoktur. Eksik veya bilinmeyen durum, bilinmeyen modül, yinelenen hedef HMAC, geçersiz UTF-8, yalnız boşluk anahtar ve geçersiz tarih `manuel_inceleme` olur. Üç sayaç birbirini dışlar ve kaynak sayısına eşittir. `zaten_mevcut` şifreli kopyanın açıldığını göstermez. Sentetik açma ve yanlış anahtarın açmaması bu turun `transfer-audit.php` çıktısındadır. Durum: `yerel doğrulandı`. Gerçek kayıtlara uygulanması `henüz yapılmadı`.

### Geçiş engellerinin bu turdaki durumu

| Engel | Durum |
| --- | --- |
| Üretim saat dilimi | `canlı kanıt gerekli`. Yerel bitiş kuralı bu turun `run.php` çıktısında geçti. Üretim `date.timezone`, `timezone_string` ve `gmt_offset` okunmadı |
| Canlı `uq_licenses_api_key_hmac` ve güncel HMAC tekrarı | `canlı kanıt gerekli`. İndeks şema tanımındadır. Canlı `SHOW INDEX` ve tekrar sorgusu yok |
| Gerçek kaynakların salt okunur denetimi | `henüz yapılmadı`. `audit` kipi bu turda bir veritabanına bağlanmadı |
| Canlı şifreli kopyanın üretim pepper’ı ile açılması | `canlı kanıt gerekli`. Sentetik tur geçti. Canlı satır açılmadı |
| Güvenilen HTTPS sertifikası | `canlı kanıt gerekli`. Bu turda sertifika ölçülmedi |
| `/lisans/` çerçeve başlıkları | `canlı kanıt gerekli`. Paket dosyaları bu başlığı vermez. Canlıda uygulanmadı |
| Üretim yedekleri ve geri yükleme provası | `henüz yapılmadı` |
| İki sistemin aynı anda yazmayacağı trafik kesimi | `henüz yapılmadı` |
| Aktarım | `henüz yapılmadı`. Aktarım komutu yoktur ve aktarım yapılmadı |

### Ayrı riskler

Yanlış belge kökü: web paketinde üç kök de hassas URL’leri HTTP 404 verdi. Bu, dosyalar web paketinde olmadığı içindir. Çalışma ağacı veya çevrimdışı paket belge kökü yapılırsa SQL HTTP 200 kalır. Web paketi ölçümü `yerel doğrulandı`. SQL dosyasını belge kökünde yasaklayan sunucu kuralı `henüz yapılmadı` ve kapanmış sayılmaz.

Hassas dosyanın URL ile erişilmesi: web paketinde migration, örnek yapılandırma ve yönetici oluşturucu 404 döndü. Çevrimdışı ağaç kök yapılınca SQL 200, örnek yapılandırma 404, yönetici oluşturucu 404 döndü. PHP kapalıyken bu iki PHP dosyasının inmesi bu turda ölçülmedi. `backend/src` web paketindedir. Yanlış kökte URL ile erişilebilir.

Güvenilen HTTPS sertifikası: bu turda yok. Aşama 14’teki sertifika yerel ve self-signed idi. Durum: `canlı kanıt gerekli`.

`/lisans/` çerçeve başlıkları: panel dosyalarında `frame-ancestors` ve `X-Frame-Options` yoktur. API JSON başlığı panel sayfasına yazılmaz. Canlı sunucu kuralı uygulanmadı. Durum: `canlı kanıt gerekli`.

Yapılandırma dosyasının belge kökü dışında tutulması: web paketinde `config.php` ve `config.example.php` yoktur. Gerçek dosya `QR_LICENSE_CONFIG` ile site ağacının dışında durmalıdır. Dosya `backend/config.php` olarak yanlış kökün içine konursa kod bunu engellemez. Canlı yerleşim ölçülmedi. Durum: paket ayrımı `yerel doğrulandı`. Canlı dosya yeri `canlı kanıt gerekli`.

## Aşama 23 — canlı salt okunur ön inceleme planı

25 Ekim 2026, 01:16 TSİ. Bu bölüm plandır. Bu turda canlı sunucuya, cPanel’e ve üretim veritabanına bağlanılmadı. Üretim lisansları, sırlar ve yapılandırma dosyaları okunmadı. Yeni kanıt yoktur. Adımlar yapılmış sayılmaz. Canlı geçiş izni değildir.

Erişim bu depoda yoktur ve varsayılmaz. WordPress’in hangi kuruluda olduğu, SSH, wp-cli, salt okunur veritabanı kullanıcısı ve belge kökü bu turda doğrulanmadı. Bir adımın erişimi yoksa o adım durur. Sonraki adım onun yerine geçmez.

Sır, parola, DSN, düz lisans anahtarı, HMAC değeri ve `SHOW GRANTS` satırı terminale yapıştırılmaz, sohbete, bilete veya Git’e yazılmaz. Çıktı yalnız aşağıdaki beklenen satırlardır. Başka bir satır görünürse dosya silinir ve geçiş durur.

### Araçların gerçek kapsamı

`backend/bin/license-audit.php` iki kip kabul eder: `synthetic` ve `audit`. Başka kip `hata_sinifi: komut` ile çıkar.

`synthetic` bellek içindeki gösterim kümesini sayar. Veritabanına bağlanmaz.

`audit` şunları yapar:

- `QR_AUDIT_SOURCE`, `QR_AUDIT_TARGET` ve `QR_AUDIT_PEPPER_FILE` okur. `QR_LICENSE_CONFIG` ve `backend/config.php` okumaz.
- Kaynak ile hedef aynı veritabanıysa bağlantıdan önce durur.
- `SHOW GRANTS FOR CURRENT_USER()` okur ve satırı basmaz. Kaynakta yazı ve meta tabloları, hedefte `licenses` ve `license_modules` için yalnız `SELECT` yoksa `grants_unverified` ile durur.
- `SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ` ve `START TRANSACTION READ ONLY` kurar. Sonunda `ROLLBACK` yapar.
- Kaynaktan `qmls_license` yazılarını ve aktarım meta anahtarlarını, hedeften lisans alanlarını ve modülleri seçer.
- Sayaç basar. Düz anahtar bellekte HMAC için durur ve çıktıya yazılmaz. `encryption_key` yüklenmez. Şifreli kopya açılmaz.

`audit` şunları yapmaz: `import`, `apply`, `write`, `migrate`, `INSERT`, `UPDATE`, `DELETE`, indeks kontrolü, HMAC tekrar sayısı, saat dilimi okuma, HTTPS, belge kökü, çerçeve başlığı, yedek ve trafik kesimi. Çıktıdaki `saat_dilimi_onayi: verilmedi` satırı sabittir. Saat dilimi daha önce okunmuş olsa da araç bunu `verildi` yapmaz.

`backend/bin/release-preflight.php` iki kip kabul eder.

`self-test` veritabanına bağlanmaz. Web ve çevrimdışı dosya listesini, boş örneği, `.gitignore` kapsamını ve sentetik yetki satırlarını ölçer.

`local` yalnız `localhost`, `127.0.0.1`, `::1` veya unix soketi kabul eder. Uzak konağı bağlantıdan önce reddeder. Bağlanırsa uygulama kullanıcısında `SELECT`, `INSERT`, `UPDATE` ve `DELETE` arar. `SHOW GRANTS` satırını basmaz. `require_https` false ise bağlantıdan önce durur.

`release-preflight.php` şunları yapmaz: üretim sertifikası, canlı belge kökü, `/lisans/` başlıkları, saat dilimi, lisans sınıflandırması, şifre çözme ve denetim kullanıcısının yalnız `SELECT` olması. Denetim yetkisini `license-audit.php` ölçer. Üretim makinesinde `127.0.0.1` üretim veritabanına gidebilir. `local` kipi üretim DSN’i ile çalıştırılmaz.

### Sıra

Bir adım durursa sonraki adım başlatılmaz.

1. Saat dilimi. Erişim: eski lisans eklentisinin kurulu olduğu WordPress kökünde wp-cli. Komut:

```bash
wp eval 'echo wp_json_encode(array("php"=>date_default_timezone_get(),"wp"=>wp_timezone_string(),"option"=>(string) get_option("timezone_string"),"offset"=>(string) get_option("gmt_offset")));'
```

Beklenen güvenli çıktı bu dört alanı içeren tek JSON satırıdır. Değerler bu depoda yoktur. Eski bitiş, PHP saat diliminde o günün `23:59:59` anıdır. Yeni bitiş aynı takvim gününün `23:59:59 UTC` anıdır ve bu saniye dahildir. PHP saat dilimi `UTC` değilse iki an farklıdır. Durma: komut çalışmazsa, JSON dört alanı da taşımazsa veya PHP saat dilimi `UTC` değilken yazılı bir fark kararı yoksa. Araç çıktısındaki `verilmedi` satırı bu okumanın yerine geçmez.

2. Yedek, denetimden önce. Erişim: WordPress dosyaları, lisans tabloları ve yeni şema için ayrı arşiv yazma. Arşiv web kökünün ve Git’in dışında, izin `600` olur. `mysqldump` `--debug` almaz. Düz `api_key` içerir. Gövde günlüğe bağlanmaz. SHA-256 ayrı bir `600` dosyaya yazılır. Beklenen çıktı: dört kapsamın ayrı arşivi ve özetin eşleşmesi. Gövde basılmaz. Durma: özet tutmazsa, arşiv web kökündeyse veya tek kopya `backend/backups/` ise. `KEY_CUSTODY.md` içindeki kurtarma provası boş bir veritabanında yapılır. Bu prova bu turda yeniden çalıştırılmadı.

3. Hedef indeks ve güncel HMAC tekrarı. Erişim: hedef veritabanında yalnız `SELECT`. Komutlar sayaç basar, HMAC değeri basmaz:

```sql
SHOW INDEX FROM licenses WHERE Key_name = 'uq_licenses_api_key_hmac';
SELECT COUNT(*) FROM (SELECT api_key_hmac FROM licenses GROUP BY api_key_hmac HAVING COUNT(*) > 1) AS tekrar;
```

Beklenen çıktı: indeks satırında `Non_unique = 0` ve tekrar sayısı `0`. Durma: indeks yoksa, `Non_unique` 0 değilse veya sayı 0 değilse. İndeksin durması, eskiden silinmiş yinelemeyi göstermez. Boş tablo, canlı anahtarların hiç yinelenmediğini göstermez. `license-audit.php` bu iki sorguyu çalıştırmaz.

4. Salt okunur aktarım denetimi. Erişim: kaynaktan ayrı, hedeften ayrı, yalnız `SELECT` kullanıcıları. İki DSN farklı veritabanıdır. Pepper dosyası en az 32 karakterdir, izin `600` ve depo dışıdır. Önek `^[A-Za-z0-9_]+$` olur. `wp_` varsayılmaz. Komut:

```bash
php backend/bin/license-audit.php audit
```

Ortam: `QR_AUDIT_SOURCE`, `QR_AUDIT_TARGET`, `QR_AUDIT_PEPPER_FILE`. İsteğe bağlı `QR_AUDIT_REPORT` mutlak, depo dışı ve `0600` olur. Beklenen çıktı sayaç satırları, `tutarli_okuma: read_only`, `salt_okunur_yetki: select`, `hata_sinifi: -` ve `saat_dilimi_onayi: verilmedi` olur. Aynı komut ikinci kez aynı sayaçları verir. Durma: `hata_sinifi` `-` değilse, iki koşu farklıysa, çıktıda sayaç satırı dışında veri varsa veya operatör `manuel_inceleme` kaydını yazmak isterse. Sayaçlar yazım değildir. Bu depoda yazım komutu yoktur.

5. Pepper ve şifreleme anahtarı. Erişim: `QR_LICENSE_CONFIG` ve denetim pepper dosyası. İkisi de basılmaz. Karşılaştırma yalnız evet veya hayır basar:

```bash
php -r '$c=require getenv("QR_LICENSE_CONFIG"); $p=rtrim((string) file_get_contents(getenv("QR_AUDIT_PEPPER_FILE")), "\r\n"); $k=(string) ($c["encryption_key"] ?? ""); echo "pepper_eslesme: ".($p===(string) ($c["key_pepper"] ?? "") ? "evet" : "hayir")."\n"; echo "pepper_yeterli: ".(strlen($p)>=32 ? "evet" : "hayir")."\n"; echo "anahtar_bicim: ".(preg_match("/^[a-fA-F0-9]{64}$/", $k)===1 ? "evet" : "hayir")."\n";'
```

Beklenen çıktı üç satırda `evet` olur. Durma: biri `hayir` ise veya çıktıda değer görünürse. Bu komut şifreli satırı açmaz. Açma sayacı bu depoda bir araç değildir. Hedefte lisans satırı varsa açma, düz metin basmadan yalnız `satir`, `acilan` ve `acilamayan` sayar. `acilamayan` 0’dan büyükse durulur. Satır sayısı 0 ise canlı şifreli kopya kanıtı yoktur. Durum `canlı kanıt gerekli` kalır. `zaten_mevcut` bu sayının yerine geçmez.

6. HTTPS, belge kökü, panel başlıkları ve yapılandırma yeri. Erişim: yayımlanan konağın dışından başlık okuma ve sunucuda belge kökü ile yapılandırma yolunu basmadan karşılaştırma. İstemci belgesindeki örnek konak `qrmenuofficial.com`dur. Canlı konak farklıysa aynı kontroller o konağa uygulanır. Bu turda istek gönderilmedi.

```bash
curl -sI -o /dev/null -w 'dogrulama:%{ssl_verify_result} http:%{http_code}\n' https://KONAK/
curl -sI https://KONAK/lisans/
curl -sS -o /dev/null -w 'sema:%{http_code}\n' https://KONAK/backend/migrations/001_schema.sql
curl -sS -o /dev/null -w 'ornek:%{http_code}\n' https://KONAK/backend/config.example.php
curl -sS -o /dev/null -w 'ayar:%{http_code}\n' https://KONAK/backend/config.php
```

Gövde diske yazılmaz. `200` gelirse gövde okunmaz ve durulur. Beklenen çıktı: `dogrulama:0`, panel yanıtında `Content-Security-Policy` içinde `frame-ancestors 'none'` ve `X-Frame-Options: DENY`, şema, örnek ve ayar için `200` olmayan kod. Sunucuda yapılandırma yolu yalnız şu sonucu basar: `yapilandirma_web_kokunde: hayir`. Durma: sertifika doğrulaması 0 değilse, panel başlıkları yoksa, hassas URL `200` ise veya yapılandırma belge kökünün içindeyse. `release-preflight.php` bu ölçümleri yapmaz.

7. Geri yükleme provası ve trafik kesimi. Erişim: yazım öncesi arşivin ikinci kopyası ve geçici boş veritabanı. Prova `KEY_CUSTODY.md` içindeki sentetik sırayla yapılır. Müşteri anahtarı kullanılmaz. Beklenen çıktı: pepper değişince `invalid`, yalnız şifreleme anahtarı değişince doğrulama sürer ve görüntüleme `key_unavailable`, yedek dönünce ikisi düzelir. Durma: özet tutmazsa veya prova üretim veritabanında yapılırsa. Trafik kesimi uygulanmadı. Geçişte doğrulama tek tarafta olur. Eski ve yeni uç aynı anda yazarsa domain kilidi ve durum ayrılır. Birleştirme aracı yoktur. Durma ölçüleri gözlem planındadır. Bu adım `henüz yapılmadı`.

### Bu plandan sonra duran engeller

Saat dilimi `canlı kanıt gerekli`. HMAC indeksi ve tekrar sayısı `canlı kanıt gerekli`. Gerçek kayıt denetimi `henüz yapılmadı`. Canlı şifreli kopya `canlı kanıt gerekli`. Güvenilen HTTPS `canlı kanıt gerekli`. `/lisans/` çerçeve başlıkları `canlı kanıt gerekli`. Üretim yedekleri ve geri yükleme provası `henüz yapılmadı`. Trafik kesimi `henüz yapılmadı`. Aktarım `henüz yapılmadı`.

## Aşama 24 — sentetik şifre açma

25 Ekim 2026, 01:27 TSİ. Şifreleme kodu `backend/src/License/Keys.php` içindedir. Biçim değişmedi. Üretim veritabanına ve üretim sırlarına bağlanılmadı. Canlı satır açılmadı.

Biçim şudur. `encryption_key` 64 onaltık karakterdir ve 32 bayta çözülür. Algoritma AES-256-GCM’dir. Ek doğrulama verisi yoktur. Gövde sırası 12 bayt IV, 16 bayt etiket ve ham şifreli metindir. Aynı düz metin her şifrelemede yeni IV aldığı için farklı gövde üretir. Hata metni `Şifreli anahtar okunamadı.` olur. Anahtar, şifreli gövde ve yapılandırma değeri bu metne girmez.

`php backend/tests/key-roundtrip.php` çıkış 0, 14 kontrol, 0 hata. Test rastgele sentetik değer üretir. Geçerli anahtar açar. Yanlış anahtar, boş gövde, 28 bayttan kısa gövde, kesilmiş gövde, uzatılmış gövde, gövde biti, etiket biti ve IV biti reddedilir. Kısa pepper ve kısa şifreleme anahtarı da reddedilir. Boş düz metin 28 bayt üretir. Çözücü 29 bayttan kısayı eksik saydığı için bu gövdeyi açmaz. Lisans anahtarı boş değildir. Bu kenar için kod değiştirilmedi.

Bu sonuç üretim kaydının açıldığı anlamına gelmez. `license-audit.php` şifreli kopyayı açmaz. `zaten_mevcut` açıldığını göstermez. Canlı açma sayacı hâlâ bu depoda yoktur. Engel `canlı kanıt gerekli` kalır.

Aynı turda mevcut testler de geçti:

| Komut | Çıkış | Sonuç |
| --- | --- | --- |
| `php backend/tests/key-roundtrip.php` | 0 | 14 kontrol, 0 hata |
| `php backend/tests/run.php` | 0 | 64 kontrol, 0 hata |
| `php backend/tests/auth.php` | 0 | 50 kontrol, 0 hata |
| `php backend/tests/licenses.php` | 0 | 54 kontrol, 0 hata |
| `php backend/tests/transfer-audit.php` | 0 | 80 kontrol, 0 hata |
| `php backend/tests/release-preflight.php` | 0 | 17 kontrol, 0 hata |
| `php backend/tests/web-package.php` | 0 | 24 kontrol, 0 hata |

`transfer-audit-db.php` bu turda çalıştırılmadı.

## Canlı geçişi durduran maddeler

Onay verilmeden şunlar durur. Aşama 22 etiketleri yukarıdaki tablodadır.

1. Üretim saat dilimi okunmadı. `canlı kanıt gerekli`.
2. Canlı benzersiz HMAC indeksi ve güncel HMAC tekrarı doğrulanmadı. `canlı kanıt gerekli`.
3. Gerçek kayıtların salt okunur denetimi çalışmadı. `henüz yapılmadı`. `manuel_inceleme` kayıtları otomatik yazılmayacak.
4. Canlı şifreli kopya, üretim pepper’ı ile açılmadı. `canlı kanıt gerekli`. Aşama 24 yalnız sentetik turdur.
5. Güvenilen HTTPS sertifikası doğrulanmadı. `canlı kanıt gerekli`.
6. `/lisans/` çerçeve başlıkları canlıda yok. `canlı kanıt gerekli`.
7. Üretim yedekleri alınmadı ve geri yükleme provası bu aşamada yapılmadı. `henüz yapılmadı`.
8. İki sistemin aynı anda yazmayacağı trafik kesimi uygulanmadı. `henüz yapılmadı`.
9. Aktarım komutu yoktur ve aktarım yapılmadı. `henüz yapılmadı`.

Aşama 19’dan aşama 24’e kadar bu dokuz madde kapanmadı. Aşama 23 planı ve aşama 24 sentetik turu canlı kanıt değildir. Web paketinin yerel ölçümü canlı belge kökü onayı değildir. Canlı geçiş gerçekleşmedi.

## Kalan riskler

Saat dilimi farkı, aynı takvim gününü iki farklı anda bitirebilir. Gün dizgisini kopyalamak bu farkı kapatmaz.

Yedek alınmadan yapılan bir yazımın geri dönüşü yoktur. Bu depo yazım aracını içermez.

Eşzamanlı doğrulama, domain kilidini ve lisans durumunu iki tarafta ayrı ayrı değiştirir. Birleştirme aracı yoktur.

`zaten_mevcut` canlı anahtarın görüntüleneceğini göstermez. Pepper ile şifreleme anahtarı ayrı ayrı yenilenirse eski kayıtlar ya doğrulanamaz ya da açılamaz.

`qr-menu-suite` bu ortamda yeniden okunmadı. Uç nokta hükmü, eski eklentinin belgelediği adres ile yeni yönlendiricinin aynı yolu tutmasına dayanır. İstemci başka bir konakçıya sabitlenmişse bu dosya onu görmez.

Panel çerçeve başlığı ve üretim sertifikası geçişin dışında bırakılamaz. İkisi de canlıda ölçülmedi.

Çalışma ağacının tamamı yayın paketi değildir. 16 dosyalık liste dışındaki test, rapor ve denetim aracı sunucuya kopyalanırsa sır ve prova kodu web köküne yaklaşır. Ön kontrol bu kopyanın yapıldığını ölçmez. Aşama 20, açılan pakette üç belge kökünü yerel olarak ölçtü. Aşama 21 web paketinden dört hassas dosyayı ayırdı. Aşama 22 aynı ayrımı yeniden geçti. Çevrimdışı SQL dosyası belge köküne konursa HTTP 200 kalır. Bu kapanmış bir canlı kontrol değildir.
