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

export default function PaymentsList() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/payments')
      .then(r => r.json())
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

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
            <tr><th>#</th><th>Замовлення</th><th>Покупець</th><th>Провайдер</th><th>Статус</th><th>Сума</th><th>ID транзакції</th><th>Дата</th></tr>
          </thead>
          <tbody>
            {payments.map(p => (
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
