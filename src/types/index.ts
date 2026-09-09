export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  tags: string[];
  featured: boolean;
  bestseller: boolean;
  specifications: Record<string, string>;
  unit?: string;
  nutritionInfo?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
    shelfLife?: string;
  };
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  iconName: string;
  itemCount: number;
  featured?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount?: number;
  expiresAt: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export type DeliveryMethodType = 'standard' | 'express';

export interface DeliveryMethod {
  id?: DeliveryMethodType;
  type?: DeliveryMethodType;
  name: string;
  estimatedDelivery: string;
  price?: number;
  cost?: number;
}

export type PaymentMethodType = 'cod' | 'card' | 'upi';
export type PaymentType = PaymentMethodType;

export interface PaymentMethod {
  type: PaymentMethodType;
  cardLast4?: string;
  brand?: string;
  upiId?: string;
  details?: {
    cardNumber?: string;
    cardHolder?: string;
    expiry?: string;
    upiId?: string;
  };
}

export type PaymentStatus = 'paid' | 'pending' | 'failed';

export type OrderStatus =
  | 'ordered'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
  unit?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  customer: Customer;
  shippingAddress: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCodeApplied?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface PricingBreakdown {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  couponApplied?: Coupon | null;
  qualifiesForFreeShipping: boolean;
  amountNeededForFreeShipping: number;
}

export type SortOption =
  | 'featured'
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'rating'
  | 'most-popular'
  | 'newest';

export interface ProductFilters {
  searchQuery?: string;
  category?: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  discountOnly?: boolean;
  sort: SortOption;
  page: number;
  limit: number;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}
