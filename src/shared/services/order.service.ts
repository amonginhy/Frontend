import { orders } from './mock-data';
import type { Order, OrderStatus } from '@shared/types';

const wait = <T>(value: T, ms = 250) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const orderService = {
  list: async (): Promise<Order[]> => wait(orders),
  byId: async (id: string): Promise<Order | undefined> =>
    wait(orders.find((o) => o.id === id || o.reference === id)),
  byStatus: async (status: OrderStatus): Promise<Order[]> =>
    wait(orders.filter((o) => o.status === status)),
  active: async (): Promise<Order | undefined> =>
    wait(orders.find((o) => ['placed', 'confirmed', 'baking', 'ready'].includes(o.status))),
};
