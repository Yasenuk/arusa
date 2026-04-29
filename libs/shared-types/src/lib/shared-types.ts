export type User = {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
};

export type AuthUser = Pick<User, "id" | "role">;

export type Category = {
  id: number;
  name: string;
  parent_id: number | null;
};

export type ProductImage = {
  image_url: string;
  position: number;
};

export type ProductVariant = {
  id?: number;
  size: string;
  color: string;
  sku: string;
  price: number;
  material: string;
  weight: number;
  quantity: number;
  product_images: ProductImage[];
};

export type Product = {
  title: string;
  description: string;
  article: string;
  category_id: number;
  product_variants: ProductVariant[];
};

export type CatalogProductVariant = {
  id: number;
  product_id: number;

  title: string;
  description: string;
  article: string;
  category: string;

  size: string;
  color: string;
  sku: string;
  price: number;
  material: string;
  weight: number;
  quantity: number;

  image: string;
};

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