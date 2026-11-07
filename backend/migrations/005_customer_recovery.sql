-- Müşteri hesabı: e-posta doğrulama, parola sıfırlama ve e-posta değiştirme belirteçleri.
-- Tekrar çalıştırılabilir; kayıt silmez, tablo düşürmez.
-- Belirteç düz saklanmaz: yalnız SHA-256 özeti. Tarih-saat UTC.

SET @qrl_verified_missing := (
  SELECT COUNT(*) = 0
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'customers'
    AND COLUMN_NAME = 'email_verified_at'
);
SET @qrl_verified_sql := IF(
  @qrl_verified_missing,
  'ALTER TABLE customers ADD COLUMN email_verified_at DATETIME NULL AFTER last_login_at',
  'DO 0'
);
PREPARE qrl_verified_stmt FROM @qrl_verified_sql;
EXECUTE qrl_verified_stmt;
DEALLOCATE PREPARE qrl_verified_stmt;

CREATE TABLE IF NOT EXISTS customer_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_id BIGINT UNSIGNED NOT NULL,
  kind VARCHAR(8) NOT NULL,
  token_hash CHAR(64) NOT NULL,
  new_email VARCHAR(191) NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_tokens_hash (token_hash),
  KEY idx_customer_tokens_customer (customer_id, kind),
  KEY idx_customer_tokens_expires (expires_at),
  CONSTRAINT fk_customer_tokens_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
