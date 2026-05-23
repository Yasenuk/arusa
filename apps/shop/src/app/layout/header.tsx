import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import styles from '../../styles/header.module.scss';
import { BurgerMenu, Cart, useAuth, AuthPopup } from "@org/ui";

export function Header({ isDark = false }: { isDark?: boolean }) {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { isAuth } = useAuth();

  // Замість трьох окремих useEffect для _locked — один
  useEffect(() => {
    const shouldLock = isMenuOpen || isCartOpen;
    document.body.classList.toggle("_locked", shouldLock);
    return () => { document.body.classList.remove("_locked"); };
  }, [isMenuOpen, isCartOpen]);

  const lastScroll = useRef<number>(0);
  // Ref для batching — не тригеримо setState на кожен піксель
  const rafId = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      // Скасовуємо попередній rAF щоб не стекати
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const current = window.scrollY;
        const hidden  = current > lastScroll.current && current > 100;
        const scrolled = current > 200;
        // Оновлюємо state тільки якщо значення змінилось
        setIsHidden(prev  => prev  !== hidden  ? hidden  : prev);
        setIsScrolled(prev => prev !== scrolled ? scrolled : prev);
        lastScroll.current = current;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <header
      className={`${styles.header} ${isHidden ? styles._hidden : ""} 
      ${(isMenuOpen || isCartOpen) ? styles['_menu-open'] : ""}
      ${isDark ? styles._dark : ""}`}
      data-scrolled={isScrolled}
    >
      <div className={styles.header__container}>
        <div className={styles['header__menu-group']}>
          <BurgerMenu 
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}/>
          <Link to="/shop" className={`${styles['header__menu-caption']} _button _button_article _button_article_light no-inline regular upper`}>
            Магазин
          </Link>
        </div>

        <div className={styles.header__logo}>
          <Link to="/" className={styles.header__logo_link}>
            <img
              src="/assets/images/logo.svg"
              alt="Arusa лого"
              fetchPriority="high"
              className={styles['header__logo-picture']}
              width={117}
              height={19}
            />
          </Link>
        </div>

        <AuthPopup />
        <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
      </div>
    </header>
  );
}

export default Header;
