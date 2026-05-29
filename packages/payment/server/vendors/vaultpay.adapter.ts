import type { VendorPaymentResult, VendorRefundResult, IPaymentVendorAdapter } from './vendor.types';

export class VaultPayAdapter implements IPaymentVendorAdapter {
  readonly vendorCode = 'vaultpay' as const;

  async authorizeCaptureSettle(): Promise<VendorPaymentResult> {
    return { success: false, declineReason: 'use BNPL flow' };
  }

  async startBnplSession(orderNumber: string, _total: number): Promise<VendorPaymentResult> {
    return {
      success: false,
      redirectUrl: `/checkout/payment/vaultpay?order=${encodeURIComponent(orderNumber)}`,
    };
  }

  async acceptInstalmentPlan(orderNumber: string, accepted: boolean): Promise<VendorPaymentResult> {
    if (!accepted) {
      return {
        success: false,
        hardDecline: true,
        declineReason: 'instalment plan declined',
      };
    }
    return {
      success: true,
      maskedPaymentMethod: 'VaultPay buy-now-pay-later',
      instalmentReference: `VP-${orderNumber}`,
    };
  }

  async runEligibilityCheck(_orderNumber: string): Promise<{ eligible: boolean; reason?: string }> {
    return { eligible: true };
  }

  async refund(instalmentPlanRef: string, amount: number): Promise<VendorRefundResult> {
    return { success: true, refundReference: `vp_ref_${instalmentPlanRef}` };
  }
}
