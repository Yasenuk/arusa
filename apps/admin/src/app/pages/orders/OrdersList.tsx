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
  user_email: string;
};

const STATUS_OPTIONS = [
  'PENDING_CONFIRMATION', 'CONFIRMED', 'PENDING_PAYMENT',
  'PAID', 'PAYMENT_FAILED', 'PENDING_SHIPMENT',
  'SHIPPED', 'DELIVERED', 'CANCELED',
];

export default function OrdersList() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const qs = statusFilter ? `?status=${statusFilter}` : '';
    adminFetch(`/api/admin/orders${qs}`)
      .then(r => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [statusFilter]);

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
            <tr><th>#</th><th>Покупець</th><th>Статус</th><th>Сума</th><th>Дата</th><th>Дії</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.user_email}</td>
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
