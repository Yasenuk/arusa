
import { User } from '@org/shared-types';
import styles from '../profile.module.scss';
import { useAuth } from '@org/ui';

export default function Personal({ user }: { user: User | null }) {
	const { logout } = useAuth();

	return (
		<section className={styles.profile__section}>
			<h2 className={`${styles.profile__title} large upper`}>Персональні дані</h2>

			{!user && <p className={`${styles['profile__no-data']} regular`}>Немає даних користувача</p>}

			{user && <div className={styles.profile__info}>
				<div className={styles.profile__info_item}>
					<span className={`${styles.profile__info_label} regular`}>Ім'я:</span>
					<span className={`${styles.profile__info_value} regular`}>{user.first_name}</span>
				</div>
				<div className={styles.profile__info_item}>
					<span className={`${styles.profile__info_label} regular`}>Прізвище:</span>
					<span className={`${styles.profile__info_value} regular`}>{user.last_name}</span>
				</div>
				<div className={styles.profile__info_item}>
					<span className={`${styles.profile__info_label} regular`}>По-батькові:</span>
					<span className={`${styles.profile__info_value} regular`}>{user.middle_name || `Не вказано`}</span>
				</div>
				<div className={styles.profile__info_item}>
					<span className={`${styles.profile__info_label} regular`}>Номер телефону:</span>
					<span className={`${styles.profile__info_value} regular`}>{user.phone || 'Не вказано'}</span>
				</div>
				<div className={styles.profile__info_item}>
					<span className={`${styles.profile__info_label} regular`}>Email:</span>
					<span className={`${styles.profile__info_value} regular`}>{user.email}</span>
				</div>
			</div>}
			<div className={styles.profile__buttons}>
				<button className={`${styles.profile__button} _button _button_main _button_border small upper`}>Редагувати</button>
				<button className={`${styles.profile__button} _button _button_main _button_border small upper`} onClick={logout}>
					Вийти
				</button>
			</div>
		</section>
	);
}