import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Cake,
  ChevronRight,
  ClipboardList,
  Crown,
  DollarSign,
  Plus,
  Repeat,
  TrendingUp,
} from 'lucide-react';
import { Avatar, Badge, Button, Skeleton, StatCard } from '@shared/ui';
import { analyticsService, orderService } from '@shared/services';
import { RevenueChart } from '@features/analytics/RevenueChart';
import { CategoryDonut } from '@features/analytics/CategoryDonut';
import { formatCurrency } from '@shared/utils/format';

export default function VendorDashboardPage() {
  const { data: kpis, isLoading: kpiLoading } = useQuery({
    queryKey: ['vendor', 'kpis'],
    queryFn: () => analyticsService.vendorKPIs(),
  });
  const { data: revenue } = useQuery({
    queryKey: ['vendor', 'revenue'],
    queryFn: () => analyticsService.vendorRevenue(),
  });
  const { data: categoryMix } = useQuery({
    queryKey: ['vendor', 'category-mix'],
    queryFn: () => analyticsService.vendorCategoryMix(),
  });
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.list(),
  });

  const icons: Record<string, JSX.Element> = {
    revenue: <DollarSign size={18} />,
    orders_today: <ClipboardList size={18} />,
    pending: <Cake size={18} />,
    repeat: <Repeat size={18} />,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Vendor Suite
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Good morning, Olive & Oak ☕
          </h1>
          <p className="text-ink-500 mt-1">
            You have{' '}
            <span className="font-semibold text-burgundy-700">
              12 orders in your queue
            </span>{' '}
            and 3 awaiting confirmation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md">
            Export report
          </Button>
          <Button variant="dark" size="md" leftIcon={<Plus size={16} />}>
            New product
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpiLoading || !kpis
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          : kpis.map((kpi, i) => (
              <StatCard
                key={kpi.id}
                label={kpi.label}
                value={kpi.value}
                delta={kpi.delta}
                format={kpi.format ?? 'number'}
                icon={icons[kpi.id]}
                tone={i === 0 ? 'burgundy' : 'cream'}
              />
            ))}
      </div>

      <div className="grid xl:grid-cols-[1.4fr_1fr] gap-4 mb-6">
        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                Revenue this week
              </h3>
              <p className="text-sm text-ink-500">
                +12.4% vs. last week ·{' '}
                <span className="text-emerald-600 font-semibold inline-flex items-center gap-0.5">
                  <ArrowUpRight size={12} /> beating goal
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-ink-500">
                <span className="h-2 w-2 rounded-full bg-accent-500" /> This week
              </span>
              <span className="inline-flex items-center gap-1 text-ink-500">
                <span className="h-2 w-2 rounded-full bg-burgundy-500" /> Last week
              </span>
            </div>
          </div>
          {revenue ? <RevenueChart data={revenue} /> : <Skeleton className="h-72" />}
        </section>

        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                Category mix
              </h3>
              <p className="text-sm text-ink-500">Last 30 days</p>
            </div>
            <Badge tone="accent" icon={<TrendingUp size={12} />}>
              Up 8.6%
            </Badge>
          </div>
          {categoryMix ? <CategoryDonut data={categoryMix} /> : <Skeleton className="h-64" />}
          <ul className="mt-4 space-y-2">
            {categoryMix?.map((c, i) => {
              const colors = ['#5C1F22', '#F26B1F', '#B86060', '#E5D0A6', '#3F1517'];
              return (
                <li key={c.label} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: colors[i] }}
                    />
                    {c.label}
                  </span>
                  <span className="font-semibold tabular-nums text-ink-700">
                    {c.value.toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="grid xl:grid-cols-[1.4fr_1fr] gap-4">
        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                Recent orders
              </h3>
              <p className="text-sm text-ink-500">Latest activity from your customers</p>
            </div>
            <button className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 hover:underline">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-400">
                  <th className="text-left font-semibold py-2">Order</th>
                  <th className="text-left font-semibold py-2">Customer</th>
                  <th className="text-left font-semibold py-2">Status</th>
                  <th className="text-right font-semibold py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {orders?.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-cream-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={o.items[0]?.image}
                          alt=""
                          className="h-10 w-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-semibold">{o.reference}</p>
                          <p className="text-xs text-ink-400">
                            {o.items[0]?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={o.customerName} size="xs" />
                        <span>{o.customerName}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        tone={
                          o.status === 'delivered'
                            ? 'green'
                            : o.status === 'baking'
                              ? 'accent'
                              : o.status === 'ready'
                                ? 'sky'
                                : 'amber'
                        }
                      >
                        {o.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-semibold tabular-nums">
                      {formatCurrency(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-burgundy-700 text-cream-50 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-accent-500/30 blur-3xl" />
          <div className="relative">
            <Crown size={20} className="text-accent-300" />
            <h3 className="text-display text-2xl font-semibold mt-3">
              You&apos;re #3 in Kampala this week
            </h3>
            <p className="text-sm text-cream-100/80 mt-1">
              Stay on the leaderboard with 5 more orders this week.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((n) => (
                  <Avatar key={n} name={`Bakery ${n}`} size="sm" />
                ))}
              </div>
              <Button size="sm" variant="primary">
                View leaderboard
              </Button>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
