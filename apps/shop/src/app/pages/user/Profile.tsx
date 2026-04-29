import { useEffect, useState } from 'react';

import { User } from '@org/shared-types';
import { loadData } from '@org/utils/index';

import styles from './profile.module.scss';

import Personal from './sections/Personal';
import Orders from './sections/Orders';
import Addresses from './sections/Addresses';
import Payment from './sections/Payment';

export default function Profile() {
	const [user, setUser] = useState<User | null>(null);
	const [activeSection, setActiveSection] = useState("personal");

	useEffect(() => {
		const fetchUser = async () => {
			const data = await loadData("/api/me");
			setUser(data);
		};

		fetchUser();
	}, []);

	return (<div className={styles.profile}>
		<div className={styles.profile__container}>
			<aside className={styles.profile__sidebar}>
				<ul className={styles.profile__menu}>
					<li className={styles.profile__menu_item}>
						<button
							onClick={() => setActiveSection("personal")}
							className={`${styles.profile__menu_button} ${activeSection === "personal" ? styles.active : ""
								} _button _button_fill _button_article _button_no-center regular no-inline`}
						>
							Персональні дані
						</button>
					</li>

					<li className={styles.profile__menu_item}>
						<button
							onClick={() => setActiveSection("orders")}
							className={`${styles.profile__menu_button} ${activeSection === "orders" ? styles.active : ""
								} _button _button_no-center _button_fill _button_article regular no-inline`}
						>
							Замовлення
						</button>
					</li>

					<li className={styles.profile__menu_item}>
						<button
							onClick={() => setActiveSection("addresses")}
							className={`${styles.profile__menu_button} ${activeSection === "addresses" ? styles.active : ""
								} _button _button_no-center _button_fill _button_article regular no-inline`}
						>
							Адреси
						</button>
					</li>

					<li className={styles.profile__menu_item}>
						<button
							onClick={() => setActiveSection("payment")}
							className={`${styles.profile__menu_button} ${activeSection === "payment" ? styles.active : ""
								} _button _button_no-center _button_fill _button_article regular no-inline`}
						>
							Оплата
						</button>
					</li>
				</ul>
			</aside>
			<section className={styles.profile__main}>
				<Personal user={user} />
				<Orders />
				<Addresses />
				<Payment />
			</section>
		</div>
	</div>);
}