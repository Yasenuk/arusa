import { create } from 'zustand';

import { GuestCartItem, GuestCartStore } from '@org/shared-types';

const STORAGE_KEY = 'arusa_guest_cart';

function load(): GuestCartItem[] {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save(items: GuestCartItem[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const useGuestCartStore = create<GuestCartStore>((set, get) => ({
  items: load(),

  addItem: async (variantId) => {
    const current = get().items;
    const existing = current.find((i) => i.product_variant_id === variantId);

    if (existing) {
      const updated = current.map((i) =>
        i.product_variant_id === variantId ? { ...i, quantity: i.quantity + 1 } : i
      );
      save(updated);
      set({ items: updated });
      return;
    }

    try {
      const res = await fetch(`/api/products?ids=${variantId}&all=true`);
      const data = await res.json();
      const variant = Array.isArray(data) ? data[0] : null;
      if (!variant) return;

      const newItem: GuestCartItem = {
        product_variant_id: variantId,
        quantity: 1,
        title: variant.title,
        price: Number(variant.price),
        size: variant.size ?? null,
        image: variant.image ?? null,
      };

      const updated = [...current, newItem];
      save(updated);
      set({ items: updated });
    } catch { }
  },

  removeItem: (variantId) => {
    const updated = get().items.filter((i) => i.product_variant_id !== variantId);
    save(updated);
    set({ items: updated });
  },

  updateQuantity: (variantId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(variantId);
      return;
    }
    const updated = get().items.map((i) =>
      i.product_variant_id === variantId ? { ...i, quantity } : i
    );
    save(updated);
    set({ items: updated });
  },

  clear: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    set({ items: [] });
  },
}));
