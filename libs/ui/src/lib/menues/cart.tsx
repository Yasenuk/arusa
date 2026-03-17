import { Link } from "react-router-dom";

import styles from "../../styles/components/cart.module.scss";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Cart({ isOpen, setIsOpen }: Props) {
  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const closeCart = () => {
    setIsOpen(false);
    document.body.classList.remove("_locked");
  };

  return (
    <div className={`${styles.cart} ${isOpen ? styles.cart_open : ""}`}>
      <button type="button" className={styles['cart__main-button']} onClick={toggleCart}>
        Кошик
        <span className={styles['cart__quantity']}>0</span>
      </button>
      <div className={styles.cart__wrapper}>
        <div className={styles.cart__body}>
          <header className={styles.cart__header}>
            <h2 className={`${styles.cart__title} large upper`}>Зведення замовлення</h2>
            <button className={styles.cart__close} onClick={closeCart}></button>
          </header>
          <div className={styles.cart__content}></div>
          <footer className={styles.cart__footer}>
            <div className={styles.cart__summary}>
              <h3 className={`${styles["cart__summary-title"]} large upper`}>Загальна сума з податком</h3>
              <span ></span>
            </div>
            <div className={styles.cart__buttons}>
              <button className={`${styles.cart__button} _button _button_main _button_border small upper`} onClick={closeCart}>Продовжити покупки</button>
              <Link to="/checkout" className={`${styles.cart__button} _button _button_main _button_border small upper`}>Перейти до замовлення</Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Cart;