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