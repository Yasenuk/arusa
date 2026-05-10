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
    order_id: String(order.id),
    result_url: `${process.env.CLIENT_URL}/profile?paid=${order.id}`,
    server_url: `${process.env.API_URL}/api/payments/liqpay/callback`,
  };

  const data = Buffer.from(JSON.stringify(params)).toString('base64');
  const signature = sign(data);

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

  const statusMap: Record<string, OrderStatus> = {
    success: 'PAID',
    failure: 'PAYMENT_FAILED',
    error: 'PAYMENT_FAILED',
  };

  const newStatus = statusMap[payload.status];
  if (newStatus) {
    await prisma.orders.updateMany({
      where: { id: Number(payload.order_id) },
      data: { status: newStatus }
    });
  }

  res.status(200).send('OK');
});

export default router;