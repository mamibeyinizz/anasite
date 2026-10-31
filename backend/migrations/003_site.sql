-- Site analitiği (onaylı ziyaretçi takibi) ve blog tabloları.
-- Tekrar çalıştırılabilir: tablo düşürme ve kayıt silme komutu yoktur.
-- Tarih-saat sütunları UTC olarak yazılır.

CREATE TABLE IF NOT EXISTS an_visitors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vid CHAR(32) NOT NULL,
  first_seen DATETIME NOT NULL,
  last_seen DATETIME NOT NULL,
  first_referrer_host VARCHAR(120) NOT NULL DEFAULT '',
  first_utm_source VARCHAR(100) NOT NULL DEFAULT '',
  first_utm_medium VARCHAR(100) NOT NULL DEFAULT '',
  first_utm_campaign VARCHAR(100) NOT NULL DEFAULT '',
  country CHAR(2) NULL,
  device VARCHAR(16) NOT NULL DEFAULT '',
  browser VARCHAR(32) NOT NULL DEFAULT '',
  os VARCHAR(32) NOT NULL DEFAULT '',
  last_ip VARBINARY(16) NULL,
  sessions INT UNSIGNED NOT NULL DEFAULT 0,
  pageviews INT UNSIGNED NOT NULL DEFAULT 0,
  clicks INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_an_visitors_vid (vid),
  KEY idx_an_visitors_last_seen (last_seen),
  KEY idx_an_visitors_first_seen (first_seen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS an_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sid CHAR(32) NOT NULL,
  visitor_id BIGINT UNSIGNED NOT NULL,
  started_at DATETIME NOT NULL,
  last_activity_at DATETIME NOT NULL,
  landing_path VARCHAR(255) NOT NULL DEFAULT '',
  exit_path VARCHAR(255) NOT NULL DEFAULT '',
  referrer_host VARCHAR(120) NOT NULL DEFAULT '',
  referrer_url VARCHAR(255) NOT NULL DEFAULT '',
  utm_source VARCHAR(100) NOT NULL DEFAULT '',
  utm_medium VARCHAR(100) NOT NULL DEFAULT '',
  utm_campaign VARCHAR(100) NOT NULL DEFAULT '',
  device VARCHAR(16) NOT NULL DEFAULT '',
  browser VARCHAR(32) NOT NULL DEFAULT '',
  os VARCHAR(32) NOT NULL DEFAULT '',
  screen VARCHAR(16) NOT NULL DEFAULT '',
  lang VARCHAR(16) NOT NULL DEFAULT '',
  country CHAR(2) NULL,
  ip VARBINARY(16) NULL,
  pageviews INT UNSIGNED NOT NULL DEFAULT 0,
  clicks INT UNSIGNED NOT NULL DEFAULT 0,
  max_scroll TINYINT UNSIGNED NOT NULL DEFAULT 0,
  active_seconds INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_an_sessions_sid (sid),
  KEY idx_an_sessions_visitor (visitor_id, started_at),
  KEY idx_an_sessions_started (started_at),
  KEY idx_an_sessions_activity (last_activity_at),
  CONSTRAINT fk_an_sessions_visitor FOREIGN KEY (visitor_id) REFERENCES an_visitors (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS an_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NOT NULL,
  visitor_id BIGINT UNSIGNED NOT NULL,
  occurred_at DATETIME NOT NULL,
  type VARCHAR(16) NOT NULL,
  path VARCHAR(255) NOT NULL DEFAULT '',
  title VARCHAR(160) NOT NULL DEFAULT '',
  label VARCHAR(160) NOT NULL DEFAULT '',
  target VARCHAR(255) NOT NULL DEFAULT '',
  section VARCHAR(80) NOT NULL DEFAULT '',
  value INT NULL,
  PRIMARY KEY (id),
  KEY idx_an_events_time (occurred_at),
  KEY idx_an_events_type_time (type, occurred_at),
  KEY idx_an_events_path_time (path, occurred_at),
  KEY idx_an_events_session (session_id, id),
  KEY idx_an_events_visitor (visitor_id, id),
  CONSTRAINT fk_an_events_session FOREIGN KEY (session_id) REFERENCES an_sessions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_categories (
  slug VARCHAR(32) NOT NULL,
  name VARCHAR(64) NOT NULL,
  lead VARCHAR(255) NOT NULL DEFAULT '',
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(100) NOT NULL,
  status ENUM('taslak', 'yayinda') NOT NULL DEFAULT 'taslak',
  category VARCHAR(32) NOT NULL,
  title VARCHAR(200) NOT NULL,
  seo_title VARCHAR(120) NOT NULL DEFAULT '',
  description VARCHAR(200) NOT NULL DEFAULT '',
  excerpt VARCHAR(500) NOT NULL DEFAULT '',
  answer TEXT NOT NULL,
  body MEDIUMTEXT NOT NULL,
  cover VARCHAR(160) NOT NULL DEFAULT '',
  cover_alt VARCHAR(255) NOT NULL DEFAULT '',
  read_min SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  published_on DATE NOT NULL,
  updated_on DATE NULL,
  faq TEXT NOT NULL,
  sources TEXT NOT NULL,
  products TEXT NOT NULL,
  related TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_posts_slug (slug),
  KEY idx_blog_posts_list (status, published_on),
  KEY idx_blog_posts_category (category, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO blog_categories (slug, name, lead, sort_order) VALUES
  ('qr-menu', 'QR Menü', 'Dijital menüye geçiş, kurulum ve seçim rehberleri.', 1),
  ('mevzuat', 'Mevzuat', 'Fiyat listesi ve tüketici kurallarının işletmeye etkisi.', 2),
  ('karlilik', 'Menü & Kârlılık', 'Maliyet, fiyat ve menü mühendisliği.', 3),
  ('servis', 'Servis & Operasyon', 'Masa, garson çağrısı ve servis akışı.', 4);
