'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  category: string;
  condition: string;
  quantity: number;
  weight?: number; // lbs
  requiresFreight?: boolean;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getTotalWeight: () => number;
  hasFreightItems: () => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.productId === item.productId);

        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex].quantity += item.quantity || 1;
          set({ items: updated });
        } else {
          set({ items: [...items, { ...item, quantity: item.quantity || 1 }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalWeight: () => {
        return get().items.reduce((sum, item) => {
          const itemWeight = item.weight || 0;
          return sum + itemWeight * item.quantity;
        }, 0);
      },

      hasFreightItems: () => {
        return get().items.some((item) => item.requiresFreight);
      },
    }),
    {
      name: 'ps-medical-cart',
      version: 1,
    }
  )
);
