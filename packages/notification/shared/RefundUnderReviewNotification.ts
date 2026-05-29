/** << Domain Template >> — "refund under review" notification content. */
export class RefundUnderReviewNotification {
  readonly to: string;
  readonly subject: string;
  readonly orderNumber: string;
  readonly returnReference: string;
  readonly message: string;
  readonly supportGuidance: string;

  constructor(params: {
    recipientEmail: string;
    orderNumber: string;
    returnReference: string;
  }) {
    this.to = params.recipientEmail;
    this.orderNumber = params.orderNumber;
    this.returnReference = params.returnReference;
    this.subject = `PawPlace refund requires review — order ${params.orderNumber}`;
    this.supportGuidance =
      'Please contact support if you need further assistance with your refund.';
    this.message = `Your refund for return ${params.returnReference} requires manual review. ${this.supportGuidance}`;
  }

  renderHtml(): string {
    return `<h2>Refund Under Review</h2>
<p>Order: ${this.orderNumber}</p>
<p>Return: ${this.returnReference}</p>
<p>${this.message}</p>
<p>${this.supportGuidance}</p>`;
  }
}
