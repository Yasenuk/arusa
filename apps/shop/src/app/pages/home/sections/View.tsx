import { useEffect, useState } from "react";

import styles from "./view.module.scss";

import { ProductCard } from "@org/ui";

import { CatalogProductVariant } from "@org/shared-types";

export default function View({ ids }: { ids?: number[] }) {
	const [products, setProducts] = useState<CatalogProductVariant[]>([]);

	useEffect(() => {
		if (!ids?.length) return;
		fetch(`/api/products?ids=${ids.join(",")}`)
			.then(r => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json();
			})
			.then(setProducts)
			.catch(console.error);
	}, [ids?.join(",")]);

	return (
		<div className={styles.view}>
			<div className={styles.view__container}>
				{products?.map((product : CatalogProductVariant, index: number) => (
					<div key={product.id} className={`${styles.view__item} ${styles[`view__item_${index + 1}`]}`}>
						<ProductCard product={product} />
					</div>
				))}
			</div>
		</div>
	);
}
