import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Container, Skeleton } from '@shared/ui';
import { productService, bakeryService } from '@shared/services';
import { CustomizerView } from '@features/products/CustomizerView';

export default function ProductCustomizerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = id ?? 'p1';

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.byId(productId),
  });
  const { data: options } = useQuery({
    queryKey: ['custom-options'],
    queryFn: () => productService.customizationOptions(),
  });
  const { data: bakery } = useQuery({
    queryKey: ['bakery', product?.bakeryId],
    enabled: !!product,
    queryFn: () =>
      bakeryService.list().then((all) => all.find((b) => b.id === product!.bakeryId)),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container className="py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-burgundy-700 mb-4"
        >
          <ArrowLeft size={16} /> Back to marketplace
        </button>
        {isLoading || !product || !options ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32" />
            </div>
          </div>
        ) : (
          <CustomizerView product={product} bakery={bakery} options={options} />
        )}
      </Container>
    </motion.div>
  );
}
