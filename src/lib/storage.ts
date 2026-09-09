import { STORAGE_KEYS } from '../constants';
import type { CartItem, Order, Address, UserProfile, Review } from '../types';

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[storage] Failed parsing localStorage key "${key}", using default.`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[storage] Failed setting localStorage key "${key}".`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`[storage] Failed removing localStorage key "${key}".`, error);
  }
}

// Storage helpers for specific domains

export const storage = {
  getCart(): CartItem[] {
    return getStorageItem<CartItem[]>(STORAGE_KEYS.CART, []);
  },
  setCart(cart: CartItem[]): void {
    setStorageItem(STORAGE_KEYS.CART, cart);
  },

  getWishlist(): string[] {
    return getStorageItem<string[]>(STORAGE_KEYS.WISHLIST, []);
  },
  setWishlist(productIds: string[]): void {
    setStorageItem(STORAGE_KEYS.WISHLIST, productIds);
  },

  getOrders(): Order[] {
    return getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  },
  saveOrder(order: Order): Order[] {
    const orders = getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, []);
    const updated = [order, ...orders];
    setStorageItem(STORAGE_KEYS.ORDERS, updated);
    return updated;
  },

  getRecentlyViewed(): string[] {
    return getStorageItem<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
  },
  addRecentlyViewed(productId: string, maxItems: number = 10): string[] {
    const list = getStorageItem<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
    const filtered = list.filter((id) => id !== productId);
    const updated = [productId, ...filtered].slice(0, maxItems);
    setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, updated);
    return updated;
  },

  getProfile(): UserProfile {
    return getStorageItem<UserProfile>(STORAGE_KEYS.PROFILE, {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'sarah.jenkins@example.com',
      phone: '+1 (555) 234-8901',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    });
  },
  setProfile(profile: UserProfile): void {
    setStorageItem(STORAGE_KEYS.PROFILE, profile);
  },

  getAddresses(): Address[] {
    return getStorageItem<Address[]>(STORAGE_KEYS.ADDRESSES, [
      {
        id: 'addr-default-1',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        addressLine1: '742 Evergreen Terrace',
        apartment: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62704',
        country: 'United States',
        phone: '+1 (555) 234-8901',
        isDefault: true,
      },
      {
        id: 'addr-work-2',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        addressLine1: '100 North Michigan Ave',
        apartment: 'Suite 1200',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'United States',
        phone: '+1 (555) 234-8901',
        isDefault: false,
      },
    ]);
  },
  setAddresses(addresses: Address[]): void {
    setStorageItem(STORAGE_KEYS.ADDRESSES, addresses);
  },

  getRecentSearches(): string[] {
    return getStorageItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES, [
      'Organic Avocados',
      'Almond Milk',
      'Sourdough Bread',
    ]);
  },
  addRecentSearch(query: string, maxItems: number = 6): string[] {
    const trimmed = query.trim();
    if (!trimmed) return getStorageItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES, []);
    const list = getStorageItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES, []);
    const filtered = list.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, maxItems);
    setStorageItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
    return updated;
  },
  clearRecentSearches(): void {
    setStorageItem(STORAGE_KEYS.RECENT_SEARCHES, []);
  },

  getUserReviews(): Review[] {
    return getStorageItem<Review[]>(STORAGE_KEYS.REVIEWS, []);
  },
  addUserReview(review: Review): Review[] {
    const list = getStorageItem<Review[]>(STORAGE_KEYS.REVIEWS, []);
    const updated = [review, ...list];
    setStorageItem(STORAGE_KEYS.REVIEWS, updated);
    return updated;
  },

  getInventoryOverrides(): Record<string, number> {
    return getStorageItem<Record<string, number>>(STORAGE_KEYS.INVENTORY_OVERRIDES, {});
  },
  deductInventory(items: { productId: string; quantity: number }[]): void {
    const overrides = getStorageItem<Record<string, number>>(STORAGE_KEYS.INVENTORY_OVERRIDES, {});
    for (const item of items) {
      const current = overrides[item.productId];
      // Note: inventory context uses this together with product default stock
      overrides[item.productId] = (current !== undefined ? current : 0) - item.quantity;
    }
    setStorageItem(STORAGE_KEYS.INVENTORY_OVERRIDES, overrides);
  },
};
