import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: ReactNode;
}

export function Chip({ active, icon, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-2 px-4 h-10 rounded-full border text-sm font-medium transition-all whitespace-nowrap focus-ring',
        active
          ? 'bg-burgundy-600 text-cream-50 border-burgundy-600 shadow-soft'
          : 'bg-white text-ink-700 border-cream-200 hover:border-burgundy-300 hover:text-burgundy-700',
        className,
      )}
      {...rest}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </button>
  );
}
