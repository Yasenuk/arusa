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