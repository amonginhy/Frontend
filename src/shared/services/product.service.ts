import {
  bakeries,
  dietaryOptions,
  fillingOptions,
  flavorOptions,
  products,
  reviews,
  sizeOptions,
  toppingOptions,
} from './mock-data';
import type { Bakery, Product, Review } from '@shared/types';

const wait = <T>(value: T, ms = 250) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const productService = {
  list: async (): Promise<Product[]> => wait(products),
  byId: async (id: string): Promise<Product | undefined> =>
    wait(products.find((p) => p.id === id)),
  related: async (id: string): Promise<Product[]> => {
    const base = products.find((p) => p.id === id);
    return wait(
      products
        .filter((p) => p.id !== id && p.category === base?.category)
        .slice(0, 4),
    );
  },
  reviewsFor: async (_id: string): Promise<Review[]> => wait(reviews),
  customizationOptions: async () =>
    wait({
      sizes: sizeOptions,
      flavors: flavorOptions,
      fillings: fillingOptions,
      toppings: toppingOptions,
      dietary: dietaryOptions,
    }),
};

export const bakeryService = {
  list: async (): Promise<Bakery[]> => wait(bakeries),
  bySlug: async (slug: string): Promise<Bakery | undefined> =>
    wait(bakeries.find((b) => b.slug === slug)),
  featured: async (): Promise<Bakery[]> =>
    wait(bakeries.filter((b) => b.featured)),
};
