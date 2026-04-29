import { Link } from "react-router-dom";

import styles from "./product.module.scss";

import { useEffect, useState } from "react";
import { CatalogProductVariant } from "@org/shared-types";

export default function Product({ id }: { id?: number }) {
	const [product, setProduct] = useState<CatalogProductVariant | null>(null);

	useEffect(() => {
		if (!id) return;

		fetch(`/api/products?ids=${id}&all=true`)
			.then(res => res.json())
			.then(data => setProduct(data[0])
		).catch(err => console.error("Помилка при завантаженні продукту:", err));
	}, [id]);

	return (<>
		<div className={styles.product}>
			
		</div>
	</>);
}