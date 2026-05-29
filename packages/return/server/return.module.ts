import { Router } from 'express';
import { ReturnController } from './return.controller';
import { ReturnService } from './return.service';
import { InStoreReturnController } from './in-store-return.controller';
import { InStoreReturnService } from './in-store-return.service';
import { returnRoutes } from './return.routes';
import { inStoreReturnRoutes } from './in-store-return.routes';
import { InMemoryReturnRepository } from './return.repository';
import { ReturnLabelService } from './return-label.service';
import { StubLabelProvider } from './return-label.provider';
import { ReturnEligibility } from '../shared/ReturnEligibility';
import { ReturnWindow } from '../shared/ReturnWindow';
import type { IOrderReader } from './return.service';

const stubOrderReader: IOrderReader = {
  async findByNumber(orderNumber: string) {
    return {
      orderNumber,
      status: 'delivered',
      deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      items: [],
    };
  },
};

const stubRefundInitiator = {
  async initiateRefund() {},
};

export function createReturnModule(orderReader?: IOrderReader): Router {
  const returnRepository = new InMemoryReturnRepository();
  const returnWindow = new ReturnWindow();
  const returnEligibility = new ReturnEligibility(returnWindow);
  const labelProvider = new StubLabelProvider();
  const returnLabelService = new ReturnLabelService(labelProvider);
  const reader = orderReader ?? stubOrderReader;

  const returnService = new ReturnService(
    returnRepository,
    reader,
    returnEligibility,
    returnLabelService,
  );

  const returnController = new ReturnController(returnService);
  const inStoreReturnService = new InStoreReturnService(
    returnRepository,
    reader,
    returnEligibility,
    stubRefundInitiator,
  );
  const inStoreReturnController = new InStoreReturnController(inStoreReturnService);

  const router = Router();
  router.use(returnRoutes(returnController));
  router.use(inStoreReturnRoutes(inStoreReturnController));
  return router;
}
