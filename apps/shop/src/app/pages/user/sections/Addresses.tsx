import { useEffect, useState } from 'react';

import styles from '../profile.module.scss';

import { useAddressStore } from '@org/utils/index';
import { AddressForm } from '@org/ui';

export default function Addresses() {
  const { addresses, fetchAddresses, setDefault, deleteAddress } = useAddressStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchAddresses(); }, []);

  return (
    <section className={styles.profile__section}>
      <h2 className={`${styles.profile__title} large upper`}>Адреси</h2>

      {addresses.map(a => (
        <div key={a.id} className={styles.profile__address}>
          <span>{a.city} — {a.np_warehouse_description ?? `${a.street} ${a.house}`}</span>
          {!a.is_default && (
            <button className="_button small" onClick={() => setDefault(a.id)}>За замовчуванням</button>
          )}
          {a.is_default && <span>✓ Основна</span>}
          <button className="_button small" onClick={() => deleteAddress(a.id)}>Видалити</button>
        </div>
      ))}

      {showForm
        ? <AddressForm onSaved={() => setShowForm(false)} />
        : <button className="_button _button_border small upper" onClick={() => setShowForm(true)}>
            + Додати адресу
          </button>
      }
    </section>
  );
}