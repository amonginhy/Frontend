import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Heart, LogOut, Mail, MapPin, Phone, ShieldCheck, User } from 'lucide-react';
import { Avatar, Badge, Button, Container, Input } from '@shared/ui';
import { useAuthStore } from '@app/store/auth.store';
import { useFavoritesStore } from '@app/store/favorites.store';
import { toast } from '@app/store/toast.store';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type Form = z.infer<typeof schema>;

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)!;
  const signOut = useAuthStore((s) => s.signOut);
  const favCount = useFavoritesStore((s) => s.productIds.length);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: '+256 700 123 456',
      address: 'Plot 14 Acacia Ave, Kololo, Kampala',
    },
  });

  const onSave = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success('Profile updated');
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-10">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Profile
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Account settings
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
          <aside className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6 self-start">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} src={user.avatar} size="lg" />
              <div>
                <p className="font-semibold text-ink-800">{user.name}</p>
                <p className="text-xs text-ink-400">{user.email}</p>
                <Badge tone="accent" className="mt-1.5 capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              <li
                className="flex items-center justify-between p-3 rounded-2xl bg-cream-100/50 cursor-pointer hover:bg-cream-100"
                onClick={() => navigate('/orders')}
              >
                <span className="inline-flex items-center gap-2">
                  <Bell size={14} /> My orders
                </span>
                <span className="text-ink-400">→</span>
              </li>
              <li
                className="flex items-center justify-between p-3 rounded-2xl bg-cream-100/50 cursor-pointer hover:bg-cream-100"
                onClick={() => navigate('/favorites')}
              >
                <span className="inline-flex items-center gap-2">
                  <Heart size={14} /> Favorites
                </span>
                <span className="text-ink-400">{favCount}</span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-2xl bg-cream-100/50">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={14} /> Verified
                </span>
                <Badge tone="green" size="sm">Email</Badge>
              </li>
            </ul>
            <Button
              variant="outline"
              block
              className="mt-5"
              leftIcon={<LogOut size={14} />}
              onClick={() => {
                signOut();
                toast.info('Signed out');
                navigate('/');
              }}
            >
              Sign out
            </Button>
          </aside>

          <form
            onSubmit={onSave}
            className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6 lg:p-8 flex flex-col gap-4"
          >
            <h2 className="text-display text-xl font-semibold text-burgundy-700">
              Personal details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full name"
                leftIcon={<User size={16} />}
                {...register('name')}
                error={errors.name?.message}
              />
              <Input
                type="email"
                label="Email"
                leftIcon={<Mail size={16} />}
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="Phone"
                leftIcon={<Phone size={16} />}
                {...register('phone')}
              />
              <Input
                label="Address"
                leftIcon={<MapPin size={16} />}
                {...register('address')}
              />
            </div>
            <div className="flex items-center gap-2 pt-3">
              <Button type="submit" disabled={!isDirty} loading={isSubmitting}>
                Save changes
              </Button>
              <span className="text-xs text-ink-400">
                {isDirty ? 'You have unsaved changes' : 'All caught up'}
              </span>
            </div>
          </form>
        </div>
      </Container>
    </motion.div>
  );
}
