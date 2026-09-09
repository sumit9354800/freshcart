import { Link } from 'react-router-dom';
import { ProductRating } from './ProductRating';
import { WishlistButton } from './WishlistButton';
import { AddToCartButton } from './AddToCartButton';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../lib/utils';
import { useInventory } from '../../context/InventoryContext';
import type { Product } from '../../types';

export interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { getStockStatus, getStock } = useInventory();
  const stock = getStock(product.id);
  const stockStatus = getStockStatus(product.id);

  const isOutOfStock = stockStatus === 'out_of_stock';
  const isLowStock = stockStatus === 'low_stock';

  if (viewMode === 'list') {
    return (
      <div
        id={`product-card-${product.id}`}
        className="group flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-stone-300 hover:shadow-md transition-all duration-200"
      >
        <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-stone-100 shrink-0">
          <Link to={`/products/${product.slug}`} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>
          <div className="absolute top-2.5 right-2.5 z-10">
            <WishlistButton product={product} size="sm" />
          </div>
          {product.discountPercentage && product.discountPercentage > 0 && !isOutOfStock && (
            <div className="absolute top-2.5 left-2.5">
              <Badge variant="danger" size="sm">
                -{product.discountPercentage}%
              </Badge>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {product.brand}
              </span>
              {product.bestseller && (
                <Badge variant="secondary" size="sm">
                  Bestseller
                </Badge>
              )}
              {isOutOfStock ? (
                <Badge variant="danger" size="sm">
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge variant="warning" size="sm">
                  Only {stock} left
                </Badge>
              ) : null}
            </div>

            <Link to={`/products/${product.slug}`} className="block group-hover:text-emerald-700 transition-colors">
              <h3 className="text-base font-bold text-stone-900 leading-snug truncate">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="mt-2.5">
              <ProductRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold text-stone-900">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.unit && (
                <span className="text-[11px] text-stone-400 font-medium">/{product.unit}</span>
              )}
            </div>
            <AddToCartButton product={product} size="sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`product-card-${product.id}`}
      className="group flex flex-col rounded-2xl border border-stone-200/80 bg-white hover:border-stone-300 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercentage && product.discountPercentage > 0 && !isOutOfStock && (
            <Badge variant="danger" size="sm">
              -{product.discountPercentage}%
            </Badge>
          )}
          {product.bestseller && (
            <Badge variant="secondary" size="sm">
              Bestseller
            </Badge>
          )}
        </div>

        {/* Wishlist Quick Action */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton product={product} size="sm" />
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center p-2">
            <span className="bg-white/95 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-emerald-700 truncate">
              {product.brand}
            </span>
            {isLowStock && !isOutOfStock && (
              <span className="text-amber-700 font-semibold">{stock} left</span>
            )}
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="block group-hover:text-emerald-700 transition-colors"
          >
            <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          <div className="mt-1.5">
            <ProductRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          </div>
        </div>

        <div className="flex items-end justify-between mt-3 pt-3 border-t border-stone-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-stone-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.unit && (
              <span className="text-[11px] text-stone-400 font-medium">/{product.unit}</span>
            )}
          </div>

          <AddToCartButton product={product} size="sm" showText={false} className="p-2" />
        </div>
      </div>
    </div>
  );
}
