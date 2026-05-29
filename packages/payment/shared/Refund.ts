import type { PaymentVendor } from './payment-vendor.schema';
import { RefundStatus, type RefundStatusLabel } from './RefundStatus';

/** << Entity >> — refund routed through the original payment vendor. */
export class Refund {
  readonly refundId: string;
  readonly orderNumber: string;
  readonly returnId: string;
  readonly vendor: PaymentVendor;
  readonly amount: number;
  private _statusMachine: RefundStatus;
  readonly createdAt: Date;

  private constructor(params: {
    refundId: string;
    orderNumber: string;
    returnId: string;
    vendor: PaymentVendor;
    amount: number;
  }) {
    this.refundId = params.refundId;
    this.orderNumber = params.orderNumber;
    this.returnId = params.returnId;
    this.vendor = params.vendor;
    this.amount = params.amount;
    this._statusMachine = RefundStatus.processing();
    this.createdAt = new Date();
  }

  get refundStatus(): RefundStatusLabel {
    return this._statusMachine.value;
  }

  get currentStatus(): RefundStatusLabel {
    return this._statusMachine.value;
  }

  static create(params: {
    refundId?: string;
    orderNumber: string;
    returnId: string;
    vendor: PaymentVendor;
    amount: number;
  }): Refund {
    if (params.amount <= 0) throw new Error('refund amount must be positive');
    return new Refund({
      refundId: params.refundId ?? generateRefundId(),
      orderNumber: params.orderNumber,
      returnId: params.returnId,
      vendor: params.vendor,
      amount: params.amount,
    });
  }

  transitionStatus(newStatus: RefundStatusLabel): void {
    if (newStatus === this.refundStatus) return;
    this._statusMachine = this._statusMachine.transitionTo(newStatus);
  }

  get formattedAmount(): string {
    return `£${(this.amount / 100).toFixed(2)}`;
  }
}

export function generateRefundId(): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `REF-${suffix}`;
}
