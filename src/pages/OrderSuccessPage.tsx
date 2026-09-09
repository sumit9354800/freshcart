import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Printer, Package, ArrowRight, Truck, MapPin, CreditCard } from 'lucide-react';
import { getOrderById, getOrderTimeline } from '../lib/orders';
import { formatCurrency, formatDate } from '../lib/utils';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="py-12">
        <EmptyState
          icon={Package}
          title="Order Not Found"
          description="We could not find an order matching this order reference ID."
          actionLabel="View All Orders"
          actionHref="/orders"
        />
      </div>
    );
  }

  const timeline = getOrderTimeline(order);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Success Hero Card */}
      <div className="text-center p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20 animate-in zoom-in-50 duration-300">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Your order has been placed and confirmed. A confirmation receipt was generated with order reference:
        </p>
        <div className="inline-block px-4 py-1.5 rounded-xl bg-white border border-emerald-300 font-mono text-sm font-extrabold text-emerald-800 shadow-xs">
          {order.id}
        </div>
        <p className="text-xs text-stone-500">
          Ordered on {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Live Order Timeline */}
      <div className="p-6 rounded-2xl border border-stone-200/80 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
            Order Fulfillment Status
          </h3>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
            {order.orderStatus}
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          {timeline.map((step, idx) => {
            return (
              <div key={idx} className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    step.completed || step.current
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-stone-300 bg-white text-stone-400'
                  }`}
                >
                  {step.completed ? '✓' : idx + 1}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      step.current
                        ? 'text-emerald-800 font-extrabold'
                        : step.completed
                        ? 'text-stone-900'
                        : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">{step.description}</p>
                  {step.date && (
                    <p className="text-[11px] text-stone-400 mt-0.5">{formatDate(step.date)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details & Summary */}
      <div className="p-6 rounded-2xl border border-stone-200/80 bg-white space-y-6">
        <h3 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
          Order Summary & Shipping
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Shipping Address */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-500 text-[10px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Shipping Address</span>
            </div>
            <p className="font-bold text-stone-900 text-sm">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-stone-600">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.apartment && (
              <p className="text-stone-600">{order.shippingAddress.apartment}</p>
            )}
            <p className="text-stone-600">
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
            </p>
            <p className="text-stone-500">{order.customer.phone}</p>
          </div>

          {/* Delivery & Payment */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivery Method</span>
              </div>
              <p className="font-bold text-stone-900 text-xs mt-0.5">{order.deliveryMethod.name}</p>
              <p className="text-stone-500">{order.deliveryMethod.estimatedDelivery}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-500 text-[10px]">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment (Simulated)</span>
              </div>
              <p className="font-bold text-stone-900 text-xs capitalize mt-0.5">
                {order.paymentMethod.type === 'card'
                  ? `Card ending in ${order.paymentMethod.cardLast4 || '••••'}`
                  : order.paymentMethod.type === 'upi'
                  ? `UPI: ${order.paymentMethod.upiId}`
                  : 'Cash on Delivery'}
              </p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="pt-4 border-t border-stone-100 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Purchased Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
          </h4>
          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.productId} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
                  />
                  <div>
                    <Link
                      to={`/products/${item.slug}`}
                      className="font-bold text-stone-900 hover:text-emerald-700 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[11px] text-stone-500">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-stone-900">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing totals */}
        <div className="p-4 rounded-xl bg-stone-50 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-600">Subtotal</span>
            <span className="font-semibold text-stone-900">{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Discount {order.couponCodeApplied ? `(${order.couponCodeApplied})` : ''}</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-stone-600">Shipping</span>
            <span className="font-semibold text-stone-900">
              {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-600">Tax (5%)</span>
            <span className="font-semibold text-stone-900">{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 text-sm font-extrabold text-stone-900">
            <span>Total Paid</span>
            <span className="text-lg text-emerald-700 font-black">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Button variant="outline" size="md" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          <span>Print Receipt</span>
        </Button>

        <div className="flex items-center gap-3">
          <Link to="/orders">
            <Button variant="outline" size="md">
              <span>View Order History</span>
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="primary" size="md">
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
