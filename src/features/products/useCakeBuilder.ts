import { useMemo, useState } from 'react';
import type {
  CakeCustomization,
  DietaryOption,
  Filling,
  FlavorOption,
  Product,
  SizeOption,
  Topping,
} from '@shared/types';

interface BuilderArgs {
  product: Product;
  sizes: SizeOption[];
  flavors: FlavorOption[];
  fillings: Filling[];
  toppings: Topping[];
  dietary: DietaryOption[];
}

export interface CakeBuilderState extends CakeCustomization {
  quantity: number;
}

export function useCakeBuilder({
  product,
  sizes,
  flavors,
  fillings,
  toppings,
  dietary,
}: BuilderArgs) {
  const [state, setState] = useState<CakeBuilderState>(() => ({
    sizeId: sizes[1]?.id ?? sizes[0].id,
    flavorId: flavors[0].id,
    fillingIds: [fillings[0].id],
    toppingIds: [toppings[0].id, toppings[3].id],
    message: '',
    dietary: [],
    quantity: 1,
  }));

  const setSize = (id: string) => setState((s) => ({ ...s, sizeId: id }));
  const setFlavor = (id: string) => setState((s) => ({ ...s, flavorId: id }));
  const toggleFilling = (id: string) =>
    setState((s) => ({
      ...s,
      fillingIds: s.fillingIds.includes(id)
        ? s.fillingIds.filter((f) => f !== id)
        : [...s.fillingIds, id],
    }));
  const toggleTopping = (id: string) =>
    setState((s) => ({
      ...s,
      toppingIds: s.toppingIds.includes(id)
        ? s.toppingIds.filter((t) => t !== id)
        : [...s.toppingIds, id],
    }));
  const setMessage = (message: string) => setState((s) => ({ ...s, message }));
  const toggleDietary = (id: string) =>
    setState((s) => ({
      ...s,
      dietary: s.dietary.includes(id)
        ? s.dietary.filter((d) => d !== id)
        : [...s.dietary, id],
    }));
  const setQuantity = (qty: number) =>
    setState((s) => ({ ...s, quantity: Math.max(1, Math.min(20, qty)) }));

  const conflicts = useMemo(() => {
    const result: { dietaryId: string; conflictWith: string }[] = [];
    state.dietary.forEach((dId) => {
      const def = dietary.find((d) => d.id === dId);
      def?.conflicts?.forEach((c) => {
        if (state.fillingIds.includes(c) || state.toppingIds.includes(c)) {
          result.push({ dietaryId: dId, conflictWith: c });
        }
      });
    });
    return result;
  }, [state.dietary, state.fillingIds, state.toppingIds, dietary]);

  const totalPrice = useMemo(() => {
    const size = sizes.find((s) => s.id === state.sizeId);
    const flavor = flavors.find((f) => f.id === state.flavorId);
    const fillingTotal = state.fillingIds.reduce((acc, id) => {
      const f = fillings.find((x) => x.id === id);
      return acc + (f?.price ?? 0);
    }, 0);
    const toppingTotal = state.toppingIds.reduce((acc, id) => {
      const t = toppings.find((x) => x.id === id);
      return acc + (t?.price ?? 0);
    }, 0);
    const flavorDelta = flavor?.priceDelta ?? 0;
    const base = product.basePrice + flavorDelta + fillingTotal + toppingTotal;
    return base * (size?.priceMultiplier ?? 1) * state.quantity;
  }, [product, sizes, flavors, fillings, toppings, state]);

  return {
    state,
    setSize,
    setFlavor,
    toggleFilling,
    toggleTopping,
    setMessage,
    toggleDietary,
    setQuantity,
    conflicts,
    totalPrice,
  };
}
