import { Link } from "react-router-dom";

import styles from "./hero.module.scss";

export default function Hero() {
	return (
		<div className={styles.hero}>
			<div className={styles.hero__container}>
				<picture>
					<source srcSet="/assets/images/about/hero-picture.avif" type="image/avif" />
					<source srcSet="/assets/images/about/hero-picture.webp" type="image/webp" />
					<img className={styles.hero__picture} width="1439" height="733" fetchPriority="high" src="/assets/images/about/hero-picture.png" alt="Сучасна їдальня з дерев’яним столом і плетеними світильниками" />
				</picture>
				<h1 className={`${styles.hero__title} h h_xxl`}>
					Ми <span className="italic">віримо</span> в екологічний декор
				</h1>
			</div>
		</div>
	);
}