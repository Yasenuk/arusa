import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminFetch } from '../../api';
import styles from '../pages.module.scss';

export default function ArticleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', preview_text: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch(`/api/admin/articles/${id}`)
      .then(r => r.json())
      .then(data => setForm({ title: data.title, content: data.content, preview_text: data.preview_text ?? '', image_url: data.image_url ?? '' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminFetch(`/api/admin/articles/${id}`, { method: 'PATCH', body: JSON.stringify(form) });
      navigate('/articles');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.page__empty}>Завантаження...</p>;

  return (
    <div>
      <Link to="/articles" className={styles.page__back}>← Назад</Link>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Редагування статті</h1>
      </div>
      <div className={styles.form}>
        <div className={styles.form__group}>
          <label className={styles.form__label}>Назва</label>
          <input className={styles.form__input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className={styles.form__group}>
          <label className={styles.form__label}>Короткий опис</label>
          <input className={styles.form__input} value={form.preview_text} onChange={e => setForm({ ...form, preview_text: e.target.value })} />
        </div>
        <div className={styles.form__group}>
          <label className={styles.form__label}>Зображення (назва файлу)</label>
          <input className={styles.form__input} value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
        </div>
        <div className={styles.form__group}>
          <label className={styles.form__label}>Текст статті</label>
          <textarea className={`${styles.form__input} ${styles.form__textarea}`} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
        </div>
        <div className={styles.form__actions}>
          <button className={styles.page__button} onClick={handleSave} disabled={saving}>
            {saving ? 'Збереження...' : 'Зберегти'}
          </button>
          <Link to="/articles" className={`${styles.page__button} ${styles.page__button_secondary}`}>Скасувати</Link>
        </div>
      </div>
    </div>
  );
}
