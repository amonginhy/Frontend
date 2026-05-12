import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  Bell,
  Building2,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Save,
  Store,
} from 'lucide-react';
import { Badge, Button, Input, Toggle } from '@shared/ui';
import { toast } from '@app/store/toast.store';
import { cn } from '@shared/utils/cn';

const profileSchema = z.object({
  bakeryName: z.string().min(2),
  ownerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(5),
  bio: z.string().max(280).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const SECTIONS = [
  { id: 'profile', label: 'Store profile', icon: <Store size={16} /> },
  { id: 'hours', label: 'Hours & delivery', icon: <Clock size={16} /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function VendorSettingsPage() {
  const [section, setSection] = useState<SectionId>('profile');
  const [autoAccept, setAutoAccept] = useState(false);
  const [storeOpen, setStoreOpen] = useState(true);
  const [hours, setHours] = useState<Record<string, { open: boolean; from: string; to: string }>>({
    Mon: { open: true, from: '08:00', to: '20:00' },
    Tue: { open: true, from: '08:00', to: '20:00' },
    Wed: { open: true, from: '08:00', to: '20:00' },
    Thu: { open: true, from: '08:00', to: '20:00' },
    Fri: { open: true, from: '08:00', to: '22:00' },
    Sat: { open: true, from: '09:00', to: '22:00' },
    Sun: { open: false, from: '10:00', to: '18:00' },
  });
  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    weeklyDigest: true,
    promotions: false,
  });
  const [payouts, setPayouts] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bakeryName: 'Olive & Oak Bakery',
      ownerName: 'Hannah Lee',
      email: 'team@oliveandoak.co',
      phone: '+256 700 123 456',
      address: 'Plot 14 Acacia Ave, Kololo, Kampala',
      bio: 'Artisan custom cakes baked fresh daily in Kampala — vegan and gluten-free options on every menu.',
    },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success('Profile updated');
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Settings
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Store settings
          </h1>
          <p className="text-ink-500 mt-1">
            Configure your storefront, hours, payouts, and notifications.
          </p>
        </div>
        <Badge tone={storeOpen ? 'green' : 'rose'}>
          {storeOpen ? '● Store is live' : '● Store paused'}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="bg-white rounded-3xl border border-cream-100 shadow-soft p-3 h-fit lg:sticky lg:top-20 self-start">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={cn(
                'w-full h-11 px-3 rounded-2xl text-sm font-medium inline-flex items-center gap-2.5 transition-colors text-left',
                section === s.id
                  ? 'bg-burgundy-600 text-cream-50'
                  : 'text-ink-700 hover:bg-cream-100',
              )}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </aside>

        <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6 lg:p-8">
          {section === 'profile' && (
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <h2 className="text-display text-xl font-semibold text-burgundy-700">
                Store profile
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Bakery name"
                  leftIcon={<Building2 size={16} />}
                  {...register('bakeryName')}
                  error={errors.bakeryName?.message}
                />
                <Input
                  label="Owner name"
                  {...register('ownerName')}
                  error={errors.ownerName?.message}
                />
                <Input
                  type="email"
                  label="Business email"
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
                    <span className="text-sm font-medium text-ink-700">Short bio</span>
                    <textarea
                      rows={3}
                      maxLength={280}
                      {...register('bio')}
                      className="rounded-2xl border border-cream-200 bg-white p-4 text-sm focus-ring resize-none"
                    />
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={!isDirty} loading={isSubmitting} leftIcon={<Save size={14} />}>
                  Save changes
                </Button>
                <Toggle
                  checked={storeOpen}
                  onChange={(v) => {
                    setStoreOpen(v);
                    toast.info(v ? 'Store is live' : 'Store paused');
                  }}
                  label="Accept new orders"
                />
              </div>
            </form>
          )}

          {section === 'hours' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-display text-xl font-semibold text-burgundy-700">
                Hours & delivery
              </h2>
              <div className="border border-cream-200 rounded-2xl overflow-hidden">
                {DAYS.map((d, idx) => (
                  <div
                    key={d}
                    className={cn(
                      'flex items-center justify-between gap-3 p-4',
                      idx < DAYS.length - 1 && 'border-b border-cream-100',
                    )}
                  >
                    <span className="font-semibold w-12">{d}</span>
                    <Toggle
                      checked={hours[d].open}
                      onChange={(v) =>
                        setHours((prev) => ({ ...prev, [d]: { ...prev[d], open: v } }))
                      }
                    />
                    <div className="flex items-center gap-2 ml-auto">
                      <input
                        type="time"
                        value={hours[d].from}
                        disabled={!hours[d].open}
                        onChange={(e) =>
                          setHours((prev) => ({
                            ...prev,
                            [d]: { ...prev[d], from: e.target.value },
                          }))
                        }
                        className="h-9 px-3 rounded-xl border border-cream-200 text-sm disabled:opacity-50"
                      />
                      <span className="text-ink-300">—</span>
                      <input
                        type="time"
                        value={hours[d].to}
                        disabled={!hours[d].open}
                        onChange={(e) =>
                          setHours((prev) => ({
                            ...prev,
                            [d]: { ...prev[d], to: e.target.value },
                          }))
                        }
                        className="h-9 px-3 rounded-xl border border-cream-200 text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border border-cream-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink-800">Auto-accept new orders</p>
                  <p className="text-xs text-ink-400">
                    Skip the confirm step during peak hours.
                  </p>
                </div>
                <Toggle checked={autoAccept} onChange={setAutoAccept} />
              </div>
              <Button
                className="self-start"
                leftIcon={<Save size={14} />}
                onClick={() => toast.success('Hours saved')}
              >
                Save hours
              </Button>
            </div>
          )}

          {section === 'payments' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-display text-xl font-semibold text-burgundy-700">
                Payments & payouts
              </h2>
              <div className="border border-cream-200 rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wider text-ink-400 font-semibold mb-2">
                  Payout schedule
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['weekly', 'biweekly', 'monthly'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPayouts(p)}
                      className={cn(
                        'h-9 px-4 rounded-full text-sm font-semibold border capitalize transition-colors',
                        payouts === p
                          ? 'bg-burgundy-600 text-cream-50 border-burgundy-600'
                          : 'border-cream-200 hover:border-burgundy-300',
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-ink-400 mt-3">
                  Next payout: Monday 10:00 · UGX 4,800,000 pending
                </p>
              </div>
              <div className="border border-cream-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-cream-100 grid place-items-center text-burgundy-700">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="font-semibold">MTN Mobile Money</p>
                    <p className="text-xs text-ink-400">+256 700 ••• 456</p>
                  </div>
                </div>
                <Badge tone="green">Primary</Badge>
              </div>
              <Button
                variant="outline"
                className="self-start"
                onClick={() => toast.info('Add payout method coming soon')}
              >
                + Add payout method
              </Button>
            </div>
          )}

          {section === 'notifications' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-display text-xl font-semibold text-burgundy-700">
                Notifications
              </h2>
              {[
                { key: 'newOrders' as const, title: 'New orders', body: 'Push + email when a new order arrives.' },
                { key: 'lowStock' as const, title: 'Low stock', body: 'Daily summary of ingredients at reorder threshold.' },
                { key: 'weeklyDigest' as const, title: 'Weekly digest', body: 'Monday morning revenue + order recap.' },
                { key: 'promotions' as const, title: 'Sweetly promotions', body: 'Updates about platform features and offers.' },
              ].map((n) => (
                <div
                  key={n.key}
                  className="border border-cream-200 rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-ink-800">{n.title}</p>
                    <p className="text-xs text-ink-400">{n.body}</p>
                  </div>
                  <Toggle
                    checked={notifications[n.key]}
                    onChange={(v) => {
                      setNotifications((prev) => ({ ...prev, [n.key]: v }));
                      toast.info(`${n.title} ${v ? 'enabled' : 'disabled'}`);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
