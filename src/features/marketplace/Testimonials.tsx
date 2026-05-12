import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, Container } from '@shared/ui';

const items = [
  {
    name: 'Olivia M.',
    role: 'Birthday host',
    rating: 5,
    quote:
      "I built a 3-tier matcha cake at midnight, paid by mobile money, and tracked it to my office in 40 minutes. Eden's CrunchBox is magic.",
  },
  {
    name: 'Marcus T.',
    role: 'Event planner',
    rating: 5,
    quote:
      'The customizer is the best in the industry. My team can spec wedding cakes in minutes — and bakers love how clear the briefs are.',
  },
  {
    name: 'Hannah L.',
    role: 'Vendor — Sugarbloom',
    rating: 5,
    quote:
      'I tripled my online orders in two months. The dashboard is gorgeous and the order kanban keeps my team in flow.',
  },
];

export function Testimonials() {
  return (
    <section className="py-12 lg:py-16">
      <Container>
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-600">
            Reviews
          </span>
          <h2 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-2 leading-tight">
            What Our Community Says
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-0.5 text-accent-500">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={14} className="fill-accent-500 stroke-accent-500" />
                ))}
              </div>
              <blockquote className="text-ink-700 leading-relaxed text-[15px]">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-3 border-t border-cream-100">
                <Avatar name={t.name} size="sm" />
                <div className="leading-tight">
                  <p className="font-semibold text-ink-800 text-sm">{t.name}</p>
                  <p className="text-xs text-ink-400">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
