import { cn } from '@shared/utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
}

export function Toggle({ checked, onChange, label, size = 'md' }: ToggleProps) {
  const trackH = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  const dotH = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative rounded-full transition-colors',
          trackH,
          checked ? 'bg-accent-500' : 'bg-cream-300',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 rounded-full bg-white shadow-soft transition-transform',
            dotH,
            checked && (size === 'sm' ? 'translate-x-4' : 'translate-x-5'),
          )}
        />
      </button>
      {label && <span className="text-sm text-ink-700">{label}</span>}
    </label>
  );
}
