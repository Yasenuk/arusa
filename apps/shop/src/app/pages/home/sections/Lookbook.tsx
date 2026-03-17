import { Link } from "react-router-dom";

import styles from "./lookbook.module.scss";

export default function Lookbook() {
	return (
		<div className={styles.lookbook}>
			<div className={styles.lookbook__container}>
				<div className={styles.lookbook__content}>
					<h2 className={`${styles.lookbook__title} h h_l`}>Лукбук</h2>
					<p className={styles.lookbook__description}>Вироби вирізняються сучасними прямими лініями та вражаючою зовнішністю. Сучасні меблі, що відповідають світовим тенденціям великих майстрів, вирізняються благородними та інноваційними матеріалами, створюючи вишукані та ексклюзивні інтер'єри.</p>
				</div>
				<div className={styles.lookbook__item}>
					<div className={styles["lookbook__text-wrap"]}>
						<span className="small">Артикул</span>
						<span className="small">Опис</span>
					</div>
					<div className={styles["lookbook__picture-wrap"]}>
						<picture>
							<source srcSet="/assets/images/lookbook/lookbook.avif" type="image/avif" />
							<source srcSet="/assets/images/lookbook/lookbook.webp" type="image/webp" />
							<img loading="lazy" className={styles.lookbook__picture} width="542" height="422" src="/assets/images/lookbook/lookbook.png" alt="Настінний килимок" />
						</picture>
						<div className={styles.lookbook__buttons}>
							<Link to="./404.html" className={`${styles.lookbook__button} _button _button_article no-inline upper`}>Дивитися Лукбук</Link>
							<Link to="./shop.html" className={`${styles.lookbook__button} _button _button_article no-inline upper`}>Всі товари</Link>
						</div>
					</div>
					<div className={styles["lookbook__text-wrap"]}>
						<span className="small">Матеріали:</span>
						<span className="small">Кераміка, скло, залізо, дерево</span>
					</div>
					<div className={styles["lookbook__text-wrap"]}>
						<span className="small">Вироблено в:</span>
						<span className="small">Канада, Італія, США</span>
					</div>
					<div className={styles["lookbook__text-wrap"]}>
						<span className="small">Категорії:</span>
						<span className="small">Декор, лампи, меблі</span>
					</div>
				</div>
				<h3 className={`${styles["lookbook__side-title"]} side-title h h_s`}>Лукбук</h3>
			</div>
		</div>
	);
}
