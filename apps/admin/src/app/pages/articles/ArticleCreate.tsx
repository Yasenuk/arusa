import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminFetch } from '../../api';
import styles from '../pages.module.scss';

export default function ArticleCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', preview_text: '', image_url: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!form.title) { setError('Назва обовʼязкова'); return; }
    setSaving(true);
    try {
      const res = await adminFetch('/api/admin/articles', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (!res.ok) { setError((await res.json()).error); return; }
      navigate('/articles');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link to="/articles" className={styles.page__back}>← Назад</Link>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Нова стаття</h1>
      </div>
      <div className={styles.form}>
        {error && <p className={styles.form__error}>{error}</p>}
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
          <input className={styles.form__input} placeholder="article-photo.jpg" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
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
