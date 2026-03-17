import { Link } from "react-router-dom";
import { useNotification } from "@org/ui";

import styles from "./hero.module.scss";

export default function Hero() {
	const { notify } = useNotification();

	return (
		<div className={`main__hero hero ${styles.hero_home}`}>
			<div className={styles.hero__container}>
				<picture>
					<source srcSet="/assets/images/hero/hero-picture.avif" type="image/avif" />
					<source srcSet="/assets/images/hero/hero-picture.webp" type="image/webp" />
					<img className={styles.hero__picture} width="1439" height="733" fetchPriority="high" src="/assets/images/hero/hero-picture.png" alt="Сучасна їдальня з дерев’яним столом і плетеними світильниками" />
				</picture>
				<h1 className={`${styles.hero__title} h h_xxl`} onClick={() => notify("Привіт! Це сповіщення.", "info")}>
					Безшовні <span className="italic">меблі</span> з натуральних тканин
				</h1>
				<Link to="/shop" className={`${styles.hero__button} shop-button _button _button_main small upper`}>Купити</Link>
			</div>
		</div>
	);
}