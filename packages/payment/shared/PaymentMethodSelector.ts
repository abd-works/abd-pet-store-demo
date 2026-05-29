import type { PaymentVendor } from './payment-vendor.schema';

const ALL_VENDORS: PaymentVendor[] = ['stripewave', 'paynova', 'vaultpay'];

/** << Service >> — multi-vendor checkout presentation and charge routing. */
export class PaymentMethodSelector {
  readonly associatedOrderNumber: string;
  selectedVendor: PaymentVendor | null = null;
  readonly availableVendors: PaymentVendor[];

  private constructor(associatedOrderNumber: string, availableVendors: PaymentVendor[]) {
    this.associatedOrderNumber = associatedOrderNumber;
    this.availableVendors = availableVendors;
  }

  static forOrder(order: { orderNumber: string }): PaymentMethodSelector {
    return new PaymentMethodSelector(order.orderNumber, [...ALL_VENDORS]);
  }

  presentStripeWaveCardEntry(): boolean {
    return this.availableVendors.includes('stripewave');
  }

  presentPayNovaDigitalWallet(): boolean {
    return this.availableVendors.includes('paynova');
  }

  presentVaultPayBuyNowPayLater(): boolean {
    return this.availableVendors.includes('vaultpay');
  }

  routeChargeToSelectedVendor(vendor: PaymentVendor): PaymentVendor {
    if (!this.availableVendors.includes(vendor)) {
      throw new Error('selected vendor must be offered at payment method selector');
    }
    this.selectedVendor = vendor;
    return vendor;
  }

  displayAlternativesOnDecline(): PaymentVendor[] {
    return [...this.availableVendors];
  }
}
