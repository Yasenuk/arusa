import { Link } from 'react-router-dom';
import styles from '../pages.module.scss';
import AdminCreateProduct from '../../AdminCreateProduct';

export default function ProductCreate() {
  return (
    <div>
      <Link to="/products" className={styles.page__back}>← Назад</Link>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Новий товар</h1>
      </div>
      <AdminCreateProduct />
    </div>
  );
}
