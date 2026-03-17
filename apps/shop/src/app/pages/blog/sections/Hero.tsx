import { Link } from "react-router-dom";

import styles from "./hero.module.scss";

export default function Hero() {
	return (
		<div className={styles.hero}>
			<div className={styles.hero__container}>
				<div className={styles.hero__wrap}>
					<picture>
						<source srcSet="/assets/images/blog/hero-picture.avif" type="image/avif" />
						<source srcSet="/assets/images/blog/hero-picture.webp" type="image/webp" />
						<img fetchPriority="high" className={styles.hero__picture} width="664" height="561" src="/assets/images/blog/hero-picture.jpg" alt="Concrete base table lamp with fabric shade" />
					</picture>
					<div className={styles.hero__content}>
						<h1 className={`${styles.hero__title} h h_xl center`}>Наш блог</h1>
						<p className={`${styles.hero__description} small center`}>Дизайнерка інтер'єрів Сара Вейл згадує, як приглядалася до Нью-Йорка. Роками пізніше, за щасливим збігом обставин, жінка, яку вона бачила в журналі — стильна фігура, якій зараз було за 30 — щойно переїхала до Чикаго.</p>
						<p className={`${styles.hero__description} regular center`}>Дизайнерка інтер'єрів Сара Вейл згадує, як приглядалася до нью-йоркської квартири — з яскравими кольорами та індивідуальністю, такою ж виразною, як і її шикарна власниця — у випуску журналу House Beautiful за 2014 рік, і сховала її для майбутнього натхнення для дизайну. Роками пізніше, за щасливим збігом обставин, жінка, яку вона бачила в журналі — стильна фігура, якій зараз було за 30 — щойно переїхала до Чикаго.</p>
						<Link to="./articles.html" className={`${styles.hero__button} small _button _button_article no-inline upper`}>Переглянути всі статті</Link>
					</div>
				</div>
				<h2 className={`${styles['hero__side-title']} side-title h h_s`}>Блог</h2>
			</div>
		</div>
	);
}