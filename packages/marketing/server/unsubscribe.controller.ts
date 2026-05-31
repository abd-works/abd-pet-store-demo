import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import { InvalidUnsubscribeTokenError } from '../shared/unsubscribe.errors';
import type { UnsubscribeService } from './unsubscribe.service';

export class UnsubscribeController {
  constructor(private readonly unsubscribeService: UnsubscribeService) {}

  unsubscribe = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.unsubscribeService.execute(req.params.token);
      res.status(HttpStatus.OK).json({
        message: `You've been unsubscribed from ${result.categoryLabel}`,
        category: result.category,
        categoryLabel: result.categoryLabel,
      });
    } catch (error) {
      if (error instanceof InvalidUnsubscribeTokenError) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        return;
      }
      throw error;
    }
  };
}
