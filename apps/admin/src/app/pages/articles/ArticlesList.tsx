import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../api';
import styles from '../pages.module.scss';

type Article = { id: number; title: string; created_at: string };
type SortKey = 'id' | 'title' | 'created_at';
type SortDir = 'asc' | 'desc';

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  useEffect(() => {
    adminFetch('/api/admin/articles')
      .then(r => r.json())
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити статтю?')) return;
    await adminFetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...articles].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv), 'uk');
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const arrow = (key: SortKey) => (<span style={{ position: 'absolute' }}>{sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}</span>);

  return (
    <div>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Статті</h1>
        <Link to="/articles/create" className={styles.page__button}>+ Додати статтю</Link>
      </div>

      {loading && <p className={styles.page__empty}>Завантаження...</p>}
      {!loading && articles.length === 0 && <p className={styles.page__empty}>Статей немає</p>}

      {!loading && articles.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID{arrow('id')}</th>
              <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>Назва{arrow('title')}</th>
              <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>Дата{arrow('created_at')}</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.title}</td>
                <td>{new Date(a.created_at).toLocaleDateString('uk-UA')}</td>
                <td>
                  <div className={styles.table__actions}>
                    <Link to={`/articles/${a.id}/edit`} className={styles.table__btn}>Редагувати</Link>
                    <button className={`${styles.table__btn} ${styles.table__btn_danger}`} onClick={() => handleDelete(a.id)}>Видалити</button>
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
