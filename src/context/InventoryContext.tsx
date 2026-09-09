import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS } from '../data/products';
import { storage } from '../lib/storage';
import type { Product } from '../types';

interface InventoryContextType {
  getStock: (productId: string) => number;
  isAvailable: (productId: string, requestedQuantity?: number) => boolean;
  getStockStatus: (productId: string) => 'in_stock' | 'low_stock' | 'out_of_stock';
  deductStock: (items: { productId: string; quantity: number }[]) => void;
  allProducts: Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  useEffect(() => {
    setOverrides(storage.getInventoryOverrides());
  }, []);

  const getStock = useCallback(
    (productId: string): number => {
      const defaultProd = PRODUCTS.find((p) => p.id === productId);
      if (!defaultProd) return 0;
      const deduction = overrides[productId] || 0;
      // deduction is negative or positive offset from base stock
      const finalStock = defaultProd.stock + deduction;
      return Math.max(0, finalStock);
    },
    [overrides]
  );

  const isAvailable = useCallback(
    (productId: string, requestedQuantity: number = 1): boolean => {
      const current = getStock(productId);
      return current >= requestedQuantity && requestedQuantity > 0;
    },
    [getStock]
  );

  const getStockStatus = useCallback(
    (productId: string): 'in_stock' | 'low_stock' | 'out_of_stock' => {
      const stock = getStock(productId);
      if (stock <= 0) return 'out_of_stock';
      if (stock <= 5) return 'low_stock';
      return 'in_stock';
    },
    [getStock]
  );

  const deductStock = useCallback(
    (items: { productId: string; quantity: number }[]) => {
      storage.deductInventory(items);
      setOverrides(storage.getInventoryOverrides());
    },
    []
  );

  // Compute products with updated stock
  const allProducts = PRODUCTS.map((p) => ({
    ...p,
    stock: getStock(p.id),
  }));

  return (
    <InventoryContext.Provider
      value={{
        getStock,
        isAvailable,
        getStockStatus,
        deductStock,
        allProducts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
