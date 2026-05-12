import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Ban, CheckCircle2, Eye, MoreHorizontal, Plus, Search, Store } from 'lucide-react';
import { Badge, Button, EmptyState, Skeleton, StatCard } from '@shared/ui';
import { bakeryService } from '@shared/services';
import { formatCurrency } from '@shared/utils/format';
import { toast } from '@app/store/toast.store';
import { cn } from '@shared/utils/cn';

type VendorStatus = 'active' | 'paused' | 'review';

interface VendorRow {
  id: string;
  name: string;
  cover: string;
  city: string;
  rating: number;
  status: VendorStatus;
  plan: 'Starter' | 'Growth' | 'Premium';
  monthlyRevenue: number;
  ordersThisMonth: number;
  joined: string;
}

const seedVendors = (bakeries: { id: string; name: string; cover: string; city: string; rating: number }[]): VendorRow[] =>
  bakeries.map((b, i) => ({
    id: b.id,
    name: b.name,
    cover: b.cover,
    city: b.city,
    rating: b.rating,
    status: ([['active', 'active', 'review', 'active', 'paused', 'active'] as VendorStatus[]])[0][i % 6],
    plan: (['Premium', 'Growth', 'Starter', 'Premium', 'Growth', 'Starter'] as const)[i % 6],
    monthlyRevenue: 22_000_000 - i * 2_400_000,
    ordersThisMonth: 184 - i * 21,
    joined: ['Jan 2024', 'Mar 2024', 'Jul 2024', 'Sep 2023', 'Oct 2024', 'Dec 2023'][i % 6],
  }));

const statusTone: Record<VendorStatus, 'green' | 'amber' | 'rose'> = {
  active: 'green',
  review: 'amber',
  paused: 'rose',
};

export default function AdminVendorsPage() {
  const { data: bakeries, isLoading } = useQuery({
    queryKey: ['bakeries'],
    queryFn: () => bakeryService.list(),
  });

  const [vendors, setVendors] = useState<VendorRow[] | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | VendorStatus>('all');

  const data = vendors ?? (bakeries ? seedVendors(bakeries) : null);
  const list = data ?? [];

  const filtered = useMemo(() => {
    let next = list;
    if (tab !== 'all') next = next.filter((v) => v.status === tab);
    if (search) {
      const q = search.toLowerCase();
      next = next.filter(
        (v) => v.name.toLowerCase().includes(q) || v.city.toLowerCase().includes(q),
      );
    }
    return next;
  }, [list, search, tab]);

  const updateStatus = (id: string, status: VendorStatus) => {
    const base = vendors ?? (bakeries ? seedVendors(bakeries) : []);
    const next = base.map((v) => (v.id === id ? { ...v, status } : v));
    setVendors(next);
    const v = next.find((x) => x.id === id);
    toast.success(`${v?.name} ${status === 'active' ? 'activated' : status === 'paused' ? 'suspended' : 'moved to review'}`);
  };

  const totalRevenue = list.reduce((acc, v) => acc + v.monthlyRevenue, 0);
  const activeCount = list.filter((v) => v.status === 'active').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Vendors
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Vendor management
          </h1>
          <p className="text-ink-500 mt-1">
            Onboard, monitor, and moderate bakeries across the platform.
          </p>
        </div>
        <Button variant="dark" leftIcon={<Plus size={16} />}>
          Invite vendor
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total vendors" value={list.length} icon={<Store size={18} />} tone="cream" />
        <StatCard label="Active vendors" value={activeCount} delta={2.4} tone="accent" />
        <StatCard label="GMV (30d)" value={totalRevenue} format="currency" delta={18.6} tone="burgundy" />
      </div>

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-cream-100 flex-1 min-w-64">
          <Search size={14} className="text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or city"
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400"
          />
        </div>
        <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1">
          {(['all', 'active', 'review', 'paused'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'h-8 px-3 rounded-full text-xs font-semibold capitalize transition-colors',
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
          <EmptyState
            icon={<Store size={20} />}
            title="No vendors match"
            description="Try a different filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100">
                <tr className="text-xs uppercase tracking-wider text-ink-500">
                  <th className="text-left font-semibold py-3 px-5">Vendor</th>
                  <th className="text-left font-semibold py-3 px-5">City</th>
                  <th className="text-left font-semibold py-3 px-5">Plan</th>
                  <th className="text-right font-semibold py-3 px-5">Orders (30d)</th>
                  <th className="text-right font-semibold py-3 px-5">Revenue (30d)</th>
                  <th className="text-left font-semibold py-3 px-5">Status</th>
                  <th className="text-right font-semibold py-3 px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-cream-50">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <img src={v.cover} alt="" className="h-10 w-10 rounded-2xl object-cover" />
                        <div>
                          <p className="font-semibold">{v.name}</p>
                          <p className="text-xs text-ink-400">Joined {v.joined} · ⭐ {v.rating.toFixed(1)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5">{v.city}</td>
                    <td className="py-3 px-5">
                      <Badge tone={v.plan === 'Premium' ? 'accent' : v.plan === 'Growth' ? 'sky' : 'cream'}>
                        {v.plan}
                      </Badge>
                    </td>
                    <td className="py-3 px-5 text-right tabular-nums">{v.ordersThisMonth}</td>
                    <td className="py-3 px-5 text-right font-semibold tabular-nums">
                      {formatCurrency(v.monthlyRevenue)}
                    </td>
                    <td className="py-3 px-5">
                      <Badge tone={statusTone[v.status]} className="capitalize">
                        {v.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toast.info('Vendor profile', v.name)}
                          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-cream-100 text-ink-500"
                          aria-label="View"
                        >
                          <Eye size={14} />
                        </button>
                        {v.status !== 'active' ? (
                          <button
                            onClick={() => updateStatus(v.id, 'active')}
                            className="h-8 w-8 grid place-items-center rounded-lg hover:bg-emerald-50 text-emerald-600"
                            aria-label="Activate"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(v.id, 'paused')}
                            className="h-8 w-8 grid place-items-center rounded-lg hover:bg-rose-50 text-rose-500"
                            aria-label="Suspend"
                          >
                            <Ban size={14} />
                          </button>
                        )}
                        <button
                          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-cream-100 text-ink-400"
                          aria-label="More"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
