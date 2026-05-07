ALTER TABLE "user_addresses" ADD COLUMN "np_city_ref" VARCHAR(36);
ALTER TABLE "user_addresses" ADD COLUMN "np_warehouse_ref" VARCHAR(36);
ALTER TABLE "user_addresses" ADD COLUMN "np_warehouse_description" VARCHAR(255);
ALTER TABLE "user_addresses" ADD COLUMN "delivery_type" VARCHAR(20) DEFAULT 'warehouse';