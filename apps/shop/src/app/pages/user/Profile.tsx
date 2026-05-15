import { useEffect, useState } from 'react';

import { User } from '@org/shared-types';
import { loadData } from '@org/utils/index';

import styles from './profile.module.scss';

import Personal from './sections/Personal';
import Orders from './sections/Orders';
import Addresses from './sections/Addresses';
import Payment from './sections/Payment';

export default function Profile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [activeSection, setActiveSection] = useState("personal");

	useEffect(() => {
		const fetchUser = async () => {
			const data = await loadData("/api/me");
			setUser(data);
		};

		fetchUser();
	}, []);

	function slideUp() {
		window.scrollTo({
			top: 0
		});
	}

	const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

	return (<div className={styles.profile}>
		<div className={styles.profile__container}>
			<button className={`${styles.profile__burger} ${isMenuOpen ? '_open' : ''}`} onClick={toggleMenu} aria-label="Меню">
        <span /><span /><span />
      </button>
			<aside className={`${styles.profile__sidebar} ${isMenuOpen ? '_open' : ''}`}>
				<ul className={`${styles.profile__menu}`}>
					<li className={styles.profile__menu_item}>
						<button
							onClick={() => { setActiveSection("personal"); setIsMenuOpen(false); slideUp() }}
							className={`${styles.profile__menu_button} ${activeSection === "personal" ? styles.active : ""
								} _button _button_fill _button_article _button_no-center regular no-inline`}
						>
							Персональні дані
						</button>
					</li>

					<li className={styles.profile__menu_item}>
						<button
							onClick={() => { setActiveSection("orders"); setIsMenuOpen(false); slideUp() }}
							className={`${styles.profile__menu_button} ${activeSection === "orders" ? styles.active : ""
								} _button _button_no-center _button_fill _button_article regular no-inline`}
						>
							Замовлення
						</button>
					</li>

					<li className={styles.profile__menu_item}>
						<button
							onClick={() => { setActiveSection("addresses"); setIsMenuOpen(false); slideUp() }}
							className={`${styles.profile__menu_button} ${activeSection === "addresses" ? styles.active : ""
								} _button _button_no-center _button_fill _button_article regular no-inline`}
						>
							Адреси
						</button>
					</li>

					<li className={styles.profile__menu_item}>
						<button
							onClick={() => { setActiveSection("payment"); setIsMenuOpen(false); slideUp() }}
							className={`${styles.profile__menu_button} ${activeSection === "payment" ? styles.active : ""
								} _button _button_no-center _button_fill _button_article regular no-inline`}
						>
							Оплата
						</button>
					</li>
				</ul>
			</aside>
			<div className={styles.profile__overlay} onClick={() => setIsMenuOpen(false)} />
			<section className={styles.profile__main}>
				{activeSection === 'personal' && <Personal user={user} onUpdate={setUser} />}
				{activeSection === 'orders' && <Orders />}
				{activeSection === 'addresses' && <Addresses />}
				{activeSection === 'payment' && <Payment />}
			</section>
		</div>
	</div>);
}