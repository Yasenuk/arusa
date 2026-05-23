import { prisma } from '../db/prisma';

// Типи для фільтрів
export interface ProductFilters {
  category?: string;
  sort?: 'a_z' | 'z_a' | 'price_asc' | 'price_desc';
  search?: string;
  color?: string;
  material?: string;
  availability?: 'all' | 'in_stock' | 'out_of_stock';
  price_min?: number;
  price_max?: number;
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
          },
          inventory: {
            create: { quantity: v.quantity, reserved_quantity: 0 }
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

async function collectCategoryIds(categoryName: string): Promise<number[]> {
  const root = await prisma.categories.findFirst({
    where: { name: { equals: categoryName, mode: 'insensitive' } },
  });

  if (!root) return [];

  const ids: number[] = [];

  const queue = [root.id];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    ids.push(currentId);

    const children = await prisma.categories.findMany({
      where: { parent_id: currentId },
      select: { id: true },
    });

    children.forEach((c) => queue.push(c.id));
  }

  return ids;
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResult> {
  const {
    category,
    sort = 'a_z',
    search,
    color,
    material,
    availability = 'all',
    price_min,
    price_max,
    page = 1,
    limit = 12,
  } = filters;

  const conditions: any[] = [{ products: { is_active: true } }];

  if (category) {
    const categoryIds = await collectCategoryIds(category);
    if (categoryIds.length > 0) conditions.push({ products: { category_id: { in: categoryIds } } });
  }

  if (color) conditions.push({ color: { contains: color, mode: 'insensitive' } });
  if (material) conditions.push({ material: { contains: material, mode: 'insensitive' } });
  if (availability === 'in_stock') conditions.push({ quantity: { gt: 0 } });
  if (availability === 'out_of_stock') conditions.push({ quantity: 0 });
  if (price_min !== undefined) conditions.push({ price: { gte: price_min } });
  if (price_max !== undefined) conditions.push({ price: { lte: price_max } });

  if (search) {
    const s = { contains: search, mode: 'insensitive' as const };
    conditions.push({
      OR: [
        { products: { title: s } },
        { products: { description: s } },
        { products: { article: s } },
        { sku: s },
        { color: s },
        { material: s },
      ],
    });
  }

  const variantWhere: any = { AND: conditions };

  const orderBy: any =
    sort === 'price_asc' ? { price: 'asc' } :
      sort === 'price_desc' ? { price: 'desc' } :
        sort === 'z_a' ? { products: { title: 'desc' } } :
          { products: { title: 'asc' } };

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