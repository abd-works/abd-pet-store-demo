import type { MarketingDispatchService } from './marketing-dispatch.service';

/** Subscribes to stock-availability transitions and triggers restock alerts. */
export class RestockAlertListener {
  constructor(private readonly dispatch: MarketingDispatchService) {}

  async onStockAvailable(sku: string, productName: string): Promise<void> {
    await this.dispatch.sendRestockAlert(sku, productName);
  }
}
