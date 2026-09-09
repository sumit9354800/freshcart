import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { cn } from '../../lib/utils';
import type { Product } from '../../types';

export interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'icon' | 'badge';
}

export function WishlistButton({
  product,
  size = 'md',
  className,
  variant = 'icon',
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'badge') {
    return (
      <button
        type="button"
        id={`wishlist-toggle-${product.id}`}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer',
          active
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50',
          className
        )}
        aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={cn(
            iconSizes[size],
            active ? 'fill-rose-500 text-rose-500' : 'text-stone-400'
          )}
        />
        <span>{active ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
      </button>
    );
  }

  const btnSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-xl',
  };

  return (
    <button
      type="button"
      id={`wishlist-btn-${product.id}`}
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center bg-white/90 hover:bg-white shadow-xs backdrop-blur-xs border border-stone-200/80 transition-transform active:scale-95 cursor-pointer',
        btnSizes[size],
        className
      )}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          active ? 'fill-rose-500 text-rose-500' : 'text-stone-500 hover:text-rose-500'
        )}
      />
    </button>
  );
}
