import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../db/prisma';
import { createGuestOrder } from '../services/guest-order.service';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

router.post('/guest/orders', async (req, res) => {
  try {
    const { items, guest, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Кошик порожній' });
    }
    if (!guest?.name || !guest?.email || !guest?.phone) {
      return res.status(400).json({ error: 'Заповніть всі поля контактних даних' });
    }
    if (!address?.city) {
      return res.status(400).json({ error: 'Оберіть місто доставки' });
    }

    const order = await createGuestOrder(items, guest, address);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'uah',
      customer_email: guest.email,
      line_items: order.order_items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'uah',
          unit_amount: Math.round(Number(item.price_snapshot) * 100),
          product_data: { name: item.title_snapshot },
        },
      })),
      metadata: { order_id: String(order.id) },
      success_url: `${process.env.CLIENT_URL}/?guest_paid=${order.id}`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });

    await prisma.orders.update({
      where: { id: order.id },
      data: { status: 'PENDING_PAYMENT' },
    });

    return res.status(201).json({ order_id: order.id, stripe_url: session.url });
  } catch (err: any) {
    if (
      err.message === 'Кошик порожній' ||
      err.message?.startsWith('Недостатньо товару') ||
      err.message?.startsWith('Товар з id')
    ) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Помилка оформлення замовлення' });
  }
});

export default router;
