import { PRODUCTS } from '../data/products';
import type { Product, ProductFilters, SortOption } from '../types';

export function getProductBySlug(slug: string, products: Product[] = PRODUCTS): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string, products: Product[] = PRODUCTS): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(
  currentProduct: Product,
  allProducts: Product[] = PRODUCTS,
  limit: number = 4
): Product[] {
  return allProducts
    .filter((p) => p.id !== currentProduct.id)
    .sort((a, b) => {
      // Prioritize same category, then shared tags
      const aSameCat = a.category === currentProduct.category ? 2 : 0;
      const bSameCat = b.category === currentProduct.category ? 2 : 0;

      const aSharedTags = a.tags.filter((t) => currentProduct.tags.includes(t)).length;
      const bSharedTags = b.tags.filter((t) => currentProduct.tags.includes(t)).length;

      return bSameCat + bSharedTags - (aSameCat + aSharedTags);
    })
    .slice(0, limit);
}

export function filterAndSortProducts(
  products: Product[] = PRODUCTS,
  filters: Partial<ProductFilters> = {}
): { items: Product[]; totalCount: number; totalPages: number; brandsList: string[] } {
  // Extract all unique brands for filter options
  const allBrands = Array.from(new Set(products.map((p) => p.brand))).sort();

  let filtered = [...products];

  // 1. Search Query
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchBrand || matchCat || matchTag;
    });
  }

  // 2. Category Filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  // 3. Brand Filter
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter((p) => filters.brands?.includes(p.brand));
  }

  // 4. Price Filter
  if (typeof filters.minPrice === 'number') {
    filtered = filtered.filter((p) => p.price >= (filters.minPrice ?? 0));
  }
  if (typeof filters.maxPrice === 'number' && filters.maxPrice > 0) {
    filtered = filtered.filter((p) => p.price <= (filters.maxPrice ?? Infinity));
  }

  // 5. Rating Filter
  if (typeof filters.minRating === 'number' && filters.minRating > 0) {
    filtered = filtered.filter((p) => p.rating >= (filters.minRating ?? 0));
  }

  // 6. In Stock Only
  if (filters.inStockOnly) {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  // 7. Discount Only
  if (filters.discountOnly) {
    filtered = filtered.filter((p) => (p.discountPercentage ?? 0) > 0);
  }

  // 8. Sorting
  const sort = filters.sort || 'featured';
  filtered.sort((a, b) => {
    switch (sort) {
      case 'price-low-to-high':
        return a.price - b.price;
      case 'price-high-to-low':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'most-popular':
        return b.reviewCount - a.reviewCount;
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'featured':
      default:
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
    }
  });

  const totalCount = filtered.length;
  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 12);
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const startIndex = (page - 1) * limit;
  const items = filtered.slice(startIndex, startIndex + limit);

  return {
    items,
    totalCount,
    totalPages,
    brandsList: allBrands,
  };
}

export function searchSuggestions(
  query: string,
  products: Product[] = PRODUCTS,
  limit: number = 5
): Product[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
    .slice(0, limit);
}
