import { useEffect, useState } from 'react';
import { loadData } from '@org/utils/index';

import styles from '../profile.module.scss';
import { _Payment } from '@org/shared-types';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Очікує',
  SUCCESS: 'Успішно',
  FAILED: 'Не вдалось',
  CANCELED: 'Скасовано',
};

export default function Payment() {
  const [payments, setPayments] = useState<_Payment[]>([]);

  useEffect(() => {
    loadData('/api/payments').then(setPayments);
  }, []);

  return (
    <section className={styles.profile__section}>
      <h2 className={`${styles.profile__title} large upper`}>Оплата</h2>

      {payments.length === 0 && <p>Платежів ще немає</p>}

      {payments.map(p => (
        <div key={p.id} className={styles.profile__payment}>
          <span>Замовлення #{p.order_id}</span>
          <span>{STATUS_LABELS[p.status]}</span>
          <span>{p.amount} {p.currency}</span>
          <span>{new Date(p.created_at).toLocaleDateString('uk-UA')}</span>
          {p.transaction_id && <span className="small">ID: {p.transaction_id}</span>}
        </div>
      ))}
    </section>
  );
}