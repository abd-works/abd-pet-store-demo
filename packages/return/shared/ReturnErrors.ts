/** Raised when a return is attempted on an order that fails eligibility checks. */
export class ReturnIneligibleError extends Error {
  readonly orderNumber: string;
  readonly ineligibilityReason: string;

  constructor(orderNumber: string, reason: string) {
    super(`return ineligible for order ${orderNumber}: ${reason}`);
    this.name = 'ReturnIneligibleError';
    this.orderNumber = orderNumber;
    this.ineligibilityReason = reason;
  }
}
