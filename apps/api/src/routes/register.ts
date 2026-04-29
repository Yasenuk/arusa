import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from '../db/prisma';
import { createAccessToken, createRefreshToken } from "../services/auth.service";
import { createUser } from "../services/user.service";
import { createCart } from "../services/cart.service";

const router = Router();

router.post("/auth/register", async (req, res) => {
  const {
    first_name,
    last_name,
    middle_name,
    email,
    password,
    password_confirm
  } = req.body;

  if (password !== password_confirm) {
    return res.status(400).json({ error: "Паролі не співпадають" });
  }

  const exists = await prisma.users.findUnique({
    where: { email }
  });

  if (exists) {
    return res.status(400).json({ error: "Email вже використовується" });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (prisma) => {
    const user = await createUser(first_name, last_name, middle_name, email, password_hash);
    await createCart(Number(user.id));

    return user;
  });

  const payload = {
    id: result.id.toString(),
    role: result.role
  };

  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  res.json({
    accessToken,
    refreshToken,
    user: payload
  });
});

export default router;