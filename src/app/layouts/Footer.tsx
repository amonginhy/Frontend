import { Cake, Github, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '@shared/ui';

const cols = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse Bakeries', to: '/marketplace' },
      { label: 'Custom Cakes', to: '/customize' },
      { label: 'Favorites', to: '/favorites' },
      { label: 'My Orders', to: '/orders' },
    ],
  },
  {
    title: 'For Bakers',
    links: [
      { label: 'Become a Vendor', to: '/signup' },
      { label: 'Vendor Login', to: '/login' },
      { label: 'Vendor Dashboard', to: '/vendor/dashboard' },
      { label: 'Resources', to: '/about' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/about' },
      { label: 'Press', to: '/contact' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-burgundy-700 text-cream-100 mt-20">
      <Container className="py-14 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-cream-50 grid place-items-center text-burgundy-700">
              <Cake size={18} />
            </div>
            <span className="text-display text-2xl font-bold text-cream-50">Eden&apos;s CrunchBox</span>
          </div>
          <p className="text-sm text-cream-200/80 max-w-sm">
            The premium marketplace for custom cakes, pastries, and artisan bakes —
            delivered fresh from your favorite local bakers.
          </p>
          <div className="flex gap-2 mt-2">
            {[Instagram, Twitter, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-10 w-10 grid place-items-center rounded-2xl bg-burgundy-600 hover:bg-burgundy-500 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-cream-50 mb-3">{col.title}</h4>
            <ul className="space-y-2 text-sm text-cream-200/80">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-cream-50 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-burgundy-600">
        <Container className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-200/70">
          <span>© {new Date().getFullYear()} Eden&apos;s CrunchBox. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
