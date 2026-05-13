export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED';

export type Payment = {
  id: number;
  order_id: number;
  provider: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transaction_id: string | null;
  created_at: string;
  order: { id: number; total_amount: number; status: string };
};