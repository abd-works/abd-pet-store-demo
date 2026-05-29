import { Router } from 'express';
import type { CustomerAccountFixtureApi } from './customer-account.fixture-api';

export function createCustomerAccountTestRouter(fixtures: CustomerAccountFixtureApi): Router {
  const router = Router();
  router.get('/test/customer-accounts/verification-token', fixtures.getVerificationToken);
  router.get('/test/customer-accounts/reset-token', fixtures.getResetToken);
  router.post('/test/customer-accounts/expire-verification-token', fixtures.expireVerificationToken);
  router.post('/test/customer-accounts/mark-verified', fixtures.markVerified);
  router.delete('/test/customer-accounts', fixtures.deleteAccounts);
  router.post('/test/customer-accounts/payment-methods', fixtures.seedPaymentMethod);
  return router;
}
