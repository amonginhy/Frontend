import { motion } from 'framer-motion';
import { ArrowRight, Bell, Layers, ShieldCheck, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Button, Container } from '@shared/ui';
import heroCake from '@assets/images/hero_cake.png';

const trustBadges: { icon: ReactNode; title: string; subtitle: string }[] = [
  {
    icon: <Layers size={18} />,
    title: 'Easy Customization',
    subtitle: 'Design every layer',
  },
  {
    icon: <ShieldCheck size={18} />,
    title: 'Allergen-safe',
    subtitle: 'Dietary made simple',
  },
  {
    icon: <Bell size={18} />,
    title: 'Real-time tracking',
    subtitle: 'Oven to doorstep',
  },
  {
    icon: <Store size={18} />,
    title: 'Multiple Bakers',
    subtitle: '1,200+ trusted vendors',
  },
];

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative">
      <Container className="relative pt-10 pb-8 lg:pt-14 lg:pb-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* Copy column */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 self-start text-[11px] font-bold uppercase tracking-[0.28em] text-accent-600"
            >
              <span className="h-px w-6 bg-accent-500" />
              At Eden&apos;s CrunchBox · Bakery Marketplace
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-display text-5xl sm:text-6xl lg:text-[5.25rem] font-semibold text-burgundy-700 leading-[0.96] tracking-tight"
            >
              Custom Cakes,
              <br />
              Made Your Way,
              <br />
              Delivered with <span className="text-accent-600">Love.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-ink-500 text-base max-w-md leading-relaxed"
            >
              Personalize your cakes, manage allergens safely, track orders in
              real-time and support local bakers — all from one beautifully
              simple marketplace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button
                size="lg"
                rightIcon={<ArrowRight size={16} />}
                onClick={() => navigate('/marketplace')}
              >
                Order now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/signup', { state: { tab: 'vendor' } })}
              >
                Become a Vendor
              </Button>
            </motion.div>
          </div>

          {/* Cake column with cream blob backdrop */}
          <div className="relative flex items-center justify-center lg:-mr-8 xl:-mr-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="relative aspect-square w-full lg:scale-110 xl:scale-125"
            >
              {/* Organic cream blob shape behind cake */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-cream-200 via-accent-100/70 to-cream-300"
                style={{
                  borderRadius: '64% 36% 58% 42% / 52% 60% 40% 48%',
                }}
                aria-hidden
              />
              <div
                className="absolute inset-4 bg-gradient-to-tr from-cream-100 via-cream-50 to-accent-50"
                style={{
                  borderRadius: '60% 40% 56% 44% / 50% 58% 42% 50%',
                }}
                aria-hidden
              />
              <motion.img
                src={heroCake}
                alt="Layered chocolate drip cake topped with fresh berries and chocolate shards"
                loading="eager"
                decoding="async"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative h-full w-full object-contain drop-shadow-[0_40px_60px_rgba(63,21,23,0.35)] scale-[1.25]"
              />
            </motion.div>
          </div>
        </div>

        {/* Full-width trust badges row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-10 lg:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {trustBadges.map((b, idx) => (
            <div
              key={b.title}
              className={`flex items-center gap-3 px-4 py-3 ${
                idx < trustBadges.length - 1 ? 'lg:border-r lg:border-cream-200' : ''
              }`}
            >
              <span className="h-11 w-11 shrink-0 rounded-2xl bg-cream-100 text-burgundy-700 grid place-items-center">
                {b.icon}
              </span>
              <div className="leading-tight min-w-0">
                <p className="text-sm font-semibold text-ink-800 truncate">
                  {b.title}
                </p>
                <p className="text-[11px] text-ink-400 mt-0.5 truncate">
                  {b.subtitle}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
