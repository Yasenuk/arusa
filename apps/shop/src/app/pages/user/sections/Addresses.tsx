
import { use, useEffect, useState } from 'react';

import styles from '../profile.module.scss';

import { npRequest } from '@org/utils/index';

export default function Addresses() {
	const [addresses, setAddresses] = useState([]);

	useEffect(() => {
		
	}, []);

	return (
		<section className={styles.profile__section}>
			<h2 className={`${styles.profile__title} large upper`}>Адреси</h2>
		</section>
	);
}