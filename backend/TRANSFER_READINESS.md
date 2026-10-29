# Lisans aktarım hazırlığı

Tarih: 24 Ekim 2026, 17:18 TSİ. İlk kural metni 16:11 TSİ’de yazıldı. 16:30 TSİ’de yinelenen hedef HMAC, boşluktan ibaret anahtar ve istemci sürümü kuralları sıkılaştırıldı. 17:18 TSİ’de geçersiz UTF-8 anahtarlar manuel incelemeye alındı ve sayaç bütünlüğü yeniden doğrulandı.

Bu not, eski WordPress lisans eklentisindeki `qmls_license` kayıtlarının bağımsız PHP lisans sunucusuna nasıl sınıflanacağını kilitler. Kaynak kod, şema, sentetik testler ve `backend/bin/license-audit.php` incelendi. Gerçek lisans satırı okunmadı, üretim veritabanına bağlanılmadı ve aktarım yapılmadı. Depoda bir içe aktarma komutu yoktur; bu aşama da eklemedi.

Saat dilimi onayı verilmedi. `TransferAudit::format` her çıktıda `saat_dilimi_onayi: verilmedi` basar. Bu, ayrı ve zorunlu bir geçiş ön koşuludur.

## Alan eşleştirme

Eski kayıt bir WordPress yazısıdır. Post türü `qmls_license`, başlık firma adıdır. Yeni karşılık `licenses` satırı ve `license_modules` satırlarıdır. HMAC, düz anahtarın `hash_hmac('sha256', düz_anahtar, pepper)` değeridir. Eski veride pepper yoktur.

| Eski kaynak | Yeni alan | Aktarım kuralı |
| --- | --- | --- |
| `post_title` | `licenses.company_name` `VARCHAR(191)` | Kırpılır. Boş, 191 karakterden uzun veya C0/DEL denetim karakteri içeren başlık manueldir. |
| `post_status` | Karşılık yok | Yalnız `publish` otomatik adaydır. `trash`, `draft`, `private` ve diğer durumlar `post_status` nedenidir. `archived_at` bu durumdan üretilmez. |
| `api_key` | `licenses.api_key_hmac` `CHAR(64)` | Geçerli UTF-8 olan tek değer HMAC’ye çevrilir. Boş dize, yalnızca boşluk ve geçersiz UTF-8 `source_key` olur. Baytlar kırpılmaz, silinmez ve yeniden kodlanmaz. Kenar boşluğu anahtarın parçasıdır. 40 karakter veya yalnızca onaltık biçim aranmaz. Düz anahtar hedefe yazılmaz. Denetim aracı `api_key_encrypted` üretmez. |
| `domain` | `licenses.domain` `VARCHAR(191) NULL` | Meta anahtarı yoksa manueldir. Kayıtlı boş dize, kilit yok anlamına gelir ve `NULL` olur. İki normalleştirici aynı sonucu vermeli ve sonuç 191 karakteri aşmamalıdır. |
| `durum` | `licenses.status` `ENUM('aktif','pasif')` | Yalnız tek değer ve tam olarak `aktif` veya `pasif`. |
| `start_date` | `licenses.starts_on` `DATE NULL` | Meta yoksa veya boş dizeyse `NULL`. Biçimi bozuk ya da takvimde olmayan değer manueldir. |
| `expires_at` | `licenses.expires_on` `DATE NULL` | Aynı tarih kuralı. Saklanan değer takvim günüdür. Bitiş anı aşağıda ayrı koşuldur. |
| `amount_paid` | `licenses.amount_paid` `VARCHAR(64)` | En çok 64 karakter. Denetim karakteri manueldir. |
| `notlar` | `licenses.notes` `TEXT` | En çok 4000 karakter. Satır sonu ve sekme kalır. Diğer C0/DEL karakterler manueldir. |
| `allowed_modules` | `license_modules.module_slug` | Tek serileştirilmiş liste. Bilinen slug’lar yinelenirse teke iner ve sabit sıraya dizilir. Bilinmeyen slug kaydın tamamını manuel yapar. |
| `client_version` | `licenses.client_version` `VARCHAR(32)` | Boş dize aday kalır. Yalnızca boşluk, baştaki veya sondaki boşluk, C0/DEL, 32 baytı aşan uzunluk ve geçersiz UTF-8 `field_length` olur. Değer kırpılmaz, karakter silinmez ve kesilmez. Ortadaki boşluk korunur. |
| `last_seen` | `licenses.last_seen_at` | Taşınmaz. Hedefte `NULL` kalır. Unix damga saat dilimine bağlıdır. |
| `_qmls_audit_log` | `audit_events` | Taşınmaz. Eski günlük en çok 50 kayıttır ve okuma sorgusu onu seçmez. |
| `qmls_tiers` option | `licenses.tier_slug` | Taşınmaz. Modüller `allowed_modules` değerinden kopyalanır. Eşleşme için hedef `tier_slug` boş olmalıdır. |
| `post_date`, `post_modified` | `created_at`, `updated_at` | Okunmaz. İleride bir yazım olursa bu iki an açıkça UTC yazılır. |

On üç modül slug’ı iki tarafta aynıdır: `restoran-menu`, `yorum-feedback`, `qr-masa`, `qr-analiz`, `qr-galeri`, `qr-ceviri`, `qr-chatbot`, `qr-calisma-saatleri`, `qr-masa-oturum-guvenligi`, `qr-acilis-ekrani`, `header-footer-builder`, `qr-menu-muhendisligi`, `qr-servis-paneli`. Eski `get_modules()` süzgeci çalışma anında listeyi değiştirebilir. Denetim, veritabanındaki saklı listeyi okur ve bu sabit kümeyle karşılaştırır.

Eski paket şablonları lisans satırında durmaz. `baslangic`, `pro` ve `kurumsal` seçimi kaydedilirken `allowed_modules` yazılır. Yeni `tier_slug` bu yüzden aktarımda boş kalır.

## Karar kuralları

Sınıflandırıcı üç sayaç döndürür. Dördüncü bir sayaç yoktur. Her manuel neden, otomatik aktarım için güvenli olmayan kayıt demektir. Onarım değeri uydurulmaz.

Üç sayaç birbirini dışlar. Her kaynak kayıt tam olarak birine girer:

`eklenebilir + zaten_mevcut + manuel_inceleme = kaynak kayıt sayısı`

Hedef satırı bu toplama girmez. Kaynakta karşılığı olmayan hedef, tekil de olsa yinelenen de olsa, kaynak kaydının kovasını değiştirmez. Yinelenen hedef HMAC yalnız o özete sahip kaynak kayıtları manuel yapar.

### Otomatik aktarılabilir (`eklenebilir`)

Aşağıdakilerin hepsi birlikte geçerlidir:

- Yazı durumu `publish`.
- `durum` metası vardır, tek değerdir ve `aktif` ya da `pasif`tir.
- `api_key` metası vardır, tek değerdir, boş değildir, yalnızca boşluktan oluşmaz, geçerli UTF-8’dir ve aynı düz anahtar kaynak kümesinde başka yazıda yoktur. Çöp ve taslak da bu kümeye girer. Değer kırpılmaz ve yeniden kodlanmaz. 40 karakter veya onaltık biçim şartı yoktur.
- `domain` meta anahtarı vardır. Değer boşsa hedef kilit `NULL` olur. Değer doluysa eski ve yeni normalleştirici aynı sonucu verir ve sonuç en çok 191 karakterdir.
- Başlangıç ve bitiş ya yoktur, ya boştur ya da gerçek bir `Y-m-d` günüdür. İkisi de doluysa bitiş günü başlangıçtan önce değildir.
- `allowed_modules` tek ve güvenli bir serileştirilmiş listedir. Listedeki her slug bilinen on üçlü kümededir.
- Firma, ücret ve not uzunluk sınırına uyar. İstemci sürümü boş olabilir. Doluysa 32 baytı aşmaz, C0/DEL taşımaz, geçersiz UTF-8 değildir ve başında veya sonunda boşluk yoktur. Ortadaki boşluk olduğu gibi kalır.
- Düz anahtarın HMAC’i hedefte yoktur. Hedefte birden fazla aynı HMAC varsa kayıt bu kovaya girmez.

Süresi takvim olarak geçmiş, geçerli bir `Y-m-d` bu kovaya girebilir. Süre dolmuş olmak tek başına manuel neden değildir. Boş veya hiç yazılmamış tarih süresiz `NULL` olur.

### Hedefte zaten mevcut (`zaten_mevcut`)

HMAC hedefte tam bir satırda vardır, o satır arşivli değildir, `tier_slug` boştur ve firma, normalleştirilmiş domain, durum, tarihlerin gün kısmı, ücret, not, istemci sürümü ve sıralı modül listesi aynıdır. Başka bir neden yoktur. Sayaç artar ve yazma yapılmaz. `last_seen_at`, `created_at` ve `updated_at` eşitliğe girmez.

Bu sonuç, `api_key_encrypted` alanının çözülebildiği anlamına gelmez. Sınıflandırıcı şifreli kopyayı okumaz ve `encryption_key` yüklemez. Aynı HMAC ile alanları tutan bir satır, şifreli kopyası bozuk olsa da `zaten_mevcut` kalır. Görüntüleme ancak doğru `encryption_key` ile açılır. Sentetik turda bir anahtar kendi şifresini açar; ikinci şifreleme anahtarı aynı gövdeyi açamaz. Bu deneme `zaten_mevcut` sayacını değiştirmez.

### Manuel inceleme gerekli (`manuel_inceleme`)

Herhangi bir neden varsa kayıt bu kovadadır. Bir kayıt birden fazla neden taşıyabilir. Toplam, kayıt sayısıdır; neden sayıları üst üste binebilir.

### Güvenli biçimde aktarılamaz

Bu, `manuel_inceleme` ile aynı kayıtlardır. Otomatik iş şunları yapmaz:

- Bilinmeyen durumu `aktif` saymak. Eski `sanitize_status` bunu yapar; denetim yapmaz.
- Geçersiz tarihi boşaltıp süresiz saymak. Eski `sanitize_date` bunu yapar; denetim yapmaz.
- Bilinmeyen modülü listeden atmak. Eski `sanitize_modules` bunu yapar; denetim kaydı bütünüyle ayırır.
- `trash` yazısını `archived_at` yapmak.
- Hedefteki farklı lisansın üzerine yazmak.
- Yinelenen HMAC içinden son satırı veya alanları aynı görünen satırı seçmek.
- Boşluktan ibaret anahtarı kırpıp boşaltmak.
- Sürümün kenar boşluğunu, denetim karakterini veya fazla baytını silmek.

Eski yönetim ekranında kaydı açıp kaydetmek de bu dönüşümleri veritabanına yazar. Denetimden önce eski ekrandan toplu kayıt yapılmaz. Denetim, saklı metayı görür.

## Durumların ele alınışı

Eksik veya yinelenen lisans anahtarı. Meta yoksa, satır yoksa, boş dizeyse, yalnızca boşluktan oluşuyorsa, geçerli UTF-8 değilse veya aynı yazıda birden fazla farklı değer varsa neden `source_key` olur ve kayıt `manuel_inceleme` kovasına girer. Geçersiz UTF-8 baytları silinmez, yerine karakter konmaz ve HMAC karşılaştırmasına girmez. Yalnızca boşluk olan değer kırpılmaz. Başındaki veya sonundaki boşluk da silinmez; `kenar ` ile `kenar` farklı anahtarlardır ve ikincisinin hedef kaydı birincisini `zaten_mevcut` yapmaz. Üretici 40 onaltık karakter üretir. Eski kayıtlarda bu biçimin tek şekil olduğuna dair kanıt yoktur. Sınıflandırıcı 40 karakter veya onaltık zorunluluğu koymaz.

İstemci sürümü. Boş dize adaydır. Yalnızca boşluk, baştaki veya sondaki boşluk, C0/DEL, 32 bayttan uzun değer ve geçersiz UTF-8 `field_length` olur. Sınıflandırıcı sürümü kırpmaz, denetim karakterini silmez ve uzunluğu kesmez. `1.0 beta` içindeki boşluk korunur ve başka engel yoksa aday kalır.

Yinelenen kaynak anahtarlar. Aynı düz anahtar birden fazla yazıda geçiyorsa, yazılardan biri çöpte olsa bile hepsi `source_key` alır. Bir tanesi seçilmez.

Eksik domain metası ve boş domain. Meta anahtarı hiç yoksa neden `domain_meta_missing` olur ve eşlenen alan üretilmez. Meta vardır ve değer `''` ise bu, kilitsiz lisanstır; başka engel yoksa otomatik adaydır ve hedef `domain` `NULL` olur. Birden fazla farklı domain değeri `domain_normalize` olur.

Bilinmeyen lisans durumları. `durum` yoksa, çok değerliyse veya `aktif`/`pasif` dışında bir şeyse neden `status` olur. `active`, `1` ve boş dize bu kapsamdadır.

Bilinmeyen modül slug’ları. Liste eksikse, birden fazla serileştirilmiş satır varsa, nesne enjeksiyonu izi (`O:` veya `C:`) taşıyorsa ya da bilinen kümenin dışında bir slug varsa neden `modules` olur. Bilinen bir slug’ın tekrarı atılır ve kayıt bu yüzden manuel olmaz.

Geçersiz veya belirsiz bitiş tarihleri. `Y-m-d` kalıbına uymayan, `2026-02-31` gibi takvimde olmayan veya aynı yazıda çelişen değerler `invalid_date` olur. `2026-05-01 00:00:00` de bu kalıba uymaz. Meta yokluğu ve boş dize geçersiz değildir; ikisi de süresiz `NULL` olur. İki geçerli gün varsa ve bitiş başlangıçtan küçükse neden `date_order` olur. Saat dilimi belirsizliği bir tarih biçimi hatası değildir. Gün dizgisi olduğu gibi kalır ve aşağıdaki onay koşuluna bağlıdır.

`trash` durumundaki kayıtlar. `publish` dışındaki her durum `post_status` nedenidir. Çöp kaydı arşive çevrilmez ve yayındaki kopyayla aynı anahtarı paylaşıyorsa iki kayıt da otomatik aday olmaktan çıkar.

Hedefte aynı lisansın bulunması. HMAC hedefte bir kez geçer ve eşlenen alanlar aynıysa `zaten_mevcut` sayılır. İkinci kez eklenmez. Bu sayaç şifreli kopyanın açıldığını göstermez.

Aynı anahtarın farklı lisanslara karşılık gelmesi. HMAC bir kez eşleşir ve firma, domain, durum, tarihler, ücret, not, sürüm veya modüller farklıysa neden `target_hmac_mismatch` olur. Hedef arşivliyse veya `tier_slug` doluysa alanlar aynı görünse de aynı nedene düşer. Üzerine yazılmaz.

Hedefte yinelenen HMAC. Aynı HMAC iki veya daha fazla hedef satırında varsa hiçbir satır seçilmez. Son satır kazanmaz. Üç satırda da aynıdır: ortaya düşen farklı firma veya sonda duran eşleşen satır seçilmez, `target_hmac_mismatch` de artmaz. Alanlar birbirinin aynı olsa bile kaynak kayıt `target_hmac_duplicate` ile manueldir. Aynı kümedeki başka bir kaynak anahtarı kendi kuralına göre sayılmaya devam eder. Kaynakta karşılığı olmayan hedef, yinelenen olsa bile `eklenebilir`, `zaten_mevcut` ve `manuel_inceleme` sayaçlarını değiştirmez.

Eski anahtarların HMAC pepper uyumluluğu. Eski sistem düz anahtarı saklar. Yeni arama HMAC-SHA256 ile yapılır. Uyum, müşterideki düz anahtarın değişmeden kalması ve sunucunun onu aynı pepper ile özetlemesidir. Denetim pepper’ı en az 32 karakterlik ayrı bir dosyadan okur ve bu dosya, ileride sunucunun kullanacağı `key_pepper` ile aynı olmalıdır. `encryption_key` denetime girmez. Pepper sonradan değişirse eski anahtarlar `invalid` olur. Şifreleme anahtarı değişirse HMAC duruyorsa doğrulama sürebilir, görüntüleme `key_unavailable` olur. HMAC ile şifreli kopyayı birlikte yenileyen bir geçiş bu depoda yoktur.

Eski ve yeni bitiş anı. Saklanan değer her iki tarafta da takvim günüdür. Eski süre hesabı `strtotime($gün . ' 23:59:59')` ve `time()` kullanır; an, PHP’nin varsayılan saat dilimindedir. Eklenti `date_default_timezone_set` çağırmaz. Yeni `Validator::isExpired` günü `23:59:59 UTC` kabul eder ve bu saniye dahildir. Üretim PHP `date.timezone`, WordPress `timezone_string` ve `gmt_offset` okunmadı. İki anın aynı olduğu varsayılmaz. `Validator.php` başlığındaki eski cümle bu varsayımı taşıyordu; yorum, anın her zaman UTC olduğunu ve üretim değerleri okunmadan çakışma iddia edilmeyeceğini söyleyecek şekilde düzeltildi. Süre hesabının kendisi değiştirilmedi.

## Manuel inceleme nedenleri

| Neden | Ne zaman artar |
| --- | --- |
| `post_status` | Yazı durumu `publish` değildir. |
| `status` | `durum` eksik, çok değerli veya `aktif`/`pasif` dışındadır. |
| `source_key` | `api_key` eksik, boş, yalnızca boşluk, geçersiz UTF-8, çok değerli ya da kaynakta yinelenmiştir. Baytlar değiştirilmez. |
| `target_hmac_mismatch` | Aynı HMAC hedefte tam bir kez vardır; alanlar farklıdır, hedef arşivlidir veya `tier_slug` doludur. |
| `target_hmac_duplicate` | Aynı HMAC hedefte birden fazla satırdadır. Satır seçilmez. |
| `domain_meta_missing` | `domain` meta anahtarı yoktur. |
| `domain_normalize` | Domain çok değerlidir, iki normalleştirici ayrılır veya sonuç 191 karakteri aşar. `bad%20host` eski tarafta yüzde dizisini atar, yeni taraf atmaz. |
| `invalid_date` | Başlangıç veya bitiş biçimi belirsizdir ya da takvimde yoktur. |
| `date_order` | İki gün de geçerlidir ve bitiş başlangıçtan öncedir. |
| `modules` | Modül listesi eksik, birden fazladır, güvenli değildir veya bilinmeyen slug içerir. |
| `field_length` | Firma, ücret, not veya istemci sürümü sınıra uymaz. Sürümdeki boşluk kenarı, yalnızca boşluk, CR/LF ve geçersiz UTF-8 de buradadır. Değer değiştirilmez. |
| `snapshot` | Satır sayacı değildir. `START TRANSACTION READ ONLY` kurulamazsa araç sınıflandırmadan önce `snapshot_unavailable` ile durur. |
| `grants` | Satır sayacı değildir. `SHOW GRANTS` metni yalnız `SELECT` olduğunu göstermezse araç `grants_unverified` ile durur. |

Sentetik gösterim kümesi 24 kayıttır: 4 otomatik, 1 hedefte mevcut, 19 manuel. Bu küme kasıtlı örneklerden oluşur ve canlı sayım değildir. Yeni sürüm kuralı bu 24 kaydın sayaçlarını değiştirmez.

## Salt okunur denetim aracı

`backend/bin/license-audit.php` iki kip kabul eder: `synthetic` ve `audit`. `import`, `apply`, `write` ve `migrate` çıkış kodu 2 ve `hata_sinifi: komut` verir.

`audit` kipi `QR_LICENSE_CONFIG` ve `backend/config.php` okumaz. Bağlantı `QR_AUDIT_SOURCE` ve `QR_AUDIT_TARGET` JSON dosyalarından, pepper `QR_AUDIT_PEPPER_FILE` dosyasından gelir. Parola ve pepper argüman değildir. Kaynak ile hedef aynı veritabanıysa veya DSN çözülemezse bağlantıdan önce durur. Önek `^[A-Za-z0-9_]+$` dışındaysa reddedilir.

Lisans veritabanlarına giden SQL şunlardır:

- `SELECT ID, post_status, post_title` ve `SELECT post_id, meta_key, meta_value` kaynakta.
- `SELECT` `licenses` ve `license_modules` hedefte.
- `SHOW GRANTS FOR CURRENT_USER()`.
- `SELECT VERSION()`.
- `SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ`.
- `START TRANSACTION READ ONLY`.
- İş bitince `ROLLBACK`.

Bu dosyada `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP` veya `TRUNCATE` yoktur. Tek dosya yazımı, `QR_AUDIT_REPORT` mutlak yolunun depo dışında olması şartıyla sayaç metnini `0600` izinle yazmaktır. Depo içi rapor `rapor_yolu` ile reddedilir. Çıktı sayaç, motor adı ve sürümdür. Düz anahtar bellekte HMAC hesabı için durur ve basılmaz.

Yetki ayrıştırıcısı `SELECT` dışındaki ayrıcalığı ve `GRANT OPTION` ifadesini yazma sayar. Boş veya okunamayan yetki metni geçmez. Bu aşamada `audit` kipi hiçbir veritabanına karşı çalıştırılmadı.

## Güvenlik ve yedekleme

Bu aşama yedek almadı. İleride bir yazım kararı çıkarsa, yazımdan önce şunlar duruyor olmalıdır:

1. Yeni sunucunun `config.php` dosyası `600` izinli olur. Sahibi uygulama kullanıcısıdır. İkinci kopya web kökünün ve Git deposunun dışındadır. `key_pepper` ile `encryption_key` ayrı ayrı yenilenmez; yedek, çalışan dosyayla bayt bayt aynıdır.
2. Kaynak `wp_posts` ve `wp_postmeta` içindeki `qmls_license` kayıtlarının yazım öncesi kopyası alınır.
3. Hedef `licenses` ve `license_modules` tablolarının yazım öncesi kopyası alınır.
4. Denetim pepper dosyası, yedekteki `key_pepper` ile aynıdır.
5. Denetim iki kez çalışır ve sayaçlar aynıdır. Çıktıda anahtar, parola veya pepper görünmez.

Geri dönüş, var olmayan bir aktarım komutunun tersini çalıştırmak değildir. Yazım henüz yokken geri dönüş, eski ve yeni veritabanını olduğu gibi bırakmaktır. İleride bir yazım yapılır ve geri alınacaksa her iki veritabanı yazım öncesi kopyadan döner ve `config.php` bayt bayt yedekle değişir. Yeni pepper üretmek eski anahtarları geri getirmez. Doğrulama `invalid` ve görüntüleme `key_unavailable` ise yedek, kayıtların yazıldığı çift değildir.

## Geçiş öncesi zorunlu koşullar

Canlı ön koşullar bu depoda ve bu aşamada doğrulanmadı. Yazım aracı yazılmadan ve çalıştırılmadan önce:

1. Canlı ön koşul: üretim PHP `date.timezone`, WordPress `timezone_string` ve `gmt_offset` okunur. Bu depoda bu üç değer yoktur. Onay metni `verilmedi` kalır. Saat dilimi UTC varsayılmaz.
2. Denetim pepper dosyası, canlıda kullanılacak pepper ile aynıdır ve en az 32 karakterdir. Şifreleme anahtarı 64 onaltık karakterdir ve pepper ile birlikte yedeklenir.
3. Kaynak ve hedef farklı veritabanlarıdır.
4. İki kullanıcının `SHOW GRANTS` çıktısı, ilgili tablolarda yalnız `SELECT` olduğunu araçtan geçer.
5. İki bağlantıda `REPEATABLE READ` ve `START TRANSACTION READ ONLY` kurulur.
6. Canlı ön koşul: hedefte `uq_licenses_api_key_hmac` benzersiz indeksi vardır ve güncel HMAC tekrarı yoktur. Doğrulama, salt okunur oturumda `SHOW INDEX FROM licenses WHERE Key_name = 'uq_licenses_api_key_hmac'` satırının `Non_unique = 0` olduğunu ve `SELECT api_key_hmac FROM licenses GROUP BY api_key_hmac HAVING COUNT(*) > 1` sorgusunun boş döndüğünü görmektir. Bu iki sorgu bu aşamada çalıştırılmadı. İndeksin bugün durması, indeksten önce yinelenip sonra silinmiş HMAC kayıtlarının olmadığını kanıtlamaz. Sınıflandırıcı yalnız o an okunan listede duran ve bir kaynak kayda karşılık gelen yinelemeyi `target_hmac_duplicate` yapar.
7. Aynı denetim iki kez aynı sayaçları basar.
8. `manuel_inceleme` içindeki kayıtlar otomatik yazılmaz.
9. Eski yönetim ekranından, denetimi “temizlemek” için kayıt yenilenmez.

Durdurma ölçütleri: yetki yalnız `SELECT` değilse, anlık görüntü kurulamazsa, kaynak ile hedef aynı veritabanıysa, pepper kısa veya sunucu pepper’ından farklıysa, saat dilimi hâlâ okunmadıysa, benzersiz HMAC indeksi yoksa, iki denetim çıktısı farklıysa, çıktıda sayaç dışında gizli değer varsa veya operatör manuel bir kaydı otomatik yazmak istiyorsa geçiş durur.

## Test edilen noktalar

24 Ekim 2026, 17:18 TSİ’de `php backend/tests/transfer-audit.php` çalıştı. Sonuç: 80 kontrol, 0 hata, çıkış kodu 0. Aynı çalıştırmada `php backend/tests/run.php` 64 kontrol, `php backend/tests/licenses.php` 54 kontrol ve `php backend/tests/auth.php` 50 kontrol, hepsi 0 hata verdi. Bu üçü bellek içi SQLite kullanır. Yerel soketteki MariaDB 10.11.14 üzerinde `php backend/tests/transfer-audit-db.php` 28 kontrol, 0 hata verdi. Geçici `qrl_it_*` veritabanları ve geçici kullanıcı silindi. Üretim veritabanına bağlanılmadı. MySQL 8 bu aşamada çalıştırılmadı. Kapsam:

- Geçerli aktif, pasif, süresiz ve takvimi geçmiş lisansın otomatik sayılması.
- Eksik ve bilinmeyen durum.
- `publish`, `draft` ve `trash`.
- Boş domain metasının otomatik, eksik domain anahtarının manuel olması.
- `2026-02-31` için `invalid_date`.
- Bilinmeyen modülün atılmaması ve yinelenen bilinen modülün bir kez sayılması.
- Eksik anahtar ve iki kayıttaki aynı kaynak anahtarı.
- Aynı HMAC ve aynı alanlar için `zaten_mevcut`.
- Farklı firma, arşivli hedef ve dolu `tier_slug` için `target_hmac_mismatch`.
- Uzun firma, ücret, not ve sürüm.
- `1.0.0` artı CR/LF sürümünün `field_length` olması.
- Aynı alanlı iki hedef HMAC’in `zaten_mevcut` olmaması.
- Alanları farklı olan ikinci HMAC satırının seçilmemesi. Eşleşen satır sonda olsa da sonuç manueldir.
- Üç hedef satırında aynı HMAC varken ortaya düşen farklı firmanın ve sondaki eşleşen satırın seçilmemesi.
- Kaynakta karşılığı olmayan tekil ve yinelenen hedef satırlarının kaynak sayaçlarını değiştirmemesi.
- Boş anahtar, yalnızca boşluk, kenar boşluğu ve tek karakterlik geçerli anahtar.
- Geçersiz UTF-8 anahtarın `source_key` olması, geçerli anahtarla birleşmemesi ve `U+FFFD` karşılığına bağlanmaması.
- Yalnızca boşluk ve sekme ile satır sonundan oluşan anahtarın `source_key` olması ve hedefte `zaten_mevcut` sayılmaması.
- ` ab ` anahtarının kırpılmadan aday kalması.
- Yalnızca boşluk ve kenarında boşluk olan sürümün `field_length` olması. `1.0 beta` ve boş sürümün aday kalması.
- Sentetik anahtarın AES-256-GCM turu. Aynı pepper ile ikinci şifreleme anahtarı gövdeyi açmaz. `zaten_mevcut` bu açımdan bağımsızdır.
- Bir kayıtta birden fazla neden ve `date_order`.
- Gösterim sayaçlarının 4, 1, 19 ve toplam 24 kalması. İkinci çalıştırmanın aynı sonucu vermesi.
- HMAC’in şifreleme anahtarından bağımsız olması.
- `https://www.Example.com/yol` ve `www.Site.com:8080` için iki normalleştiricinin uyuşması. `bad%20host` için ayrılmaları.
- `SELECT` kabulü; `INSERT`, `ALL` ve `GRANT OPTION` reddi.
- Aynı veritabanı, farklı veritabanı ve belirsiz DSN.
- SQLite üzerinde salt okunur işlemin kurulamaması.
- Çıktıda `saat_dilimi_onayi: verilmedi` ve gösterim pepper’ının bulunmaması.
- `synthetic` komutunun iki kez aynı sayaçları basması.
- `import`, `apply`, `write`, `migrate` reddi.
- `QR_LICENSE_CONFIG` ile verilen PHP yapılandırmasının yüklenmemesi.
- Kısa pepper reddi ve depo içi rapor reddi.
- İsteğe bağlı raporun depo dışında ve `0600` olması.

## Test edilmeyen noktalar

- `license-audit.php audit` gerçek veya üretim veritabanına karşı çalıştırılmadı. Sentetik MariaDB provası ayrı geçici veritabanlarında `transfer-audit-db.php` ile yapıldı.
- MySQL 8 sentetik provası bu aşamada çalıştırılmadı.
- Üretim WordPress, cPanel, canlı veritabanı ve üretim yapılandırması okunmadı.
- Üretim saat dilimi değerleri alınmadı.
- Gerçek lisans anahtarı görüntülenmedi.
- İçe aktarma yoktur; yazım, geri alma ve yinelenen çalıştırma provası yapılmadı.
- `zaten_mevcut` kararı şifreli kopyayı açmaz. Açma ve açamama yalnız sentetik anahtarla denendi. Hedef satırındaki gerçek `api_key_encrypted` değeri okunmadı.
- `private` yazı durumu ayrı bir sentetik satırla denenmedi. Kod, `publish` dışındaki her durumu aynı nedene koyar; denenenler `draft` ve `trash`tir.

## Kalan riskler

Saat dilimi engelidir. Üretim PHP saat dilimi UTC değilse, aynı `Y-m-d` değeri iki sistemde farklı bir anda dolar. Gün dizgisini kopyalamak bu farkı kapatmaz. Onay verilmeden geçiş başlamaz.

`uq_licenses_api_key_hmac` indeksi canlı hedefte doğrulanmadı. İndeks bugün varsa bile, eskiden yinelenip silinmiş HMAC satırlarını göstermez. Kaynakta karşılığı olmayan güncel bir yineleme de `target_hmac_duplicate` sayacına girmez. Yazımdan önce hem indeks hem `GROUP BY api_key_hmac HAVING COUNT(*) > 1` boş sonucu salt okunur görülmelidir.

`api_key` kırpılmaz ve 40 onaltık biçim aranmaz. Bu, eski kayıtların biçimi kanıtlanmadığı için bilinçli bir karardır. Yalnızca boşluk ve geçersiz UTF-8 manueldir. Geçerli karakterin yanındaki boşluk anahtarın parçası olarak kalır.

`zaten_mevcut`, şifreli kopyanın açıldığını göstermez. Sentetik tur bunu ayırır. Canlı satırdaki şifreli kopya bu aşamada açılmadı.

`last_seen`, eski aktivite günlüğü, paket option’ı ve WordPress yazı tarihleri aktarılmaz. İleride yazılacak bir araç bunları uydurmaz.

Düz anahtar, ileride çalışacak bir `audit` sürecinin belleğinde durur. Çıktıya basılmaz. Süreç güvenilen makinede çalışır ve çekirdek dökümü açık bırakılmaz.

`SHOW GRANTS` ayrıştırıcısı metin tabanlıdır ve tanımadığı yetki satırında kapanır. Bu, yazmayı yanlışlıkla açmaz. Tanınmayan ama gerçekten salt okunur bir yetki metni ise denetimi durdurur. O durumda yetki daraltılır veya ayrıştırıcı sentetik metinle genişletilir. Canlı yetki metni bu aşamada görülmedi.

Panelin çerçeve başlıkları ve üretim sertifikası bu aktarım kuralının parçası değildir. Onlar `INTEGRATION_AUDIT.md` içinde açık kalan ayrı geçiş koşullarıdır.
