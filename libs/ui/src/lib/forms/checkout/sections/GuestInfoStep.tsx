import styles from '../../../../styles/common/checkout.module.scss';
import formStyles from '../../../../styles/common/form.module.scss';

export type GuestInfo = {
  name: string;
  email: string;
  phone: string;
};

type Props = {
  info: GuestInfo;
  onChange: (info: GuestInfo) => void;
  onNext: () => void;
};

export default function GuestInfoStep({ info, onChange, onNext }: Props) {
  const isValid = info.name.trim().length >= 2 && info.email.includes('@') && info.phone.trim().length >= 9;

  const field = (key: keyof GuestInfo, placeholder: string, type = 'text') => (
    <input
      className={`${formStyles.form__input || ''} _button _button_border _button_article _button_no-center regular`}
      type={type}
      placeholder={placeholder}
      value={info[key]}
      onChange={(e) => onChange({ ...info, [key]: e.target.value })}
      required
    />
  );

  return (
    <div className={styles.checkout__step}>
      <h2 className={`${styles.checkout__title} large upper center`}>Ваші дані</h2>
      <div className={styles.checkout__fields}>
        {field('name', "Ім'я та прізвище")}
        {field('email', 'Email', 'email')}
        {field('phone', 'Телефон', 'tel')}
      </div>
      <button
        className="_button _button_main _button_border small upper"
        disabled={!isValid}
        onClick={onNext}
      >
        Далі
      </button>
    </div>
  );
}
