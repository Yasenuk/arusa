import { render } from '@testing-library/react';

import { CartProductCard } from './cart-product-card';

describe('CartProductCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CartProductCard />);
    expect(baseElement).toBeTruthy();
  });
});
