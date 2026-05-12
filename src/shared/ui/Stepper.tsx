import { Check } from 'lucide-react';
import { cn } from '@shared/utils/cn';

interface StepperProps {
  steps: string[];
  current: number;
  onJump?: (index: number) => void;
}

export function Stepper({ steps, current, onJump }: StepperProps) {
  return (
    <ol className="flex items-center gap-3 overflow-x-auto no-scrollbar">
      {steps.map((label, idx) => {
        const status = idx < current ? 'done' : idx === current ? 'active' : 'upcoming';
        return (
          <li key={label} className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onJump?.(idx)}
              disabled={!onJump || status === 'upcoming'}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 h-9 text-sm font-medium transition-colors',
                status === 'done' && 'bg-emerald-50 text-emerald-700',
                status === 'active' && 'bg-burgundy-600 text-cream-50',
                status === 'upcoming' && 'bg-cream-100 text-ink-400',
              )}
            >
              <span
                className={cn(
                  'h-5 w-5 rounded-full grid place-items-center text-[10px] font-bold',
                  status === 'done' && 'bg-emerald-500 text-white',
                  status === 'active' && 'bg-cream-50 text-burgundy-700',
                  status === 'upcoming' && 'bg-cream-200 text-ink-500',
                )}
              >
                {status === 'done' ? <Check size={12} /> : idx + 1}
              </span>
              {label}
            </button>
            {idx < steps.length - 1 && (
              <span
                className={cn(
                  'hidden sm:block h-px w-8',
                  idx < current ? 'bg-emerald-300' : 'bg-cream-200',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
