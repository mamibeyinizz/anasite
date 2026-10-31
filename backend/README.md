# Backend (PHP + MySQL): yönetim paneli, ziyaretçi takibi, blog, lisans sunucusu

Statik site aynen kalır; bu klasör yalnızca `/api/*`, `/blog…`, `/v1/validate` ve
`/wp-json/qmls/v1/validate` yollarını sunar (kök `.htaccess` yönlendirir). Gereksinim:
PHP 8.1+ (PDO MySQL, openssl, mbstring, GD+WebP), MySQL 5.7+/MariaDB 10.4+, Apache/LiteSpeed (`mod_rewrite`).

## Kurulum

1. Siteyi PHP destekli hostinge yükleyin (kök `.htaccess` dahil). **Nginx** kullanıyorsanız `.htaccess` kurallarını
   `location` karşılıklarına çevirin ve `backend/` ile `*.sql` dosyalarını dışarıya kapatın.
2. Boş bir MySQL veritabanı + yalnızca ona yetkili kullanıcı açın.
3. `backend/config.example.php` → **belge kökü dışında** bir yere `config.php` olarak kopyalayın (izin 0600), değerleri doldurun
   (`key_pepper` ≥32 karakter, `encryption_key` 64 hex: `php -r 'echo bin2hex(random_bytes(32));'`).
   Yol: ortam değişkeni `QR_LICENSE_CONFIG` (cPanel'de `.htaccess` içine `SetEnv QR_LICENSE_CONFIG /home/KULLANICI/qr-config.php`).
   **pepper ve encryption_key'i yedekleyin; kaybolursa lisans anahtarları çözülemez.**
4. Tabloları kurup yönetici oluşturun (parola stdin'den, ≥12 karakter; tarayıcıdan yönetici oluşturulmaz):
   `echo 'PAROLA' | php backend/bin/install.php kullanici`
5. Mevcut blog yazılarını veritabanına alın: `node backend/bin/export-posts.mjs && php backend/bin/import-posts.php`
   (yazılar `backend/data/posts.json` olarak depoda; Node yoksa dosya hazırdır, yalnızca ikinci komutu çalıştırın).
6. Günlük temizlik cron'u (saklama süresi `retention_days`, varsayılan 180 gün): `17 3 * * * php /yol/backend/bin/prune.php`
7. `https://alanadi/yonetim/` adresinden giriş yapın. Giriş yalnızca HTTPS ile açılır (`require_https`).

## Yönetim paneli (`/yonetim/`)

- **Genel bakış / Canlı:** ziyaretçi, oturum, sayfa görüntüleme, tıklama, süre, çıkış oranı, önceki dönemle kıyas, kaynaklar, cihaz/tarayıcı/OS/ülke, utm.
- **Ziyaretçiler / Oturumlar:** kim, nereden, hangi cihazla geldi; oturum içi adım adım gezinti akışı. Bir ziyaretçinin verisi tek tıkla silinebilir (KVKK silme talebi).
- **Gezilen sayfalar / Tıklamalar / Olay akışı:** sayfa bazında görüntüleme, ortalama süre ve kaydırma; en çok tıklanan düğme ve bağlantılar.
- **Blog yazıları:** taslak/yayın, kapak yükleme (1200/720/OG otomatik), SSS/kaynak/ilgili çözümler, SEO alanları, önizleme. Yayınlanan yazı anında `/blog/`, `sitemap-blog.xml` ve `blog/feed.xml` içinde görünür.
- **Lisanslar:** oluştur/düzenle, paket şablonları, anahtarı göster/yeniden üret, domain kilidini kaldır, arşivle, aktivite geçmişi.

## Ziyaretçi takibi

`global/src/analytics.js` (tüm sayfalarda, `node global/build.mjs` ile paketlenir) çerez onay çubuğunu gösterir.
**Onay yoksa tarayıcıda kimlik üretilmez, sunucuya istek gitmez.** DNT/GPC açıksa çubuk da çıkmaz. Onayla: sayfa görüntüleme,
tıklanan bağlantı/düğme etiketi, kaydırma derinliği, etkin süre → `POST /api/collect`. Form içeriği ve tuş vuruşu okunmaz.
Bot UA'ları, yanlış `Origin` ve IP başına 120 istek/dk üstü atılır. Yasal metinler (`yasal/legal-data.mjs`) bu davranışı anlatır;
kapsam, saklama süresi veya veri alanları değişirse metinler aynı değişiklikte güncellenmelidir.
Ülke için CDN başlığı (`CF-IPCountry`) gerekir; yoksa ülke boş kalır.

## Blog

İçerik veritabanındadır. Sayfalar `BlogView.php` ile `blog/build.mjs` şablonuyla aynı HTML'i üretir; header/footer
`global/dist/partials/*` dosyalarından gelir (global header değişince `node global/build.mjs` çalıştırıp commit'leyin).
Veritabanı erişilemezse depodaki statik `blog/**/index.html` çıktısı sunulur. `blog/posts.mjs` artık kaynak değildir (yalnızca ilk içe aktarma);
`node blog/build.mjs` statik yedeği yeniler.

## Lisans sunucusunu WordPress'ten aktarma

Anahtarlar aynen korunur, müşteri eklentilerinde değişiklik gerekmez; eski adres `/wp-json/qmls/v1/validate` çalışmaya devam eder.

1. Eski WP sitesinde: `wp eval-file wp-content/plugins/qr-menu-license-server/tools/qmls-export.php > ~/lisanslar.json`
2. Yeni sistemde: `php backend/bin/import-wp-licenses.php ~/lisanslar.json --dry-run`, sonra `--dry-run` olmadan.
3. Dosyayı silin (düz API anahtarı içerir). Alan adı yeni sunucuya yönlendiğinde müşteri sitelerine dokunmanız gerekmez.

Not: İstemci eklentisi `domain` karşılaştırmasını `www.`/protokol/port farklarını yok sayarak yapar (WP'deki kuralla aynı); kayıtlı domainler normalize edilerek aktarılır.

## Test

`php -S 127.0.0.1:8080 -t . backend/tests/dev-router.php` (`require_https => false` yapılandırmasıyla, boş bir test veritabanında), sonra
`ADMIN_PASS=… backend/tests/smoke.sh`: takip, analitik, blog CRUD + XSS temizliği, lisans doğrulama ve erişim kapalılığını doğrular.
