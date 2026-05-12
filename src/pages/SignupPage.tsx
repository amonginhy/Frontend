import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Store,
  User as UserIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button, Input } from '@shared/ui';
import { AuthLayout } from '@features/auth/AuthLayout';
import { useAuthStore } from '@app/store/auth.store';
import { toast } from '@app/store/toast.store';
import { cn } from '@shared/utils/cn';

const customerSchema = z
  .object({
    name: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Use at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type CustomerForm = z.infer<typeof customerSchema>;

const vendorSchema = z
  .object({
    bakeryName: z.string().min(2, 'Bakery name is required'),
    ownerName: z.string().min(2, 'Owner name is required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().min(7, 'Enter a phone number'),
    address: z.string().min(5, 'Enter your bakery address'),
    password: z.string().min(6, 'Use at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type VendorForm = z.infer<typeof vendorSchema>;

type Tab = 'customer' | 'vendor';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string; tab?: Tab } | null;
  const [tab, setTab] = useState<Tab>(state?.tab ?? 'customer');
  const signUpCustomer = useAuthStore((s) => s.signUpCustomer);
  const signUpVendor = useAuthStore((s) => s.signUpVendor);
  const from = state?.from ?? null;

  const customer = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', phone: '' },
  });
  const vendor = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      bakeryName: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onCustomerSubmit = customer.handleSubmit(async (v) => {
    try {
      await signUpCustomer({ name: v.name, email: v.email, phone: v.phone });
      toast.success("Welcome to Eden's CrunchBox", "Let's find your perfect cake.");
      navigate(from ?? '/marketplace', { replace: true });
    } catch {
      toast.error('Sign up failed', 'Please try again.');
    }
  });

  const onVendorSubmit = vendor.handleSubmit(async (v) => {
    try {
      await signUpVendor({
        bakeryName: v.bakeryName,
        ownerName: v.ownerName,
        email: v.email,
        phone: v.phone,
        address: v.address,
      });
      toast.success('Bakery account created', 'Your dashboard is ready.');
      navigate('/vendor/dashboard', { replace: true });
    } catch {
      toast.error('Sign up failed', 'Please try again.');
    }
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Choose how you'd like to use Eden's CrunchBox. You can switch later from your profile."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            state={{ from }}
            className="text-burgundy-700 font-semibold hover:text-accent-600"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-cream-100 mb-5">
        {([
          { id: 'customer', label: 'I want to order', icon: <UserIcon size={14} /> },
          { id: 'vendor', label: "I'm a baker", icon: <Store size={14} /> },
        ] as { id: Tab; label: string; icon: JSX.Element }[]).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'h-10 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors',
              tab === t.id
                ? 'bg-white text-burgundy-700 shadow-soft'
                : 'text-ink-500 hover:text-burgundy-700',
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'customer' ? (
        <motion.form
          key="customer"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onCustomerSubmit}
          className="flex flex-col gap-4"
        >
          <Input
            label="Full name"
            placeholder="Amara Bennett"
            leftIcon={<UserIcon size={16} />}
            autoComplete="name"
            {...customer.register('name')}
            error={customer.formState.errors.name?.message}
          />
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            leftIcon={<Mail size={16} />}
            autoComplete="email"
            {...customer.register('email')}
            error={customer.formState.errors.email?.message}
          />
          <Input
            label="Phone (optional)"
            placeholder="+256 700 123 456"
            leftIcon={<Phone size={16} />}
            autoComplete="tel"
            {...customer.register('phone')}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              autoComplete="new-password"
              {...customer.register('password')}
              error={customer.formState.errors.password?.message}
            />
            <Input
              type="password"
              label="Confirm password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              autoComplete="new-password"
              {...customer.register('confirmPassword')}
              error={customer.formState.errors.confirmPassword?.message}
            />
          </div>
          <Button type="submit" size="lg" loading={customer.formState.isSubmitting}>
            Create customer account
          </Button>
        </motion.form>
      ) : (
        <motion.form
          key="vendor"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onVendorSubmit}
          className="flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Bakery name"
              placeholder="Olive & Oak"
              leftIcon={<Building2 size={16} />}
              {...vendor.register('bakeryName')}
              error={vendor.formState.errors.bakeryName?.message}
            />
            <Input
              label="Owner name"
              placeholder="Hannah Lee"
              leftIcon={<UserIcon size={16} />}
              {...vendor.register('ownerName')}
              error={vendor.formState.errors.ownerName?.message}
            />
          </div>
          <Input
            type="email"
            label="Business email"
            placeholder="hello@yourbakery.com"
            leftIcon={<Mail size={16} />}
            autoComplete="email"
            {...vendor.register('email')}
            error={vendor.formState.errors.email?.message}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Phone"
              placeholder="+256 700 123 456"
              leftIcon={<Phone size={16} />}
              autoComplete="tel"
              {...vendor.register('phone')}
              error={vendor.formState.errors.phone?.message}
            />
            <Input
              label="Address"
              placeholder="Plot 14 Acacia Ave, Kololo"
              leftIcon={<MapPin size={16} />}
              {...vendor.register('address')}
              error={vendor.formState.errors.address?.message}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Business logo</label>
            <div className="mt-1.5 h-24 rounded-2xl border border-dashed border-cream-300 grid place-items-center text-xs text-ink-400">
              Drag a square logo here · PNG / JPG · up to 2MB
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              type="password"
              label="Password"
              leftIcon={<Lock size={16} />}
              autoComplete="new-password"
              {...vendor.register('password')}
              error={vendor.formState.errors.password?.message}
            />
            <Input
              type="password"
              label="Confirm"
              leftIcon={<Lock size={16} />}
              autoComplete="new-password"
              {...vendor.register('confirmPassword')}
              error={vendor.formState.errors.confirmPassword?.message}
            />
          </div>
          <Button type="submit" size="lg" loading={vendor.formState.isSubmitting}>
            Create vendor account
          </Button>
        </motion.form>
      )}
    </AuthLayout>
  );
}
