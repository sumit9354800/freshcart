import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ProductRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
  className?: string;
}

export function ProductRating({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true,
  className,
}: ProductRatingProps) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(rating);
          return (
            <Star
              key={star}
              className={cn(
                iconSize,
                filled ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
              )}
            />
          );
        })}
      </div>
      <span className={cn('font-semibold text-stone-800', textSize)}>
        {rating.toFixed(1)}
      </span>
      {showCount && typeof reviewCount === 'number' && (
        <span className={cn('text-stone-400', textSize)}>({reviewCount})</span>
      )}
    </div>
  );
}
