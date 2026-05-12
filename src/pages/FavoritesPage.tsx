import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  EmptyState,
  ProductCard,
  Skeleton,
} from '@shared/ui';
import { useFavoritesStore } from '@app/store/favorites.store';
import { bakeryService, productService } from '@shared/services';
import { toast } from '@app/store/toast.store';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const ids = useFavoritesStore((s) => s.productIds);
  const toggle = useFavoritesStore((s) => s.toggle);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.list(),
  });
  const { data: bakeries } = useQuery({
    queryKey: ['bakeries'],
    queryFn: () => bakeryService.list(),
  });

  const favorites = (products ?? []).filter((p) => ids.includes(p.id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-10">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Favorites
          </span>
          <h1 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 mt-1">
            Your saved cakes
          </h1>
          <p className="text-ink-500 mt-1">
            {favorites.length === 0
              ? "Nothing saved yet. Tap the heart on any cake to keep it here."
              : `${favorites.length} cake${favorites.length === 1 ? '' : 's'} ready when you are.`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={<Heart size={20} />}
            title="No favorites yet"
            description="Browse the marketplace and save the cakes that catch your eye."
            action={<Button onClick={() => navigate('/marketplace')}>Browse marketplace</Button>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favorites.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                bakeryName={bakeries?.find((b) => b.id === p.bakeryId)?.name}
                onFavorite={() => {
                  toggle(p.id);
                  toast.info('Removed from favorites', p.name);
                }}
                onQuickAdd={() => navigate(`/product/${p.id}`)}
              />
            ))}
          </div>
        )}
      </Container>
    </motion.div>
  );
}
