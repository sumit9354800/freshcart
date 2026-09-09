import React, { useState } from 'react';
import { CreditCard, Banknote, QrCode, ArrowRight, ArrowLeft, ShieldAlert, Check } from 'lucide-react';
import { Button } from '../common/Button';
import type { PaymentMethod, PaymentType } from '../../types';

export interface StepPaymentProps {
  initialMethod?: PaymentMethod;
  onNext: (payment: PaymentMethod) => void;
  onBack: () => void;
}

export function StepPayment({ initialMethod, onNext, onBack }: StepPaymentProps) {
  const [selectedType, setSelectedType] = useState<PaymentType>(
    initialMethod?.type || 'card'
  );

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState('Sarah Jenkins');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [upiId, setUpiId] = useState('sarah@okfresh');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (selectedType === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15 || cleanNum.length > 19) {
        errs.cardNumber = 'Please enter a valid card number (15-19 digits)';
      }
      if (!cardHolder.trim()) {
        errs.cardHolder = 'Cardholder name is required';
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
        errs.expiry = 'Use MM/YY format';
      }
      if (cvv.length < 3 || cvv.length > 4) {
        errs.cvv = '3 or 4 digits required';
      }
    } else if (selectedType === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        errs.upiId = 'Please enter a valid simulated UPI ID (e.g. user@bank)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let paymentMethod: PaymentMethod;
    if (selectedType === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      paymentMethod = {
        type: 'card',
        cardLast4: cleanNum.slice(-4),
        brand: 'Visa (Simulated)',
      };
    } else if (selectedType === 'cod') {
      paymentMethod = {
        type: 'cod',
      };
    } else {
      paymentMethod = {
        type: 'upi',
        upiId,
      };
    }

    onNext(paymentMethod);
  };

  return (
    <form onSubmit={handleContinue} className="p-6 rounded-2xl border border-stone-200/80 bg-white space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
        <CreditCard className="w-5 h-5 text-emerald-600" />
        <h3 className="text-base font-bold text-stone-900">Step 4 — Payment Simulation</h3>
      </div>

      {/* Simulation Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Sandbox Environment:</span> This is a 100% simulated
          payment step. No real money or bank accounts are touched. Test values are pre-filled for your convenience.
        </div>
      </div>

      {/* Payment Options Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            type: 'card' as PaymentType,
            title: 'Credit / Debit Card',
            desc: 'Visa, MasterCard, Amex',
            icon: CreditCard,
          },
          {
            type: 'upi' as PaymentType,
            title: 'UPI / QR Code',
            desc: 'Instant UPI simulator',
            icon: QrCode,
          },
          {
            type: 'cod' as PaymentType,
            title: 'Cash on Delivery',
            desc: 'Pay at your doorstep',
            icon: Banknote,
          },
        ].map((item) => {
          const isSelected = selectedType === item.type;
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              id={`payment-method-${item.type}`}
              onClick={() => setSelectedType(item.type)}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-stone-500'}`} />
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-stone-900">{item.title}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">{item.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Card Details Form */}
      {selectedType === 'card' && (
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Cardholder Full Name
            </label>
            <input
              type="text"
              id="card-holder-name"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="e.g. Sarah Jenkins"
            />
            {errors.cardHolder && (
              <p className="text-xs text-rose-600 mt-1">{errors.cardHolder}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Simulated Card Number
            </label>
            <input
              type="text"
              id="card-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="4242 4242 4242 4242"
            />
            {errors.cardNumber && (
              <p className="text-xs text-rose-600 mt-1">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                id="card-expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="MM/YY"
              />
              {errors.expiry && <p className="text-xs text-rose-600 mt-1">{errors.expiry}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                CVV / CVC
              </label>
              <input
                type="password"
                id="card-cvv"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="***"
              />
              {errors.cvv && <p className="text-xs text-rose-600 mt-1">{errors.cvv}</p>}
            </div>
          </div>
        </div>
      )}

      {/* UPI Details Form */}
      {selectedType === 'upi' && (
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Simulated Virtual Payment Address (UPI ID)
            </label>
            <input
              type="text"
              id="upi-id-input"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="yourname@bank"
            />
            {errors.upiId && <p className="text-xs text-rose-600 mt-1">{errors.upiId}</p>}
          </div>
          <p className="text-xs text-stone-500">
            A mock instant approval simulation will be registered when you place your order.
          </p>
        </div>
      )}

      {/* Cash on Delivery Notice */}
      {selectedType === 'cod' && (
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 leading-relaxed">
          Pay in cash or tap card on delivery when the courier arrives at your door. Please have exact change ready if possible.
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <Button type="button" variant="outline" size="md" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </Button>
        <Button type="submit" variant="primary" size="md">
          <span>Review Order Details</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </form>
  );
}
