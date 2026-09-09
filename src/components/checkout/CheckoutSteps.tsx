import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CheckoutStepsProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function CheckoutSteps({ currentStep, onStepClick }: CheckoutStepsProps) {
  const steps = [
    { number: 1, title: 'Customer' },
    { number: 2, title: 'Shipping' },
    { number: 3, title: 'Delivery' },
    { number: 4, title: 'Payment' },
    { number: 5, title: 'Review' },
  ];

  return (
    <nav className="w-full py-4 mb-6" aria-label="Checkout Progress">
      <div className="flex items-center justify-between relative max-w-2xl mx-auto">
        {/* Connecting progress line */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-0.5 bg-stone-200 -z-0" />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-emerald-600 transition-all duration-300 -z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isAccessible = step.number < currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <button
                type="button"
                id={`checkout-step-${step.number}`}
                disabled={!isAccessible}
                onClick={() => onStepClick && isAccessible && onStepClick(step.number)}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  isCompleted
                    ? 'bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 shadow-xs'
                    : isCurrent
                    ? 'bg-stone-900 text-white ring-4 ring-emerald-500/20 shadow-xs'
                    : 'bg-white text-stone-400 border-2 border-stone-200 cursor-not-allowed'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check className="w-4 h-4 text-white" /> : step.number}
              </button>
              <span
                className={cn(
                  'text-[11px] font-semibold mt-1.5 hidden sm:block',
                  isCurrent ? 'text-stone-900 font-bold' : 'text-stone-400'
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
