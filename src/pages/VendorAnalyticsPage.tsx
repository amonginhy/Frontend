import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo, useState } from 'react';
import { Award, Repeat, ShoppingBag, Target } from 'lucide-react';
import { Badge, Skeleton, StatCard } from '@shared/ui';
import { productService } from '@shared/services';
import { RevenueChart } from '@features/analytics/RevenueChart';
import { CategoryDonut } from '@features/analytics/CategoryDonut';
import { formatCurrency, formatCurrencyCompact } from '@shared/utils/format';
import type { AnalyticsPoint } from '@shared/types';

const RANGES = ['7d', '30d', '90d', '12m'] as const;
type Range = (typeof RANGES)[number];

// Per-range datasets — each tuple = [revenueSeries, acquisitionSeries, kpis]
type RangeDataset = {
  revenue: AnalyticsPoint[];
  acquisition: AnalyticsPoint[];
  categoryMix: AnalyticsPoint[];
  kpis: {
    revenue: number;
    revenueDelta: number;
    aov: number;
    aovDelta: number;
    conversion: number;
    conversionDelta: number;
    retention: number;
    retentionDelta: number;
  };
  acquisitionLabel: string;
  costPerAcquisition: number;
  comparisonLabel: string;
};

const DATASETS: Record<Range, RangeDataset> = {
  '7d': {
    revenue: [
      { label: 'Mon', value: 4_588_000, secondary: 3_626_000 },
      { label: 'Tue', value: 6_882_000, secondary: 4_070_000 },
      { label: 'Wed', value: 7_807_000, secondary: 4_958_000 },
      { label: 'Thu', value: 6_438_000, secondary: 4_736_000 },
      { label: 'Fri', value: 9_916_000, secondary: 6_734_000 },
      { label: 'Sat', value: 11_618_000, secondary: 7_955_000 },
      { label: 'Sun', value: 10_582_000, secondary: 7_437_000 },
    ],
    acquisition: [
      { label: 'Mon', value: 8 },
      { label: 'Tue', value: 12 },
      { label: 'Wed', value: 18 },
      { label: 'Thu', value: 14 },
      { label: 'Fri', value: 22 },
      { label: 'Sat', value: 31 },
      { label: 'Sun', value: 27 },
    ],
    categoryMix: [
      { label: 'Cakes', value: 84 },
      { label: 'Cupcakes', value: 56 },
      { label: 'Pastries', value: 38 },
      { label: 'Cookies', value: 22 },
      { label: 'Bread', value: 14 },
    ],
    kpis: {
      revenue: 54_831_000,
      revenueDelta: 12.4,
      aov: 285_000,
      aovDelta: 3.2,
      conversion: 4.7,
      conversionDelta: 0.6,
      retention: 64,
      retentionDelta: 5.1,
    },
    acquisitionLabel: 'Acquisition · this week',
    costPerAcquisition: 12_400,
    comparisonLabel: 'Day-over-day vs last week',
  },
  '30d': {
    revenue: [
      { label: 'W1', value: 38_400_000, secondary: 32_100_000 },
      { label: 'W2', value: 42_900_000, secondary: 33_500_000 },
      { label: 'W3', value: 49_200_000, secondary: 36_800_000 },
      { label: 'W4', value: 54_800_000, secondary: 40_400_000 },
    ],
    acquisition: [
      { label: 'W1', value: 64 },
      { label: 'W2', value: 78 },
      { label: 'W3', value: 92 },
      { label: 'W4', value: 112 },
    ],
    categoryMix: [
      { label: 'Cakes', value: 412 },
      { label: 'Cupcakes', value: 286 },
      { label: 'Pastries', value: 198 },
      { label: 'Cookies', value: 124 },
      { label: 'Bread', value: 84 },
    ],
    kpis: {
      revenue: 185_300_000,
      revenueDelta: 18.6,
      aov: 298_000,
      aovDelta: 4.6,
      conversion: 5.1,
      conversionDelta: 0.9,
      retention: 67,
      retentionDelta: 6.4,
    },
    acquisitionLabel: 'Acquisition · this month',
    costPerAcquisition: 11_800,
    comparisonLabel: 'Week-over-week vs prior month',
  },
  '90d': {
    revenue: [
      { label: 'Feb', value: 142_000_000, secondary: 118_000_000 },
      { label: 'Mar', value: 168_400_000, secondary: 132_000_000 },
      { label: 'Apr', value: 185_300_000, secondary: 148_000_000 },
    ],
    acquisition: [
      { label: 'Feb', value: 248 },
      { label: 'Mar', value: 312 },
      { label: 'Apr', value: 346 },
    ],
    categoryMix: [
      { label: 'Cakes', value: 1_240 },
      { label: 'Cupcakes', value: 820 },
      { label: 'Pastries', value: 560 },
      { label: 'Cookies', value: 360 },
      { label: 'Bread', value: 240 },
    ],
    kpis: {
      revenue: 495_700_000,
      revenueDelta: 22.4,
      aov: 305_000,
      aovDelta: 5.8,
      conversion: 5.4,
      conversionDelta: 1.2,
      retention: 71,
      retentionDelta: 8.1,
    },
    acquisitionLabel: 'Acquisition · last 90 days',
    costPerAcquisition: 11_200,
    comparisonLabel: 'Month-over-month vs prior 90 days',
  },
  '12m': {
    revenue: [
      { label: 'May', value: 91_000_000, secondary: 76_000_000 },
      { label: 'Jun', value: 106_400_000, secondary: 88_000_000 },
      { label: 'Jul', value: 115_500_000, secondary: 96_000_000 },
      { label: 'Aug', value: 125_000_000, secondary: 104_000_000 },
      { label: 'Sep', value: 137_200_000, secondary: 114_000_000 },
      { label: 'Oct', value: 152_300_000, secondary: 126_000_000 },
      { label: 'Nov', value: 160_400_000, secondary: 134_000_000 },
      { label: 'Dec', value: 188_800_000, secondary: 156_000_000 },
      { label: 'Jan', value: 142_000_000, secondary: 118_000_000 },
      { label: 'Feb', value: 142_000_000, secondary: 121_000_000 },
      { label: 'Mar', value: 168_400_000, secondary: 132_000_000 },
      { label: 'Apr', value: 185_300_000, secondary: 148_000_000 },
    ],
    acquisition: [
      { label: 'May', value: 198 },
      { label: 'Jun', value: 224 },
      { label: 'Jul', value: 246 },
      { label: 'Aug', value: 278 },
      { label: 'Sep', value: 302 },
      { label: 'Oct', value: 318 },
      { label: 'Nov', value: 348 },
      { label: 'Dec', value: 412 },
      { label: 'Jan', value: 264 },
      { label: 'Feb', value: 248 },
      { label: 'Mar', value: 312 },
      { label: 'Apr', value: 346 },
    ],
    categoryMix: [
      { label: 'Cakes', value: 4_840 },
      { label: 'Cupcakes', value: 3_120 },
      { label: 'Pastries', value: 2_240 },
      { label: 'Cookies', value: 1_420 },
      { label: 'Bread', value: 980 },
    ],
    kpis: {
      revenue: 1_714_800_000,
      revenueDelta: 38.2,
      aov: 312_000,
      aovDelta: 8.1,
      conversion: 5.6,
      conversionDelta: 1.8,
      retention: 73,
      retentionDelta: 11.4,
    },
    acquisitionLabel: 'Acquisition · last 12 months',
    costPerAcquisition: 10_400,
    comparisonLabel: 'Month-over-month vs prior 12 months',
  },
};

const rangeLabel: Record<Range, string> = {
  '7d': 'last 7 days',
  '30d': 'last 30 days',
  '90d': 'last 90 days',
  '12m': 'last 12 months',
};

export default function VendorAnalyticsPage() {
  const [range, setRange] = useState<Range>('7d');

  const dataset = DATASETS[range];

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.list(),
  });

  // Scale best-seller "sold" counts to match the selected range
  const bestSellers = useMemo(() => {
    const multiplier =
      range === '7d' ? 1 : range === '30d' ? 4 : range === '90d' ? 12 : 48;
    return (products ?? [])
      .slice()
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 5)
      .map((p, idx) => ({
        ...p,
        unitsSold: Math.round(((p.reviews / 10) * multiplier) - idx * multiplier),
        growth: 15 - idx * 2 + (range === '12m' ? 8 : range === '90d' ? 4 : 0),
      }));
  }, [products, range]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Analytics
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Performance deep dive
          </h1>
          <p className="text-ink-500 mt-1">
            Revenue trends, top sellers, and customer behavior over the {rangeLabel[range]}.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
                range === r ? 'bg-white shadow-soft text-burgundy-700' : 'text-ink-500'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Revenue"
          value={dataset.kpis.revenue}
          delta={dataset.kpis.revenueDelta}
          format="currency"
          icon={<ShoppingBag size={18} />}
          tone="burgundy"
        />
        <StatCard
          label="Avg. order value"
          value={dataset.kpis.aov}
          delta={dataset.kpis.aovDelta}
          format="currency"
          tone="cream"
        />
        <StatCard
          label="Conversion rate"
          value={dataset.kpis.conversion}
          delta={dataset.kpis.conversionDelta}
          format="percent"
          icon={<Target size={18} />}
          tone="accent"
        />
        <StatCard
          label="Retention"
          value={dataset.kpis.retention}
          delta={dataset.kpis.retentionDelta}
          format="percent"
          icon={<Repeat size={18} />}
          tone="cream"
        />
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr] gap-4 mb-6">
        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="mb-4">
            <h3 className="text-display text-xl font-semibold text-burgundy-700">
              Revenue · {range}
            </h3>
            <p className="text-sm text-ink-500">{dataset.comparisonLabel}</p>
          </div>
          <RevenueChart data={dataset.revenue} height={300} />
        </section>

        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="mb-2">
            <h3 className="text-display text-xl font-semibold text-burgundy-700">
              Category mix
            </h3>
            <p className="text-sm text-ink-500">Orders by type · {rangeLabel[range]}</p>
          </div>
          <CategoryDonut data={dataset.categoryMix} />
        </section>
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr] gap-4">
        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                Best sellers
              </h3>
              <p className="text-sm text-ink-500">By total orders, {rangeLabel[range]}</p>
            </div>
            <Badge tone="accent" icon={<Award size={12} />}>Top 5</Badge>
          </div>
          {bestSellers.length === 0 ? (
            <Skeleton className="h-72" />
          ) : (
            <ul className="space-y-3">
              {bestSellers.map((p, idx) => (
                <li
                  key={p.id}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-cream-200"
                >
                  <span className="text-display text-2xl font-semibold text-ink-300 w-6">
                    {idx + 1}
                  </span>
                  <img
                    src={p.image}
                    alt=""
                    className="h-12 w-12 rounded-2xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-ink-400 capitalize">
                      {p.category} · {p.unitsSold} sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums text-burgundy-700">
                      {formatCurrency(p.basePrice)}
                    </p>
                    <p className="text-xs text-emerald-600">+{p.growth.toFixed(1)}%</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <h3 className="text-display text-xl font-semibold text-burgundy-700 mb-1">
            New customers
          </h3>
          <p className="text-sm text-ink-500 mb-4">{dataset.acquisitionLabel}</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={dataset.acquisition}
              margin={{ top: 6, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid stroke="#F0E2C7" strokeDasharray="4 6" vertical={false} />
              <XAxis dataKey="label" stroke="#A39B8E" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#A39B8E" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #F0E2C7',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="#F26B1F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-cream-100 flex items-center justify-between text-sm">
            <span className="text-ink-500">Cost per acquisition</span>
            <span className="font-semibold text-burgundy-700">
              {formatCurrencyCompact(dataset.costPerAcquisition)}
            </span>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
