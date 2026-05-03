import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";

import styles from "./feature-products.module.scss";

import ProductCard from "../../../common/ProductCard";
import { useEffect, useState } from "react";
import { CatalogProductVariant } from "@org/shared-types";

export default function FeatureProducts({
	_isDark = false,
	children = [] }: {
		_isDark?: boolean;
		children?: number[]
	}) {
	const [products, setProducts] = useState<CatalogProductVariant[]>([]);
	
	useEffect(() => {
		if (!children?.length) return;
		fetch(`/api/products?ids=${children.join(",")}`)
			.then((r) => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json();
			})
			.then(setProducts)
			.catch(console.error);
	}, [children.join(",")]);

	return (
		<div className={`${styles['feature-products']} ${_isDark ? styles['_dark'] : '_light'}`}>
			<div className={styles['feature-products__container']}>
				<h2 className={`${styles['feature-products__title']} h h_m center`}>Насолоджуйтесь нашими найкращими продуктами</h2>
				<div className={styles['feature-products__swiper-container']}>
					<Swiper
						modules={[Pagination]}
						spaceBetween={20}
						slidesPerView={4}
						loop={true}
						grabCursor={true}
						lazyPreloadPrevNext={1}
						pagination={{ el: ".swiper-pagination-c", clickable: true }}
						breakpoints={{
							0: {
								slidesPerView: 1,
								spaceBetween: 8,
							},
							420: {
								slidesPerView: 2,
								spaceBetween: 12,
							},
							768: {
								slidesPerView: 3,
								spaceBetween: 16,
							},
							992: {
								slidesPerView: 4,
								spaceBetween: 20,
							},
						}}
					>
						{products?.map(product => (
							<SwiperSlide key={product.id} className={styles['feature-products__slide']}>
								<ProductCard product={product} />
							</SwiperSlide>
						))}
						<div className="swiper-pagination-c"></div>
					</Swiper>
				</div>
				<Link to="/shop" className={`${styles['feature-products__button']} _button _button_article upper`}>Купити</Link>
			</div>
		</div>
	);
}
