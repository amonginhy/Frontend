import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@shared/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, padded = true, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-3xl shadow-soft border border-cream-100',
        padded && 'p-5',
        interactive &&
          'transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5 cursor-pointer',
        className,
      )}
      {...rest}
    />
  ),
);
Card.displayName = 'Card';
