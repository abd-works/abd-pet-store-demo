import type { PaymentCardInput } from './payment.schema';

export type PaymentCardValidationError =
  | 'invalid card number'
  | 'invalid expiry'
  | 'invalid CVV';

export function validatePaymentCard(input: PaymentCardInput): PaymentCardValidationError | null {
  const digits = input.cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits)) return 'invalid card number';
  if (!/^\d{2}\/\d{2}$/.test(input.expiry)) return 'invalid expiry';
  if (!/^\d{3,4}$/.test(input.cvv)) return 'invalid CVV';
  return null;
}

export function isPaymentCardValid(input: PaymentCardInput): boolean {
  return validatePaymentCard(input) === null;
}
