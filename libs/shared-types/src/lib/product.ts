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