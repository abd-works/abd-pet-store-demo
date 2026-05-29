export interface OrderFixtureData {
  orderNumber: string;
  customerEmail: string;
  deliveredOn: Date;
  orderStatus: string;
  paymentVendor: 'stripewave' | 'paynova' | 'vaultpay';
  vendorTransactionReference: string;
  isGuestOrder?: boolean;
  guestEmail?: string;
  lineItems: Array<{ sku: string; name: string; unitPrice: number; quantity: number }>;
}

const FIXTURE_ORDERS: Record<string, OrderFixtureData> = {
  'ORD-4401': {
    orderNumber: 'ORD-4401',
    customerEmail: 'sarah.mitchell@pawplace.example',
    deliveredOn: new Date('2026-04-14'),
    orderStatus: 'delivered',
    paymentVendor: 'stripewave',
    vendorTransactionReference: 'sw_txn_4401',
    lineItems: [
      { sku: 'premium-dog-kibble-10kg', name: 'Premium Dog Kibble 10kg', unitPrice: 5499, quantity: 1 },
      { sku: 'squeaky-bone-chew', name: 'Squeaky Bone Chew', unitPrice: 1299, quantity: 2 },
    ],
  },
  'ORD-4402': {
    orderNumber: 'ORD-4402',
    customerEmail: 'sarah.mitchell@pawplace.example',
    deliveredOn: new Date('2026-02-05'),
    orderStatus: 'delivered',
    paymentVendor: 'stripewave',
    vendorTransactionReference: 'sw_txn_4402',
    lineItems: [
      { sku: 'orthopaedic-dog-bed-large', name: 'Orthopaedic Dog Bed Large', unitPrice: 8999, quantity: 1 },
    ],
  },
  'ORD-5502': {
    orderNumber: 'ORD-5502',
    customerEmail: 'sarah.mitchell@pawplace.example',
    deliveredOn: new Date('2026-04-20'),
    orderStatus: 'delivered',
    paymentVendor: 'paynova',
    vendorTransactionReference: 'pn_txn_5502',
    lineItems: [
      { sku: 'ceramic-feeding-bowl', name: 'Ceramic Feeding Bowl', unitPrice: 2499, quantity: 1 },
    ],
  },
  'ORD-6603': {
    orderNumber: 'ORD-6603',
    customerEmail: 'sarah.mitchell@pawplace.example',
    deliveredOn: new Date('2026-04-22'),
    orderStatus: 'delivered',
    paymentVendor: 'vaultpay',
    vendorTransactionReference: 'vp_txn_6603',
    lineItems: [
      { sku: 'premium-cat-tree-deluxe', name: 'Premium Cat Tree Deluxe', unitPrice: 19999, quantity: 1 },
    ],
  },
  'ORD-7704': {
    orderNumber: 'ORD-7704',
    customerEmail: 'alex.rivera@example.com',
    deliveredOn: new Date('2026-04-25'),
    orderStatus: 'delivered',
    paymentVendor: 'paynova',
    vendorTransactionReference: 'pn_txn_7704',
    isGuestOrder: true,
    guestEmail: 'alex.rivera@example.com',
    lineItems: [
      { sku: 'pet-carrier-medium', name: 'Pet Carrier Medium', unitPrice: 4599, quantity: 1 },
    ],
  },
};

export function lookupOrderFixture(orderNumber: string): OrderFixtureData | null {
  return FIXTURE_ORDERS[orderNumber] ?? null;
}
