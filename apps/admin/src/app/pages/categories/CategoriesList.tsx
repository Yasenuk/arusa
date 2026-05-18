import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../api';
import styles from '../pages.module.scss';

type Category = { id: number; name: string; parent_id: number | null };

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити категорію?')) return;
    await adminFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const getParentName = (parent_id: number | null) => {
    if (!parent_id) return '—';
    return categories.find(c => c.id === parent_id)?.name ?? '—';
  };

  return (
    <div>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Категорії</h1>
        <Link to="/categories/create" className={styles.page__button}>+ Додати категорію</Link>
      </div>

      {loading && <p className={styles.page__empty}>Завантаження...</p>}
      {!loading && categories.length === 0 && <p className={styles.page__empty}>Категорій немає</p>}

      {!loading && categories.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>Назва</th><th>Батьківська</th><th>Дії</th></tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{getParentName(c.parent_id)}</td>
                <td>
                  <div className={styles.table__actions}>
                    <button className={`${styles.table__btn} ${styles.table__btn_danger}`} onClick={() => handleDelete(c.id)}>Видалити</button>
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
