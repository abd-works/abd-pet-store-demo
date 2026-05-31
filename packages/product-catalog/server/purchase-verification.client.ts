import type { OrderRepository } from '../../order/server/order.repository';
import type { CustomerAccountRepository } from '../../customer-account/server/customer-account.repository';

export interface PurchaseVerificationClient {
  hasPurchased(accountId: string, sku: string): Promise<boolean>;
}

export class OrderPurchaseVerificationClient implements PurchaseVerificationClient {
  constructor(
    private readonly accounts: CustomerAccountRepository,
    private readonly orders: OrderRepository,
  ) {}

  async hasPurchased(accountId: string, sku: string): Promise<boolean> {
    const account = await this.accounts.findById(accountId);
    if (!account) return false;

    const orders = this.orders.listByGuestEmail
      ? await this.orders.listByGuestEmail(account.email)
      : [];

    return orders.some((order) =>
      order.items.some((item) => item.sku === sku && order.status !== 'cancelled'),
    );
  }
}
