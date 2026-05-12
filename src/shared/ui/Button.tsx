import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@shared/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'dark';
type Size = 'sm' | 'md' | 'lg' | 'xl';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-soft hover:shadow-lift',
  dark: 'bg-burgundy-600 text-cream-50 hover:bg-burgundy-700 active:bg-burgundy-800 shadow-soft hover:shadow-lift',
  secondary:
    'bg-cream-100 text-burgundy-700 hover:bg-cream-200 active:bg-cream-300 shadow-soft',
  outline:
    'border border-cream-300 bg-white text-burgundy-700 hover:bg-cream-50 active:bg-cream-100',
  ghost: 'bg-transparent text-burgundy-700 hover:bg-cream-100',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-xl gap-1.5',
  md: 'h-11 px-5 text-sm rounded-2xl gap-2',
  lg: 'h-12 px-6 text-base rounded-2xl gap-2',
  xl: 'h-14 px-8 text-base rounded-2xl gap-2.5',
};

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      loading,
      block,
      className,
      children,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const motionProps: HTMLMotionProps<'button'> = {
      whileHover: disabled ? undefined : { y: -1 },
      whileTap: disabled ? undefined : { scale: 0.98 },
      transition: { type: 'spring', stiffness: 400, damping: 28 },
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-colors focus-ring select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          block && 'w-full',
          className,
        )}
        {...motionProps}
        {...(rest as HTMLMotionProps<'button'>)}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            Loading
          </span>
        ) : (
          <>
            {leftIcon && <span className="inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  },
);
Button.displayName = 'Button';
