import type { ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 mb-6',
        align === 'center' && 'items-center text-center',
        action && 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">
            {eyebrow}
          </span>
        )}
        <h2 className="text-display text-3xl sm:text-4xl font-semibold text-burgundy-700 leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-ink-500 max-w-xl">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
