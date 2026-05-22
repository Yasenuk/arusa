import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "../../../../styles/common/swiper.module.scss";
import styles from "./more-articles.module.scss";

import { useEffect, useState } from "react";
import { ArticleData } from "@org/shared-types";
import { Article } from "@org/ui";

export default function MoreArticles() {
	const [articles, setArticles] = useState<ArticleData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setIsLoading(true);
		setError(null);

		fetch(`/api/articles`)
			.then(res => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then(data => setArticles(data))
			.catch(err => {
				console.error("Помилка при завантаженні статті:", err);
				setError("Не вдалося завантажити статтю");
			})
			.finally(() => setIsLoading(false));
	}, []);

	if (isLoading) return <div className={styles.product}><p>Завантаження...</p></div>;
	if (error) return <div className={styles.product}><p>{error}</p></div>;
	if (!articles?.length) return <div className={styles.product}><p>Статі не знайдено</p></div>;

	return (
		<div className={styles['more-articles']}>
			<div className={styles['more-articles__container']}>
				<div className={styles['more-articles__swipper-container']}>
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
							768: {
								slidesPerView: 2,
								spaceBetween: 16,
							},
							992: {
								slidesPerView: 3,
								spaceBetween: 20,
							},
						}}
					>
						{articles?.map(article => (
							<SwiperSlide key={article.id} className={styles['more-articles__slide']}>
								<Article article={article}></Article>
							</SwiperSlide>
						))}
						<div className="swiper-pagination-c"></div>
					</Swiper>
				</div>
			</div>
		</div>
	);
}