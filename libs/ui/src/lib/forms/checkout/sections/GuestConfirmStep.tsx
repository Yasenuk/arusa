import type { GuestInfo } from './GuestInfoStep';
import type { GuestAddress } from './GuestAddressStep';
import styles from '../../../../styles/common/checkout.module.scss';

type Props = {
  info: GuestInfo;
  address: GuestAddress | null;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string | null;
};

export default function GuestConfirmStep({ info, address, onBack, onConfirm, loading, error }: Props) {
  return (
    <div className={styles.checkout__step}>
      <h2 className={`${styles.checkout__title} large upper center`}>Підтвердження</h2>

      <div className={styles.step__confirm_address}>
        <h3 className={styles.step__subtitle}>Контактні дані:</h3>
        <p>{info.name}</p>
        <p>{info.email}</p>
        <p>{info.phone}</p>
      </div>

      <div className={styles.step__confirm_address}>
        <h3 className={styles.step__subtitle}>Доставка (Нова Пошта):</h3>
        {address ? (
          <p>{address.city} — {address.np_warehouse}</p>
        ) : (
          <p>Адресу не вибрано</p>
        )}
      </div>

      {error && <p className={styles.step__error}>{error}</p>}

      <div className={styles.checkout__step_buttons}>
        <button
          className="_button _button_main _button_border small upper"
          onClick={onBack}
          disabled={loading}
        >
          Назад
        </button>
        <button
          className="_button _button_main _button_border small upper"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Оформлення...' : 'Перейти до оплати'}
        </button>
      </div>
    </div>
  );
}
