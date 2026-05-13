import { useState } from 'react';
import { useCartStore, useOrderStore } from '@org/utils/index';

import OrderSummary from './sections/OrderSummary';
import AddressStep from './sections/AddressStep';
import ConfirmStep from './sections/ConfirmStep';

import Popup from '../../modals/popup';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Checkout({ isOpen, onClose }: Props) {
  const cart = useCartStore(s => s.cart);
  const fetchCart = useCartStore(s => s.fetchCart);
  const createOrder = useOrderStore(s => s.createOrder);

  const [step, setStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setStep(0);
    setSelectedAddressId(undefined);
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      await createOrder(selectedAddressId);
      await fetchCart();
      handleClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pages = [
    {
      content: (
        <>
          <AddressStep
            selectedId={selectedAddressId}
            onSelect={setSelectedAddressId}
            onNext={() => setStep(1)}
          />
          <OrderSummary />
        </>
      ),
    },
    {
      content: (
        <>
          <ConfirmStep
            addressId={selectedAddressId}
            onBack={() => setStep(0)}
            onConfirm={handleConfirm}
            loading={loading}
            error={error}
          />
          <OrderSummary />
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