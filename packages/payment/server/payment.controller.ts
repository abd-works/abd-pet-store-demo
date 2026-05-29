import type { Request, Response } from 'express';



import { payOrderRequestSchema, validatePaymentCard } from '@pawplace/payment-shared';

import { HttpStatus } from '../../shared/http-status';

import { requireSessionId } from '../../shared/express-session-id';

import type { OrderService } from '../../order/server/order.service';

import { OrderNotFoundError, OrderNotPendingPaymentError } from '../../order/server/order.errors';

import type { PaymentService } from './payment.service';



export class PaymentController {

  constructor(private readonly service: PaymentService) {}



  pay = async (req: Request, res: Response): Promise<void> => {

    const parsed = payOrderRequestSchema.safeParse(req.body);

    if (!parsed.success) {

      res.status(HttpStatus.BAD_REQUEST).json({ error: 'invalid payment request' });

      return;

    }



    const data = parsed.data;

    if (data.vendor === 'stripewave' || !data.vendor) {

      if (data.cardNumber && data.expiry && data.cvv) {

        const validationError = validatePaymentCard({

          cardNumber: data.cardNumber,

          expiry: data.expiry,

          cvv: data.cvv,

        });

        if (validationError) {

          res.status(HttpStatus.BAD_REQUEST).json({ error: validationError });

          return;

        }

      }

    }



    try {

      const result = await this.service.payOrder(req.params.orderNumber, data, requireSessionId(req));

      if (!result.ok) {

        res.status(result.status).json(result.body);

        return;

      }

      res.json(result.order);

    } catch (error) {

      if (error instanceof OrderNotFoundError) {

        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });

        return;

      }

      if (error instanceof OrderNotPendingPaymentError) {

        res.status(HttpStatus.CONFLICT).json({ error: error.message });

        return;

      }

      throw error;

    }

  };



  retryStatus = async (req: Request, res: Response): Promise<void> => {

    const state = this.service.retryService.getStatus(req.params.orderNumber);

    if (!state) {

      res.status(HttpStatus.NOT_FOUND).json({ error: 'no retry in progress' });

      return;

    }

    res.json(this.service.retryService.toDto(state));

  };



  completeBackgroundRetryNotification = async (req: Request, res: Response): Promise<void> => {

    const outcome = (req.body as { outcome?: string }).outcome;

    if (outcome !== 'success') {

      res.status(HttpStatus.OK).json({ notificationChannel: 'email', outcome: 'failure' });

      return;

    }

    const order = await this.service.completeBackgroundRetry(

      req.params.orderNumber,

      requireSessionId(req),

    );

    if (!order) {

      res.status(HttpStatus.NOT_FOUND).json({ error: 'order not found or not eligible for retry completion' });

      return;

    }

    res.json({ notificationChannel: 'email', orderNumber: order.orderNumber, status: order.status });

  };

}



export class WebhookController {

  constructor(private readonly orderService: OrderService) {}



  handleStripeWave = async (req: Request, res: Response): Promise<void> => {

    const signature = req.headers['stripewave-signature'];

    if (!signature) {

      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid signature' });

      return;

    }

    const { orderNumber, status } = req.body as { orderNumber?: string; status?: string };

    if (orderNumber && status === 'confirmed') {

      const order = await this.orderService.getOrderEntity(orderNumber);

      if (order && order.status === 'pending_payment') {

        await this.orderService.confirmPayment(orderNumber, 'StripeWave •••• webhook', 'webhook', {

          processingVendor: 'stripewave',

        });

      }

    }

    res.json({ received: true });

  };



  handlePayNova = async (req: Request, res: Response): Promise<void> => {

    const signature = req.headers['paynova-signature'];

    if (!signature) {

      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid signature' });

      return;

    }

    const { orderNumber, status, vendorTransactionReference } = req.body as {

      orderNumber?: string;

      status?: string;

      vendorTransactionReference?: string;

    };

    if (orderNumber && status === 'captured') {

      const order = await this.orderService.getOrderEntity(orderNumber);

      if (order && order.status === 'pending_payment') {

        await this.orderService.confirmPayment(orderNumber, 'PayNova wallet', 'webhook', {

          processingVendor: 'paynova',

          vendorTransactionReference: vendorTransactionReference ?? `PN-${orderNumber}`,

        });

      }

    }

    res.json({ received: true });

  };



  handleVaultPay = async (req: Request, res: Response): Promise<void> => {

    const signature = req.headers['vaultpay-signature'];

    if (!signature) {

      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid signature' });

      return;

    }

    const { orderNumber, status, vendorTransactionReference } = req.body as {

      orderNumber?: string;

      status?: string;

      vendorTransactionReference?: string;

    };

    if (orderNumber && status === 'captured') {

      const order = await this.orderService.getOrderEntity(orderNumber);

      if (order && order.status === 'pending_payment') {

        await this.orderService.confirmPayment(orderNumber, 'VaultPay buy-now-pay-later', 'webhook', {

          processingVendor: 'vaultpay',

          vendorTransactionReference: vendorTransactionReference ?? `VP-${orderNumber}`,

        });

      }

    }

    res.json({ received: true });

  };

}

