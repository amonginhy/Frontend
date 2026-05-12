import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, MessageCircle, Star } from 'lucide-react';
import {
  Badge,
  Button,
  Container,
  ProductCard,
  Rating,
  Skeleton,
} from '@shared/ui';
import { bakeryService, productService } from '@shared/services';

export default function ShopPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: bakery, isLoading } = useQuery({
    queryKey: ['shop', id],
    queryFn: () =>
      bakeryService.list().then((all) => all.find((b) => b.slug === id || b.id === id)),
  });
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.list(),
  });

  const shopProducts = (products ?? []).filter((p) => p.bakeryId === bakery?.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-burgundy-700 mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {isLoading || !bakery ? (
          <Skeleton className="h-72 rounded-3xl" />
        ) : (
          <div className="relative aspect-[16/6] rounded-3xl overflow-hidden">
            <img
              src={bakery.cover}
              alt={bakery.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/80 via-burgundy-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-cream-50 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                {bakery.featured && <Badge tone="accent">Featured</Badge>}
                <h1 className="text-display text-3xl sm:text-5xl font-semibold mt-2">
                  {bakery.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-sm">
                  <Rating value={bakery.rating} reviews={bakery.reviews} className="text-cream-50" />
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} /> {bakery.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} /> {bakery.deliveryMinutes} min delivery
                  </span>
                  <span className="inline-flex items-center gap-1">
                    {bakery.tags.map((t) => (
                      <Badge key={t} tone="cream" className="capitalize">
                        {t}
                      </Badge>
                    ))}
                  </span>
                </div>
              </div>
              <Button variant="primary" leftIcon={<MessageCircle size={16} />}>
                Message bakery
              </Button>
            </div>
          </div>
        )}

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-600">
                Menu
              </span>
              <h2 className="text-display text-2xl sm:text-3xl font-semibold text-burgundy-700 mt-1">
                Available cakes
              </h2>
            </div>
            <span className="text-sm text-ink-500 inline-flex items-center gap-1">
              <Star size={14} className="fill-accent-500 stroke-accent-500" />
              {bakery?.rating.toFixed(1)} from {bakery?.reviews.toLocaleString()} reviews
            </span>
          </div>

          {shopProducts.length === 0 ? (
            <Skeleton className="h-72" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shopProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  bakeryName={bakery?.name}
                  onQuickAdd={() => navigate(`/product/${p.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </Container>
    </motion.div>
  );
}
