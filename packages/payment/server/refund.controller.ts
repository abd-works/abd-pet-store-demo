import type { Request, Response } from 'express';
import type { RefundService } from './refund.service';

export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  async getRefundStatus(req: Request, res: Response): Promise<void> {
    const orderNumber = req.params.orderNumber;
    const refunds = await this.refundService.getRefundStatus(orderNumber);

    if (refunds.length === 0) {
      res.status(404).json({ error: 'no refunds found for this order' });
      return;
    }

    const dtos = refunds.map((refund) => ({
      refundId: refund.refundId,
      orderNumber: refund.orderNumber,
      refundStatus: refund.currentStatus,
      amount: refund.amount,
      formattedAmount: refund.formattedAmount,
      timingExpectationNote: refund.timingExpectationNote,
      supportGuidance: refund.supportGuidance,
    }));

    res.status(200).json(dtos);
  }
}
