import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  parent_id: number | null;
};

type Image = {
  name: string;
  preview: string;
};

type Variant = {
  size: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
  images: Image[];
};

export default function AdminCreateProduct() {

  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [article, setArticle] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");

  const [variants, setVariants] = useState<Variant[]>([]);

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

  function addVariant() {
    setVariants([
      ...variants,
      {
        size: "",
        color: "",
        sku: "",
        price: 0,
        quantity: 0,
        images: []
      }
    ]);
  }

  function updateVariant(index: number, field: keyof Variant, value: any) {
    const copy = [...variants];
    copy[index] = { ...copy[index], [field]: value };
    setVariants(copy);
  }

  function handleVariantImages(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).map(file => ({
      name: file.name,
      preview: URL.createObjectURL(file)
    }));

    const copy = [...variants];
    copy[index].images = [...copy[index].images, ...files];

    setVariants(copy);
  }

  function removeVariantImage(variantIndex: number, imageIndex: number) {
    const copy = [...variants];
    copy[variantIndex].images = copy[variantIndex].images.filter(
      (_, i) => i !== imageIndex
    );
    setVariants(copy);
  }

  function removeVariant(index: number) {
    setVariants(prev => prev.filter((_, i) => i !== index));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title,
      description,
      material,
      article,
      weight,
      category_id: categoryId || null,
      variants: variants.map(v => ({
        ...v,
        images: v.images.map(img => img.name)
      }))
    };

    await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    setTitle("");
    setDescription("");
    setMaterial("");
    setArticle("");
    setWeight("");
    setCategoryId("");
    setVariants([]);
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 900 }}>

      <h2>Створити товар</h2>

      <h3>Основна інформація</h3>

      <input
        placeholder="Назва"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Опис"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <input
        placeholder="Матеріал"
        value={material}
        onChange={e => setMaterial(e.target.value)}
      />

      <input
        placeholder="Артикул"
        value={article}
        onChange={e => setArticle(e.target.value)}
      />

      <select
        value={categoryId}
        onChange={e => setCategoryId(Number(e.target.value))}
      >
        <option value="">Категорія</option>

        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <h3>Варіанти товару</h3>

      {variants.map((v, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>

          <input
            placeholder="Size"
            value={v.size}
            onChange={e => updateVariant(i, "size", e.target.value)}
          />

          <input
            placeholder="Колір"
            value={v.color}
            onChange={e => updateVariant(i, "color", e.target.value)}
          />

          <input
            placeholder="SKU"
            value={v.sku}
            onChange={e => updateVariant(i, "sku", e.target.value)}
          />

          <input
            type="number"
            placeholder="Вага"
            value={weight}
            onChange={e => setWeight(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Ціна"
            value={v.price}
            onChange={e => updateVariant(i, "price", Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Кількість"
            value={v.quantity}
            onChange={e => updateVariant(i, "quantity", Number(e.target.value))}
          />

          <div>
            <input
              type="file"
              multiple
              onChange={e => handleVariantImages(i, e)}
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {v.images.map((img, imgIndex) => (
              <div key={imgIndex}>
                <img
                  src={img.preview}
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
                <button
                  type="button"
                  onClick={() => removeVariantImage(i, imgIndex)}
                >
                  Видалити
                </button>
              </div>
            ))}
          </div>

          <button type="button" onClick={() => removeVariant(i)}>
            Видалити варіант
          </button>

        </div>
      ))}

      <button type="button" onClick={addVariant}>
        Додати варіант
      </button>

      <br /><br />

      <button type="submit">
        Створити товар
      </button>

    </form>
  );
}