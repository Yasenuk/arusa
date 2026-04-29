import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { getUserById } from "../services/user.service";

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

export default router;