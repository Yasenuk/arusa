import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useOrderStore } from '@org/utils/index';

import styles from './checkout.module.scss';
import OrderSummary from './sections/OrderSummary';
import AddressStep from './sections/AddressStep';
import ConfirmStep from './sections/ConfirmStep';

type CheckoutStep = 'address' | 'confirm';

export default function Checkout() {
  const navigate = useNavigate();
  const cart = useCartStore(s => s.cart);
  const fetchCart = useCartStore(s => s.fetchCart);
  const createOrder = useOrderStore(s => s.createOrder);

  const [step, setStep] = useState<CheckoutStep>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      const order = await createOrder(selectedAddressId);
      await fetchCart();
      navigate(`/profile`, { state: { newOrderId: order.id } });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.cart?.cart_items?.length) {
    return (
      <div className={styles.checkout}>
        <div className={styles.checkout__container}>
          <p>Кошик порожній</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkout}>
      <div className={styles.checkout__container}>
        <div className={styles.checkout__layout}>
          <div className={styles.checkout__main}>
            {step === 'address' && (
              <AddressStep
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
                onNext={() => setStep('confirm')}
              />
            )}
            {step === 'confirm' && (
              <ConfirmStep
                addressId={selectedAddressId}
                onBack={() => setStep('address')}
                onConfirm={handleConfirm}
                loading={loading}
                error={error}
              />
            )}
          </div>
          <aside className={styles.checkout__aside}>
            <OrderSummary />
          </aside>
        </div>
      </div>
    </div>
  );
}