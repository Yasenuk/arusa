import { UserAddress } from './address.js';

export type OrderStore = {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  createOrder: (address_id?: number) => Promise<Order>;
};

export type OrderItem = {
  id?: number;
  product_variant_id: number;
  title_snapshot: string;
  price_snapshot: number;
  quantity: number;
};

export type Order = {
  id: number;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  address: UserAddress | null;
  delivery: unknown | null;
  items: OrderItem[];
};

export type OrderStatus =
  | 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'PENDING_PAYMENT'
  | 'PAID' | 'PAYMENT_FAILED' | 'PENDING_SHIPMENT'
  | 'SHIPPED' | 'DELIVERED' | 'CANCELED';