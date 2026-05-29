/**
 * Returns and Refunds -- shared test helper (Increment 7)
 *
 * Standard test data from increment-7-specification-by-example.md.
 * Domain types used directly; repositories stubbed via in-memory implementations.
 * Vocabulary: create / verify / given / when / then
 */
import { Return } from '../../../packages/return/shared/Return';
import { ReturnRequest } from '../../../packages/return/shared/ReturnRequest';
import { ReturnEligibility } from '../../../packages/return/shared/ReturnEligibility';
import { ReturnStatus } from '../../../packages/return/shared/ReturnStatus';
import { ReturnWindow } from '../../../packages/return/shared/ReturnWindow';
import { ReturnLabel } from '../../../packages/return/shared/ReturnLabel';
import { ReturnQRCode } from '../../../packages/return/shared/ReturnQRCode';
import { InStoreReturn } from '../../../packages/return/shared/InStoreReturn';
import { ManagerOverride } from '../../../packages/return/shared/ManagerOverride';
import { Refund } from '../../../packages/payment/shared/Refund';
import { RefundStatus } from '../../../packages/payment/shared/RefundStatus';
import { ReturnReceivedNotification } from '../../../packages/notification/shared/ReturnReceivedNotification';
import { RefundCompletedNotification } from '../../../packages/notification/shared/RefundCompletedNotification';
import { RefundUnderReviewNotification } from '../../../packages/notification/shared/RefundUnderReviewNotification';
import { ReturnService } from '../../../packages/return/server/return.service';
import { ReturnLabelService } from '../../../packages/return/server/return-label.service';
import { RefundService } from '../../../packages/payment/server/refund.service';
import { RefundRetryService } from '../../../packages/payment/server/refund-retry.service';
import { InStoreReturnService } from '../../../packages/return/server/in-store-return.service';
import { NotificationService } from '../../../packages/notification/server/notification.service';
import type { IReturnRepository } from '../../../packages/return/server/return.repository';
import type { IRefundRepository } from '../../../packages/payment/server/refund.repository';
import type { ILabelProvider } from '../../../packages/return/server/return-label.provider';
import type { IPaymentGateway } from '../../../packages/payment/server/payment-gateway';
import type { INotificationRepository } from '../../../packages/notification/server/notification.repository';
import type { IEmailProvider } from '../../../packages/notification/server/email.provider';

// =============================================================================
// STANDARD TEST DATA
// =============================================================================

export const CUSTOMERS = {
  SARAH: {
    email: 'sarah.mitchell@pawplace.example',
    name: 'Sarah Mitchell',
  },
  ALEX_GUEST: {
    email: 'alex.rivera@example.com',
    name: 'Alex Rivera',
  },
} as const;

export const ORDERS = {
  ORD_4401: {
    orderNumber: 'ORD-4401',
    customerEmail: CUSTOMERS.SARAH.email,
    deliveredOn: new Date('2026-04-14'),
    orderStatus: 'delivered',
    paymentVendor: 'stripewave' as const,
    vendorTransactionReference: 'sw_txn_4401',
    lineItems: [
      { sku: 'premium-dog-kibble-10kg', name: 'Premium Dog Kibble 10kg', unitPrice: 5499, quantity: 1 },
      { sku: 'squeaky-bone-chew', name: 'Squeaky Bone Chew', unitPrice: 1299, quantity: 2 },
    ],
  },
  ORD_4402: {
    orderNumber: 'ORD-4402',
    customerEmail: CUSTOMERS.SARAH.email,
    deliveredOn: new Date('2026-02-05'),
    orderStatus: 'delivered',
    paymentVendor: 'stripewave' as const,
    vendorTransactionReference: 'sw_txn_4402',
    lineItems: [
      { sku: 'orthopaedic-dog-bed-large', name: 'Orthopaedic Dog Bed Large', unitPrice: 8999, quantity: 1 },
    ],
  },
  ORD_5502: {
    orderNumber: 'ORD-5502',
    customerEmail: CUSTOMERS.SARAH.email,
    deliveredOn: new Date('2026-04-20'),
    orderStatus: 'delivered',
    paymentVendor: 'paynova' as const,
    vendorTransactionReference: 'pn_txn_5502',
    lineItems: [
      { sku: 'ceramic-feeding-bowl', name: 'Ceramic Feeding Bowl', unitPrice: 2499, quantity: 1 },
    ],
  },
  ORD_6603: {
    orderNumber: 'ORD-6603',
    customerEmail: CUSTOMERS.SARAH.email,
    deliveredOn: new Date('2026-04-22'),
    orderStatus: 'delivered',
    paymentVendor: 'vaultpay' as const,
    vendorTransactionReference: 'vp_txn_6603',
    lineItems: [
      { sku: 'premium-cat-tree-deluxe', name: 'Premium Cat Tree Deluxe', unitPrice: 19999, quantity: 1 },
    ],
  },
  ORD_7704: {
    orderNumber: 'ORD-7704',
    customerEmail: CUSTOMERS.ALEX_GUEST.email,
    deliveredOn: new Date('2026-04-25'),
    orderStatus: 'delivered',
    paymentVendor: 'paynova' as const,
    vendorTransactionReference: 'pn_txn_7704',
    isGuestOrder: true,
    guestEmail: CUSTOMERS.ALEX_GUEST.email,
    lineItems: [
      { sku: 'pet-carrier-medium', name: 'Pet Carrier Medium', unitPrice: 4599, quantity: 1 },
    ],
  },
} as const;

export const RETURNS = {
  RTN_7001: {
    returnId: 'RTN-7001',
    orderNumber: 'ORD-4401',
    returnedItems: [{ sku: 'premium-dog-kibble-10kg', name: 'Premium Dog Kibble 10kg', unitPrice: 5499, quantity: 1 }],
    returnReason: 'changed mind',
    returnStatus: 'initiated',
  },
  RTN_7002: {
    returnId: 'RTN-7002',
    orderNumber: 'ORD-5502',
    returnedItems: [{ sku: 'ceramic-feeding-bowl', name: 'Ceramic Feeding Bowl', unitPrice: 2499, quantity: 1 }],
    returnReason: 'not as described',
    returnStatus: 'initiated',
  },
  RTN_7003: {
    returnId: 'RTN-7003',
    orderNumber: 'ORD-6603',
    returnedItems: [{ sku: 'premium-cat-tree-deluxe', name: 'Premium Cat Tree Deluxe', unitPrice: 19999, quantity: 1 }],
    returnReason: 'damaged in transit',
    returnStatus: 'initiated',
  },
} as const;

export const REFUNDS = {
  REF_3001: {
    refundId: 'REF-3001',
    returnId: 'RTN-7001',
    orderNumber: 'ORD-4401',
    amount: 5499,
    vendor: 'stripewave' as const,
    refundStatus: 'processing',
  },
  REF_3002: {
    refundId: 'REF-3002',
    returnId: 'RTN-7002',
    orderNumber: 'ORD-5502',
    amount: 2499,
    vendor: 'paynova' as const,
    refundStatus: 'processing',
  },
  REF_3003: {
    refundId: 'REF-3003',
    returnId: 'RTN-7003',
    orderNumber: 'ORD-6603',
    amount: 19999,
    vendor: 'vaultpay' as const,
    refundStatus: 'processing',
  },
} as const;

export const STORES = {
  CAMDEN: { code: 'STR-CAMDEN', name: 'PawPlace Camden' },
} as const;

export const WITHIN_RETURN_WINDOW_DATE = new Date('2026-05-07');
export const OUTSIDE_RETURN_WINDOW_DATE = new Date('2026-05-07');

// =============================================================================
// IN-MEMORY REPOSITORIES
// =============================================================================

export class InMemoryReturnRepository implements IReturnRepository {
  private returns: Map<string, Return> = new Map();

  async save(returnEntity: Return): Promise<void> {
    this.returns.set(returnEntity.returnId, returnEntity);
  }

  async findById(returnId: string): Promise<Return | null> {
    return this.returns.get(returnId) ?? null;
  }

  async findByOrderNumber(orderNumber: string): Promise<Return[]> {
    return [...this.returns.values()].filter((r) => r.orderNumber === orderNumber);
  }

  seed(returnEntity: Return): void {
    this.returns.set(returnEntity.returnId, returnEntity);
  }

  clear(): void {
    this.returns.clear();
  }
}

export class InMemoryRefundRepository implements IRefundRepository {
  private refunds: Map<string, Refund> = new Map();

  async save(refund: Refund): Promise<void> {
    this.refunds.set(refund.refundId, refund);
  }

  async findById(refundId: string): Promise<Refund | null> {
    return this.refunds.get(refundId) ?? null;
  }

  async findByOrderNumber(orderNumber: string): Promise<Refund[]> {
    return [...this.refunds.values()].filter((r) => r.orderNumber === orderNumber);
  }

  seed(refund: Refund): void {
    this.refunds.set(refund.refundId, refund);
  }

  clear(): void {
    this.refunds.clear();
  }
}

export class InMemoryNotificationRepository implements INotificationRepository {
  readonly sent: Array<{ referenceId: string; type: string; recipient: string }> = [];
  readonly queued: Array<{ referenceId: string; type: string; attempts: number }> = [];

  async markSent(referenceId: string, type: string, recipient: string): Promise<void> {
    this.sent.push({ referenceId, type, recipient });
  }

  async enqueue(job: { referenceId: string; type: string; attempts: number }): Promise<void> {
    this.queued.push(job);
  }

  clear(): void {
    this.sent.length = 0;
    this.queued.length = 0;
  }
}

export class FakeLabelProvider implements ILabelProvider {
  available = true;

  async generateLabel(returnEntity: Return): Promise<{ label: Buffer; qrCode: string }> {
    if (!this.available) {
      throw new Error('Label generation service unavailable');
    }
    return {
      label: Buffer.from(`PDF-LABEL-${returnEntity.returnId}`),
      qrCode: `QR-${returnEntity.returnId}`,
    };
  }
}

export class FakePaymentGateway implements IPaymentGateway {
  refundCalls: Array<{ paymentRef: string; amount: number }> = [];
  shouldFail = false;
  failureType: 'transient' | 'hard' = 'transient';

  async refund(paymentRef: string, amount: number): Promise<void> {
    this.refundCalls.push({ paymentRef, amount });
    if (this.shouldFail) {
      const error = new Error(this.failureType === 'transient' ? 'Vendor downtime' : 'Hard decline');
      (error as any).type = this.failureType;
      throw error;
    }
  }

  clear(): void {
    this.refundCalls = [];
    this.shouldFail = false;
  }
}

export class FakeEmailProvider implements IEmailProvider {
  available = true;
  sentEmails: Array<{ to: string; subject: string; html: string }> = [];

  async send(message: { to: string; subject: string; html: string }): Promise<void> {
    if (!this.available) {
      throw new Error('Email delivery system unavailable');
    }
    this.sentEmails.push(message);
  }

  clear(): void {
    this.sentEmails = [];
    this.available = true;
  }
}

// =============================================================================
// TEST CONTEXT
// =============================================================================

export interface ReturnsAndRefundsTestContext {
  returnRepo: InMemoryReturnRepository;
  refundRepo: InMemoryRefundRepository;
  notificationRepo: InMemoryNotificationRepository;
  labelProvider: FakeLabelProvider;
  stripewaveGateway: FakePaymentGateway;
  paynovaGateway: FakePaymentGateway;
  vaultpayGateway: FakePaymentGateway;
  emailProvider: FakeEmailProvider;
  returnService: ReturnService;
  returnLabelService: ReturnLabelService;
  refundService: RefundService;
  refundRetryService: RefundRetryService;
  inStoreReturnService: InStoreReturnService;
  notificationService: NotificationService;
}

export function createTestContext(): ReturnsAndRefundsTestContext {
  const returnRepo = new InMemoryReturnRepository();
  const refundRepo = new InMemoryRefundRepository();
  const notificationRepo = new InMemoryNotificationRepository();
  const labelProvider = new FakeLabelProvider();
  const stripewaveGateway = new FakePaymentGateway();
  const paynovaGateway = new FakePaymentGateway();
  const vaultpayGateway = new FakePaymentGateway();
  const emailProvider = new FakeEmailProvider();

  const returnLabelService = new ReturnLabelService(labelProvider);
  const notificationService = new NotificationService(emailProvider, notificationRepo);

  const vendorGateways = {
    stripewave: stripewaveGateway,
    paynova: paynovaGateway,
    vaultpay: vaultpayGateway,
  };

  const refundRetryService = new RefundRetryService(refundRepo, vendorGateways);
  const refundService = new RefundService(refundRepo, vendorGateways, refundRetryService, notificationService);
  const returnService = new ReturnService(returnRepo, returnLabelService, refundService);
  const inStoreReturnService = new InStoreReturnService(returnRepo, refundService);

  return {
    returnRepo,
    refundRepo,
    notificationRepo,
    labelProvider,
    stripewaveGateway,
    paynovaGateway,
    vaultpayGateway,
    emailProvider,
    returnService,
    returnLabelService,
    refundService,
    refundRetryService,
    inStoreReturnService,
    notificationService,
  };
}
