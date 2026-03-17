import { Link } from "react-router-dom";

import styles from "./articles.module.scss";

export default function Articles() {
	return (
		<div className={styles.articles}>
			<div className={styles.articles__container}>
				<h2 className={`${styles.articles__title} h h_m center`}>Насолоджуйтесь нашими статтями</h2>
				<div className={styles.articles__wrap}>
					<div className={styles.articles__content}>
						<h3 className={`${styles['articles__content-title']} h h_l`}>Манхеттен Піа-терре для нової квартири в Чикаго</h3>
						<p className={`${styles.articles__description} regular`}>Дизайнерка інтер'єрів Сара Вейл згадує, як у випуску журналу House Beautiful за 2014 рік приглядалася до нью-йоркської квартири — з яскравими кольорами та індивідуальністю, такою ж виразною, як і її шикарна власниця, — і сховала її для майбутнього натхнення для дизайну. Роками пізніше, за щасливим збігом обставин, жінка, яку вона бачила в журналі — стильна фігура, якій зараз було за 30 — щойно переїхала до Чикаго.</p>
						<Link to="./404.html" className={`${styles.articles__button} small _button _button_article no-inline upper`}>Читати статтю</Link>
					</div>
					<picture>
						<source srcSet="./src/assets/images/articles/manhattan-chicago-apartment-living-room.avif" type="image/avif" />
						<source srcSet="./src/assets/images/articles/manhattan-chicago-apartment-living-room.webp" type="image/webp" />
						<img loading="lazy" className={styles.articles__picture} width="664" height="561" src="./src/assets/images/articles/manhattan-chicago-apartment-living-room.png" alt="Concrete base table lamp with fabric shade" />
					</picture>
				</div>
				<Link to="./404.html" className={`${styles.articles__button} small _button _button_article no-inline upper`}>Переглянути всі статті</Link>
				<h4 className={`${styles['articles__side-title']} side-title h h_s`}>Статті</h4>
			</div>
		</div>
	);
}
