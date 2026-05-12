import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Container } from '@shared/ui';

const steps = [
  { title: 'Choose a Bakery', body: 'Pick your favourite' },
  { title: 'Customize Your Cake', body: 'Design every layer' },
  { title: 'Place Your Order', body: 'Pay securely in seconds' },
  { title: 'Track to Your Door', body: 'Live status, on time' },
];

export function HowItWorks() {
  return (
    <section className="py-12 lg:py-16">
      <Container>
        <div className="bg-burgundy-700 text-cream-50 rounded-3xl overflow-hidden relative shadow-lift">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-accent-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cream-100/10 blur-3xl pointer-events-none" />

          <div className="relative px-6 py-10 sm:px-10 sm:py-12">
            <h2 className="text-display text-3xl sm:text-4xl font-semibold text-center mb-10">
              How it Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-y-6 lg:gap-x-2 items-center">
              {steps.map((s, idx) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="text-center px-3"
                >
                  <h3 className="text-display text-xl sm:text-2xl font-semibold text-cream-50">
                    {s.title}
                  </h3>
                  <p className="text-sm text-cream-200/70 mt-2">{s.body}</p>
                </motion.div>
              )).flatMap((node, idx) =>
                idx < steps.length - 1
                  ? [
                      node,
                      <ChevronRight
                        key={`chev-${idx}`}
                        size={28}
                        className="hidden lg:block text-cream-200/40 mx-auto"
                      />,
                    ]
                  : [node],
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
