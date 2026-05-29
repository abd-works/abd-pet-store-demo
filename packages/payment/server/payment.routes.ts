import { Router } from 'express';
import type { PaymentController, WebhookController } from './payment.controller';

export function createPaymentRouter(
  paymentController: PaymentController,
  webhookController: WebhookController,
): Router {
  const router = Router();
  router.post('/api/orders/:orderNumber/pay', paymentController.pay);
  router.get('/api/payment-retries/:orderNumber/status', paymentController.retryStatus);
  router.post(
    '/api/notifications/payment-retry/:orderNumber/complete',
    paymentController.completeBackgroundRetryNotification,
  );
  router.post('/api/webhooks/stripewave', webhookController.handleStripeWave);
  router.post('/api/webhooks/paynova', webhookController.handlePayNova);
  router.post('/api/webhooks/vaultpay', webhookController.handleVaultPay);
  return router;
}
