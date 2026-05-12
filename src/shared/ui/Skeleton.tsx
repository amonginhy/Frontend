import { cn } from '@shared/utils/cn';

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return <div className={cn('skeleton', className)} />;
}
