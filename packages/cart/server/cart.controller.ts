import type { Request, Response } from 'express';
import { addCartItemSchema, updateCartItemSchema } from '@pawplace/cart-shared';
import { HttpStatus } from '../../shared/http-status';
import { requireSessionId } from '../../shared/express-session-id';
import {
  CartService,
  InsufficientStockError,
  InvalidQuantityError,
  OutOfStockError,
  ProductNotFoundError,
} from './cart.service';

function handleCartError(error: unknown, res: Response): void {
  if (error instanceof OutOfStockError || error instanceof InsufficientStockError) {
    res.status(HttpStatus.CONFLICT).json({ error: 'Out of stock' });
    return;
  }
  if (error instanceof ProductNotFoundError) {
    res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
    return;
  }
  if (error instanceof InvalidQuantityError) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    return;
  }
  throw error;
}

export class CartController {
  constructor(private readonly service: CartService) {}

  getCart = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.service.getCart(requireSessionId(req));
    res.json(cart);
  };

  addItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = addCartItemSchema.parse(req.body);
      const cart = await this.service.addItem(requireSessionId(req), body.sku, body.quantity);
      res.status(HttpStatus.CREATED).json(cart);
    } catch (error) {
      handleCartError(error, res);
    }
  };

  updateQuantity = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = updateCartItemSchema.parse(req.body);
      const cart = await this.service.updateQuantity(requireSessionId(req), req.params.sku, body.quantity);
      res.json(cart);
    } catch (error) {
      handleCartError(error, res);
    }
  };

  removeItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const cart = await this.service.removeItem(requireSessionId(req), req.params.sku);
      res.json(cart);
    } catch (error) {
      handleCartError(error, res);
    }
  };
}
