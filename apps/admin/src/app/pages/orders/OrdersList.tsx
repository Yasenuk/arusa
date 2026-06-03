import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../api';
import { StatusBadge } from '../shared';
import styles from '../pages.module.scss';

type AdminOrder = {
  id: number;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  user_email: string | null;
  guest_name: string | null;
  is_guest: boolean;
};

type SortKey = 'id' | 'status' | 'total_amount' | 'created_at';
type SortDir = 'asc' | 'desc';

const STATUS_OPTIONS = [
  'PENDING_CONFIRMATION', 'CONFIRMED', 'PENDING_PAYMENT',
  'PAID', 'PAYMENT_FAILED', 'PENDING_SHIPMENT',
  'SHIPPED', 'DELIVERED', 'CANCELED',
];

export default function OrdersList() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  useEffect(() => {
    const qs = statusFilter ? `?status=${statusFilter}` : '';
    adminFetch(`/api/admin/orders${qs}`)
      .then(r => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...orders].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv), 'uk');
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const arrow = (key: SortKey) => (<span style={{ position: 'absolute' }}>{sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}</span>);

  return (
    <div>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Замовлення</h1>
        <select
          className={styles.form__select}
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setLoading(true); }}
          style={{ width: 'auto' }}
        >
          <option value="">Всі статуси</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading && <p className={styles.page__empty}>Завантаження...</p>}
      {!loading && orders.length === 0 && <p className={styles.page__empty}>Замовлень немає</p>}

      {!loading && orders.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>#{ arrow('id')}</th>
              <th>Покупець</th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Статус{arrow('status')}</th>
              <th onClick={() => handleSort('total_amount')} style={{ cursor: 'pointer' }}>Сума{arrow('total_amount')}</th>
              <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>Дата{arrow('created_at')}</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.is_guest ? `Гість${o.guest_name ? `: ${o.guest_name}` : ''}` : (o.user_email ?? '—')}</td>
                <td><StatusBadge status={o.status} /></td>
                <td>{o.total_amount} {o.currency}</td>
                <td>{new Date(o.created_at).toLocaleDateString('uk-UA')}</td>
                <td>
                  <Link to={`/orders/${o.id}`} className={styles.table__btn}>Деталі</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
