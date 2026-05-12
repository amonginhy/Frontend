import { motion } from 'framer-motion';
import { Check, Minus, Plus } from 'lucide-react';
import { dietaryOptions } from '@shared/services/mock-data';
import { formatCurrency } from '@shared/utils/format';
import { cn } from '@shared/utils/cn';
import type {
  Filling,
  FlavorOption,
  SizeOption,
  Topping,
} from '@shared/types';
import type { CakeBuilderState } from './useCakeBuilder';

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function StepSize({
  sizes,
  state,
  onSelect,
}: {
  sizes: SizeOption[];
  state: CakeBuilderState;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div {...fade} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {sizes.map((s) => {
        const active = state.sizeId === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={cn(
              'p-4 rounded-2xl border text-left transition-all flex flex-col gap-2',
              active
                ? 'bg-burgundy-600 border-burgundy-600 text-cream-50 shadow-lift'
                : 'bg-white border-cream-200 text-ink-700 hover:border-burgundy-300',
            )}
          >
            <div
              className={cn(
                'h-10 w-10 rounded-2xl grid place-items-center font-display text-xl font-semibold',
                active ? 'bg-cream-50 text-burgundy-700' : 'bg-cream-100 text-burgundy-700',
              )}
            >
              {s.label}
            </div>
            <div>
              <p className="font-semibold">{s.label}</p>
              <p className={cn('text-xs', active ? 'text-cream-200' : 'text-ink-400')}>
                {s.serves}
              </p>
            </div>
            <p className={cn('text-xs font-semibold', active ? 'text-cream-100' : 'text-accent-600')}>
              ×{s.priceMultiplier.toFixed(2)} multiplier
            </p>
          </button>
        );
      })}
    </motion.div>
  );
}

export function StepFlavor({
  flavors,
  state,
  onSelect,
}: {
  flavors: FlavorOption[];
  state: CakeBuilderState;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div {...fade} className="grid sm:grid-cols-2 gap-3">
      {flavors.map((f) => {
        const active = state.flavorId === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={cn(
              'p-4 rounded-2xl border text-left transition-all flex items-center gap-3',
              active
                ? 'bg-burgundy-600 border-burgundy-600 text-cream-50'
                : 'bg-white border-cream-200 hover:border-burgundy-300',
            )}
          >
            <span
              className={cn(
                'h-10 w-10 rounded-2xl grid place-items-center text-xl',
                active ? 'bg-cream-50' : 'bg-cream-100',
              )}
            >
              🎂
            </span>
            <div className="flex-1">
              <p className="font-semibold">{f.name}</p>
              <p className={cn('text-xs', active ? 'text-cream-200' : 'text-ink-400')}>
                {f.description}
              </p>
            </div>
            {f.priceDelta ? (
              <span
                className={cn(
                  'text-xs font-semibold',
                  active ? 'text-cream-100' : 'text-accent-600',
                )}
              >
                +{formatCurrency(f.priceDelta)}
              </span>
            ) : null}
          </button>
        );
      })}
    </motion.div>
  );
}

export function StepFillings({
  fillings,
  state,
  onToggle,
}: {
  fillings: Filling[];
  state: CakeBuilderState;
  onToggle: (id: string) => void;
}) {
  return (
    <motion.div {...fade} className="grid sm:grid-cols-2 gap-3">
      {fillings.map((f) => {
        const active = state.fillingIds.includes(f.id);
        return (
          <button
            key={f.id}
            onClick={() => onToggle(f.id)}
            className={cn(
              'p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3',
              active
                ? 'bg-accent-50 border-accent-200'
                : 'bg-white border-cream-200 hover:border-burgundy-300',
            )}
          >
            <div>
              <p className="font-semibold text-ink-800">{f.name}</p>
              <p className="text-xs text-ink-400">+{formatCurrency(f.price)}</p>
            </div>
            <span
              className={cn(
                'h-7 w-7 rounded-full grid place-items-center border',
                active
                  ? 'bg-accent-500 text-white border-accent-500'
                  : 'border-cream-300 text-ink-400',
              )}
            >
              {active ? <Check size={14} /> : <Plus size={14} />}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}

export function StepToppings({
  toppings,
  state,
  onToggle,
}: {
  toppings: Topping[];
  state: CakeBuilderState;
  onToggle: (id: string) => void;
}) {
  return (
    <motion.div {...fade} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {toppings.map((t) => {
        const active = state.toppingIds.includes(t.id);
        return (
          <button
            key={t.id}
            onClick={() => onToggle(t.id)}
            className={cn(
              'p-4 rounded-2xl border text-left transition-all flex flex-col gap-2',
              active
                ? 'bg-accent-500 border-accent-500 text-white shadow-lift'
                : 'bg-white border-cream-200 hover:border-burgundy-300',
            )}
          >
            <span className="text-2xl">{t.emoji}</span>
            <p className="font-semibold">{t.name}</p>
            <span
              className={cn('text-xs font-semibold', active ? 'text-white/90' : 'text-ink-400')}
            >
              +{formatCurrency(t.price)}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}

export function StepMessage({
  state,
  onChange,
  onQuantityChange,
}: {
  state: CakeBuilderState;
  onChange: (msg: string) => void;
  onQuantityChange: (qty: number) => void;
}) {
  return (
    <motion.div {...fade} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-ink-700">Message on cake</span>
        <textarea
          value={state.message}
          onChange={(e) => onChange(e.target.value)}
          maxLength={60}
          rows={3}
          placeholder="e.g. Happy 30th, Maya!"
          className="mt-2 w-full rounded-2xl border border-cream-200 bg-white p-4 text-sm focus-ring resize-none"
        />
        <div className="text-xs text-ink-400 mt-1 flex justify-between">
          <span>Tip: keep it short and lovely.</span>
          <span>{state.message?.length ?? 0}/60</span>
        </div>
      </label>

      <div className="rounded-2xl border border-cream-200 bg-white p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-ink-800">Quantity</p>
          <p className="text-xs text-ink-400">Each cake is freshly baked.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onQuantityChange(state.quantity - 1)}
            className="h-10 w-10 grid place-items-center rounded-full bg-cream-100 hover:bg-cream-200"
          >
            <Minus size={16} />
          </button>
          <span className="text-display text-2xl font-semibold w-8 text-center">
            {state.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(state.quantity + 1)}
            className="h-10 w-10 grid place-items-center rounded-full bg-burgundy-600 text-cream-50 hover:bg-burgundy-700"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function StepDietary({
  state,
  onToggle,
}: {
  state: CakeBuilderState;
  onToggle: (id: string) => void;
}) {
  return (
    <motion.div {...fade} className="grid sm:grid-cols-2 gap-3">
      {dietaryOptions.map((d) => {
        const active = state.dietary.includes(d.id);
        return (
          <button
            key={d.id}
            onClick={() => onToggle(d.id)}
            className={cn(
              'p-4 rounded-2xl border text-left transition-all flex items-center justify-between',
              active
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-cream-200 hover:border-emerald-200',
            )}
          >
            <div>
              <p className="font-semibold">{d.label}</p>
              <p className="text-xs text-ink-400">
                {d.conflicts?.length
                  ? 'Some toppings may be limited'
                  : 'No conflicts'}
              </p>
            </div>
            <span
              className={cn(
                'h-7 w-7 rounded-full grid place-items-center border',
                active
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'border-cream-300 text-ink-400',
              )}
            >
              {active ? <Check size={14} /> : <Plus size={14} />}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
