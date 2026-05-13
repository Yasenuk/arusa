import { Router } from 'express';
import { createHash } from 'crypto';
import { prisma } from '../db/prisma';
import { authMiddleware } from '../middlewares/auth';
import { OrderStatus } from '@org/shared-types';

const { LIQPAY_PUBLIC_KEY, LIQPAY_PRIVATE_KEY } = process.env;

function sign(data: string) {
  return createHash('sha1')
    .update(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY)
    .digest('base64');
}

const router = Router();

router.post('/payments/liqpay', authMiddleware, async (req, res) => {
  const { order_id } = req.body;
  if (!req.user) return res.status(401).json({ error: 'Не авторизовано' });

  const order = await prisma.orders.findFirst({
    where: { id: Number(order_id), user_id: Number(req.user.id) }
  });

  if (!order) return res.status(404).json({ error: 'Замовлення не знайдено' });
  if (order.status !== 'PENDING_CONFIRMATION' && order.status !== 'PENDING_PAYMENT') {
    return res.status(400).json({ error: 'Замовлення не може бути оплачене' });
  }

  const params = {
    version: 3,
    public_key: LIQPAY_PUBLIC_KEY,
    action: 'pay',
    amount: Number(order.total_amount),
    currency: 'UAH',
    description: `Замовлення #${order.id}`,
    order_id: `${String(order.id)}_${Date.now()}`,
    result_url: `${process.env.CLIENT_URL}/profile?paid=${order.id}`,
    server_url: `${process.env.API_URL}/api/payments/liqpay/callback`,
  };

  const data = Buffer.from(JSON.stringify(params)).toString('base64');
  const signature = sign(data);

  console.log('PUBLIC_KEY:', JSON.stringify(LIQPAY_PUBLIC_KEY));
  console.log('PRIVATE_KEY:', JSON.stringify(LIQPAY_PRIVATE_KEY));
  console.log('params:', JSON.stringify(params, null, 2));
  console.log('data:', data);
  console.log('signature:', signature);

  await prisma.orders.update({
    where: { id: order.id },
    data: { status: 'PENDING_PAYMENT' }
  });

  res.json({ data, signature });
});

router.post('/payments/liqpay/callback', async (req, res) => {
  const { data, signature } = req.body;

  if (sign(data) !== signature) {
    return res.status(400).json({ error: 'Невалідний підпис' });
  }

  const payload = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

  const orderId = Number(String(payload.order_id).split('_')[0]);

  const statusMap: Record<string, OrderStatus> = {
    success: 'PAID',
    failure: 'PAYMENT_FAILED',
    error: 'PAYMENT_FAILED',
  };

  const newStatus = statusMap[payload.status];

  if (newStatus) {
    await prisma.orders.update({
      where: { id: orderId, status: { not: 'PAID' } },
      data: { status: newStatus }
    });

    await prisma.payments.create({
      data: {
        order_id: orderId,
        provider: 'liqpay',
        status: payload.status === 'success' ? 'SUCCESS' : 'FAILED',
        amount: payload.amount,
        currency: payload.currency ?? 'UAH',
        transaction_id: String(payload.payment_id ?? ''),
      }
    });
  }

  res.status(200).send('OK');
});

router.get('/payments', authMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Не авторизовано' });

  const payments = await prisma.payments.findMany({
    where: { orders: { user_id: Number(req.user.id) } },
    include: { orders: { select: { id: true, total_amount: true, status: true } } },
    orderBy: { created_at: 'desc' },
  });

  res.json(payments.map(p => ({
    id: p.id,
    order_id: p.order_id,
    provider: p.provider,
    status: p.status,
    amount: Number(p.amount),
    currency: p.currency,
    transaction_id: p.transaction_id,
    created_at: p.created_at,
    order: { id: p.orders.id, total_amount: Number(p.orders.total_amount), status: p.orders.status },
  })));
});

export default router;