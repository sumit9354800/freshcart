import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface QuantitySelectorProps {
  quantity: number;
  maxStock: number;
  onChange: (quantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  maxStock,
  onChange,
  size = 'md',
  className,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxStock) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    const clamped = Math.max(1, Math.min(val, maxStock));
    onChange(clamped);
  };

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  const btnSizes = {
    sm: 'w-7 h-full',
    md: 'w-9 h-full',
    lg: 'w-11 h-full',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-stone-200 bg-white shadow-xs overflow-hidden select-none',
        sizeClasses[size],
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        className={cn(
          'flex items-center justify-center text-stone-600 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer',
          btnSizes[size]
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <input
        type="number"
        min={1}
        max={maxStock}
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        className="w-10 text-center font-bold text-stone-900 bg-transparent border-none focus:outline-none focus:ring-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= maxStock}
        className={cn(
          'flex items-center justify-center text-stone-600 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer',
          btnSizes[size]
        )}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
