import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, LayoutGrid, List, X, Search } from 'lucide-react';
import { filterAndSortProducts } from '../lib/products';
import { useInventory } from '../context/InventoryContext';
import { ProductGrid } from '../components/product/ProductGrid';
import { FilterSidebar } from '../components/product/FilterSidebar';
import { SortDropdown } from '../components/product/SortDropdown';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Modal } from '../components/common/Modal';
import { CATEGORIES } from '../data/categories';
import type { ProductFilters, SortOption } from '../types';

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { allProducts } = useInventory();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Parse filters from URL
  const filters: ProductFilters = useMemo(() => {
    const brandsParam = searchParams.get('brands');
    return {
      searchQuery: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      brands: brandsParam ? brandsParam.split(',') : undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
      inStockOnly: searchParams.get('inStockOnly') === 'true',
      discountOnly: searchParams.get('discountOnly') === 'true',
      sort: (searchParams.get('sort') as SortOption) || 'featured',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: 12,
    };
  }, [searchParams]);

  // Sync state to URL params
  const updateFilters = (updates: Partial<ProductFilters>) => {
    const next = { ...filters, ...updates };
    const params = new URLSearchParams();

    if (next.searchQuery) params.set('q', next.searchQuery);
    if (next.category && next.category !== 'all') params.set('category', next.category);
    if (next.brands && next.brands.length > 0) params.set('brands', next.brands.join(','));
    if (typeof next.minPrice === 'number') params.set('minPrice', String(next.minPrice));
    if (typeof next.maxPrice === 'number') params.set('maxPrice', String(next.maxPrice));
    if (typeof next.minRating === 'number') params.set('minRating', String(next.minRating));
    if (next.inStockOnly) params.set('inStockOnly', 'true');
    if (next.discountOnly) params.set('discountOnly', 'true');
    if (next.sort && next.sort !== 'featured') params.set('sort', next.sort);
    if (next.page && next.page > 1) params.set('page', String(next.page));

    setSearchParams(params);
  };

  const resetAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const { items, totalCount, totalPages, brandsList } = useMemo(() => {
    return filterAndSortProducts(allProducts, filters);
  }, [allProducts, filters]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters.page]);

  // Active filter count calculation
  const activeFiltersList: { label: string; onRemove: () => void }[] = [];
  if (filters.searchQuery) {
    activeFiltersList.push({
      label: `Search: "${filters.searchQuery}"`,
      onRemove: () => updateFilters({ searchQuery: undefined, page: 1 }),
    });
  }
  if (filters.category) {
    const catName = CATEGORIES.find((c) => c.slug === filters.category)?.name || filters.category;
    activeFiltersList.push({
      label: `Category: ${catName}`,
      onRemove: () => updateFilters({ category: undefined, page: 1 }),
    });
  }
  if (filters.brands && filters.brands.length > 0) {
    filters.brands.forEach((brand) => {
      activeFiltersList.push({
        label: `Brand: ${brand}`,
        onRemove: () =>
          updateFilters({
            brands: filters.brands?.filter((b) => b !== brand),
            page: 1,
          }),
      });
    });
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    activeFiltersList.push({
      label: `Price: ${filters.minPrice || 0} - ${filters.maxPrice || 'Any'}`,
      onRemove: () => updateFilters({ minPrice: undefined, maxPrice: undefined, page: 1 }),
    });
  }
  if (filters.minRating) {
    activeFiltersList.push({
      label: `${filters.minRating}★ & Above`,
      onRemove: () => updateFilters({ minRating: undefined, page: 1 }),
    });
  }
  if (filters.inStockOnly) {
    activeFiltersList.push({
      label: 'In Stock Only',
      onRemove: () => updateFilters({ inStockOnly: false, page: 1 }),
    });
  }
  if (filters.discountOnly) {
    activeFiltersList.push({
      label: 'Discounted Specials',
      onRemove: () => updateFilters({ discountOnly: false, page: 1 }),
    });
  }

  const categoryTitle = filters.category
    ? CATEGORIES.find((c) => c.slug === filters.category)?.name || 'Products'
    : filters.searchQuery
    ? `Search Results for "${filters.searchQuery}"`
    : 'All Products';

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Catalog', href: '/products' }, { label: categoryTitle }]} />

      {/* Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            {categoryTitle}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing {totalCount} {totalCount === 1 ? 'item' : 'items'} available
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Mobile Filter Trigger */}
          <button
            type="button"
            id="mobile-filter-open-btn"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({activeFiltersList.length})</span>
          </button>

          {/* Sort Dropdown */}
          <SortDropdown
            value={filters.sort || 'featured'}
            onChange={(val) => updateFilters({ sort: val, page: 1 })}
          />

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border border-stone-200 rounded-xl p-0.5 bg-stone-100">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-400 hover:text-stone-700'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-400 hover:text-stone-700'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFiltersList.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs font-semibold text-stone-400 mr-1">Active filters:</span>
          {activeFiltersList.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              <span>{f.label}</span>
              <button
                type="button"
                onClick={f.onRemove}
                className="hover:text-rose-600 transition-colors"
                aria-label={`Remove filter ${f.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={resetAllFilters}
            className="text-xs font-semibold text-stone-500 hover:text-stone-900 underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-2">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border border-stone-200/80 bg-white p-5">
            <FilterSidebar
              filters={filters}
              brands={brandsList}
              onFilterChange={updateFilters}
              onReset={resetAllFilters}
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {items.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No Products Match Your Criteria"
              description="We couldn't find any groceries matching your chosen filters and search terms. Try loosening your price or rating filters."
              actionLabel="Reset Filters"
              onAction={resetAllFilters}
            />
          ) : (
            <>
              <ProductGrid products={items} viewMode={viewMode} />
              <Pagination
                currentPage={filters.page || 1}
                totalPages={totalPages}
                onPageChange={(p) => updateFilters({ page: p })}
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      <Modal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter Groceries"
        maxWidth="md"
        id="mobile-filters-modal"
      >
        <FilterSidebar
          filters={filters}
          brands={brandsList}
          onFilterChange={updateFilters}
          onReset={resetAllFilters}
          isMobile={true}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />
      </Modal>
    </div>
  );
}
