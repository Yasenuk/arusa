import { UserAddress } from '@org/shared-types';

export type OrderStore = {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  createOrder: (address_id?: number) => Promise<Order>;
};

export type OrderItem = {
  id?: number;
  title_snapshot: string;
  price_snapshot: number;
  quantity: number;
};

export type Order = {
  id?: number;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  created_at: string;
  order_items: OrderItem[];
  user_addresses?: UserAddress;
};

export type OrderStatus =
  | 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'PENDING_PAYMENT'
  | 'PAID' | 'PAYMENT_FAILED' | 'PENDING_SHIPMENT'
  | 'SHIPPED' | 'DELIVERED' | 'CANCELED';