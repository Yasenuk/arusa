import { create } from 'zustand';

import { fetchWithAuth, loadData } from './auth.js';
import { CartStore } from '@org/shared-types';

export const useCartStore = create<CartStore>((set) => ({
	cart: null,

	fetchCart: async () => {
		const data = await loadData("/api/cart");
		set({ cart: data });
	},

	addItem: async (variantId) => {
		await fetchWithAuth('/api/cart/add', {
			method: 'POST',
			body: JSON.stringify({
				product_variant_id: variantId,
				quantity: 1
			})
		});

		const data = await loadData("/api/cart");
		set({ cart: data });
	},

	updateQuantity: async (variantId, quantity) => {
		await fetchWithAuth(`/api/cart/items/${variantId}`, {
			method: 'PATCH',
			body: JSON.stringify({ quantity })
		});

		const data = await loadData("/api/cart");
		set({ cart: data });
	},

	removeItem: async (variantId) => {
		await fetchWithAuth(`/api/cart/items/${variantId}`, {
			method: 'DELETE'
		});

		const data = await loadData("/api/cart");
		set({ cart: data });
	}
}));