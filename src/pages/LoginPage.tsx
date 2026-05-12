import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input } from '@shared/ui';
import { AuthLayout } from '@features/auth/AuthLayout';
import { useAuthStore } from '@app/store/auth.store';
import { toast } from '@app/store/toast.store';
import type { User } from '@shared/types';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

const dashFor = (role: User['role']) =>
  role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor/dashboard' : '/marketplace';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((s) => s.signIn);
  const signInAsDemo = useAuthStore((s) => s.signInAsDemo);

  const from = (location.state as { from?: string } | null)?.from ?? null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await signIn(values.email, values.password);
      toast.success('Welcome back', `Signed in as ${user.name}`);
      navigate(from ?? dashFor(user.role), { replace: true });
    } catch {
      toast.error('Sign in failed', 'Please check your credentials and try again.');
    }
  });

  const tryDemo = (role: User['role']) => {
    const user = signInAsDemo(role);
    toast.success(`Signed in as ${role}`, user.name);
    navigate(from ?? dashFor(role), { replace: true });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Eden's CrunchBox account to continue ordering, baking, or running your shop."
      footer={
        <>
          New to Eden&apos;s CrunchBox?{' '}
          <Link
            to="/signup"
            state={{ from }}
            className="text-burgundy-700 font-semibold hover:text-accent-600"
          >
            Create an account
          </Link>
        </>
      }
    >
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail size={16} />}
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          leftIcon={<Lock size={16} />}
          {...register('password')}
          error={errors.password?.message}
        />
        <div className="flex items-center justify-between text-xs text-ink-500">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-accent-500" defaultChecked />
            Remember me
          </label>
          <a href="#" className="font-semibold text-burgundy-700 hover:text-accent-600">
            Forgot password?
          </a>
        </div>
        <Button type="submit" size="lg" loading={isSubmitting}>
          Sign in
        </Button>
      </motion.form>

      <div className="mt-6 pt-6 border-t border-cream-200">
        <p className="text-xs uppercase tracking-wider text-ink-400 font-semibold mb-3">
          Quick demo access
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(['customer', 'vendor', 'admin'] as User['role'][]).map((role) => (
            <Button
              key={role}
              variant="outline"
              size="sm"
              onClick={() => tryDemo(role)}
              type="button"
              className="capitalize"
            >
              {role}
            </Button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
