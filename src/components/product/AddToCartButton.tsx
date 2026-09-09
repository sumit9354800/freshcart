import React from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useInventory } from '../../context/InventoryContext';
import { Button } from '../common/Button';
import type { Product } from '../../types';

export interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function AddToCartButton({
  product,
  quantity = 1,
  size = 'md',
  showText = true,
  className,
  variant = 'primary',
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { getStockStatus } = useInventory();
  const [justAdded, setJustAdded] = React.useState(false);

  const stockStatus = getStockStatus(product.id);
  const isOutOfStock = stockStatus === 'out_of_stock';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const added = addToCart(product, quantity);
    if (added) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  return (
    <Button
      type="button"
      id={`add-to-cart-${product.id}`}
      variant={isOutOfStock ? 'outline' : variant}
      size={size}
      onClick={handleClick}
      disabled={isOutOfStock}
      className={className}
      aria-label={isOutOfStock ? 'Out of stock' : `Add ${product.name} to cart`}
    >
      {justAdded ? (
        <>
          <Check className="w-4 h-4 text-white shrink-0" />
          {showText && <span>Added</span>}
        </>
      ) : isOutOfStock ? (
        <span>Out of Stock</span>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 shrink-0" />
          {showText && <span>Add to Cart</span>}
        </>
      )}
    </Button>
  );
}
