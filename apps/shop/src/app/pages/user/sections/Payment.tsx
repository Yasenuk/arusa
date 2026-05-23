import { useEffect, useState } from 'react';
import { fetchWithAuth, loadData } from '@org/utils/index';

import styles from '../profile.module.scss';
import pStyles from './payment.module.scss';
import { _Payment } from '@org/shared-types';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Очікує',
  SUCCESS: 'Оплачено',
  FAILED: 'Не вдалось',
  CANCELED: 'Скасовано',
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_CONFIRMATION: 'Підтвердження',
  CONFIRMED: 'Підтверджено',
  PENDING_PAYMENT: 'Очікує оплати',
  PAID: 'Оплачено',
  PAYMENT_FAILED: 'Оплата не вдалась',
  PENDING_SHIPMENT: 'Готується до відправки',
  SHIPPED: 'Відправлено',
  DELIVERED: 'Доставлено',
  CANCELED: 'Скасовано',
};

export default function Payment() {
  const [payments, setPayments] = useState<_Payment[]>([]);

  const downloadReceipt = async (paymentId: number) => {
    const res = await fetchWithAuth(`/api/payments/${paymentId}/receipt`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadData('/api/payments').then(setPayments);
  }, []);

  return (
    <section className={styles.profile__section}>
      <h2 className={`${styles.profile__title} large upper`}>Оплата</h2>

      {payments.length === 0 && (
        <p className="regular" style={{ color: 'var(--color-opal)' }}>Платежів ще немає</p>
      )}

      <div className={pStyles.list}>
        {payments.map(p => (
          <div key={p.id} className={pStyles.card}>
            <div className={pStyles.card__header}>
              <span className={`${pStyles.card__id} regular`}>Оплата #{p.id}</span>
              <span className={`${pStyles['card__status']} ${pStyles[`card__status_${p.status.toLowerCase()}`]} small upper`}>
                {STATUS_LABELS[p.status] ?? p.status}
              </span>
            </div>

            <div className={pStyles.card__body}>
              <div className={pStyles.card__row}>
                <span className={`${pStyles.card__label} small`}>Замовлення</span>
                <span className="regular">#{p.order_id}</span>
              </div>
              <div className={pStyles.card__row}>
                <span className={`${pStyles.card__label} small`}>Статус замовлення</span>
                <span className="regular">{ORDER_STATUS_LABELS[p.order.status] ?? p.order.status}</span>
              </div>
              <div className={pStyles.card__row}>
                <span className={`${pStyles.card__label} small`}>Сума замовлення</span>
                <span className="regular">{p.order.total_amount} {p.currency}</span>
              </div>
              <div className={pStyles.card__row}>
                <span className={`${pStyles.card__label} small`}>Оплачено</span>
                <span className={`${pStyles.card__amount} regular`}>{p.amount} {p.currency}</span>
              </div>
              <div className={pStyles.card__row}>
                <span className={`${pStyles.card__label} small`}>Провайдер</span>
                <span className="regular">{p.provider}</span>
              </div>
              <div className={pStyles.card__row}>
                <span className={`${pStyles.card__label} small`}>Дата</span>
                <span className="regular">
                  {new Date(p.created_at).toLocaleDateString('uk-UA', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              {p.transaction_id && (
                <div className={pStyles.card__row}>
                  <span className={`${pStyles.card__label} small`}>ID транзакції</span>
                  <span className={`${pStyles.card__txid} small`}>{p.transaction_id}</span>
                </div>
              )}
            </div>

            {p.status === 'SUCCESS' && (
              <div className={pStyles.card__footer}>
                <button
                  className={`${pStyles.card__receipt} _button _button_border small upper`}
                  onClick={() => downloadReceipt(p.id)}
                >
                  Завантажити квитанцію PDF
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
