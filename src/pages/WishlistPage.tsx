import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import { formatCurrency } from '../lib/utils';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function WishlistPage() {
  const { wishlistProducts, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { getStockStatus } = useInventory();

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="py-6 space-y-4">
        <Breadcrumbs items={[{ label: 'Saved Wishlist' }]} />
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any organic products to your wishlist yet. Tap the heart on any product to save it for later!"
          actionLabel="Explore Organic Harvest"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Saved Wishlist' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Saved Wishlist</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {wishlistProducts.length} items saved for upcoming deliveries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistProducts.map((product) => {
          const stockStatus = getStockStatus(product.id);
          const isOutOfStock = stockStatus === 'out_of_stock';

          return (
            <div
              key={product.id}
              className="p-4 rounded-2xl border border-stone-200/80 bg-white hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3">
                  <Link to={`/products/${product.slug}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white/90 text-stone-400 hover:text-rose-600 shadow-xs transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px] flex items-center justify-center p-2">
                      <Badge variant="danger" size="sm">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  {product.brand}
                </span>

                <Link to={`/products/${product.slug}`}>
                  <h3 className="text-sm font-bold text-stone-900 hover:text-emerald-700 transition-colors line-clamp-2 mt-0.5">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-base font-extrabold text-stone-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-stone-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isOutOfStock}
                  onClick={() => handleMoveToCart(product)}
                  className="w-full"
                >
                  <ShoppingBag className="w-4 h-4 mr-1.5" />
                  <span>Move to Basket</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
