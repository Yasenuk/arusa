import { useEffect, useState } from 'react';
import { adminFetch } from '../../api';
import styles from '../pages.module.scss';

type AdminUser = { id: number; email: string; first_name: string; last_name: string; role: string; created_at: string };

export default function UsersList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/users')
      .then(r => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id: number, role: string) => {
    await adminFetch(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  return (
    <div>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Користувачі</h1>
      </div>

      {loading && <p className={styles.page__empty}>Завантаження...</p>}
      {!loading && users.length === 0 && <p className={styles.page__empty}>Користувачів немає</p>}

      {!loading && users.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>Email</th><th>Імʼя</th><th>Роль</th><th>Дата реєстрації</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.last_name} {u.first_name}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    className={styles.form__select}
                    style={{ width: 'auto', padding: '4px 8px' }}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>{new Date(u.created_at).toLocaleDateString('uk-UA')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
