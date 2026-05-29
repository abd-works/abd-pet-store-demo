import type { Request, Response } from 'express';
import { returnRequestSchema } from '../shared/return.schema';
import { ReturnRequest, enrichSchemaItems } from '../shared/ReturnRequest';
import type { ReturnService } from './return.service';
import { ReturnIneligibleError } from './return.service';

export interface IRefundReader {
  findByOrderNumber(orderNumber: string): Promise<{
    refundId: string;
    orderNumber: string;
    returnId: string;
    vendor: string;
    amount: number;
    amountFormatted: string;
    refundStatus: 'processing' | 'completed' | 'requires_review';
    maskedPaymentMethod?: string;
    createdAt: string;
    completedAt: string | null;
  } | null>;
}

function mapReturnToDto(returnEntity: import('../shared/Return').Return) {
  return {
    returnId: returnEntity.returnId,
    orderNumber: returnEntity.orderNumber,
    returnedItems: returnEntity.returnedItems.map((i) => ({
      sku: i.sku,
      name: i.name,
      quantity: i.quantity,
      eligible: true,
    })),
    returnReason: returnEntity.returnReason,
    itemCondition: returnEntity.itemCondition,
    returnStatus: returnEntity.currentStatus,
    returnReference: returnEntity.returnLabel?.returnReference ?? returnEntity.returnId,
    labelUrl: returnEntity.returnLabel?.labelUrl ?? null,
    qrCodeData: returnEntity.returnQrCode?.qrData ?? null,
    labelUnavailable: !returnEntity.returnLabel && returnEntity.currentStatus === 'initiated',
    createdAt: returnEntity.createdAt.toISOString(),
  };
}

export class ReturnController {
  constructor(
    private readonly returnService: ReturnService,
    private readonly refundReader?: IRefundReader,
  ) {}

  async initiateReturn(req: Request, res: Response): Promise<void> {
    const orderNumber = req.params.orderNumber;
    const parsed = returnRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid return request', details: parsed.error.flatten() });
      return;
    }

    const request = new ReturnRequest({
      items: enrichSchemaItems(parsed.data.items),
      reason: parsed.data.returnReason,
      itemCondition: parsed.data.itemCondition,
    });

    try {
      const returnEntity = await this.returnService.initiateReturn(orderNumber, request);
      res.status(201).json(mapReturnToDto(returnEntity));
    } catch (err) {
      if (err instanceof ReturnIneligibleError) {
        res.status(400).json({ error: err.reason, orderNumber: err.orderNumber });
        return;
      }
      throw err;
    }
  }

  async checkEligibility(req: Request, res: Response): Promise<void> {
    const orderNumber = req.params.orderNumber;
    try {
      const result = await this.returnService.checkEligibility(orderNumber);
      res.status(200).json({
        eligible: result.eligible,
        reason: result.reason,
        eligibleItems: result.eligibleItems.map((item) => ({
          sku: item.sku,
          name: item.name,
          quantity: item.quantity,
          eligible: !item.returnInProgress && item.quantity > 0,
          alreadyReturning: item.returnInProgress,
        })),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'unknown error';
      res.status(404).json({ error: message });
    }
  }

  async getReturn(req: Request, res: Response): Promise<void> {
    const returnId = req.params.returnId;
    const returnEntity = await this.returnService.getReturn(returnId);
    if (!returnEntity) {
      res.status(404).json({ error: 'return not found' });
      return;
    }
    res.status(200).json(mapReturnToDto(returnEntity));
  }

  async getReturnsByOrder(req: Request, res: Response): Promise<void> {
    const orderNumber = req.params.orderNumber;
    const returns = await this.returnService.getReturnsByOrder(orderNumber);
    res.status(200).json({ returns: returns.map(mapReturnToDto) });
  }

  async getRefundStatus(req: Request, res: Response): Promise<void> {
    const orderNumber = req.params.orderNumber;
    if (!this.refundReader) {
      res.status(404).json({ error: 'refund status not available' });
      return;
    }
    const refund = await this.refundReader.findByOrderNumber(orderNumber);
    if (!refund) {
      res.status(404).json({ error: 'no refund found' });
      return;
    }
    res.status(200).json(refund);
  }

  async getBatchReturnStatuses(req: Request, res: Response): Promise<void> {
    const { orderNumbers } = req.body as { orderNumbers: string[] };
    if (!Array.isArray(orderNumbers)) {
      res.status(400).json({ error: 'orderNumbers array required' });
      return;
    }
    const result: Record<string, { eligible: boolean; reason?: string; hasActiveReturn: boolean }> = {};
    for (const orderNumber of orderNumbers) {
      try {
        const eligibility = await this.returnService.checkEligibility(orderNumber);
        const returns = await this.returnService.getReturnsByOrder(orderNumber);
        const hasActiveReturn = returns.some(
          (r) => r.currentStatus !== 'completed',
        );
        result[orderNumber] = {
          eligible: eligibility.eligible,
          reason: eligibility.reason,
          hasActiveReturn,
        };
      } catch (error: unknown) {
        console.error(`Batch eligibility check failed for ${orderNumber}:`, error);
        result[orderNumber] = { eligible: false, reason: 'order not found', hasActiveReturn: false };
      }
    }
    res.status(200).json(result);
  }
}
