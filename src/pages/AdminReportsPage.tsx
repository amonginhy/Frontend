import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Calendar, Download, FileText, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge, Button, Skeleton, StatCard } from '@shared/ui';
import { analyticsService } from '@shared/services';
import { RevenueChart } from '@features/analytics/RevenueChart';
import { formatCurrency, formatCurrencyCompact } from '@shared/utils/format';
import { toast } from '@app/store/toast.store';

const RANGES = ['7d', '30d', '90d', 'YTD', '12m'] as const;
type Range = (typeof RANGES)[number];

const reports = [
  { id: 'r1', title: 'Platform GMV report', period: 'Apr 2026', size: '218 KB', generated: '2 hours ago' },
  { id: 'r2', title: 'Vendor commissions', period: 'Apr 2026', size: '94 KB', generated: '2 hours ago' },
  { id: 'r3', title: 'Customer cohorts', period: 'Q1 2026', size: '512 KB', generated: '4 days ago' },
  { id: 'r4', title: 'Dispute summary', period: 'Apr 2026', size: '46 KB', generated: '1 week ago' },
  { id: 'r5', title: 'Tax filing — VAT', period: 'Q1 2026', size: '388 KB', generated: '2 weeks ago' },
];

const payouts = [
  { vendor: 'Olive & Oak Bakery', pending: 4_800_000, scheduled: 'Mon 13 May' },
  { vendor: 'Sugarbloom Patisserie', pending: 3_120_000, scheduled: 'Mon 13 May' },
  { vendor: 'Maple & Honey', pending: 1_960_000, scheduled: 'Mon 13 May' },
  { vendor: 'Crumb & Co.', pending: 5_240_000, scheduled: 'Mon 13 May' },
  { vendor: 'Velvet Crown', pending: 1_180_000, scheduled: 'Mon 13 May' },
];

const takeRateByCategory = [
  { label: 'Cakes', value: 12 },
  { label: 'Cupcakes', value: 14 },
  { label: 'Pastries', value: 10 },
  { label: 'Cookies', value: 8 },
  { label: 'Bread', value: 6 },
];

export default function AdminReportsPage() {
  const [range, setRange] = useState<Range>('30d');

  const { data: revenue } = useQuery({
    queryKey: ['admin', 'revenue'],
    queryFn: () => analyticsService.adminRevenue(),
  });

  const totalPayout = payouts.reduce((acc, p) => acc + p.pending, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Reports
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Financial reports
          </h1>
          <p className="text-ink-500 mt-1">
            GMV, commissions, vendor payouts, and exportable statements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-cream-100 rounded-full p-1">
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
          <Button variant="dark" leftIcon={<Download size={16} />} onClick={() => toast.success('Report generating', "We'll email it when ready.")}>
            Generate report
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="GMV" value={3_790_000_000} format="currency" delta={18.6} icon={<TrendingUp size={18} />} tone="burgundy" />
        <StatCard label="Platform take (12%)" value={454_800_000} format="currency" delta={18.6} tone="accent" />
        <StatCard label="Pending payouts" value={totalPayout} format="currency" tone="cream" icon={<Calendar size={18} />} />
        <StatCard label="Refund rate" value={1.8} format="percent" delta={-0.4} tone="cream" />
      </div>

      <div className="grid xl:grid-cols-[1.6fr_1fr] gap-4 mb-6">
        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                GMV trend
              </h3>
              <p className="text-sm text-ink-500">{range} window</p>
            </div>
            <Badge tone="green">+18.6% vs prior</Badge>
          </div>
          {revenue ? <RevenueChart data={revenue} height={300} /> : <Skeleton className="h-72" />}
        </section>

        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <h3 className="text-display text-xl font-semibold text-burgundy-700">
            Take rate by category
          </h3>
          <p className="text-sm text-ink-500 mb-3">Effective commission per category</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={takeRateByCategory} margin={{ top: 6, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#F0E2C7" strokeDasharray="4 6" vertical={false} />
              <XAxis dataKey="label" stroke="#A39B8E" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#A39B8E" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #F0E2C7',
                  fontSize: 12,
                }}
                formatter={(v: number) => `${v}%`}
              />
              <Bar dataKey="value" fill="#5C1F22" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="grid xl:grid-cols-[1.4fr_1fr] gap-4">
        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                Pending payouts
              </h3>
              <p className="text-sm text-ink-500">Next payout cycle: Mon 13 May</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success('Payouts approved', 'Vendors notified.')}
            >
              Approve all
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-400">
                  <th className="text-left font-semibold py-2">Vendor</th>
                  <th className="text-left font-semibold py-2">Scheduled</th>
                  <th className="text-right font-semibold py-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {payouts.map((p) => (
                  <tr key={p.vendor}>
                    <td className="py-3 font-semibold">{p.vendor}</td>
                    <td className="py-3 text-ink-500">{p.scheduled}</td>
                    <td className="py-3 text-right font-semibold tabular-nums text-burgundy-700">
                      {formatCurrency(p.pending)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-cream-200">
                <tr>
                  <td className="py-3 font-semibold">Total</td>
                  <td />
                  <td className="py-3 text-right font-bold tabular-nums text-burgundy-700">
                    {formatCurrencyCompact(totalPayout)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <h3 className="text-display text-xl font-semibold text-burgundy-700 mb-1">
            Saved reports
          </h3>
          <p className="text-sm text-ink-500 mb-4">Last 5 generated</p>
          <ul className="space-y-2">
            {reports.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-cream-200 hover:bg-cream-50"
              >
                <div className="h-9 w-9 rounded-xl bg-cream-100 grid place-items-center text-burgundy-700">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{r.title}</p>
                  <p className="text-xs text-ink-400">
                    {r.period} · {r.size} · {r.generated}
                  </p>
                </div>
                <button
                  onClick={() => toast.success('Download started', r.title)}
                  className="h-8 w-8 grid place-items-center rounded-lg hover:bg-cream-100 text-ink-500"
                  aria-label="Download"
                >
                  <Download size={14} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </motion.div>
  );
}
