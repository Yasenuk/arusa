CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE order_status AS ENUM (
	'очікує підтвердження',
	'підтверджено',
	'очікує платіж',
	'оплачено',
	'платіж не вдалося',
	'очікує відправлення',
	'відправлено',
	'доставлено',
	'скасовано'
);

CREATE TYPE payment_status AS ENUM ('очікує', 'успішно', 'не вдалося', 'скасовано');

CREATE TYPE delivery_status AS ENUM (
	'очікує',
	'відправлено',
	'в дорозі',
	'доставлено',
	'не вдалося'
);