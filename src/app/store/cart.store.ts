import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@shared/types';

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  setPromo: (code: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promoCode: null,
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      updateQuantity: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.id === id ? { ...i, quantity: qty } : i))
            .filter((i) => i.quantity > 0),
        })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [], promoCode: null }),
      setPromo: (code) => set({ promoCode: code }),
    }),
    { name: 'sweetly:cart' },
  ),
);

export const cartSelectors = {
  itemCount: (s: CartState) => s.items.reduce((acc, i) => acc + i.quantity, 0),
  subtotal: (s: CartState) =>
    s.items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0),
};
