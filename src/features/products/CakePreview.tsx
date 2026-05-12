import { motion } from 'framer-motion';
import { Cake, Heart, Share2, Sparkles } from 'lucide-react';
import { CakeIllustration } from '@shared/ui/CakeIllustration';
import { Badge, PriceTag, Rating } from '@shared/ui';
import type { CakeBuilderState } from './useCakeBuilder';
import type { Product, SizeOption, Topping, FlavorOption } from '@shared/types';

interface CakePreviewProps {
  product: Product;
  state: CakeBuilderState;
  totalPrice: number;
  flavors: FlavorOption[];
  sizes: SizeOption[];
  toppings: Topping[];
}

const flavorMap: Record<string, NonNullable<Parameters<typeof CakeIllustration>[0]['flavor']>> = {
  'f-choc': 'chocolate',
  'f-vanilla': 'vanilla',
  'f-redvelvet': 'redvelvet',
  'f-strawberry': 'strawberry',
  'f-matcha': 'matcha',
};

const toppingKeyMap: Record<string, string> = {
  't-strawberry': 'strawberry',
  't-cherry': 'cherry',
  't-blueberry': 'blueberry',
  't-chocolate': 'chocolate',
  't-sprinkles': 'sprinkles',
  't-candle': 'candle',
};

export function CakePreview({
  product,
  state,
  totalPrice,
  flavors,
  sizes,
  toppings,
}: CakePreviewProps) {
  const flavor = flavors.find((f) => f.id === state.flavorId);
  const size = sizes.find((s) => s.id === state.sizeId);
  const tiers = size?.id === 's-12' ? 3 : size?.id === 's-10' ? 2 : 1;
  const previewToppings = state.toppingIds.map((t) => toppingKeyMap[t]).filter(Boolean);

  return (
    <div className="bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200 rounded-3xl border border-cream-200 p-6 lg:p-8 lg:sticky lg:top-20 self-start">
      <div className="flex items-start justify-between mb-2">
        <Badge tone="accent" icon={<Sparkles size={12} />}>
          Live Preview
        </Badge>
        <div className="flex items-center gap-2">
          <button
            className="h-9 w-9 grid place-items-center rounded-full bg-white/80 hover:bg-white shadow-soft text-burgundy-700"
            aria-label="Save"
          >
            <Heart size={16} />
          </button>
          <button
            className="h-9 w-9 grid place-items-center rounded-full bg-white/80 hover:bg-white shadow-soft text-burgundy-700"
            aria-label="Share"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="aspect-square w-full max-w-sm mx-auto relative overflow-hidden">
        <div className="absolute inset-6 rounded-full bg-white/60 blur-2xl" />
        <motion.div
          key={`${state.flavorId}-${tiers}`}
          initial={{ rotate: -3, scale: 0.94, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="absolute inset-0 flex items-center justify-center p-4"
        >
          <CakeIllustration
            flavor={flavorMap[state.flavorId] ?? 'chocolate'}
            tiers={tiers as 1 | 2 | 3}
            toppings={previewToppings}
            size="xl"
            className="h-full w-full"
          />
        </motion.div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-cream-100">
          <p className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
            Flavor
          </p>
          <p className="text-sm font-semibold text-ink-800 truncate">{flavor?.name}</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-cream-100">
          <p className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
            Size
          </p>
          <p className="text-sm font-semibold text-ink-800 truncate">
            {size?.label} · {size?.serves}
          </p>
        </div>
      </div>

      <div className="mt-4 bg-burgundy-700 text-cream-50 rounded-3xl p-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-cream-200/70 font-semibold">
            Total
          </p>
          <PriceTag amount={totalPrice} size="xl" className="text-cream-50" />
          <p className="text-xs text-cream-200/70 mt-1 inline-flex items-center gap-1">
            <Cake size={12} /> Bakes in {product.preparationHours}h · Free delivery over UGX 200,000
          </p>
        </div>
        <Rating value={product.rating} reviews={product.reviews} className="text-cream-50" />
      </div>
    </div>
  );
}
