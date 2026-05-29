import type { PaymentVendor } from '../shared/payment-vendor.schema';

const MAX_ATTEMPTS = 3;
const RETRY_WINDOW_MS = 60_000;

interface RetryState {
  orderNumber: string;
  vendor: PaymentVendor;
  attemptCount: number;
  startedAt: number;
  retrying: boolean;
  exhausted: boolean;
  hardDecline: boolean;
  declineReason?: string;
}

const retryStates = new Map<string, RetryState>();

export class PaymentRetryService {
  startRetry(orderNumber: string, vendor: PaymentVendor, declineReason?: string): RetryState {
    const existing = retryStates.get(orderNumber);
    const attemptCount = (existing?.attemptCount ?? 0) + 1;
    const startedAt = existing?.startedAt ?? Date.now();
    const exhausted = attemptCount >= MAX_ATTEMPTS || Date.now() - startedAt > RETRY_WINDOW_MS;
    const state: RetryState = {
      orderNumber,
      vendor,
      attemptCount,
      startedAt,
      retrying: !exhausted,
      exhausted,
      hardDecline: false,
      declineReason,
    };
    retryStates.set(orderNumber, state);
    return state;
  }

  markHardDecline(orderNumber: string, vendor: PaymentVendor, declineReason: string): RetryState {
    const state: RetryState = {
      orderNumber,
      vendor,
      attemptCount: 0,
      startedAt: Date.now(),
      retrying: false,
      exhausted: false,
      hardDecline: true,
      declineReason,
    };
    retryStates.set(orderNumber, state);
    return state;
  }

  clear(orderNumber: string): void {
    retryStates.delete(orderNumber);
  }

  getStatus(orderNumber: string): RetryState | null {
    return retryStates.get(orderNumber) ?? null;
  }

  toDto(state: RetryState) {
    return {
      orderNumber: state.orderNumber,
      retrying: state.retrying,
      attemptCount: state.attemptCount,
      maxAttempts: MAX_ATTEMPTS,
      exhausted: state.exhausted,
      hardDecline: state.hardDecline,
      declineReason: state.declineReason,
      vendor: state.vendor,
    };
  }
}
