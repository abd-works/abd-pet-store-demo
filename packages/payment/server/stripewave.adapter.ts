import type { VendorPaymentResult, VendorRefundResult, IPaymentVendorAdapter } from './vendors/vendor.types';

const UNAVAILABLE_CARD_SUFFIX = '0503';
const DECLINED_CARD_SUFFIX = '0002';
const TRANSIENT_ERROR_SUFFIX = '0501';
const DEFAULT_UNAVAILABLE_RETRY_MS = 3000;

export class StripeWaveAdapter implements IPaymentVendorAdapter {
  readonly vendorCode = 'stripewave' as const;

  constructor(private readonly simulateUnavailable = false) {}

  async authorizeCaptureSettle(
    _orderNumber: string,
    _total: number,
    cardNumber: string,
  ): Promise<VendorPaymentResult> {
    if (this.simulateUnavailable) {
      return { success: false, unavailable: true, retryAfterMs: DEFAULT_UNAVAILABLE_RETRY_MS };
    }

    const normalized = cardNumber.replace(/\s/g, '');
    if (normalized.endsWith(UNAVAILABLE_CARD_SUFFIX)) {
      return { success: false, unavailable: true, retryAfterMs: DEFAULT_UNAVAILABLE_RETRY_MS };
    }
    if (normalized.endsWith(TRANSIENT_ERROR_SUFFIX)) {
      return { success: false, transientError: true, declineReason: 'transient network error' };
    }
    if (normalized.endsWith(DECLINED_CARD_SUFFIX)) {
      return { success: false, hardDecline: true, declineReason: 'card declined' };
    }

    const lastFour = normalized.slice(-4);
    return {
      success: true,
      maskedPaymentMethod: `StripeWave •••• ${lastFour}`,
    };
  }

  async refund(paymentRef: string, amount: number): Promise<VendorRefundResult> {
    if (this.simulateUnavailable) {
      return { success: false, error: 'StripeWave vendor downtime', transient: true };
    }
    return { success: true, refundReference: `sw_ref_${paymentRef}` };
  }
}

