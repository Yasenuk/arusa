import styles from "./team.module.scss";

export default function Team() {
	return (
		<div className={styles.team}>
			<p className={`${styles.team__suptitle} regular upper center`}>Ідеї для пошуку</p>
			<div className={styles.team__container}>
				<div className={styles['team__picture-wrap']}>
					<picture>
						<source srcSet="/assets/images/about/team-picture.avif" type="image/avif" />
						<source srcSet="/assets/images/about/team-picture.webp" type="image/webp" />
						<img loading="lazy" className={styles.team__picture} width="736" height="736" src="/assets/images/about/team-picture.jpg" alt="Команда дизайнерів, які працюють разом у студії" />
					</picture>
				</div>
				<section className={styles.team__content}>
					<h2 className={`${styles.team__title} h h_l`}>Декілька нотаток від творця</h2>
					<div className={styles.team__row}>
						<p className={`${styles.team__description} upper regular`}>Меблі, що пропонують інтелектуальні рішення, що поєднують сталий розвиток, якість, дизайн, кращу вартість і, найголовніше, добробут.</p>
						<p className={`${styles.team__description} regular`}>
							Бренд пропонує позачасові меблі з натуральних тканин, вигнутих ліній, безлічі дзеркал та класичного дизайну, які можна включити до будь-якого декоративного проєкту. Вироби зачаровують своєю стриманістю, щоб служити поколінням, вірні формам кожної епохи, з відтінком сучасності.
							<img loading="lazy" src="/assets/images/signature.svg" alt="Підпис" className={styles.team__signature} width="150" height="50" />
						</p>
					</div>
				</section>
				<h3 className={`${styles['team__side-title']} side-title h h_s`}>Аналітика</h3>
			</div>
		</div>
	);
}