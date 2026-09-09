import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '../common/Button';
import { formatCurrency } from '../../lib/utils';
import confetti from 'canvas-confetti';
import type { Customer, Address, DeliveryMethod, PaymentMethod, CartItem, PricingBreakdown } from '../../types';

export interface StepReviewProps {
  customer: Customer;
  address: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  pricing: PricingBreakdown;
  onBack: () => void;
  onPlaceOrder: () => Promise<string | void>;
}

export function StepReview({
  customer,
  address,
  deliveryMethod,
  paymentMethod,
  items,
  pricing,
  onBack,
  onPlaceOrder,
}: StepReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      // Fire festive celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore if confetti fails in iframe
      }

      await onPlaceOrder();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-stone-200/80 bg-white space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        <h3 className="text-base font-bold text-stone-900">Step 5 — Final Review & Confirmation</h3>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Customer & Shipping Details */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
          <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
            Delivery Details
          </span>
          <p className="font-bold text-stone-900 text-sm">
            {customer.firstName} {customer.lastName}
          </p>
          <p className="text-stone-600">{address.addressLine1}</p>
          {address.apartment && <p className="text-stone-600">{address.apartment}</p>}
          <p className="text-stone-600">
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p className="text-stone-500">{customer.phone} · {customer.email}</p>
        </div>

        {/* Delivery & Payment Selection */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
          <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
            Method & Speed
          </span>
          <div>
            <p className="font-bold text-stone-900">{deliveryMethod.name}</p>
            <p className="text-stone-500">{deliveryMethod.estimatedDelivery}</p>
          </div>
          <div className="pt-2 border-t border-stone-200/60">
            <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">
              Payment Simulator
            </span>
            <p className="font-bold text-stone-900 capitalize">
              {paymentMethod.type === 'card'
                ? `Card ending in ${paymentMethod.cardLast4 || '••••'}`
                : paymentMethod.type === 'upi'
                ? `UPI: ${paymentMethod.upiId}`
                : 'Cash on Delivery'}
            </p>
          </div>
        </div>
      </div>

      {/* Items Summary Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Items in your order ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h4>
        <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                />
                <div>
                  <p className="font-semibold text-stone-900">{item.product.name}</p>
                  <p className="text-[11px] text-stone-500">
                    Qty: {item.quantity} × {formatCurrency(item.product.price)}
                  </p>
                </div>
              </div>
              <span className="font-bold text-stone-900">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total Calculations */}
      <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-stone-600">Subtotal</span>
          <span className="font-semibold text-stone-900">{formatCurrency(pricing.subtotal)}</span>
        </div>
        {pricing.discount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Coupon Discount</span>
            <span className="font-bold">-{formatCurrency(pricing.discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-stone-600">Shipping</span>
          <span className="font-semibold text-stone-900">
            {pricing.shipping === 0 ? 'FREE' : formatCurrency(pricing.shipping)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-600">Tax</span>
          <span className="font-semibold text-stone-900">{formatCurrency(pricing.tax)}</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-emerald-200/60 text-sm font-extrabold text-stone-900">
          <span>Final Total</span>
          <span className="text-lg text-emerald-800">{formatCurrency(pricing.grandTotal)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          id="place-order-button"
          onClick={handlePlaceOrder}
          isLoading={isSubmitting}
          className="shadow-md shadow-emerald-700/20"
        >
          <Lock className="w-4 h-4 mr-1.5" />
          <span>Place Simulated Order ({formatCurrency(pricing.grandTotal)})</span>
        </Button>
      </div>
    </div>
  );
}
