import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Star } from 'lucide-react';
import { Container, Skeleton } from '@shared/ui';
import { bakeryService } from '@shared/services';
import type { Bakery } from '@shared/types';

function BakeryTile({ bakery, index }: { bakery: Bakery; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/marketplace?bakery=${bakery.slug}`}
        className="group block"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cream-100 shadow-soft border border-cream-100">
          <img
            src={bakery.cover}
            alt={bakery.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-semibold text-burgundy-700">
            <Star size={10} className="fill-accent-500 stroke-accent-500" />
            {bakery.rating.toFixed(1)}
          </div>
        </div>
        <div className="mt-3 px-1">
          <p className="font-display text-base font-semibold text-burgundy-700 truncate group-hover:text-accent-600 transition-colors">
            {bakery.name}
          </p>
          <div className="flex items-center justify-between gap-2 text-xs text-ink-400 mt-0.5">
            <span className="truncate">{bakery.city}</span>
            <span className="inline-flex items-center gap-1 shrink-0">
              <Clock size={11} /> {bakery.deliveryMinutes}m
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedBakeries() {
  const { data, isLoading } = useQuery({
    queryKey: ['bakeries'],
    queryFn: () => bakeryService.list(),
  });

  return (
    <section className="py-12 lg:py-16">
      <Container>
        <div className="mb-8 max-w-2xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-600">
            Featured Bakeries
          </span>
          <h2 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-2 leading-tight">
            Hand-picked bakeries you'll love
          </h2>
          <p className="text-ink-500 mt-2">
            From neighborhood favorites to boutique studios — every bakery on
            Eden&apos;s CrunchBox is vetted for quality, freshness, and craft.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-3xl" />
              ))
            : data
                ?.slice(0, 4)
                .map((b, i) => <BakeryTile key={b.id} bakery={b} index={i} />)}
        </div>
      </Container>
    </section>
  );
}
