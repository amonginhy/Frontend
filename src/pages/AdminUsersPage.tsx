import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Crown, Mail, MoreHorizontal, Search, ShieldCheck, Users } from 'lucide-react';
import { Avatar, Badge, Button, EmptyState, StatCard } from '@shared/ui';
import { formatCurrency } from '@shared/utils/format';
import { toast } from '@app/store/toast.store';
import { cn } from '@shared/utils/cn';
import type { User } from '@shared/types';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: User['role'];
  status: 'active' | 'invited' | 'blocked';
  totalSpent: number;
  orders: number;
  joined: string;
  lastActive: string;
}

const USERS: UserRow[] = [
  { id: 'u1', name: 'Amara Bennett', email: 'amara@example.ug', role: 'customer', status: 'active', totalSpent: 4_120_000, orders: 14, joined: 'Mar 2024', lastActive: '2h ago' },
  { id: 'u2', name: 'Hannah Lee', email: 'team@oliveandoak.co', role: 'vendor', status: 'active', totalSpent: 0, orders: 0, joined: 'Jan 2024', lastActive: '12m ago' },
  { id: 'u3', name: 'Daniel Kim', email: 'daniel@example.ug', role: 'customer', status: 'active', totalSpent: 2_340_000, orders: 8, joined: 'Apr 2024', lastActive: '3d ago' },
  { id: 'u4', name: 'Priya Shah', email: 'priya@example.ug', role: 'customer', status: 'active', totalSpent: 3_580_000, orders: 11, joined: 'Feb 2024', lastActive: '1d ago' },
  { id: 'u5', name: 'Sweetly HQ', email: 'ops@edenscrunchbox.com', role: 'admin', status: 'active', totalSpent: 0, orders: 0, joined: 'Aug 2023', lastActive: 'Just now' },
  { id: 'u6', name: 'Marcus Bahar', email: 'marcus@sugarbloom.ug', role: 'vendor', status: 'invited', totalSpent: 0, orders: 0, joined: 'May 2026', lastActive: '—' },
  { id: 'u7', name: 'Zara Patel', email: 'zara@example.ug', role: 'customer', status: 'blocked', totalSpent: 198_000, orders: 1, joined: 'Apr 2026', lastActive: '2 weeks ago' },
  { id: 'u8', name: 'Brian Otim', email: 'brian@example.ug', role: 'customer', status: 'active', totalSpent: 420_000, orders: 2, joined: 'Mar 2026', lastActive: '5d ago' },
  { id: 'u9', name: 'Maple & Honey', email: 'team@mapleandhoney.ug', role: 'vendor', status: 'active', totalSpent: 0, orders: 0, joined: 'Jun 2024', lastActive: '4h ago' },
  { id: 'u10', name: 'Naomi Nakato', email: 'naomi@example.ug', role: 'customer', status: 'active', totalSpent: 6_910_000, orders: 22, joined: 'Nov 2023', lastActive: 'Today' },
];

const roleTone = {
  customer: 'sky',
  vendor: 'accent',
  admin: 'burgundy',
} as const;

const statusTone = {
  active: 'green',
  invited: 'amber',
  blocked: 'rose',
} as const;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>(USERS);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | User['role']>('all');

  const filtered = useMemo(() => {
    let next = users;
    if (tab !== 'all') next = next.filter((u) => u.role === tab);
    if (search) {
      const q = search.toLowerCase();
      next = next.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    return next;
  }, [users, search, tab]);

  const customers = users.filter((u) => u.role === 'customer').length;
  const vendors = users.filter((u) => u.role === 'vendor').length;
  const admins = users.filter((u) => u.role === 'admin').length;

  const toggleBlock = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } : u,
      ),
    );
    const u = users.find((x) => x.id === id);
    toast.success(
      u?.status === 'blocked' ? `${u.name} restored` : `${u?.name ?? 'User'} blocked`,
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Users
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Account management
          </h1>
          <p className="text-ink-500 mt-1">
            Search across customers, bakers, and admins. Block or reinstate accounts.
          </p>
        </div>
        <Button variant="dark" leftIcon={<Mail size={16} />}>
          Email selected
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total accounts" value={users.length} icon={<Users size={18} />} tone="cream" />
        <StatCard label="Customers" value={customers} tone="cream" />
        <StatCard label="Vendors" value={vendors} icon={<Crown size={18} />} tone="accent" />
        <StatCard label="Admins" value={admins} icon={<ShieldCheck size={18} />} tone="burgundy" />
      </div>

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-cream-100 flex-1 min-w-64">
          <Search size={14} className="text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400"
          />
        </div>
        <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1">
          {(['all', 'customer', 'vendor', 'admin'] as const).map((t) => (
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
        {filtered.length === 0 ? (
          <EmptyState icon={<Users size={20} />} title="No users match" description="Adjust your search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100">
                <tr className="text-xs uppercase tracking-wider text-ink-500">
                  <th className="text-left font-semibold py-3 px-5">User</th>
                  <th className="text-left font-semibold py-3 px-5">Role</th>
                  <th className="text-right font-semibold py-3 px-5">Orders</th>
                  <th className="text-right font-semibold py-3 px-5">Spent</th>
                  <th className="text-left font-semibold py-3 px-5">Joined</th>
                  <th className="text-left font-semibold py-3 px-5">Last active</th>
                  <th className="text-left font-semibold py-3 px-5">Status</th>
                  <th className="text-right font-semibold py-3 px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-cream-50">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div>
                          <p className="font-semibold">{u.name}</p>
                          <p className="text-xs text-ink-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <Badge tone={roleTone[u.role]} className="capitalize">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-5 text-right tabular-nums">
                      {u.role === 'customer' ? u.orders : '—'}
                    </td>
                    <td className="py-3 px-5 text-right font-semibold tabular-nums">
                      {u.role === 'customer' ? formatCurrency(u.totalSpent) : '—'}
                    </td>
                    <td className="py-3 px-5 text-ink-500">{u.joined}</td>
                    <td className="py-3 px-5 text-ink-500">{u.lastActive}</td>
                    <td className="py-3 px-5">
                      <Badge tone={statusTone[u.status]} className="capitalize">
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleBlock(u.id)}
                          className={cn(
                            'h-8 px-3 rounded-lg text-xs font-semibold transition-colors',
                            u.status === 'blocked'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-600 hover:bg-rose-100',
                          )}
                        >
                          {u.status === 'blocked' ? 'Restore' : 'Block'}
                        </button>
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
