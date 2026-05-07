export type UserAddress = {
	id: number;
  region: string;
  city: string;
  street?: string;
  house?: string;
  apartment?: string;
  postal_code?: string;
  is_default?: boolean;
  // НП поля
  np_city_ref?: string;
  np_warehouse_ref?: string;
  np_warehouse_description?: string;
  delivery_type?: 'warehouse' | 'address';
};

export type CreateAddressDto = Omit<UserAddress, 'id'>;