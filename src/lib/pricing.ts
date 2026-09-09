import {
  TAX_RATE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  EXPRESS_SHIPPING_FEE,
} from '../constants';
import { COUPONS } from '../data/coupons';
import type { CartItem, Coupon, DeliveryMethodType, PricingBreakdown } from '../types';

export function calculateSubtotal(items: CartItem[]): number {
  const sum = items.reduce((acc, item) => {
    const unitPrice = Number(item.product.price) || 0;
    const qty = Math.max(0, Math.floor(Number(item.quantity) || 0));
    return acc + unitPrice * qty;
  }, 0);
  return Math.round(sum * 100) / 100;
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  errorMessage?: string;
}

export function validateCoupon(
  code: string,
  subtotal: number,
  couponsList: Coupon[] = COUPONS
): CouponValidationResult {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { isValid: false, errorMessage: 'Please enter a coupon code.' };
  }

  const found = couponsList.find((c) => c.code.toUpperCase() === normalized);
  if (!found) {
    return { isValid: false, errorMessage: `Coupon code "${normalized}" is not recognized.` };
  }

  if (!found.isActive) {
    return { isValid: false, errorMessage: `Coupon "${normalized}" is no longer active.` };
  }

  // Expiration check
  if (found.expiresAt) {
    const expiry = new Date(found.expiresAt).getTime();
    if (Date.now() > expiry) {
      return { isValid: false, errorMessage: `Coupon "${normalized}" has expired.` };
    }
  }

  // Minimum cart subtotal check
  if (subtotal < found.minimumOrderValue) {
    return {
      isValid: false,
      coupon: found,
      errorMessage: `Requires a minimum order of $${found.minimumOrderValue.toFixed(2)} (current subtotal: $${subtotal.toFixed(2)}).`,
    };
  }

  return { isValid: true, coupon: found };
}

export function calculateDiscount(subtotal: number, coupon?: Coupon | null): number {
  if (!coupon || subtotal <= 0) return 0;
  if (subtotal < coupon.minimumOrderValue) return 0;

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }
  } else if (coupon.discountType === 'fixed') {
    discount = Math.min(coupon.discountValue, subtotal);
  } else if (coupon.discountType === 'free_shipping') {
    discount = 0; // Handled in shipping calculation
  }

  return Math.round(discount * 100) / 100;
}

export function calculateShipping(
  subtotal: number,
  deliveryMethod: DeliveryMethodType = 'standard',
  coupon?: Coupon | null
): number {
  if (subtotal <= 0) return 0;

  // Coupon with free shipping
  if (coupon?.discountType === 'free_shipping' && subtotal >= coupon.minimumOrderValue) {
    return deliveryMethod === 'express' ? Math.max(0, EXPRESS_SHIPPING_FEE - STANDARD_SHIPPING_FEE) : 0;
  }

  // Threshold free shipping
  const isFreeStandard = subtotal >= FREE_SHIPPING_THRESHOLD;

  if (deliveryMethod === 'express') {
    return isFreeStandard ? Math.max(0, EXPRESS_SHIPPING_FEE - STANDARD_SHIPPING_FEE) : EXPRESS_SHIPPING_FEE;
  }

  return isFreeStandard ? 0 : STANDARD_SHIPPING_FEE;
}

export function calculateTax(taxableAmount: number): number {
  const base = Math.max(0, taxableAmount);
  return Math.round(base * TAX_RATE * 100) / 100;
}

export function calculateGrandTotal(
  subtotal: number,
  discount: number,
  shipping: number,
  tax: number
): number {
  const total = Math.max(0, subtotal - discount) + shipping + tax;
  return Math.round(total * 100) / 100;
}

export function computePricingBreakdown(
  items: CartItem[],
  coupon?: Coupon | null,
  deliveryMethod: DeliveryMethodType = 'standard'
): PricingBreakdown {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, coupon);
  const shipping = calculateShipping(subtotal, deliveryMethod, coupon);
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = calculateTax(taxableAmount);
  const grandTotal = calculateGrandTotal(subtotal, discount, shipping, tax);

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || (coupon?.discountType === 'free_shipping' && subtotal >= coupon.minimumOrderValue);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    subtotal,
    discount,
    shipping,
    tax,
    grandTotal,
    couponApplied: coupon || null,
    qualifiesForFreeShipping,
    amountNeededForFreeShipping: Math.round(amountNeededForFreeShipping * 100) / 100,
  };
}
