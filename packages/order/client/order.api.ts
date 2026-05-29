import type { BillingAddress, GuestCheckoutInput, OrderDto, OrderStatusDto, ShippingAddress } from '@pawplace/order-shared';

import { orderDtoSchema, orderStatusDtoSchema } from '@pawplace/order-shared';

import { performFetch } from '../../shared/http-io';

import { assertResponseOk } from '../../shared/http-client';



async function readOrder(response: Response): Promise<OrderDto> {

  assertResponseOk(response, 'order');

  const raw = await response.json();

  return orderDtoSchema.parse(raw);

}



async function readOrderStatus(response: Response): Promise<OrderStatusDto> {

  assertResponseOk(response, 'order status');

  const raw = await response.json();

  return orderStatusDtoSchema.parse(raw);

}



export function placeGuestOrder(input: GuestCheckoutInput): Promise<OrderDto> {

  return performFetch('/api/orders', {

    method: 'POST',

    credentials: 'include',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(input),

  }).then(readOrder);

}



export function fetchOrder(orderNumber: string): Promise<OrderDto> {

  return performFetch(`/api/orders/${encodeURIComponent(orderNumber)}`, {

    credentials: 'include',

  }).then(readOrder);

}



export function fetchOrderStatus(orderNumber: string, token?: string): Promise<OrderStatusDto> {

  const query = token ? `?token=${encodeURIComponent(token)}` : '';

  return performFetch(`/api/orders/status/${encodeURIComponent(orderNumber)}${query}`, {

    credentials: 'include',

  }).then(readOrderStatus);

}



export function lookupOrderStatus(orderNumber: string, guestEmail: string): Promise<OrderStatusDto> {

  return performFetch('/api/orders/status/lookup', {

    method: 'POST',

    credentials: 'include',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({ orderNumber, guestEmail }),

  }).then(readOrderStatus);

}



export function fetchClickAndCollectQueue(storeCode?: string): Promise<OrderDto[]> {

  return fetchOrderQueue(storeCode);

}



export function fetchOrderQueue(storeCode?: string): Promise<OrderDto[]> {

  const query = storeCode ? `?storeCode=${encodeURIComponent(storeCode)}` : '';

  return performFetch(`/api/orders/queue${query}`, { credentials: 'include' })

    .then(async (response) => {

      assertResponseOk(response, 'queue');

      const raw = (await response.json()) as { orders: unknown[] };

      return raw.orders.map((row) => orderDtoSchema.parse(row));

    });

}



export function markOrderPrepared(orderNumber: string): Promise<OrderDto> {

  return performFetch(`/api/orders/${encodeURIComponent(orderNumber)}/prepared`, {

    method: 'PATCH',

    credentials: 'include',

  }).then(readOrder);

}



export function markOrderCollected(orderNumber: string): Promise<OrderDto> {

  return performFetch(`/api/orders/${encodeURIComponent(orderNumber)}/collected`, {

    method: 'PATCH',

    credentials: 'include',

  }).then(readOrder);

}



export interface FulfillOrderResult {

  order: OrderDto;

  warning?: string;

}



export function markOrderFulfilled(

  orderNumber: string,

  tracking?: { carrierName?: string; trackingNumber?: string },

): Promise<FulfillOrderResult> {

  return performFetch(`/api/orders/${encodeURIComponent(orderNumber)}/fulfilled`, {

    method: 'PATCH',

    credentials: 'include',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(tracking ?? {}),

  }).then(async (response) => {

    assertResponseOk(response, 'fulfill order');

    const raw = (await response.json()) as FulfillOrderResult;

    return { order: orderDtoSchema.parse(raw.order), warning: raw.warning };

  });

}



export function addOrderTrackingNumber(

  orderNumber: string,

  tracking: { carrierName: string; trackingNumber: string },

): Promise<OrderDto> {

  return performFetch(`/api/orders/${encodeURIComponent(orderNumber)}/tracking`, {

    method: 'PATCH',

    credentials: 'include',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(tracking),

  }).then(readOrder);

}



export type { BillingAddress, ShippingAddress };


