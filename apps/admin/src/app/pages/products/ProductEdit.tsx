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

  useEffect(() => {
    Promise.all([
      adminFetch(`/api/admin/products/${id}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([prod, cats]) => {
      setProduct(prod);
      setCategories(cats);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className={styles.page__empty}>Завантаження...</p>;
  if (!product) return <p className={styles.page__empty}>Товар не знайдено</p>;

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

          <form className={appStyles.admin__form} onSubmit={e => e.preventDefault()}>
            <div className={appStyles.admin__form_group}>
              <label className={`${appStyles.admin__label} regular`}>Назва</label>
              <input
                className={`${appStyles.admin__input} small _button_border`}
                value={product.title}
                onChange={e => updateField('title', e.target.value)}
              />
            </div>

            <div className={appStyles.admin__form_group}>
              <label className={`${appStyles.admin__label} regular`}>Опис</label>
              <textarea
                className={`${appStyles.admin__input} ${appStyles.admin__textarea} small _button_border`}
                value={product.description}
                onChange={e => updateField('description', e.target.value)}
              />
            </div>

            <div className={appStyles.admin__form_group}>
              <label className={`${appStyles.admin__label} regular`}>Артикул</label>
              <input
                className={`${appStyles.admin__input} small _button_border`}
                value={product.article}
                onChange={e => updateField('article', e.target.value)}
              />
            </div>

            <div className={appStyles.admin__form_group}>
              <label className={`${appStyles.admin__label} regular`}>Категорія</label>
              <select
                className={`${appStyles.admin__input} small _button_border`}
                value={product.category_id}
                onChange={e => updateField('category_id', Number(e.target.value))}
              >
                <option value="">Виберіть категорію</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className={appStyles.admin__form_group}>
              <label className={`${appStyles.admin__label} regular`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={product.is_active}
                  onChange={e => updateField('is_active', e.target.checked)}
                />
                Активний
              </label>
            </div>
          </form>

          <h3 className={`${appStyles.admin__title} regular`}>Варіанти</h3>

          {product.product_variants.map((variant, index) => (
            <div key={variant.id ?? index} className={appStyles.admin__variant}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong className="small">Варіант {index + 1}</strong>
                <button
                  type="button"
                  className={`${appStyles.admin__button} regular _button _button_border regular`}
                  style={{ color: '#c0392b', borderColor: '#c0392b', padding: '4px 12px' }}
                  onClick={() => removeVariant(index)}
                >
                  Видалити варіант
                </button>
              </div>

              <div className={appStyles.admin__variant_preview}>
                {(previews[index] || variant.product_images[0]?.image_url)
                  ? <img
                      className={appStyles.admin__variant_image}
                      src={previews[index] || variant.product_images[0]?.image_url}
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

              <form className={appStyles.admin__form} onSubmit={e => e.preventDefault()}>
                <div className={appStyles.admin__form_group}>
                  <label className={`${appStyles.admin__label} regular`}>Розмір</label>
                  <input
                    className={`${appStyles.admin__input} small _button_border`}
                    value={variant.size}
                    onChange={e => updateVariant(index, 'size', e.target.value)}
                  />
                </div>
                <div className={appStyles.admin__form_group}>
                  <label className={`${appStyles.admin__label} regular`}>Колір</label>
                  <input
                    className={`${appStyles.admin__input} small _button_border`}
                    value={variant.color}
                    onChange={e => updateVariant(index, 'color', e.target.value)}
                  />
                </div>
                <div className={appStyles.admin__form_group}>
                  <label className={`${appStyles.admin__label} regular`}>SKU</label>
                  <input
                    className={`${appStyles.admin__input} small _button_border`}
                    value={variant.sku}
                    onChange={e => updateVariant(index, 'sku', e.target.value)}
                  />
                </div>
                <div className={appStyles.admin__form_group}>
                  <label className={`${appStyles.admin__label} regular`}>Ціна</label>
                  <input
                    type="number"
                    className={`${appStyles.admin__input} small _button_border`}
                    value={variant.price}
                    onChange={e => updateVariant(index, 'price', Number(e.target.value))}
                  />
                </div>
                <div className={appStyles.admin__form_group}>
                  <label className={`${appStyles.admin__label} regular`}>Кількість</label>
                  <input
                    type="number"
                    className={`${appStyles.admin__input} small _button_border`}
                    value={variant.quantity}
                    onChange={e => updateVariant(index, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className={appStyles.admin__form_group}>
                  <label className={`${appStyles.admin__label} regular`}>Вага</label>
                  <input
                    type="number"
                    className={`${appStyles.admin__input} small _button_border`}
                    value={variant.weight}
                    onChange={e => updateVariant(index, 'weight', Number(e.target.value))}
                  />
                </div>
                <div className={appStyles.admin__form_group}>
                  <label className={`${appStyles.admin__label} regular`}>Матеріал</label>
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
            </div>
          ))}

          <div className={appStyles.admin__buttons}>
            <button
              className={`${appStyles.admin__button} regular _button _button_main _button_border regular upper`}
              onClick={addVariant}
            >
              Додати варіант
            </button>
            <button
              className={`${appStyles.admin__button} regular _button _button_main _button_border regular upper`}
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
