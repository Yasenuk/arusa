import express from 'express';
import { Router } from 'express';

import PDFDocument from 'pdfkit';
import path from 'path';

import { prisma } from '../db/prisma';

import Stripe, { type Checkout } from 'stripe';

import { authMiddleware } from '../middlewares/auth';
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
  } catch (err: any) {
    console.error('[stripe webhook] підпис не пройшов:', err.message);
    console.error('[stripe webhook] перевір STRIPE_WEBHOOK_SECRET у .env — він міг застаріти після перезапуску stripe listen');
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
    } catch (err) {
      console.error('[stripe webhook] failed to update order/payment:', err);
    }
  }

  res.json({ received: true });
});

router.get('/payments', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Не авторизовано' });

    const payments = await getPayments(Number(req.user!.id));
    return res.json(payments);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Помилка створення замовлення' });
  }
});

router.get('/payments/:id/receipt', authMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Не авторизовано' });

  const payment = await prisma.payments.findFirst({
    where: {
      id: Number(req.params.id),
      orders: { user_id: Number(req.user.id) }
    },
    include: {
      orders: {
        include: {
          order_items: true,
          users: { select: { first_name: true, last_name: true, email: true } }
        }
      }
    }
  });

  if (!payment) return res.status(404).json({ error: 'Не знайдено' });

  const doc = new PDFDocument({ margin: 50 });

  doc.registerFont('Manrope', path.join(__dirname, 'assets/fonts/Manrope-Regular/Manrope-Regular.ttf'));
  doc.font('Manrope');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="receipt-${payment.id}.pdf"`);
  doc.pipe(res);

  doc.fontSize(20).text('Квитанція про оплату', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Квитанція №: ${payment.id}`);
  doc.text(`Дата: ${new Date(payment.created_at).toLocaleDateString('uk-UA')}`);
  doc.text(`Замовлення №: ${payment.order_id}`);
  doc.text(`Статус: ${payment.status === 'SUCCESS' ? 'Оплачено' : 'Не оплачено'}`);
  doc.text(`Провайдер: ${payment.provider}`);
  if (payment.transaction_id) doc.text(`ID транзакції: ${payment.transaction_id}`);
  doc.moveDown();

  const user = payment.orders.users;
  const buyerName = user
    ? (`${user.last_name ?? ''} ${user.first_name ?? ''}`.trim() || user.email)
    : (payment.orders as any).guest_name ?? 'Гість';
  const buyerEmail = user?.email ?? (payment.orders as any).guest_email ?? '';
  doc.text(`Покупець: ${buyerName}`);
  doc.text(`Email: ${buyerEmail}`);
  doc.moveDown();

  doc.text('Товари:', { underline: true });
  doc.moveDown(0.5);

  payment.orders.order_items.forEach(item => {
    doc.text(
      `${item.title_snapshot}  x${item.quantity}  —  ${Number(item.price_snapshot) * item.quantity} ${payment.currency}`
    );
  });

  doc.moveDown();
  doc.fontSize(14).text(`Разом: ${payment.amount} ${payment.currency}`, { align: 'right' });

  doc.end();
});

export default router;