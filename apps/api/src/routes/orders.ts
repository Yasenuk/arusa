import { Router } from 'express';
import { createOrder, getOrders, getOrderById } from '../services/order.service';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/orders', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Не авторизовано' });

    const orders = await getOrders(Number(req.user.id));
    return res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка отримання замовлень' });
  }
});

router.get('/orders/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Не авторизовано' });

    const order = await getOrderById(Number(req.user.id), Number(req.params.id));
    return res.json(order);
  } catch (err: any) {
    if (err.message === 'Замовлення не знайдено') {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Помилка отримання замовлення' });
  }
});

router.post('/orders', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Не авторизовано' });

    const { address_id } = req.body;
    const order = await createOrder(Number(req.user.id), address_id);
    return res.status(201).json(order);
  } catch (err: any) {
    if (err.message === 'Кошик порожній') {
      return res.status(400).json({ error: err.message });
    }
    if (err.message?.startsWith('Недостатньо товару')) {
      return res.status(409).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Помилка створення замовлення' });
  }
});

export default router;