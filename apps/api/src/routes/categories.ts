import { Router } from "express";
import { createCategory, getCategories } from "../services/category.service";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";

const router = Router();

router.post("/admin/categories", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Назва категорії обов'язкова" });
    }

    const category = await createCategory(name, parent_id);

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при створенні категорії" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при отриманні категорій" });
  }
});

export default router;