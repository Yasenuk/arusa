import { prisma } from '../db/prisma';

export type GuestOrderItem = {
  product_variant_id: number;
  quantity: number;
};

export type GuestAddress = {
  city: string;
  np_city_ref?: string;
  np_warehouse?: string;
  np_warehouse_ref?: string;
};

export type GuestInfo = {
  name: string;
  email: string;
  phone: string;
};

export async function createGuestOrder(
  items: GuestOrderItem[],
  guest: GuestInfo,
  address: GuestAddress,
) {
  if (!items.length) throw new Error('Кошик порожній');

  return await prisma.$transaction(async (tx) => {
    let total = 0;
    const enriched: Array<GuestOrderItem & { title: string; price: number }> = [];

    for (const item of items) {
      const variant = await tx.product_variants.findUnique({
        where: { id: item.product_variant_id },
        include: { products: true },
      });

      if (!variant) throw new Error(`Товар з id ${item.product_variant_id} не знайдено`);

      const inventory = await tx.inventory.findFirst({
        where: { product_variant_id: item.product_variant_id },
      });

      const available = (inventory?.quantity ?? 0) - (inventory?.reserved_quantity ?? 0);
      if (available < item.quantity) {
        throw new Error(`Недостатньо товару "${variant.products.title}" (в наявності: ${available})`);
      }

      const price = Number(variant.price ?? 0);
      total += price * item.quantity;
      enriched.push({ ...item, title: variant.products.title, price });
    }

    const order = await tx.orders.create({
      data: {
        user_id: null,
        guest_name: guest.name,
        guest_email: guest.email,
        guest_phone: guest.phone,
        guest_city: address.city,
        guest_np_city_ref: address.np_city_ref ?? null,
        guest_np_warehouse: address.np_warehouse ?? null,
        guest_np_warehouse_ref: address.np_warehouse_ref ?? null,
        status: 'PENDING_CONFIRMATION',
        total_amount: total,
        currency: 'грн',
        order_items: {
          create: enriched.map((i) => ({
            product_variant_id: i.product_variant_id,
            title_snapshot: i.title,
            price_snapshot: i.price,
            quantity: i.quantity,
          })),
        },
      },
      include: { order_items: true },
    });

    for (const item of enriched) {
      await tx.inventory.updateMany({
        where: { product_variant_id: item.product_variant_id },
        data: { reserved_quantity: { increment: item.quantity } },
      });
    }

    return order;
  });
}
