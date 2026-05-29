import { Return } from '../shared/Return';
import { ReturnEligibility } from '../shared/ReturnEligibility';
import type { ReturnRequest } from '../shared/ReturnRequest';
import { ManagerOverride } from '../shared/ManagerOverride';
import { ReturnIneligibleError } from '../shared/ReturnErrors';
import type { IReturnRepository } from './return.repository';
import { lookupOrderFixture, type OrderFixtureData } from './order-fixture';

interface RefundInitiator {
  initiateRefund(
    returnEntity: { returnId: string; orderNumber: string; returnedItemsValue(): number },
    order: OrderFixtureData,
  ): Promise<unknown>;
}

/** Application service — staff-initiated in-store return with eligibility override. */
export class InStoreReturnService {
  private readonly _eligibility: ReturnEligibility;

  constructor(
    private readonly _returnRepo: IReturnRepository,
    private readonly _refundService: RefundInitiator,
  ) {
    this._eligibility = new ReturnEligibility();
  }

  async lookupOrder(orderNumber: string, email?: string): Promise<OrderFixtureData | null> {
    const order = lookupOrderFixture(orderNumber);
    if (!order) return null;
    if (email && order.guestEmail && order.guestEmail !== email) return null;
    return order;
  }

  async initiateInStoreReturn(
    orderData: OrderFixtureData,
    request: ReturnRequest,
    staffId: string,
    managerOverride?: ManagerOverride,
  ): Promise<Return> {
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

    const existingReturns = await this._returnRepo.findByOrderNumber(orderData.orderNumber);
    const existingReturnData = existingReturns.map((r) => ({
      returnedItems: r.returnedItems.map((i) => ({ sku: i.sku, quantity: i.quantity })),
      returnStatus: r.returnStatus,
    }));

    const requestedSkus = request.items.map((i) => i.sku);
    const result = this._eligibility.isEligible(mappedOrder, requestedSkus, existingReturnData);

    if (!result.eligible && !managerOverride) {
      throw new ReturnIneligibleError(orderData.orderNumber, result.reason!);
    }

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
      orderNumber: orderData.orderNumber,
      returnedItems,
      returnReason: request.reason,
      itemCondition: 'unopened',
      channel: 'in_store',
      initiatedBy: staffId,
    });

    if (managerOverride) {
      returnEntity.applyOverride(managerOverride);
    }

    await this._returnRepo.save(returnEntity);

    await this._refundService.initiateRefund(returnEntity, orderData);

    return returnEntity;
  }
}
