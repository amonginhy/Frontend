import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Rating } from './Rating';
import { PriceTag } from './PriceTag';
import { Badge } from './Badge';
import { cn } from '@shared/utils/cn';
import type { Product } from '@shared/types';

interface ProductCardProps {
  product: Product;
  bakeryName?: string;
  onQuickAdd?: (p: Product) => void;
  onFavorite?: (p: Product) => void;
  className?: string;
}

export function ProductCard({
  product,
  bakeryName,
  onQuickAdd,
  onFavorite,
  className,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn(
        'group bg-white rounded-3xl border border-cream-100 shadow-soft overflow-hidden hover:shadow-lift transition-shadow',
        className,
      )}
    >
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-[4/3] block bg-cream-100 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {product.tags.slice(0, 1).map((t) => (
            <Badge key={t} tone="cream" className="capitalize">
              {t}
            </Badge>
          ))}
          {product.customizable && (
            <Badge tone="accent">Customizable</Badge>
          )}
        </div>
        {onFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavorite(product);
            }}
            className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur text-burgundy-700 hover:bg-white shadow-soft"
            aria-label="Save to favorites"
          >
            <Heart size={16} />
          </button>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/product/${product.id}`}
              className="font-semibold text-ink-800 truncate hover:text-burgundy-700 block"
            >
              {product.name}
            </Link>
            {bakeryName && (
              <span className="text-xs text-ink-400 truncate block">
                by {bakeryName}
              </span>
            )}
          </div>
          <Rating value={product.rating} reviews={product.reviews} />
        </div>

        <div className="flex items-center justify-between">
          <PriceTag amount={product.basePrice} size="lg" />
          {onQuickAdd && (
            <button
              onClick={() => onQuickAdd(product)}
              className="h-10 w-10 grid place-items-center rounded-2xl bg-burgundy-600 text-cream-50 hover:bg-burgundy-700 transition-colors shadow-soft"
              aria-label="Quick add to cart"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
