/**
 * Generate Return Label or QR Code -- server tests (Increment 7)
 *
 * Stories: Generate Return Label or QR Code
 * Scenarios: label and QR generated on submission, label includes required info,
 *            QR code displayable on mobile, return preserved when label service unavailable.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTestContext,
  ORDERS,
  RETURNS,
  CUSTOMERS,
  type ReturnsAndRefundsTestContext,
} from '../helpers/returns-and-refunds.helper';
import { Return } from '../../../packages/return/shared/Return';
import { ReturnRequest } from '../../../packages/return/shared/ReturnRequest';
import { ReturnLabel } from '../../../packages/return/shared/ReturnLabel';
import { ReturnQRCode } from '../../../packages/return/shared/ReturnQRCode';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function given_return_request_submitted(ctx: ReturnsAndRefundsTestContext, orderNumber: string, returnId: string) {
  const request = new ReturnRequest({
    selectedOrderLineItems: [{ sku: 'premium-dog-kibble-10kg', quantity: 1 }],
    quantitiesToReturn: [1],
    returnReason: 'changed mind',
  });
  return ctx.returnService.initiateReturn(orderNumber, request);
}

async function given_return_with_label(ctx: ReturnsAndRefundsTestContext, returnId: string, orderNumber: string) {
  const returnEntity = await given_return_request_submitted(ctx, orderNumber, returnId);
  return returnEntity;
}

function given_label_service_unavailable(ctx: ReturnsAndRefundsTestContext): void {
  ctx.labelProvider.available = false;
}

function when_customer_downloads_return_label(returnEntity: Return) {
  return returnEntity.returnLabel;
}

function when_customer_selects_qr_code(returnEntity: Return) {
  return returnEntity.returnQrCode;
}

function then_label_and_qr_code_generated(returnEntity: Return) {
  expect(returnEntity.returnLabel).toBeDefined();
  expect(returnEntity.returnQrCode).toBeDefined();
}

function then_label_includes_required_info(label: ReturnLabel, expectedOrderNumber: string, expectedReturnReference: string) {
  expect(label.returnAddress).toBe('PawPlace Returns Centre');
  expect(label.orderNumber).toBe(expectedOrderNumber);
  expect(label.returnReference).toBe(expectedReturnReference);
  expect(label.carrierBarcode).toBeTruthy();
}

function then_qr_code_displayable_with_matching_reference(qrCode: ReturnQRCode, expectedReturnReference: string) {
  expect(qrCode.returnReference).toBe(expectedReturnReference);
}

function then_return_preserved_without_label(returnEntity: Return) {
  expect(returnEntity.returnId).toBeTruthy();
  expect(returnEntity.returnStatus).toBe('initiated');
}

// =============================================================================
// STORY: Generate Return Label or QR Code
// =============================================================================

describe('Generate Return Label or QR Code', () => {
  let ctx: ReturnsAndRefundsTestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  describe('TestGenerateReturnLabelOrQRCode', () => {
    it('return label and QR code generated on return request submission', async () => {
      // Given: a Return Request for Return RTN-7001 has been submitted for Order ORD-4401
      const returnEntity = await given_return_request_submitted(ctx, 'ORD-4401', 'RTN-7001');

      // When: the system processes the Return Request
      // (label generation is part of initiateReturn flow)

      // Then: the system generates a Return Label as a printable PDF
      //   and the system generates a Return QR Code
      //   and both are shown on the Return confirmation page
      //   and both are emailed to Customer Account sarah.mitchell@pawplace.example
      then_label_and_qr_code_generated(returnEntity);
    });

    it('return label includes all required return information', async () => {
      // Given: a Return RTN-7001 for Order ORD-4401 with a Return Label generated
      const returnEntity = await given_return_with_label(ctx, 'RTN-7001', 'ORD-4401');

      // When: the Customer downloads the Return Label
      const label = when_customer_downloads_return_label(returnEntity);

      // Then: the Return Label includes the return address "PawPlace Returns Centre"
      //   and the Return Label includes the Order number ORD-4401
      //   and the Return Label includes the return reference RTN-7001
      //   and the Return Label includes a carrier barcode
      then_label_includes_required_info(label, 'ORD-4401', returnEntity.returnId);
    });

    it('QR code displayable on mobile with same return reference as label', async () => {
      // Given: a Return RTN-7001 for Order ORD-4401 with a Return QR Code generated
      const returnEntity = await given_return_with_label(ctx, 'RTN-7001', 'ORD-4401');

      // When: the Customer selects the Return QR Code option
      const qrCode = when_customer_selects_qr_code(returnEntity);

      // Then: the Return QR Code is displayable on a mobile device at a carrier drop-off point
      //   and the Return QR Code encodes the same return reference as the Return Label
      then_qr_code_displayable_with_matching_reference(qrCode, returnEntity.returnLabel.returnReference);
    });

    it('return preserved when label generation service is unavailable', async () => {
      // Given: a Return Request for Return RTN-7002 has been submitted for Order ORD-5502
      //   and the Return Label generation service is temporarily unavailable
      given_label_service_unavailable(ctx);

      // When: the system attempts to generate the Return Label and Return QR Code
      const returnEntity = await given_return_request_submitted(ctx, 'ORD-5502', 'RTN-7002');

      // Then: the Return RTN-7002 is still recorded with Return Status "initiated"
      //   and the Customer is told to check back or contact support for the label
      //   and the Return is not cancelled due to label generation failure
      then_return_preserved_without_label(returnEntity);
    });
  });
});
