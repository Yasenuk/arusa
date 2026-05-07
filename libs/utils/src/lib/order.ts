import { create } from 'zustand';

import { fetchWithAuth, loadData } from './auth.js';

import { OrderStore } from '@org/shared-types';

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],

  fetchOrders: async () => {
    const data = await loadData('/api/orders');
    set({ orders: data ?? [] });
  },

  createOrder: async (address_id?) => {
    const res = await fetchWithAuth('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ address_id })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error);
    }

    const order = await res.json();
    return order;
  }
}));