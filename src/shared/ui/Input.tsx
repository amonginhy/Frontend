import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightIcon, className, id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <label className="flex flex-col gap-1.5" htmlFor={inputId}>
        {label && (
          <span className="text-sm font-medium text-ink-700">{label}</span>
        )}
        <div
          className={cn(
            'flex items-center gap-2 h-12 px-4 rounded-2xl bg-white border transition-all',
            'border-cream-200 focus-within:border-accent-500 focus-within:ring-4 focus-within:ring-accent-500/20',
            error && 'border-red-400 focus-within:ring-red-400/20',
            className,
          )}
        >
          {leftIcon && <span className="text-ink-400 shrink-0">{leftIcon}</span>}
          <input
            id={inputId}
            ref={ref}
            className="w-full bg-transparent outline-none text-sm text-ink-800 placeholder:text-ink-300"
            {...rest}
          />
          {rightIcon && <span className="text-ink-400 shrink-0">{rightIcon}</span>}
        </div>
        {(hint || error) && (
          <span
            className={cn(
              'text-xs',
              error ? 'text-red-500' : 'text-ink-400',
            )}
          >
            {error || hint}
          </span>
        )}
      </label>
    );
  },
);
Input.displayName = 'Input';
