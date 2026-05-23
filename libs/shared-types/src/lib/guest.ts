export type GuestCartItem = {
  product_variant_id: number;
  quantity: number;
  title: string;
  price: number;
  size: string | null;
  image: string | null;
};

export type GuestCartStore = {
  items: GuestCartItem[];
  addItem: (variantId: number) => Promise<void>;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clear: () => void;
};