import type { OrderDto, OrderStatusDto } from '@pawplace/order-shared';

import {
  DeliveryOption,
  Order,
  TrackingNumber,
  formatShippingCostPence,
  orderStatusLabel,
  type TrackingNumberSnapshot,
} from '@pawplace/order-shared';

import { OrderStatusToken } from './order-status-token';

function formatShippingCostIfPositive(pence: number): string | undefined {
  return pence > 0 ? formatShippingCostPence(pence) : undefined;
}

function trackingCarrierUrl(snapshot: TrackingNumberSnapshot): string {
  return TrackingNumber.create({
    number: snapshot.value,
    carrierName: snapshot.carrierName,
  }).carrierTrackingUrl();
}

function toOrderTrackingDto(snapshot: TrackingNumberSnapshot) {
  return {
    value: snapshot.value,
    carrierName: snapshot.carrierName,
    carrierTrackingUrl: trackingCarrierUrl(snapshot),
  };
}

function toStatusTrackingDto(
  snapshot: TrackingNumberSnapshot,
  shippedAt: number,
  estimatedDeliveryDate?: string,
) {
  return {
    number: snapshot.value,
    carrierName: snapshot.carrierName,
    carrierTrackingUrl: trackingCarrierUrl(snapshot),
    shippedAt: new Date(shippedAt).toISOString(),
    estimatedDeliveryDate,
  };
}

export function toOrderDto(order: Order): OrderDto {
  const tracking = order.trackingNumber ? toOrderTrackingDto(order.trackingNumber) : undefined;

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    guestEmail: order.guestEmail,
    guestName: order.guestName,
    billingAddress: order.billingAddress,
    pickupStore: order.pickupStore,
    shippingAddress: order.shippingAddress,
    deliveryOption: order.deliveryOption,
    items: order.items,
    subtotal: order.subtotal,
    subtotalFormatted: order.subtotalFormatted,
    shippingCostPence: order.shippingCostPence || undefined,
    shippingCostFormatted: formatShippingCostIfPositive(order.shippingCostPence),
    estimatedDeliveryWindow:
      order.deliveryOption.type === 'standard_delivery'
        ? order.deliveryOption.estimatedDeliveryWindow
        : undefined,
    deliveryTypeLabel: DeliveryOption.deliveryTypeLabel(order.deliveryOption),
    stockWarnings: order.stockWarnings.length > 0 ? order.stockWarnings : undefined,
    emailStatus: order.emailStatus,
    maskedPaymentMethod: order.maskedPaymentMethod,
    processingVendor: order.processingVendor,
    vendorTransactionReference: order.vendorTransactionReference,
    automaticPaymentRetryInProgress: order.automaticPaymentRetryInProgress,
    savePayNovaWalletOffered: order.savePayNovaWalletOffered,
    statusPageUrl: OrderStatusToken.signUrl(order.orderNumber, order.guestEmail),
    trackingNumber: tracking,
    shippedAt: order.shippedAt ? new Date(order.shippedAt).toISOString() : undefined,
    estimatedDeliveryDate: order.estimatedDeliveryDate,
  };
}

export function toOrderStatusDto(order: Order): OrderStatusDto {
  const tracking =
    order.trackingNumber && order.shippedAt
      ? toStatusTrackingDto(order.trackingNumber, order.shippedAt, order.estimatedDeliveryDate)
      : undefined;

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    statusLabel: orderStatusLabel(order),
    deliveryOptionLabel: DeliveryOption.deliveryTypeLabel(order.deliveryOption),
    guestEmail: order.guestEmail,
    lineItems: order.items,
    shippingAddress: order.shippingAddress,
    pickupStore: order.pickupStore,
    shippingCostFormatted: formatShippingCostIfPositive(order.shippingCostPence),
    estimatedDeliveryWindow:
      order.deliveryOption.type === 'standard_delivery'
        ? order.deliveryOption.estimatedDeliveryWindow
        : undefined,
    tracking,
    trackingPendingMessage: order.trackingPendingMessage(),
  };
}
