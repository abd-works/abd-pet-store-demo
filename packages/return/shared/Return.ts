import { ReturnStatus, type ReturnStatusLabel } from './ReturnStatus';
import { ReturnLabel } from './ReturnLabel';
import { ReturnQRCode } from './ReturnQRCode';
import { ManagerOverride } from './ManagerOverride';
import type { ReturnReasonCategory, ItemCondition } from './ReturnRequest';

export type ReturnChannel = 'online' | 'in_store';

export interface ReturnedItemSnapshot {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

/** << Entity >> — a customer or staff-initiated return against an order. */
export class Return {
  readonly returnId: string;
  readonly orderNumber: string;
  readonly returnedItems: ReturnedItemSnapshot[];
  readonly returnReason: ReturnReasonCategory;
  readonly itemCondition: ItemCondition;
  readonly channel: ReturnChannel;
  readonly initiatedBy?: string;
  readonly createdAt: Date;
  private _statusMachine: ReturnStatus;
  returnLabel!: ReturnLabel;
  returnQrCode!: ReturnQRCode;
  managerOverride?: ManagerOverride;

  private constructor(params: {
    returnId: string;
    orderNumber: string;
    returnedItems: ReturnedItemSnapshot[];
    returnReason: ReturnReasonCategory;
    itemCondition: ItemCondition;
    channel: ReturnChannel;
    initiatedBy?: string;
  }) {
    this.returnId = params.returnId;
    this.orderNumber = params.orderNumber;
    this.returnedItems = params.returnedItems;
    this.returnReason = params.returnReason;
    this.itemCondition = params.itemCondition;
    this.channel = params.channel;
    this.initiatedBy = params.initiatedBy;
    this._statusMachine = ReturnStatus.initiated();
    this.createdAt = new Date();
  }

  get returnStatus(): ReturnStatusLabel {
    return this._statusMachine.value;
  }

  get currentStatus(): ReturnStatusLabel {
    return this._statusMachine.value;
  }

  static initiate(params: {
    returnId?: string;
    orderNumber: string;
    returnedItems: ReturnedItemSnapshot[] | Array<{ sku: string; quantity: number }>;
    returnReason: ReturnReasonCategory;
    itemCondition: ItemCondition;
    channel?: ReturnChannel;
    initiatedBy?: string;
  }): Return {
    const items: ReturnedItemSnapshot[] = params.returnedItems.map((item) => ({
      sku: item.sku,
      name: (item as ReturnedItemSnapshot).name ?? item.sku,
      quantity: item.quantity,
      unitPrice: (item as ReturnedItemSnapshot).unitPrice ?? 0,
    }));

    return new Return({
      returnId: params.returnId ?? generateReturnId(),
      orderNumber: params.orderNumber,
      returnedItems: items,
      returnReason: params.returnReason,
      itemCondition: params.itemCondition,
      channel: params.channel ?? 'online',
      initiatedBy: params.initiatedBy,
    });
  }

  transitionStatus(newStatus: ReturnStatusLabel): void {
    if (newStatus === this.returnStatus) return;
    this._statusMachine = this._statusMachine.transitionTo(newStatus);
  }

  attachLabel(label: ReturnLabel, qrCode: ReturnQRCode): void {
    this.returnLabel = label;
    this.returnQrCode = qrCode;
  }

  applyOverride(override: ManagerOverride): void {
    this.managerOverride = override;
  }

  returnedItemsValue(): number {
    return this.returnedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }
}

export function generateReturnId(): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `RTN-${suffix}`;
}
