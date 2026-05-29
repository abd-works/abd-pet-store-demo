/** << Domain Template >> — "refund completed" notification content. */
export class RefundCompletedNotification {
  readonly to: string;
  readonly subject: string;
  readonly refundedAmount: string;
  readonly paymentMethod: string;
  readonly message: string;

  constructor(params: {
    recipientEmail: string;
    refundedAmount: number;
    paymentMethod: string;
  }) {
    this.to = params.recipientEmail;
    this.refundedAmount = `£${params.refundedAmount.toFixed(2)}`;
    this.paymentMethod = params.paymentMethod;
    this.subject = `PawPlace refund completed — ${this.refundedAmount}`;
    this.message = `Your refund of ${this.refundedAmount} has been processed and returned to your ${params.paymentMethod}.`;
  }

  renderHtml(): string {
    return `<h2>Refund Completed</h2>
<p>Amount: ${this.refundedAmount}</p>
<p>Returned to: ${this.paymentMethod}</p>
<p>${this.message}</p>`;
  }
}
