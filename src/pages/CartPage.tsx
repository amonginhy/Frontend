import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from 'lucide-react';
import {
  Badge,
  Button,
  Container,
  EmptyState,
  Input,
  PriceTag,
} from '@shared/ui';
import { cartSelectors, useCartStore } from '@app/store/cart.store';
import { toast } from '@app/store/toast.store';
import { formatCurrency } from '@shared/utils/format';
import { useState } from 'react';

const PROMOS: Record<string, number> = {
  WELCOME10: 0.1,
  SWEET20: 0.2,
};

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const setPromo = useCartStore((s) => s.setPromo);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore(cartSelectors.subtotal);

  const [promoInput, setPromoInput] = useState(promoCode ?? '');
  const [promoStatus, setPromoStatus] = useState<'idle' | 'invalid' | 'applied'>(
    promoCode ? 'applied' : 'idle',
  );

  const discountRate = promoCode ? PROMOS[promoCode] ?? 0 : 0;
  const discount = subtotal * discountRate;
  const deliveryFee = subtotal > 200_000 ? 0 : 22_000;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + deliveryFee + tax;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMOS[code]) {
      setPromo(code);
      setPromoStatus('applied');
      toast.success(
        'Promo applied',
        `${Math.round(PROMOS[code] * 100)}% off your subtotal`,
      );
    } else {
      setPromoStatus('invalid');
      toast.error('Invalid code', 'Try WELCOME10 or SWEET20.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              Your basket
            </span>
            <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
              Review your order
            </h1>
          </div>
          <Link to="/marketplace" className="text-sm font-semibold text-burgundy-700 hover:underline">
            Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={20} />}
            title="Your cart is empty"
            description="Browse our marketplace and start customizing the perfect cake."
            action={<Button onClick={() => navigate('/marketplace')}>Browse cakes</Button>}
          />
        ) : (
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
            <div className="space-y-3">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="bg-white rounded-3xl border border-cream-100 shadow-soft p-4 flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-28 w-28 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink-800 truncate">{item.name}</p>
                        <p className="text-xs text-ink-400">
                          Unit price {formatCurrency(item.unitPrice)}
                        </p>
                        {item.customization?.message && (
                          <Badge tone="cream" className="mt-2">
                            "{item.customization.message}"
                          </Badge>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.id);
                          toast.info('Removed from cart', item.name);
                        }}
                        className="h-9 w-9 grid place-items-center rounded-full hover:bg-rose-50 text-rose-500"
                        aria-label="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-cream-200 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 grid place-items-center rounded-full hover:bg-cream-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 grid place-items-center rounded-full hover:bg-cream-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <PriceTag amount={item.unitPrice * item.quantity} size="lg" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-20 self-start space-y-3">
              <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
                <h3 className="text-display text-xl font-semibold text-burgundy-700 mb-4">
                  Order summary
                </h3>
                <dl className="space-y-2 text-sm text-ink-600">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold">{formatCurrency(subtotal)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <dt>Promo {promoCode}</dt>
                      <dd className="font-semibold">-{formatCurrency(discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt>Delivery</dt>
                    <dd className="font-semibold">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600">Free</span>
                      ) : (
                        formatCurrency(deliveryFee)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Tax</dt>
                    <dd className="font-semibold">{formatCurrency(tax)}</dd>
                  </div>
                </dl>
                <div className="border-t border-cream-100 mt-4 pt-4 flex items-center justify-between">
                  <span className="text-sm text-ink-500">Total</span>
                  <PriceTag amount={total} size="xl" />
                </div>
                <Button block size="lg" className="mt-5" onClick={() => navigate('/checkout')}>
                  Proceed to checkout
                </Button>
                <p className="text-xs text-ink-400 mt-3 text-center">
                  Free delivery on orders over UGX 200,000.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
                <h4 className="text-sm font-semibold text-ink-800 mb-3 inline-flex items-center gap-2">
                  <Tag size={14} /> Promo code
                </h4>
                <div className="flex gap-2">
                  <Input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Try WELCOME10"
                    className="flex-1"
                  />
                  <Button variant="dark" onClick={applyPromo}>
                    Apply
                  </Button>
                </div>
                {promoStatus === 'applied' && (
                  <p className="text-xs text-emerald-600 mt-2">
                    {Math.round(discountRate * 100)}% off applied. Sweet!
                  </p>
                )}
                {promoStatus === 'invalid' && (
                  <p className="text-xs text-rose-500 mt-2">Code not recognized.</p>
                )}
              </div>
            </aside>
          </div>
        )}
      </Container>
    </motion.div>
  );
}
