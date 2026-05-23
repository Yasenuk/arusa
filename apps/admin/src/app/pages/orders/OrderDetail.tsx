import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminFetch } from '../../api';
import { StatusBadge, STATUS_LABELS } from '../shared';
import styles from '../pages.module.scss';

type OrderDetail = {
  id: number;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  user_email: string | null;
  is_guest: boolean;
  guest_name: string | null;
  guest_phone: string | null;
  guest_city: string | null;
  guest_np_warehouse: string | null;
  address: { city: string; np_warehouse_description: string } | null;
  delivery: { status: string; tracking_number: string | null } | null;
  items: { title_snapshot: string; quantity: number; price_snapshot: number }[];
};

const STATUS_OPTIONS = [
  'PENDING_CONFIRMATION', 'CONFIRMED', 'PENDING_PAYMENT',
  'PAID', 'PAYMENT_FAILED', 'PENDING_SHIPMENT',
  'SHIPPED', 'DELIVERED', 'CANCELED',
];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(data => { setOrder(data); setNewStatus(data.status); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async () => {
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setOrder(prev => prev ? { ...prev, status: updated.status } : prev);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDelivery = async () => {
    if (!tracking) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/orders/${id}/delivery`, {
        method: 'POST',
        body: JSON.stringify({ tracking_number: tracking }),
      });
      const delivery = await res.json();
      setOrder(prev => prev ? { ...prev, delivery } : prev);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.page__empty}>Завантаження...</p>;
  if (!order) return <p className={styles.page__empty}>Замовлення не знайдено</p>;

  return (
    <div>
      <Link to="/orders" className={styles.page__back}>← Назад</Link>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Замовлення #{order.id}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className={styles.detail}>
        {/* Інфо */}
        <div className={styles.detail__card}>
          <div className={styles.detail__title}>Інформація</div>
          {order.is_guest && (
            <div className={styles.detail__row}><span className={styles.detail__key}>Тип</span><span className={styles.detail__value}>Гостьове замовлення</span></div>
          )}
          {order.guest_name && (
            <div className={styles.detail__row}><span className={styles.detail__key}>Ім&apos;я</span><span className={styles.detail__value}>{order.guest_name}</span></div>
          )}
          <div className={styles.detail__row}><span className={styles.detail__key}>Email</span><span className={styles.detail__value}>{order.user_email ?? '—'}</span></div>
          {order.guest_phone && (
            <div className={styles.detail__row}><span className={styles.detail__key}>Телефон</span><span className={styles.detail__value}>{order.guest_phone}</span></div>
          )}
          <div className={styles.detail__row}><span className={styles.detail__key}>Сума</span><span className={styles.detail__value}>{order.total_amount} {order.currency}</span></div>
          <div className={styles.detail__row}><span className={styles.detail__key}>Дата</span><span className={styles.detail__value}>{new Date(order.created_at).toLocaleString('uk-UA')}</span></div>
          {order.address && (
            <div className={styles.detail__row}>
              <span className={styles.detail__key}>Адреса</span>
              <span className={styles.detail__value}>{order.address.city} — {order.address.np_warehouse_description}</span>
            </div>
          )}
          {order.is_guest && order.guest_city && (
            <div className={styles.detail__row}>
              <span className={styles.detail__key}>Адреса</span>
              <span className={styles.detail__value}>{order.guest_city}{order.guest_np_warehouse ? ` — ${order.guest_np_warehouse}` : ''}</span>
            </div>
          )}
        </div>

        {/* Товари */}
        <div className={styles.detail__card}>
          <div className={styles.detail__title}>Товари</div>
          <table className={styles.table}>
            <thead><tr><th>Назва</th><th>К-сть</th><th>Ціна</th><th>Разом</th></tr></thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.title_snapshot}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price_snapshot} грн</td>
                  <td>{item.price_snapshot * item.quantity} грн</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Зміна статусу */}
        <div className={styles.detail__card}>
          <div className={styles.detail__title}>Змінити статус</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select
              className={styles.form__select}
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              style={{ width: 'auto' }}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>)}
            </select>
            <button className={styles.page__button} onClick={handleStatusChange} disabled={saving || newStatus === order.status}>
              Зберегти
            </button>
          </div>
        </div>

        {/* Доставка */}
        <div className={styles.detail__card}>
          <div className={styles.detail__title}>Доставка</div>
          {order.delivery ? (
            <>
              <div className={styles.detail__row}><span className={styles.detail__key}>Статус</span><span className={styles.detail__value}>{order.delivery.status}</span></div>
              {order.delivery.tracking_number && (
                <div className={styles.detail__row}>
                  <span className={styles.detail__key}>ТТН</span>
                  <span className={styles.detail__value}>
                    <a href={`https://novaposhta.ua/tracking/?cargo_number=${order.delivery.tracking_number}`} target="_blank" rel="noreferrer">
                      {order.delivery.tracking_number}
                    </a>
                  </span>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                className={styles.form__input}
                placeholder="Номер ТТН"
                value={tracking}
                onChange={e => setTracking(e.target.value)}
                style={{ width: 200 }}
              />
              <button className={styles.page__button} onClick={handleAddDelivery} disabled={saving || !tracking}>
                Додати ТТН
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
