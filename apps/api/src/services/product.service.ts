import { prisma } from '../db/prisma';

// Типи для фільтрів
export interface ProductFilters {
  category?: string;
  sort?: 'a_z' | 'z_a' | 'price_asc' | 'price_desc';
  search?: string;
  color?: string;
  material?: string;
  availability?: 'all' | 'in_stock' | 'out_of_stock';
  page?: number;
  limit?: number;
}

export interface ProductsResult {
  data: ReturnType<typeof mapVariant>;
  total: number;
  page: number;
  totalPages: number;
}

export async function createProduct(title: string, description: string, article: string, category_id: number, variants: any[]) {
  const product = await prisma.products.create({
    data: {
      title,
      description,
      article,
      category_id,
      product_variants: {
        create: variants.map((v) => ({
          size: v.size,
          color: v.color,
          sku: v.sku,
          price: v.price,
          material: v.material,
          weight: v.weight,
          quantity: v.quantity,
          product_images: {
            create: v.product_images.map((file: { image_url: string, position: number }) => ({
              image_url: `https://pub-${process.env.R2_PUBLIC_KEY}.r2.dev/${file.image_url}`,
              position: file.position
            }))
          }
        }))
      }
    }
  });

  return product;
}

function mapVariant(variants: any[]) {
  return variants.map((v) => ({
    id: v.id,
    product_id: v.product_id,

    title: v.products.title,
    description: v.products.description,
    article: v.products.article,
    category: v.products.categories?.name,

    size: v.size,
    color: v.color,
    sku: v.sku,
    price: Number(v.price),
    material: v.material,
    weight: v.weight,
    quantity: v.quantity,

    image: v.product_images[0]?.image_url,
  }));
}

// Отримання конкретних варіантів за IDs (для сторінки продукту)
export async function getProductsByIds(ids: number[], allVariants = false) {
  const where = {
    [allVariants ? 'product_id' : 'id']: { in: ids }
  };

  const variants = await prisma.product_variants.findMany({
    where,
    include: {
      products: { include: { categories: true } },
      product_images: { orderBy: { position: 'asc' } },
    },
  });

  return mapVariant(variants);
}

// Отримання всіх продуктів з фільтрами та серверною пагінацією
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResult> {
  const {
    category,
    sort = 'a_z',
    search,
    color,
    material,
    availability = 'all',
    page = 1,
    limit = 12,
  } = filters;

  // Будуємо WHERE для product_variants
  const variantWhere: any = {};

  if (color) variantWhere.color = { contains: color, mode: 'insensitive' };
  if (material) variantWhere.material = { contains: material, mode: 'insensitive' };
  if (availability === 'in_stock') variantWhere.quantity = { gt: 0 };
  if (availability === 'out_of_stock') variantWhere.quantity = 0;

  // WHERE для вкладеного products
  const productWhere: any = { is_active: true };
  if (search) productWhere.title = { contains: search, mode: 'insensitive' };
  if (category) {
    productWhere.categories = { name: { equals: category, mode: 'insensitive' } };
  }

  variantWhere.products = productWhere;

  // Сортування
  const orderBy: any =
    sort === 'price_asc' ? { price: 'asc' } :
    sort === 'price_desc' ? { price: 'desc' } :
    sort === 'z_a' ? { products: { title: 'desc' } } :
    { products: { title: 'asc' } }; // a_z за замовчуванням

  // Рахуємо загальну кількість для пагінації
  const total = await prisma.product_variants.count({ where: variantWhere });

  const skip = (page - 1) * limit;

  const variants = await prisma.product_variants.findMany({
    where: variantWhere,
    orderBy,
    skip,
    take: limit,
    include: {
      products: { include: { categories: true } },
      product_images: { orderBy: { position: 'asc' } },
    },
  });

  return {
    data: mapVariant(variants),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}