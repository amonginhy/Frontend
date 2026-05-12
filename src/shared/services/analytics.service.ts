import {
  ordersByCategorySeries,
  platformRevenueSeries,
  revenueSeries,
} from './mock-data';
import type { AnalyticsPoint, KPI } from '@shared/types';

const wait = <T>(value: T, ms = 200) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const analyticsService = {
  vendorKPIs: async (): Promise<KPI[]> =>
    wait([
      { id: 'revenue', label: 'Revenue (7d)', value: 54_800_000, delta: 12.4, format: 'currency' },
      { id: 'orders_today', label: 'Orders Today', value: 38, delta: 8.6 },
      { id: 'pending', label: 'Pending Orders', value: 12, delta: -3.2 },
      { id: 'repeat', label: 'Repeat Customers', value: 64, delta: 5.1, format: 'percent' },
    ]),
  vendorRevenue: async (): Promise<AnalyticsPoint[]> => wait(revenueSeries),
  vendorCategoryMix: async (): Promise<AnalyticsPoint[]> => wait(ordersByCategorySeries),
  adminKPIs: async (): Promise<KPI[]> =>
    wait([
      { id: 'vendors', label: 'Total Vendors', value: 1248, delta: 4.2 },
      { id: 'revenue', label: 'Platform Revenue', value: 3_790_000_000, delta: 18.6, format: 'currency' },
      { id: 'users', label: 'Active Users', value: 84200, delta: 9.4 },
      { id: 'orders', label: 'Orders (30d)', value: 12480, delta: 14.1 },
    ]),
  adminRevenue: async (): Promise<AnalyticsPoint[]> => wait(platformRevenueSeries),
};
