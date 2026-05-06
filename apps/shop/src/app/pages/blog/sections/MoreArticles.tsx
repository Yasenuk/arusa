import { Tabs } from "@org/ui";
import Article from "../../../../../../../libs/ui/src/lib/cards/Article";
import styles from "./more-articles.module.scss";

export default function MoreArticles() {
	return (
		<div className={styles['more-articles']}>
			<div className={styles['more-articles__container']}>
				<Tabs tabsData={[{
					title: "Всі",
					content: [
						<Article key={1} id={4} />,
						<Article key={2} id={1} />,
						<Article key={3} id={5} />,
					]
				}, {
					title: "Особливості",
					content: [
						<Article key={1} id={1} />,
						<Article key={2} id={6} />,
						<Article key={3} id={5} />
					]
				}, {
					title: "Натхнення",
					content: [
						<Article key={1} id={2} />,
						<Article key={2} id={4} />,
						<Article key={3} id={1} />
					]
				}]} />
			</div>
		</div>
	);
}