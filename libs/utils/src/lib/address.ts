import { create } from 'zustand';
import { fetchWithAuth, loadData } from './auth.js';
import { UserAddress, CreateAddressDto } from '@org/shared-types';

type AddressStore = {
  addresses: UserAddress[];
  fetchAddresses: () => Promise<void>;
  createAddress: (data: CreateAddressDto) => Promise<UserAddress>;
  setDefault: (id: number) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
};

export const useAddressStore = create<AddressStore>((set, get) => ({
  addresses: [],

  fetchAddresses: async () => {
    const data = await loadData('/api/addresses');
    set({ addresses: data ?? [] });
  },

  createAddress: async (data) => {
    const res = await fetchWithAuth('/api/addresses', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error);
    }

    const address = await res.json();
    set({ addresses: [...get().addresses, address] });
    return address;
  },

  setDefault: async (id) => {
    await fetchWithAuth(`/api/addresses/${id}/default`, { method: 'PATCH' });
    set({
      addresses: get().addresses.map((a) => ({
        ...a,
        is_default: a.id === id
      }))
    });
  },

  deleteAddress: async (id) => {
    await fetchWithAuth(`/api/addresses/${id}`, { method: 'DELETE' });
    const remaining = get().addresses.filter((a) => a.id !== id);
    const wasDefault = get().addresses.find((a) => a.id === id)?.is_default;
    set({
      addresses: wasDefault && remaining.length
        ? [{ ...remaining[0], is_default: true }, ...remaining.slice(1)]
        : remaining
    });
  }
}));