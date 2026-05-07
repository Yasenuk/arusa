import { prisma } from "../db/prisma";

export async function createOrder(user_id: number, address_id?: number) {
	return await prisma.$transaction(async (tx) => {
		const cart = await tx.carts.findUnique({
			where: { user_id },
			include: {
				cart_items: {
					include: {
						product_variants: {
							include: {
								products: true
							}
						}
					}
				}
			}
		});

		if (!cart || cart.cart_items.length === 0) {
			throw new Error("Кошик порожній");
		}

		for (const item of cart.cart_items) {
			const inventory = await tx.inventory.findFirst({
				where: { product_variant_id: item.product_variant_id }
			});

			const avalible = (inventory?.quantity || 0) - (inventory?.reserved_quantity || 0);

			if (avalible < item?.quantity) {
				throw new Error(
					`Недостатньо товару id[${item.product_variant_id}] (${avalible})`
				);
			}
		}

		const total_amount = cart.cart_items.reduce((sum, item) => {
			return sum + Number(item.product_variants.price) * item.quantity
		}, 0);

		const order = await tx.orders.create({
			data: {
				user_id,
				address_id: address_id ?? null,
				status: "PENDING_CONFIRMATION",
				total_amount,
				currency: "грн",
				order_items: {
					create: cart.cart_items.map((item) => ({
						product_variant_id: item.product_variant_id,
						price_snapshot: item.product_variants.price ?? 0,
						title_snapshot: item.product_variants.products.title,
						quantity: item.quantity
					}))
				}
			},
			include: {
				order_items: true
			}
		});

		for (const item of cart.cart_items) {
			await tx.inventory.updateMany({
				where: { product_variant_id: item.product_variant_id },
				data: {
					reserved_quantity: { increment: item.quantity }
				}
			})
		}

		await tx.cart_items.deleteMany({
			where: { cart_id: cart.id }
		});

		return order;
	});
}

export async function getOrders(user_id: number) {
	const orders = await prisma.orders.findMany({
		where: { user_id },
		orderBy: { created_at: "desc" },
		include: {
			order_items: true,
			user_addresses: true,
			deliveries: {
				orderBy: { id: "desc" },
				take: 1
			}
		}
	});

	return orders.map(normalizeOrder);
}

export async function getOrderById(user_id: number, order_id: number) {
	const order = await prisma.orders.findFirst({
		where: { id: order_id, user_id },
		include: {
			order_items: true,
			user_addresses: true,
			deliveries: {
				orderBy: { id: "desc" },
				take: 1
			}
		}
	});

	if (!order) throw new Error("Замовлення не знайдено");

	return normalizeOrder(order);
}

function normalizeOrder(order: OrderWithRelations) {
  return {
    id: order.id,
    status: order.status,
    total_amount: Number(order.total_amount),
    currency: order.currency,
    created_at: order.created_at,
    updated_at: order.updated_at,
    address: order.user_addresses ?? null,
    delivery: order.deliveries[0] ?? null,
    items: order.order_items.map((item) => ({
      id: item.id,
      product_variant_id: item.product_variant_id,
      title_snapshot: item.title_snapshot,
      price_snapshot: Number(item.price_snapshot),
      quantity: item.quantity
    }))
  };
}

type OrderWithRelations = Awaited<
	ReturnType<typeof prisma.orders.findFirst<{
    include: {
      order_items: true;
      user_addresses: true;
      deliveries: true;
    }
  }>>
> & {};