import { Star } from 'lucide-react';
import { cn } from '@shared/utils/cn';

interface RatingProps {
  value: number;
  reviews?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Rating({ value, reviews, size = 'sm', className }: RatingProps) {
  const px = size === 'lg' ? 18 : size === 'md' ? 16 : 14;
  return (
    <div className={cn('inline-flex items-center gap-1.5 text-ink-700', className)}>
      <Star size={px} className="fill-accent-500 stroke-accent-500" />
      <span
        className={cn(
          'font-semibold tabular-nums',
          size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs',
        )}
      >
        {value.toFixed(1)}
      </span>
      {typeof reviews === 'number' && (
        <span className={cn('text-ink-400', size === 'lg' ? 'text-sm' : 'text-xs')}>
          ({reviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}
