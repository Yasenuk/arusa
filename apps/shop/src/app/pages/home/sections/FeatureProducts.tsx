import { Link } from "react-router-dom";

import styles from "./feature-products.module.scss";

export default function FeatureProducts({ _isDark = false }: { _isDark?: boolean }) {
	return (
		<div className={`${styles['feature-products']} ${_isDark ? styles['_dark'] : ''}`}>
			<div className={styles['feature-products__container']}>
				<h2 className={`${styles['feature-products__title']} h h_m center`}>Насолоджуйтесь нашими найкращими продуктами</h2>
				<div className={styles['feature-products__items']}></div>
				<Link to="/shop" className={`${styles['feature-products__button']} _button _button_article upper`}>Купити</Link>
			</div>
		</div>
	);
}
