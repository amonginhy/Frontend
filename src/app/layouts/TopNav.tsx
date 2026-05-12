import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Cake,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Container } from '@shared/ui';
import { Avatar } from '@shared/ui/Avatar';
import { useCartStore, cartSelectors } from '@app/store/cart.store';
import { useAuthStore } from '@app/store/auth.store';
import { toast } from '@app/store/toast.store';
import { cn } from '@shared/utils/cn';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contacts' },
];

export function TopNav() {
  const itemCount = useCartStore(cartSelectors.itemCount);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const dashFor = user?.role === 'admin' ? '/admin' : user?.role === 'vendor' ? '/vendor/dashboard' : null;

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200/70 bg-cream-50/80 backdrop-blur-md">
      <Container className="flex items-center gap-4 h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-2xl bg-burgundy-600 grid place-items-center text-cream-50">
            <Cake size={18} />
          </div>
          <span className="text-display text-xl font-bold text-burgundy-700 leading-none">
            Eden&apos;s CrunchBox
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-4 h-9 inline-flex items-center rounded-full text-sm font-medium transition-colors',
                  isActive
                    ? 'text-burgundy-700'
                    : 'text-ink-600 hover:text-burgundy-700',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto lg:ml-0">
          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-cream-100 text-ink-700"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-accent-500 text-[10px] font-bold grid place-items-center px-1 text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="hidden sm:flex items-center gap-2 h-10 pl-1 pr-3 rounded-full hover:bg-cream-100 transition-colors"
              >
                <Avatar name={user.name} src={user.avatar} size="sm" />
                <span className="text-sm font-semibold text-ink-800 max-w-[110px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className="text-ink-400" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-cream-200 shadow-lift p-2 z-50"
                  >
                    <div className="p-3">
                      <p className="text-sm font-semibold text-ink-800 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-ink-400 truncate">{user.email}</p>
                    </div>
                    <div className="border-t border-cream-100 my-1" />
                    <MenuItem
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/profile');
                      }}
                      icon={<User size={14} />}
                      label="Profile"
                      hide={user.role !== 'customer'}
                    />
                    <MenuItem
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/orders');
                      }}
                      icon={<Package size={14} />}
                      label="My orders"
                      hide={user.role !== 'customer'}
                    />
                    <MenuItem
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/favorites');
                      }}
                      icon={<Heart size={14} />}
                      label="Favorites"
                      hide={user.role !== 'customer'}
                    />
                    {dashFor && (
                      <MenuItem
                        onClick={() => {
                          setMenuOpen(false);
                          navigate(dashFor);
                        }}
                        icon={<LayoutDashboard size={14} />}
                        label={
                          user.role === 'admin'
                            ? 'Admin console'
                            : 'Vendor dashboard'
                        }
                      />
                    )}
                    <div className="border-t border-cream-100 my-1" />
                    <MenuItem
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                        toast.info('Signed out');
                        navigate('/');
                      }}
                      icon={<LogOut size={14} />}
                      label="Sign out"
                      tone="danger"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="hidden sm:inline-flex h-10 items-center px-3 text-sm font-medium text-ink-700 hover:text-burgundy-700"
              >
                Login
              </Link>
              <Button size="md" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          )}

          <button
            className="lg:hidden h-10 w-10 grid place-items-center rounded-full hover:bg-cream-100"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-burgundy-900/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-cream-50 shadow-lift p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-display text-lg font-semibold text-burgundy-700">
                  Menu
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 grid place-items-center rounded-full hover:bg-cream-100"
                >
                  <X size={18} />
                </button>
              </div>
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'h-12 px-4 rounded-2xl flex items-center text-sm font-medium',
                      isActive
                        ? 'bg-burgundy-600 text-cream-50'
                        : 'bg-white border border-cream-200',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-auto flex gap-2">
                {user ? (
                  <Button
                    variant="dark"
                    block
                    onClick={() => {
                      signOut();
                      toast.info('Signed out');
                      setOpen(false);
                      navigate('/');
                    }}
                  >
                    Sign out
                  </Button>
                ) : (
                  <Button
                    variant="dark"
                    block
                    onClick={() => {
                      setOpen(false);
                      navigate('/login');
                    }}
                  >
                    Sign in
                  </Button>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  tone = 'default',
  hide = false,
}: {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
  tone?: 'default' | 'danger';
  hide?: boolean;
}) {
  if (hide) return null;
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-sm font-medium transition-colors text-left',
        tone === 'danger'
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-ink-700 hover:bg-cream-100',
      )}
    >
      <span className="opacity-70">{icon}</span>
      {label}
    </button>
  );
}
