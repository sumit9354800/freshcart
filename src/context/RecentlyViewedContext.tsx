import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '../lib/storage';
import { useInventory } from './InventoryContext';
import { MAX_RECENTLY_VIEWED } from '../constants';
import type { Product } from '../types';

interface RecentlyViewedContextType {
  recentlyViewedIds: string[];
  recentlyViewedProducts: Product[];
  trackProductView: (productId: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const { allProducts } = useInventory();

  useEffect(() => {
    setRecentlyViewedIds(storage.getRecentlyViewed());
  }, []);

  const trackProductView = useCallback((productId: string) => {
    if (!productId) return;
    const updated = storage.addRecentlyViewed(productId, MAX_RECENTLY_VIEWED);
    setRecentlyViewedIds(updated);
  }, []);

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [recentlyViewedIds, allProducts]);

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewedIds,
        recentlyViewedProducts,
        trackProductView,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
