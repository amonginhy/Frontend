import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import { Badge, Button, Skeleton } from '@shared/ui';
import { OrdersKanban } from '@features/vendor/OrdersKanban';
import { orderService } from '@shared/services';
import { toast } from '@app/store/toast.store';
import type { Order, OrderStatus } from '@shared/types';

export default function VendorOrdersPage() {
  const [tab, setTab] = useState<'all' | 'today' | 'urgent'>('all');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.list(),
  });

  useEffect(() => {
    if (data) setOrders(data);
  }, [data]);

  const filtered = useMemo(() => {
    let list = orders;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.reference.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q)),
      );
    }
    if (tab === 'today') {
      const today = new Date();
      list = list.filter((o) => {
        const placed = new Date(o.placedAt);
        return (
          placed.getDate() === today.getDate() &&
          placed.getMonth() === today.getMonth() &&
          placed.getFullYear() === today.getFullYear()
        );
      });
    }
    if (tab === 'urgent') {
      list = list.filter(
        (o) =>
          o.status === 'placed' ||
          (o.status === 'confirmed' &&
            new Date(o.estimatedReadyAt).getTime() - Date.now() < 60 * 60 * 1000),
      );
    }
    return list;
  }, [orders, search, tab]);

  const advance = (id: string, next: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: next,
              timeline: [...o.timeline, { status: next, at: new Date().toISOString() }],
            }
          : o,
      ),
    );
    const order = orders.find((o) => o.id === id);
    toast.success(
      `Order ${order?.reference ?? ''} → ${next}`,
      'Customer was notified.',
    );
  };

  const reject = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.info('Order rejected', 'Customer was refunded.');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Orders
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Order Kanban
          </h1>
          <p className="text-ink-500 mt-1">
            Accept new orders, advance through stages, and keep customers informed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" leftIcon={<Filter size={16} />}>
            Filters
          </Button>
          <Button variant="dark" size="md" leftIcon={<Plus size={16} />}>
            Manual order
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-cream-100 flex-1 min-w-64">
          <Search size={14} className="text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference, customer, or item"
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400"
          />
        </div>
        <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1">
          {(['all', 'today', 'urgent'] as const).map((t) => (
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
        <Badge tone="green">All systems on time</Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      ) : (
        <OrdersKanban orders={filtered} onAdvance={advance} onReject={reject} />
      )}
    </motion.div>
  );
}
