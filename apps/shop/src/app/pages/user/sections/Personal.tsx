import { useEffect, useState } from 'react';
import { User } from '@org/shared-types';
import { useAuth } from '@org/ui';
import { fetchWithAuth } from '@org/utils/index';
import styles from '../profile.module.scss';
import { Link } from 'react-router-dom';

type FormState = {
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
};

const toForm = (user: User | null): FormState => ({
  first_name: user?.first_name ?? '',
  last_name: user?.last_name ?? '',
  middle_name: user?.middle_name ?? '',
  phone: user?.phone ?? '',
});

export default function Personal({ user, onUpdate }: { user: User | null; onUpdate: (user: User) => void }) {
  const { logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(toForm(user));

  useEffect(() => {
    if (user) setForm(toForm(user));
  }, [user]);

  const handleSave = async () => {
    const original = toForm(user);
    const changes = (Object.keys(form) as (keyof FormState)[]).reduce(
      (acc, key) => {
        if (form[key] !== original[key]) acc[key] = form[key];
        return acc;
      },
      {} as Partial<FormState>
    );

    if (Object.keys(changes).length === 0) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      const res = await fetchWithAuth('/api/me', {
        method: 'PATCH',
        body: JSON.stringify(changes),
      });
      const updated = await res.json();
      onUpdate(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(toForm(user));
    setEditing(false);
  };

  const field = (label: string, key: keyof FormState) => (
    <div className={styles.profile__info_item}>
      <span className={`${styles.profile__info_label} regular`}>{label}:</span>
      {editing
        ? <input
            className={`${styles.profile__input} regular`}
            value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          />
        : <span className={`${styles.profile__info_value} regular`}>{form[key] || 'Не вказано'}</span>
      }
    </div>
  );

  return (
    <section className={styles.profile__section}>
      <h2 className={`${styles.profile__title} large upper`}>Персональні дані</h2>

      {!user && <p className={`${styles['profile__no-data']} regular`}>Немає даних користувача</p>}

      {user && (
        <div className={styles.profile__info}>
          {field("Ім'я", 'first_name')}
          {field('Прізвище', 'last_name')}
          {field('По-батькові', 'middle_name')}
          {field('Номер телефону', 'phone')}
          <div className={styles.profile__info_item}>
            <span className={`${styles.profile__info_label} regular`}>Email:</span>
            <span className={`${styles.profile__info_value} regular`}>{user.email}</span>
          </div>
        </div>
      )}

      <div className={styles.profile__buttons}>
        {editing ? (
          <>
            <button
              className={`${styles.profile__button} _button _button_main _button_border small upper`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Збереження...' : 'Зберегти'}
            </button>
            <button
              className={`${styles.profile__button} _button _button_main _button_border small upper`}
              onClick={handleCancel}
            >
              Скасувати
            </button>
          </>
        ) : (
          <>
            <button
              className={`${styles.profile__button} _button _button_main _button_border small upper`}
              onClick={() => setEditing(true)}
            >
              Редагувати
            </button>
            <Link to={"/"}
              className={`${styles.profile__button} _button _button_main _button_border small upper`}
              onClick={logout}
            >
              Вийти
            </Link>
          </>
        )}
      </div>
    </section>
  );
}