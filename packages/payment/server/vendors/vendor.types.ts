import type { PaymentResult } from '@pawplace/payment-shared';

export interface VendorPaymentResult extends PaymentResult {
  hardDecline?: boolean;
  transientError?: boolean;
  vendorTransactionReference?: string;
  instalmentReference?: string;
  redirectUrl?: string;
}

export interface VendorRefundResult {
  success: boolean;
  refundReference?: string;
  error?: string;
  transient?: boolean;
}

export interface IPaymentVendorAdapter {
  readonly vendorCode: 'stripewave' | 'paynova' | 'vaultpay';
  authorizeCaptureSettle(orderNumber: string, total: number, cardNumber: string): Promise<VendorPaymentResult>;
  startWalletSession?(orderNumber: string, total: number): Promise<VendorPaymentResult>;
  startBnplSession?(orderNumber: string, total: number): Promise<VendorPaymentResult>;
  completeWalletAuth?(orderNumber: string, authorized: boolean): Promise<VendorPaymentResult>;
  acceptInstalmentPlan?(orderNumber: string, accepted: boolean): Promise<VendorPaymentResult>;
  refund?(paymentRef: string, amount: number): Promise<VendorRefundResult>;
}
