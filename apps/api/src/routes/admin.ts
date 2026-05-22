import { Router } from 'express';
import { prisma } from '../db/prisma';
import { adminMiddleware } from '../middlewares/admin';
import { authMiddleware } from '../middlewares/auth';
import { createProduct, getProducts } from '../services/product.service';
import { getAllArticles, createArticle, updateArticle, deleteArticle, getArticles } from '../services/article.service';
import { getPayments } from '../services/payment.service';

const router = Router();

router.use('/admin', authMiddleware, adminMiddleware);

router.get('/admin/products', async (req, res) => {
  try {
    const result = await getProducts({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 50,
      search: req.query.search as string | undefined,
      availability: 'all',
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Помилка отримання товарів' });
  }
});

router.get('/admin/products/:id', async (req, res) => {
  try {
    const product = await prisma.products.findUnique({
      where: { id: Number(req.params.id) },
      include: { product_variants: { include: { product_images: true } }, categories: true }
    });
    if (!product) return res.status(404).json({ error: 'Не знайдено' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Помилка' });
  }
});

router.patch('/admin/products/:id', async (req, res) => {
  try {
    const { title, description, is_active } = req.body;
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (is_active !== undefined) data.is_active = is_active;

    const product = await prisma.products.update({ where: { id: Number(req.params.id) }, data });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Помилка оновлення' });
  }
});

router.delete('/admin/products/:id', async (req, res) => {
  try {
    await prisma.products.update({
      where: { id: Number(req.params.id) },
      data: { is_active: false }
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Помилка видалення' });
  }
});


router.delete('/admin/categories/:id', async (req, res) => {
  try {
    await prisma.categories.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Помилка видалення' });
  }
});


router.get('/admin/articles', async (req, res) => {
  try {
    const articles = await getAllArticles();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Помилка' });
  }
});

router.get('/admin/articles/:id', async (req, res) => {
  try {
    const article = await getArticles({ id: Number(req.params.id) });
    if (!article) return res.status(404).json({ error: 'Не знайдено' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: 'Помилка' });
  }
});

router.post('/admin/articles', async (req, res) => {
  try {
    const { title, description, alt, image_url } = req.body;
    if (!title) return res.status(400).json({ error: 'Назва обовʼязкова' });
    const article = await createArticle({ title, description, alt, image_url });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: 'Помилка створення' });
  }
});

router.patch('/admin/articles/:id', async (req, res) => {
  try {
    const article = await updateArticle(Number(req.params.id), req.body);
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: 'Помилка оновлення' });
  }
});

router.delete('/admin/articles/:id', async (req, res) => {
  try {
    await deleteArticle(Number(req.params.id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Помилка видалення' });
  }
});


router.get('/admin/orders', async (req, res) => {
  try {
    const where: any = {};
    if (req.query.status) where.status = req.query.status;

    const orders = await prisma.orders.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: { users: { select: { email: true } } }
    });

    res.json(orders.map(o => ({
      id: o.id,
      status: o.status,
      total_amount: Number(o.total_amount),
      currency: o.currency,
      created_at: o.created_at,
      user_email: o.users.email,
    })));
  } catch (err) {
    res.status(500).json({ error: 'Помилка' });
  }
});

router.get('/admin/orders/:id', async (req, res) => {
  try {
    const order = await prisma.orders.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        users: { select: { email: true } },
        order_items: true,
        user_addresses: true,
        deliveries: { orderBy: { id: 'desc' }, take: 1 },
      }
    });

    if (!order) return res.status(404).json({ error: 'Не знайдено' });

    res.json({
      id: order.id,
      status: order.status,
      total_amount: Number(order.total_amount),
      currency: order.currency,
      created_at: order.created_at,
      user_email: order.users.email,
      address: order.user_addresses ?? null,
      delivery: order.deliveries[0] ?? null,
      items: order.order_items.map(i => ({
        title_snapshot: i.title_snapshot,
        quantity: i.quantity,
        price_snapshot: Number(i.price_snapshot),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Помилка' });
  }
});

router.patch('/admin/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = Number(req.params.id);

    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: { order_items: true }
    });
    if (!order) return res.status(404).json({ error: 'Не знайдено' });

    await prisma.$transaction(async tx => {
      await tx.orders.update({ where: { id: orderId }, data: { status } });

      if (status === 'CANCELED' && order.status !== 'CANCELED') {
        for (const item of order.order_items) {
          if (!item.product_variant_id) continue;
          await tx.inventory.updateMany({
            where: { product_variant_id: item.product_variant_id },
            data: { reserved_quantity: { decrement: item.quantity } }
          });
        }
      }

      if (status === 'DELIVERED' && order.status !== 'DELIVERED') {
        for (const item of order.order_items) {
          if (!item.product_variant_id) continue;
          await tx.inventory.updateMany({
            where: { product_variant_id: item.product_variant_id },
            data: {
              quantity: { decrement: item.quantity },
              reserved_quantity: { decrement: item.quantity }
            }
          });
        }
      }
    });

    res.json({ ok: true, status });
  } catch (err) {
    res.status(500).json({ error: 'Помилка оновлення статусу' });
  }
});

router.post('/admin/orders/:id/delivery', async (req, res) => {
  try {
    const { tracking_number, provider = 'nova_poshta' } = req.body;

    const delivery = await prisma.deliveries.create({
      data: {
        order_id: Number(req.params.id),
        provider,
        tracking_number,
        status: 'SENT',
        shipped_at: new Date(),
      }
    });

    await prisma.orders.update({
      where: { id: Number(req.params.id) },
      data: { status: 'SHIPPED' }
    });

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: 'Помилка додавання доставки' });
  }
});


router.get('/admin/users', async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: { id: true, email: true, first_name: true, last_name: true, role: true, created_at: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Помилка' });
  }
});

router.patch('/admin/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Невірна роль' });
    const user = await prisma.users.update({
      where: { id: Number(req.params.id) },
      data: { role },
      select: { id: true, email: true, role: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Помилка' });
  }
});


router.get('/admin/payments', async (req, res) => {
  try {
    const payments = await getPayments();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Помилка' });
  }
});


router.get('/admin/stats', adminMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue,
      totalOrders,
      pendingOrders,
      paidOrders,
      shippedOrders,
      canceledOrders,
      totalUsers,
      newUsers,
      totalProducts,
      outOfStock,
      topProducts,
      revenueByMonth,
    ] = await Promise.all([
      prisma.payments.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
      prisma.payments.aggregate({ where: { status: 'SUCCESS', created_at: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.payments.aggregate({ where: { status: 'SUCCESS', created_at: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { amount: true } }),

      prisma.orders.count(),
      prisma.orders.count({ where: { status: { in: ['PENDING_CONFIRMATION', 'PENDING_PAYMENT'] } } }),
      prisma.orders.count({ where: { status: 'PAID' } }),
      prisma.orders.count({ where: { status: 'SHIPPED' } }),
      prisma.orders.count({ where: { status: 'CANCELED' } }),

      prisma.users.count(),
      prisma.users.count({ where: { created_at: { gte: startOfMonth } } }),

      prisma.products.count({ where: { is_active: true } }),
      prisma.product_variants.count({ where: { quantity: 0 } }),

      prisma.order_items.groupBy({
        by: ['title_snapshot'],
        _sum: { quantity: true, price_snapshot: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),

      prisma.$queryRaw<{ month: string; revenue: number }[]>`
        SELECT TO_CHAR(created_at, 'YYYY-MM') as month, SUM(amount)::float as revenue
        FROM payments
        WHERE status = 'успішно' AND created_at >= NOW() - INTERVAL '6 months'
        GROUP BY month
        ORDER BY month ASC
      `,
    ]);

    const total = Number(totalRevenue._sum.amount ?? 0);
    const thisMonth = Number(thisMonthRevenue._sum.amount ?? 0);
    const lastMonth = Number(lastMonthRevenue._sum.amount ?? 0);
    const growth = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

    res.json({
      revenue: { total, this_month: thisMonth, last_month: lastMonth, growth_percent: growth },
      orders: { total: totalOrders, pending: pendingOrders, paid: paidOrders, shipped: shippedOrders, canceled: canceledOrders },
      users: { total: totalUsers, new_this_month: newUsers },
      products: { total: totalProducts, out_of_stock: outOfStock },
      top_products: topProducts.map(p => ({
        title: p.title_snapshot,
        sold: Number(p._sum.quantity ?? 0),
        revenue: Number(p._sum.price_snapshot ?? 0) * Number(p._sum.quantity ?? 0),
      })),
      revenue_by_month: revenueByMonth,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка статистики' });
  }
});

router.get('/admin/inventory', async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product_variants: {
          include: {
            products: { select: { title: true } }
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    res.json(inventory.map(i => ({
      id: i.id,
      product_variant_id: i.product_variant_id,
      quantity: i.quantity,
      reserved_quantity: i.reserved_quantity,
      available: i.quantity - i.reserved_quantity,
      sku: i.product_variants.sku,
      title: i.product_variants.products.title,
      size: i.product_variants.size ?? '',
      color: i.product_variants.color ?? '',
    })));
  } catch (err) {
    res.status(500).json({ error: 'Помилка' });
  }
});

router.patch('/admin/inventory/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 0) return res.status(400).json({ error: 'Кількість не може бути від\'ємною' });

    const item = await prisma.inventory.update({
      where: { id: Number(req.params.id) },
      data: { quantity }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Помилка оновлення' });
  }
});

export default router;
