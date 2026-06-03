import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { getUserById } from "../services/user.service";
import { prisma } from "../db/prisma";

const router = Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.user!.id);

    const user = await getUserById(userId);

    return res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Помилка" });
  }
});

router.patch('/me', authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.user!.id);
    const { first_name, last_name, middle_name, phone } = req.body;

    const data: Record<string, string> = {};
    if (first_name !== undefined && first_name !== '') data.first_name = first_name;
    if (last_name !== undefined && last_name !== '') data.last_name = last_name;
    if (middle_name !== undefined) data.middle_name = middle_name;
    if (phone !== undefined && phone !== '') data.phone = phone;

    const user = await prisma.users.update({
      where: { id: userId },
      data,
      select: { id: true, first_name: true, last_name: true, middle_name: true, phone: true, email: true }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Помилка оновлення' });
  }
});

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Невірний email' });
    }
    await prisma.subscriptions.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Помилка підписки' });
  }
});

export default router;