import { useEffect } from 'react';

import { useAddressStore } from '@org/utils/index';

import styles from '../checkout.module.scss';

import { AddressForm } from '@org/ui';

type Props = {
	selectedId: number | undefined;
	onSelect: (id: number | undefined) => void;
	onNext: () => void;
};

export default function AddressStep({ selectedId, onSelect, onNext }: Props) {
  const { addresses, fetchAddresses } = useAddressStore();

  useEffect(() => { fetchAddresses(); }, []);

  return (
    <div className={styles.step}>
      <h2>Адреса доставки</h2>

      {addresses.map(a => (
        <label key={a.id}>
          <input type="radio" checked={selectedId === a.id} onChange={() => onSelect(a.id)} />
          <span>{a.city} — {a.np_warehouse_description ?? `${a.street} ${a.house}`}</span>
        </label>
      ))}

      <AddressForm onSaved={onSelect} />

      <button disabled={!selectedId} onClick={onNext}>Далі</button>
    </div>
  );
}