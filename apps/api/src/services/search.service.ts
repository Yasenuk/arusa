import { esClient } from '../lib/elastic/client';
import { prisma } from '../db/prisma';
import { ProductFilters } from './product.service';

// Синхронізація одного варіанту в ES індекс
export async function indexProductVariant(variantId: number) {
  const variant = await prisma.product_variants.findUnique({
    where: { id: variantId },
    include: {
      products: { include: { categories: true } },
      product_images: { orderBy: { position: 'asc' } },
    },
  });

  if (!variant) return;

  await esClient.index({
    index: 'product_variants',
    id: String(variant.id),
    document: {
      variant_id: variant.id,
      product_id: variant.product_id,
      title: variant.products.title,
      description: variant.products.description,
      article: variant.products.article,
      category: variant.products.categories?.name ?? null,
      color: variant.color,
      material: variant.material,
      price: Number(variant.price),
      quantity: variant.quantity,
      size: variant.size,
      is_active: variant.products.is_active,
    },
  });
}

// Повна переіндексація всіх продуктів (для адмін команди або міграції)
export async function reindexAll() {
  const variants = await prisma.product_variants.findMany({
    include: {
      products: { include: { categories: true } },
    },
  });

  const operations = variants.flatMap((v) => [
    { index: { _index: 'product_variants', _id: String(v.id) } },
    {
      variant_id: v.id,
      product_id: v.product_id,
      title: v.products.title,
      description: v.products.description,
      article: v.products.article,
      category: v.products.categories?.name ?? null,
      color: v.color,
      material: v.material,
      price: Number(v.price),
      quantity: v.quantity,
      size: v.size,
      is_active: v.products.is_active,
    },
  ]);

  if (operations.length > 0) {
    await esClient.bulk({ operations });
    await esClient.indices.refresh({ index: 'product_variants' });
  }

  return variants.length;
}

export interface SearchResult {
  variantIds: number[];
  total: number;
}

// Пошук через ES — повертає тільки IDs, решту даних беремо з Prisma
export async function searchProducts(filters: ProductFilters): Promise<SearchResult> {
  const {
    search,
    category,
    sort = 'a_z',
    page = 1,
    limit = 12,
  } = filters;

  const must: any[] = [
    { term: { is_active: true } },
  ];

  const filter: any[] = [];

  // Пошук по тексту — шукаємо в title і description з буст-пріоритетом
  if (search) {
    must.push({
      multi_match: {
        query: search,
        fields: ['title^3', 'description', 'article'],
        fuzziness: 'AUTO', // дозволяє дрібні друкарські помилки
        operator: 'and',
      },
    });
  }

  if (category && category !== 'all') {
    filter.push({ term: { category } });
  }

  // Сортування
  const sortQuery: any[] =
    sort === 'price_asc'  ? [{ price: 'asc' }] :
    sort === 'price_desc' ? [{ price: 'desc' }] :
    sort === 'z_a'        ? [{ 'title.keyword': { order: 'desc' } }] :
                            [{ 'title.keyword': { order: 'asc' } }];

  const from = (page - 1) * limit;

  const response = await esClient.search({
    index: 'product_variants',
    from,
    size: limit,
    sort: sortQuery,
    query: {
      bool: { must, filter },
    },
  });

  const total = typeof response.hits.total === 'number'
    ? response.hits.total
    : response.hits.total?.value ?? 0;

  const variantIds = response.hits.hits.map((h) => Number(h._id));

  return { variantIds, total };
}
