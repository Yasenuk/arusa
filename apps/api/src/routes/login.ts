import { Router } from "express";
import { loginUser } from "../services/auth.service";

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,       
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await loginUser(email, password);

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.json({ accessToken, user });
  } catch (err: any) {
    const status = err?.status || 500;
    const message = err?.message || "Помилка при вході";
    res.status(status).json({ error: message });
  }
});

export default router;