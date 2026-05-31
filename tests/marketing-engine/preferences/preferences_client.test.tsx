/**
 * Notification & communication preferences — client tests (Increment 8 Sprint 2)
 *
 * File: preferences_client.test.tsx (area: marketing-engine/preferences)
 * Classes: Set Communication Preferences | Set Notification Preferences | Opt In to Marketing Email List
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  MARKETING_CATEGORY_DESCRIPTIONS,
  MARKETING_CATEGORY_LABELS,
} from '@pawplace/customer-account-shared';
import {
  CommunicationPreferencesView,
  NotificationPreferencesView,
  PromotionalEmailOptInCheckbox,
  PROMOTIONAL_EMAIL_OPT_IN_LABEL,
} from '@pawplace/customer-account-client';
import { PreferenceGuestGate } from '../../../packages/app-client/src/components/PreferenceGuestGate';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../packages/customer-account/client/preferences.api', () => ({
  fetchCommunicationPreferences: vi.fn(),
  toggleCommunicationPreference: vi.fn(),
  fetchNotificationPreferences: vi.fn(),
  toggleNotificationPreference: vi.fn(),
}));

import {
  fetchCommunicationPreferences,
  toggleCommunicationPreference,
  fetchNotificationPreferences,
  toggleNotificationPreference,
} from '../../../packages/customer-account/client/preferences.api';

const mockFetchComm = fetchCommunicationPreferences as ReturnType<typeof vi.fn>;
const mockToggleComm = toggleCommunicationPreference as ReturnType<typeof vi.fn>;
const mockFetchNotif = fetchNotificationPreferences as ReturnType<typeof vi.fn>;
const mockToggleNotif = toggleNotificationPreference as ReturnType<typeof vi.fn>;

function renderWithRouter(ui: React.ReactElement, path = '/account/communication') {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>);
}

describe('Set Communication Preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchComm.mockResolvedValue({
      accountId: 'acc-1',
      onMarketingEmailList: false,
      categories: [
        { category: 'promotions', status: 'opted-out' },
        { category: 'recommendations', status: 'opted-out' },
        { category: 'restock_alerts', status: 'opted-out' },
        { category: 'events', status: 'opted-out' },
      ],
    });
  });

  it('Scenario 1: marketing categories listed with opt-in status', async () => {
    renderWithRouter(<CommunicationPreferencesView isLoggedIn isVerified />);
    await waitFor(() => {
      expect(screen.getByText('Marketing Communication Preferences')).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Promotions/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(MARKETING_CATEGORY_DESCRIPTIONS.promotions))).toBeInTheDocument();
    expect(screen.getByLabelText(/Recommendations/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Restock Alerts/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Events/)).toBeInTheDocument();
    expect(screen.getByText(MARKETING_CATEGORY_LABELS.promotions)).toBeInTheDocument();
  });

  it('Scenario 2: toggle persists immediately via PATCH', async () => {
    mockToggleComm.mockResolvedValue({
      accountId: 'acc-1',
      onMarketingEmailList: true,
      categories: [{ category: 'promotions', status: 'opted-in' }],
    });
    renderWithRouter(<CommunicationPreferencesView isLoggedIn isVerified />);
    await waitFor(() => screen.getByLabelText(/Promotions/));
    fireEvent.click(screen.getByLabelText(/Promotions/));
    await waitFor(() => {
      expect(mockToggleComm).toHaveBeenCalledWith({ category: 'promotions', optedIn: true });
    });
  });

  it('Scenario 4: transactional note visible', async () => {
    renderWithRouter(<CommunicationPreferencesView isLoggedIn isVerified />);
    await waitFor(() => {
      expect(
        screen.getByText('Transactional notifications not affected by these settings'),
      ).toBeInTheDocument();
    });
  });

  it('Scenario 5: guest gate without navigation', () => {
    renderWithRouter(<CommunicationPreferencesView isLoggedIn={false} isVerified={false} />);
    expect(screen.getByTestId('preference-guest-gate')).toBeInTheDocument();
    expect(
      screen.getByText('Log in or register to manage communication preferences'),
    ).toBeInTheDocument();
  });
});

describe('Set Notification Preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchNotif.mockResolvedValue({
      accountId: 'acc-1',
      criticalNote:
        'Some notifications cannot be disabled (e.g. order confirmation, refund completion)',
      categories: [
        { category: 'order_updates', enabled: true },
        { category: 'shipping', enabled: true },
        { category: 'appointments', enabled: true },
        { category: 'returns', enabled: true },
      ],
    });
  });

  it('Scenario 1: categories listed with on/off state', async () => {
    renderWithRouter(<NotificationPreferencesView isLoggedIn isVerified />, '/account/notification-preferences');
    await waitFor(() => screen.getByText('Notification Preferences'));
    expect(screen.getByLabelText(/Order Updates/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shipping Notifications/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Appointment Reminders/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Return Updates/)).toBeInTheDocument();
  });

  it('Scenario 2: toggle persists immediately', async () => {
    mockToggleNotif.mockResolvedValue({
      accountId: 'acc-1',
      criticalNote: 'Some notifications cannot be disabled (e.g. order confirmation, refund completion)',
      categories: [{ category: 'shipping', enabled: false }],
    });
    renderWithRouter(<NotificationPreferencesView isLoggedIn isVerified />, '/account/notification-preferences');
    await waitFor(() => screen.getByLabelText(/Shipping Notifications/));
    fireEvent.click(screen.getByLabelText(/Shipping Notifications/));
    await waitFor(() => {
      expect(mockToggleNotif).toHaveBeenCalledWith({ category: 'shipping', enabled: false });
    });
  });

  it('Scenario 3: critical notifications note visible', async () => {
    renderWithRouter(<NotificationPreferencesView isLoggedIn isVerified />, '/account/notification-preferences');
    await waitFor(() => {
      expect(screen.getByText(/order confirmation/)).toBeInTheDocument();
    });
  });

  it('Scenario 4: guest login prompt with checkout note', () => {
    renderWithRouter(<NotificationPreferencesView isLoggedIn={false} isVerified={false} />, '/account/notification-preferences');
    expect(screen.getByText('Log in or create an account')).toBeInTheDocument();
    expect(screen.getByText('Guest order notifications continue via checkout email')).toBeInTheDocument();
  });
});

describe('Opt In to Marketing Email List', () => {
  it('Scenario 2: promotional checkbox defaults unchecked', () => {
    render(
      <PromotionalEmailOptInCheckbox checked={false} onChange={vi.fn()} />,
    );
    expect(screen.getByRole('checkbox', { name: PROMOTIONAL_EMAIL_OPT_IN_LABEL })).not.toBeChecked();
    expect(screen.getByText(PROMOTIONAL_EMAIL_OPT_IN_LABEL)).toBeInTheDocument();
  });
});

describe('PreferenceGuestGate', () => {
  it('preserves returnTo on login and register links', () => {
    render(
      <MemoryRouter initialEntries={['/account/communication']}>
        <PreferenceGuestGate message="Log in or register to manage communication preferences" />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Log In' })).toHaveAttribute(
      'href',
      '/login?returnTo=%2Faccount%2Fcommunication',
    );
  });
});
