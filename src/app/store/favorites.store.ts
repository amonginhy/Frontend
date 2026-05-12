import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  productIds: string[];
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (id) => {
        const exists = get().productIds.includes(id);
        set({
          productIds: exists
            ? get().productIds.filter((p) => p !== id)
            : [...get().productIds, id],
        });
        return !exists;
      },
      has: (id) => get().productIds.includes(id),
      clear: () => set({ productIds: [] }),
    }),
    { name: 'sweetly:favorites' },
  ),
);
