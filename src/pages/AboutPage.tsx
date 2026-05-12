import { motion } from 'framer-motion';
import { Cake, Heart, Sparkles, Users } from 'lucide-react';
import { Container, SectionHeader, StatCard } from '@shared/ui';

const values = [
  {
    icon: <Heart size={20} />,
    title: 'Bakers first',
    body: 'We pay vendors weekly and take a tiny commission so they can keep crafting.',
  },
  {
    icon: <Sparkles size={20} />,
    title: 'Premium by default',
    body: 'Every cake is hand-finished, vetted, and reviewed before listing.',
  },
  {
    icon: <Users size={20} />,
    title: 'Community owned',
    body: 'Customers, bakers, and couriers share product roadmap influence.',
  },
  {
    icon: <Cake size={20} />,
    title: 'Always celebratory',
    body: 'We exist for moments — birthdays, weddings, weekday joy.',
  },
];

export default function AboutPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-14 lg:py-20">
        <div className="max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-600">
            About Eden&apos;s CrunchBox
          </span>
          <h1 className="text-display text-4xl sm:text-5xl font-semibold text-burgundy-700 mt-3 leading-tight">
            We help local bakers reach the people who love their craft.
          </h1>
          <p className="text-ink-500 mt-4 text-lg leading-relaxed">
            Eden&apos;s CrunchBox is a marketplace for custom cakes and artisan baked goods. We
            help small bakeries operate online without losing what makes them
            special — and we help customers discover, customize, and track every
            sweet detail.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <StatCard label="Bakers onboarded" value={1248} delta={4.2} tone="cream" />
          <StatCard label="Cakes shipped" value={184230} delta={18.6} tone="burgundy" />
          <StatCard label="Cities served" value={42} delta={12.0} tone="accent" />
          <StatCard
            label="Avg. rating"
            value={4.9}
            delta={0.4}
            tone="cream"
            format="number"
          />
        </div>

        <SectionHeader
          eyebrow="What we believe"
          title="Built on simple values"
          description="Every product decision starts with these four ideas."
          className="mt-20"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6"
            >
              <div className="h-11 w-11 rounded-2xl bg-cream-100 grid place-items-center text-burgundy-700">
                {v.icon}
              </div>
              <h3 className="text-display text-lg font-semibold text-burgundy-700 mt-4">
                {v.title}
              </h3>
              <p className="text-sm text-ink-500 mt-1 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </motion.div>
  );
}
