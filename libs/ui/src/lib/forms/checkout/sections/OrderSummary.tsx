import { useCartStore } from '@org/utils/index';

import styles from '../../../../styles/common/checkout.module.scss';

export default function OrderSummary() {
  const cart = useCartStore(s => s.cart);
  const items = cart?.cart?.cart_items ?? [];
  const total = cart?.totalItems?.price ?? 0;

  return (
    <div className={styles.checkout__step}>
      <h2 className={`${styles.checkout__title} large upper`}>Ваше замовлення</h2>
      <ul className={styles.checkout__list}>
        {items.map((item, i) => (
          <li key={i} className={styles.checkout__item}>
            <span className={styles.checkout__quantity}>{item.quantity} × </span>
            <span className={styles.checkout__name}>{item.title} ({item.size}) — </span>
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