import { useEffect, useState } from 'react';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

import { adminFetch } from '../api';
import styles from './pages.module.scss';

type Stats = {
  revenue: { total: number; this_month: number; last_month: number; growth_percent: number };
  orders: { total: number; pending: number; paid: number; shipped: number; canceled: number };
  users: { total: number; new_this_month: number };
  products: { total: number; out_of_stock: number };
  top_products: { title: string; sold: number; revenue: number }[];
  revenue_by_month: { month: string; revenue: number }[];
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.page__empty}>Завантаження...</p>;
  if (!stats) return <p className={styles.page__empty}>Помилка завантаження</p>;

  return (
    <div>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Дашборд</h1>
      </div>

      {/* Карточки */}
      <div className={styles.stats}>
        <div className={styles.stats__card}>
          <div className={styles.stats__label}>Виручка (всього)</div>
          <div className={styles.stats__value}>{stats.revenue.total.toLocaleString()} грн</div>
          <div className={`${styles.stats__growth} ${stats.revenue.growth_percent >= 0 ? styles.stats__growth_positive : styles.stats__growth_negative}`}>
            {stats.revenue.growth_percent >= 0 ? '+' : ''}{stats.revenue.growth_percent}% до минулого місяця
          </div>
        </div>
        <div className={styles.stats__card}>
          <div className={styles.stats__label}>Виручка цього місяця</div>
          <div className={styles.stats__value}>{stats.revenue.this_month.toLocaleString()} грн</div>
          <div className={styles.stats__sub}>Минулий: {stats.revenue.last_month.toLocaleString()} грн</div>
        </div>
        <div className={styles.stats__card}>
          <div className={styles.stats__label}>Замовлення</div>
          <div className={styles.stats__value}>{stats.orders.total}</div>
          <div className={styles.stats__sub}>Очікують: {stats.orders.pending}</div>
        </div>
        <div className={styles.stats__card}>
          <div className={styles.stats__label}>Користувачі</div>
          <div className={styles.stats__value}>{stats.users.total}</div>
          <div className={styles.stats__sub}>Нових цього місяця: {stats.users.new_this_month}</div>
        </div>
        <div className={styles.stats__card}>
          <div className={styles.stats__label}>Товари</div>
          <div className={styles.stats__value}>{stats.products.total}</div>
          <div className={styles.stats__sub} style={{ color: stats.products.out_of_stock > 0 ? '#c0392b' : undefined }}>
            Немає в наявності: {stats.products.out_of_stock}
          </div>
        </div>
      </div>

      {/* Графіки */}
      <div className={styles.charts}>
        <div className={styles.charts__card}>
          <div className={styles.charts__title}>Виручка по місяцях</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.revenue_by_month}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: any) =>
                  `${Number(value ?? 0).toLocaleString()} грн`
                }
              />
              <Line type="monotone" dataKey="revenue" stroke="#a89880" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.charts__card}>
          <div className={styles.charts__title}>Статуси замовлень</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { name: 'Очікують', value: stats.orders.pending },
              { name: 'Оплачені', value: stats.orders.paid },
              { name: 'Відправлені', value: stats.orders.shipped },
              { name: 'Скасовані', value: stats.orders.canceled },
            ]}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#a89880" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Топ товари */}
      {stats.top_products.length > 0 && (
        <div className={styles.charts__card}>
          <div className={styles.charts__title}>Топ товарів</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Назва</th>
                <th>Продано</th>
                <th>Виручка</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_products.map((p, i) => (
                <tr key={i}>
                  <td>{p.title}</td>
                  <td>{p.sold} шт</td>
                  <td>{p.revenue.toLocaleString()} грн</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
