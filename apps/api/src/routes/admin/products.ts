import { Router } from "express";
import { createProduct, getProducts } from "../../services/product.service";

const router = Router();

router.post("/admin/products", async (req, res) => {
  try {
    const {
      title,
      description,
      material,
      article,
      category_id,
      variants
    } = req.body;

    if (!title || !description || !material || !article || !category_id || !variants) {
      return res.status(400).json({ error: "Заповніть всі обов'язкові поля" });
    }

    const product = await createProduct(title, description, material, article, category_id, variants);

    res.json(product);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при створенні продукту" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при отриманні продуктів" });
  }
});

export default router;