import { Link, useParams } from "react-router-dom";

import styles from "./product.module.scss";

import { useEffect, useState } from "react";
import { CatalogProductVariant } from "@org/shared-types";

export default function Product() {
	const { id } = useParams();

	const [products, setProducts] = useState<CatalogProductVariant[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;

		setIsLoading(true);
		setError(null);

		fetch(`/api/products?ids=${id}&all=true`)
			.then(res => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then(data => setProducts(data))
			.catch(err => {
				console.error("Помилка при завантаженні продукту:", err);
				setError("Не вдалося завантажити продукт");
			})
			.finally(() => setIsLoading(false));
	}, [id]);

	if (isLoading) return <div className={styles.product}><p>Завантаження...</p></div>;
	if (error) return <div className={styles.product}><p>{error}</p></div>;
	if (!products?.length) return <div className={styles.product}><p>Продукт не знайдено</p></div>;

	return (<>
		<div className={styles.product}>
			<div className={styles.container}>
				{products.map((product, index) => (
					<div key={index} className={styles.product__item}>
						<picture>
							<source srcSet={`${product?.image}.avif`} type="image/avif" />
							<source srcSet={`${product?.image}.webp`} type="image/webp" />
							<img className={styles.product__picture} loading="lazy" src={`${product?.image}.png`} alt={product?.title} width={320} height={320} />
						</picture>
						<div>
							<h1>{product?.title}</h1>
							<p>{product?.description}</p>
							<p>{product?.price}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	</>);
}