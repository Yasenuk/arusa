import { Outlet, Navigate } from 'react-router-dom';

import Sidebar from './Sidebar';
import styles from './layout.module.scss';

export default function AdminLayout() {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.layout__main}>
        <Outlet />
      </main>
    </div>
  );
}