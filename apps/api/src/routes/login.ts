import { Router } from "express";
import { loginUser } from "../services/auth.service";

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,          // недоступний з JS
  secure: process.env.NODE_ENV === "production", // тільки HTTPS на prod
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 днів в мс
};

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await loginUser(email, password);

    // refreshToken — тільки в httpOnly cookie, JS його не бачить
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    // accessToken — в тілі відповіді, фронт зберігає в пам'яті
    res.json({ accessToken, user });
  } catch (err: any) {
    const status = err?.status || 500;
    const message = err?.message || "Помилка при вході";
    res.status(status).json({ error: message });
  }
});

export default router;