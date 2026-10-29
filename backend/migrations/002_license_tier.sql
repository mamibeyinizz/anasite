-- Lisansın seçilen paket etiketini saklar.
-- Modül ataması license_modules tablosunda kalır.
-- Paket şablonu sonradan değişse de mevcut lisans modülleri değişmez.
-- Kayıt silmez ve tablo düşürmez.
-- Sütun varsa ALTER çalışmaz; dosya yeniden uygulanabilir.
-- MySQL 8'de ADD COLUMN IF NOT EXISTS yoktur. Bu kontrol MariaDB ve MySQL 8'de geçerlidir.

SET @qrl_tier_slug_missing := (
  SELECT COUNT(*) = 0
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'licenses'
    AND COLUMN_NAME = 'tier_slug'
);

SET @qrl_tier_sql := IF(
  @qrl_tier_slug_missing,
  'ALTER TABLE licenses ADD COLUMN tier_slug VARCHAR(32) NULL AFTER notes',
  'DO 0'
);

PREPARE qrl_tier_stmt FROM @qrl_tier_sql;
EXECUTE qrl_tier_stmt;
DEALLOCATE PREPARE qrl_tier_stmt;
