import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { CatalogProductVariant } from "@org/shared-types";

import styles from "./lookbook.module.scss";

export default function Lookbook() {
	const [products, setProducts] = useState<CatalogProductVariant[]>([]);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		fetch(`/api/products?ids=1,2,3`)
			.then((r) => r.json())
			.then(setProducts)
			.catch(console.error);
	}, []);

	useEffect(() => {
		if (!products.length) return;

		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % products.length);
		}, 3000);

		return () => clearInterval(interval);
	}, [products]);

	const product = products[index];

	return (
		<div className={styles.lookbook}>
			<div className={styles.lookbook__container}>
				<div className={styles.lookbook__content}>
					<h2 className={`${styles.lookbook__title} h h_l`}>Лукбук</h2>
					<p className={styles.lookbook__description}>Вироби вирізняються сучасними прямими лініями та вражаючою зовнішністю. Сучасні меблі, що відповідають світовим тенденціям великих майстрів, вирізняються благородними та інноваційними матеріалами, створюючи вишукані та ексклюзивні інтер'єри.</p>
				</div>
				<div className={styles.lookbook__item}>
					<div className={styles["lookbook__text-wrap"]}>
						<span className="small">{product?.title}</span>
					</div>
					<div className={styles["lookbook__picture-wrap"]}>
						<picture>
							<source srcSet={`${product?.image}.avif`} type="image/avif" />
							<source srcSet={`${product?.image}.webp`} type="image/webp" />
							<img loading="lazy" className={styles.lookbook__picture} width="542" height="422" src={`${product?.image}`} alt={product?.title} />
						</picture>
						<div className={styles.lookbook__buttons}>
							<Link to='/products/1' className={`${styles.lookbook__button} _button _button_article no-inline upper`}>Дивитися Лукбук</Link>
							<Link to="/shop" className={`${styles.lookbook__button} _button _button_article no-inline upper`}>Всі товари</Link>
						</div>
					</div>
					<div className={styles["lookbook__text-wrap"]}>
						<span className="small">Матеріал:</span>
						<span className="small">{product?.material}</span>
					</div>
					<div className={styles["lookbook__text-wrap"]}>
						<span className="small">Ціна:</span>
						<span className="small">{product?.price}</span>
					</div>
					<div className={styles["lookbook__text-wrap"]}>
						<span className="small">Колір:</span>
						<span className="small">{product?.color}</span>
					</div>
				</div>
				<h3 className={`${styles["lookbook__side-title"]} side-title h h_s`}>Лукбук</h3>
			</div>
		</div>
	);
}
