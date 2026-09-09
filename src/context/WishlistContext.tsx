import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '../lib/storage';
import { useNotification } from './NotificationContext';
import { useInventory } from './InventoryContext';
import type { Product } from '../types';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showToast } = useNotification();
  const { allProducts } = useInventory();

  useEffect(() => {
    const saved = storage.getWishlist();
    setWishlistIds(saved);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      storage.setWishlist(wishlistIds);
    }
  }, [wishlistIds, isInitialized]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(product.id);
        if (exists) {
          showToast({
            type: 'info',
            title: 'Removed from Wishlist',
            message: `${product.name} was removed from your saved items.`,
          });
          return prev.filter((id) => id !== product.id);
        } else {
          showToast({
            type: 'success',
            title: 'Saved to Wishlist',
            message: `${product.name} saved to your wishlist.`,
          });
          return [...prev, product.id];
        }
      });
    },
    [showToast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: 'Item removed from your wishlist.',
      });
    },
    [showToast]
  );

  const wishlistProducts = useMemo(() => {
    return wishlistIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [wishlistIds, allProducts]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
