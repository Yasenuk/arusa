import styles from './pages.module.scss';

export const STATUS_LABELS: Record<string, string> = {
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

export const STATUS_COLORS: Record<string, string> = {
  PENDING_CONFIRMATION: '#f39c12',
  CONFIRMED: '#3498db',
  PENDING_PAYMENT: '#e67e22',
  PAID: '#27ae60',
  PAYMENT_FAILED: '#c0392b',
  PENDING_SHIPMENT: '#8e44ad',
  SHIPPED: '#2980b9',
  DELIVERED: '#27ae60',
  CANCELED: '#7f8c8d',
};

type BadgeProps = { status: string };
export function StatusBadge({ status }: BadgeProps) {
  return (
    <span className={styles.badge} style={{ backgroundColor: STATUS_COLORS[status] ?? '#888' }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
