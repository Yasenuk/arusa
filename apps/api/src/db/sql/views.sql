CREATE VIEW products_catalog AS
SELECT
  p.id,
  p.title,
  p.price,
  p.material,
  c.name AS category,
  MIN(pi.image_url) AS preview_image
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
LEFT JOIN product_images pi ON pi.product_id = p.id
WHERE p.is_active = true
GROUP BY p.id, c.name;

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