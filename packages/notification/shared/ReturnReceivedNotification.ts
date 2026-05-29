/** << Domain Template >> — "return received" notification content. */
export class ReturnReceivedNotification {
  readonly to: string;
  readonly subject: string;
  readonly orderNumber: string;
  readonly returnedItemsSummary: string[];
  readonly message: string;

  constructor(params: {
    recipientEmail: string;
    orderNumber: string;
    returnedItems: Array<{ name: string; quantity: number }>;
  }) {
    this.to = params.recipientEmail;
    this.orderNumber = params.orderNumber;
    this.subject = `PawPlace return received — order ${params.orderNumber}`;
    this.returnedItemsSummary = params.returnedItems.map(
      (item) => `${item.name} (qty: ${item.quantity})`,
    );
    this.message =
      'Your return has been received and inspection is underway. We will process your refund once inspection is complete.';
  }

  renderHtml(): string {
    const itemList = this.returnedItemsSummary.map((s) => `<li>${s}</li>`).join('');
    return `<h2>Return Received</h2>
<p>Order: ${this.orderNumber}</p>
<p>Items returned:</p>
<ul>${itemList}</ul>
<p>${this.message}</p>`;
  }
}
