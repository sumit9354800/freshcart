import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { createOrderFromCheckout } from '../lib/orders';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import { StepCustomerInfo } from '../components/checkout/StepCustomerInfo';
import { StepAddress } from '../components/checkout/StepAddress';
import { StepDelivery } from '../components/checkout/StepDelivery';
import { StepPayment } from '../components/checkout/StepPayment';
import { StepReview } from '../components/checkout/StepReview';
import { CartSummaryCard } from '../components/cart/CartSummaryCard';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import type { Customer, Address, DeliveryMethod, PaymentMethod } from '../types';

export function CheckoutPage() {
  const { items, pricing, appliedCoupon, clearCart } = useCart();
  const { profile, defaultAddress } = useUser();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [customer, setCustomer] = useState<Customer>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
  });

  const [shippingAddress, setShippingAddress] = useState<Address>(
    defaultAddress || {
      id: 'default',
      firstName: profile.firstName,
      lastName: profile.lastName,
      addressLine1: '742 Evergreen Terrace',
      apartment: 'Apt 4B',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62704',
      country: 'United States',
      phone: profile.phone,
      isDefault: true,
    }
  );

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>({
    type: 'standard',
    name: 'Standard Fresh Delivery',
    estimatedDelivery: 'Arrives in 2-3 business days',
    cost: pricing.subtotal >= 35 ? 0 : 4.99,
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card',
    cardLast4: '4242',
    brand: 'Visa (Simulated)',
  });

  if (items.length === 0) {
    return (
      <div className="py-6 space-y-4">
        <Breadcrumbs items={[{ label: 'Checkout' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="No Items to Checkout"
          description="Your basket is currently empty. Please select products to continue to checkout."
          actionLabel="Return to Catalog"
          actionHref="/products"
        />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    // Artificial small delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newOrder = createOrderFromCheckout({
      items,
      customer,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      shipping: pricing.shipping,
      tax: pricing.tax,
      total: pricing.grandTotal,
      couponCodeApplied: appliedCoupon?.code,
    });

    clearCart();
    navigate(`/order-success/${newOrder.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs
        items={[{ label: 'Shopping Cart', href: '/cart' }, { label: 'Checkout' }]}
      />

      {/* Progress Steps Header */}
      <CheckoutSteps
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Step Form Column */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <StepCustomerInfo
              initialData={customer}
              onNext={(data) => {
                setCustomer(data);
                setCurrentStep(2);
              }}
            />
          )}

          {currentStep === 2 && (
            <StepAddress
              initialAddress={shippingAddress}
              onNext={(addr) => {
                setShippingAddress(addr);
                setCurrentStep(3);
              }}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <StepDelivery
              onNext={(method) => {
                setDeliveryMethod(method);
                setCurrentStep(4);
              }}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <StepPayment
              initialMethod={paymentMethod}
              onNext={(pay) => {
                setPaymentMethod(pay);
                setCurrentStep(5);
              }}
              onBack={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 5 && (
            <StepReview
              customer={customer}
              address={shippingAddress}
              deliveryMethod={deliveryMethod}
              paymentMethod={paymentMethod}
              items={items}
              pricing={pricing}
              onBack={() => setCurrentStep(4)}
              onPlaceOrder={handlePlaceOrder}
            />
          )}
        </div>

        {/* Live Summary Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <CartSummaryCard showCheckoutButton={false} />
          <Link
            to="/cart"
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify items in cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
