import { useEffect, useState } from 'react';
import { adminFetch } from '../../api';
import styles from '../pages.module.scss';

type AdminUser = { id: number; email: string; first_name: string; last_name: string; role: string; created_at: string };
type SortKey = 'id' | 'email' | 'last_name' | 'role' | 'created_at';
type SortDir = 'asc' | 'desc';

export default function UsersList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

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

  const handleDelete = async (id: number, email: string) => {
    if (!confirm(`Видалити користувача ${email}?`)) return;
    await adminFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...users].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = String(av).localeCompare(String(bv), 'uk');
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

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
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID{arrow('id')}</th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email{arrow('email')}</th>
              <th onClick={() => handleSort('last_name')} style={{ cursor: 'pointer' }}>Імʼя{arrow('last_name')}</th>
              <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>Роль{arrow('role')}</th>
              <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>Дата реєстрації{arrow('created_at')}</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(u => (
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
                <td>
                  <div className={styles.table__actions}>
                    <button
                      className={`${styles.table__btn} ${styles.table__btn_danger}`}
                      onClick={() => handleDelete(u.id, u.email)}
                    >
                      Видалити
                    </button>
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
