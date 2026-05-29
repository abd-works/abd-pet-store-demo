import type { OrderService } from '../../order/server/order.service';
import type { SavedPaymentService } from '../../customer-account/server/saved-payment.service';
import type { SessionService } from '../../customer-account/server/session.service';
import { PaymentController, WebhookController } from './payment.controller';
import { PaymentService } from './payment.service';
import { createPaymentRouter } from './payment.routes';
import { StripeWaveAdapter } from './stripewave.adapter';
import { PayNovaAdapter } from './vendors/paynova.adapter';
import { VaultPayAdapter } from './vendors/vaultpay.adapter';

export interface PaymentModuleDeps {
  savedPaymentService?: SavedPaymentService;
  sessionService?: SessionService;
}

export function createPaymentModule(orderService: OrderService, deps: PaymentModuleDeps = {}) {
  const service = new PaymentService(
    orderService,
    new StripeWaveAdapter(),
    new PayNovaAdapter(),
    new VaultPayAdapter(),
    deps.savedPaymentService,
    deps.sessionService,
  );
  const paymentController = new PaymentController(service);
  const webhookController = new WebhookController(orderService);
  return {
    paymentRouter: createPaymentRouter(paymentController, webhookController),
    paymentService: service,
  };
}

export { StripeWaveAdapter, PaymentService };
