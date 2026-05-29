import type { VendorPaymentResult, VendorRefundResult, IPaymentVendorAdapter } from './vendor.types';

const HARD_DECLINE_SUFFIX = '7777';

export class PayNovaAdapter implements IPaymentVendorAdapter {
  readonly vendorCode = 'paynova' as const;

  async authorizeCaptureSettle(): Promise<VendorPaymentResult> {
    return { success: false, declineReason: 'use wallet flow' };
  }

  async startWalletSession(orderNumber: string, _total: number): Promise<VendorPaymentResult> {
    return {
      success: false,
      redirectUrl: `/checkout/payment/paynova?order=${encodeURIComponent(orderNumber)}`,
    };
  }

  async completeWalletAuth(orderNumber: string, authorized: boolean): Promise<VendorPaymentResult> {
    if (!authorized) {
      return {
        success: false,
        hardDecline: true,
        declineReason: 'PayNova wallet payment declined — insufficient wallet balance',
      };
    }
    return {
      success: true,
      maskedPaymentMethod: 'PayNova wallet',
      vendorTransactionReference: `PN-${orderNumber}`,
    };
  }

  async refund(walletSessionRef: string, amount: number): Promise<VendorRefundResult> {
    return { success: true, refundReference: `pn_ref_${walletSessionRef}` };
  }
}

export function simulatePayNovaHardDecline(cardOrToken: string): boolean {
  return cardOrToken.replace(/\s/g, '').endsWith(HARD_DECLINE_SUFFIX);
}
