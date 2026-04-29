import { Router } from "express";
import { createProduct, getCatalogVariants, getProducts } from "../../services/product.service";

const router = Router();

router.post("/admin/products", async (req, res) => {
  try {
    const {
      title,
      description,
      article,
      category_id,
      product_variants
    } = req.body;

    if (!Array.isArray(product_variants) || product_variants.length === 0) {
      return res.status(400).json({ error: "Потрібен хоча б один варіант" });
    }

    for (const v of product_variants) {
      if (!v.sku) {
        return res.status(400).json({ error: "SKU обовʼязковий" });
      }
      if (!v.price || isNaN(v.price) || Number(v.price) <= 0) {
        return res.status(400).json({ error: "Невірна ціна" });
      }
      if (!v.quantity || isNaN(v.quantity) || Number(v.quantity) < 0) {
        return res.status(400).json({ error: "Невірна кількість" });
      }

      if (!Array.isArray(v.product_images) || v.product_images.length === 0) {
        return res.status(400).json({ error: "Потрібен хоча б один файл зображення" });
      }
    }

    const product = await createProduct(title, description, article, category_id, product_variants);

    res.json(product);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при створенні продукту" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const ids = String(req.query.ids || "")
      .split(",")
      .map(Number)
      .filter(Boolean);

    if (!ids.length) {
      return res.status(400).json({ error: "ids required" });
    }

    const products = await getProducts(ids);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при отриманні продукту" });
  }
});

router.get("/products/all", async (req, res) => {
  try {
    const products = await getCatalogVariants();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при отриманні продуктів" });
  }
});


export default router;