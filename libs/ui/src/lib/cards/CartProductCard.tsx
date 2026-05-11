import { Link } from 'react-router-dom';

import styles from '../../styles/components/cart-product-card.module.scss';

import { CartItem } from '@org/shared-types';
import { useCartStore } from '@org/utils/index';

export function CartProductCard({ cart_item }: { cart_item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className={`${styles['cart-item']}`}>
      <div className={`${styles['cart-item__picture']}`}>
        <picture>
          <source srcSet={`${cart_item.image}.avif`} type="image/avif" />
          <source srcSet={`${cart_item.image}.webp`} type="image/webp" />
          <img className={`${styles['cart-item__picture-image']}`} loading="lazy" src={`${cart_item.image}.png`} alt={cart_item.title} width={320} height={320} />
        </picture>
      </div>
      <div className={`${styles['cart-item__content']}`}>
        <button className={`${styles['cart-item__delete']}`} onClick={() => removeItem(Number(cart_item.id))}></button>
        <h3 className={`${styles['cart-item__title']} h h_s`}>{cart_item.title}</h3>
        <span className={`${styles['cart-item__size']} regular upper`}>Розмір: {cart_item.size}</span>
        <span className={`${styles['cart-item__price']} regular`}>{cart_item?.price?.toFixed(2)} ₴</span>
        <div className={`${styles['cart-item__count-control']}`}>
          <button className={`${styles['cart-item__button']} large`} onClick={() =>
            updateQuantity(Number(cart_item.id), cart_item.quantity - 1)
          }>-</button>
          <span className={`${styles['cart-item__count']} regular`}>{cart_item.quantity}</span>
          <button className={`${styles['cart-item__button']} large`} onClick={() =>
            updateQuantity(Number(cart_item.id), cart_item.quantity + 1)
          }>+</button>
        </div>
      </div>
    </div>
  );
}

export default CartProductCard;
