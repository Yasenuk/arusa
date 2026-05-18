import { NavLink, useNavigate } from 'react-router-dom';
import styles from './layout.module.scss';

const NAV = [
  { to: '/dashboard', label: 'Дашборд' },
  { to: '/products', label: 'Товари' },
  { to: '/categories', label: 'Категорії' },
  { to: '/articles', label: 'Статті' },
  { to: '/orders', label: 'Замовлення' },
  { to: '/users', label: 'Користувачі' },
  { to: '/payments', label: 'Платежі' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__logo}>Arusa Admin</div>
      <nav className={styles.sidebar__nav}>
        {NAV.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.sidebar__link} ${isActive ? styles.sidebar__link_active : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <button className={styles.sidebar__logout} onClick={logout}>
        Вийти
      </button>
    </aside>
  );
}