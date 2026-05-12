import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart, ShieldAlert, ShoppingBag } from 'lucide-react';
import { Badge, Button, Rating, Stepper } from '@shared/ui';
import { useCartStore } from '@app/store/cart.store';
import { useFavoritesStore } from '@app/store/favorites.store';
import { toast } from '@app/store/toast.store';
import { useGate } from '@shared/hooks/useGate';
import { useCakeBuilder } from './useCakeBuilder';
import { CakePreview } from './CakePreview';
import {
  StepDietary,
  StepFillings,
  StepFlavor,
  StepMessage,
  StepSize,
  StepToppings,
} from './CustomizerSteps';
import type {
  Bakery,
  DietaryOption,
  Filling,
  FlavorOption,
  Product,
  SizeOption,
  Topping,
} from '@shared/types';

const STEPS = ['Size', 'Flavor', 'Fillings', 'Toppings', 'Message', 'Dietary'];

interface Props {
  product: Product;
  bakery?: Bakery;
  options: {
    sizes: SizeOption[];
    flavors: FlavorOption[];
    fillings: Filling[];
    toppings: Topping[];
    dietary: DietaryOption[];
  };
}

export function CustomizerView({ product, bakery, options }: Props) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.has(product.id));
  const gate = useGate();
  const [step, setStep] = useState(0);

  const builder = useCakeBuilder({
    product,
    sizes: options.sizes,
    flavors: options.flavors,
    fillings: options.fillings,
    toppings: options.toppings,
    dietary: options.dietary,
  });

  const handleAddToCart = () =>
    gate(
      'Sign in to save this cake to your cart and track it from the kitchen to your door.',
      () => {
        addItem({
          id: `cart-${product.id}-${Date.now()}`,
          productId: product.id,
          bakeryId: product.bakeryId,
          name: product.name,
          image: product.image,
          quantity: builder.state.quantity,
          unitPrice: builder.totalPrice / builder.state.quantity,
          customization: {
            sizeId: builder.state.sizeId,
            flavorId: builder.state.flavorId,
            fillingIds: builder.state.fillingIds,
            toppingIds: builder.state.toppingIds,
            message: builder.state.message,
            dietary: builder.state.dietary,
          },
        });
        toast.success('Added to cart', `${builder.state.quantity} × ${product.name}`);
        navigate('/cart');
      },
    );

  const handleFavorite = () =>
    gate('Sign in to save your favorite cakes for later.', () => {
      const added = toggleFavorite(product.id);
      toast.info(
        added ? 'Saved to favorites' : 'Removed from favorites',
        product.name,
      );
    });

  return (
    <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 items-start">
      <CakePreview
        product={product}
        state={builder.state}
        totalPrice={builder.totalPrice}
        flavors={options.flavors}
        sizes={options.sizes}
        toppings={options.toppings}
      />

      <div className="bg-white rounded-3xl border border-cream-100 shadow-soft p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              {bakery?.name ?? 'Featured bakery'}
            </span>
            <h1 className="text-display text-3xl font-semibold text-burgundy-700 mt-1">
              {product.name}
            </h1>
          </div>
          <Rating value={product.rating} reviews={product.reviews} size="md" />
        </div>
        <p className="text-ink-500 leading-relaxed mb-4">{product.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {product.tags.map((t) => (
            <Badge key={t} className="capitalize">
              {t}
            </Badge>
          ))}
          {product.allergens?.map((a) => (
            <Badge key={a} tone="rose" className="capitalize">
              Contains {a}
            </Badge>
          ))}
        </div>

        <div className="border-t border-cream-100 pt-6">
          <Stepper steps={STEPS} current={step} onJump={(i) => setStep(i)} />
        </div>

        <div className="mt-6 min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div key={step}>
              <h3 className="text-display text-xl font-semibold text-burgundy-700 mb-1">
                Step {step + 1}: {STEPS[step]}
              </h3>
              <p className="text-sm text-ink-500 mb-4">
                {step === 0 && 'Pick the perfect size for your celebration.'}
                {step === 1 && 'Choose the flavor base for every bite.'}
                {step === 2 && 'Layer in fillings — pick as many as you like.'}
                {step === 3 && 'Add toppings to make it pop.'}
                {step === 4 && 'Personalize with a message and quantity.'}
                {step === 5 && 'Tell us about any dietary needs.'}
              </p>

              {step === 0 && (
                <StepSize sizes={options.sizes} state={builder.state} onSelect={builder.setSize} />
              )}
              {step === 1 && (
                <StepFlavor
                  flavors={options.flavors}
                  state={builder.state}
                  onSelect={builder.setFlavor}
                />
              )}
              {step === 2 && (
                <StepFillings
                  fillings={options.fillings}
                  state={builder.state}
                  onToggle={builder.toggleFilling}
                />
              )}
              {step === 3 && (
                <StepToppings
                  toppings={options.toppings}
                  state={builder.state}
                  onToggle={builder.toggleTopping}
                />
              )}
              {step === 4 && (
                <StepMessage
                  state={builder.state}
                  onChange={builder.setMessage}
                  onQuantityChange={builder.setQuantity}
                />
              )}
              {step === 5 && (
                <StepDietary state={builder.state} onToggle={builder.toggleDietary} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {builder.conflicts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3"
          >
            <ShieldAlert size={18} className="text-rose-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-rose-700">Allergen / dietary conflict</p>
              <p className="text-rose-600/90">
                Some selected ingredients aren't compatible with your dietary preference. The
                bakery will reach out to adjust automatically.
              </p>
            </div>
          </motion.div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              leftIcon={<ArrowLeft size={16} />}
            >
              Back
            </Button>
            <button
              type="button"
              onClick={handleFavorite}
              aria-label="Save"
              className={`h-12 w-12 grid place-items-center rounded-2xl border transition-colors ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'border-cream-200 text-ink-500 hover:border-rose-200 hover:text-rose-500'
              }`}
            >
              <Heart
                size={18}
                className={isFavorite ? 'fill-rose-500' : undefined}
              />
            </button>
          </div>
          {step < STEPS.length - 1 ? (
            <Button
              size="lg"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            >
              Continue
            </Button>
          ) : (
            <Button
              size="lg"
              variant="dark"
              rightIcon={<ShoppingBag size={16} />}
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
