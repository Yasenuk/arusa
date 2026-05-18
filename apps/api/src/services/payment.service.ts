import { prisma } from '../db/prisma';

export async function getPayments(user_id?: number) {
  return prisma.payments.findMany({
    where: user_id ? { orders: { user_id } } : undefined,
    include: {
      orders: {
        select: {
          id: true,
          total_amount: true,
          status: true,
          users: { select: { email: true } }
        }
      }
    },
    orderBy: { created_at: 'desc' },
  }).then(payments => payments.map(p => ({
    id: p.id,
    order_id: p.order_id,
    provider: p.provider,
    status: p.status,
    amount: Number(p.amount),
    currency: p.currency,
    transaction_id: p.transaction_id,
    created_at: p.created_at,
    user_email: p.orders.users.email,
    order: { id: p.orders.id, total_amount: Number(p.orders.total_amount), status: p.orders.status },
  })));
}
