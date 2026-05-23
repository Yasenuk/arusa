import { useState } from 'react';
import { useGuestCartStore } from '@org/utils/index';
import Popup from '../../modals/popup';

import GuestInfoStep, { type GuestInfo } from './sections/GuestInfoStep';
import GuestAddressStep, { type GuestAddress } from './sections/GuestAddressStep';
import GuestConfirmStep from './sections/GuestConfirmStep';
import GuestOrderSummary from './sections/GuestOrderSummary';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function GuestCheckout({ isOpen, onClose }: Props) {
  const items = useGuestCartStore((s) => s.items);
  const clearCart = useGuestCartStore((s) => s.clear);

  const [step, setStep] = useState(0);
  const [info, setInfo] = useState<GuestInfo>({ name: '', email: '', phone: '' });
  const [address, setAddress] = useState<GuestAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setStep(0);
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/guest/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_variant_id: i.product_variant_id,
            quantity: i.quantity,
          })),
          guest: info,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Помилка оформлення замовлення');
        return;
      }

      clearCart();
      handleClose();

      if (data.stripe_url) {
        window.location.href = data.stripe_url;
      }
    } catch {
      setError('Помилка з\'єднання. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  const pages = [
    {
      content: (
        <>
          <GuestInfoStep info={info} onChange={setInfo} onNext={() => setStep(1)} />
          <GuestOrderSummary />
        </>
      ),
    },
    {
      content: (
        <>
          <GuestAddressStep
            address={address}
            onChange={setAddress}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
          <GuestOrderSummary />
        </>
      ),
    },
    {
      content: (
        <>
          <GuestConfirmStep
            info={info}
            address={address}
            onBack={() => setStep(1)}
            onConfirm={handleConfirm}
            loading={loading}
            error={error}
          />
          <GuestOrderSummary />
        </>
      ),
    },
  ];

  return (
    <Popup
      isOpen={isOpen}
      page={step}
      pages={pages}
      title="Оформлення замовлення"
      onClose={handleClose}
      onPageChange={setStep}
    />
  );
}
