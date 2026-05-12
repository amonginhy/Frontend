import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatCompact, formatCurrencyCompact } from '@shared/utils/format';
import { cn } from '@shared/utils/cn';

interface StatCardProps {
  label: string;
  value: number;
  delta?: number;
  format?: 'currency' | 'number' | 'percent';
  icon?: ReactNode;
  tone?: 'cream' | 'burgundy' | 'accent' | 'dark';
  className?: string;
}

const tones = {
  cream: 'bg-white border-cream-100',
  burgundy: 'bg-burgundy-600 text-cream-50 border-burgundy-700',
  accent: 'bg-accent-500 text-white border-accent-600',
  dark: 'bg-ink-800 text-cream-50 border-ink-700',
};

export function StatCard({
  label,
  value,
  delta,
  format = 'number',
  icon,
  tone = 'cream',
  className,
}: StatCardProps) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(latest),
    });
    return controls.stop;
  }, [mv, value]);

  const formatted =
    format === 'currency'
      ? formatCurrencyCompact(display)
      : format === 'percent'
        ? `${display.toFixed(1)}%`
        : formatCompact(display);

  const positiveDelta = (delta ?? 0) >= 0;
  const isDark = tone !== 'cream';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-3xl border shadow-soft p-5 flex flex-col gap-4',
        tones[tone],
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-semibold uppercase tracking-wider',
            isDark ? 'text-cream-100/80' : 'text-ink-400',
          )}
        >
          {label}
        </span>
        {icon && (
          <span
            className={cn(
              'h-9 w-9 rounded-2xl grid place-items-center',
              isDark ? 'bg-white/10' : 'bg-cream-100 text-burgundy-700',
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="text-display text-3xl font-semibold tabular-nums">
          {formatted}
        </span>
        {typeof delta === 'number' && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-1',
              positiveDelta
                ? isDark
                  ? 'bg-emerald-400/20 text-emerald-200'
                  : 'bg-emerald-50 text-emerald-700'
                : isDark
                  ? 'bg-rose-400/20 text-rose-200'
                  : 'bg-rose-50 text-rose-700',
            )}
          >
            {positiveDelta ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
