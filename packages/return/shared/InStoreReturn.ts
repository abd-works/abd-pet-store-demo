import { Return, type ReturnedItemSnapshot } from './Return';
import type { ReturnReasonCategory, ItemCondition } from './ReturnRequest';
import { ManagerOverride } from './ManagerOverride';

/** << Entity >> — extends Return with in-store channel fields: initiating staff, store code, and manager override. */
export class InStoreReturn extends Return {
  readonly storeCode: string;

  private constructor(params: {
    returnId?: string;
    orderNumber: string;
    returnedItems: ReturnedItemSnapshot[];
    returnReason: ReturnReasonCategory;
    itemCondition: ItemCondition;
    initiatedBy: string;
    storeCode: string;
    managerOverride?: { approvingManager: string; overrideReason: string };
  }) {
    const returnEntity = Return.initiate({
      returnId: params.returnId,
      orderNumber: params.orderNumber,
      returnedItems: params.returnedItems,
      returnReason: params.returnReason,
      itemCondition: params.itemCondition,
      channel: 'in_store',
      initiatedBy: params.initiatedBy,
    });

    Object.assign(returnEntity, { storeCode: params.storeCode });

    if (params.managerOverride) {
      returnEntity.applyOverride(
        new ManagerOverride({
          approvingManager: params.managerOverride.approvingManager,
          overrideReason: params.managerOverride.overrideReason,
        }),
      );
    }

    return returnEntity as InStoreReturn;
  }

  static initiateInStore(params: {
    returnId?: string;
    orderNumber: string;
    returnedItems: ReturnedItemSnapshot[];
    returnReason: ReturnReasonCategory;
    itemCondition: ItemCondition;
    staffId: string;
    storeCode: string;
    managerOverride?: { approvingManager: string; overrideReason: string };
  }): InStoreReturn {
    return new InStoreReturn({
      returnId: params.returnId,
      orderNumber: params.orderNumber,
      returnedItems: params.returnedItems,
      returnReason: params.returnReason,
      itemCondition: params.itemCondition,
      initiatedBy: params.staffId,
      storeCode: params.storeCode,
      managerOverride: params.managerOverride,
    });
  }
}
