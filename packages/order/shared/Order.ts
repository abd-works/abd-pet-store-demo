import { formatCurrency } from '@pawplace/cart-shared';

import type { ShoppingCart } from '@pawplace/cart-shared';

import type { BillingAddressFields } from './BillingAddress';

import { BillingAddress } from './BillingAddress';

import type { DeliveryOptionSnapshot } from './DeliveryOption';

import { DeliveryOption, STANDARD_SHIP_TRANSIT_DAYS } from './DeliveryOption';

import { GuestCheckout } from './GuestCheckout';

import { OrderLineItem, type OrderLineItemSnapshot } from './OrderLineItem';

import type { ShippingAddressFields } from './ShippingAddress';

import type { OrderStatus } from './order.schema';

import { TrackingNumber, type TrackingNumberSnapshot } from './TrackingNumber';



export interface PickupStoreSnapshot {

  storeCode: string;

  storeName: string;

  addressLineOne: string;

  city: string;

  postcode: string;

}



export interface StockWarning {

  sku: string;

  message: string;

}



export class WrongDeliveryOptionError extends Error {

  constructor(orderNumber?: string) {

    super(orderNumber ? `Invalid delivery option for order: ${orderNumber}` : 'Invalid delivery option for action');

    this.name = 'WrongDeliveryOptionError';

  }

}



/** << Entity >> — guest purchase lifecycle (Increments 2–3). */

export class Order {

  readonly orderNumber: string;

  status: OrderStatus;

  readonly guestEmail: string;

  readonly guestName: string;

  readonly billingAddress: BillingAddressFields;

  readonly deliveryOption: DeliveryOptionSnapshot;

  readonly pickupStore?: PickupStoreSnapshot;

  readonly shippingAddress?: ShippingAddressFields;

  readonly items: OrderLineItemSnapshot[];

  readonly subtotal: number;

  readonly shippingCostPence: number;

  stockWarnings: StockWarning[] = [];

  emailStatus: 'sent' | 'queued' | 'failed' = 'queued';

  maskedPaymentMethod?: string;

  processingVendor?: 'stripewave' | 'paynova' | 'vaultpay';

  vendorTransactionReference?: string;

  automaticPaymentRetryInProgress?: boolean;

  savePayNovaWalletOffered?: boolean;

  trackingNumber?: TrackingNumberSnapshot;

  shippedAt?: number;

  estimatedDeliveryDate?: string;

  readonly createdAt: number;



  constructor(params: {

    orderNumber: string;

    guestEmail: string;

    guestName: string;

    billingAddress: BillingAddressFields;

    deliveryOption: DeliveryOptionSnapshot;

    pickupStore?: PickupStoreSnapshot;

    shippingAddress?: ShippingAddressFields;

    items: OrderLineItemSnapshot[];

    shippingCostPence?: number;

  }) {

    if (params.items.length === 0) throw new Error('order must have at least one line item');

    if (params.deliveryOption.type === 'click_and_collect' && !params.pickupStore) {

      throw new Error('pickup store is required for click-and-collect');

    }

    if (params.deliveryOption.type === 'standard_delivery' && !params.shippingAddress) {

      throw new Error('shipping address is required for standard delivery');

    }



    this.orderNumber = params.orderNumber;

    this.status = 'pending_payment';

    this.guestEmail = params.guestEmail;

    this.guestName = params.guestName;

    this.billingAddress = params.billingAddress;

    this.deliveryOption = params.deliveryOption;

    this.pickupStore = params.pickupStore;

    this.shippingAddress = params.shippingAddress;

    this.items = params.items;

    this.subtotal = params.items.reduce((sum, item) => sum + item.lineTotal, 0);

    this.shippingCostPence =

      params.shippingCostPence ??

      (params.deliveryOption.type === 'standard_delivery' ? params.deliveryOption.shippingCostPence : 0);

    this.createdAt = Date.now();

  }



  static fromGuestCart(input: {

    orderNumber: string;

    cart: ShoppingCart;

    guestCheckout: GuestCheckout;

    pickupStore: PickupStoreSnapshot;

  }): Order {

    const lineItems = input.cart.cartItems.map((item) =>

      OrderLineItem.snapshotFromCartItem(item).toJSON(),

    );

    return new Order({

      orderNumber: input.orderNumber,

      guestEmail: input.guestCheckout.guestEmail,

      guestName: input.guestCheckout.guestName,

      billingAddress: input.guestCheckout.billingAddress.toJSON(),

      deliveryOption: DeliveryOption.clickAndCollect(),

      pickupStore: input.pickupStore,

      items: lineItems,

    });

  }



  static fromGuestCartWithShipping(input: {

    orderNumber: string;

    cart: ShoppingCart;

    guestEmail: string;

    guestName: string;

    billingAddress: BillingAddressFields;

    shippingAddress: ShippingAddressFields;

    deliveryOption: DeliveryOptionSnapshot;

  }): Order {

    const lineItems = input.cart.cartItems.map((item) =>

      OrderLineItem.snapshotFromCartItem(item).toJSON(),

    );

    return new Order({

      orderNumber: input.orderNumber,

      guestEmail: input.guestEmail,

      guestName: input.guestName,

      billingAddress: input.billingAddress,

      deliveryOption: input.deliveryOption,

      shippingAddress: input.shippingAddress,

      items: lineItems,

      shippingCostPence:

        input.deliveryOption.type === 'standard_delivery'

          ? input.deliveryOption.shippingCostPence

          : 0,

    });

  }



  get subtotalFormatted(): string {

    return formatCurrency(this.subtotal + this.shippingCostPence / 100);

  }



  get merchandiseSubtotalFormatted(): string {

    return formatCurrency(this.subtotal);

  }



  confirmPayment(
    maskedPaymentMethod: string,
    options?: {
      processingVendor?: 'stripewave' | 'paynova' | 'vaultpay';
      vendorTransactionReference?: string;
    },
  ): void {

    if (this.status !== 'pending_payment') {

      throw new Error('order is not pending payment');

    }

    this.status = 'confirmed';

    this.maskedPaymentMethod = maskedPaymentMethod;

    this.processingVendor = options?.processingVendor;

    this.vendorTransactionReference = options?.vendorTransactionReference;

    this.automaticPaymentRetryInProgress = false;

  }



  markReadyForPickup(): void {

    if (this.deliveryOption.type !== 'click_and_collect') {

      throw new WrongDeliveryOptionError(this.orderNumber);

    }

    if (this.status !== 'confirmed') {

      throw new Error('order must be confirmed before marking prepared');

    }

    this.status = 'ready_for_pickup';

  }



  markCollected(): void {

    if (this.deliveryOption.type !== 'click_and_collect') {

      throw new WrongDeliveryOptionError(this.orderNumber);

    }

    if (this.status !== 'ready_for_pickup') {

      throw new Error('order must be ready for pickup before marking collected');

    }

    this.status = 'collected';

  }



  markFulfilled(): void {

    if (this.deliveryOption.type !== 'standard_delivery') {

      throw new WrongDeliveryOptionError(this.orderNumber);

    }

    if (this.status !== 'confirmed') {

      throw new Error('order must be confirmed before marking fulfilled');

    }

    this.status = 'fulfilled';

  }



  ship(tracking: TrackingNumber): void {

    if (this.deliveryOption.type !== 'standard_delivery') {

      throw new WrongDeliveryOptionError(this.orderNumber);

    }

    if (this.status !== 'fulfilled' && this.status !== 'confirmed') {

      throw new Error('order must be confirmed or fulfilled before shipping');

    }

    this.trackingNumber = tracking.toJSON();

    this.shippedAt = Date.now();

    this.status = 'shipped';

    const shippedDate = new Date(this.shippedAt);

    shippedDate.setDate(shippedDate.getDate() + STANDARD_SHIP_TRANSIT_DAYS);

    this.estimatedDeliveryDate = shippedDate.toISOString().slice(0, 10);

  }



  applyStockWarnings(availableQuantityForSku: (sku: string) => number): void {

    for (const item of this.items) {

      const available = availableQuantityForSku(item.sku);

      if (available < item.quantity) {

        this.stockWarnings.push({

          sku: item.sku,

          message: `stock warning: only ${available} available for ${item.name}`,

        });

      }

    }

  }

  trackingPendingMessage(): string | undefined {
    if (
      this.deliveryOption.type === 'standard_delivery' &&
      (this.status === 'confirmed' || this.status === 'fulfilled')
    ) {
      return 'Tracking will be available once your order ships';
    }
    if (this.deliveryOption.type === 'click_and_collect' && this.status === 'confirmed') {
      return 'Order being prepared';
    }
    return undefined;
  }

}



export function generateOrderNumber(): string {

  const suffix = Math.floor(100000 + Math.random() * 900000);

  return `ORD-${suffix}`;

}



export function orderStatusLabel(order: Order): string {

  if (order.deliveryOption.type === 'standard_delivery') {

    switch (order.status) {

      case 'confirmed':

        return 'Confirmed';

      case 'fulfilled':

        return 'Fulfilled';

      case 'shipped':

        return 'Shipped';

      case 'delivered':

        return 'Delivered';

      default:

        return order.status;

    }

  }

  switch (order.status) {

    case 'confirmed':

      return 'Confirmed';

    case 'ready_for_pickup':

      return 'Ready for pickup';

    case 'collected':

      return 'Collected';

    default:

      return order.status;

  }

}


