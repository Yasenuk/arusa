import { useEffect } from 'react';

import { useOrderStore } from '@org/utils/index';
import { OrderCard } from '@org/ui';

import styles from '../profile.module.scss';

export default function Orders() {
	const { orders, fetchOrders } = useOrderStore();

	useEffect(() => { fetchOrders(); }, []);

	return (
		<section className={styles.profile__section}>
			<h2 className={`${styles.profile__title} large upper`}>Замовлення</h2>

			{orders.length === 0 && <p>Замовлень ще немає</p>}

			{orders.map(order => (
				<OrderCard key={order?.id} order={order} />
			))}
		</section>
	);
}