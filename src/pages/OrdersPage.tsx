import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, MapPin, Truck } from 'lucide-react';
import { storage } from '../lib/storage';
import { formatCurrency, formatDate } from '../lib/utils';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import type { Order, OrderStatus } from '../types';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setOrders(storage.getOrders());
  }, []);

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.orderStatus === filterStatus);

  const statusVariantMap: Record<OrderStatus, 'default' | 'success' | 'warning' | 'secondary'> = {
    ordered: 'secondary',
    confirmed: 'default',
    packed: 'warning',
    shipped: 'warning',
    out_for_delivery: 'warning',
    delivered: 'success',
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Orders & Fulfillment' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Order History</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Track and view fulfillment timelines for your grocery deliveries
          </p>
        </div>

        {orders.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'confirmed', 'packed', 'shipped', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Placed Yet"
          description="You haven't placed any grocery orders with FreshCart yet. Fill your basket with organic goodness!"
          actionLabel="Browse Catalog"
          actionHref="/products"
        />
      ) : filteredOrders.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
          No orders found matching the status filter "{filterStatus}".
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-2xl border border-stone-200/80 bg-white hover:border-stone-300 transition-all space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-extrabold text-stone-900">
                        {order.id}
                      </span>
                      <Badge variant={statusVariantMap[order.orderStatus]} size="sm">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-xs text-stone-500">Order Total:</span>
                      <p className="text-base font-extrabold text-emerald-800">
                        {formatCurrency(order.total)}
                      </p>
                    </div>

                    <Link
                      to={`/order-success/${order.id}`}
                      className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                      title="View full receipt"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50/70 border border-stone-100 text-xs"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-stone-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-stone-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-stone-500">
                          {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping info footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      Shipping to {order.shippingAddress.city}, {order.shippingAddress.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-stone-400" />
                    <span>{order.deliveryMethod.name}</span>
                  </div>
                  <Link
                    to={`/order-success/${order.id}`}
                    className="text-emerald-700 hover:text-emerald-800 font-bold ml-auto"
                  >
                    Track order timeline →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
