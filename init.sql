
CREATE DATABASE IF NOT EXISTS admin_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE admin_db;

-- ── users ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  password   VARCHAR(255) NOT NULL,            -- bcrypt hash
  role       ENUM('admin','editor','viewer') NOT NULL DEFAULT 'viewer',
  avatar     VARCHAR(500) DEFAULT NULL,
last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email),
  KEY idx_role (role),
  KEY idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── categories ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(120) NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── products ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          BIGINT        UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id INT           UNSIGNED NOT NULL,
  name        VARCHAR(200)  NOT NULL,
  sku         VARCHAR(80)   NOT NULL,
  price       DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  cost        DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  stock       INT           NOT NULL DEFAULT 0,
  image_url   VARCHAR(500)  DEFAULT NULL,
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sku (sku),
  KEY idx_category (category_id),
  KEY idx_is_active (is_active),
  CONSTRAINT fk_product_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── orders ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id         BIGINT        UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT        UNSIGNED NOT NULL,
  order_no   VARCHAR(30)   NOT NULL,
  total      DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  status     ENUM('pending','processing','shipped','done','refund','cancelled')
             NOT NULL DEFAULT 'pending',
  note       TEXT          DEFAULT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_order_no (order_no),
  KEY idx_user_id (user_id),
  KEY idx_status (status),
  KEY idx_created_at (created_at),
  CONSTRAINT fk_order_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── order_items ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id         BIGINT        UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id   BIGINT        UNSIGNED NOT NULL,
  product_id BIGINT        UNSIGNED NOT NULL,
  qty        INT           NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  subtotal   DECIMAL(14,2) GENERATED ALWAYS AS (qty * unit_price) STORED,
  PRIMARY KEY (id),
  KEY idx_order_id (order_id),
  KEY idx_product_id (product_id),
  CONSTRAINT fk_item_order
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT fk_item_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO categories (name, slug) VALUES
  ('電子產品', 'electronics'),
  ('服飾配件', 'fashion'),
  ('居家生活', 'home'),
  ('運動戶外', 'sports'),
  ('其他',     'others');

-- ── admin user (密碼:  11111111) ────────────────
INSERT IGNORE INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@example.com',
   '$2b$12$KIFnAqBKAMwFHrpxl3xKYuXxv2FqO6kP4qL9RHyoG5AxGldAuJMGa',
   'admin');

   -- 插入更多使用者 (密碼: Test@1234)
INSERT IGNORE INTO users (name, email, password, role, is_active, last_login) VALUES
  ('張三', 'zhang.san@example.com', '$2b$12$KIFnAqBKAMwFHrpxl3xKYuXxv2FqO6kP4qL9RHyoG5AxGldAuJMGa', 'editor', 1, NOW()),
  ('李四', 'li.si@example.com', '$2b$12$KIFnAqBKAMwFHrpxl3xKYuXxv2FqO6kP4qL9RHyoG5AxGldAuJMGa', 'viewer', 1, NULL),
  ('王五', 'wang.wu@example.com', '$2b$12$KIFnAqBKAMwFHrpxl3xKYuXxv2FqO6kP4qL9RHyoG5AxGldAuJMGa', 'editor', 0, NULL),
  ('趙六', 'zhao.liu@example.com', '$2b$12$KIFnAqBKAMwFHrpxl3xKYuXxv2FqO6kP4qL9RHyoG5AxGldAuJMGa', 'viewer', 1, DATE_SUB(NOW(), INTERVAL 5 DAY));

-- 插入產品資料
INSERT INTO products (category_id, name, sku, price, cost, stock, image_url, is_active) VALUES
  (1, 'iPhone 15 Pro', 'ELEC-001', 39999, 35000, 50, 'https://example.com/images/iphone15.jpg', 1),
  (1, 'MacBook Air M2', 'ELEC-002', 32999, 29000, 30, 'https://example.com/images/mba-m2.jpg', 1),
  (1, 'AirPods Pro', 'ELEC-003', 7990, 6500, 100, 'https://example.com/images/airpods.jpg', 1),
  (2, '棉質T恤 (白色)', 'FASH-001', 599, 350, 200, 'https://example.com/images/tshirt.jpg', 1),
  (2, '牛仔褲 (深藍)', 'FASH-002', 1299, 800, 150, 'https://example.com/images/jeans.jpg', 1),
  (2, '運動鞋 (黑色)', 'FASH-003', 2399, 1600, 80, 'https://example.com/images/shoes.jpg', 1),
  (3, '不鏽鋼保溫杯', 'HOME-001', 899, 500, 120, 'https://example.com/images/bottle.jpg', 1),
  (3, 'LED 護眼檯燈', 'HOME-002', 1699, 1100, 60, 'https://example.com/images/lamp.jpg', 1),
  (3, '記憶枕', 'HOME-003', 2199, 1400, 45, 'https://example.com/images/pillow.jpg', 1),
  (4, '瑜珈墊', 'SPORT-001', 899, 500, 90, 'https://example.com/images/yogamat.jpg', 1),
  (4, '啞鈴組 10kg', 'SPORT-002', 1599, 1000, 35, 'https://example.com/images/dumbbell.jpg', 1),
  (4, '跑步腰包', 'SPORT-003', 399, 200, 150, 'https://example.com/images/waistpack.jpg', 1),
  (5, '手工皂', 'OTHER-001', 299, 120, 80, 'https://example.com/images/soap.jpg', 1),
  (5, '手機掛繩', 'OTHER-002', 399, 180, 120, 'https://example.com/images/phone-strap.jpg', 1);

-- 插入訂單資料 (假設 user_id 1-3 存在)
INSERT INTO orders (user_id, order_no, total, status, note, created_at) VALUES
  (1, 'ORD-20250101-001', 47998, 'done', '急件，請快速出貨', DATE_SUB(NOW(), INTERVAL 30 DAY)),
  (2, 'ORD-20250115-002', 7990, 'done', NULL, DATE_SUB(NOW(), INTERVAL 20 DAY)),
  (1, 'ORD-20250201-003', 6497, 'processing', '公司要的', DATE_SUB(NOW(), INTERVAL 10 DAY)),
  (2, 'ORD-20250210-004', 39999, 'shipped', '請放管理室', DATE_SUB(NOW(), INTERVAL 5 DAY)),
  (3, 'ORD-20250215-005', 5896, 'pending', NULL, DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (1, 'ORD-20250218-006', 2199, 'cancelled', '取消訂單', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 插入訂單明細
INSERT INTO order_items (order_id, product_id, qty, unit_price) VALUES
  -- 訂單 1: 買了 iPhone 和 AirPods
  (1, 1, 1, 39999),
  (1, 3, 1, 7990),
  -- 訂單 2: 買了一個 AirPods
  (2, 3, 1, 7990),
  -- 訂單 3: 買了 T恤 + 牛仔褲 + 保溫杯
  (3, 4, 2, 599),
  (3, 5, 1, 1299),
  (3, 7, 3, 899),
  -- 訂單 4: 買了 iPhone
  (4, 1, 1, 39999),
  -- 訂單 5: 買了手機掛繩 + 手工皂 + 瑜珈墊
  (5, 14, 3, 399),
  (5, 13, 5, 299),
  (5, 10, 2, 899),
  -- 訂單 6: 買了記憶枕 (後來取消)
  (6, 9, 1, 2199);
UPDATE admin_db.users 
SET password = '$2a$10$w7Hi72xGiGCG.ATFw1GRbOrRdt16BOOJj3YqW6WEySoLt6H.0FVBu'
WHERE email = 'admin@example.com';