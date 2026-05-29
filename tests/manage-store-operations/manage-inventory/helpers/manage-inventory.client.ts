/**
 * Manage Inventory -- client helper
 *
 * Renders StockAdminForm via testing-library, asserts with vitest.
 */
import { createElement } from 'react';
import { render, screen, fireEvent, waitFor, cleanup as rtlCleanup, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, vi } from 'vitest';
import { StockAdminForm } from '@pawplace/product-catalog-client';
import * as stockApi from '@pawplace/product-catalog-client/product-catalog.api';
import * as storeApi from '@pawplace/store-client/store.api';
import { ManageInventoryBase, StockSeedData } from './manage-inventory.base';

export class ManageInventoryClientHelper extends ManageInventoryBase {

  async seed(): Promise<void> {
    // Client tier seeds by mocking API responses per test -- no DB
  }

  async cleanup(): Promise<void> {
    rtlCleanup();
    vi.restoreAllMocks();
  }

  when_store_employee_opens_stock_form(data: StockSeedData): void {
    vi.spyOn(stockApi, 'getStockAvailability').mockResolvedValue({
      productSku: data.product_sku, storeCode: data.store_code,
      quantityOnHand: data.quantity_on_hand, reservedQuantity: data.reserved_quantity,
      availableToSellQuantity: data.available_to_sell_quantity,
    });
    vi.spyOn(storeApi, 'fetchStores').mockResolvedValue([
      { storeName: data.store_name, storeCode: data.store_code, addressLineOne: '', addressLineTwo: '', city: '', countyOrRegion: '', postcode: '', country: '', latitude: 0, longitude: 0, phoneNumber: '', emailAddress: '', activeStatus: true },
    ]);
    vi.spyOn(stockApi, 'fetchProducts').mockResolvedValue([
      { sku: data.product_sku, name: data.product_name, price: '£0', brand: '', category_name: null, thumbnail: null },
    ]);
    render(
      createElement(
        MemoryRouter,
        null,
        createElement(StockAdminForm, { productSku: data.product_sku, storeCode: data.store_code }),
      ),
    );
  }

  when_store_employee_submits_new_quantity(new_quantity_on_hand: number, expected_result: 'saved' | 'rejected'): void {
    if (expected_result === 'saved') {
      vi.spyOn(stockApi, 'updateStockQuantity').mockResolvedValue({ success: true });
    } else if (new_quantity_on_hand >= 0) {
      vi.spyOn(stockApi, 'updateStockQuantity').mockRejectedValue(new Error('Quantity must not be negative'));
    }
    // Negative quantities are rejected in StockAdminForm before any API call — no mocked rejection needed.
    const formRoot = screen.getByTestId('admin-dashboard-stock-form');
    const stockLevel = within(formRoot).getByRole('spinbutton', { name: /^stock level$/i });
    fireEvent.change(stockLevel, { target: { value: String(new_quantity_on_hand) } });
    fireEvent.click(within(formRoot).getByRole('button', { name: /^save$/i }));
  }

  async then_form_displays_current_quantity(expected_quantity_on_hand: number): Promise<void> {
    const formRoot = await screen.findByTestId('admin-dashboard-stock-form');
    await waitFor(() => {
      expect(within(formRoot).getByTestId('quantity-on-hand')).toHaveTextContent(
        String(expected_quantity_on_hand),
      );
      expect(within(formRoot).getByRole('spinbutton', { name: /^stock level$/i })).toHaveValue(
        expected_quantity_on_hand,
      );
    });
  }

  async then_stock_saved_confirmation_shown(): Promise<void> {
    await waitFor(() => {
      expect(screen.getByText(/stock level saved/i)).toBeInTheDocument();
    });
  }

  async then_error_message_shown(): Promise<void> {
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  }

  async then_quantity_on_hand_unchanged(expected_quantity_on_hand: number): Promise<void> {
    const formRoot = await screen.findByTestId('admin-dashboard-stock-form');
    await waitFor(() => {
      expect(within(formRoot).getByTestId('quantity-on-hand')).toHaveTextContent(
        String(expected_quantity_on_hand),
      );
      expect(within(formRoot).getByRole('spinbutton', { name: /^stock level$/i })).toHaveValue(
        expected_quantity_on_hand,
      );
    });
  }
}
