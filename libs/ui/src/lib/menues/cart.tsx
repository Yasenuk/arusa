import { useEffect, useState } from "react";

import { useCartStore } from "@org/utils/index";

import styles from "../../styles/components/cart.module.scss";

import CartProductCard from "../cards/CartProductCard";
import Checkout from "../forms/checkout/Checkout";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Cart({ isOpen, setIsOpen }: Props) {
  const get_cart = useCartStore(s => s.cart);
  const fetchCart = useCartStore(s => s.fetchCart);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const closeCart = () => {
    setIsOpen(false);
    document.body.classList.remove("_locked");
  };

  return (
    <div className={`${styles.cart} ${isOpen ? styles.cart_open : ""}`}>
      <button aria-label="Close cart" type="button" className={styles['cart__main-button']} onClick={toggleCart}>
        Кошик
        <span className={styles['cart__quantity']}>{get_cart?.cart?.cart_items?.length}</span>
      </button>
      <div className={styles.cart__wrapper}>
        <div className={styles.cart__body}>
          <header className={styles.cart__header}>
            <h2 className={`${styles.cart__title} large upper`}>Зведення замовлення</h2>
            <button className={styles.cart__close} onClick={closeCart}></button>
          </header>
          <div className={styles.cart__content}>
            {get_cart?.cart?.cart_items?.map((item, index) => (
              <CartProductCard key={index} cart_item={item} />
            ))}
          </div>
          <footer className={styles.cart__footer}>
            <div className={styles.cart__summary}>
              <h3 className={`${styles["cart__summary-title"]} large upper`}>Загальна сума з податком</h3>
              <span className={styles['cart__summary-price']}>{`${((get_cart?.totalItems?.price ?? 0) / 1000).toFixed(3)} ₴`}</span>
            </div>
            <div className={styles.cart__buttons}>
              <button className={`${styles.cart__button} _button _button_main _button_border small upper`} onClick={closeCart}>Продовжити покупки</button>
              <button
                onClick={() => setCheckoutOpen(true)}
                className={`${styles.cart__button} _button _button_main _button_border small upper`}>
                Перейти до замовлення
              </button>
            </div>
          </footer>
        </div>
      </div>
      <Checkout isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}

export default Cart;