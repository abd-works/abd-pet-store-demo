import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { vi, expect } from 'vitest';
import { StoreMap, StoreList } from '@pawplace/store-client';
import * as storeApi from '@pawplace/store-client/store.api';
import {
  LocateStoresHelper,
  StoreTestData,
  StoreListTestData,
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
    const storesWithDistance = sorted.map(d => ({
      ...LocateStoresHelper.toStoreObject(d),
      distance_km: d.expected_distance_km,
    }));
    vi.mocked(storeApi.fetchStoresNearby).mockResolvedValue(storesWithDistance);
    vi.mocked(storeApi.fetchStores).mockResolvedValue(storesWithDistance);
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
    fireEvent.click(screen.getByRole('button', { name: `select ${store_name}` }));
    await waitFor(() => screen.getByTestId('store-detail'));
  }

  async when_visitor_opens_list_view(): Promise<void> {
    render(React.createElement(StoreList));
    await waitFor(() => screen.getByTestId('store-list'));
  }

  /**
   * Simulate Shared Location flow so nearest-first sorting applies (fetchStoresNearby),
   * matching spec "customer provides Shared Location".
   */
  async when_visitor_opens_list_after_shared_location(
    latitude: number,
    longitude: number,
  ): Promise<void> {
    Object.defineProperty(globalThis.navigator, 'geolocation', {
      configurable: true,
      writable: true,
      value: {
        getCurrentPosition(success: PositionCallback): void {
          success({
            coords: {
              latitude,
              longitude,
              accuracy: 10,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          } as GeolocationPosition);
        },
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      },
    });

    render(React.createElement(StoreList));
    await waitFor(() => screen.getByTestId('store-list'));
    fireEvent.click(screen.getByRole('button', { name: /^share location$/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Loading stores/i)).not.toBeInTheDocument();
      expect(screen.getAllByTestId('store-list-entry').length).toBeGreaterThan(0);
    });
  }

  async when_customer_enters_postcode(postcode: string): Promise<void> {
    fireEvent.change(screen.getByLabelText('postcode'), {
      target: { value: postcode },
    });
    fireEvent.click(screen.getByRole('button', { name: 'find stores' }));
    await waitFor(() => screen.getByTestId('store-list'));
  }

  then_map_point_visible(store: StoreTestData): void {
    const map = screen.getByTestId('store-map');
    expect(within(map).getByText(store.store_name)).toBeInTheDocument();
  }

  then_detail_shows_address(store: StoreTestData): void {
    const panel = screen.getByTestId('store-detail');
    const address = within(panel).getByTestId('store-address');
    expect(address).toHaveTextContent(store.address_line_one);
    expect(address).toHaveTextContent(store.city);
    expect(address).toHaveTextContent(store.postcode);
  }

  then_detail_shows_contact(store: StoreTestData): void {
    const panel = screen.getByTestId('store-detail');
    expect(within(panel).getByTestId('store-phone')).toHaveTextContent(store.phone_number);
    expect(within(panel).getByTestId('store-email')).toHaveTextContent(store.email_address);
  }

  then_store_at_list_position(store: StoreTestData, expected_list_position: number): void {
    const entries = screen.getAllByTestId('store-list-entry');
    expect(within(entries[expected_list_position - 1]).getByText(store.store_name))
      .toBeInTheDocument();
  }

  then_list_entry_shows_address(store: StoreTestData, position: number): void {
    const entry = screen.getAllByTestId('store-list-entry')[position - 1];
    const combined = [store.address_line_one, store.city, store.postcode].filter(Boolean).join(', ');
    expect(within(entry).getByText(combined)).toBeInTheDocument();
  }

  then_distance_shown(store_name: string, expected_distance_km: number): void {
    const entries = screen.getAllByTestId('store-list-entry');
    const entry = entries.find(
      (el) => within(el).getByTestId('store-name').textContent === store_name,
    );
    if (!entry) throw new Error(`No list row found for ${store_name}`);
    expect(entry.textContent ?? '').toMatch(
      new RegExp(`distance\\s+${expected_distance_km.toFixed(1)}\\s*km`),
    );
  }

  then_sort_position(store_name: string, expected_sort_position: number): void {
    const entries = screen.getAllByTestId('store-list-entry');
    expect(within(entries[expected_sort_position - 1]).getByTestId('store-name')).toHaveTextContent(
      store_name,
    );
  }

  async then_distances_recalculated(store_name: string, original_km: number): Promise<void> {
    await waitFor(() => {
      const entry = [...screen.getAllByTestId('store-list-entry')].find(
        (e) => within(e).getByTestId('store-name').textContent === store_name,
      );
      expect(entry).toBeDefined();
      const text = entry!.textContent || '';
      expect(text).not.toContain(`${original_km.toFixed(1)} km`);
    });
  }

  then_no_distance_displayed(): void {
    const entries = screen.getAllByTestId('store-list-entry');
    for (const entry of entries) {
      expect(within(entry).getByText(/distance —/)).toBeInTheDocument();
    }
  }

  then_stores_in_alphabetical_order(): void {
    const entries = screen.getAllByTestId('store-list-entry');
    const names = entries.map(e => within(e).getByTestId('store-name').textContent!);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  }

  then_all_stores_visible_on_map(expected_count: number): void {
    expect(screen.getAllByTestId('store-map-point')).toHaveLength(expected_count);
  }

  then_all_stores_visible_in_list(expected_count: number): void {
    expect(screen.getAllByTestId('store-list-entry')).toHaveLength(expected_count);
  }
}
