import { prisma } from '../db/prisma';

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

export async function getProducts(ids?: number[], all?: boolean) {
  const where = ids ? {
    [!all ? 'id' : 'product_id']: { in: ids }
  } : {};

  const variants = await prisma.product_variants.findMany({
    where,
    include: {
      products: {
        include: {
          categories: true,
        },
      },
      product_images: {
        orderBy: { position: "asc" },
      },
    },
  });

  return mapVariant(variants);
}