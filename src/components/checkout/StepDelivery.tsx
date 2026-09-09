import { Truck, Zap, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/utils';
import type { DeliveryMethod, DeliveryMethodType } from '../../types';

export interface StepDeliveryProps {
  onNext: (method: DeliveryMethod) => void;
  onBack: () => void;
}

export function StepDelivery({ onNext, onBack }: StepDeliveryProps) {
  const { deliveryMethod, setDeliveryMethod, pricing } = useCart();

  const standardFree = pricing.subtotal >= 35;
  const standardCost = standardFree ? 0 : 4.99;
  const expressCost = 9.99;

  const deliveryOptions: {
    type: DeliveryMethodType;
    title: string;
    description: string;
    estimate: string;
    cost: number;
    icon: typeof Truck;
  }[] = [
    {
      type: 'standard',
      title: 'Standard Fresh Delivery',
      description: 'Hand-picked and temperature-controlled eco-packaging.',
      estimate: 'Arrives in 2-3 business days',
      cost: standardCost,
      icon: Truck,
    },
    {
      type: 'express',
      title: 'Priority Express Delivery',
      description: 'First morning slot delivery with extra chill dry ice packs.',
      estimate: 'Guaranteed tomorrow morning (8 AM - 12 PM)',
      cost: expressCost,
      icon: Zap,
    },
  ];

  const handleSelect = (type: DeliveryMethodType) => {
    setDeliveryMethod(type);
  };

  const handleContinue = () => {
    const chosen = deliveryOptions.find((d) => d.type === deliveryMethod) || deliveryOptions[0];
    onNext({
      type: chosen.type,
      name: chosen.title,
      estimatedDelivery: chosen.estimate,
      cost: chosen.cost,
    });
  };

  return (
    <div className="p-6 rounded-2xl border border-stone-200/80 bg-white space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
        <Truck className="w-5 h-5 text-emerald-600" />
        <h3 className="text-base font-bold text-stone-900">Step 3 — Delivery Method</h3>
      </div>

      <div className="space-y-3">
        {deliveryOptions.map((opt) => {
          const isSelected = deliveryMethod === opt.type;
          const Icon = opt.icon;

          return (
            <div
              key={opt.type}
              id={`delivery-opt-${opt.type}`}
              onClick={() => handleSelect(opt.type)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">{opt.title}</span>
                    {opt.type === 'standard' && standardFree && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{opt.description}</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">{opt.estimate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-stone-900">
                  {opt.cost === 0 ? 'FREE' : formatCurrency(opt.cost)}
                </span>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-stone-300'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <Button type="button" variant="outline" size="md" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </Button>
        <Button type="button" variant="primary" size="md" onClick={handleContinue}>
          <span>Continue to Payment</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
