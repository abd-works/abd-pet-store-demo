/**
 * Pet profiles & inventory — client tests (Increment 9 Sprint 3, engineering interface-design)
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MyPetsView } from '../../../packages/customer-account/client/MyPetsView';
import { PetProfileForm } from '../../../packages/customer-account/client/PetProfileForm';
import { InventoryDashboardTable } from '../../../packages/product-catalog/client/InventoryDashboardTable';
import { filterDashboardRows, stockStatusLabel } from '../../../packages/product-catalog/client/inventoryDashboardUtils';
import { BackorderProductActions } from '../../../packages/product-catalog/client/BackorderProductActions';

vi.mock('../../../packages/customer-account/client/pet-profile.api', () => ({
  fetchPetProfiles: vi.fn(),
  createPetProfile: vi.fn(),
  updatePetProfile: vi.fn(),
  deletePetProfile: vi.fn(),
}));

import { fetchPetProfiles } from '../../../packages/customer-account/client/pet-profile.api';

const mockFetchPets = fetchPetProfiles as ReturnType<typeof vi.fn>;

const sampleRows = [
  {
    productSku: 'PET-HAR-001',
    storeCode: 'STR-001',
    storeName: 'PawPlace Camden',
    quantityOnHand: 3,
    availableToSellQuantity: 3,
    backorderEnabled: false,
    lowStock: true,
  },
  {
    productSku: 'PET-FLT-099',
    storeCode: 'STR-001',
    storeName: 'PawPlace Camden',
    quantityOnHand: 0,
    availableToSellQuantity: 0,
    backorderEnabled: true,
    lowStock: false,
  },
];

describe('Create Customer Pet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('AC 1: empty state when no profiles', async () => {
    mockFetchPets.mockResolvedValue([]);
    render(<MemoryRouter><MyPetsView /></MemoryRouter>);
    await screen.findByTestId('my-pets-empty-state');
    expect(screen.getByText('add your first pet')).toBeTruthy();
  });

  it('AC 2: form exposes required fields', () => {
    render(<MemoryRouter><PetProfileForm isLoggedIn isVerified /></MemoryRouter>);
    expect(screen.getByLabelText('name')).toBeTruthy();
    expect(screen.getByLabelText('species')).toBeTruthy();
    expect(screen.getByLabelText(/breed/)).toBeTruthy();
  });

  it('AC 5: guest submit opens login modal', () => {
    render(<MemoryRouter initialEntries={['/account/pets/new']}><PetProfileForm isLoggedIn={false} isVerified={false} /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Rex' } });
    fireEvent.change(screen.getByLabelText('species'), { target: { value: 'dog' } });
    fireEvent.submit(screen.getByTestId('pet-profile-form'));
    expect(screen.getByTestId('pet-guest-modal')).toBeTruthy();
  });
});

describe('View Inventory Dashboard', () => {
  it('AC 2: low stock badge when below threshold', () => {
    render(<InventoryDashboardTable rows={sampleRows.slice(0, 1)} threshold={5} />);
    expect(screen.getByTestId('low-stock-badge-PET-HAR-001')).toBeTruthy();
  });

  it('AC 5: out of stock label not low stock badge', () => {
    expect(stockStatusLabel(sampleRows[1], 5)).toBe('Out of stock');
    render(<InventoryDashboardTable rows={[sampleRows[1]]} threshold={5} />);
    expect(screen.getByTestId('out-of-stock-PET-FLT-099')).toBeTruthy();
    expect(screen.queryByTestId('low-stock-badge-PET-FLT-099')).toBeNull();
  });

  it('AC 4: low stock only filter', () => {
    const filtered = filterDashboardRows(sampleRows, { lowStockOnly: true, threshold: 5 });
    expect(filtered.map((row) => row.productSku)).toEqual(['PET-HAR-001']);
  });
});

describe('Allow Backorder Purchase', () => {
  it('AC 1: backorder indicator and enabled add to cart', () => {
    const onAdd = vi.fn();
    render(<BackorderProductActions sku="PET-FLT-099" backorderEnabled inStock={false} onAdd={onAdd} />);
    expect(screen.getByTestId('backorder-status').textContent).toBe('Backorder');
    expect(screen.getByTestId('add-to-cart-backorder').textContent).toContain('Backorder');
    expect((screen.getByTestId('add-to-cart-backorder') as HTMLButtonElement).disabled).toBe(false);
  });

  it('AC 4: out of stock without backorder disables cart', () => {
    render(<BackorderProductActions sku="PET-X" backorderEnabled={false} inStock={false} onAdd={vi.fn()} />);
    expect(screen.getByTestId('out-of-stock-status')).toBeTruthy();
    expect((screen.getByTestId('add-to-cart-backorder') as HTMLButtonElement).disabled).toBe(true);
  });
});
