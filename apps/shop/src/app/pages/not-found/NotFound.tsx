import { Link } from "react-router-dom";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.notFound__container}>
        <span className={`${styles.notFound__code} h h_xl`}>404</span>
        <h1 className={`${styles.notFound__title} h h_m`}>Сторінку не знайдено</h1>
        <p className={`${styles.notFound__text} regular`}>
          Можливо, посилання застаріло або сторінку було переміщено.
        </p>
        <Link to="/" className="_button _button_main _button_border small upper">
          На головну
        </Link>
      </div>
    </div>
  );
}
