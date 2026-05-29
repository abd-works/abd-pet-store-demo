import type { OrderDto } from '@pawplace/order-shared';
import { orderDtoSchema } from '@pawplace/order-shared';
import type { PaymentCardInput, PayOrderRequest, PaymentRetryStatus, PaymentVendor } from '@pawplace/payment-shared';
import { performFetch } from '../../shared/http-io';

export interface PaymentErrorBody {
  error: string;
  retryAllowed?: boolean;
  retryAfterMs?: number;
  hardDecline?: boolean;
  retrying?: boolean;
  attemptCount?: number;
  maxAttempts?: number;
  restoreSelector?: boolean;
  retryExhausted?: boolean;
  redirectUrl?: string;
  vendor?: string;
  awaitingWebhook?: boolean;
}

export async function payOrder(
  orderNumber: string,
  request: PaymentCardInput | PayOrderRequest,
): Promise<OrderDto> {
  const response = await performFetch(`/api/orders/${encodeURIComponent(orderNumber)}/pay`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const body = await response.json();
  if (!response.ok) {
    throw Object.assign(new Error((body as PaymentErrorBody).error ?? 'payment failed'), {
      status: response.status,
      body: body as PaymentErrorBody,
    });
  }
  return orderDtoSchema.parse(body);
}

export async function startVendorPayment(
  orderNumber: string,
  vendor: PaymentVendor,
): Promise<{ redirectUrl?: string }> {
  const response = await performFetch(`/api/orders/${encodeURIComponent(orderNumber)}/pay`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vendor }),
  });
  const body = await response.json();
  if (response.status === 202 || response.status === 200) {
    return body as { redirectUrl?: string };
  }
  if (response.status === 402 || response.status === 503 || response.status === 409) {
    throw Object.assign(new Error((body as PaymentErrorBody).error ?? 'payment failed'), {
      status: response.status,
      body: body as PaymentErrorBody,
    });
  }
  if (!response.ok) {
    throw Object.assign(new Error((body as PaymentErrorBody).error ?? 'payment failed'), {
      status: response.status,
      body: body as PaymentErrorBody,
    });
  }
  return body as { redirectUrl?: string };
}

export async function fetchPaymentRetryStatus(orderNumber: string): Promise<PaymentRetryStatus> {
  const response = await performFetch(
    `/api/payment-retries/${encodeURIComponent(orderNumber)}/status`,
    { credentials: 'include' },
  );
  const body = await response.json();
  if (!response.ok) {
    throw new Error((body as { error?: string }).error ?? 'retry status unavailable');
  }
  return body as PaymentRetryStatus;
}
