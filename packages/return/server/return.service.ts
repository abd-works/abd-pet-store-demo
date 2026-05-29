import { Return } from '../shared/Return';
import { ReturnEligibility, type EligibilityResult, type EligibleItem } from '../shared/ReturnEligibility';
import type { ReturnRequest } from '../shared/ReturnRequest';
import type { IReturnRepository } from './return.repository';
import type { ReturnLabelService } from './return-label.service';
import { lookupOrderFixture } from './order-fixture';

export interface CheckEligibilityResult {
  eligible: boolean;
  reason?: string;
  eligibleItems: EligibleItem[];
  inProgressItems?: EligibleItem[];
}

/** Application service — orchestrates eligibility check, return creation, and label generation. */
export class ReturnService {
  private readonly _eligibility: ReturnEligibility;

  constructor(
    private readonly _returnRepo: IReturnRepository,
    private readonly _labelService: ReturnLabelService,
    private readonly _refundService: unknown,
  ) {
    this._eligibility = new ReturnEligibility();
  }

  async checkEligibility(orderNumber: string): Promise<CheckEligibilityResult> {
    const orderData = lookupOrderFixture(orderNumber);
    if (!orderData) throw new Error(`order not found: ${orderNumber}`);

    const mappedOrder = {
      orderNumber: orderData.orderNumber,
      status: orderData.orderStatus,
      deliveredAt: orderData.deliveredOn,
      items: orderData.lineItems.map((li) => ({
        sku: li.sku,
        name: li.name,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
      })),
    };

    const existingReturns = await this._returnRepo.findByOrderNumber(orderNumber);
    const existingReturnData = existingReturns.map((r) => ({
      returnedItems: r.returnedItems.map((i) => ({ sku: i.sku, quantity: i.quantity })),
      returnStatus: r.returnStatus,
    }));

    const result = this._eligibility.isEligible(mappedOrder, [], existingReturnData);

    const eligibleItems = result.eligibleItems.filter((i) => !i.returnInProgress && i.quantity > 0);
    const inProgressItems = result.eligibleItems.filter((i) => i.returnInProgress);

    return {
      eligible: result.eligible,
      reason: result.reason,
      eligibleItems,
      inProgressItems: inProgressItems.length > 0 ? inProgressItems : undefined,
    };
  }

  async initiateReturn(orderNumber: string, request: ReturnRequest): Promise<Return> {
    const orderData = lookupOrderFixture(orderNumber);
    if (!orderData) throw new Error(`order not found: ${orderNumber}`);

    const returnedItems = request.items.map((sel) => {
      const lineItem = orderData.lineItems.find((li) => li.sku === sel.sku);
      return {
        sku: sel.sku,
        name: lineItem?.name ?? sel.sku,
        quantity: sel.quantity,
        unitPrice: lineItem?.unitPrice ?? 0,
      };
    });

    const returnEntity = Return.initiate({
      orderNumber,
      returnedItems,
      returnReason: request.reason,
      itemCondition: 'unopened',
    });

    await this._returnRepo.save(returnEntity);

    try {
      const { label, qrCode } = await this._labelService.generateLabel(returnEntity);
      returnEntity.attachLabel(label, qrCode);
      await this._returnRepo.save(returnEntity);
    } catch {
      // Label generation unavailable — return preserved without label
    }

    return returnEntity;
  }

  async getReturn(returnId: string): Promise<Return | null> {
    return this._returnRepo.findById(returnId);
  }

  async getReturnsByOrder(orderNumber: string): Promise<Return[]> {
    return this._returnRepo.findByOrderNumber(orderNumber);
  }
}
