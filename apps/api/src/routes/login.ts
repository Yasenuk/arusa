import { Router } from "express";
import { prisma } from '../db/prisma';
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../services/auth.service";

const router = Router();

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(400).json({ error: "Невірні облікові дані" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(400).json({ error: "Невірні облікові дані" });
  }

  const payload = {
    id: user.id.toString(),
    role: user.role
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