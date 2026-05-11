import { useEffect, useState } from 'react';

import styles from '../../styles/components/address-form.module.scss';

import { useAddressStore } from '@org/utils/index';
import { npRequest } from '@org/utils/index';

import { Dropdown } from '@org/ui';

type NpCity = { Ref: string; Description: string };
type NpWarehouse = { Ref: string; Description: string };

type Props = {
  onSaved?: (id: number) => void;
  inputClassName?: string;
  buttonLabel?: string;
  canselButton?: boolean;
};

export function AddressForm({ onSaved, inputClassName, buttonLabel = 'Зберегти адресу', canselButton = false }: Props) {
  const { createAddress } = useAddressStore();

  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState<NpCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NpCity | null>(null);
  const [warehouses, setWarehouses] = useState<NpWarehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<NpWarehouse | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (cityQuery.length < 2) { setCities([]); return; }
    const timeout = setTimeout(async () => {
      const data = await npRequest('Address', 'getCities', { FindByString: cityQuery });
      setCities(data?.slice(0, 10) ?? []);
    }, 400);
    return () => clearTimeout(timeout);
  }, [cityQuery]);

  useEffect(() => {
    if (!selectedCity) return;
    npRequest('AddressGeneral', 'getWarehouses', { CityRef: selectedCity.Ref, Limit: 50 })
      .then(data => setWarehouses(data ?? []));
  }, [selectedCity]);

  const handleSave = async () => {
    if (!selectedCity || !selectedWarehouse) return;
    setSaving(true);
    try {
      const address = await createAddress({
        region: '',
        city: selectedCity.Description,
        np_city_ref: selectedCity.Ref,
        np_warehouse_ref: selectedWarehouse.Ref,
        np_warehouse_description: selectedWarehouse.Description,
        delivery_type: 'warehouse',
      });

      onSaved?.(address.id);

      setCityQuery('');
      setSelectedCity(null);
      setSelectedWarehouse(null);
      setWarehouses([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.form__header}>
        <input
          className={`${inputClassName || styles.form__input} _button _button_border _button_article _button_no-center regular`}
          placeholder="Місто"
          value={cityQuery}
          onChange={e => { setCityQuery(e.target.value); setSelectedCity(null); }}
        />
        {canselButton && (
          <button
            className="_button _button_main _button_border small upper"
            onClick={() => onSaved && onSaved(-1)}
            disabled={saving}
          >
            Скасувати
          </button>
        )}
      </div>
      {cities.length > 0 && !selectedCity && (
        <ul className={styles.form__list}>
          {cities.map(c => (
            <li className={`${styles.form__item} regular _button _button_article _button_no-center no-inline`} key={c.Ref} onClick={() => { setSelectedCity(c); setCityQuery(c.Description); setCities([]); }}>
              {c.Description}
            </li>
          ))}
        </ul>
      )}
      {selectedCity && (
        <Dropdown
          label="Оберіть відділення"
          options={warehouses.map(w => ({ value: w.Ref, label: w.Description }))}
          value={selectedWarehouse?.Ref ?? ''}
          onChange={ref => setSelectedWarehouse(warehouses.find(w => w.Ref === ref) ?? null)}
        />
      )}
      {selectedWarehouse && (
        <button
          className="_button _button_main _button_border small upper"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Збереження...' : buttonLabel}
        </button>
      )}
    </div>
  );
}