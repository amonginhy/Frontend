import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Smartphone,
  User,
  Wallet,
} from 'lucide-react';
import { Button, Container, EmptyState, Input, PriceTag } from '@shared/ui';
import { cartSelectors, useCartStore } from '@app/store/cart.store';
import { toast } from '@app/store/toast.store';
import { formatCurrency } from '@shared/utils/format';
import { cn } from '@shared/utils/cn';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  address: z.string().min(5, 'Enter a delivery address'),
  city: z.string().min(2, 'City is required'),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const paymentMethods = [
  { id: 'card', label: 'Credit Card', detail: 'Visa, Mastercard, Amex', icon: <CreditCard size={18} /> },
  { id: 'mobile_money', label: 'Mobile Money', detail: 'MTN, Airtel Money', icon: <Smartphone size={18} /> },
  { id: 'cash', label: 'Cash on Delivery', detail: 'Pay when it arrives', icon: <Wallet size={18} /> },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(cartSelectors.subtotal);
  const promoCode = useCartStore((s) => s.promoCode);
  const clear = useCartStore((s) => s.clear);
  const [payment, setPayment] = useState('card');

  const deliveryFee = subtotal > 200_000 ? 0 : 22_000;
  const discount = promoCode === 'WELCOME10' ? subtotal * 0.1 : promoCode === 'SWEET20' ? subtotal * 0.2 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + deliveryFee + tax;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: 'Amara Bennett',
      email: 'amara@edenscrunchbox.com',
      phone: '+256 700 123 456',
      address: 'Plot 14 Acacia Ave',
      city: 'Kololo, Kampala',
    },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 600));
    clear();
    toast.success('Order placed!', "We're notifying your bakery now.");
    navigate('/tracking/SW-1042');
  });

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<ShoppingBag size={20} />}
          title="Your cart is empty"
          description="Add a cake before heading to checkout."
          action={<Button onClick={() => navigate('/marketplace')}>Browse cakes</Button>}
        />
      </Container>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-10">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Checkout
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Almost there — secure your sweet treat
          </h1>
        </div>

        <form onSubmit={onSubmit} className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div className="space-y-5">
            <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
              <h3 className="text-display text-xl font-semibold text-burgundy-700 mb-4">
                Delivery details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full name"
                  leftIcon={<User size={16} />}
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="Email"
                  leftIcon={<Mail size={16} />}
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Input
                  label="Phone"
                  leftIcon={<Phone size={16} />}
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <Input
                  label="City"
                  leftIcon={<MapPin size={16} />}
                  {...register('city')}
                  error={errors.city?.message}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Address"
                    leftIcon={<MapPin size={16} />}
                    {...register('address')}
                    error={errors.address?.message}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-ink-700">Order notes (optional)</span>
                    <textarea
                      rows={3}
                      {...register('notes')}
                      placeholder="e.g. leave at front desk, gluten-free preferred"
                      className="rounded-2xl border border-cream-200 bg-white p-4 text-sm focus-ring resize-none"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
              <h3 className="text-display text-xl font-semibold text-burgundy-700 mb-4">
                Payment method
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {paymentMethods.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPayment(m.id)}
                    className={cn(
                      'p-4 rounded-2xl border text-left transition-all flex flex-col gap-2',
                      payment === m.id
                        ? 'border-accent-500 bg-accent-50'
                        : 'border-cream-200 hover:border-burgundy-300',
                    )}
                  >
                    <span
                      className={cn(
                        'h-10 w-10 rounded-2xl grid place-items-center',
                        payment === m.id
                          ? 'bg-accent-500 text-white'
                          : 'bg-cream-100 text-burgundy-700',
                      )}
                    >
                      {m.icon}
                    </span>
                    <p className="font-semibold text-ink-800">{m.label}</p>
                    <p className="text-xs text-ink-400">{m.detail}</p>
                  </button>
                ))}
              </div>

              {payment === 'card' && (
                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  <Input label="Card number" placeholder="•••• •••• •••• 4242" />
                  <Input label="Cardholder" placeholder="Amara Bennett" />
                  <Input label="Expiry" placeholder="MM / YY" />
                  <Input label="CVC" placeholder="•••" />
                </div>
              )}
              {payment === 'mobile_money' && (
                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  <Input label="Mobile money provider" placeholder="MTN Mobile Money" />
                  <Input label="Phone number" placeholder="+256 700 000 000" />
                </div>
              )}

              <p className="text-xs text-ink-400 mt-4 inline-flex items-center gap-1">
                <ShieldCheck size={12} /> Encrypted checkout — your details are safe.
              </p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-20 self-start space-y-3">
            <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
              <h3 className="text-display text-xl font-semibold text-burgundy-700 mb-4">
                Your order
              </h3>
              <ul className="space-y-3 max-h-72 overflow-auto pr-1">
                {items.map((i) => (
                  <li key={i.id} className="flex gap-3 items-center">
                    <img
                      src={i.image}
                      alt={i.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{i.name}</p>
                      <p className="text-xs text-ink-400">x{i.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(i.unitPrice * i.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 pt-4 border-t border-cream-100 space-y-2 text-sm">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600"><dt>Promo</dt><dd>-{formatCurrency(discount)}</dd></div>
                )}
                <div className="flex justify-between"><dt>Delivery</dt><dd>{deliveryFee ? formatCurrency(deliveryFee) : 'Free'}</dd></div>
                <div className="flex justify-between"><dt>Tax</dt><dd>{formatCurrency(tax)}</dd></div>
              </dl>
              <div className="border-t border-cream-100 mt-4 pt-4 flex items-center justify-between">
                <span className="text-sm text-ink-500">Total</span>
                <PriceTag amount={total} size="xl" />
              </div>
              <Button block size="lg" className="mt-5" type="submit" loading={isSubmitting}>
                Place order — {formatCurrency(total)}
              </Button>
            </div>
          </aside>
        </form>
      </Container>
    </motion.div>
  );
}
