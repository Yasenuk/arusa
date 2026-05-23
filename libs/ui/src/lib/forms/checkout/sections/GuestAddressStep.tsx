import { useEffect, useState } from 'react';
import { npRequest } from '@org/utils/index';
import { Dropdown } from '../../../dropdowns/dropdown';
import styles from '../../../../styles/common/checkout.module.scss';
import formStyles from '../../../../styles/common/address-form.module.scss';

export type GuestAddress = {
  city: string;
  np_city_ref: string;
  np_warehouse: string;
  np_warehouse_ref: string;
};

type NpCity = { Ref: string; Description: string };
type NpWarehouse = { Ref: string; Description: string };

type Props = {
  address: GuestAddress | null;
  onChange: (address: GuestAddress) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function GuestAddressStep({ address, onChange, onNext, onBack }: Props) {
  const [cityQuery, setCityQuery] = useState(address?.city ?? '');
  const [cities, setCities] = useState<NpCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NpCity | null>(
    address ? { Ref: address.np_city_ref, Description: address.city } : null
  );
  const [warehouses, setWarehouses] = useState<NpWarehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<NpWarehouse | null>(
    address ? { Ref: address.np_warehouse_ref, Description: address.np_warehouse } : null
  );

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
      .then((data) => setWarehouses(data ?? []));
  }, [selectedCity]);

  const handleCitySelect = (city: NpCity) => {
    setSelectedCity(city);
    setCityQuery(city.Description);
    setCities([]);
    setSelectedWarehouse(null);
    onChange({ city: city.Description, np_city_ref: city.Ref, np_warehouse: '', np_warehouse_ref: '' });
  };

  const handleWarehouseSelect = (ref: string) => {
    const wh = warehouses.find((w) => w.Ref === ref) ?? null;
    setSelectedWarehouse(wh);
    if (wh && selectedCity) {
      onChange({
        city: selectedCity.Description,
        np_city_ref: selectedCity.Ref,
        np_warehouse: wh.Description,
        np_warehouse_ref: wh.Ref,
      });
    }
  };

  const isValid = !!address?.np_warehouse_ref;

  return (
    <div className={styles.checkout__step}>
      <h2 className={`${styles.checkout__title} large upper center`}>Адреса доставки</h2>

      <div className={formStyles.form}>
        <input
          className={`${formStyles.form__input} _button _button_border _button_article _button_no-center regular`}
          placeholder="Місто"
          value={cityQuery}
          onChange={(e) => { setCityQuery(e.target.value); setSelectedCity(null); }}
        />

        {cities.length > 0 && !selectedCity && (
          <ul className={formStyles.form__list}>
            {cities.map((c) => (
              <li
                key={c.Ref}
                className={`${formStyles.form__item} regular _button _button_article _button_no-center no-inline`}
                onClick={() => handleCitySelect(c)}
              >
                {c.Description}
              </li>
            ))}
          </ul>
        )}

        {selectedCity && warehouses.length > 0 && (
          <Dropdown
            label="Оберіть відділення"
            options={warehouses.map((w) => ({ value: w.Ref, label: w.Description }))}
            value={selectedWarehouse?.Ref ?? ''}
            onChange={handleWarehouseSelect}
          />
        )}
      </div>

      <div className={styles.checkout__step_buttons}>
        <button className="_button _button_main _button_border small upper" onClick={onBack}>
          Назад
        </button>
        <button
          className="_button _button_main _button_border small upper"
          disabled={!isValid}
          onClick={onNext}
        >
          Далі
        </button>
      </div>
    </div>
  );
}
