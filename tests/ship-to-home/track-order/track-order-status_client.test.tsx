/**
 * Track Order Status — client tests (Increment 3)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ShipToHomeClientHelper } from '../helpers/ship-to-home.client';
import { ShipToHomeBase } from '../helpers/ship-to-home.base';

describe('Track Order Status', () => {
  const helper = new ShipToHomeClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('Track Order Status — AC 1: status page from email link', async () => {
    await helper.when_guest_views_order_status({
      orderNumber: 'ORD-3001',
      status: 'shipped',
      statusLabel: 'Shipped',
      deliveryOptionLabel: 'Standard Delivery',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      lineItems: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
      shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
      shippingCostFormatted: '£4.99',
      estimatedDeliveryWindow: '3–5 business days',
    });
    helper.then_status_label('Shipped');
    expect(screen.getByText(/Premium Dog Harness/i)).toBeInTheDocument();
    expect(screen.getByText(/28 Oak Lane/i)).toBeInTheDocument();
  });

  it('Track Order Status — AC 2: tracking and carrier link', async () => {
    await helper.when_guest_views_order_status({
      orderNumber: 'ORD-3001',
      status: 'shipped',
      statusLabel: 'Shipped',
      deliveryOptionLabel: 'Standard Delivery',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      lineItems: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
      shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
      tracking: {
        number: ShipToHomeBase.TRACKING_ROYAL_MAIL.trackingNumber,
        carrierName: 'Royal Mail',
        carrierTrackingUrl: 'https://www.royalmail.com/track-your-item',
        shippedAt: '2025-05-07T00:00:00.000Z',
        estimatedDeliveryDate: '2025-05-12',
      },
    });
    helper.then_tracking_link(ShipToHomeBase.TRACKING_ROYAL_MAIL.trackingNumber);
    expect(screen.getByText(/2025-05-12/i)).toBeInTheDocument();
  });

  it('Track Order Status — AC 3: guest lookup match and fail closed', async () => {
    helper.given_lookup_rejects(new Error('not found'));
    await helper.when_guest_views_order_lookup();
    await helper.when_guest_submits_lookup('ORD-3001', ShipToHomeBase.WRONG_GUEST_EMAIL);
    helper.then_lookup_error("We couldn't find an order matching those details");
  });

  it('Track Order Status — AC 4: pre-ship tracking pending message', async () => {
    await helper.when_guest_views_order_status({
      orderNumber: 'ORD-3002',
      status: 'confirmed',
      statusLabel: 'Confirmed',
      deliveryOptionLabel: 'Click-and-Collect',
      guestEmail: 'tom.brown@example.com',
      lineItems: [{ sku: 'PET-TRT-042', name: 'Salmon Cat Treats', price: '£4.99', quantity: 3, lineTotal: 14.97 }],
      pickupStore: {
        storeCode: 'STR-001',
        storeName: 'PawPlace Camden',
        addressLineOne: '42 High Street',
        city: 'London',
        postcode: 'NW1 8QP',
      },
      trackingPendingMessage: 'Order being prepared',
    });
    helper.then_tracking_pending_message('Order being prepared');
  });

  it('Track Order Status — AC 5: refresh on revisit no push', async () => {
    await helper.when_guest_views_order_status({
      orderNumber: 'ORD-3001',
      status: 'shipped',
      statusLabel: 'Shipped',
      deliveryOptionLabel: 'Standard Delivery',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      lineItems: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
    });
    await helper.when_guest_views_order_status({
      orderNumber: 'ORD-3001',
      status: 'delivered',
      statusLabel: 'Delivered',
      deliveryOptionLabel: 'Standard Delivery',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      lineItems: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
    });
    helper.then_status_label('Delivered');
    expect(screen.queryByText(/push notification/i)).not.toBeInTheDocument();
  });
});
