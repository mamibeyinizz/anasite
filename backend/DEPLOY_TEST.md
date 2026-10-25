# Lisans paneli — cPanel test kurulumu

Bu belge test kurulumu içindir. Canlı geçiş onayı değildir. WordPress dosyaları, site kökündeki mevcut sayfalar ve `main` dalı bu kurulumda değiştirilmez. Üretim veritabanına bağlanılmaz.

Kurulum iki parçadır. Uygulama ağacı `public_html` dışında durur. Belge köküne yalnız panelin statik dosyaları, logo ve ince giriş kopyalanır. `backend/src` belge köküne konmaz.

## Klasör yapısı

Hesap adını cPanel’deki gerçek kullanıcıyla değiştirin. Aşağıdaki yollar örnektir.

```text
/home/KULLANICI/qr-license/                         belge kökünün dışında
  backend/public/index.php                          API giriş noktası
  backend/src/                                      PHP sınıfları; URL ile açılmaz
  backend/config.php                                0600, depoya girmez
  backend/bin/create-admin.php                      yalnız SSH veya Terminal
  backend/migrations/001_schema.sql
  backend/migrations/002_license_tier.sql
  backend/config.example.php

/home/KULLANICI/public_html/                        mevcut WordPress kökü
  lisans/index.html
  lisans/lisans.js
  lisans/lisans.css
  assets/brand/qr-menu-official-logo-compact.svg
  qr-license-front.php                              backend/deploy/cpanel-front.php kopyası
```

`backend/public/index.php` sınıfları `../src` altından yükler. Bu yüzden `public` ile `src` kardeş kalır ve ikisi de `public_html` dışında durur. Belge kökü `qr-license`, `backend` veya depo kökü yapılmaz. Depodaki testler, SQL dosyaları, denetim araçları ve Markdown belgeler belge köküne kopyalanmaz.

`public_html` içine kopyalananlar:

- `lisans/index.html`, `lisans/lisans.js`, `lisans/lisans.css`
- `assets/brand/qr-menu-official-logo-compact.svg`
- `backend/deploy/cpanel-front.php` dosyasının `qr-license-front.php` adıyla kopyası

Aynı adlı bir dosya sitede varsa üzerine yazmayın. Logo yolu panelde `../assets/brand/qr-menu-official-logo-compact.svg` olarak çözülür. Panel adresi `/lisans/` olur.

## Veritabanı

cPanel > MySQL Databases ile yeni bir veritabanı ve yeni bir kullanıcı açın. Kullanıcıya yalnız bu veritabanında SELECT, INSERT, UPDATE ve DELETE verin. ALL PRIVILEGES, GRANT OPTION ve FILE vermeyin. Veritabanı adını üretimdeki başka bir şemanın adı yapmayın.

Şema iki dosyadır ve bu sırayla uygulanır:

1. `backend/migrations/001_schema.sql`
2. `backend/migrations/002_license_tier.sql`

phpMyAdmin’de doğru veritabanını seçip içe aktarın. Dosyalarda DROP, DELETE FROM ve TRUNCATE yoktur. İkinci dosya `licenses.tier_slug` sütunu yoksa ekler. Kodun yazdığı tablolar `admins`, `admin_sessions`, `licenses`, `license_modules`, `tiers`, `tier_modules`, `audit_events` ve `rate_buckets` tablolarıdır. `001` bu tabloları ve indekslerini kurar. Benzersiz lisans anahtarı indeksi `uq_licenses_api_key_hmac`dır. Ayrı bir üçüncü migration yoktur; kodun kullandığı sütunlar bu iki dosyadadır.

Motor InnoDB, karakter kümesi `utf8mb4` olmalıdır. CHECK kısıtları MariaDB 10.11 ve MySQL 8.0 üzerinde yerel olarak uygulanmıştır. cPanel’deki sunucu sürümünü bu belgenin yazımı sırasında okumadık.

## PHP

Yerel çalışma PHP 8.3.6 iledir. Kaynak PHP 8 sözdizimi kullanır (`str_contains`, `str_starts_with`). cPanel’de PHP 8.1 veya daha yenisini seçin. Gerekli uzantılar `pdo_mysql`, `openssl` ve `json`dır. `display_errors` kapalı kalır.

MultiPHP veya Select PHP Version ekranında bu sürümü lisansın çalıştığı alan adına bağlayın. WordPress’in PHP sürümünü bu belge değiştirmez.

## Yapılandırma

`backend/config.example.php` dosyasını `public_html` dışındaki `backend/config.php` yoluna kopyalayın. İzin `0600` olsun. Örnekteki kullanıcı, parola, `key_pepper` ve `encryption_key` boştur. Gerçek değerleri örneğe yazmayın; yalnız `config.php` içine yazın.

`key_pepper` en az 32 karakterdir. `encryption_key` 64 onaltılık karakterdir, yani 32 bayttır. İkisini sunucuda üretin ve sohbete, bilete veya depoya yapıştırmayın:

```bash
php -r 'echo bin2hex(random_bytes(24)), "\n";'
php -r 'echo bin2hex(random_bytes(32)), "\n";'
```

DSN örneği, gerçek hesap önekini kendi cPanel adınızla değiştirerek:

```text
mysql:host=localhost;dbname=KULLANICI_qrltest;charset=utf8mb4
```

`require_https` test kurulumunda da `true` kalır. `session_ttl` saniye cinsinden `43200`dır. `session_cookie` `qrl_session` kalır. HTTPS isteğinde çerez adı `__Host-qrl_session` olur. `trusted_proxies` boş kalır; cPanel PHP isteği doğrudan HTTPS görüyorsa vekil adresi eklenmez. Boş liste `X-Forwarded-Proto` ve `X-Forwarded-For` başlıklarını yok sayar.

Apache, ince girişe kurulum kökünü şöyle verir. Yolu kendi hesabınıza göre değiştirin. Bu satır WordPress kurallarının yerine geçmez; mevcut `.htaccess` dosyasının WordPress bloğunun üstüne eklenir. Bu depodaki site dosyasına bu satır yazılmamıştır.

```apache
SetEnv QR_LICENSE_HOME /home/KULLANICI/qr-license
SetEnv QR_LICENSE_CONFIG /home/KULLANICI/qr-license/backend/config.php
```

`QR_LICENSE_CONFIG` boşsa API, `backend/public` dizininin bir üstündeki `config.php` dosyasını arar. Dosya yine `public_html` dışında olmalıdır.

## HTTPS ve yönlendirme

Panel ile API aynı kaynaktadır. `lisans.js` istekleri sayfanın adresindeki `/api` yoluna gider. Ayrı bir API alan adı kullanılmaz.

İnce giriş yalnız şu yolları uygulamaya bırakır. Kurallar WordPress bloğundan önce gelir:

```apache
RewriteRule ^api(/|$) /qr-license-front.php [END,QSA]
RewriteRule ^v1(/|$) /qr-license-front.php [END,QSA]
RewriteRule ^wp-json/qmls(/|$) /qr-license-front.php [END,QSA]
```

`END` Apache 2.4 bayrağıdır. cPanel bunu destekler. Böylece WordPress’in kendi `index.php` kuralı bu üç yolu yeniden yazmaz. Diğer adresler WordPress’te kalır.

`/lisans/` için çerçeve başlığı paket dosyalarında yoktur. Alan adı HTTPS ile açıldıktan sonra, yalnız bu dizin için:

```apache
<Directory "/home/KULLANICI/public_html/lisans">
  Header always set Content-Security-Policy "frame-ancestors 'none'"
  Header always set X-Frame-Options "DENY"
</Directory>
```

Bu blok bu turda sunucuya uygulanmamıştır. `mod_headers` kapalıysa başlık yazılmaz.

## Erişim koruması

Koruma, `backend/src` dosyasının belge kökünde olmamasıdır. `qr-license-front.php`, `QR_LICENSE_HOME` belge kökünün içindeyse veya `backend/public/index.php` bulunamazsa uygulamayı yüklemez ve gövdeye `server_error` yazar. Dosya yolu basmaz.

Belge kökünde bulunmaması gerekenler: `backend/src`, `backend/migrations`, `backend/config.php`, `backend/config.example.php`, `backend/bin`, `backend/tests` ve denetim araçları. SQL dosyası belge köküne konursa indirilebilir. `.htaccess` bu yerleşimin yerine geçmez.

Yanlışlıkla kopyalanan bir `backend` dizini için yedek Apache kuralı örnektir ve bu turda uygulanmamıştır:

```apache
<Directory "/home/KULLANICI/public_html/backend">
  Require all denied
</Directory>
```

Dizin listelemeyi kapatın: `Options -Indexes`.

## Yönetici hesabı

SSH veya cPanel Terminal açın. Parolayı komutun yanına yazmayın. Standart girdiden okunur. Kullanıcı adı `A-Z`, `a-z`, `0-9`, nokta, alt çizgi ve tireden oluşur; en fazla 64 karakterdir. Parola 12 ile 128 karakter arasındadır.

```bash
cd /home/KULLANICI/qr-license
export QR_LICENSE_CONFIG=/home/KULLANICI/qr-license/backend/config.php
php backend/bin/create-admin.php paneltest
```

Komut parolayı soracak biçimde girdiyi bekler. Başarı çıktısı `Yönetici oluşturuldu.` olur. Aynı kullanıcı yeniden oluşturulursa çıktı `Yönetici oluşturulamadı.` olur ve ayrıntı basılmaz. Kısa parola ve argüman olarak verilen parola da aynı genel hatayı verir.

`create-admin.php` belge kökünde çalıştırılırsa HTTP 404 döner. Dosyayı `public_html` içine koymayın.

Panel adresi `https://alanadiniz/lisans/` olur. `require_https` açıkken düz HTTP girişi `https_required` döner.

## Bu belgenin yapmadığı işler

Canlı saat dilimi, canlı HMAC indeksi, üretim pepper’ı ile açma, güvenilen sertifikanın ölçümü, trafik kesimi ve aktarım bu belgede yapılmaz. Test veritabanı boş açılır. Üretim lisans kayıtları içe aktarılmaz.
