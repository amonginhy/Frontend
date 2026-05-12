import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Activity, Download, Search } from 'lucide-react';
import { Avatar, Badge, Button, EmptyState, Skeleton, StatCard } from '@shared/ui';
import { bakeryService, orderService } from '@shared/services';
import { formatCurrency, formatRelative } from '@shared/utils/format';
import { cn } from '@shared/utils/cn';
import type { OrderStatus } from '@shared/types';

const statusTone: Record<OrderStatus, 'amber' | 'sky' | 'accent' | 'green' | 'rose'> = {
  placed: 'amber',
  confirmed: 'sky',
  baking: 'accent',
  ready: 'sky',
  delivered: 'green',
  cancelled: 'rose',
};

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.list(),
  });
  const { data: bakeries } = useQuery({
    queryKey: ['bakeries'],
    queryFn: () => bakeryService.list(),
  });

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | OrderStatus>('all');

  const filtered = useMemo(() => {
    if (!orders) return [];
    let list = orders;
    if (tab !== 'all') list = list.filter((o) => o.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.reference.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [orders, search, tab]);

  const gmv = (orders ?? []).reduce((acc, o) => acc + o.total, 0);
  const platformTake = gmv * 0.12;
  const active = (orders ?? []).filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Orders
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Platform orders
          </h1>
          <p className="text-ink-500 mt-1">
            All orders across every vendor — search, filter, and audit.
          </p>
        </div>
        <Button variant="outline" leftIcon={<Download size={16} />}>
          Export CSV
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Orders (30d)" value={orders?.length ?? 0} icon={<Activity size={18} />} tone="cream" />
        <StatCard label="Active orders" value={active} delta={6.2} tone="accent" />
        <StatCard label="Platform take (12%)" value={platformTake} format="currency" tone="burgundy" />
      </div>

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-cream-100 flex-1 min-w-64">
          <Search size={14} className="text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference, customer, or product"
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400"
          />
        </div>
        <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1 overflow-x-auto no-scrollbar">
          {(['all', 'placed', 'baking', 'ready', 'delivered'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'h-8 px-3 rounded-full text-xs font-semibold capitalize transition-colors whitespace-nowrap',
                tab === t ? 'bg-white shadow-soft text-burgundy-700' : 'text-ink-500',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft overflow-hidden">
        {isLoading ? (
          <Skeleton className="h-72" />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Search size={20} />} title="No orders match" description="Adjust your filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100">
                <tr className="text-xs uppercase tracking-wider text-ink-500">
                  <th className="text-left font-semibold py-3 px-5">Order</th>
                  <th className="text-left font-semibold py-3 px-5">Customer</th>
                  <th className="text-left font-semibold py-3 px-5">Vendor</th>
                  <th className="text-left font-semibold py-3 px-5">Placed</th>
                  <th className="text-left font-semibold py-3 px-5">Status</th>
                  <th className="text-right font-semibold py-3 px-5">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((o) => {
                  const bakery = bakeries?.find((b) => b.id === o.bakeryId);
                  return (
                    <tr key={o.id} className="hover:bg-cream-50">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <img src={o.items[0]?.image} alt="" className="h-10 w-10 rounded-xl object-cover" />
                          <div>
                            <p className="font-semibold">{o.reference}</p>
                            <p className="text-xs text-ink-400">{o.items[0]?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <Avatar name={o.customerName} size="xs" />
                          <span>{o.customerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-ink-600">{bakery?.name ?? '—'}</td>
                      <td className="py-3 px-5 text-ink-500">{formatRelative(o.placedAt)}</td>
                      <td className="py-3 px-5">
                        <Badge tone={statusTone[o.status]} className="capitalize">
                          {o.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-5 text-right font-semibold tabular-nums">
                        {formatCurrency(o.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
