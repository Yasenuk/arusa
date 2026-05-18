import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../api';
import styles from '../pages.module.scss';

type Article = { id: number; title: string; created_at: string };

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

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
            <tr><th>ID</th><th>Назва</th><th>Дата</th><th>Дії</th></tr>
          </thead>
          <tbody>
            {articles.map(a => (
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
