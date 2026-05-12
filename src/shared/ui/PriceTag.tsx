import { formatCurrency } from '@shared/utils/format';
import { cn } from '@shared/utils/cn';

interface PriceTagProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strikethrough?: number;
  className?: string;
}

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
};

export function PriceTag({
  amount,
  currency = 'UGX',
  size = 'md',
  strikethrough,
  className,
}: PriceTagProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-2 text-burgundy-700', className)}>
      <span className={cn('font-bold tabular-nums', sizes[size])}>
        {formatCurrency(amount, currency)}
      </span>
      {strikethrough && strikethrough > amount && (
        <span className="text-ink-400 text-xs line-through">
          {formatCurrency(strikethrough, currency)}
        </span>
      )}
    </span>
  );
}
