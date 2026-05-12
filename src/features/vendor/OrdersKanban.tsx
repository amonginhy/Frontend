import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, X } from 'lucide-react';
import { Avatar, Badge } from '@shared/ui';
import { formatCurrency, formatRelative } from '@shared/utils/format';
import type { Order, OrderStatus } from '@shared/types';
import { cn } from '@shared/utils/cn';

const COLUMNS: { id: OrderStatus; label: string; tone: string }[] = [
  { id: 'placed', label: 'New', tone: 'bg-amber-50 text-amber-700' },
  { id: 'confirmed', label: 'Confirmed', tone: 'bg-sky-50 text-sky-700' },
  { id: 'baking', label: 'Baking', tone: 'bg-accent-50 text-accent-700' },
  { id: 'ready', label: 'Ready', tone: 'bg-emerald-50 text-emerald-700' },
  { id: 'delivered', label: 'Delivered', tone: 'bg-cream-100 text-burgundy-700' },
];

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: 'confirmed',
  confirmed: 'baking',
  baking: 'ready',
  ready: 'delivered',
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  placed: 'Accept',
  confirmed: 'Start baking',
  baking: 'Mark ready',
  ready: 'Mark delivered',
};

interface Props {
  orders: Order[];
  onAdvance: (id: string, next: OrderStatus) => void;
  onReject: (id: string) => void;
}

export function OrdersKanban({ orders, onAdvance, onReject }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {COLUMNS.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.id);
        return (
          <div key={col.id} className="bg-cream-100/70 rounded-3xl p-3 min-h-[400px]">
            <div className="flex items-center justify-between mb-3 px-2">
              <span
                className={cn(
                  'inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full',
                  col.tone,
                )}
              >
                {col.label} · {colOrders.length}
              </span>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {colOrders.map((o) => {
                  const nextStatus = NEXT[o.status];
                  const nextLabel = NEXT_LABEL[o.status];
                  return (
                    <motion.div
                      key={o.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                      className="bg-white rounded-2xl p-3 border border-cream-200 hover:shadow-soft transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-burgundy-700">
                          {o.reference}
                        </span>
                        <Badge tone="cream" size="sm">
                          {formatCurrency(o.total)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={o.items[0]?.image}
                          alt=""
                          className="h-9 w-9 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {o.items[0]?.name}
                          </p>
                          <p className="text-[10px] text-ink-400">x{o.items[0]?.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar name={o.customerName} size="xs" />
                          <span className="text-xs text-ink-500 truncate">
                            {o.customerName}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] text-ink-400">
                          <Clock size={10} /> {formatRelative(o.placedAt)}
                        </span>
                      </div>
                      {nextStatus && nextLabel && (
                        <div className="flex items-center gap-1.5 mt-2">
                          {o.status === 'placed' && (
                            <button
                              onClick={() => onReject(o.id)}
                              className="h-8 w-8 grid place-items-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                              aria-label="Reject"
                            >
                              <X size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => onAdvance(o.id, nextStatus)}
                            className="flex-1 h-8 inline-flex items-center justify-center gap-1 rounded-xl bg-burgundy-600 text-cream-50 hover:bg-burgundy-700 text-xs font-semibold transition-colors"
                          >
                            {o.status === 'placed' ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <ArrowRight size={12} />
                            )}
                            {nextLabel}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {colOrders.length === 0 && (
                <div className="text-xs text-ink-400 text-center py-6">No orders</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
