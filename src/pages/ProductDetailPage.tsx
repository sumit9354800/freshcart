import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, ShieldCheck, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '../lib/products';
import { formatCurrency } from '../lib/utils';
import { useInventory } from '../context/InventoryContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useCart } from '../context/CartContext';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductRating } from '../components/product/ProductRating';
import { QuantitySelector } from '../components/product/QuantitySelector';
import { WishlistButton } from '../components/product/WishlistButton';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { allProducts, getStock, getStockStatus } = useInventory();
  const { trackProductView } = useRecentlyViewed();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  const product = slug ? getProductBySlug(slug, allProducts) : undefined;

  useEffect(() => {
    if (product) {
      trackProductView(product.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, trackProductView]);

  if (!product) {
    return (
      <div className="py-12">
        <EmptyState
          icon={AlertTriangle}
          title="Product Not Found"
          description="The grocery item you requested could not be located in our inventory."
          actionLabel="Browse All Products"
          actionHref="/products"
        />
      </div>
    );
  }

  const stock = getStock(product.id);
  const stockStatus = getStockStatus(product.id);
  const isOutOfStock = stockStatus === 'out_of_stock';
  const isLowStock = stockStatus === 'low_stock';

  const relatedProducts = getRelatedProducts(product, allProducts, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          { label: product.category, href: `/products?category=${encodeURIComponent(product.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'))}` },
          { label: product.name },
        ]}
      />

      {/* Main Product Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Details Column */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                {product.brand}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500 font-medium">{product.category}</span>
              {product.bestseller && (
                <Badge variant="secondary" size="sm">
                  Bestseller
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <ProductRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="md"
              />
              <span className="text-xs text-emerald-700 font-semibold underline underline-offset-2">
                {product.reviewCount} customer ratings
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-baseline justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <Badge variant="danger" size="sm">
                    Save {product.discountPercentage}%
                  </Badge>
                )}
              </div>
              {product.unit && (
                <p className="text-xs text-stone-500 mt-0.5">
                  Package format: <strong>{product.unit}</strong>
                </p>
              )}
            </div>

            {/* Inventory Status Pill */}
            <div>
              {isOutOfStock ? (
                <Badge variant="danger" size="md">
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge variant="warning" size="md">
                  Only {stock} Left
                </Badge>
              ) : (
                <Badge variant="success" size="md">
                  In Stock ({stock} available)
                </Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Add to Cart Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center gap-4">
              {!isOutOfStock && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">Quantity:</span>
                  <QuantitySelector
                    quantity={quantity}
                    maxStock={stock}
                    onChange={setQuantity}
                    size="md"
                  />
                </div>
              )}

              <Button
                variant={isOutOfStock ? 'outline' : 'primary'}
                size="lg"
                id="pdp-add-to-cart-btn"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 shadow-md shadow-emerald-700/15"
              >
                {isOutOfStock ? 'Currently Unavailable' : `Add ${quantity} to Basket`}
              </Button>
            </div>

            <div>
              <WishlistButton product={product} variant="badge" className="w-full justify-center" />
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200 text-stone-600 text-[11px]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Chilled courier delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Certified organic crop</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% freshness guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Origin Accordion/Table */}
      <div className="p-6 rounded-2xl border border-stone-200/80 bg-white space-y-4">
        <h3 className="text-base font-bold text-stone-900">Product Specifications & Farming Integrity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500 font-medium">Origin</span>
            <span className="text-stone-900 font-semibold">{product.specifications.origin}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500 font-medium">Organic Certification</span>
            <span className="text-stone-900 font-semibold">
              {product.specifications.organicCertification}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500 font-medium">Storage Advice</span>
            <span className="text-stone-900 font-semibold">{product.specifications.storage}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500 font-medium">Peak Shelf Life</span>
            <span className="text-stone-900 font-semibold">{product.specifications.shelfLife}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100 sm:col-span-2">
            <span className="text-stone-500 font-medium">Allergen Information</span>
            <span className="text-stone-900 font-semibold">{product.specifications.allergens}</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewsSection product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">You Might Also Enjoy</h2>
            <Link
              to={`/products?category=${encodeURIComponent(product.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'))}`}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              More in {product.category} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Back button */}
      <div className="pt-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to catalog</span>
        </Link>
      </div>
    </div>
  );
}
