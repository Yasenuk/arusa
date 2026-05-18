import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../api';
import styles from '../pages.module.scss';

type AdminProduct = {
  id: number;
  title: string;
  article: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
};

export default function ProductsList() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/products')
      .then(r => r.json())
      .then(data => setProducts(data.data ?? data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити товар?')) return;
    await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Товари</h1>
        <Link to="/products/create" className={styles.page__button}>+ Додати товар</Link>
      </div>

      {loading && <p className={styles.page__empty}>Завантаження...</p>}
      {!loading && products.length === 0 && <p className={styles.page__empty}>Товарів немає</p>}

      {!loading && products.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Фото</th><th>Назва</th><th>Артикул</th><th>Категорія</th><th>Ціна</th><th>К-сть</th><th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  {p.image
                    ? (
                      <picture>
                        <source srcSet={`${p.image}.avif`} type='image/avif' />
                        <source srcSet={`${p.image}.webp`} type='image/webp' />
                        <img src={`${p.image}.png`} alt={p.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                      </picture>
                    )
                    : '—'
                  }
                </td>
                <td>{p.title}</td>
                <td>{p.article}</td>
                <td>{p.category}</td>
                <td>{p.price} грн</td>
                <td>{p.quantity}</td>
                <td>
                  <div className={styles.table__actions}>
                    <Link to={`/products/${p.id}/edit`} className={styles.table__btn}>Редагувати</Link>
                    <button className={`${styles.table__btn} ${styles.table__btn_danger}`} onClick={() => handleDelete(p.id)}>Видалити</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
