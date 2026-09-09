import { CATEGORIES } from '../../data/categories';
import { Star, RotateCcw } from 'lucide-react';
import type { ProductFilters } from '../../types';

export interface FilterSidebarProps {
  filters: ProductFilters;
  brands: string[];
  onFilterChange: (updates: Partial<ProductFilters>) => void;
  onReset: () => void;
  className?: string;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function FilterSidebar({
  filters,
  brands,
  onFilterChange,
  onReset,
  className = '',
  isMobile = false,
  onCloseMobile,
}: FilterSidebarProps) {
  const handleCategorySelect = (catSlug: string) => {
    onFilterChange({ category: catSlug === filters.category ? undefined : catSlug, page: 1 });
  };

  const handleBrandToggle = (brand: string) => {
    const current = filters.brands || [];
    const next = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    onFilterChange({ brands: next, page: 1 });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    onFilterChange({ minPrice: min, maxPrice: max, page: 1 });
  };

  const priceRanges = [
    { label: 'All Prices', min: undefined, max: undefined },
    { label: 'Under $5', min: 0, max: 5 },
    { label: '$5 to $10', min: 5, max: 10 },
    { label: '$10 to $20', min: 10, max: 20 },
    { label: '$20 and above', min: 20, max: undefined },
  ];

  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      {/* Header with clear button */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">Filters</h3>
        <button
          type="button"
          id="filter-reset-btn"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-emerald-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset all</span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Categories</h4>
        <div className="flex flex-col space-y-1 max-h-52 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onFilterChange({ category: undefined, page: 1 })}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors text-left ${
              !filters.category
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                id={`filter-cat-${cat.slug}`}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] text-stone-400 font-normal">({cat.itemCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 pt-4 border-t border-stone-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Price</h4>
        <div className="flex flex-col space-y-1">
          {priceRanges.map((range, idx) => {
            const isSelected =
              filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <label
                key={idx}
                className="flex items-center gap-2.5 px-1 py-1 text-xs text-stone-700 hover:text-stone-900 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name="price-range"
                  checked={isSelected}
                  onChange={() => handlePriceChange(range.min, range.max)}
                  className="rounded-full text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 border-stone-300"
                />
                <span>{range.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Customer Rating */}
      <div className="space-y-2.5 pt-4 border-t border-stone-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Customer Rating</h4>
        <div className="flex flex-col space-y-1">
          {[4, 3, 2].map((minRating) => {
            const isSelected = filters.minRating === minRating;
            return (
              <button
                key={minRating}
                type="button"
                id={`filter-rating-${minRating}`}
                onClick={() =>
                  onFilterChange({
                    minRating: isSelected ? undefined : minRating,
                    page: 1,
                  })
                }
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected ? 'bg-emerald-50 text-emerald-800' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < minRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span>{minRating} Stars & Up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-stone-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Brands</h4>
          <div className="flex flex-col space-y-1 max-h-48 overflow-y-auto pr-1">
            {brands.map((brand) => {
              const isChecked = filters.brands?.includes(brand) || false;
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 px-1 py-1 text-xs text-stone-700 hover:text-stone-900 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 border-stone-300"
                  />
                  <span className="truncate">{brand}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Availability & Discount Checkboxes */}
      <div className="space-y-2.5 pt-4 border-t border-stone-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Preferences</h4>
        <label className="flex items-center gap-2.5 px-1 py-1 text-xs text-stone-700 hover:text-stone-900 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked, page: 1 })}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 border-stone-300"
          />
          <span>In Stock Only</span>
        </label>
        <label className="flex items-center gap-2.5 px-1 py-1 text-xs text-stone-700 hover:text-stone-900 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.discountOnly)}
            onChange={(e) => onFilterChange({ discountOnly: e.target.checked, page: 1 })}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 border-stone-300"
          />
          <span>Discounted Specials</span>
        </label>
      </div>

      {isMobile && onCloseMobile && (
        <div className="pt-6">
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full py-3 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
