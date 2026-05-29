/**

 * Process Card Payment via StripeWave — client tests (Increment 2)

 */

import { describe, it, beforeEach, afterEach } from 'vitest';

import { screen, waitFor } from '@testing-library/react';

import { expect } from 'vitest';

import {

  ClickAndCollectClientHelper,

  paymentMocks,

} from '../helpers/click-and-collect.client';



describe('Process Card Payment via StripeWave', () => {

  const helper = new ClickAndCollectClientHelper();



  beforeEach(async () => { await helper.seed(); });

  afterEach(async () => { await helper.cleanup(); });



  it('Process Card Payment via StripeWave — AC 1: processing indicator', async () => {

    paymentMocks.payOrder.mockImplementation(

      () => new Promise(() => { /* never resolves — in-flight */ }),

    );

    await helper.when_customer_views_payment_page('ORD-2001');

    await helper.when_customer_enters_card('4242424242424242', '12/27', '123');

    await helper.when_customer_confirms_payment();

    await waitFor(() => {

      expect(screen.getByTestId('payment-processing')).toBeInTheDocument();

    });

  });



  it('Process Card Payment via StripeWave — AC 3: decline with retry', async () => {
    paymentMocks.payOrder.mockImplementation(async () => {
      throw Object.assign(new Error('card declined'), { status: 402 });
    });

    await helper.when_customer_views_payment_page('ORD-2001');

    await helper.when_customer_enters_card('4242424242424242', '12/27', '123');

    await helper.when_customer_confirms_payment();

    await waitFor(() => {

      expect(screen.getByRole('button', { name: /retry payment/i })).toBeInTheDocument();

    });

  });



  it('Process Card Payment via StripeWave — AC 5: unavailable with retry', async () => {
    paymentMocks.payOrder.mockImplementation(async () => {
      throw Object.assign(new Error('StripeWave service unavailable'), { status: 503 });
    });
    await helper.when_customer_views_payment_page('ORD-2001');
    await helper.when_customer_enters_card('4242424242424242', '12/27', '123');
    await helper.when_customer_confirms_payment();
    await waitFor(() => {
      expect(paymentMocks.payOrder).toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent(/service unavailable/i);
      expect(screen.getByRole('button', { name: /retry payment/i })).toBeInTheDocument();
    });
  });

});


