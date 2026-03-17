import styles from "../../styles/common/form-subscribe.module.scss";

export default function FormSubscribe() {
	return (
		 <div className={styles.subscribe}>
			<div className={styles.subscribe__container}>
				<h2 className={`${styles.subscribe__title} h h_l center`}>Станьте частиною нашого клубу, щоб отримати знижку</h2>
				<form action="/" method="get" className={styles.subscribe__form} id="subscribe-form">
					<input type="email" className={`${styles.subscribe__email} small`} name="email" id="email" placeholder="Ваша електронна адреса" autoComplete="off" required />
					<input type="submit" className={`${styles.subscribe__button} _button _button_main _button_border upper`} value="Підписатись" />
				</form>
			</div>
		</div>
	);
}
