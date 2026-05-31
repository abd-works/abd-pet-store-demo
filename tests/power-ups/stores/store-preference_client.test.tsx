/**
 * Store preference & tailoring — client tests (Increment 9 Sprint 2, engineering interface-design)
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StoreFilterPanel } from '../../../packages/store/client/StoreFilterPanel';
import { StoreLocatorNoMatch } from '../../../packages/store/client/StoreLocatorNoMatch';
import { StoreListEntries } from '../../../packages/store/client/StoreListEntries';
import { StoreDetailPanel } from '../../../packages/store/client/StoreDetailPanel';
import { applyStoreFilters, enrichStoreWithSpecializations } from '../../../packages/store/client/storeFilterUtils';
import { resolvePreferredPickupSelection } from '../../../packages/store/client/preferredPickupSelection';
import { MOCK_STORES } from '../../../packages/store/client/mock-stores';
import { MyStorePreferenceView } from '../../../packages/customer-account/client/MyStorePreferenceView';
import { StockAvailabilityDisplay } from '../../../packages/product-catalog/client/StockAvailabilityDisplay';

vi.mock('../../../packages/product-catalog/client/product-catalog.api', () => ({
  fetchStockAvailability: vi.fn().mockResolvedValue([
    { store_code: 'STR-001', store_name: 'PawPlace Camden', stock_label: 'In stock' },
    { store_code: 'STR-002', store_name: 'PawPlace Bristol', stock_label: 'In stock' },
  ]),
}));

vi.mock('@pawplace/store-client/store.api', () => ({
  fetchStores: vi.fn().mockResolvedValue([
    {
      storeName: 'PawPlace Camden',
      storeCode: 'STR-001',
      addressLineOne: '42 High Street',
      city: 'London',
      postcode: 'NW1 8QP',
      phoneNumber: '020',
      emailAddress: 'camden@pawplace.co.uk',
    },
    {
      storeName: 'PawPlace Bristol',
      storeCode: 'STR-002',
      addressLineOne: '15 Harbour Road',
      city: 'Bristol',
      postcode: 'BS1 4DJ',
      phoneNumber: '0117',
      emailAddress: 'bristol@pawplace.co.uk',
    },
  ]),
  fetchStoresNearby: vi.fn(),
}));

vi.mock('@pawplace/order-client/order.api');

vi.mock('../../../packages/app-client/src/context/CustomerSessionContext', () => ({
  useCustomerSession: () => ({ isLoggedIn: true, isVerified: true, loading: false }),
}));

vi.mock('../../../packages/app-client/src/context/CartContext', () => ({
  useCart: () => ({ cart: { subtotalFormatted: '£10.00' } }),
}));

vi.mock('../../../packages/app-client/src/checkout/checkoutDraft', () => ({
  loadCheckoutDraft: () => ({ guestEmail: 'a@b.com', billingAddress: { line1: '1 St' } }),
  mergeCheckoutDraft: vi.fn(),
  isLegacyCheckoutPath: () => false,
}));

vi.mock('../../../packages/customer-account/client/my-store.api', () => ({
  fetchMyStore: vi.fn(),
  setMyStore: vi.fn(),
  clearMyStore: vi.fn(),
}));

vi.mock('../../../packages/customer-account/client/useMyStorePreference', () => ({
  useMyStorePreference: vi.fn(),
}));

import { fetchMyStore, setMyStore, clearMyStore } from '../../../packages/customer-account/client/my-store.api';
import { useMyStorePreference } from '../../../packages/customer-account/client/useMyStorePreference';

const mockUseMyStore = useMyStorePreference as ReturnType<typeof vi.fn>;
const enriched = MOCK_STORES.map(enrichStoreWithSpecializations);

describe('Filter Stores by Availability and Specialization', () => {
  it('AC 1: filter dimensions available', () => {
    render(<StoreFilterPanel filters={{}} onChange={vi.fn()} />);
    expect(screen.getByTestId('store-filter-panel')).toBeTruthy();
    expect(screen.getAllByText('store specialization filter').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('product')).toBeTruthy();
  });

  it('AC 2: specialization filter narrows list', () => {
    const filtered = applyStoreFilters(enriched, { specialization: 'reptile section' });
    expect(filtered.map((store) => store.storeCode)).toEqual(['STR-001', 'STR-003']);
  });

  it('AC 3: product availability filter shows in-stock stores', () => {
    const filtered = applyStoreFilters(enriched, { productSku: 'PET-FLT-099' });
    expect(filtered.map((store) => store.storeCode)).toEqual(['STR-002']);
  });

  it('AC 4: conjunctive combined filters', () => {
    const filtered = applyStoreFilters(enriched, {
      specialization: 'premium dog food',
      productSku: 'PET-HAR-001',
    });
    expect(filtered.map((store) => store.storeCode)).toEqual(['STR-001', 'STR-002']);
  });

  it('AC 5: zero match shows clear filters', () => {
    const onClear = vi.fn();
    render(<StoreLocatorNoMatch onClearFilters={onClear} />);
    expect(screen.getByText('no stores match your filters')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'clear filters' }));
    expect(onClear).toHaveBeenCalled();
  });
});

describe('Set My Store Preference', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('AC 1: set from detail saves preference', async () => {
    const onSet = vi.fn().mockResolvedValue(undefined);
    render(
      <MemoryRouter>
        <StoreDetailPanel
          store={MOCK_STORES[0]}
          onClose={vi.fn()}
          isLoggedIn
          isVerified
          onSetMyStore={onSet}
        />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId('set-as-my-store'));
    await waitFor(() => expect(onSet).toHaveBeenCalledWith('STR-001'));
  });

  it('AC 2: replace previous via save callback', async () => {
    const onSet = vi.fn().mockResolvedValue(undefined);
    render(
      <MemoryRouter>
        <StoreDetailPanel
          store={MOCK_STORES[1]}
          onClose={vi.fn()}
          isLoggedIn
          isVerified
          preferredStoreCode="STR-001"
          onSetMyStore={onSet}
        />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId('set-as-my-store'));
    await waitFor(() => expect(onSet).toHaveBeenCalledWith('STR-002'));
  });

  it('AC 3: unset shows browse stores state', async () => {
    mockUseMyStore.mockReturnValue({
      storeCode: null,
      loading: false,
      refresh: vi.fn(),
      save: vi.fn(),
      clear: vi.fn(),
    });
    render(
      <MemoryRouter>
        <MyStorePreferenceView isLoggedIn isVerified />
      </MemoryRouter>,
    );
    expect(screen.getByText('No preferred store set')).toBeTruthy();
    expect(screen.getByText('Browse stores')).toBeTruthy();
  });

  it('AC 4: guest sees modal without navigation', () => {
    render(
      <MemoryRouter initialEntries={['/stores']}>
        <StoreDetailPanel store={MOCK_STORES[0]} onClose={vi.fn()} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId('set-as-my-store'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('log in or register to set my store')).toBeTruthy();
  });
});

describe('Tailor Experience to Preferred Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('AC 1: stock display defaults to my store', async () => {
    render(
      <MemoryRouter>
        <StockAvailabilityDisplay productSku="PET-HAR-001" preferredStoreCode="STR-001" />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('stock-default-my-store')).toBeTruthy();
    });
    expect(screen.getByTestId('stock-STR-001').getAttribute('data-preferred')).toBe('true');
  });

  it('AC 2: locator highlights preferred store row', () => {
    render(
      <StoreListEntries
        stores={enriched}
        selectedStore={null}
        preferredStoreCode="STR-001"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByTestId('preferred-store-badge').textContent).toContain('your preferred store');
  });

  it('AC 3: checkout pre-selects preferred store', () => {
    expect(resolvePreferredPickupSelection('STR-001', null)).toBe('STR-001');
    expect(resolvePreferredPickupSelection('STR-001', 'STR-002')).toBe('STR-002');
  });

  it('AC 4: no tailoring when unset', async () => {
    render(
      <MemoryRouter>
        <StockAvailabilityDisplay productSku="PET-HAR-001" preferredStoreCode={null} />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId('stock-STR-001')).toBeTruthy());
    expect(screen.queryByTestId('stock-default-my-store')).toBeNull();
  });
});
