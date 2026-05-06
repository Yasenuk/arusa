import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "../../../styles/common/swiper.module.scss";
import styles from "./product.module.scss";

import { CatalogProductVariant } from "@org/shared-types";
import { useCartStore } from "@org/utils/index";
import { ProductCard } from "@org/ui";

export default function Product() {
	const { id } = useParams();

	const { addItem } = useCartStore();

	const [searchParams] = useSearchParams();
	const variantId = searchParams.get("variant");

	const [products, setProducts] = useState<CatalogProductVariant[] | null>(null);
	const [product, setProduct] = useState<CatalogProductVariant | null>(null);
	const [related, setRelated] = useState<CatalogProductVariant[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (product?.title) {
			document.title = `${product.title} — Arusa`;
		}
	}, [product]);

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

	useEffect(() => {
		if (!products || products.length === 0) return;

		if (variantId) {
			const found = products.find(v => String(v.id) === variantId);
			setProduct(found ?? products[0]);
		} else {
			setProduct(products[0]);
		}
	}, [products, variantId]);

	useEffect(() => {
		if (!product?.category || !product?.product_id) return;

		fetch(`/api/products?category=${encodeURIComponent(product.category)}&limit=10`)
			.then(res => res.ok ? res.json() : null)
			.then(data => {
				if (!data?.data) return;
				const filtered = data.data.filter(
					(p: CatalogProductVariant) => p.product_id !== product.product_id
				);
				setRelated(filtered.slice(0, 10));
			})
			.catch(console.error);
	}, [product?.category, product?.product_id]);

	if (isLoading) return <div className={styles.product}><p>Завантаження...</p></div>;
	if (error) return <div className={styles.product}><p>{error}</p></div>;
	if (!products?.length) return <div className={styles.product}><p>Продукт не знайдено</p></div>;

	return (<>
		<div className={styles.product}>
			<div className={styles.product__container}>
				<div className={styles.product__content}>
					<div className={styles.product__image}>
						<picture>
							<source srcSet={`${product?.image}.avif`} type="image/avif" />
							<source srcSet={`${product?.image}.webp`} type="image/webp" />
							<img className={styles.product__picture} loading="lazy" src={`${product?.image}.png`} alt={product?.title} width={320} height={320} />
						</picture>
					</div>
					<div className={styles.product__info}>
						<h1 className={`${styles.product__title} h h_m`}>{product?.title}</h1>
						<p className={`${styles.product__description} regular`}>{product?.description}</p>
						<span className={`${styles.product__price} regular`}>
							Ціна: {(Number(product?.price) / 1000).toFixed(3)} ₴
						</span>
						<span className={`${styles.product__article} regular`}>
							Артикул: {product?.article}
						</span>
						<div className={styles.product__buttons}>
							<button
								onClick={() => product && addItem(product?.product_id)}
								className={`${styles.product__buy} _button _button_main _button_border _button_fill regular upper`}>
								Купити
							</button>
							<button
								onClick={() => product && addItem(product?.product_id)}
								className={`${styles.product__add} _button _button_main _button_border _button_fill regular upper`}>
								Додати до кошика
							</button>
							<button className={`${styles.product__favorite} _button _button_border regular upper`}>
								<i className="icon icon-heart"></i>
							</button>
						</div>
						<div className={styles.product__variants}>
							{products.map((product) => (
								<div key={product.id} className={`${styles.product__item} ${product.id === Number(variantId) ? styles["product__item_active"] : ""}`}>
									<Link to={`/products/${product.product_id}?variant=${product.id}`}>
										<picture>
											<source srcSet={`${product?.image}.avif`} type="image/avif" />
											<source srcSet={`${product?.image}.webp`} type="image/webp" />
											<img className={styles["product__item-picture"]} loading="lazy" src={`${product?.image}.png`} alt={product?.title} width={320} height={320} />
										</picture>
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className={styles.product__details}>
					<h2 className={`${styles.product__details_title} h h_s center`}>Деталі продукту</h2>
					<ul className={`${styles.product__details_list}`}>
						<li className={`${styles.product__details_item} regular`}>
							Колір: {product?.color}
						</li>
						<li className={`${styles.product__details_item} regular`}>
							Матеріал: {product?.material}
						</li>
						<li className={`${styles.product__details_item} regular`}>
							Розмір: {product?.size}
						</li>
						<li className={`${styles.product__details_item} regular`}>
							Вага: {product?.weight} кг
						</li>
						<li className={`${styles.product__details_item} regular`}>
							Категорія: {product?.category}
						</li>
						<li>
							Наявність: {Number(product?.quantity) > 0
								? `В наявності (${product?.quantity} шт.)`
								: "Немає в наявності"}
						</li>
						<li className={`${styles.product__details_item} regular`}>
							Гарантія: 12 місяців
						</li>
					</ul>
					<h2 className={`${styles.product__details_title} h h_s center`}>Опис</h2>
					<p className={`${styles.product__details_description} regular`}>{product?.description}</p>
				</div>
				{related.length > 0 && (
					<div className={styles.product__related}>
						<h2 className="h h_s center">Схожі товари</h2>
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
							{related.map(item => (
								<SwiperSlide key={item.id} className={styles['product__slide']}>
									<ProductCard key={item.id} product={item} variantId={item.id} />
								</SwiperSlide>
							))}
							<div className="swiper-pagination-c"></div>
						</Swiper>
					</div>
				)}
			</div>
		</div>
	</>);
}