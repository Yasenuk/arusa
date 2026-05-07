import { useCartStore } from '@org/utils/index';
import styles from '../checkout.module.scss';

export default function OrderSummary() {
  const cart = useCartStore(s => s.cart);
  const items = cart?.cart?.cart_items ?? [];
  const total = cart?.totalItems?.price ?? 0;

  return (
    <div className={styles.summary}>
      <h2 className={`${styles.summary__title} large upper`}>Ваше замовлення</h2>
      <ul className={styles.summary__list}>
        {items.map((item, i) => (
          <li key={i} className={styles.summary__item}>
            <span className={styles.summary__name}>{item.title} — {item.size}</span>
            <span className={styles.summary__qty}>×{item.quantity}</span>
            <span className={styles.summary__price}>
              {((item.price * item.quantity) / 1000).toFixed(3)} ₴
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.summary__total}>
        <span>Разом:</span>
        <span>{(total / 1000).toFixed(3)} ₴</span>
      </div>
    </div>
  );
}