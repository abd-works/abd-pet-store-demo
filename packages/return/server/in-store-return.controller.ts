import type { Request, Response } from 'express';
import { staffReturnRequestSchema } from '../shared/return.schema';
import { ReturnRequest, enrichSchemaItems } from '../shared/ReturnRequest';
import type { Return } from '../shared/Return';
import type { InStoreReturnService } from './in-store-return.service';
import { ReturnIneligibleError } from './return.service';
import { z } from 'zod';

const inStoreReturnRequestSchema = staffReturnRequestSchema.extend({
  staffId: z.string().min(1).default('staff-default'),
});

type InStoreReturnInput = z.infer<typeof inStoreReturnRequestSchema>;

export class InStoreReturnController {
  constructor(private readonly inStoreReturnService: InStoreReturnService) {}

  async lookupOrder(req: Request, res: Response): Promise<void> {
    const { orderNumber, email } = req.body as { orderNumber?: string; email?: string };

    if (!orderNumber && !email) {
      res.status(400).json({ error: 'orderNumber or email required' });
      return;
    }

    const order = await this.inStoreReturnService.lookupOrder(orderNumber ?? '', email);
    if (!order) {
      res.status(404).json({ error: 'order not found' });
      return;
    }

    res.status(200).json(order);
  }

  async initiateInStoreReturn(req: Request, res: Response): Promise<void> {
    const parsed = inStoreReturnRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
      return;
    }

    const order = await this.inStoreReturnService.lookupOrder(parsed.data.orderNumber);
    if (!order) {
      res.status(404).json({ error: 'order not found' });
      return;
    }

    const { request, overridePayload, staffId } = this._buildReturnPayload(parsed.data);

    try {
      const returnEntity = await this.inStoreReturnService.initiateInStoreReturn(
        order as Parameters<InStoreReturnService['initiateInStoreReturn']>[0],
        request,
        staffId,
        overridePayload,
      );
      res.status(201).json(this._formatResponse(returnEntity));
    } catch (err) {
      if (err instanceof ReturnIneligibleError) {
        res.status(400).json({
          error: err.reason,
          orderNumber: err.orderNumber,
          managerOverrideAvailable: true,
        });
        return;
      }
      throw err;
    }
  }

  private _buildReturnPayload(data: InStoreReturnInput) {
    const enrichedItems = enrichSchemaItems(data.items);
    const request = new ReturnRequest({ items: enrichedItems, reason: data.returnReason, itemCondition: data.itemCondition });
    const overridePayload = data.managerOverride && data.approvingManager && data.overrideReason
      ? { approvingManager: data.approvingManager, overrideReason: data.overrideReason }
      : undefined;
    return { request, overridePayload, staffId: data.staffId };
  }

  private _formatResponse(returnEntity: Return) {
    return {
      returnId: returnEntity.returnId,
      orderNumber: returnEntity.orderNumber,
      returnStatus: returnEntity.currentStatus,
      returnedItems: returnEntity.returnedItems.map((i) => ({
        sku: i.sku,
        name: i.name,
        quantity: i.quantity,
        eligible: true,
      })),
      returnReason: returnEntity.returnReason,
      itemCondition: returnEntity.itemCondition,
      returnReference: returnEntity.returnId,
      labelUrl: null,
      qrCodeData: null,
      labelUnavailable: false,
      createdAt: returnEntity.createdAt.toISOString(),
    };
  }
}
