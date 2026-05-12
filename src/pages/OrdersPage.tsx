import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import {
  Badge,
  Button,
  Container,
  EmptyState,
  Skeleton,
} from '@shared/ui';
import { orderService } from '@shared/services';
import { formatCurrency, formatRelative } from '@shared/utils/format';

const statusTone = {
  placed: 'amber',
  confirmed: 'sky',
  baking: 'accent',
  ready: 'sky',
  delivered: 'green',
  cancelled: 'rose',
} as const;

export default function OrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.list(),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-10">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            My orders
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Order history
          </h1>
          <p className="text-ink-500 mt-1">
            Track active orders and revisit past celebrations.
          </p>
        </div>

        {isLoading ? (
          <Skeleton className="h-72" />
        ) : !orders || orders.length === 0 ? (
          <EmptyState
            icon={<Package size={20} />}
            title="No orders yet"
            description="When you place an order, it'll show up here with live status updates."
            action={<Button onClick={() => navigate('/marketplace')}>Find a cake</Button>}
          />
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Link
                key={o.id}
                to={`/tracking/${o.reference}`}
                className="block bg-white rounded-3xl border border-cream-100 shadow-soft p-4 hover:shadow-lift transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={o.items[0]?.image}
                    alt=""
                    className="h-16 w-16 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-burgundy-700">
                        {o.reference}
                      </span>
                      <Badge tone={statusTone[o.status]}>{o.status}</Badge>
                    </div>
                    <p className="text-sm text-ink-700 truncate">
                      {o.items[0]?.name}
                      {o.items.length > 1 ? ` + ${o.items.length - 1} more` : ''}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      Placed {formatRelative(o.placedAt)} · {o.address}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-bold tabular-nums text-burgundy-700">
                      {formatCurrency(o.total)}
                    </p>
                    <p className="text-xs text-ink-400">{o.paymentMethod.replace('_', ' ')}</p>
                  </div>
                  <ArrowRight size={16} className="text-ink-300 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </motion.div>
  );
}
