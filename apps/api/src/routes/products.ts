import { Router } from "express";
import { createProduct, getProducts, getProductsByIds, ProductFilters } from "../services/product.service";

const router = Router();

// POST /api/admin/products — створення продукту
router.post("/admin/products", async (req, res) => {
  try {
    const { title, description, article, category_id, product_variants } = req.body;

    if (!Array.isArray(product_variants) || product_variants.length === 0) {
      return res.status(400).json({ error: "Потрібен хоча б один варіант" });
    }

    for (const v of product_variants) {
      if (!v.sku) return res.status(400).json({ error: "SKU обовʼязковий" });
      if (!v.price || isNaN(v.price) || Number(v.price) <= 0)
        return res.status(400).json({ error: "Невірна ціна" });
      if (v.quantity == null || isNaN(v.quantity) || Number(v.quantity) < 0)
        return res.status(400).json({ error: "Невірна кількість" });
      if (!Array.isArray(v.product_images) || v.product_images.length === 0)
        return res.status(400).json({ error: "Потрібен хоча б один файл зображення" });
    }

    const product = await createProduct(title, description, article, category_id, product_variants);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при створенні продукту" });
  }
});

// GET /api/products — всі продукти з фільтрами та серверною пагінацією
// GET /api/products?ids=1,2,3&all=true — конкретні варіанти за IDs
router.get("/products", async (req, res) => {
  try {
    // Якщо передано ids — повертаємо конкретні варіанти (сторінка продукту)
    if (req.query.ids) {
      const ids = String(req.query.ids)
        .split(",")
        .map(Number)
        .filter(Boolean);

      if (!ids.length) {
        return res.status(400).json({ error: "Невірні ID продуктів" });
      }

      const allVariants = String(req.query.all) === "true";
      const products = await getProductsByIds(ids, allVariants);
      return res.json(products);
    }

    // Інакше — каталог з фільтрами та пагінацією
    const filters: ProductFilters = {
      category: req.query.category as string | undefined,
      sort: req.query.sort as ProductFilters['sort'],
      search: req.query.search as string | undefined,
      color: req.query.color as string | undefined,
      material: req.query.material as string | undefined,
      availability: req.query.availability as ProductFilters['availability'],
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Math.min(Number(req.query.limit), 100) : 12,
    };

    const result = await getProducts(filters);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при отриманні продуктів" });
  }
});

export default router;