import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/common/header.module.scss";
import BurgerMenu from "./menues/burger-menu";
import Cart from "./menues/cart";
import AuthPopup from "./auth/AuthPopup";
import { useAuth } from "./auth/AuthProvider";

export function Header({ isDark = false }: { isDark?: boolean }) {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { isAuth } = useAuth();

  useEffect(() => {
    if (isMenuOpen) {
      setIsCartOpen(false);
      document.body.classList.add("_locked");
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isCartOpen) {
      setIsMenuOpen(false);
      document.body.classList.add("_locked");
    }
  }, [isCartOpen]);

  useEffect(() => {
    const shouldLock = isMenuOpen || isCartOpen;

    if (shouldLock) {
      document.body.classList.add("_locked");
    } else {
      document.body.classList.remove("_locked");
    }

    return () => {
      document.body.classList.remove("_locked");
    };
  }, [isMenuOpen, isCartOpen]);

  const lastScroll = useRef<number>(0);

  useEffect(() => {
    const saved = Number(localStorage.getItem("header_scroll")) || 0;
    lastScroll.current = saved;

    const handleScroll = () => {
      const current = window.pageYOffset;

      setIsHidden(current > lastScroll.current && current > 100);
      setIsScrolled(current > 200);

      lastScroll.current = current;
      localStorage.setItem("header_scroll", String(current));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
              className={styles['header__logo-picture']}
              width={117}
              height={19}
            />
          </Link>
        </div>

        <AuthPopup />
        {isAuth && <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />}
      </div>
    </header>
  );
}

export default Header;