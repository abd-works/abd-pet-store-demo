import type {
  ReturnDto,
  ReturnEligibilityDto,
  ReturnRequestInput,
  RefundDto,
  StaffReturnRequestInput,
} from '../shared/return.schema';
import { returnDtoSchema, returnEligibilitySchema, refundDtoSchema } from '../shared/return.schema';
import { performFetch } from '../../shared/http-io';
import { assertResponseOk } from '../../shared/http-client';
import { z } from 'zod';

export async function checkReturnEligibility(orderNumber: string): Promise<ReturnEligibilityDto> {
  const response = await performFetch(
    `/api/account/orders/${encodeURIComponent(orderNumber)}/return-eligibility`,
    { credentials: 'include' },
  );
  assertResponseOk(response, 'return eligibility');
  return returnEligibilitySchema.parse(await response.json());
}

export async function initiateReturn(input: ReturnRequestInput): Promise<ReturnDto> {
  const response = await performFetch(
    `/api/account/orders/${encodeURIComponent(input.orderNumber)}/returns`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );
  assertResponseOk(response, 'initiate return');
  return returnDtoSchema.parse(await response.json());
}

export async function fetchReturn(returnId: string): Promise<ReturnDto> {
  const response = await performFetch(
    `/api/returns/${encodeURIComponent(returnId)}`,
    { credentials: 'include' },
  );
  assertResponseOk(response, 'return detail');
  return returnDtoSchema.parse(await response.json());
}

export async function fetchReturnsForOrder(orderNumber: string): Promise<ReturnDto[]> {
  const response = await performFetch(
    `/api/account/orders/${encodeURIComponent(orderNumber)}/returns`,
    { credentials: 'include' },
  );
  assertResponseOk(response, 'order returns');
  const body = await response.json();
  return z.array(returnDtoSchema).parse(body.returns);
}

export async function fetchRefundStatus(orderNumber: string): Promise<RefundDto | null> {
  const response = await performFetch(
    `/api/account/orders/${encodeURIComponent(orderNumber)}/refund-status`,
    { credentials: 'include' },
  );
  if (response.status === 404) return null;
  assertResponseOk(response, 'refund status');
  return refundDtoSchema.parse(await response.json());
}

export async function staffLookupOrder(query: { orderNumber?: string; email?: string }): Promise<{
  orderNumber: string;
  date: string;
  customerName: string;
  email: string;
  items: string;
  total: string;
  orderStatus: string;
} | null> {
  const response = await performFetch('/api/staff/returns/lookup', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  if (response.status === 404) return null;
  assertResponseOk(response, 'staff order lookup');
  return response.json();
}

export async function staffInitiateReturn(input: StaffReturnRequestInput): Promise<ReturnDto> {
  const response = await performFetch(
    `/api/staff/returns`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );
  assertResponseOk(response, 'staff initiate return');
  return returnDtoSchema.parse(await response.json());
}

export async function fetchOrderReturnStatuses(orderNumbers: string[]): Promise<
  Record<string, { eligible: boolean; reason?: string; hasActiveReturn: boolean }>
> {
  const response = await performFetch('/api/account/returns/statuses', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumbers }),
  });
  assertResponseOk(response, 'order return statuses');
  return response.json();
}

export type { ReturnDto, ReturnEligibilityDto, ReturnRequestInput, RefundDto, StaffReturnRequestInput };
