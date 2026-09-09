export const STORAGE_KEYS = {
  CART: 'shop_cart',
  WISHLIST: 'shop_wishlist',
  ORDERS: 'shop_orders',
  PROFILE: 'shop_profile',
  ADDRESSES: 'shop_addresses',
  RECENTLY_VIEWED: 'shop_recently_viewed',
  REVIEWS: 'shop_reviews',
  RECENT_SEARCHES: 'shop_recent_searches',
  INVENTORY_OVERRIDES: 'shop_inventory_overrides',
} as const;

export const TAX_RATE = 0.05; // 5% grocery sales tax
export const FREE_SHIPPING_THRESHOLD = 35.0; // Free shipping over $35
export const STANDARD_SHIPPING_FEE = 4.99;
export const EXPRESS_SHIPPING_FEE = 9.99;

export const MAX_RECENTLY_VIEWED = 10;
export const MAX_RECENT_SEARCHES = 6;
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_ORDER_ITEM_QUANTITY = 20;

export const ORDER_STATUSES = {
  ORDERED: 'ordered',
  CONFIRMED: 'confirmed',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  UPI: 'upi',
} as const;

export const PAYMENT_STATUSES = {
  PAID: 'paid',
  PENDING: 'pending',
  FAILED: 'failed',
} as const;

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured Picks' },
  { value: 'price-low-to-high', label: 'Price: Low to High' },
  { value: 'price-high-to-low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'most-popular', label: 'Most Popular' },
  { value: 'newest', label: 'New Arrivals' },
] as const;
