import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

type Tone = 'cream' | 'burgundy' | 'accent' | 'green' | 'amber' | 'sky' | 'rose';

const tones: Record<Tone, string> = {
  cream: 'bg-cream-100 text-burgundy-700 border-cream-200',
  burgundy: 'bg-burgundy-600 text-cream-50 border-transparent',
  accent: 'bg-accent-50 text-accent-700 border-accent-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  sky: 'bg-sky-50 text-sky-700 border-sky-100',
  rose: 'bg-rose-50 text-rose-700 border-rose-100',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

export function Badge({
  tone = 'cream',
  icon,
  size = 'sm',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border whitespace-nowrap',
        size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5',
        tones[tone],
        className,
      )}
      {...rest}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
}
