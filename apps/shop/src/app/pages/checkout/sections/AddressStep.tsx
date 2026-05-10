import { useEffect, useState } from 'react';

import { useAddressStore } from '@org/utils/index';
import { npRequest } from '@org/utils/index';

import styles from '../checkout.module.scss';

import { Dropdown } from '@org/ui';

type Props = {
	selectedId: number | undefined;
	onSelect: (id: number | undefined) => void;
	onNext: () => void;
};

type NpCity = { Ref: string; Description: string };
type NpWarehouse = { Ref: string; Description: string; Number: string };

export default function AddressStep({ selectedId, onSelect, onNext }: Props) {
	const { addresses, fetchAddresses, createAddress } = useAddressStore();

	const [cityQuery, setCityQuery] = useState('');
	const [cities, setCities] = useState<NpCity[]>([]);
	const [selectedCity, setSelectedCity] = useState<NpCity | null>(null);
	const [warehouses, setWarehouses] = useState<NpWarehouse[]>([]);
	const [selectedWarehouse, setSelectedWarehouse] = useState<NpWarehouse | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetchAddresses();
	}, []);

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
		npRequest('AddressGeneral', 'getWarehouses', {
			CityRef: selectedCity.Ref,
			Limit: 50
		}).then(data => setWarehouses(data ?? []));
	}, [selectedCity]);

	const handleSaveAndSelect = async () => {
		if (!selectedCity || !selectedWarehouse) return;
		setSaving(true);
		try {
			const address = await createAddress({
				region: '',
				city: selectedCity.Description,
				np_city_ref: selectedCity.Ref,
				np_warehouse_ref: selectedWarehouse.Ref,
				np_warehouse_description: selectedWarehouse.Description,
				delivery_type: 'warehouse'
			});
			onSelect(address.id);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className={styles.step}>
			<h2 className={`${styles.step__title} large upper`}>Адреса доставки</h2>

			{addresses.length > 0 && (
				<div className={styles.step__saved}>
					<h3 className={styles.step__subtitle}>Збережені адреси</h3>
					{addresses.map(a => (
						<label key={a.id} className={styles.step__address_option}>
							<input
								type="radio"
								name="address"
								checked={selectedId === a.id}
								onChange={() => onSelect(a.id)}
							/>
							<span>{a.city} — {a.np_warehouse_description ?? `${a.street} ${a.house}`}</span>
						</label>
					))}
				</div>
			)}

			<div className={styles.step__new}>
				<h3 className={styles.step__subtitle}>Нова адреса (Нова Пошта)</h3>
				<input
					className={styles.step__input}
					placeholder="Місто"
					value={cityQuery}
					onChange={e => { setCityQuery(e.target.value); setSelectedCity(null); }}
				/>
				{cities && cities.length > 0 && !selectedCity && (
					<ul className={styles.step__dropdown}>
						{cities.map(c => (
							<li key={c.Ref} onClick={() => {
								setSelectedCity(c);
								setCityQuery(c.Description);
								setCities([]);
								setSelectedWarehouse(null);
							}}>
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
						onChange={ref => {
							const w = warehouses.find(w => w.Ref === ref) ?? null;
							setSelectedWarehouse(w);
						}}
					/>
				)}

				{selectedWarehouse && (
					<button
						className={`_button _button_main _button_border small upper`}
						onClick={handleSaveAndSelect}
						disabled={saving}
					>
						{saving ? 'Збереження...' : 'Використати цю адресу'}
					</button>
				)}
			</div>

			<button
				className={`${styles.step__next} _button _button_main _button_fill small upper`}
				disabled={!selectedId}
				onClick={onNext}
			>
				Далі
			</button>
		</div>
	);
}