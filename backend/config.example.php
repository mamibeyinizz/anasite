<?php
/**
 * Örnek yapılandırma. Bu dosyayı config.php olarak kopyalayın.
 * config.php public/ dışında kalır ve depoya girmez.
 * Parola, pepper ve şifreleme anahtarı buraya yazılmaz.
 *
 * cPanel'de config.php, public_html dışında durur ve izni 0600 olur.
 * Tercih edilen yol QR_LICENSE_CONFIG ortam değişkenidir.
 * Bu örnekteki boş alanlara gerçek parola veya anahtar yazmayın.
 */
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
	$script = isset($_SERVER['SCRIPT_FILENAME']) ? (string) $_SERVER['SCRIPT_FILENAME'] : '';
	if ($script !== '' && realpath($script) === __FILE__) {
		http_response_code(404);
		exit;
	}
}

return array(
	'db'              => array(
		'dsn'      => 'mysql:host=127.0.0.1;dbname=qr_license;charset=utf8mb4',
		'user'     => '',
		'password' => '',
	),
	// En az 32 karakter. Üretimde rastgele üretin; buraya gerçek değer koymayın.
	'key_pepper'      => '',
	// Lisans cevaplarını imzalayan Ed25519 gizli anahtar (base64). Üret: php backend/bin/gen-signing-key.php
	// Açık karşılığı eklentideki QRMS_License_Client::PUBLIC_KEY ile aynı olmalı. Boşsa cevap imzasız gider ve
	// eklenti lisansı ASLA doğrulayamaz. Yedekleyin; depoya girmez.
	'license_signing_key' => '',
	// 64 hex karakter (32 bayt). Üretimde rastgele üretin; buraya gerçek değer koymayın.
	'encryption_key'  => '',
	// Üretimde true kalır. Çerez Secure olur ve giriş yalnız HTTPS ile açılır.
	'require_https'   => true,
	'session_ttl'     => 43200,
	'session_cookie'  => 'qrl_session',
	// Boş liste: X-Forwarded-Proto ve X-Forwarded-For yok sayılır.
	'trusted_proxies' => array(),
	// Site Cloudflare vb. arkasındaysa tüm kullanıcılar tek uç adresi gibi görünür ve hız sınırları birbirini
	// engeller. trusted_proxies'e vekil adreslerini yazın ve gerçek IP başlığını belirtin (örn. Cloudflare:
	// 'HTTP_CF_CONNECTING_IP'). Başlık yalnızca doğrudan eş trusted_proxies'teyse okunur. Boş: kapalı.
	'real_ip_header'  => '',
	// Takip uç noktası yalnızca bu alan adlarından gelen Origin'leri kabul eder (boş: kontrol yok).
	'site_hosts'      => array('qrmenuofficial.com', 'www.qrmenuofficial.com'),
	// Rapor günlerinin saat dilimi (UTC'den saat farkı). Türkiye: 3.
	'tz_offset_hours' => 3,
	// Müşteri hesabı oturumu (saniye) ve çerez adı. Güvenli bağlantıda çerez __Host- önekiyle yazılır.
	'customer_session_ttl' => 2592000,
	'customer_cookie'      => 'qrc_session',
	// Varsayılan false (anahtar yoksa da kapalı). true: /odeme/ test modunda; giriş yapmış müşterinin test siparişi hesabına kaydedilir.
	// Gerçek ödeme sağlayıcısı bağlandığında false yapın (siparişleri sağlayıcı bildirimi oluşturur).
	'test_orders'          => false,
	// Hesap e-postaları (doğrulama, parola sıfırlama): bağlantıların kökü ve gönderen adres.
	// PHP mail() kullanılır; barındırmada çalıştığını bir hesap açıp kontrol edin (SPF/DKIM önerilir).
	'site_url'             => 'https://qrmenuofficial.com',
	'mail_from'            => 'no-reply@qrmenuofficial.com',
	// Yalnız geliştirme/test: dolu ise e-postalar gönderilmez, bu dosyaya yazılır. Üretimde boş bırakın.
	'mail_file'            => '',
	// Analitik verisinin saklama süresi (gün). bin/prune.php bu süreyi aşanları siler.
	'retention_days'  => 180,
	// Site dosyalarının kökü (boşsa backend/'in bir üstü).
	'site_root'       => '',
);
