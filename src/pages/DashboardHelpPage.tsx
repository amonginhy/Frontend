import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageCircle,
  Phone,
  PlayCircle,
  Search,
} from 'lucide-react';
import { Badge, Button, EmptyState } from '@shared/ui';
import { toast } from '@app/store/toast.store';
import { cn } from '@shared/utils/cn';

interface FAQ {
  q: string;
  a: string;
  audience: 'vendor' | 'admin' | 'both';
}

const FAQS: FAQ[] = [
  {
    q: 'How do I accept or reject a new order?',
    a: 'Open the Orders tab in your sidebar — every new order shows up in the "New" column. Click "Accept" to move it to Confirmed, or the × button to reject and refund the customer automatically.',
    audience: 'vendor',
  },
  {
    q: 'How does payout scheduling work?',
    a: 'You can choose weekly, biweekly, or monthly payouts from Settings → Payments. We send your earnings to your linked Mobile Money or bank account on the cycle you pick. Eden\'s CrunchBox\'s 12% commission is deducted before payout.',
    audience: 'vendor',
  },
  {
    q: 'Can I temporarily pause my store?',
    a: 'Yes — flip the "Accept new orders" toggle in Settings → Store profile, or use the same control on your Dashboard. Existing orders continue normally, but you stop receiving new ones until you re-enable it.',
    audience: 'vendor',
  },
  {
    q: 'How do I add a new product?',
    a: 'Go to Products → Add product. Provide a name, description, price (in UGX), category, prep time, and image. You can mark it as customizable to let customers run it through our cake builder.',
    audience: 'vendor',
  },
  {
    q: 'What happens when a customer files a dispute?',
    a: 'Disputes show up in the Admin disputes queue. They are tagged Low / Medium / High severity. The admin team will reach out to both parties; you can attach evidence by emailing support.',
    audience: 'vendor',
  },
  {
    q: 'How do I approve a new vendor?',
    a: 'Open Approvals from the sidebar. Each application shows a documents checklist (business license, food handler cert, tax ID). Once all three are verified the Approve button is enabled.',
    audience: 'admin',
  },
  {
    q: 'How is the platform take rate set?',
    a: 'The default take rate is 12% across all categories. You can preview category-level effective rates from Reports. Custom contracts can be applied per-vendor by HQ on request.',
    audience: 'admin',
  },
  {
    q: 'How are refunds handled?',
    a: 'Refunds are issued automatically when an order is rejected before baking. After baking starts, refunds need a dispute review. Partial refunds can be issued from the dispute detail view.',
    audience: 'both',
  },
];

const GUIDES = [
  { title: 'Onboarding checklist', minutes: 4, icon: <BookOpen size={16} /> },
  { title: 'Setting up your menu', minutes: 6, icon: <BookOpen size={16} /> },
  { title: 'Managing peak-hour orders', minutes: 5, icon: <PlayCircle size={16} /> },
  { title: 'Optimizing your store profile', minutes: 7, icon: <BookOpen size={16} /> },
];

export default function DashboardHelpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const variant: 'vendor' | 'admin' = location.pathname.startsWith('/admin')
    ? 'admin'
    : 'vendor';
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const relevant = FAQS.filter((f) => f.audience === variant || f.audience === 'both');
  const filtered = search
    ? relevant.filter(
        (f) =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase()),
      )
    : relevant;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Help & Docs
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            How can we help?
          </h1>
          <p className="text-ink-500 mt-1">
            Quick answers, guides, and a real human on the other end when you need one.
          </p>
        </div>
        <Button
          variant="dark"
          leftIcon={<MessageCircle size={16} />}
          onClick={() => toast.info('Live chat', 'A teammate will be with you shortly.')}
        >
          Start live chat
        </Button>
      </div>

      <div className="bg-burgundy-700 text-cream-50 rounded-3xl p-6 lg:p-8 mb-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h2 className="text-display text-2xl font-semibold">Search the knowledge base</h2>
            <p className="text-cream-200/80 mt-1">
              Try "payout schedule", "rejecting an order", or "approve vendor".
            </p>
            <div className="mt-4 flex items-center gap-2 h-12 px-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 focus-within:bg-white/15">
              <Search size={18} className="text-cream-200/70" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="flex-1 bg-transparent outline-none text-sm text-cream-50 placeholder:text-cream-200/60"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <Badge tone="accent">Status: All systems normal</Badge>
            <p className="text-cream-200/70 text-xs mt-2">Avg. response time</p>
            <p className="font-semibold">Under 5 minutes</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-display text-xl font-semibold text-burgundy-700">
              Frequently asked
            </h3>
            <Badge tone="cream">{filtered.length} articles</Badge>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<HelpCircle size={20} />}
              title="Nothing matches"
              description="Try a different search term, or reach out to support."
            />
          ) : (
            <ul className="space-y-2">
              {filtered.map((f, idx) => {
                const id = `${idx}-${f.q}`;
                const open = openId === id;
                return (
                  <li
                    key={id}
                    className="border border-cream-200 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenId(open ? null : id)}
                      className={cn(
                        'w-full flex items-center justify-between gap-4 p-4 text-left transition-colors',
                        open ? 'bg-cream-100' : 'hover:bg-cream-50',
                      )}
                    >
                      <span className="font-semibold text-ink-800">{f.q}</span>
                      <ChevronDown
                        size={16}
                        className={cn(
                          'shrink-0 text-ink-400 transition-transform',
                          open && 'rotate-180',
                        )}
                      />
                    </button>
                    {open && (
                      <div className="px-4 pb-4 text-sm text-ink-600 leading-relaxed">
                        {f.a}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="space-y-4">
          <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
            <h3 className="text-display text-xl font-semibold text-burgundy-700 mb-1">
              Guides & tutorials
            </h3>
            <p className="text-sm text-ink-500 mb-4">
              Short reads and walkthroughs.
            </p>
            <ul className="space-y-2">
              {GUIDES.map((g) => (
                <li key={g.title}>
                  <button
                    onClick={() => toast.info('Opening guide', g.title)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-cream-200 hover:bg-cream-50 transition-colors text-left"
                  >
                    <span className="h-9 w-9 grid place-items-center rounded-xl bg-cream-100 text-burgundy-700">
                      {g.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{g.title}</p>
                      <p className="text-xs text-ink-400">{g.minutes} min read</p>
                    </div>
                    <ExternalLink size={14} className="text-ink-300" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6">
            <div className="flex items-center gap-2 mb-3">
              <LifeBuoy size={18} className="text-burgundy-700" />
              <h3 className="text-display text-xl font-semibold text-burgundy-700">
                Talk to a human
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <a
                href="mailto:support@edenscrunchbox.com"
                className="flex items-center gap-3 p-3 rounded-2xl border border-cream-200 hover:bg-cream-50"
              >
                <Mail size={14} className="text-ink-500" />
                <span className="flex-1">support@edenscrunchbox.com</span>
                <span className="text-xs text-ink-400">~2h</span>
              </a>
              <a
                href="tel:+256415550188"
                className="flex items-center gap-3 p-3 rounded-2xl border border-cream-200 hover:bg-cream-50"
              >
                <Phone size={14} className="text-ink-500" />
                <span className="flex-1">+256 (415) 555-0188</span>
                <span className="text-xs text-ink-400">8am–10pm</span>
              </a>
              <button
                onClick={() => navigate('/contact')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-cream-200 hover:bg-cream-50 text-left"
              >
                <MessageCircle size={14} className="text-ink-500" />
                <span className="flex-1">Open contact form</span>
                <ExternalLink size={14} className="text-ink-300" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
