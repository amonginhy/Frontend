import type { ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center p-10 rounded-3xl bg-white border border-dashed border-cream-300',
        className,
      )}
    >
      {icon && (
        <div className="h-14 w-14 rounded-2xl grid place-items-center bg-cream-100 text-burgundy-700 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-display text-xl font-semibold text-burgundy-700">{title}</h3>
      {description && (
        <p className="text-ink-500 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
