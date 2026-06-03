import { useEffect, useState } from 'react';
import { adminFetch } from '../../api';
import { StatusBadge } from '../shared';
import styles from '../pages.module.scss';

type AdminPayment = {
  id: number;
  order_id: number;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  transaction_id: string | null;
  created_at: string;
  user_email: string;
};

type SortKey = 'id' | 'order_id' | 'user_email' | 'provider' | 'status' | 'amount' | 'created_at';
type SortDir = 'asc' | 'desc';

export default function PaymentsList() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  useEffect(() => {
    adminFetch('/api/admin/payments')
      .then(r => r.json())
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...payments].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv), 'uk');
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const arrow = (key: SortKey) => (<span style={{ position: 'absolute' }}>{sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}</span>);

  return (
    <div>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Платежі</h1>
      </div>

      {loading && <p className={styles.page__empty}>Завантаження...</p>}
      {!loading && payments.length === 0 && <p className={styles.page__empty}>Платежів немає</p>}

      {!loading && payments.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>#{ arrow('id')}</th>
              <th onClick={() => handleSort('order_id')} style={{ cursor: 'pointer' }}>Замовлення{arrow('order_id')}</th>
              <th onClick={() => handleSort('user_email')} style={{ cursor: 'pointer' }}>Покупець{arrow('user_email')}</th>
              <th onClick={() => handleSort('provider')} style={{ cursor: 'pointer' }}>Провайдер{arrow('provider')}</th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Статус{arrow('status')}</th>
              <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>Сума{arrow('amount')}</th>
              <th>ID транзакції</th>
              <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>Дата{arrow('created_at')}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>#{p.order_id}</td>
                <td>{p.user_email}</td>
                <td>{p.provider}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>{p.amount} {p.currency}</td>
                <td style={{ fontSize: 11, color: '#888' }}>{p.transaction_id ?? '—'}</td>
                <td>{new Date(p.created_at).toLocaleDateString('uk-UA')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
