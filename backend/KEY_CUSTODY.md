# Gizli anahtarların saklanması ve geri yüklenmesi

Bu not üretim sırlarını içermez. `key_pepper` ve `encryption_key` için gerçek değer henüz bu depoda yoktur. Bu dosya değer üretmez ve mevcut bir yapılandırmayı değiştirmez.

## Nereden yüklenir

`backend/public/index.php` yapılandırmayı şu sırayla okur:

1. `QR_LICENSE_CONFIG` ortam değişkenindeki PHP dosyası.
2. Değişken boşsa `backend/config.php`.

Dosya `backend/public/` altında değildir. Web kökü `backend/public/` olmalıdır. Kök `backend/` veya depo kökü olursa `config.php` indirilebilir.

`backend/config.example.php` kopyalanıp `config.php` yapılır. Örnekteki `key_pepper`, `encryption_key` ve veritabanı parolası boştur. `.gitignore` `config.php`, `.env` ve `backups/` yollarını dışlar.

## Doğrulama

`QRLicense\License\Keys` kurucusu iki kural uygular:

- `key_pepper` en az 32 karakter olmalıdır.
- `encryption_key` tam 64 onaltılık karakter olmalıdır. Bu, 32 baytlık AES-256 anahtarına çözülür.

Eksik dosya, boş pepper veya geçersiz şifreleme anahtarı istisna fırlatır. Süreç yeni pepper veya yeni şifreleme anahtarı üretmez. `index.php` istisnai durumda HTTP 500 ve `{"status":"error","error":"server_error"}` döner. Günlük satırında yalnız istisna sınıfı vardır; yapılandırma değeri yazılmaz.

## İki değerin farklı etkisi

`key_pepper`, lisans anahtarının HMAC-SHA256 arama özetini üretir. Doğrulama kaydı bu özete göre bulur. Pepper değişirse mevcut `api_key_hmac` değerleri eşleşmez. Eski anahtarlar `404` ve `{"status":"invalid"}` alır. Şifreli kopya durur; görüntüleme özet uyuşmadığı için `key_unavailable` döner.

`encryption_key` AES-256-GCM ile saklanan anahtarı açar. Doğrulama bu anahtarı çözmez. Şifreleme anahtarı değişirse HMAC aynı kaldığı sürece doğrulama sürer. Görüntüleme ve maske çözülemez. Yeni kayıtlar yeni anahtarla yazılır; eski satırlar açılamaz.

İkisi birlikte değişirse eski anahtar ne doğrulanır ne görüntülenir. Firma, modül, domain ve süre satırları tabloda kalır. Yerinde dönüşüm, aynı düz anahtardan yeni HMAC ve yeni şifreli kopyayı birlikte yazan ayrı bir geçiş gerektirir. Bu depoda böyle bir geçiş yoktur.

## Yedek

1. Üretim `config.php` dosyasını oluşturun. Değeri sohbet, bilet, e-posta veya Git’e yazmayın.
2. Dosya izinlerini `600` yapın. Sahibi yalnız uygulama kullanıcısı olsun.
3. Aynı dosyanın ikinci kopyasını web kökünün ve Git deposunun dışında tutun. Parola kasası veya çevrimdışı disk uygundur.
4. Yedek, çalışan kopyayla bayt bayt aynı olmalıdır. Pepper ile şifreleme anahtarı ayrı ayrı yenilenmez.
5. `backend/backups/` Git’e girmez; yine de tek kopya olarak kullanmayın. Bu dizin sunucu diskindedir.

## Geri yükleme

1. Lisans yazma işlemlerini durdurun.
2. Çalışan `config.php` dosyasını, web kökü dışında saklanan kopyayla değiştirin.
3. `QR_LICENSE_CONFIG` kullanılıyorsa süreç bu yolu okusun.
4. Uygulamayı yeniden başlatın.
5. Bilinen bir lisansla `POST /v1/validate` çağırın. Beklenen durum, aktarımdan önce kaydedilen durumla aynı olmalıdır.
6. Yönetim panelinden aynı lisansın anahtarını görüntüleyin. Çözülen değer, müşterideki anahtarla aynı olmalıdır. Değeri günlüğe yazmayın.
7. Doğrulama `invalid` ve görüntüleme `key_unavailable` ise yedek, kayıtların yazıldığı anahtar çifti değildir. Başka bir kopya arayın. Yeni pepper üretmek eski kayıtları geri getirmez.

## Kurtarma provası

Provayı canlı veritabanında yapmayın.

1. Boş bir SQLite veya geçici MySQL veritabanı açın.
2. En az 32 karakterlik bir pepper ve 64 onaltılık karakterlik bir şifreleme anahtarı içeren deneme `config.php` dosyası yazın.
3. Bir deneme lisansı oluşturun. Düz anahtarı yalnız prova süresince bellekta tutun.
4. `config.php` dosyasını prova dizinine kopyalayın.
5. Çalışan dosyadaki pepper’ı değiştirip doğrulamayı çağırın. Sonuç `invalid` olmalıdır.
6. Şifreleme anahtarını değiştirip pepper’ı eski haline getirin. Doğrulama `active` kalmalı, görüntüleme `key_unavailable` olmalıdır.
7. Yedek kopyayı geri koyun. Doğrulama ve görüntüleme yeniden başarılı olmalıdır.
8. Pepper’ı boşaltıp süreci başlatın. HTTP 500 ve `server_error` gelmeli; yanıtta yeni bir anahtar olmamalıdır.
9. Deneme dosyalarını ve deneme veritabanını silin.

## Canlıya geçiş öncesi saat dilimi

Üretim PHP `date.timezone` değeri ile WordPress `timezone_string` ve `gmt_offset` ayarları okunmadan aktarım onayı verilmez. Eski süre hesabı `strtotime` ile PHP saat dilimini kullanır. Yeni backend bitişi, kayıtlı günün `23:59:59 UTC` anıdır. Bu iki saat dilimi bu depoda yoktur. Bu dosya onları değiştirmez ve üretim değeri bilinmeden aynı anda dolduklarını varsaymaz.
