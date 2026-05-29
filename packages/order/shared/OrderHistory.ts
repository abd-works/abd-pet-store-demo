/** << Entity >> — chronicle of orders for a verified customer account (Increment 4). */
export class OrderHistory {
  readonly owningCustomerAccountId: string;
  readonly associatedOrderNumbers: string[];

  constructor(owningCustomerAccountId: string, associatedOrderNumbers: string[] = []) {
    this.owningCustomerAccountId = owningCustomerAccountId;
    this.associatedOrderNumbers = associatedOrderNumbers;
  }

  get isEmpty(): boolean {
    return this.associatedOrderNumbers.length === 0;
  }

  contains(orderNumber: string): boolean {
    return this.associatedOrderNumbers.includes(orderNumber);
  }

  /** CRC: lists all orders associated with the account, most recent first. */
  static sortMostRecentFirst(orderNumbers: string[], placedAtByOrder: Map<string, Date>): string[] {
    return [...orderNumbers].sort(
      (a, b) => (placedAtByOrder.get(b)?.getTime() ?? 0) - (placedAtByOrder.get(a)?.getTime() ?? 0),
    );
  }

  /** CRC: retroactive guest order inclusion when email matches registered account. */
  includeRetroactiveGuestOrder(orderNumber: string): void {
    if (!this.contains(orderNumber)) {
      this.associatedOrderNumbers.push(orderNumber);
    }
  }
}
