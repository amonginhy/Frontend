import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Star } from 'lucide-react';
import { Container, Skeleton } from '@shared/ui';
import { productService, bakeryService } from '@shared/services';
import { formatCurrency } from '@shared/utils/format';
import type { Product } from '@shared/types';

function CakeTile({
  product,
  bakery,
  index,
}: {
  product: Product;
  bakery?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cream-100 shadow-soft border border-cream-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-semibold text-burgundy-700">
            <Star size={10} className="fill-accent-500 stroke-accent-500" />
            {product.rating.toFixed(1)}
          </div>
          <button
            type="button"
            aria-label="Quick view"
            className="absolute bottom-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-burgundy-600 text-cream-50 opacity-0 group-hover:opacity-100 transition-opacity shadow-lift"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="mt-3 px-1">
          <p className="font-display text-base font-semibold text-burgundy-700 truncate group-hover:text-accent-600 transition-colors">
            {product.name}
          </p>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            {bakery ? (
              <span className="text-xs text-ink-400 truncate">by {bakery}</span>
            ) : (
              <span />
            )}
            <span className="text-sm font-bold text-burgundy-700 tabular-nums shrink-0">
              {formatCurrency(product.basePrice)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function PopularCakes() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.list(),
  });
  const { data: bakeries } = useQuery({
    queryKey: ['bakeries'],
    queryFn: () => bakeryService.list(),
  });

  return (
    <section className="py-12 lg:py-16">
      <Container>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-600">
              Popular Cakes
            </span>
            <h2 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-2 leading-tight">
              Trending bakes this week
            </h2>
            <p className="text-ink-500 mt-2">
              The cakes our community can't stop ordering — fresh from the oven
              and customizable to the last sprinkle.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1 self-start text-sm font-semibold text-burgundy-700 hover:text-accent-600 transition-colors"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] rounded-3xl" />
              ))
            : products?.slice(0, 4).map((p, i) => {
                const bakeryName = bakeries?.find((b) => b.id === p.bakeryId)?.name;
                return (
                  <CakeTile
                    key={p.id}
                    product={p}
                    bakery={bakeryName}
                    index={i}
                  />
                );
              })}
        </div>
      </Container>
    </section>
  );
}
