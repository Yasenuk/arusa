import express from 'express';
import { Router } from 'express';
import { prisma } from '../db/prisma';
import { authMiddleware } from '../middlewares/auth';

import Stripe, { type Checkout } from 'stripe';
import { getPayments } from '../services/payment.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const router = Router();

router.post('/payments/stripe', authMiddleware, async (req, res) => {
  const { order_id } = req.body;
  if (!req.user) return res.status(401).json({ error: 'Не авторизовано' });

  const order = await prisma.orders.findFirst({
    where: { id: Number(order_id), user_id: Number(req.user.id) },
    include: { order_items: true }
  });

  if (!order) return res.status(404).json({ error: 'Не знайдено' });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    currency: 'uah',
    line_items: order.order_items.map(item => ({
      quantity: item.quantity,
      price_data: {
        currency: 'uah',
        unit_amount: Math.round(Number(item.price_snapshot) * 100),
        product_data: { name: item.title_snapshot },
      },
    })),
    metadata: { order_id: String(order.id) },
    success_url: `${process.env.CLIENT_URL}/profile?paid=${order.id}`,
    cancel_url: `${process.env.CLIENT_URL}/profile`,
  });

  await prisma.orders.update({
    where: { id: order.id },
    data: { status: 'PENDING_PAYMENT' }
  });

  res.json({ url: session.url });
});

router.post('/payments/stripe/callback', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']!;

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return res.status(400).send('Невалідний підпис');
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Checkout.Session;
    const orderId = Number(session.metadata?.order_id);
    const success = session.payment_status === 'paid';

    try {
      await prisma.orders.update({
        where: { id: orderId, status: { not: 'PAID' } },
        data: { status: success ? 'PAID' : 'PAYMENT_FAILED' }
      });

      await prisma.payments.create({
        data: {
          order_id: orderId,
          provider: 'stripe',
          status: success ? 'SUCCESS' : 'FAILED',
          amount: (session.amount_total ?? 0) / 100,
          currency: (session.currency ?? 'uah').toUpperCase(),
          transaction_id: session.payment_intent as string ?? '',
        }
      });
    } catch { }
  }

  res.json({ received: true });
});

router.get('/payments', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Не авторизовано' });

    const payments = await getPayments();
    return res.status(201).json(payments);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Помилка створення замовлення' });
  }
});

export default router;