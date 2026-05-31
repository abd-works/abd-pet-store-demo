import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import type { ProductSearchService } from './product-search.service';

function readOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readOptionalNumber(value: unknown): number | undefined {
  if (typeof value !== 'string') return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export class ProductSearchController {
  constructor(private readonly searchService: ProductSearchService) {}

  search = (req: Request, res: Response): void => {
    const keyword = readOptionalString(req.query.q) ?? '';
    const result = this.searchService.search(keyword, {
      category: readOptionalString(req.query.category),
      petType: readOptionalString(req.query.petType),
      brand: readOptionalString(req.query.brand),
      minPrice: readOptionalNumber(req.query.minPrice),
      maxPrice: readOptionalNumber(req.query.maxPrice),
      inStockOnly: req.query.inStock === 'true',
    });
    res.status(HttpStatus.OK).json(result);
  };
}
