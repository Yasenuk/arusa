import { useEffect, useState } from 'react';
import { adminFetch } from '../../api';
import styles from '../pages.module.scss';

type InventoryItem = {
  id: number;
  product_variant_id: number;
  quantity: number;
  reserved_quantity: number;
  available: number;
  sku: string;
  title: string;
  size: string;
  color: string;
};

type SortKey = 'title' | 'sku' | 'size' | 'color' | 'quantity' | 'reserved_quantity' | 'available';
type SortDir = 'asc' | 'desc';

export default function InventoryList() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState(0);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  useEffect(() => {
    adminFetch('/api/admin/inventory')
      .then(r => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (id: number) => {
    await adminFetch(`/api/admin/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity: editQty }),
    });
    setItems(prev => prev.map(i => i.id === id
      ? { ...i, quantity: editQty, available: editQty - i.reserved_quantity }
      : i
    ));
    setEditId(null);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const arrow = (key: SortKey) => (<span style={{ position: 'absolute' }}>{sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}</span>);

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv), 'uk');
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Інвентаризація</h1>
        <input
          className={styles.form__input}
          placeholder="Пошук по назві або SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 260 }}
        />
      </div>

      {loading && <p className={styles.page__empty}>Завантаження...</p>}
      {!loading && sorted.length === 0 && <p className={styles.page__empty}>Нічого не знайдено</p>}

      {!loading && sorted.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>Товар{arrow('title')}</th>
              <th onClick={() => handleSort('sku')} style={{ cursor: 'pointer' }}>SKU{arrow('sku')}</th>
              <th onClick={() => handleSort('size')} style={{ cursor: 'pointer' }}>Розмір{arrow('size')}</th>
              <th onClick={() => handleSort('color')} style={{ cursor: 'pointer' }}>Колір{arrow('color')}</th>
              <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>Всього{arrow('quantity')}</th>
              <th onClick={() => handleSort('reserved_quantity')} style={{ cursor: 'pointer' }}>Резерв{arrow('reserved_quantity')}</th>
              <th onClick={() => handleSort('available')} style={{ cursor: 'pointer' }}>Доступно{arrow('available')}</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(item => (
              <tr key={item.id} style={{ background: item.available === 0 ? '#fff5f5' : undefined }}>
                <td>{item.title}</td>
                <td style={{ fontSize: 12, color: '#888' }}>{item.sku}</td>
                <td>{item.size || '—'}</td>
                <td>{item.color || '—'}</td>
                <td>
                  {editId === item.id
                    ? <input
                        type="number"
                        min={0}
                        value={editQty}
                        onChange={e => setEditQty(Number(e.target.value))}
                        className={styles.form__input}
                        style={{ width: 80 }}
                        autoFocus
                      />
                    : item.quantity
                  }
                </td>
                <td style={{ color: item.reserved_quantity > 0 ? '#e67e22' : undefined }}>
                  {item.reserved_quantity}
                </td>
                <td style={{ fontWeight: 600, color: item.available === 0 ? '#c0392b' : item.available < 3 ? '#e67e22' : '#27ae60' }}>
                  {item.available}
                </td>
                <td>
                  <div className={styles.table__actions}>
                    {editId === item.id ? (
                      <>
                        <button className={styles.table__btn} onClick={() => handleSave(item.id)}>Зберегти</button>
                        <button className={styles.table__btn} onClick={() => setEditId(null)}>Скасувати</button>
                      </>
                    ) : (
                      <button className={styles.table__btn} onClick={() => { setEditId(item.id); setEditQty(item.quantity); }}>
                        Редагувати
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
