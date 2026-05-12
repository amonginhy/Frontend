import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Cake,
  CheckCircle2,
  ChefHat,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  PackageCheck,
  Receipt,
} from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  Container,
  PriceTag,
  Skeleton,
} from '@shared/ui';
import { orderService, bakeryService } from '@shared/services';
import { formatCurrency, formatRelative } from '@shared/utils/format';
import { cn } from '@shared/utils/cn';
import type { OrderStatus } from '@shared/types';

const STATUS_FLOW: { id: OrderStatus; label: string; description: string; icon: any }[] = [
  { id: 'placed', label: 'Order placed', description: 'We received your order', icon: Receipt },
  { id: 'confirmed', label: 'Confirmed', description: 'Your bakery has accepted', icon: CheckCircle2 },
  { id: 'baking', label: 'Baking', description: 'Cake is in the oven', icon: ChefHat },
  { id: 'ready', label: 'Ready', description: 'Heading out for delivery', icon: Cake },
  { id: 'delivered', label: 'Delivered', description: 'Enjoy every bite!', icon: PackageCheck },
];

export default function OrderTrackingPage() {
  const { reference } = useParams();
  const ref = reference ?? 'SW-1042';

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', ref],
    queryFn: () => orderService.byId(ref),
  });
  const { data: bakery } = useQuery({
    queryKey: ['bakery', order?.bakeryId],
    enabled: !!order,
    queryFn: () =>
      bakeryService.list().then((all) => all.find((b) => b.id === order!.bakeryId)),
  });

  if (isLoading || !order) {
    return (
      <Container className="py-10 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </Container>
    );
  }

  const currentIdx = STATUS_FLOW.findIndex((s) => s.id === order.status);
  const eta = new Date(order.estimatedReadyAt);
  const minutesAway = Math.max(0, Math.round((eta.getTime() - Date.now()) / 60000));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              Order tracking
            </span>
            <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
              {order.reference}
            </h1>
            <p className="text-ink-500 mt-1">
              Placed {formatRelative(order.placedAt)} · Delivering to {order.address}
            </p>
          </div>
          <Badge tone={order.status === 'delivered' ? 'green' : 'amber'} size="md">
            {order.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div className="space-y-5">
            <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-display text-xl font-semibold text-burgundy-700">
                    Live status
                  </h3>
                  <p className="text-sm text-ink-500">
                    Estimated arrival in{' '}
                    <span className="font-semibold text-burgundy-700">{minutesAway} min</span>
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-ink-400">
                  <Clock size={12} /> Updated just now
                </div>
              </div>

              <ol className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-cream-200" />
                <div
                  className="absolute left-5 top-0 w-px bg-emerald-400 transition-all duration-700"
                  style={{
                    height: `${(currentIdx / (STATUS_FLOW.length - 1)) * 100}%`,
                  }}
                />
                {STATUS_FLOW.map((s, idx) => {
                  const Icon = s.icon;
                  const status =
                    idx < currentIdx ? 'done' : idx === currentIdx ? 'active' : 'pending';
                  return (
                    <li key={s.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                      <span
                        className={cn(
                          'relative z-10 h-10 w-10 rounded-full grid place-items-center shrink-0',
                          status === 'done' && 'bg-emerald-500 text-white',
                          status === 'active' && 'bg-accent-500 text-white shadow-ring',
                          status === 'pending' && 'bg-cream-100 text-ink-400',
                        )}
                      >
                        <Icon size={16} />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className={cn(
                              'font-semibold',
                              status === 'pending' ? 'text-ink-400' : 'text-ink-800',
                            )}
                          >
                            {s.label}
                          </p>
                          {order.timeline.find((t) => t.status === s.id) && (
                            <span className="text-xs text-ink-400">
                              {formatRelative(
                                order.timeline.find((t) => t.status === s.id)!.at,
                              )}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-ink-500">{s.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            {bakery && (
              <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
                <h3 className="text-display text-xl font-semibold text-burgundy-700 mb-4">
                  Your baker
                </h3>
                <div className="flex items-center gap-4">
                  <img
                    src={bakery.cover}
                    alt={bakery.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-ink-800">{bakery.name}</p>
                    <p className="text-xs text-ink-400 inline-flex items-center gap-1">
                      <MapPin size={12} /> {bakery.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="h-10 w-10 grid place-items-center rounded-full bg-cream-100 hover:bg-cream-200 text-burgundy-700">
                      <MessageCircle size={16} />
                    </button>
                    <button className="h-10 w-10 grid place-items-center rounded-full bg-burgundy-600 text-cream-50 hover:bg-burgundy-700">
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-4 rounded-2xl bg-cream-100 p-3 text-sm text-ink-600">
                    <span className="font-semibold text-burgundy-700">Note for baker:</span>{' '}
                    {order.notes}
                  </div>
                )}
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-20 self-start space-y-3">
            <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
              <h3 className="text-display text-xl font-semibold text-burgundy-700 mb-4">
                Order summary
              </h3>
              <ul className="space-y-3 mb-4">
                {order.items.map((i) => (
                  <li key={i.id} className="flex gap-3 items-center">
                    <img
                      src={i.image}
                      alt={i.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-800 truncate">{i.name}</p>
                      <p className="text-xs text-ink-400">x{i.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(i.unitPrice * i.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="text-sm space-y-2 border-t border-cream-100 pt-4">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatCurrency(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Delivery</dt>
                  <dd>{formatCurrency(order.deliveryFee)}</dd>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <dt>Discount</dt>
                    <dd>-{formatCurrency(order.discount)}</dd>
                  </div>
                )}
              </dl>
              <div className="border-t border-cream-100 mt-4 pt-4 flex items-center justify-between">
                <span className="text-sm text-ink-500">Total</span>
                <PriceTag amount={order.total} size="xl" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button variant="outline" size="md">
                  Reorder
                </Button>
                <Button variant="dark" size="md">
                  Get receipt
                </Button>
              </div>
            </section>

            <section className="bg-burgundy-700 text-cream-50 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Avatar name={order.customerName} src={order.customerAvatar} />
                <div>
                  <p className="text-xs text-cream-200/70">Customer</p>
                  <p className="font-semibold">{order.customerName}</p>
                </div>
              </div>
              <p className="text-sm text-cream-100/80">
                Need a hand? Our concierge team is one tap away — average response
                time is under 2 minutes.
              </p>
              <Button variant="primary" size="md" block className="mt-4">
                Chat with support
              </Button>
            </section>
          </aside>
        </div>
      </Container>
    </motion.div>
  );
}
