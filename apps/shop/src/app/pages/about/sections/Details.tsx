import { Link } from "react-router-dom";

import styles from "./details.module.scss";

export default function Details() {
	return (
		<div className={styles.details}>
			<div className={styles.details__background}>
				<picture>
					<source srcSet="/assets/images/about/lamp.avif" type="image/avif" />
					<source srcSet="/assets/images/about/lamp.webp" type="image/webp" />
					<img loading="lazy" className={styles.details__picture} width="392" height="502" src="/assets/images/about/lamp.png" alt="Лампа з бетонною основою та тканини" />
				</picture>
			</div>
		</div>
	);
}