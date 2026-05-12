import type { HTMLAttributes } from 'react';
import { cn } from '@shared/utils/cn';

export function Container({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}
      {...rest}
    />
  );
}
