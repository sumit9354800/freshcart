import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { QuantitySelector } from '../product/QuantitySelector';
import { formatCurrency } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { useInventory } from '../../context/InventoryContext';
import type { CartItem } from '../../types';

export interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { getStock } = useInventory();
  const maxStock = getStock(item.productId);

  const total = Math.round(item.product.price * item.quantity * 100) / 100;

  return (
    <div
      id={`cart-item-${item.productId}`}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-stone-200/80 last:border-b-0"
    >
      <div className="flex items-center gap-4 min-w-0">
        <Link
          to={`/products/${item.product.slug}`}
          className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60"
        >
          <img
            src={item.product.image}
            alt={item.product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            {item.product.brand}
          </span>
          <Link
            to={`/products/${item.product.slug}`}
            className="block text-sm font-bold text-stone-900 hover:text-emerald-700 transition-colors truncate"
          >
            {item.product.name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-stone-700">
              {formatCurrency(item.product.price)}
            </span>
            {item.product.unit && (
              <span className="text-[11px] text-stone-400">/{item.product.unit}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 pt-2 sm:pt-0">
        <QuantitySelector
          quantity={item.quantity}
          maxStock={maxStock}
          onChange={(newQty) => updateQuantity(item.productId, newQty)}
          size="sm"
        />

        <div className="text-right min-w-[70px]">
          <span className="text-sm font-bold text-stone-900">{formatCurrency(total)}</span>
        </div>

        <button
          type="button"
          id={`cart-remove-${item.productId}`}
          onClick={() => removeFromCart(item.productId)}
          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Remove from cart"
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
