import { useEffect } from 'react';
import { useOrderStore } from '@org/utils/index';
import { Order, OrderStatus } from '@org/shared-types';
import styles from '../profile.module.scss';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: 'Очікує підтвердження',
  CONFIRMED: 'Підтверджено',
  PENDING_PAYMENT: 'Очікує оплати',
  PAID: 'Оплачено',
  PAYMENT_FAILED: 'Помилка оплати',
  PENDING_SHIPMENT: 'Готується до відправки',
  SHIPPED: 'Відправлено',
  DELIVERED: 'Доставлено',
  CANCELED: 'Скасовано',
};

export default function Orders() {
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => { fetchOrders(); }, []);

  return (
    <section className={styles.profile__section}>
      <h2 className={`${styles.profile__title} large upper`}>Замовлення</h2>

      {orders.length === 0 && <p>Замовлень ще немає</p>}

      {orders.map(order => (
        <div key={order.id} className={styles.order_}>
          <div className={styles.order__header}>
            <h3 className={`${styles.order__title} regular`}>{STATUS_LABELS[order.status]}</h3>
            <p className={`${styles.order__date} regular`}>{new Date(order.created_at).toLocaleDateString('uk-UA')}</p>
            <p className={`${styles.order__amount} regular`}>{order.total_amount} {order.currency}</p>
          </div>

          <ul className={styles.order__items}>
            {order.items.map(item => (
              <li className={`${styles.order__item} regular`} key={item.id}>
                {item.quantity} × {item.title_snapshot} — {item.price_snapshot * item.quantity} {order.currency}
              </li>
            ))}
          </ul>

          {order.address && (
            <p className={styles.order__address}>
              {order.address.city} — {order.address.np_warehouse_description ?? `${order.address.street} ${order.address.house}`}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}