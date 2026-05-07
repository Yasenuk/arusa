export type CartItem = {
  id?: number;
  title: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
};

export type Cart = {
  user_id: number;
  cart_items: CartItem[];
};

export type CartData = {
  cart: Cart;
  totalItems: {
    count: number,
    price: number
  };
};

export type CartStore = {
  cart: CartData | null;
  fetchCart: () => Promise<void>;
  addItem: (variantId: number) => Promise<void>;
  updateQuantity: (variantId: number, quantity: number) => Promise<void>;
  removeItem: (variantId: number) => Promise<void>;
};