import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import {
  inStoreEventSchema,
  personalizedRecommendationSchema,
  promotionalBatchSchema,
  restockAlertTriggerSchema,
} from '../shared/marketing.schema';
import type { MarketingDispatchService } from './marketing-dispatch.service';

export class MarketingDispatchController {
  constructor(private readonly dispatch: MarketingDispatchService) {}

  sendPromotionalBatch = async (req: Request, res: Response): Promise<void> => {
    const parsed = promotionalBatchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid promotional batch', details: parsed.error.flatten() });
      return;
    }
    const result = await this.dispatch.sendPromotionalBatch(parsed.data);
    res.status(HttpStatus.OK).json(result);
  };

  sendPersonalizedRecommendation = async (req: Request, res: Response): Promise<void> => {
    const parsed = personalizedRecommendationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid recommendation request', details: parsed.error.flatten() });
      return;
    }
    const result = await this.dispatch.sendPersonalizedRecommendation(parsed.data.accountId);
    res.status(HttpStatus.OK).json(result);
  };

  sendRestockAlert = async (req: Request, res: Response): Promise<void> => {
    const parsed = restockAlertTriggerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid restock alert', details: parsed.error.flatten() });
      return;
    }
    const result = await this.dispatch.sendRestockAlert(parsed.data.sku, parsed.data.productName);
    res.status(HttpStatus.OK).json(result);
  };

  sendInStoreEvent = async (req: Request, res: Response): Promise<void> => {
    const parsed = inStoreEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid in-store event', details: parsed.error.flatten() });
      return;
    }
    const preferredStoreByAccount = new Map<string, string>(
      Object.entries((req.body as { preferredStores?: Record<string, string> }).preferredStores ?? {}),
    );
    const result = await this.dispatch.sendInStoreEventNotification(parsed.data, preferredStoreByAccount);
    res.status(HttpStatus.OK).json(result);
  };
}
