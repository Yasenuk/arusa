import { Link } from 'react-router-dom';
import AdminCreateCategory from '../../AdminCreateCategory';
import styles from '../pages.module.scss';

export default function CategoryCreate() {
  return (
    <div>
      <Link to="/categories" className={styles.page__back}>← Назад</Link>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Нова категорія</h1>
      </div>
      <AdminCreateCategory />
    </div>
  );
}
