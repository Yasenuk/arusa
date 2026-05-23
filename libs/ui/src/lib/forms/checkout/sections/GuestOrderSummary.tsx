import { useGuestCartStore } from '@org/utils/index';
import styles from '../../../../styles/common/checkout.module.scss';

export default function GuestOrderSummary() {
  const items = useGuestCartStore((s) => s.items);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className={styles.checkout__step}>
      <h2 className={`${styles.checkout__title} large upper`}>Ваше замовлення</h2>
      <ul className={styles.checkout__list}>
        {items.map((item) => (
          <li key={item.product_variant_id} className={styles.checkout__item}>
            <span className={styles.checkout__quantity}>{item.quantity} × </span>
            <span className={styles.checkout__name}>
              {item.title}{item.size ? ` (${item.size})` : ''} —{' '}
            </span>
            <span className={styles.checkout__price}>
              [{((item.price * item.quantity) / 1000).toFixed(3)} ₴]
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.checkout__total}>
        <span>Разом:</span>
        <span>{(total / 1000).toFixed(3)} ₴</span>
      </div>
    </div>
  );
}
