CREATE TABLE
	users (
		id BIGSERIAL PRIMARY KEY,
		first_name VARCHAR(100) NOT NULL,
		last_name VARCHAR(100) NOT NULL,
		middle_name VARCHAR(100),
		email VARCHAR(255) NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		role user_role NOT NULL DEFAULT 'user',
		created_at TIMESTAMP NOT NULL DEFAULT NOW (),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW ()
	);

CREATE TABLE
	user_addresses (
		id BIGSERIAL PRIMARY KEY,
		user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
		region VARCHAR(100) NOT NULL,
		city VARCHAR(100) NOT NULL,
		street VARCHAR(150) NOT NULL,
		house VARCHAR(50) NOT NULL,
		apartment VARCHAR(50),
		postal_code VARCHAR(20),
		is_default BOOLEAN DEFAULT FALSE
	);

CREATE TABLE
	categories (
		id BIGSERIAL PRIMARY KEY,
		name VARCHAR(150) NOT NULL,
		parent_id BIGINT REFERENCES categories (id) ON DELETE SET NULL
	);

CREATE TABLE
	products (
		id BIGSERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		description TEXT,
		material VARCHAR(150),
		article VARCHAR(100) UNIQUE NOT NULL,
		weight NUMERIC(10, 2),
		price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
		is_active BOOLEAN NOT NULL DEFAULT TRUE,
		category_id BIGINT REFERENCES categories (id) ON DELETE SET NULL,
		created_at TIMESTAMP NOT NULL DEFAULT NOW (),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW ()
	);

CREATE TABLE
	product_variants (
		id BIGSERIAL PRIMARY KEY,
		product_id BIGINT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
		size VARCHAR(100),
		color VARCHAR(100),
		sku VARCHAR(100) UNIQUE NOT NULL,
		price NUMERIC(12, 2) CHECK (price >= 0)
	);

CREATE TABLE
	product_images (
		id BIGSERIAL PRIMARY KEY,
		product_id BIGINT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
		image_url TEXT NOT NULL,
		position INT DEFAULT 0
	);

CREATE TABLE
	inventory (
		id BIGSERIAL PRIMARY KEY,
		product_variant_id BIGINT NOT NULL REFERENCES product_variants (id) ON DELETE CASCADE,
		quantity INT NOT NULL CHECK (quantity >= 0),
		reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0)
	);

CREATE TABLE
	carts (
		id BIGSERIAL PRIMARY KEY,
		user_id BIGINT UNIQUE REFERENCES users (id) ON DELETE CASCADE,
		created_at TIMESTAMP NOT NULL DEFAULT NOW (),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW ()
	);

CREATE TABLE
	cart_items (
		id BIGSERIAL PRIMARY KEY,
		cart_id BIGINT NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
		product_variant_id BIGINT NOT NULL REFERENCES product_variants (id),
		quantity INT NOT NULL CHECK (quantity > 0),
		UNIQUE (cart_id, product_variant_id)
	);

CREATE TABLE
	orders (
		id BIGSERIAL PRIMARY KEY,
		user_id BIGINT NOT NULL REFERENCES users (id),
		address_id BIGINT REFERENCES user_addresses (id),
		status order_status NOT NULL DEFAULT 'очікує підтвердження',
		total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
		currency VARCHAR(10) NOT NULL DEFAULT 'ГРН',
		created_at TIMESTAMP NOT NULL DEFAULT NOW (),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW ()
	);

CREATE TABLE
	order_items (
		id BIGSERIAL PRIMARY KEY,
		order_id BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
		product_variant_id BIGINT REFERENCES product_variants (id),
		title_snapshot VARCHAR(255) NOT NULL,
		price_snapshot NUMERIC(12, 2) NOT NULL CHECK (price_snapshot >= 0),
		quantity INT NOT NULL CHECK (quantity > 0)
	);

CREATE TABLE
	payments (
		id BIGSERIAL PRIMARY KEY,
		order_id BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
		provider VARCHAR(100) NOT NULL,
		status payment_status NOT NULL DEFAULT 'очікує',
		amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
		currency VARCHAR(10) NOT NULL,
		transaction_id VARCHAR(255),
		created_at TIMESTAMP NOT NULL DEFAULT NOW ()
	);

CREATE TABLE
	deliveries (
		id BIGSERIAL PRIMARY KEY,
		order_id BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
		provider VARCHAR(100) NOT NULL,
		tracking_number VARCHAR(255),
		status delivery_status NOT NULL DEFAULT 'очікує',
		shipped_at TIMESTAMP,
		delivered_at TIMESTAMP
	);

CREATE INDEX idx_products_category ON products (category_id);

CREATE INDEX idx_orders_user ON orders (user_id);

CREATE INDEX idx_payments_order ON payments (order_id);

CREATE INDEX idx_inventory_variant ON inventory (product_variant_id);