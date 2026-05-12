import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Crown, Mail, MessageCircle, Phone, Search, TrendingUp, Users } from 'lucide-react';
import { Avatar, Badge, Button, EmptyState, StatCard } from '@shared/ui';
import { formatCurrency } from '@shared/utils/format';
import { toast } from '@app/store/toast.store';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  lifetimeValue: number;
  lastOrder: string;
  city: string;
  tier: 'new' | 'regular' | 'vip';
}

const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Amara Bennett', email: 'amara@example.ug', phone: '+256 700 123 456', orders: 14, lifetimeValue: 4_120_000, lastOrder: '2 days ago', city: 'Kololo, Kampala', tier: 'vip' },
  { id: 'c2', name: 'Daniel Kim', email: 'daniel@example.ug', phone: '+256 770 234 567', orders: 8, lifetimeValue: 2_340_000, lastOrder: '1 week ago', city: 'Nakasero, Kampala', tier: 'regular' },
  { id: 'c3', name: 'Priya Shah', email: 'priya@example.ug', phone: '+256 701 345 678', orders: 11, lifetimeValue: 3_580_000, lastOrder: 'Yesterday', city: 'Naguru, Kampala', tier: 'vip' },
  { id: 'c4', name: 'Liam Chen', email: 'liam@example.ug', phone: '+256 772 456 789', orders: 3, lifetimeValue: 680_000, lastOrder: '2 weeks ago', city: 'Kamwokya, Kampala', tier: 'regular' },
  { id: 'c5', name: 'Zara Patel', email: 'zara@example.ug', phone: '+256 783 567 890', orders: 1, lifetimeValue: 198_000, lastOrder: '3 days ago', city: 'Muyenga, Kampala', tier: 'new' },
  { id: 'c6', name: 'Joseph Okello', email: 'jo@example.ug', phone: '+256 704 678 901', orders: 6, lifetimeValue: 1_840_000, lastOrder: '4 days ago', city: 'Bugolobi, Kampala', tier: 'regular' },
  { id: 'c7', name: 'Naomi Nakato', email: 'naomi@example.ug', phone: '+256 775 789 012', orders: 22, lifetimeValue: 6_910_000, lastOrder: 'Today', city: 'Ntinda, Kampala', tier: 'vip' },
  { id: 'c8', name: 'Brian Otim', email: 'brian@example.ug', phone: '+256 706 890 123', orders: 2, lifetimeValue: 420_000, lastOrder: '1 month ago', city: 'Entebbe', tier: 'new' },
];

const tierTone = {
  new: 'cream',
  regular: 'sky',
  vip: 'accent',
} as const;

export default function VendorCustomersPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'vip' | 'new' | 'regular'>('all');

  const filtered = useMemo(() => {
    let list = CUSTOMERS;
    if (tab !== 'all') list = list.filter((c) => c.tier === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q),
      );
    }
    return list;
  }, [search, tab]);

  const totalCustomers = CUSTOMERS.length;
  const vipCount = CUSTOMERS.filter((c) => c.tier === 'vip').length;
  const avgLTV =
    CUSTOMERS.reduce((acc, c) => acc + c.lifetimeValue, 0) / CUSTOMERS.length;
  const repeatRate =
    (CUSTOMERS.filter((c) => c.orders > 1).length / CUSTOMERS.length) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Customers
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Your community
          </h1>
          <p className="text-ink-500 mt-1">
            Identify loyal regulars and reach out to ones you haven't seen in a while.
          </p>
        </div>
        <Button variant="dark" leftIcon={<Mail size={16} />}>
          Send broadcast
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Customers" value={totalCustomers} icon={<Users size={18} />} tone="cream" />
        <StatCard label="VIPs" value={vipCount} icon={<Crown size={18} />} tone="accent" />
        <StatCard label="Avg lifetime value" value={avgLTV} format="currency" tone="burgundy" />
        <StatCard label="Repeat rate" value={repeatRate} format="percent" delta={5.4} icon={<TrendingUp size={18} />} tone="cream" />
      </div>

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-cream-100 flex-1 min-w-64">
          <Search size={14} className="text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or city"
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400"
          />
        </div>
        <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1">
          {(['all', 'vip', 'regular', 'new'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-8 px-3 rounded-full text-xs font-semibold capitalize transition-colors ${
                tab === t ? 'bg-white shadow-soft text-burgundy-700' : 'text-ink-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={20} />}
            title="No customers match"
            description="Try a different search or tab."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100">
                <tr className="text-xs uppercase tracking-wider text-ink-500">
                  <th className="text-left font-semibold py-3 px-5">Customer</th>
                  <th className="text-left font-semibold py-3 px-5">City</th>
                  <th className="text-right font-semibold py-3 px-5">Orders</th>
                  <th className="text-right font-semibold py-3 px-5">LTV</th>
                  <th className="text-left font-semibold py-3 px-5">Last order</th>
                  <th className="text-left font-semibold py-3 px-5">Tier</th>
                  <th className="text-right font-semibold py-3 px-5">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-cream-50">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} size="sm" />
                        <div>
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-xs text-ink-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-ink-600">{c.city}</td>
                    <td className="py-3 px-5 text-right tabular-nums">{c.orders}</td>
                    <td className="py-3 px-5 text-right font-semibold tabular-nums">
                      {formatCurrency(c.lifetimeValue)}
                    </td>
                    <td className="py-3 px-5 text-ink-500">{c.lastOrder}</td>
                    <td className="py-3 px-5">
                      <Badge tone={tierTone[c.tier]} className="capitalize">
                        {c.tier}
                      </Badge>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toast.info('Message draft opened', c.name)}
                          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-cream-100 text-ink-500"
                          aria-label="Message"
                        >
                          <MessageCircle size={14} />
                        </button>
                        <button
                          onClick={() => toast.info('Dialing…', c.phone)}
                          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-cream-100 text-ink-500"
                          aria-label="Call"
                        >
                          <Phone size={14} />
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
