import { Link } from "react-router-dom";

import styles from "../../styles/common/article.module.scss";
import { useEffect, useState } from "react";

type ArticleProps = {
	image_url: string;
	alt: string;
	title: string;
	description: string;
};

export default function Article({ id }: { id: number }) {
	const [article, setArticle] = useState<ArticleProps | null>(null);

	useEffect(() => {
		fetch(`/api/articles/${id}`)
			.then(async r => {
				if (!r.ok) {
					throw new Error("Failed to fetch article");
				}

				const text = await r.text();
				if (!text) return null;

				return JSON.parse(text);
			})
			.then(setArticle)
			.catch(console.error);
	}, [id]);

	return (
		<div className={styles.article}>
			<picture>
				<source srcSet={`${article?.image_url}.avif`} type="image/avif" />
				<source srcSet={`${article?.image_url}.webp`} type="image/webp" />
				<img loading="lazy" className={styles.article__picture} width="454" height="383" src={`${article?.image_url}.png`} alt={article?.alt} />
			</picture>
			<section className={`${styles.article__content} ${styles.article__content_m}`}>
				<h3 className={`${styles.article__title} h h_s`}>{article?.title}</h3>
				<p className={`${styles.article__description} regular`}>{article?.description}</p>
				<Link to="./404.html" className={`${styles.article__button} small _button _button_article no-inline upper`}>Читати статтю</Link>
			</section>
		</div>
	);
}
