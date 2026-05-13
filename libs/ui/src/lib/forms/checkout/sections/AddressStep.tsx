import { useEffect, useState } from 'react';

import { useAddressStore } from '@org/utils/index';

import styles from '../../../../styles/common/checkout.module.scss';

import Dropdown from '../../../dropdowns/dropdown';
import { AddressForm } from '../../AddressForm';

type Props = {
  selectedId: number | undefined;
  onSelect: (id: number | undefined) => void;
  onNext: () => void;
};

export default function AddressStep({ selectedId, onSelect, onNext }: Props) {
  const { addresses, fetchAddresses } = useAddressStore();

  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchAddresses(); }, []);

  useEffect(() => {
    if (!selectedId && addresses.length > 0) {
      const defaultAddress = addresses.find(a => a.is_default) ?? addresses[0];
      onSelect(defaultAddress.id);
    }
  }, [addresses]);

  return (
    <div className={styles.checkout__step}>
      <h2 className={`${styles.checkout__title} large upper center`}>Адреса доставки</h2>

      {addresses.length > 0 && (
        <Dropdown
          label="Оберіть адресу"
          options={addresses.map(a => ({
            value: String(a.id),
            label: a.city + ' — ' + (a.np_warehouse_description ?? `${a.street} ${a.house}`),
          }))}
          value={selectedId ? String(selectedId) : ''}
          onChange={id => onSelect(Number(id))}
        />
      )}

      {showForm
        ? <AddressForm onSaved={() => setShowForm(false)} canselButton={true} />
        : <button className="_button _button_main _button_border small upper" onClick={() => setShowForm(true)}>
          + Додати адресу
        </button>
      }

      <button className={`_button _button_main _button_border`} disabled={!selectedId} onClick={onNext}>Далі</button>
    </div>
  );
}