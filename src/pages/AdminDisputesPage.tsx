import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Flag, MessageCircle, Search } from 'lucide-react';
import { Avatar, Badge, Button, EmptyState, StatCard } from '@shared/ui';
import { formatCurrency } from '@shared/utils/format';
import { toast } from '@app/store/toast.store';
import { cn } from '@shared/utils/cn';

type Severity = 'low' | 'medium' | 'high';
type DisputeStatus = 'open' | 'investigating' | 'resolved';

interface Dispute {
  id: string;
  reference: string;
  type: string;
  customer: string;
  vendor: string;
  amount: number;
  severity: Severity;
  status: DisputeStatus;
  opened: string;
  summary: string;
}

const DISPUTES: Dispute[] = [
  { id: 'd1', reference: 'SW-1029', type: 'Damaged in transit', customer: 'Joseph Okello', vendor: 'Velvet Crown', amount: 245_000, severity: 'high', status: 'open', opened: '12m ago', summary: 'Cake arrived with frosting damage from courier handling.' },
  { id: 'd2', reference: 'SW-1018', type: 'Late delivery', customer: 'Naomi Nakato', vendor: 'Maple & Honey', amount: 320_000, severity: 'medium', status: 'investigating', opened: '2h ago', summary: 'Order arrived 3 hours late for birthday celebration.' },
  { id: 'd3', reference: 'SW-0998', type: 'Refund request', customer: 'Brian Otim', vendor: 'Pearl & Pistachio', amount: 180_000, severity: 'low', status: 'open', opened: '1d ago', summary: 'Customer claims wrong flavor delivered.' },
  { id: 'd4', reference: 'SW-0985', type: 'Allergen exposure', customer: 'Amara Bennett', vendor: 'Crumb & Co.', amount: 460_000, severity: 'high', status: 'investigating', opened: '3d ago', summary: 'Allergy flag was not honored — under investigation.' },
  { id: 'd5', reference: 'SW-0972', type: 'Refund request', customer: 'Daniel Kim', vendor: 'Sugarbloom Patisserie', amount: 215_000, severity: 'low', status: 'resolved', opened: '1 week ago', summary: 'Resolved with partial refund issued.' },
];

const severityTone: Record<Severity, 'rose' | 'amber' | 'sky'> = {
  high: 'rose',
  medium: 'amber',
  low: 'sky',
};

const statusTone: Record<DisputeStatus, 'rose' | 'amber' | 'green'> = {
  open: 'rose',
  investigating: 'amber',
  resolved: 'green',
};

export default function AdminDisputesPage() {
  const [items, setItems] = useState<Dispute[]>(DISPUTES);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | DisputeStatus>('all');

  const filtered = useMemo(() => {
    let list = items;
    if (tab !== 'all') list = list.filter((d) => d.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.reference.toLowerCase().includes(q) ||
          d.customer.toLowerCase().includes(q) ||
          d.vendor.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q),
      );
    }
    return list;
  }, [items, search, tab]);

  const advance = (id: string) => {
    setItems((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === 'open' ? 'investigating' : 'resolved' }
          : d,
      ),
    );
    toast.success('Dispute updated');
  };

  const resolve = (id: string) => {
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'resolved' } : d)));
    toast.success('Marked resolved');
  };

  const open = items.filter((d) => d.status === 'open').length;
  const investigating = items.filter((d) => d.status === 'investigating').length;
  const resolved = items.filter((d) => d.status === 'resolved').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Disputes
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Customer disputes
          </h1>
          <p className="text-ink-500 mt-1">
            Triage, investigate, and resolve issues across the marketplace.
          </p>
        </div>
        <Button variant="outline" leftIcon={<MessageCircle size={16} />}>
          Contact legal
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Open" value={open} icon={<Flag size={18} />} tone="accent" />
        <StatCard label="Investigating" value={investigating} icon={<AlertTriangle size={18} />} tone="burgundy" />
        <StatCard label="Resolved (30d)" value={resolved} delta={9.2} icon={<CheckCircle2 size={18} />} tone="cream" />
      </div>

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-cream-100 flex-1 min-w-64">
          <Search size={14} className="text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order, customer, vendor, or type"
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400"
          />
        </div>
        <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1">
          {(['all', 'open', 'investigating', 'resolved'] as const).map((t) => (
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Flag size={20} />}
          title="No disputes match"
          description="Adjust your filter or take a break — you've earned it."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-3xl border border-cream-100 shadow-soft p-5"
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div
                  className={cn(
                    'h-12 w-12 rounded-2xl grid place-items-center shrink-0',
                    d.severity === 'high'
                      ? 'bg-rose-50 text-rose-600'
                      : d.severity === 'medium'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-sky-50 text-sky-600',
                  )}
                >
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-burgundy-700">{d.reference}</span>
                    <Badge tone={severityTone[d.severity]} className="capitalize">
                      {d.severity}
                    </Badge>
                    <Badge tone={statusTone[d.status]} className="capitalize">
                      {d.status}
                    </Badge>
                    <span className="text-xs text-ink-400">opened {d.opened}</span>
                  </div>
                  <p className="font-semibold text-ink-800 mt-1">{d.type}</p>
                  <p className="text-sm text-ink-500 mt-1">{d.summary}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-ink-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Avatar name={d.customer} size="xs" />
                      Customer: <span className="font-semibold text-ink-700">{d.customer}</span>
                    </span>
                    <span>
                      Vendor: <span className="font-semibold text-ink-700">{d.vendor}</span>
                    </span>
                    <span>
                      Amount: <span className="font-semibold text-burgundy-700">{formatCurrency(d.amount)}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {d.status !== 'resolved' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => advance(d.id)}>
                        {d.status === 'open' ? 'Investigate' : 'Mark resolved'}
                      </Button>
                      {d.status === 'investigating' && (
                        <Button size="sm" onClick={() => resolve(d.id)}>
                          Resolve
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
