import { Skeleton } from '@shared/ui';
import { Container } from '@shared/ui';

export function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center">
      <Container>
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </Container>
    </div>
  );
}
