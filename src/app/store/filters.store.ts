import { create } from 'zustand';

export type SortKey = 'popular' | 'rating' | 'price_low' | 'price_high' | 'fastest';

interface FiltersState {
  search: string;
  category: string | null;
  priceMax: number;
  ratingMin: number;
  dietary: string[];
  sort: SortKey;
  setSearch: (v: string) => void;
  setCategory: (v: string | null) => void;
  setPriceMax: (v: number) => void;
  setRatingMin: (v: number) => void;
  toggleDietary: (id: string) => void;
  setSort: (v: SortKey) => void;
  reset: () => void;
}

const initial = {
  search: '',
  category: null,
  priceMax: 1_000_000,
  ratingMin: 0,
  dietary: [] as string[],
  sort: 'popular' as SortKey,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initial,
  setSearch: (v) => set({ search: v }),
  setCategory: (v) => set({ category: v }),
  setPriceMax: (v) => set({ priceMax: v }),
  setRatingMin: (v) => set({ ratingMin: v }),
  toggleDietary: (id) =>
    set((s) => ({
      dietary: s.dietary.includes(id)
        ? s.dietary.filter((d) => d !== id)
        : [...s.dietary, id],
    })),
  setSort: (v) => set({ sort: v }),
  reset: () => set(initial),
}));
