import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Rating } from './Rating';
import { Badge } from './Badge';
import { cn } from '@shared/utils/cn';
import type { Bakery } from '@shared/types';

interface BakeryCardProps {
  bakery: Bakery;
  variant?: 'tile' | 'row';
  className?: string;
}

export function BakeryCard({ bakery, variant = 'tile', className }: BakeryCardProps) {
  if (variant === 'row') {
    return (
      <Link
        to={`/marketplace?bakery=${bakery.slug}`}
        className={cn(
          'flex items-center gap-4 p-3 rounded-2xl hover:bg-cream-100 transition-colors',
          className,
        )}
      >
        <img
          src={bakery.cover}
          alt={bakery.name}
          className="h-14 w-14 rounded-2xl object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink-800 truncate">{bakery.name}</p>
          <div className="flex items-center gap-2 text-xs text-ink-400 mt-0.5">
            <Rating value={bakery.rating} size="sm" />
            <span>·</span>
            <span className="truncate">{bakery.city}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn(
        'group bg-white rounded-3xl border border-cream-100 shadow-soft overflow-hidden',
        className,
      )}
    >
      <Link to={`/marketplace?bakery=${bakery.slug}`} className="block">
        <div className="relative aspect-[5/3] bg-cream-100 overflow-hidden">
          <img
            src={bakery.cover}
            alt={bakery.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {bakery.featured && (
            <div className="absolute top-3 left-3">
              <Badge tone="burgundy">Featured</Badge>
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <span className="font-display text-lg font-semibold drop-shadow">
              {bakery.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur">
              {bakery.tags[0]}
            </span>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between gap-2">
          <Rating value={bakery.rating} reviews={bakery.reviews} />
          <div className="flex items-center gap-3 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {bakery.deliveryMinutes}m
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {bakery.city}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
