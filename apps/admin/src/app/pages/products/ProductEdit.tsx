import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminFetch } from '../../api';
import styles from '../pages.module.scss';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch(`/api/admin/products/${id}`)
      .then(r => r.json())
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminFetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: product.title, description: product.description, is_active: product.is_active }),
      });
      navigate('/products');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.page__empty}>Завантаження...</p>;
  if (!product) return <p className={styles.page__empty}>Товар не знайдено</p>;

  return (
    <div>
      <Link to="/products" className={styles.page__back}>← Назад</Link>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Редагування: {product.title}</h1>
      </div>
      <div className={styles.form}>
        <div className={styles.form__group}>
          <label className={styles.form__label}>Назва</label>
          <input className={styles.form__input} value={product.title} onChange={e => setProduct({ ...product, title: e.target.value })} />
        </div>
        <div className={styles.form__group}>
          <label className={styles.form__label}>Опис</label>
          <textarea className={`${styles.form__input} ${styles.form__textarea}`} value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} />
        </div>
        <div className={styles.form__group}>
          <label className={styles.form__label}>
            <input type="checkbox" checked={product.is_active} onChange={e => setProduct({ ...product, is_active: e.target.checked })} />
            {' '}Активний
          </label>
        </div>
        <div className={styles.form__actions}>
          <button className={styles.page__button} onClick={handleSave} disabled={saving}>
            {saving ? 'Збереження...' : 'Зберегти'}
          </button>
          <Link to="/products" className={`${styles.page__button} ${styles.page__button_secondary}`}>Скасувати</Link>
        </div>
      </div>
    </div>
  );
}
