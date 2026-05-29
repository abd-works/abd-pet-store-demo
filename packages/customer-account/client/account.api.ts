import type { SavedAddressDto, SavedAddressInput, SavedPaymentMethodDto } from '@pawplace/customer-account-shared';
import { savedAddressDtoSchema, savedPaymentMethodDtoSchema } from '@pawplace/customer-account-shared';
import type { OrderDto } from '@pawplace/order-shared';
import { orderDtoSchema } from '@pawplace/order-shared';
import { performFetch } from '../../shared/http-io';
import { assertResponseOk } from '../../shared/http-client';
import { z } from 'zod';

const orderHistorySummarySchema = z.object({
  orderNumber: z.string(),
  date: z.string().optional(),
  placedAt: z.string().optional(),
  itemSummary: z.string(),
  total: z.string().optional(),
  totalFormatted: z.string().optional(),
  orderStatus: z.string().optional(),
  statusLabel: z.string().optional(),
}).transform((row) => ({
  orderNumber: row.orderNumber,
  date: row.date ?? row.placedAt ?? '',
  placedAt: row.placedAt ?? row.date ?? '',
  itemSummary: row.itemSummary,
  total: row.total ?? row.totalFormatted ?? '',
  totalFormatted: row.totalFormatted ?? row.total ?? '',
  orderStatus: row.orderStatus ?? row.statusLabel ?? '',
  statusLabel: row.statusLabel ?? row.orderStatus ?? '',
}));

export type OrderHistorySummary = z.infer<typeof orderHistorySummarySchema>;

export async function fetchOrderHistory(): Promise<OrderHistorySummary[]> {
  const response = await performFetch('/api/account/orders', { credentials: 'include' });
  assertResponseOk(response, 'order history');
  const body = await response.json();
  return z.array(orderHistorySummarySchema).parse(body.orders);
}

export async function fetchOrderDetail(orderNumber: string): Promise<OrderDto> {
  const response = await performFetch(`/api/account/orders/${encodeURIComponent(orderNumber)}`, {
    credentials: 'include',
  });
  assertResponseOk(response, 'order detail');
  return orderDtoSchema.parse(await response.json());
}

export async function reorderOrder(orderNumber: string): Promise<{
  addedSkus: string[];
  skippedSkus: string[];
  stockWarnings: string[];
}> {
  const response = await performFetch(`/api/account/orders/${encodeURIComponent(orderNumber)}/reorder`, {
    method: 'POST',
    credentials: 'include',
  });
  assertResponseOk(response, 'reorder');
  return response.json();
}

export async function fetchSavedAddresses(): Promise<SavedAddressDto[]> {
  const response = await performFetch('/api/account/addresses', { credentials: 'include' });
  assertResponseOk(response, 'addresses');
  const body = await response.json();
  return z.array(savedAddressDtoSchema).parse(body.addresses);
}

export async function saveAddress(input: SavedAddressInput): Promise<SavedAddressDto> {
  const response = await performFetch('/api/account/addresses', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  assertResponseOk(response, 'save address');
  return savedAddressDtoSchema.parse(await response.json());
}

export async function updateSavedAddress(id: string, input: SavedAddressInput): Promise<SavedAddressDto> {
  const response = await performFetch(`/api/account/addresses/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  assertResponseOk(response, 'update address');
  return savedAddressDtoSchema.parse(await response.json());
}

export async function deleteSavedAddress(id: string, newDefaultId?: string): Promise<void> {
  const response = await performFetch(`/api/account/addresses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newDefaultId }),
  });
  assertResponseOk(response, 'delete address');
}

export async function setDefaultAddress(id: string): Promise<void> {
  const response = await performFetch(`/api/account/addresses/${encodeURIComponent(id)}/default`, {
    method: 'PATCH',
    credentials: 'include',
  });
  assertResponseOk(response, 'set default address');
}

export async function fetchSavedPaymentMethods(): Promise<SavedPaymentMethodDto[]> {
  const response = await performFetch('/api/account/payment-methods', { credentials: 'include' });
  assertResponseOk(response, 'payment methods');
  const body = await response.json();
  return z.array(savedPaymentMethodDtoSchema).parse(body.methods);
}

export async function saveVendorPaymentMethod(input: {
  vendor: 'stripewave' | 'paynova' | 'vaultpay';
  vendorToken: string;
}): Promise<SavedPaymentMethodDto> {
  const response = await performFetch('/api/account/payment-methods', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  assertResponseOk(response, 'save payment method');
  return savedPaymentMethodDtoSchema.parse(await response.json());
}

export async function deleteSavedPaymentMethod(id: string, newDefaultId?: string): Promise<void> {
  const response = await performFetch(`/api/account/payment-methods/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newDefaultId }),
  });
  assertResponseOk(response, 'delete payment method');
}

export async function setDefaultPaymentMethod(id: string): Promise<void> {
  const response = await performFetch(`/api/account/payment-methods/${encodeURIComponent(id)}/default`, {
    method: 'PATCH',
    credentials: 'include',
  });
  assertResponseOk(response, 'set default payment method');
}
