import { Router } from "express";
import { getAllArticles, getArticles } from "../services/article.service";

const router = Router();

router.get("/articles", async (req, res) => {
  try {
    const article = await getAllArticles();
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при отриманні статей" });
  }
});

router.get("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await getArticles({ id: Number(id) });
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при отриманні статей" });
  }
});

export default router;