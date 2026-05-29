/**
 * View and Process Incoming Orders — client tests (Increment 3)
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ShipToHomeClientHelper } from '../helpers/ship-to-home.client';
import { ShipToHomeBase } from '../helpers/ship-to-home.base';

describe('View and Process Incoming Orders', () => {
  const helper = new ShipToHomeClientHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('View and Process Incoming Orders — AC 1: unified queue oldest first', async () => {
    await helper.when_staff_views_unified_queue([
      {
        orderNumber: 'ORD-3001',
        status: 'confirmed',
        guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
        guestName: ShipToHomeBase.VALID_GUEST.guest_name,
        billingAddress: ShipToHomeBase.VALID_BILLING,
        shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
        deliveryOption: { type: 'standard_delivery', shippingCostPence: 499, estimatedDeliveryWindow: '3–5 business days' },
        deliveryTypeLabel: 'Standard Delivery',
        items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
        subtotal: 34.99,
        subtotalFormatted: '£34.99',
      },
      {
        orderNumber: 'ORD-3002',
        status: 'confirmed',
        guestEmail: 'tom.brown@example.com',
        guestName: 'Tom Brown',
        billingAddress: ShipToHomeBase.VALID_BILLING,
        pickupStore: {
          storeCode: 'STR-001',
          storeName: 'PawPlace Camden',
          addressLineOne: '42 High Street',
          city: 'London',
          postcode: 'NW1 8QP',
        },
        deliveryOption: { type: 'click_and_collect' },
        deliveryTypeLabel: 'Click-and-Collect',
        items: [{ sku: 'PET-TRT-042', name: 'Salmon Cat Treats', price: '£4.99', quantity: 3, lineTotal: 14.97 }],
        subtotal: 14.97,
        subtotalFormatted: '£14.97',
      },
    ]);
    helper.then_queue_shows_delivery_label('Standard Delivery');
    helper.then_queue_shows_delivery_label('Click-and-Collect');
    expect(screen.getByText(/guest email: sarah\.jones@example\.com/i)).toBeInTheDocument();
  });

  it('View and Process Incoming Orders — AC 2: ship-to-home detail', async () => {
    await helper.when_staff_views_ship_to_home_detail({
      orderNumber: 'ORD-3001',
      status: 'confirmed',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      guestName: ShipToHomeBase.VALID_GUEST.guest_name,
      billingAddress: ShipToHomeBase.VALID_BILLING,
      shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
      deliveryOption: { type: 'standard_delivery', shippingCostPence: 499, estimatedDeliveryWindow: '3–5 business days' },
      items: [
        { sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 },
        { sku: 'PET-BED-015', name: 'Large Dog Bed', price: '£59.99', quantity: 1, lineTotal: 59.99 },
      ],
      subtotal: 94.98,
      subtotalFormatted: '£94.98',
    });
    expect(screen.getByText(/28 Oak Lane/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium Dog Harness/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mark as fulfilled/i })).toBeInTheDocument();
  });

  it('View and Process Incoming Orders — AC 3: fulfillment with tracking prompt', async () => {
    await helper.when_staff_views_ship_to_home_detail({
      orderNumber: 'ORD-3001',
      status: 'confirmed',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      guestName: ShipToHomeBase.VALID_GUEST.guest_name,
      billingAddress: ShipToHomeBase.VALID_BILLING,
      shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
      deliveryOption: { type: 'standard_delivery', shippingCostPence: 499, estimatedDeliveryWindow: '3–5 business days' },
      items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
    });
    expect(screen.getByLabelText(/tracking number/i)).toBeInTheDocument();
    await helper.when_staff_enters_tracking(
      ShipToHomeBase.TRACKING_ROYAL_MAIL.carrierName,
      ShipToHomeBase.TRACKING_ROYAL_MAIL.trackingNumber,
    );
    await helper.when_staff_marks_fulfilled_with_tracking();
    expect(screen.getByText(/shipped/i)).toBeInTheDocument();
  });

  it('View and Process Incoming Orders — AC 4: fulfill without tracking warning', async () => {
    await helper.when_staff_views_ship_to_home_detail({
      orderNumber: 'ORD-3001',
      status: 'confirmed',
      guestEmail: ShipToHomeBase.VALID_GUEST.guest_email,
      guestName: ShipToHomeBase.VALID_GUEST.guest_name,
      billingAddress: ShipToHomeBase.VALID_BILLING,
      shippingAddress: ShipToHomeBase.VALID_SHIPPING_EDINBURGH,
      deliveryOption: { type: 'standard_delivery', shippingCostPence: 499, estimatedDeliveryWindow: '3–5 business days' },
      items: [{ sku: 'PET-HAR-001', name: 'Premium Dog Harness', price: '£34.99', quantity: 1, lineTotal: 34.99 }],
      subtotal: 34.99,
      subtotalFormatted: '£34.99',
    });
    await helper.when_staff_marks_fulfilled_without_tracking();
    helper.then_fulfillment_warning('Customer will not receive a shipping notification');
  });
});
