import { useEffect, useState } from "react";

import { useNotification } from "@org/ui";
import { Category, Product, ProductImage } from "@org/shared-types";

import styles from "./app.module.scss";

export default function AdminCreateProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { notify } = useNotification();

  useEffect(() => {
    fetch("/api/categories")
      .then(async r => {
        if (!r.ok) {
          throw new Error("Failed to fetch categories");
        }

        const text = await r.text();
        if (!text) return [];

        return JSON.parse(text);
      })
      .then(setCategories)
      .catch(console.error);
  }, []);

  const [product, setProduct] = useState<Product>({
    title: "",
    description: "",
    article: "",
    category_id: 0,
    product_variants: []
  });

  function updateField(field: string, value: any) {
    setProduct(prev => ({ ...prev, [field]: value }));
  }

  function addVariant() {
    setProduct(prev => ({
      ...prev,
      product_variants: [
        ...prev.product_variants,
        {
          size: "",
          color: "",
          sku: "",
          price: 0,
          quantity: 0,
          material: "",
          weight: 0,
          product_images: []
        }
      ]
    }));
  }

  function updateVariant(index: number, field: string, value: any) {
    setProduct(prev => {
      const product_variants = [...prev.product_variants];
      product_variants[index] = { ...product_variants[index], [field]: value };
      return { ...prev, product_variants };
    });
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    setProduct(prev => {
      const product_variants = [...prev.product_variants];

      product_variants[index].product_images = [
        {
          image_url: file.name.split(".")[0],
          position: 0
        } as ProductImage
      ];

      return { ...prev, product_variants };
    });
  }

  async function handleSubmit() {
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
      });

      if (!res.ok) {
        const err = await res.json();
        notify(err.error, "error");
        return;
      }

      notify("Продукт створено", "success");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.admin__section}>
      <section className={styles.admin__container}>
        <h2 className={`${styles.admin__title} h h_s`}>Створити продукт</h2>

        <form className={styles.admin__form} onSubmit={e => e.preventDefault()}>
          <div className={styles.admin__form_group}>
            <label className={`${styles.admin__label} reular`} htmlFor="product-title">Назва</label>
            <input
              className={`${styles.admin__input} small _button_border`}
              id="product-title"
              placeholder="Назва"
              value={product.title}
              onChange={e => updateField("title", e.target.value)}
            />
          </div>

          <div className={styles.admin__form_group}>
            <label className={`${styles.admin__label} reular`} htmlFor="product-description">Опис</label>
            <textarea
              className={`${styles.admin__input} ${styles.admin__textarea} small _button_border`}
              id="product-description"
              placeholder="Опис"
              value={product.description}
              onChange={e => updateField("description", e.target.value)}
            />
          </div>

          <div className={styles.admin__form_group}>
            <label className={`${styles.admin__label} reular`} htmlFor="product-article">Артикул</label>
            <input
              className={`${styles.admin__input} small _button_border`}
              id="product-article"
              placeholder="Артикул"
              value={product.article}
              onChange={e => updateField("article", e.target.value)}
            />
          </div>

          <div className={styles.admin__form_group}>
            <label className={`${styles.admin__label} reular`} htmlFor="product-category">Категорія</label>
            <select
              className={`${styles.admin__input} small _button_border`}
              id="product-category"
              value={product.category_id}
              onChange={e => updateField("category_id", Number(e.target.value))}
            >
              <option value="">Виберіть категорію</option>

              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </form>

        <h3 className={`${styles.admin__title} regular`}>Варіанти</h3>

        {product.product_variants.map((variant, index) => (
          <form className={styles.admin__form} onSubmit={e => e.preventDefault()}>
            <div className={styles.admin__form_group}>
              <label className={`${styles.admin__label} reular`} htmlFor="variant-size">Розмір { index }</label>
              <input
                className={`${styles.admin__input} small _button_border`}
                id="variant-size"
                placeholder="Розмір"
                value={variant.size}
                onChange={e => updateVariant(index, "size", e.target.value)}
              />
            </div>

            <div className={styles.admin__form_group}>
              <label className={`${styles.admin__label} reular`} htmlFor="variant-color">Колір</label>
              <input
                className={`${styles.admin__input} small _button_border`}
                id="variant-color"
                placeholder="Колір"
                value={variant.color}
                onChange={e => updateVariant(index, "color", e.target.value)}
              />
            </div>

            <div className={styles.admin__form_group}>
              <label className={`${styles.admin__label} reular`} htmlFor="variant-sku">Ідентифікатор продукту</label>
              <input
                className={`${styles.admin__input} small _button_border`}
                id="variant-sku"
                placeholder="SKU"
                value={variant.sku}
                onChange={e => updateVariant(index, "sku", e.target.value)}
              />
            </div>

            <div className={styles.admin__form_group}>
              <label className={`${styles.admin__label} reular`} htmlFor="variant-price">Ціна</label>
              <input
                className={`${styles.admin__input} small _button_border`}
                id="variant-price"
                placeholder="Ціна"
                value={variant.price}
                onChange={e => updateVariant(index, "price", Number(e.target.value))}
              />
            </div>

            <div className={styles.admin__form_group}>
              <label className={`${styles.admin__label} reular`} htmlFor="variant-quantity">Кількість</label>
              <input
                className={`${styles.admin__input} small _button_border`}
                id="variant-quantity"
                placeholder="Кількість"
                value={variant.quantity}
                onChange={e => updateVariant(index, "quantity", Number(e.target.value))}
              />
            </div>

            <div className={styles.admin__form_group}>
              <label className={`${styles.admin__label} reular`} htmlFor="variant-weight">Вага</label>
              <input
                className={`${styles.admin__input} small _button_border`}
                id="variant-weight"
                placeholder="Вага"
                value={variant.weight}
                onChange={e => updateVariant(index, "weight", Number(e.target.value))}
              />
            </div>

            <div className={styles.admin__form_group}>
              <label className={`${styles.admin__label} reular`} htmlFor="variant-material">Матеріал</label>
              <select
                className={`${styles.admin__input} small _button_border`}
                id="variant-material"
                value={variant.material}
                onChange={e => updateVariant(index, "material", e.target.value)}
              >
                <option value="">Виберіть матеріал</option>

                {categories.filter((c, i) => c.parent_id == 40).map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.admin__form_group}>
              <label className={`${styles.admin__label} reular`} htmlFor="variant-image">Зображення</label>
              <input
                className={`${styles.admin__input} ${styles.admin__input_image} small _button_border`}
                id="variant-image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
              />
            </div>
          </form>
        ))}

        <div className={styles.admin__buttons}>
          <button className={`${styles.admin__button} regular _button _button_main _button_border regular upper`} onClick={addVariant}>
            Додати варіант
          </button>
          <button className={`${styles.admin__button} regular _button _button_main _button_border regular upper`} onClick={handleSubmit}>
            Створити продукт
          </button>
        </div>

      </section>
    </div>
  );
}