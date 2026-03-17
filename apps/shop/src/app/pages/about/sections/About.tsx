import { Link } from "react-router-dom";

import styles from "./about.module.scss";

export default function About() {
	return (
		<div className={styles.about}>
			<div className={styles.about__container}>
				<div className={styles.about__content}>
					<h2 className={`${styles.about__title} h h_m`}>Створено на основі концепції ексклюзивності</h2>
					<p className={`${styles.about__subtitle} small upper`}>Безсезонний стиль, який можна мати та зберігати: дев'ятисловний маніфест</p>
					<p className={`${styles.about__description} regular`}>Arusa пропонує позачасові меблі з натуральних тканин, вигнутих ліній, безлічі дзеркал та класичного дизайну, які можна включити до будь-якого декоративного проєкту. Вироби зачаровують своєю стриманістю, щоб служити поколінням, вірні формам кожної епохи, з відтінком сучасності.</p>
					<p className={`${styles.about__description} regular`}>Вироби вирізняються сучасними прямими лініями та вражаючою зовнішністю. Сучасні меблі, що відповідають світовим тенденціям великих майстрів, вирізняються благородними та інноваційними матеріалами, створюючи вишукані та ексклюзивні інтер'єри.</p>
				</div>
				<h3 className={`${styles['about__side-title']} side-title h h_s`}>Про нас</h3>
			</div>
		</div>
	);
}