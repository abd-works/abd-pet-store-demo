import { HttpStatus } from '../../shared/http-status';

import type { OrderService } from '../../order/server/order.service';

import {
  OrderNotFoundError,
  OrderNotPendingPaymentError,
} from '../../order/server/order.errors';

import type { PayOrderRequest, PaymentVendor } from '@pawplace/payment-shared';

import type { IPaymentVendorAdapter } from './vendors/vendor.types';
import { PaymentRetryService } from './payment-retry.service';
import { PayNovaAdapter } from './vendors/paynova.adapter';
import { VaultPayAdapter } from './vendors/vaultpay.adapter';
import { StripeWaveAdapter } from './stripewave.adapter';
import type { SavedPaymentService } from '../../customer-account/server/saved-payment.service';
import type { SessionService } from '../../customer-account/server/session.service';

type PaymentFailure = {
  ok: false;
  status: number;
  body: Record<string, unknown>;
};

type PaymentSuccess = {
  ok: true;
  order: Awaited<ReturnType<OrderService['confirmPayment']>>;
};

export type PayOrderResult = PaymentFailure | PaymentSuccess;

const STRIPEWAVE_UNAVAILABLE_RETRY_MS = 3000;

export class PaymentService {
  private readonly adapters: Record<PaymentVendor, IPaymentVendorAdapter>;
  readonly retryService = new PaymentRetryService();

  constructor(
    private readonly orderService: OrderService,
    stripewave: IPaymentVendorAdapter = new StripeWaveAdapter(),
    paynova: IPaymentVendorAdapter = new PayNovaAdapter(),
    vaultpay: IPaymentVendorAdapter = new VaultPayAdapter(),
    private readonly savedPayment?: SavedPaymentService,
    private readonly sessionService?: SessionService,
  ) {
    this.adapters = {
      stripewave,
      paynova,
      vaultpay,
    };
  }

  async payOrder(orderNumber: string, request: PayOrderRequest, sessionId: string): Promise<PayOrderResult> {
    if (request.savedPaymentMethodId) {
      return this.chargeWithSavedToken(orderNumber, request.savedPaymentMethodId, sessionId);
    }

    const vendor: PaymentVendor = request.vendor ?? 'stripewave';
    const order = await this.orderService.getOrderEntity(orderNumber);
    if (!order) throw new OrderNotFoundError(orderNumber);
    if (order.status !== 'pending_payment') {
      throw new OrderNotPendingPaymentError();
    }

    const adapter = this.adapters[vendor];

    if (vendor === 'paynova' && !request.cardNumber) {
      const session = await adapter.startWalletSession?.(orderNumber, order.subtotal);
      if (session?.redirectUrl) {
        return { ok: false, status: HttpStatus.ACCEPTED, body: { redirectUrl: session.redirectUrl, vendor } };
      }
    }

    if (vendor === 'vaultpay' && request.acceptInstalmentPlan === undefined) {
      const session = await adapter.startBnplSession?.(orderNumber, order.subtotal);
      if (session?.redirectUrl) {
        const body: Record<string, unknown> = { redirectUrl: session.redirectUrl, vendor };
        const hasSavedVaultPay = await this.accountHasSavedVendor(sessionId, 'vaultpay');
        if (hasSavedVaultPay) {
          body.eligibilityCheckRequired = true;
        }
        return { ok: false, status: HttpStatus.ACCEPTED, body };
      }
    }

    if (vendor === 'paynova' && request.cardNumber) {
      const authorized = request.cardNumber === 'authorized';
      const result = await adapter.completeWalletAuth?.(orderNumber, authorized);
      const saveOffer = authorized ? await this.shouldOfferPayNovaSave(sessionId) : false;
      return this.finalizeVendorResult(orderNumber, result, sessionId, vendor, saveOffer);
    }

    if (vendor === 'vaultpay' && request.acceptInstalmentPlan !== undefined) {
      const result = await adapter.acceptInstalmentPlan?.(orderNumber, request.acceptInstalmentPlan);
      return this.finalizeVendorResult(orderNumber, result, sessionId, vendor);
    }

    const cardNumber = request.cardNumber ?? '4242424242424242';
    const result = await adapter.authorizeCaptureSettle(orderNumber, order.subtotal, cardNumber);

    if (result.unavailable) {
      return this.unavailableResponse(result.retryAfterMs);
    }

    if (result.hardDecline) {
      this.retryService.markHardDecline(orderNumber, vendor, result.declineReason ?? 'payment declined');
      return {
        ok: false,
        status: HttpStatus.PAYMENT_REQUIRED,
        body: { error: result.declineReason ?? 'payment declined', hardDecline: true, vendor },
      };
    }

    if (result.transientError) {
      await this.orderService.setAutomaticPaymentRetryInProgress(orderNumber, true);
      const retryState = this.retryService.startRetry(orderNumber, vendor, result.declineReason);
      if (retryState.exhausted) {
        await this.orderService.setAutomaticPaymentRetryInProgress(orderNumber, false);
        return {
          ok: false,
          status: HttpStatus.CONFLICT,
          body: { error: 'payment could not be processed', restoreSelector: true, retryExhausted: true },
        };
      }
      return {
        ok: false,
        status: HttpStatus.SERVICE_UNAVAILABLE,
        body: {
          error: result.declineReason ?? 'transient network error',
          retrying: true,
          attemptCount: retryState.attemptCount,
          maxAttempts: 3,
        },
      };
    }

    if (!result.success) {
      return this.declinedResponse(result.declineReason);
    }

    this.retryService.clear(orderNumber);
    const masked =
      result.maskedPaymentMethod ??
      (vendor === 'paynova'
        ? `PayNova • ${result.vendorTransactionReference ?? orderNumber}`
        : vendor === 'vaultpay'
          ? `VaultPay • ${result.instalmentReference ?? orderNumber}`
          : 'StripeWave');

    const confirmed = await this.orderService.confirmPayment(orderNumber, masked, sessionId, {
      processingVendor: vendor,
      vendorTransactionReference: result.vendorTransactionReference ?? result.instalmentReference,
    });
    return { ok: true, order: confirmed };
  }

  async completeBackgroundRetry(orderNumber: string, sessionId: string): Promise<OrderDto | null> {
    const order = await this.orderService.getOrderEntity(orderNumber);
    if (!order || order.status !== 'pending_payment') {
      return null;
    }
    const retryState = this.retryService.getStatus(orderNumber);
    const vendor = retryState?.vendor ?? 'stripewave';
    const adapter = this.adapters[vendor];
    const result = await adapter.authorizeCaptureSettle(orderNumber, order.subtotal, '4242424242424242');
    if (!result.success) {
      return null;
    }
    this.retryService.clear(orderNumber);
    return this.orderService.confirmPayment(
      orderNumber,
      result.maskedPaymentMethod ?? 'StripeWave',
      sessionId,
      { processingVendor: vendor },
    );
  }

  private async chargeWithSavedToken(
    orderNumber: string,
    methodId: string,
    sessionId: string,
  ): Promise<PayOrderResult> {
    if (!this.savedPayment || !this.sessionService) {
      return { ok: false, status: 400, body: { error: 'saved payment not configured' } };
    }

    let accountId: string;
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(sessionId);
      accountId = principal.accountId;
    } catch {
      return { ok: false, status: 401, body: { error: 'Authentication required' } };
    }

    const method = this.savedPayment.getMethod(accountId, methodId);
    if (!method) {
      return { ok: false, status: 404, body: { error: 'saved payment method not found' } };
    }
    if (method.isExpired) {
      return {
        ok: false,
        status: HttpStatus.PAYMENT_REQUIRED,
        body: { error: 'expired saved payment method', hardDecline: true },
      };
    }

    const vendorToken = this.savedPayment.getVendorToken(accountId, methodId);
    if (!vendorToken) {
      return { ok: false, status: 404, body: { error: 'saved payment token not found' } };
    }

    const vendor = method.vendor ?? 'stripewave';
    const order = await this.orderService.getOrderEntity(orderNumber);
    if (!order) throw new OrderNotFoundError(orderNumber);
    if (order.status !== 'pending_payment') {
      throw new OrderNotPendingPaymentError();
    }

    const adapter = this.adapters[vendor];

    if (vendor === 'paynova') {
      const result = await adapter.completeWalletAuth?.(orderNumber, true);
      const saveOffer = await this.shouldOfferPayNovaSave(sessionId);
      return this.finalizeVendorResult(orderNumber, result, sessionId, vendor, saveOffer);
    }

    if (vendor === 'vaultpay') {
      const vaultAdapter = adapter as VaultPayAdapter;
      const eligibility = await vaultAdapter.runEligibilityCheck?.(orderNumber);
      if (eligibility && !eligibility.eligible) {
        return {
          ok: false,
          status: HttpStatus.PAYMENT_REQUIRED,
          body: {
            error: eligibility.reason ?? 'VaultPay eligibility check failed',
            hardDecline: true,
            vendor,
          },
        };
      }
      const result = await adapter.acceptInstalmentPlan?.(orderNumber, true);
      return this.finalizeVendorResult(orderNumber, result, sessionId, vendor);
    }

    const cardNumber = vendorToken.includes('4242') ? '4242424242424242' : vendorToken;
    const result = await adapter.authorizeCaptureSettle(orderNumber, order.subtotal, cardNumber);

    if (result.unavailable) {
      return this.unavailableResponse(result.retryAfterMs);
    }

    if (result.hardDecline) {
      this.retryService.markHardDecline(orderNumber, vendor, result.declineReason ?? 'payment declined');
      return {
        ok: false,
        status: HttpStatus.PAYMENT_REQUIRED,
        body: { error: result.declineReason ?? 'payment declined', hardDecline: true, vendor },
      };
    }

    if (result.transientError) {
      await this.orderService.setAutomaticPaymentRetryInProgress(orderNumber, true);
      const retryState = this.retryService.startRetry(orderNumber, vendor, result.declineReason);
      if (retryState.exhausted) {
        await this.orderService.setAutomaticPaymentRetryInProgress(orderNumber, false);
        return {
          ok: false,
          status: HttpStatus.CONFLICT,
          body: { error: 'payment could not be processed', restoreSelector: true, retryExhausted: true },
        };
      }
      return {
        ok: false,
        status: HttpStatus.SERVICE_UNAVAILABLE,
        body: {
          error: result.declineReason ?? 'transient network error',
          retrying: true,
          attemptCount: retryState.attemptCount,
          maxAttempts: 3,
        },
      };
    }

    if (!result.success) {
      return this.declinedResponse(result.declineReason);
    }

    this.retryService.clear(orderNumber);
    const masked = result.maskedPaymentMethod ?? `StripeWave •••• ${method.lastFour}`;
    const confirmed = await this.orderService.confirmPayment(orderNumber, masked, sessionId, {
      processingVendor: vendor,
    });
    return { ok: true, order: confirmed };
  }

  private async finalizeVendorResult(
    orderNumber: string,
    result: Awaited<ReturnType<NonNullable<IPaymentVendorAdapter['completeWalletAuth']>>> | undefined,
    sessionId: string,
    vendor: PaymentVendor,
    savePayNovaWalletOffered = false,
  ): Promise<PayOrderResult> {
    if (!result?.success) {
      if (result?.hardDecline) {
        this.retryService.markHardDecline(orderNumber, vendor, result.declineReason ?? 'hard decline');
        return {
          ok: false,
          status: HttpStatus.PAYMENT_REQUIRED,
          body: { error: result.declineReason ?? 'hard decline', hardDecline: true, vendor },
        };
      }
      return this.declinedResponse(result?.declineReason);
    }
    this.retryService.clear(orderNumber);
    const confirmed = await this.orderService.confirmPayment(
      orderNumber,
      result.maskedPaymentMethod ?? vendor,
      sessionId,
      {
        processingVendor: vendor,
        vendorTransactionReference: result.vendorTransactionReference ?? result.instalmentReference,
        savePayNovaWalletOffered,
      },
    );
    return { ok: true, order: confirmed };
  }

  private async shouldOfferPayNovaSave(sessionId: string): Promise<boolean> {
    if (!this.sessionService) return false;
    try {
      await this.sessionService.requireVerifiedPrincipal(sessionId);
      return true;
    } catch {
      return false;
    }
  }

  private async accountHasSavedVendor(sessionId: string, vendor: PaymentVendor): Promise<boolean> {
    if (!this.savedPayment || !this.sessionService) return false;
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(sessionId);
      return this.savedPayment.list(principal.accountId).some((method) => method.vendor === vendor);
    } catch {
      return false;
    }
  }

  private unavailableResponse(retryAfterMs?: number): PaymentFailure {
    return {
      ok: false,
      status: HttpStatus.SERVICE_UNAVAILABLE,
      body: {
        error: 'StripeWave service unavailable',
        retryAfterMs: retryAfterMs ?? STRIPEWAVE_UNAVAILABLE_RETRY_MS,
      },
    };
  }

  private declinedResponse(declineReason?: string): PaymentFailure {
    return {
      ok: false,
      status: HttpStatus.PAYMENT_REQUIRED,
      body: { error: declineReason ?? 'card declined', retryAllowed: true },
    };
  }
}
