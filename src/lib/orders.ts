import { generateOrderId } from './utils';
import { storage } from './storage';
import type {
  Order,
  OrderItem,
  Customer,
  Address,
  DeliveryMethod,
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
  CartItem,
} from '../types';

export interface CreateOrderParams {
  items: CartItem[];
  customer: Customer;
  shippingAddress: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCodeApplied?: string;
  simulateImmediateConfirmation?: boolean;
}

export function createOrderFromCheckout(params: CreateOrderParams): Order {
  const orderItems: OrderItem[] = params.items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    image: item.product.image,
    price: item.product.price,
    quantity: item.quantity,
    total: Math.round(item.product.price * item.quantity * 100) / 100,
    unit: item.product.unit,
  }));

  const paymentStatus: PaymentStatus =
    params.paymentMethod.type === 'cod' ? 'pending' : 'paid';

  const newOrder: Order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    items: orderItems,
    customer: params.customer,
    shippingAddress: params.shippingAddress,
    deliveryMethod: params.deliveryMethod,
    paymentMethod: params.paymentMethod,
    paymentStatus,
    orderStatus: 'confirmed',
    subtotal: params.subtotal,
    discount: params.discount,
    shipping: params.shipping,
    tax: params.tax,
    total: params.total,
    couponCodeApplied: params.couponCodeApplied,
  };

  // Save to persistent localStorage
  storage.saveOrder(newOrder);

  // Deduct inventory
  storage.deductInventory(
    params.items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
  );

  return newOrder;
}

export function getOrderById(id: string): Order | undefined {
  const orders = storage.getOrders();
  return orders.find((o) => o.id === id);
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
  date?: string;
}

export function getOrderTimeline(order: Order): OrderTimelineStep[] {
  const statusSequence: { status: OrderStatus; label: string; description: string }[] = [
    {
      status: 'ordered',
      label: 'Order Placed',
      description: 'Your order details have been securely received.',
    },
    {
      status: 'confirmed',
      label: 'Confirmed',
      description: 'The store has verified inventory and accepted your order.',
    },
    {
      status: 'packed',
      label: 'Packed & Inspected',
      description: 'Packed carefully with cold-insulation packs for optimal freshness.',
    },
    {
      status: 'shipped',
      label: 'Dispatched with Courier',
      description: 'Handed to local delivery vehicle.',
    },
    {
      status: 'out_for_delivery',
      label: 'Out for Delivery',
      description: 'Driver is en route to your shipping address.',
    },
    {
      status: 'delivered',
      label: 'Delivered',
      description: 'Package handed over at your doorstep.',
    },
  ];

  const currentIndex = statusSequence.findIndex((s) => s.status === order.orderStatus);
  const effectiveIndex = currentIndex === -1 ? 1 : currentIndex; // default to confirmed if placed

  return statusSequence.map((step, idx) => ({
    ...step,
    completed: idx < effectiveIndex,
    current: idx === effectiveIndex,
    date: idx === 0 ? order.createdAt : undefined,
  }));
}
