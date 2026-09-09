import React, { useState } from 'react';
import { Tag, Check, X, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { COUPONS } from '../../data/coupons';

export function CouponInputBox() {
  const { appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setIsSubmitting(true);
    const res = applyCoupon(code);
    if (res.success) {
      setCode('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-5 rounded-2xl border border-stone-200/80 bg-white space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
        <Tag className="w-4 h-4 text-emerald-600" />
        <span>Promo Code & Coupons</span>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <div>
              <div className="text-xs font-bold text-emerald-900">{appliedCoupon.code} Applied</div>
              <div className="text-[11px] text-emerald-700">{appliedCoupon.description}</div>
            </div>
          </div>
          <button
            type="button"
            id="coupon-remove-btn"
            onClick={removeCoupon}
            className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 transition-colors"
            title="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            id="coupon-input"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code (e.g. SAVE10)"
            className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <button
            type="submit"
            id="coupon-apply-btn"
            disabled={!code.trim() || isSubmitting}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 disabled:opacity-50 transition-colors"
          >
            Apply
          </button>
        </form>
      )}

      {/* Quick clickable suggestion chips */}
      {!appliedCoupon && (
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1.5 font-medium">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Available promotional codes:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COUPONS.slice(0, 4).map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => applyCoupon(c.code)}
                className="text-[11px] font-bold px-2 py-0.5 rounded-md border border-stone-200 bg-stone-50 text-stone-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-colors"
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
