import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '../lib/storage';
import { computePricingBreakdown, validateCoupon } from '../lib/pricing';
import { MAX_ORDER_ITEM_QUANTITY } from '../constants';
import { useNotification } from './NotificationContext';
import { useInventory } from './InventoryContext';
import type { CartItem, Coupon, DeliveryMethodType, PricingBreakdown, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => boolean;
  clearCart: () => void;
  itemCount: number;
  pricing: PricingBreakdown;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  deliveryMethod: DeliveryMethodType;
  setDeliveryMethod: (method: DeliveryMethodType) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodType>('standard');
  const [isInitialized, setIsInitialized] = useState(false);

  const { showToast } = useNotification();
  const { getStock } = useInventory();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = storage.getCart();
    // Validate stored items with latest product info and stock
    const sanitized = saved.filter((item) => item.product && item.productId && item.quantity > 0);
    setItems(sanitized);
    setIsInitialized(true);
  }, []);

  // Save to localStorage when items change (after initial load)
  useEffect(() => {
    if (isInitialized) {
      storage.setCart(items);
    }
  }, [items, isInitialized]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const pricing = useMemo(() => {
    return computePricingBreakdown(items, appliedCoupon, deliveryMethod);
  }, [items, appliedCoupon, deliveryMethod]);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1): boolean => {
      if (!product || !product.id) return false;

      const availableStock = getStock(product.id);
      if (availableStock <= 0) {
        showToast({
          type: 'error',
          title: 'Out of Stock',
          message: `${product.name} is currently out of stock.`,
        });
        return false;
      }

      let succeeded = false;

      setItems((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        const currentQty = existing ? existing.quantity : 0;
        const requestedTotal = currentQty + quantity;

        if (requestedTotal > availableStock) {
          showToast({
            type: 'warning',
            title: 'Limited Stock Available',
            message: `Only ${availableStock} units of ${product.name} available.`,
          });
          return prev;
        }

        if (requestedTotal > MAX_ORDER_ITEM_QUANTITY) {
          showToast({
            type: 'warning',
            title: 'Quantity Limit Exceeded',
            message: `Maximum purchase limit is ${MAX_ORDER_ITEM_QUANTITY} units per item.`,
          });
          return prev;
        }

        succeeded = true;
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id ? { ...item, quantity: requestedTotal } : item
          );
        } else {
          return [...prev, { productId: product.id, product, quantity }];
        }
      });

      if (succeeded) {
        showToast({
          type: 'success',
          title: 'Added to Cart',
          message: `${product.name} (${quantity}) added to your basket.`,
        });
      }

      return succeeded;
    },
    [getStock, showToast]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const itemToRemove = prev.find((i) => i.productId === productId);
        if (itemToRemove) {
          showToast({
            type: 'info',
            title: 'Item Removed',
            message: `${itemToRemove.product.name} was removed from your cart.`,
          });
        }
        return prev.filter((item) => item.productId !== productId);
      });
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number): boolean => {
      const availableStock = getStock(productId);

      if (newQuantity <= 0) {
        removeFromCart(productId);
        return true;
      }

      if (newQuantity > availableStock) {
        showToast({
          type: 'warning',
          title: 'Exceeds Available Stock',
          message: `Only ${availableStock} available in inventory.`,
        });
        return false;
      }

      if (newQuantity > MAX_ORDER_ITEM_QUANTITY) {
        showToast({
          type: 'warning',
          title: 'Purchase Limit',
          message: `Maximum allowed per item is ${MAX_ORDER_ITEM_QUANTITY}.`,
        });
        return false;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: Math.floor(newQuantity) } : item
        )
      );
      return true;
    },
    [getStock, removeFromCart, showToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const applyCoupon = useCallback(
    (code: string): { success: boolean; message: string } => {
      const currentSubtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
      const result = validateCoupon(code, currentSubtotal);

      if (!result.isValid || !result.coupon) {
        showToast({
          type: 'error',
          title: 'Invalid Coupon',
          message: result.errorMessage || 'This promo code could not be applied.',
        });
        return { success: false, message: result.errorMessage || 'Invalid coupon code.' };
      }

      setAppliedCoupon(result.coupon);
      showToast({
        type: 'success',
        title: 'Coupon Applied!',
        message: `${result.coupon.code}: ${result.coupon.description}`,
      });
      return { success: true, message: `Coupon ${result.coupon.code} applied successfully!` };
    },
    [items, showToast]
  );

  const removeCoupon = useCallback(() => {
    if (appliedCoupon) {
      const code = appliedCoupon.code;
      setAppliedCoupon(null);
      showToast({
        type: 'info',
        title: 'Coupon Removed',
        message: `Promo code ${code} has been removed.`,
      });
    }
  }, [appliedCoupon, showToast]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        pricing,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        deliveryMethod,
        setDeliveryMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
