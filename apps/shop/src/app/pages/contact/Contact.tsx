import { Link } from "react-router-dom";

import styles from "./contact.module.scss";

export default function Contact() {
	const links = [
		{ label: "Підтримка", email: "support@arusa.com" },
		{ label: "Партнерство", email: "partners@arusa.com" },
		{ label: "Повернення та проблеми", email: "returns@arusa.com" },
		{ label: "Кар'єра", email: "careers@arusa.com" }
	];

	return (<>
		<div className={styles.contact}>
			<div className={styles.contact__container}>
				<div className={styles.contact__wrap}>
					<div className={styles.contact__content}>
						<h1 className={`${styles.contact__title} h h_xl`}>Зв'яжітся з нами</h1>
						<p className={`${styles.contact__description} regular center`}>Наша служба підтримки клієнтів у Arusa завжди готова підтримати вас. Як ми можемо допомогти вам сьогодні?</p>
						<ul className={styles['contact__emails']}>
							{links.map(({ label, email }) => (
								<li key={email} className={`${styles['contact__email']} regular`}>
									{label}
									<Link to={`mailto:${email}`} className="regular">{email}</Link>
								</li>
							))}
						</ul>
					</div>
					<picture>
						<source srcSet="/assets/images/articles/manhattan-chicago-apartment-living-room.avif" type="image/avif" />
						<source srcSet="/assets/images/articles/manhattan-chicago-apartment-living-room.webp" type="image/webp" />
						<img fetchPriority="high" className={styles.contact__picture} width="664" height="561" src="/assets/images/articles/manhattan-chicago-apartment-living-room.png" alt="Вітальня в квартирі Манхеттен, Чикаго" />
					</picture>
				</div>
				<h4 className={`${styles['contact__side-title']} side-title h h_s`}>Контакти</h4>
			</div>
		</div>
	</>);
}