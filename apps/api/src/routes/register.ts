import { Router } from "express";
import { registerUser } from "../services/auth.service";

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

router.post("/auth/register", async (req, res) => {
  try {
    const { first_name, last_name, middle_name, email, password, password_confirm } = req.body;
    const { accessToken, refreshToken, user } = await registerUser(first_name, last_name, middle_name, email, password, password_confirm);

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.json({ accessToken, user });
  } catch (err: any) {
    const status = err?.status || 500;
    const message = err?.message || "Помилка при реєстрації";
    res.status(status).json({ error: message });
  }
});

export default router;