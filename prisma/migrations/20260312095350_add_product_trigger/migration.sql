-- Автоматичне оновлення updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Резервування товару при створенні замовлення
CREATE OR REPLACE FUNCTION reserve_inventory()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory
  SET reserved_quantity = reserved_quantity + NEW.quantity
  WHERE product_variant_id = NEW.product_variant_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Повернення товару на склад при скасуванні замовлення
CREATE OR REPLACE FUNCTION release_inventory()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'скасовано' THEN
    UPDATE inventory i
    SET reserved_quantity = reserved_quantity - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
    AND oi.product_variant_id = i.product_variant_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Автоматичний підрахунок суми замовлення
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders
  SET total_amount = (
    SELECT SUM(price_snapshot * quantity)
    FROM order_items
    WHERE order_id = NEW.order_id
  )
  WHERE id = NEW.order_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Перевірка наявності товару на складі
CREATE OR REPLACE FUNCTION check_inventory()
RETURNS TRIGGER AS $$
DECLARE
  available INT;
BEGIN
  SELECT quantity - reserved_quantity
  INTO available
  FROM inventory
  WHERE product_variant_id = NEW.product_variant_id;

  IF available < NEW.quantity THEN
    RAISE EXCEPTION 'Недостатньо товару на складі';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Автоматичне оновлення updated_at
CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_products_updated
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_carts_updated
BEFORE UPDATE ON carts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Резервування товару при створенні замовлення
CREATE TRIGGER trg_reserve_inventory
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION reserve_inventory();

-- Повернення товару на склад при скасуванні замовлення
CREATE TRIGGER trg_release_inventory
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION release_inventory();

-- Автоматичний підрахунок суми замовлення
CREATE TRIGGER trg_order_total_insert
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trg_order_total_update
AFTER UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trg_order_total_delete
AFTER DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_total();

-- Перевірка наявності товару на складі
CREATE TRIGGER trg_check_inventory
BEFORE INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION check_inventory();


-- Створення представлень для оптимізації запитів
CREATE VIEW products_catalog AS
SELECT
  p.id,
  p.title,
  AVG(pv.price) AS price,
  pv.material,
  c.name AS category,
  (
    SELECT image_url
    FROM product_images
    WHERE variant_id = pv.id
    ORDER BY position
    LIMIT 1
  ) AS preview_image
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
LEFT JOIN product_variants pv ON pv.product_id = p.id
WHERE p.is_active = true
GROUP BY
  p.id,
  p.title,
  pv.material,
  c.name,
  pv.id;

-- Представлення для замовлень з інформацією про користувача
CREATE VIEW orders_full AS
SELECT
  o.id,
  o.status,
  o.total_amount,
  o.created_at,
  u.email,
  u.first_name,
  u.last_name
FROM orders o
JOIN users u ON u.id = o.user_id;