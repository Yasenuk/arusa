import { Link } from 'react-router-dom';

import styles from '../../styles/footer.module.scss';

export function Footer() {
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
    ],
    "Допомога": [
      { name: "Контакти", href: "/contact" },
      { name: "Вхід та акаунт", href: "/login" },
      { name: "Політика конфіденційності", href: "/privacy-policy" },
      { name: "Політика повернення коштів", href: "/return-policy" },
    ]
  };

  return (
    <footer className={styles.footer}>
      <div className={`${styles.footer__container} no-inline`}>
        <nav className={styles.footer__links}>
          {Object.entries(links).map(([group, items]) => (
            <div key={group} className={styles['footer__links-group']}>
              <span className={`${styles.footer__caption} small upper`}>{group}</span>
              <ul className={styles.footer__list}>
                {items.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className={`${styles.footer__link} small _button_article _button_article_light no-inline`}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <Link to="/" className={styles.footer__logo}>
          <img loading="lazy" width="1359" height="220" src="/assets/images/logo.svg" alt="Arusa лого" />
        </Link>
        <p className={`${styles.footer__copy} upper small`}>&copy; Arusa 2025 Владислав Яценюк</p>
      </div>
    </footer>
  );
}

export default Footer;
