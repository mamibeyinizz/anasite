<?php
/**
 * Lisans imza anahtar çifti üretir (Ed25519).
 * Kullanım: php backend/bin/gen-signing-key.php
 * GİZLİ anahtarı config.php'deki 'license_signing_key' alanına, AÇIK anahtarı eklentideki
 * QRMS_License_Client::PUBLIC_KEY sabitine yazın. Gizli anahtarı yedekleyin, kimseyle paylaşmayın.
 */
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
	exit(1);
}
$pair = sodium_crypto_sign_keypair();
echo 'license_signing_key (GIZLI): ' . base64_encode(sodium_crypto_sign_secretkey($pair)) . PHP_EOL;
echo 'PUBLIC_KEY (eklentiye)     : ' . base64_encode(sodium_crypto_sign_publickey($pair)) . PHP_EOL;
