import { Link } from "react-router-dom";

import styles from "./native.module.scss";

export default function Native() {
	return (
		<div className={`${styles.native}`}>
			<div className={styles.native__container}>
				<picture>
					<source srcSet="/assets/images/native_light_chair/native_light_chair.avif" type="image/avif" />
					<source srcSet="/assets/images/native_light_chair/native_light_chair.webp" type="image/webp" />
					<img loading="lazy" className={styles.native__picture} width="720" height="670" src="/assets/images/native_light_chair/native_light_chair.png" alt="Модернізований стіл з підсвідкою" />
				</picture>
				<div className={styles.native__content}>
					<h2 className={`${styles.native__title} h h_m`}>Крісло Native Light</h2>
					<p className={`${styles.native__description} regular`}>Вишукане крісло з рваним сидінням, виготовлене з ретро-деревини евкаліпта, високої міцності, висушене в печі, виготовлене за допомогою шипової системи та пофарбоване поліуретаном (PU). З усією пофарбованою в дерево конструкцією, воно додає вашому середовищу багато елегантності, а очищення дуже просте, оскільки його можна прати та воно легке для пересування. Досить приймати гостей і не мати де їх розмістити. З цим кріслом ваші дні як господаря будуть позначені великою елегантністю та вишуканістю.</p>
					<Link to="./shop" className="_button _button_article _button_article_light no-inline upper">Переглянути товар</Link>
				</div>
			</div>
		</div>
	);
}
