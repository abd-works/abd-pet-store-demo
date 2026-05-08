import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { vi, expect } from 'vitest';
import { StoreMap, StoreList } from '@pawplace/store-client';
import * as storeApi from '@pawplace/store-client/store.api';
import {
  LocateStoresHelper,
  StoreTestData,
  DistanceTestData,
} from './locate-stores.base';

export class LocateStoresClientHelper extends LocateStoresHelper {
  async given_stores_seeded(): Promise<void> {
    vi.mocked(storeApi.fetchStores).mockResolvedValue(
      LocateStoresHelper.STORES.map(LocateStoresHelper.toStoreObject),
    );
  }

  given_customer_at_location(latitude: number, longitude: number): void {
    const sorted = [...LocateStoresHelper.STORE_DISTANCES]
      .sort((a, b) => a.expected_sort_position - b.expected_sort_position);
    vi.mocked(storeApi.fetchStoresNearby).mockResolvedValue(
      sorted.map(d => ({
        ...LocateStoresHelper.toStoreObject(d),
        distance_km: d.expected_distance_km,
      })),
    );
  }

  given_customer_at_alternate_location(): void {
    vi.mocked(storeApi.fetchStoresNearby).mockResolvedValue(
      [LocateStoresHelper.STORES[2], LocateStoresHelper.STORES[1], LocateStoresHelper.STORES[0]]
        .map((s, i) => ({
          ...LocateStoresHelper.toStoreObject(s),
          distance_km: [0.2, 189.4, 263.1][i],
        })),
    );
  }

  async cleanup(): Promise<void> {
    vi.restoreAllMocks();
  }

  async when_visitor_opens_map_view(): Promise<void> {
    render(React.createElement(StoreMap));
    await waitFor(() => screen.getByTestId('store-map'));
  }

  async when_visitor_selects_store(store_name: string): Promise<void> {
    fireEvent.click(screen.getByLabelText(store_name));
  }

  async when_visitor_opens_list_view(): Promise<void> {
    render(React.createElement(StoreList));
    await waitFor(() => screen.getByTestId('store-list'));
  }

  async when_customer_enters_postcode(postcode: string): Promise<void> {
    fireEvent.change(screen.getByLabelText('Postcode'), {
      target: { value: postcode },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Find' }));
    await waitFor(() => screen.getByTestId('store-list'));
  }

  then_map_point_visible(store: StoreTestData): void {
    expect(screen.getByLabelText(store.store_name)).toBeInTheDocument();
  }

  then_detail_shows_address(store: StoreTestData): void {
    expect(screen.getByText(store.address_line_one)).toBeInTheDocument();
    expect(screen.getByText(store.city)).toBeInTheDocument();
    expect(screen.getByText(store.postcode)).toBeInTheDocument();
  }

  then_detail_shows_contact(store: StoreTestData): void {
    expect(screen.getByText(store.phone_number)).toBeInTheDocument();
    expect(screen.getByText(store.email_address)).toBeInTheDocument();
  }

  then_store_at_list_position(store: StoreTestData, expected_list_position: number): void {
    const entries = screen.getAllByTestId('store-list-entry');
    expect(within(entries[expected_list_position - 1]).getByText(store.store_name))
      .toBeInTheDocument();
  }

  then_list_entry_shows_address(store: StoreTestData, position: number): void {
    const entry = screen.getAllByTestId('store-list-entry')[position - 1];
    expect(within(entry).getByText(store.address_line_one)).toBeInTheDocument();
    expect(within(entry).getByText(store.city)).toBeInTheDocument();
    expect(within(entry).getByText(store.postcode)).toBeInTheDocument();
  }

  then_list_entry_shows_contact(store: StoreTestData, position: number): void {
    const entry = screen.getAllByTestId('store-list-entry')[position - 1];
    expect(within(entry).getByText(store.phone_number)).toBeInTheDocument();
    expect(within(entry).getByText(store.email_address)).toBeInTheDocument();
  }

  then_distance_shown(store_name: string, expected_distance_km: number): void {
    const entry = screen.getByText(store_name).closest('[data-testid="store-list-entry"]')!;
    expect(within(entry as HTMLElement).getByText(`${expected_distance_km} km`))
      .toBeInTheDocument();
  }

  then_sort_position(store_name: string, expected_sort_position: number): void {
    const entries = screen.getAllByTestId('store-list-entry');
    expect(within(entries[expected_sort_position - 1]).getByText(store_name))
      .toBeInTheDocument();
  }

  async then_distances_recalculated(store_name: string, original_km: number): Promise<void> {
    await waitFor(() => {
      const entry = screen.getByText(store_name).closest('[data-testid="store-list-entry"]')!;
      const text = (entry as HTMLElement).textContent || '';
      expect(text).not.toContain(`${original_km} km`);
    });
  }

  then_no_distance_displayed(): void {
    const entries = screen.getAllByTestId('store-list-entry');
    for (const entry of entries) {
      expect(within(entry).queryByTestId('distance')).not.toBeInTheDocument();
    }
  }

  then_stores_in_alphabetical_order(): void {
    const entries = screen.getAllByTestId('store-list-entry');
    const names = entries.map(e => within(e).getByTestId('store-name').textContent!);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  }
}
