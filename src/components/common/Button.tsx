import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-700/10 border border-emerald-600',
      secondary:
        'bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-950 border border-stone-900',
      outline:
        'bg-white text-stone-800 border border-stone-200 hover:bg-stone-50 hover:border-stone-300 active:bg-stone-100',
      ghost:
        'bg-transparent text-stone-700 hover:bg-stone-100/80 active:bg-stone-200/70 border border-transparent',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border border-rose-600',
    };

    // Horizontal padding exactly 2x vertical padding per guidelines:
    // sm: py-1.5 px-3 (12px : 6px)
    // md: py-2.5 px-5 (20px : 10px)
    // lg: py-3 px-6 (24px : 12px)
    const sizes = {
      sm: 'py-1.5 px-3 text-xs rounded-lg gap-1.5 font-medium',
      md: 'py-2.5 px-5 text-sm rounded-xl gap-2 font-semibold',
      lg: 'py-3.5 px-7 text-base rounded-xl gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center select-none transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
