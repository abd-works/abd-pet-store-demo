import type { CartService } from '../../cart/server/cart.service';

import type { CatalogStockLevels } from '../../product-catalog/server/catalog-stock-levels';

import type { RetailStoreCatalog } from '../../store/server/retail-store-catalog';

import {
  DeliveryOption,
  GuestCheckout,
  IncompleteShippingAddressError,
  Order,
  ShippingAddress,
  TrackingNumber,
  WrongDeliveryOptionError,
  DEFAULT_CARRIER_NAME,
  generateOrderNumber,
  FULFILL_WITHOUT_TRACKING_WARNING,
  type GuestCheckoutInput,
  type OrderDto,
  type OrderStatusDto,
} from '@pawplace/order-shared';

import type { OrderRepository } from './order.repository';

import {
  EmptyCartError,
  OrderNotFoundError,
  PickupStoreNotFoundError,
} from './order.errors';

import { NotificationService } from './order.notification-service';

import { OrderStatusToken } from './order-status-token';

import { toOrderDto, toOrderStatusDto } from './order.mapper';

export interface FulfillResult {
  order: OrderDto;
  warning?: string;
}

export class OrderService {
  constructor(
    private readonly repository: OrderRepository,
    private readonly cartService: CartService,
    private readonly storeCatalog: RetailStoreCatalog,
    private readonly stockLevels: CatalogStockLevels,
    private readonly notification: NotificationService,
  ) {}

  async placeGuestOrder(sessionId: string, input: GuestCheckoutInput): Promise<OrderDto> {
    const cart = await this.cartService.loadRawCart(sessionId);
    if (cart.isEmpty) throw new EmptyCartError();

    const order =
      input.deliveryOption?.type === 'standard_delivery'
        ? this.buildShipToHomeOrder(cart, input)
        : await this.buildClickAndCollectOrder(cart, input);

    order.applyStockWarnings((sku) => this.stockLevels.getMaxAvailableToSell(sku));
    await this.repository.save(order);
    return toOrderDto(order);
  }

  async getOrder(orderNumber: string): Promise<OrderDto> {
    const order = await this.requireOrder(orderNumber);
    return toOrderDto(order);
  }

  async getOrderStatus(orderNumber: string, token?: string): Promise<OrderStatusDto> {
    const order = await this.requireOrder(orderNumber);
    if (token && !OrderStatusToken.verify(orderNumber, order.guestEmail, token)) {
      throw new OrderNotFoundError();
    }
    return toOrderStatusDto(order);
  }

  async lookupByGuestEmail(orderNumber: string, guestEmail: string): Promise<OrderStatusDto> {
    const order = await this.repository.findByOrderNumber(orderNumber);
    if (!order || order.guestEmail !== guestEmail) {
      throw new OrderNotFoundError();
    }
    return toOrderStatusDto(order);
  }

  async confirmPayment(
    orderNumber: string,
    maskedPaymentMethod: string,
    sessionId: string,
    options?: {
      processingVendor?: 'stripewave' | 'paynova' | 'vaultpay';
      vendorTransactionReference?: string;
      savePayNovaWalletOffered?: boolean;
    },
  ): Promise<OrderDto> {
    const order = await this.requireOrder(orderNumber);
    order.confirmPayment(maskedPaymentMethod, {
      processingVendor: options?.processingVendor,
      vendorTransactionReference: options?.vendorTransactionReference,
    });
    if (options?.savePayNovaWalletOffered) {
      order.savePayNovaWalletOffered = true;
    }
    order.emailStatus = this.notification.sendConfirmationEmail(order);
    await this.repository.save(order);
    await this.cartService.clearCart(sessionId);
    return toOrderDto(order);
  }

  async listQueue(storeCode?: string): Promise<OrderDto[]> {
    const orders = await this.repository.listQueue(storeCode);
    return orders.map(toOrderDto);
  }

  async markPrepared(orderNumber: string): Promise<OrderDto> {
    const order = await this.requireOrder(orderNumber);
    order.markReadyForPickup();
    await this.repository.save(order);
    return toOrderDto(order);
  }

  async markCollected(orderNumber: string): Promise<OrderDto> {
    const order = await this.requireOrder(orderNumber);
    order.markCollected();
    await this.repository.save(order);
    return toOrderDto(order);
  }

  async markFulfilled(
    orderNumber: string,
    tracking?: { carrierName?: string; trackingNumber?: string },
  ): Promise<FulfillResult> {
    const order = await this.requireStandardDeliveryOrder(orderNumber);
    order.markFulfilled();

    const warning = this.shipWithOptionalTracking(order, tracking);
    await this.repository.save(order);
    return { order: toOrderDto(order), warning };
  }

  async addTrackingNumber(
    orderNumber: string,
    tracking: { carrierName: string; trackingNumber: string },
  ): Promise<OrderDto> {
    const order = await this.requireStandardDeliveryOrder(orderNumber);
    this.attachTrackingAndNotify(order, tracking);
    await this.repository.save(order);
    return toOrderDto(order);
  }

  async getOrderEntity(orderNumber: string): Promise<Order | null> {
    return this.repository.findByOrderNumber(orderNumber);
  }

  async setAutomaticPaymentRetryInProgress(orderNumber: string, inProgress: boolean): Promise<void> {
    const order = await this.repository.findByOrderNumber(orderNumber);
    if (!order) return;
    order.automaticPaymentRetryInProgress = inProgress;
    await this.repository.save(order);
  }

  private buildShipToHomeOrder(cart: Awaited<ReturnType<CartService['loadRawCart']>>, input: GuestCheckoutInput): Order {
    if (!input.shippingAddress) throw new IncompleteShippingAddressError();
    if (!input.deliveryOption || input.deliveryOption.type !== 'standard_delivery') {
      throw new IncompleteShippingAddressError();
    }

    const guestCheckout = GuestCheckout.fromInput(input);
    return Order.fromGuestCartWithShipping({
      orderNumber: generateOrderNumber(),
      cart,
      guestEmail: input.guestEmail,
      guestName: input.guestName,
      billingAddress: guestCheckout.billingAddress.toJSON(),
      shippingAddress: ShippingAddress.snapshot(input.shippingAddress),
      deliveryOption: DeliveryOption.standardDelivery({
        shippingCostPence: input.deliveryOption.shippingCostPence,
        estimatedDeliveryWindow: input.deliveryOption.estimatedDeliveryWindow,
      }),
    });
  }

  private async buildClickAndCollectOrder(
    cart: Awaited<ReturnType<CartService['loadRawCart']>>,
    input: GuestCheckoutInput,
  ): Promise<Order> {
    const guestCheckout = GuestCheckout.fromInput(input);
    const pickupStoreCode = input.pickupStoreCode ?? input.deliveryOption?.pickupStoreCode ?? '';
    const store = this.storeCatalog.getStoreByCode(pickupStoreCode);
    if (!store) throw new PickupStoreNotFoundError(pickupStoreCode);

    return Order.fromGuestCart({
      orderNumber: generateOrderNumber(),
      cart,
      guestCheckout,
      pickupStore: {
        storeCode: store.storeCode,
        storeName: store.storeName,
        addressLineOne: store.addressLineOne,
        city: store.city,
        postcode: store.postcode,
      },
    });
  }

  private shipWithOptionalTracking(
    order: Order,
    tracking?: { carrierName?: string; trackingNumber?: string },
  ): string | undefined {
    if (!tracking?.trackingNumber?.trim()) {
      return FULFILL_WITHOUT_TRACKING_WARNING;
    }

    this.attachTrackingAndNotify(order, {
      carrierName: tracking.carrierName ?? DEFAULT_CARRIER_NAME,
      trackingNumber: tracking.trackingNumber,
    });
    return undefined;
  }

  private attachTrackingAndNotify(
    order: Order,
    tracking: { carrierName: string; trackingNumber: string },
  ): void {
    order.ship(
      TrackingNumber.create({
        number: tracking.trackingNumber,
        carrierName: tracking.carrierName,
      }),
    );
    this.notification.sendShippingNotification(order);
  }

  private async requireStandardDeliveryOrder(orderNumber: string): Promise<Order> {
    const order = await this.requireOrder(orderNumber);
    if (order.deliveryOption.type !== 'standard_delivery') {
      throw new WrongDeliveryOptionError(orderNumber);
    }
    return order;
  }

  private async requireOrder(orderNumber: string): Promise<Order> {
    const order = await this.repository.findByOrderNumber(orderNumber);
    if (!order) throw new OrderNotFoundError(orderNumber);
    return order;
  }
}

export { toOrderDto, toOrderStatusDto };
export {
  EmptyCartError,
  OrderNotFoundError,
  OrderNotPendingPaymentError,
  PickupStoreNotFoundError,
} from './order.errors';
export { NotificationService } from './order.notification-service';
