import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronRight,
  DollarSign,
  Flag,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { Avatar, Badge, Button, Skeleton, StatCard } from '@shared/ui';
import { analyticsService, bakeryService } from '@shared/services';
import { RevenueChart } from '@features/analytics/RevenueChart';
import { formatCurrencyCompact } from '@shared/utils/format';

export default function AdminDashboardPage() {
  const { data: kpis } = useQuery({
    queryKey: ['admin', 'kpis'],
    queryFn: () => analyticsService.adminKPIs(),
  });
  const { data: revenue } = useQuery({
    queryKey: ['admin', 'revenue'],
    queryFn: () => analyticsService.adminRevenue(),
  });
  const { data: bakeries } = useQuery({
    queryKey: ['bakeries'],
    queryFn: () => bakeryService.list(),
  });

  const icons: Record<string, JSX.Element> = {
    vendors: <Store size={18} />,
    revenue: <DollarSign size={18} />,
    users: <Users size={18} />,
    orders: <Activity size={18} />,
  };

  const pendingApprovals = (bakeries ?? []).slice(0, 3);
  const disputes = [
    {
      id: 'd1',
      title: 'Damaged in transit — SW-1029',
      bakery: 'Velvet Crown',
      severity: 'High',
      tone: 'rose' as const,
    },
    {
      id: 'd2',
      title: 'Late delivery — SW-1018',
      bakery: 'Maple & Honey',
      severity: 'Medium',
      tone: 'amber' as const,
    },
    {
      id: 'd3',
      title: 'Refund request — SW-0998',
      bakery: 'Pearl & Pistachio',
      severity: 'Low',
      tone: 'sky' as const,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Admin Console
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Platform overview
          </h1>
          <p className="text-ink-500 mt-1">
            Monitor vendors, revenue, users, and operational health in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export</Button>
          <Button variant="dark" leftIcon={<ShieldCheck size={16} />}>
            Run audit
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis
          ? kpis.map((k, i) => (
              <StatCard
                key={k.id}
                label={k.label}
                value={k.value}
                delta={k.delta}
                format={k.format ?? 'number'}
                icon={icons[k.id]}
                tone={i === 1 ? 'burgundy' : i === 0 ? 'accent' : 'cream'}
              />
            ))
          : Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr] gap-4 mb-6">
        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                Platform revenue
              </h3>
              <p className="text-sm text-ink-500">Year to date · gross merchandise volume</p>
            </div>
            <Badge tone="green" icon={<TrendingUp size={12} />}>
              +18.6%
            </Badge>
          </div>
          {revenue ? <RevenueChart data={revenue} height={320} /> : <Skeleton className="h-80" />}
        </section>

        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                Vendor approvals
              </h3>
              <p className="text-sm text-ink-500">{pendingApprovals.length} awaiting review</p>
            </div>
            <button className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {pendingApprovals.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-cream-200"
              >
                <img
                  src={b.cover}
                  alt={b.name}
                  className="h-12 w-12 rounded-2xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-800 truncate">{b.name}</p>
                  <p className="text-xs text-ink-400 truncate">{b.city} · {b.tags[0]}</p>
                </div>
                <button className="h-9 w-9 grid place-items-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                  <Check size={16} />
                </button>
                <button className="h-9 w-9 grid place-items-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr] gap-4">
        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                Top performing vendors
              </h3>
              <p className="text-sm text-ink-500">Last 30 days revenue</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-400">
                  <th className="text-left font-semibold py-2">Vendor</th>
                  <th className="text-left font-semibold py-2">City</th>
                  <th className="text-left font-semibold py-2">Rating</th>
                  <th className="text-right font-semibold py-2">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {bakeries?.slice(0, 6).map((b, i) => (
                  <tr key={b.id} className="hover:bg-cream-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.cover}
                          alt=""
                          className="h-10 w-10 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-semibold">{b.name}</p>
                          <p className="text-xs text-ink-400">{b.tags.join(' · ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{b.city}</td>
                    <td className="py-3">⭐ {b.rating.toFixed(1)}</td>
                    <td className="py-3 text-right font-semibold tabular-nums">
                      {formatCurrencyCompact(178_000_000 - i * 15_500_000)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                Open disputes
              </h3>
              <p className="text-sm text-ink-500">Triage & resolve</p>
            </div>
            <Badge tone="rose" icon={<Flag size={12} />}>
              {disputes.length} open
            </Badge>
          </div>
          <div className="space-y-3">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl border border-cream-200 flex items-start gap-3"
              >
                <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 grid place-items-center shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-800 truncate">{d.title}</p>
                  <p className="text-xs text-ink-400">{d.bakery}</p>
                </div>
                <Badge tone={d.tone}>{d.severity}</Badge>
              </div>
            ))}
            <Button variant="outline" block>
              Open dispute center
            </Button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
