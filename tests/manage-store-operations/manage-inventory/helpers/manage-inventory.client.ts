/**
 * Manage Inventory -- client helper
 *
 * Renders StockAdminForm via testing-library, asserts with vitest.
 */
import { createElement } from 'react';
import { render, screen, fireEvent, waitFor, cleanup as rtlCleanup } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { StockAdminForm } from '@pawplace/product-catalog-client';
import * as stockApi from '@pawplace/product-catalog-client/product-catalog.api';
import { ManageInventoryBase, StockSeedData } from './manage-inventory.base';

export class ManageInventoryClientHelper extends ManageInventoryBase {

  async seed(): Promise<void> {
    // Client tier seeds by mocking API responses per test -- no DB
  }

  async cleanup(): Promise<void> {
    rtlCleanup();
    vi.restoreAllMocks();
  }

  // -- WHEN ---------------------------------------------------------------

  when_store_employee_opens_stock_form(data: StockSeedData): void {
    vi.spyOn(stockApi, 'getStockAvailability').mockResolvedValue({
      productSku: data.product_sku, storeCode: data.store_code,
      quantityOnHand: data.quantity_on_hand, reservedQuantity: data.reserved_quantity,
      availableToSellQuantity: data.available_to_sell_quantity,
    });
    render(createElement(StockAdminForm, { productSku: data.product_sku, storeCode: data.store_code }));
  }

  when_store_employee_submits_new_quantity(new_quantity_on_hand: number, expected_result: 'saved' | 'rejected'): void {
    if (expected_result === 'saved') {
      vi.spyOn(stockApi, 'updateStockQuantity').mockResolvedValue({ success: true });
    } else {
      vi.spyOn(stockApi, 'updateStockQuantity').mockRejectedValue(new Error('Quantity must not be negative'));
    }
    fireEvent.change(screen.getByLabelText(/quantity on hand/i), { target: { value: String(new_quantity_on_hand) } });
    fireEvent.click(screen.getByRole('button', { name: /update stock/i }));
  }

  // -- THEN ---------------------------------------------------------------

  async then_form_displays_current_quantity(expected_quantity_on_hand: number): Promise<void> {
    await waitFor(() => {
      expect(screen.getByLabelText(/quantity on hand/i)).toHaveValue(expected_quantity_on_hand);
    });
  }

  async then_stock_saved_confirmation_shown(): Promise<void> {
    await waitFor(() => {
      expect(screen.getByText(/stock updated/i)).toBeInTheDocument();
    });
  }

  async then_error_message_shown(): Promise<void> {
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  }

  async then_quantity_on_hand_unchanged(expected_quantity_on_hand: number): Promise<void> {
    await waitFor(() => {
      expect(screen.getByLabelText(/quantity on hand/i)).toHaveValue(expected_quantity_on_hand);
    });
  }
}
