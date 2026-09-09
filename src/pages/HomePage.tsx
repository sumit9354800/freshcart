import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Award, Clock } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/product/ProductCard';
import { useInventory } from '../context/InventoryContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { Button } from '../components/common/Button';

export function HomePage() {
  const { allProducts } = useInventory();
  const { recentlyViewedProducts } = useRecentlyViewed();

  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 8);
  const discountProducts = allProducts
    .filter((p) => (p.discountPercentage ?? 0) > 0)
    .slice(0, 4);
  const bestSellers = allProducts.filter((p) => p.bestseller).slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* Editorial Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-emerald-950 text-white shadow-xl">
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80"
            alt="Organic harvest background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 lg:py-24 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Farm-to-Door Every Morning</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Whole Foods, Sourced From Honest Earth.
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-8 max-w-lg">
            Fresh heirloom produce, artisanal slow-fermented breads, and pasture-raised dairy.
            Zero pesticides, cold-chain delivered within hours of harvest.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/products">
              <Button variant="primary" size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold border-none">
                <span>Explore the Harvest</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/products?discountOnly=true">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs"
              >
                <span>View Weekly Specials</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Explorer Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Explore by Category</h2>
            <p className="text-xs text-stone-500 mt-0.5">Freshly stocked daily across all departments</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group flex flex-col p-3 rounded-2xl border border-stone-200/80 bg-white hover:border-emerald-600/50 hover:shadow-md transition-all duration-200"
            >
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-100 mb-2.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition-colors truncate">
                {cat.name}
              </span>
              <span className="text-[11px] text-stone-400">{cat.itemCount} items</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Award className="w-4 h-4" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-0.5">Featured Produce & Goods</h2>
          </div>
          <Link
            to="/products?sort=featured"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Weekly Specials / Discount Highlight Banner */}
      <section className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-500 text-white">
              Limited Time Deals
            </span>
            <h3 className="text-xl font-extrabold text-stone-900 mt-2">
              Save Up to 25% On Seasonal Picks
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Hand-harvested crops in peak surplus. Exceptional sweetness, reduced price.
            </p>
          </div>
          <Link to="/products?discountOnly=true">
            <Button variant="secondary" size="md">
              <span>Shop All Specials</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {discountProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Bestsellers Row */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <TrendingUp className="w-4 h-4" />
              <span>Community Favorites</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-0.5">Most Loved This Week</h2>
          </div>
          <Link
            to="/products?sort=most-popular"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>See Ranking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recently Viewed Products (if any) */}
      {recentlyViewedProducts.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-stone-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-400" />
              <h2 className="text-lg font-bold text-stone-900">Recently Viewed</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {recentlyViewedProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
