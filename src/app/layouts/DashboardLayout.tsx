import {
  BarChart3,
  Bell,
  Cake,
  ChevronRight,
  CircleDot,
  ClipboardList,
  Cog,
  Flag,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Search,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@shared/ui/Avatar';
import { Toaster } from '@shared/ui';
import { useAuthStore } from '@app/store/auth.store';
import { toast } from '@app/store/toast.store';
import { cn } from '@shared/utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: string;
}

const vendorNav: NavItem[] = [
  { to: '/vendor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/vendor/orders', label: 'Orders', icon: <ClipboardList size={18} />, badge: '12' },
  { to: '/vendor/products', label: 'Products', icon: <Cake size={18} /> },
  { to: '/vendor/customers', label: 'Customers', icon: <Users size={18} /> },
  { to: '/vendor/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { to: '/vendor/settings', label: 'Settings', icon: <Cog size={18} /> },
];

const adminNav: NavItem[] = [
  { to: '/admin/dashboard', label: 'Overview', icon: <Home size={18} /> },
  { to: '/admin/vendors', label: 'Vendors', icon: <Store size={18} />, badge: '8' },
  { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
  { to: '/admin/orders', label: 'Orders', icon: <ClipboardList size={18} /> },
  { to: '/admin/approvals', label: 'Approvals', icon: <ShieldCheck size={18} /> },
  { to: '/admin/disputes', label: 'Disputes', icon: <Flag size={18} /> },
  { to: '/admin/reports', label: 'Reports', icon: <BarChart3 size={18} /> },
];

interface Props {
  variant?: 'vendor' | 'admin';
}

export function DashboardLayout({ variant = 'vendor' }: Props) {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();
  const nav = variant === 'admin' ? adminNav : vendorNav;
  const title = variant === 'admin' ? 'Admin Console' : 'Vendor Suite';
  const [search, setSearch] = useState('');

  const handleSignOut = () => {
    signOut();
    toast.info('Signed out');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-cream-100">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-cream-200">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-cream-200">
          <div className="h-9 w-9 rounded-2xl bg-burgundy-600 grid place-items-center text-cream-50">
            <Cake size={18} />
          </div>
          <div className="leading-tight">
            <p className="text-display text-base font-bold text-burgundy-700 leading-tight">
              Eden&apos;s CrunchBox
            </p>
            <p className="text-[10px] uppercase tracking-wider text-ink-400">{title}</p>
          </div>
        </Link>

        <nav className="flex flex-col gap-1 p-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 h-11 px-3 rounded-2xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-burgundy-600 text-cream-50 shadow-soft'
                    : 'text-ink-700 hover:bg-cream-100',
                )
              }
            >
              {n.icon}
              <span className="flex-1">{n.label}</span>
              {n.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500 text-white font-bold">
                  {n.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-3 space-y-2">
          {variant === 'vendor' && (
            <div className="rounded-2xl bg-cream-100 p-4 flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-burgundy-700 font-semibold">
                <CircleDot size={12} className="text-emerald-500 fill-emerald-500" />
                Store live
              </span>
              <p className="text-xs text-ink-500">
                Accepting orders. Avg prep time 35m.
              </p>
              <button
                onClick={() => navigate('/shop/olive-and-oak')}
                className="text-xs font-semibold text-accent-600 inline-flex items-center gap-1 hover:underline"
              >
                View store profile <ChevronRight size={12} />
              </button>
            </div>
          )}
          <button
            onClick={() => navigate(variant === 'admin' ? '/admin/help' : '/vendor/help')}
            className="flex items-center gap-3 h-11 px-3 rounded-2xl text-sm font-medium text-ink-700 hover:bg-cream-100 w-full"
          >
            <LifeBuoy size={18} /> Help & Docs
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-cream-200">
          <div className="px-6 h-16 flex items-center gap-4">
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-burgundy-600 grid place-items-center text-cream-50">
                <Cake size={18} />
              </div>
              <span className="text-display text-lg font-bold text-burgundy-700">
                Eden&apos;s CrunchBox
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2 h-10 px-4 rounded-full bg-cream-100 w-96">
              <Search size={16} className="text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  variant === 'admin'
                    ? 'Search vendors, users, orders…'
                    : 'Search orders, products, customers…'
                }
                className="bg-transparent outline-none text-sm w-full placeholder:text-ink-400"
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="relative h-10 w-10 grid place-items-center rounded-full hover:bg-cream-100">
                <Bell size={18} />
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent-500"
                />
              </button>
              <div className="hidden sm:flex items-center gap-3">
                {user && (
                  <>
                    <Avatar name={user.name} src={user.avatar} size="sm" />
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-ink-800">{user.name}</p>
                      <p className="text-xs text-ink-400">{variant === 'admin' ? 'Operator' : 'Owner'}</p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="h-10 w-10 grid place-items-center rounded-full hover:bg-cream-100 text-ink-700"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
