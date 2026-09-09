import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../common/Button';

export interface CartSummaryCardProps {
  showCheckoutButton?: boolean;
}

export function CartSummaryCard({ showCheckoutButton = true }: CartSummaryCardProps) {
  const { pricing, items } = useCart();

  const isCartEmpty = items.length === 0;

  return (
    <div className="p-6 rounded-2xl border border-stone-200/80 bg-white shadow-xs space-y-5">
      <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
        Order Summary
      </h3>

      {/* Free Shipping Progress Indicator */}
      {!isCartEmpty && (
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 mb-1.5">
            <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
            {pricing.qualifiesForFreeShipping ? (
              <span>Congratulations! You qualify for <strong>FREE Standard Delivery</strong>!</span>
            ) : (
              <span>
                Add <strong>{formatCurrency(pricing.amountNeededForFreeShipping)}</strong> more to get <strong>FREE Standard Delivery</strong>
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((pricing.subtotal / 35) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Pricing Lines */}
      <div className="space-y-2.5 text-xs text-stone-600">
        <div className="flex justify-between items-center">
          <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
          <span className="font-semibold text-stone-900">{formatCurrency(pricing.subtotal)}</span>
        </div>

        {pricing.discount > 0 && (
          <div className="flex justify-between items-center text-emerald-700">
            <span>Coupon Discount {pricing.couponApplied ? `(${pricing.couponApplied.code})` : ''}</span>
            <span className="font-bold">-{formatCurrency(pricing.discount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Estimated Shipping</span>
          <span className="font-semibold text-stone-900">
            {pricing.shipping === 0 ? (
              <span className="text-emerald-700 font-bold">FREE</span>
            ) : (
              formatCurrency(pricing.shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Estimated Tax (5%)</span>
          <span className="font-semibold text-stone-900">{formatCurrency(pricing.tax)}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-stone-200 text-sm font-extrabold text-stone-900">
          <span>Estimated Total</span>
          <span className="text-lg text-emerald-700 font-extrabold">
            {formatCurrency(pricing.grandTotal)}
          </span>
        </div>
      </div>

      {showCheckoutButton && (
        <div className="pt-2">
          <Link to="/checkout" className="block w-full">
            <Button
              variant="primary"
              size="lg"
              disabled={isCartEmpty}
              className="w-full shadow-md shadow-emerald-700/15"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-2 border-t border-stone-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Simulated 100% Risk-Free Checkout</span>
      </div>
    </div>
  );
}
