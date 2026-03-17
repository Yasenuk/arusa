import { Link } from "react-router-dom";

import styles from "./native.module.scss";

export default function Native() {
	return (
		<div className={styles.native}>
			<div className={styles.native__container}>
				<div className={styles.native__content}>
					<h2 className={`${styles.native__title} h h_m`}>Про нашу спадщину</h2>
					<p className={`${styles.native__description} regular`}>Елегантний та гостинний, він пропонує ретельно підібраний набір продуктів, ретельно продуманих для оптимізації моменту розробки проекту, незалежно від їхніх розмірів чи стилів. Наші ворота у всесвіт Solace — це чудова можливість придбати сучасні речі світової якості та дизайну.</p>
					<p className={`${styles.native__description} regular`}>Задуманий з метою демонстрації найрізноманітніших концепцій стилю життя, коли йдеться про спальні, магазин пропонує ексклюзивні меблі для найінтимніших зон будинку, такі як ліжка, матраци та тумбочки, а також спеціальний вибір шпалер, тканин та приданого. Завдяки поєднанню можливостей та високій індивідуалізації, меблі відповíдають будь-яким очíкуванням, створюючи затишнí та чарíвнí кíмнати.</p>
					<Link to="./404.html" className={`${styles.native__button} _button _button_article no-inline upper`}>Переглянути товар</Link>
				</div>
				<picture>
					<source srcSet="/assets/images/about/fall-lamps.avif" type="image/avif" />
					<source srcSet="/assets/images/about/fall-lamps.webp" type="image/webp" />
					<img loading="lazy" className={styles.native__picture} width="720" height="670" src="/assets/images/about/fall-lamps.png" alt="Модернізований стіл з підсвідкою" />
				</picture>
			</div>
		</div>
	);
}