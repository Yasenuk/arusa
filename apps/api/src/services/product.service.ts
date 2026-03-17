import { prisma } from '../db/prisma';

export async function createProduct(title: string, description: string, material: string, article: string, category_id: number, variants: any[]) {
  const product = await prisma.products.create({
    data: {
      title,
      description,
      material,
      article,
      category_id
    }
  });

  for (const v of variants) {
    const variant = await prisma.product_variants.create({
      data: {
        product_id: product.id,
        size: v.size,
        color: v.color,
        sku: v.sku,
        price: v.price,
      }
    });

    await prisma.inventory.create({
      data: {
        product_variant_id: variant.id,
        quantity: v.quantity
      }
    });

    if (v.images && v.images.length) {
      await prisma.product_images.createMany({
        data: v.images.map((img: string, i: number) => ({
          variant_id: variant.id,
          image_url: img,
          position: i
        }))
      });
    }

    return product;
  }
}


export async function getProducts() {
  const products = await prisma.products.findMany({
    where: {
      is_active: true
    },
    include: {
      categories: true,
      product_variants: {
        include: {
          product_images: true
        }
      }
    },
    orderBy: {
      id: "asc"
    }
  });

  return products.map((p) => {
    const prices = p.product_variants
      .map(v => v.price)

    const avgPrice =
      prices.length > 0
        ? prices.reduce((a, b) => a + Number(b), 0) / prices.length
        : null;

    const images = p.product_variants
      .flatMap(v => v.product_images)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    return {
      id: p.id,
      title: p.title,
      material: p.material,
      category: p.categories?.name ?? null,
      price: avgPrice,
      preview_image: images[0]?.image_url ?? null
    };
  });
}