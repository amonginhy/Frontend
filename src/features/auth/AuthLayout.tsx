import { Link } from 'react-router-dom';
import { Cake, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const perks = [
  { icon: <Sparkles size={14} />, label: 'Customizable cakes from local artisans' },
  { icon: <ShieldCheck size={14} />, label: 'Allergen-aware ordering' },
  { icon: <Truck size={14} />, label: 'Real-time delivery tracking' },
];

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 bg-cream-50">
      <aside className="hidden lg:flex relative bg-burgundy-700 text-cream-50 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cream-100/10 blur-3xl" />

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="h-10 w-10 rounded-2xl bg-cream-50 grid place-items-center text-burgundy-700">
              <Cake size={20} />
            </span>
            <span className="text-display text-2xl font-bold">Eden&apos;s CrunchBox</span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-display text-4xl font-semibold leading-tight">
            Custom cakes,
            <br />
            crafted by your
            <br />
            local bakers.
          </h2>
          <p className="text-cream-200/80 mt-4">
            Join 84,000+ celebration-loving customers and 1,200+ artisan bakers
            on the Eden&apos;s CrunchBox marketplace.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p.label} className="flex items-center gap-3 text-sm">
                <span className="h-7 w-7 grid place-items-center rounded-full bg-cream-50/10 text-accent-300">
                  {p.icon}
                </span>
                {p.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-cream-200/60">
          © {new Date().getFullYear()} Eden&apos;s CrunchBox.
        </div>
      </aside>

      <main className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700">
            {title}
          </h1>
          <p className="text-ink-500 mt-2">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-sm text-ink-500 text-center">{footer}</div>
        </div>
      </main>
    </div>
  );
}
