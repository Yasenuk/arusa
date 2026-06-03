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
type SortKey = 'title' | 'article' | 'category' | 'price' | 'quantity';
type SortDir = 'asc' | 'desc';

export default function ProductsList() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...products].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = typeof av === 'number'
      ? (av as number) - (bv as number)
      : String(av).localeCompare(String(bv), 'uk');
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

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
              <th>Фото</th>
              <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>Назва{arrow('title')}</th>
              <th onClick={() => handleSort('article')} style={{ cursor: 'pointer' }}>Артикул{arrow('article')}</th>
              <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>Категорія{arrow('category')}</th>
              <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>Ціна{arrow('price')}</th>
              <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>К-сть{arrow('quantity')}</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => (
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
