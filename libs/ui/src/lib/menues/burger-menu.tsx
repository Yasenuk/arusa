import { Link } from "react-router-dom";

import styles from "../../styles/components/burger-menu.module.scss";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function BurgerMenu({ isOpen, setIsOpen }: Props) {
  const links = {
    "Arusa": [
      { name: "Головна", href: "/" },
      { name: "Про нас", href: "/about" },
      { name: "Блог", href: "/blog" },
      { name: "Контакти", href: "/contact" },
    ],
    "Магазин": [
      { name: "Все", href: "/shop" },
      { name: "Лукбук", href: "/lookbook" },
      { name: "Колекція", href: "/collection" },
      { name: "Особливості", href: "/features" },
    ],
    "Категорії": [
      { name: "Декор", href: "/category/decor" },
      { name: "Меблі", href: "/category/furniture" },
      { name: "Кераміка", href: "/category/ceramics" },
      { name: "Лампи", href: "/category/lamps" },
    ]
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`${styles.menu} ${isOpen ? "_open" : ""}`} data-burger>
      <button className={styles["menu__close-button"]} aria-label="Close menu" onClick={toggleMenu} >
        <span></span>
      </button>

      <div className={styles.menu__body}>
        <div className={styles.menu__container}>
          {Object.keys(links).map((group) => (
            <div key={group} className={styles.menu__group}>
              <span className={`${styles.menu__caption} h h_m`}>{group}</span>
              <ul className={styles.menu__list}>
                {links[group as keyof typeof links].map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className={`${styles.menu__link} small _button_article no-inline`} onClick={closeMenu}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default BurgerMenu;