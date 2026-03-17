import { Link } from "react-router-dom";

import styles from "./create.module.scss";

export default function Create() {
	const picture_alts = [
		"Сучасна їдальня з дерев’яним столом і плетеними світильниками",
		"Лляна подушка нейтрального бежевого кольору",
		"Світла спальня з білою постіллю та настінними картинами",
		"Інтер’єр їдальні з підвісними білими абажурами",
		"Приліжкова тумба з лампою і бежевим покривалом",
		"Затишна спальня з пледами в бежевих тонах"
	];

	return (
		<div className={`main__create create ${styles.create}`}>
			<div className={styles.create__container}>
				<div className={styles.create__background}>
					{picture_alts.map((alt, index) => {
						const picture_number = index + 1;
						return (<picture key={picture_number}>
							<source srcSet={`/assets/images/creating/item_${picture_number}.avif`} type="image/avif" />
							<source srcSet={`/assets/images/creating/item_${picture_number}.webp`} type="image/webp" />
							<img loading="lazy"
								className={`
									${styles.create__background_item} 
									${styles[`create__background_item_${picture_number}`]}
								`}
								width="332" height="259"
								src={`/assets/images/creating/item_${picture_number}.png`} alt={alt} />
						</picture>);
					})}
				</div>

				<h2 className={`${styles.create__title} h h_xl`}>
					Створення <span className="italic">ідеальних</span> ліній та вражаючої присутності
				</h2>
				<p className={`${styles.create__subtitle} regular`}>Розроблена концепція ексклюзивності, Arusa пропонує позачасові меблі з натуральних тканин, вигнутих ліній, безлічі дзеркал та класичного дизайну, які можна включити до будь-якого декору. Вироби зачаровують своєю стриманістю, щоб служити поколінням, вірні формам кожної епохи, з відтінком сучасності.</p>
				<Link to="/about" className={`${styles.create__button} _button _button_main _button_border small upper`}>Дізнайтеся про нас</Link>
			</div>
		</div>
	);
}