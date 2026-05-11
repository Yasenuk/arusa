import { Order, OrderStatus } from "@org/shared-types";
import { initiateLiqPay } from "@org/utils/index";

import styles from "../../styles/components/order-card.module.scss";

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

export function OrderCard({ order }: { order: Order }) {
	return (
		<div key={order.id} className={styles.order}>
			<div className={styles.order__header}>
				<h3 className={`${styles.order__status} regular`}>{STATUS_LABELS[order.status]}</h3>
				<p className={`${styles.order__date} regular`}>{new Date(order.created_at).toLocaleDateString('uk-UA')}</p>
			</div>

			<ul className={styles.order__items}>
				{order.items.map(item => (
					<li className={`${styles.order__item} regular`} key={item.id}>
						{item.quantity} × {item.title_snapshot} [{item.price_snapshot * item.quantity} {order.currency}]
					</li>
				))}
			</ul>

			<p className={`${styles.order__amount} regular`}>
				До сплати: {order.total_amount} {order.currency}
			</p>

			{order.address && (
				<p className={styles.order__address}>
					Адреса доставки: {order.address.city} — {order.address.np_warehouse_description ?? `${order.address.street} ${order.address.house}`}
				</p>
			)}

			{(order.status === 'PENDING_CONFIRMATION' || order.status === 'PENDING_PAYMENT') && (
				<button
					className={`${styles.order__button} _button _button_border _button_main _button_fill small upper`}
					onClick={() => initiateLiqPay(order.id)}
				>
					Оплатити
				</button>
			)}
		</div>
	);
}

export default OrderCard;