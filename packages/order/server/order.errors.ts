export class EmptyCartError extends Error {

  constructor() {

    super('Cart is empty');

    this.name = 'EmptyCartError';

  }

}



export class OrderNotFoundError extends Error {

  constructor(orderNumber?: string) {

    super(orderNumber ? `Order not found: ${orderNumber}` : 'Order not found');

    this.name = 'OrderNotFoundError';

  }

}



export class PickupStoreNotFoundError extends Error {

  constructor(storeCode: string) {

    super(`pickup store not found: ${storeCode}`);

    this.name = 'PickupStoreNotFoundError';

  }

}



export class OrderNotPendingPaymentError extends Error {

  constructor() {

    super('order is not pending payment');

    this.name = 'OrderNotPendingPaymentError';

  }

}



export { WrongDeliveryOptionError } from '@pawplace/order-shared';

export { IncompleteShippingAddressError } from '@pawplace/order-shared';


