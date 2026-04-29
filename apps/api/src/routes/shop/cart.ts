import { Router } from "express";
import { addToCart, getCart, removeFromCart, updateCartItemQuantity } from "../../services/cart.service";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.get("/cart", authMiddleware, async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({ error: "Не авторизовано" });
		}

		const user_id = Number(req.user.id);

		const cartData = await getCart(user_id);

		return res.json(cartData);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Помилка отримання корзини" });
	}
});

router.post('/cart/add', authMiddleware, async (req, res) => {
	try {
		const user_id = Number(req?.user?.id);
		const { product_variant_id, quantity } = req.body;

		const item = await addToCart(user_id, product_variant_id, quantity);

		res.json(item);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Помилка додавання в кошик' });
	}
});

router.patch('/cart/items/:variantId', authMiddleware, async (req, res) => {
	try {
		const user_id = Number(req?.user?.id);
		const product_variant_id = Number(req.params.variantId);
		const { quantity } = req.body;

		const item = await updateCartItemQuantity(
			user_id,
			product_variant_id,
			quantity
		);

		if (!item) {
			return res.status(404).json({ error: 'Товар не знайдено' });
		}

		res.json(item);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Помилка оновлення кількості в кошику' });
	}
});

router.delete('/cart/items/:variantId', authMiddleware, async (req, res) => {
	try {
		const user_id = Number(req?.user?.id);
		const product_variant_id = Number(req.params.variantId);

		const result = await removeFromCart(
			user_id,
			product_variant_id
		);

		if (!result) {
			return res.status(404).json({ error: 'Товар не знайдено' });
		}

		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Помилка видалення з кошика" });
	}
});

export default router;