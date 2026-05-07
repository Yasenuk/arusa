import { useAddressStore } from '@org/utils/index';
import styles from '../checkout.module.scss';

type Props = {
  addressId: number | undefined;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string | null;
};

export default function ConfirmStep({ addressId, onBack, onConfirm, loading, error }: Props) {
  const addresses = useAddressStore(s => s.addresses);
  const address = addresses.find(a => a.id === addressId);

  return (
    <div className={styles.step}>
      <h2 className={`${styles.step__title} large upper`}>Підтвердження</h2>

      <div className={styles.step__confirm_address}>
        <h3 className={styles.step__subtitle}>Доставка:</h3>
        {address ? (
          <p>{address.city} — {address.np_warehouse_description ?? `${address.street} ${address.house}`}</p>
        ) : (
          <p>Адресу не вибрано</p>
        )}
      </div>

      {error && <p className={styles.step__error}>{error}</p>}

      <div className={styles.step__buttons}>
        <button
          className={`_button _button_main _button_border small upper`}
          onClick={onBack}
          disabled={loading}
        >
          Назад
        </button>
        <button
          className={`_button _button_main _button_fill small upper`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Оформлення...' : 'Підтвердити замовлення'}
        </button>
      </div>
    </div>
  );
}