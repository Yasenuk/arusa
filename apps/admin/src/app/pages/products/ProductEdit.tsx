import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminFetch } from '../../api';
import { useNotification } from '@org/ui';
import styles from '../pages.module.scss';
import appStyles from '../../app.module.scss';

type ProductVariant = {
  id?: number;
  size: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
  material: string;
  weight: number;
  product_images: { id?: number; image_url: string; position: number }[];
};

type ProductData = {
  id: number;
  title: string;
  description: string;
  article: string;
  category_id: number;
  is_active: boolean;
  product_variants: ProductVariant[];
};

type Category = { id: number; name: string; parent_id?: number | null };

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = adminFetch(`/api/admin/products/${id}`).then(async r => {
      if (!r.ok) throw new Error('Товар не знайдено');
      return r.json();
    });

    const fetchCategories = fetch('/api/categories').then(async r => {
      const text = await r.text();
      if (!text) return [];
      try { return JSON.parse(text); } catch { return []; }
    }).catch(() => []);

    Promise.all([fetchProduct, fetchCategories])
      .then(([prod, cats]) => {
        setProduct(prod);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(err => setError(err.message ?? 'Помилка завантаження'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className={styles.page__empty}>Завантаження...</p>;
  if (error || !product) return (
    <div>
      <Link to="/products" className={styles.page__back}>← Назад</Link>
      <p className={styles.page__empty}>{error ?? 'Товар не знайдено'}</p>
    </div>
  );

  const updateField = (field: string, value: any) =>
    setProduct(prev => prev ? { ...prev, [field]: value } : prev);

  const updateVariant = (index: number, field: string, value: any) => {
    setProduct(prev => {
      if (!prev) return prev;
      const product_variants = [...prev.product_variants];
      product_variants[index] = { ...product_variants[index], [field]: value };
      return { ...prev, product_variants };
    });
  };

  const addVariant = () => {
    setProduct(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        product_variants: [
          ...prev.product_variants,
          { size: '', color: '', sku: '', price: 0, quantity: 0, material: '', weight: 0, product_images: [] },
        ],
      };
    });
  };

  const removeVariant = (index: number) => {
    setProduct(prev => {
      if (!prev) return prev;
      return { ...prev, product_variants: prev.product_variants.filter((_, i) => i !== index) };
    });
    setPreviews(prev => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = Number(k);
        if (ki < index) next[ki] = v;
        else if (ki > index) next[ki - 1] = v;
      });
      return next;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviews(prev => ({ ...prev, [variantIndex]: URL.createObjectURL(file) }));
    updateVariant(variantIndex, 'product_images', [{ image_url: file.name, position: 0 }]);
  };

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          article: product.article,
          category_id: product.category_id,
          is_active: product.is_active,
          product_variants: product.product_variants,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        notify(err.error ?? 'Помилка збереження', 'error');
        return;
      }
      notify('Товар оновлено', 'success');
      navigate('/products');
    } finally {
      setSaving(false);
    }
  };

  const materials = categories.filter(c => c.parent_id === 40);

  return (
    <div>
      <Link to="/products" className={styles.page__back}>← Назад</Link>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Редагування: {product.title}</h1>
      </div>

      <div className={appStyles.admin__section}>
        <section className={appStyles.admin__container}>

          {/* Основні поля */}
          <div className={styles.form} style={{ marginBottom: 24, maxWidth: '100%' }}>
            <div className={styles.form__group}>
              <label className={styles.form__label}>Назва</label>
              <input
                className={styles.form__input}
                value={product.title}
                onChange={e => updateField('title', e.target.value)}
              />
            </div>

            <div className={styles.form__group}>
              <label className={styles.form__label}>Опис</label>
              <textarea
                className={`${styles.form__input} ${styles.form__textarea}`}
                value={product.description}
                onChange={e => updateField('description', e.target.value)}
              />
            </div>

            <div className={styles.form__group}>
              <label className={styles.form__label}>Артикул</label>
              <input
                className={styles.form__input}
                value={product.article}
                onChange={e => updateField('article', e.target.value)}
              />
            </div>

            <div className={styles.form__group}>
              <label className={styles.form__label}>Категорія</label>
              <select
                className={`${styles.form__input} ${styles.form__select}`}
                value={product.category_id}
                onChange={e => updateField('category_id', Number(e.target.value))}
              >
                <option value="">Виберіть категорію</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.form__group}>
              <label className={styles.form__label} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={product.is_active}
                  onChange={e => updateField('is_active', e.target.checked)}
                />
                Активний
              </label>
            </div>
          </div>

          {/* Варіанти */}
          <h3 className={`${appStyles.admin__title} regular`} style={{ marginBottom: 12 }}>Варіанти</h3>

          {product.product_variants.map((variant, index) => (
            <div key={variant.id ?? index} className={appStyles.admin__variant} style={{ flexDirection: 'column' }}>
              {/* Заголовок варіанту */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong className="small">Варіант {index + 1}</strong>
                <button
                  type="button"
                  className={`${styles.table__btn} ${styles.table__btn_danger}`}
                  onClick={() => removeVariant(index)}
                >
                  Видалити варіант
                </button>
              </div>

              {/* Зображення + поля */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div className={appStyles.admin__variant_preview}>
                {(previews[index] || variant.product_images[0]?.image_url)
                  ? <img
                      className={appStyles.admin__variant_image}
                      src={`${previews[index] || variant.product_images[0]?.image_url}.png`}
                      alt={`Варіант ${index + 1}`}
                    />
                  : <div className={appStyles.admin__variant_placeholder}>Немає зображення</div>
                }
                <input
                  className={`${appStyles.admin__input} ${appStyles.admin__input_image} small _button_border`}
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageUpload(e, index)}
                />
              </div>

              {/* Поля варіанту */}
              <form className={appStyles.admin__form} onSubmit={e => e.preventDefault()} style={{ flex: 1, minWidth: 300 }}>
                {[
                  { label: 'Розмір', field: 'size', type: 'text', value: variant.size },
                  { label: 'Колір', field: 'color', type: 'text', value: variant.color },
                  { label: 'SKU', field: 'sku', type: 'text', value: variant.sku },
                  { label: 'Ціна', field: 'price', type: 'number', value: variant.price },
                  { label: 'Кількість', field: 'quantity', type: 'number', value: variant.quantity },
                  { label: 'Вага', field: 'weight', type: 'number', value: variant.weight },
                ].map(({ label, field, type, value }) => (
                  <div key={field} className={appStyles.admin__form_group}>
                    <label className={`${appStyles.admin__lable} small`}>{label}</label>
                    <input
                      type={type}
                      className={`${appStyles.admin__input} small _button_border`}
                      value={value as string | number}
                      onChange={e => updateVariant(index, field, type === 'number' ? Number(e.target.value) : e.target.value)}
                    />
                  </div>
                ))}

                <div className={appStyles.admin__form_group}>
                  <label className={`${appStyles.admin__lable} small`}>Матеріал</label>
                  <select
                    className={`${appStyles.admin__input} small _button_border`}
                    value={variant.material}
                    onChange={e => updateVariant(index, 'material', e.target.value)}
                  >
                    <option value="">Виберіть матеріал</option>
                    {materials.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </form>
              </div>{/* кінець flex-row */}
            </div>
          ))}

          {/* Кнопки */}
          <div className={appStyles.admin__buttons} style={{ marginTop: 16 }}>
            <button
              className={`${styles.page__button} ${styles.page__button_secondary}`}
              onClick={addVariant}
            >
              + Додати варіант
            </button>
            <button
              className={styles.page__button}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </div>

        </section>
      </div>
    </div>
  );
}
