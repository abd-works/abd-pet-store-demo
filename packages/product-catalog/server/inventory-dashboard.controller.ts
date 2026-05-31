import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import type { InventoryDashboardService } from './inventory-dashboard.service';

export class InventoryDashboardController {
  constructor(private readonly dashboardService: InventoryDashboardService) {}

  list = (_req: Request, res: Response): void => {
    res.status(HttpStatus.OK).json(this.dashboardService.listAll());
  };
}
