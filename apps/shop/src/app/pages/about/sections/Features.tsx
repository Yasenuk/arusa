import styles from "./features.module.scss";

export default function Features() {
	const features = [
		{
			title: "Предмети",
			text: "Спеціалізований на прикрасах, він додасть шарму будь-якому середовищу. Тут представлені тисячі високоякісних виробів зі стилями, що переходять від класики до сучасності."
		},
		{
			title: "Сучасний",
			text: "Вироби вирізняються своїми сучасними прямими лініями та вражаючою зовнішністю. Сучасні меблі, що відповідають світовим тенденціям великих майстрів, вирізняються благородними та інноваційними матеріалами."
		},
		{
			title: "Спальня",
			text: "Завдяки поєднанню можливостей та високому рівню персоналізації, меблі відповідають будь-яким очікуванням, створюючи затишні та чарівні кімнати, ексклюзивні меблі для найінтимніших зон будинку."
		},
		{
			title: "Промисловість",
			text: "Меблі, що пропонують інтелектуальні рішення, поєднуючи сталий розвиток, якість, дизайн, кращу вартість та, найголовніше, благополуччя. Компанія має диверсифікований асортимент продукції та відомі бренди."
		}
	];

	return (
		<div className={styles.features}>
			<div className={styles.features__container}>
				<div className={styles.features__wrap}>
					<h2 className={`${styles.features__title} h h_m`}>Меблі, що пропонують розумні рішення</h2>
					<ol className={styles.features__list}>
						{features.map((feature, index) => (
							<li key={index} className={styles['features__list-item']}>
								<p className={`${styles['features__list-item_title']} h h_m`}>{feature.title}</p>
								<p className={`${styles['features__list-item_text']} small`}>{feature.text}</p>
							</li>
						))}
					</ol>
				</div>
				<h3 className={`${styles['features__side-title']} side-title h h_s`}>Секції</h3>
			</div>
		</div>
	);
}