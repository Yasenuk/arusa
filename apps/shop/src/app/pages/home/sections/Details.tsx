import styles from "./details.module.scss";

export default function Details() {
	return (
		<div className={styles.details}>
			<div className={styles.details__container}>
				<h2 className={`${styles.details__title} h h_xl`}>Кожна деталь має значення</h2>
				<h3 className={`${styles.details__subtitle} small`}>Ми спеціалізуємося на прикрасах, які додають шарму будь-якому середовищу.</h3>
				<p className={`${styles.details__description} regular`}>Ми пропонуємо безліч високоякісних виробів, стилі яких переходять від класики до сучасності. Ексклюзивний вибір абажурів, ваз, фресок, подушок, картин та багатьох подарунків для створення чудових проектів. Упорядкований вибір поєднує базовий стиль, суворішу персоналізацію та більш компактні розміри, створюючи вишукані та ексклюзивні інтер'єри.</p>
				<div className={styles.details__pictures}>
					<picture>
						<source srcSet="/assets/images/details/item-1.avif" type="image/avif" />
						<source srcSet="/assets/images/details/item-1.webp" type="image/webp" />
						<img loading="lazy" className={`${styles.details__picture} ${styles.details__picture_right}`} width="972" height="677" src="/assets/images/details/item-1.png" alt="Concrete base table lamp with fabric shade" />
					</picture>
					<div className={styles.details__wrap}>
						<picture>
							<source srcSet="/assets/images/details/item-2.avif" type="image/avif" />
							<source srcSet="/assets/images/details/item-2.webp" type="image/webp" />
							<img loading="lazy" className={`${styles.details__picture} ${styles.details__picture_top}`} width="349" height="260" src="/assets/images/details/item-2.png" alt="Concrete base table lamp with fabric shade" />
						</picture>
						<picture>
							<source srcSet="/assets/images/details/item-3.avif" type="image/avif" />
							<source srcSet="/assets/images/details/item-3.webp" type="image/webp" />
							<img loading="lazy" className={`${styles.details__picture} ${styles.details__picture_bottom}`} width="349" height="385" src="/assets/images/details/item-3.png" alt="Concrete base table lamp with fabric shade" />
						</picture>
					</div>
					<h4 className={`${styles['details__side-title']} side-title h h_s`}>Деталі</h4>
				</div>
			</div>
			<div className={styles.details__background}>
				<picture>
					<source srcSet="/assets/images/details/item-4.avif" type="image/avif" />
					<source srcSet="/assets/images/details/item-4.webp" type="image/webp" />
					<img loading="lazy" className={styles.details__picture} width="392" height="502" src="/assets/images/details/item-4.png" alt="Concrete base table lamp with fabric shade" />
				</picture>
			</div>
		</div>
	);
}
