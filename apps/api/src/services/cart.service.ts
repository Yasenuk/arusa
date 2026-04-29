import { prisma } from '../db/prisma';

export async function createCart(user_id: number) {
	return await prisma.carts.create({
		data: { user_id },
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
}

export async function getCart(user_id: number) {
	let cart = await prisma.carts.findUnique({
		where: { user_id },
		include: {
			cart_items: {
				include: {
					product_variants: {
						include: {
							products: true,
							product_images: true
						}
					}
				}
			}
		}
	});

	if (!cart) {
		cart = await createCart(user_id);
	}

	const items = cart.cart_items.map(i => ({
		id: i.product_variant_id,
		title: i.product_variants.products.title,
		size: i.product_variants.size,
		price: Number(i.product_variants.price),
		image: i.product_variants.product_images[0]?.image_url,
		quantity: i.quantity
	}));

	const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
	const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

	return {
		cart: {
			user_id: cart.user_id,
			cart_items: items
		},
		totalItems: {
			count: totalCount,
			price: totalPrice
		}
	};
}

export async function addToCart(user_id: number, product_variant_id: number, quantity: number = 1) {
	let cart = await prisma.carts.findUnique({
		where: { user_id }
	});

	if (!cart) {
		cart = await prisma.carts.create({
			data: { user_id }
		});
	}

	const existingItem = await prisma.cart_items.findUnique({
		where: {
			cart_id_product_variant_id: {
				cart_id: cart.id,
				product_variant_id
			}
		}
	});

	if (existingItem) {
		return await prisma.cart_items.update({
			where: { id: existingItem.id },
			data: {
				quantity: { increment: quantity }
			}
		});
	}

	return await prisma.cart_items.create({
		data: {
			cart_id: cart.id,
			product_variant_id,
			quantity
		}
	});
}

export async function updateCartItemQuantity(
  user_id: number,
  product_variant_id: number,
  quantity: number
) {
  const cart = await prisma.carts.findUnique({
    where: { user_id }
  });

  if (!cart) throw new Error('Помилка: корзина не знайдена');

  const existingItem = await prisma.cart_items.findUnique({
    where: {
      cart_id_product_variant_id: {
        cart_id: cart.id,
        product_variant_id
      }
    }
  });

  if (!existingItem) {
    return null;
  }

  if (quantity <= 0) {
    return await prisma.cart_items.delete({
      where: {
        cart_id_product_variant_id: {
          cart_id: cart.id,
          product_variant_id
        }
      }
    });
  }

  return await prisma.cart_items.update({
    where: {
      cart_id_product_variant_id: {
        cart_id: cart.id,
        product_variant_id
      }
    },
    data: {
      quantity
    }
  });
}

export async function removeFromCart(
  user_id: number,
  product_variant_id: number
) {
  const cart = await prisma.carts.findUnique({
    where: { user_id }
  });

  if (!cart) throw new Error('Помилка: корзина не знайдена');

  const existingItem = await prisma.cart_items.findUnique({
    where: {
      cart_id_product_variant_id: {
        cart_id: cart.id,
        product_variant_id
      }
    }
  });

  if (!existingItem) {
    return null;
  }

  return await prisma.cart_items.delete({
    where: {
      cart_id_product_variant_id: {
        cart_id: cart.id,
        product_variant_id
      }
    }
  });
}