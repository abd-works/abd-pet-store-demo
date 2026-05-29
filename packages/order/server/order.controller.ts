import type { Request, Response } from 'express';

import { ZodError } from 'zod';

import {

  addTrackingSchema,

  fulfillOrderSchema,

  guestCheckoutSchema,

  guestOrderLookupSchema,

} from '@pawplace/order-shared';

import { HttpStatus } from '../../shared/http-status';

import { requireSessionId } from '../../shared/express-session-id';

import {

  EmptyCartError,

  OrderNotFoundError,

  OrderService,

  PickupStoreNotFoundError,

} from './order.service';

import { IncompleteShippingAddressError, InvalidTrackingNumberError, WrongDeliveryOptionError } from '@pawplace/order-shared';



function handleOrderError(error: unknown, res: Response): void {
  if (error instanceof ZodError) {
    res.status(HttpStatus.BAD_REQUEST).json({
      error: error.issues[0]?.message ?? 'Validation failed',
    });
    return;
  }
  if (error instanceof EmptyCartError) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: 'Cart is empty' });
    return;
  }
  if (error instanceof PickupStoreNotFoundError || error instanceof IncompleteShippingAddressError) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    return;
  }
  if (error instanceof OrderNotFoundError) {
    res.status(HttpStatus.NOT_FOUND).json({ error: 'Order not found' });
    return;
  }
  if (error instanceof WrongDeliveryOptionError) {
    res.status(422).json({ error: 'Invalid delivery option for action' });
    return;
  }
  if (error instanceof InvalidTrackingNumberError) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    return;
  }
  if (error instanceof Error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    return;
  }
  throw error;
}



export class OrderController {

  constructor(private readonly service: OrderService) {}



  createFromCart = async (req: Request, res: Response): Promise<void> => {

    try {

      const input = guestCheckoutSchema.parse(req.body);

      const order = await this.service.placeGuestOrder(requireSessionId(req), input);

      res.status(HttpStatus.CREATED).json(order);

    } catch (error) {

      handleOrderError(error, res);

    }

  };



  getOrder = async (req: Request, res: Response): Promise<void> => {

    try {

      const order = await this.service.getOrder(req.params.orderNumber);

      res.json(order);

    } catch (error) {

      handleOrderError(error, res);

    }

  };



  getOrderStatus = async (req: Request, res: Response): Promise<void> => {

    try {

      const token = typeof req.query.token === 'string' ? req.query.token : undefined;

      const status = await this.service.getOrderStatus(req.params.orderNumber, token);

      res.json(status);

    } catch (error) {

      handleOrderError(error, res);

    }

  };



  lookupOrderStatus = async (req: Request, res: Response): Promise<void> => {

    try {

      const input = guestOrderLookupSchema.parse(req.body);

      const status = await this.service.lookupByGuestEmail(input.orderNumber, input.guestEmail);

      res.json(status);

    } catch (error) {

      handleOrderError(error, res);

    }

  };



  listQueue = async (req: Request, res: Response): Promise<void> => {

    const storeCode = typeof req.query.storeCode === 'string' ? req.query.storeCode : undefined;

    const orders = await this.service.listQueue(storeCode);

    res.json({ orders });

  };



  markPrepared = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await this.service.markPrepared(req.params.orderNumber);
      res.json(order);
    } catch (error) {
      handleOrderError(error, res);
    }
  };

  markCollected = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await this.service.markCollected(req.params.orderNumber);
      res.json(order);
    } catch (error) {
      handleOrderError(error, res);
    }
  };



  markFulfilled = async (req: Request, res: Response): Promise<void> => {

    try {

      const body = fulfillOrderSchema.parse(req.body ?? {});

      const result = await this.service.markFulfilled(req.params.orderNumber, {

        carrierName: body.carrierName,

        trackingNumber: body.trackingNumber,

      });

      res.json(result);

    } catch (error) {

      handleOrderError(error, res);

    }

  };



  addTrackingNumber = async (req: Request, res: Response): Promise<void> => {

    try {

      const body = addTrackingSchema.parse(req.body);

      const order = await this.service.addTrackingNumber(req.params.orderNumber, body);

      res.json(order);

    } catch (error) {

      handleOrderError(error, res);

    }

  };

}


