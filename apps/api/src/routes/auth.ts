import { createAccessToken, verifyRefreshToken } from "../services/auth.service";
import { Router } from "express";

const router = Router();

router.post("/auth/refresh", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token" });
  }

  try {
    const user = verifyRefreshToken(refreshToken);

    const newAccessToken = createAccessToken({
      id: user.id,
      role: user.role
    });

    return res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(401).json({ error: "Невірний оновлювальний токен" });
  }
});

router.post("/auth/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  res.json({ success: true });
});

export default router;