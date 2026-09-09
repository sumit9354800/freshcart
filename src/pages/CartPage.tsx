import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CartSummaryCard } from '../components/cart/CartSummaryCard';
import { CouponInputBox } from '../components/cart/CouponInputBox';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';

export function CartPage() {
  const { items, clearCart } = useCart();
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="py-6 space-y-4">
        <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Basket is Empty"
          description="Looks like you haven't added any fresh organic produce or pantry staples yet. Discover today's harvest!"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Shopping Basket</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Review your harvest selections before safe checkout
          </p>
        </div>
        <button
          type="button"
          id="cart-clear-all-btn"
          onClick={() => setIsConfirmClearOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-rose-600 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear basket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-stone-200/80 bg-white">
            <div className="divide-y divide-stone-100">
              {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
              ))}
            </div>
          </div>

          {/* Coupon Box */}
          <CouponInputBox />

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue browsing produce</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1 space-y-4 sticky top-28">
          <CartSummaryCard />
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        onConfirm={() => {
          clearCart();
          setIsConfirmClearOpen(false);
        }}
        title="Empty your basket?"
        message="Are you sure you want to remove all items from your shopping basket? This cannot be undone."
        confirmLabel="Yes, Clear All"
        cancelLabel="Keep Items"
        variant="danger"
      />
    </div>
  );
}
