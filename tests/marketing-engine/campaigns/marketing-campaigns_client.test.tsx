/**
 * Marketing campaigns — client tests (Increment 8 Sprint 3, engineering interface-design)
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MarketingNotificationPreviewPage } from '../../../packages/app-client/src/pages/staff/MarketingNotificationPreviewPage';

describe('Send Promotional Email — preview UI', () => {
  it('AC 3: promotional tab shows Unsubscribe link', () => {
    render(<MarketingNotificationPreviewPage />);
    expect(screen.getByRole('tab', { name: 'Promotional Email' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('unsubscribe-link')).toHaveTextContent('Unsubscribe');
  });

  it('AC 2: real-time opt-out note on promotional tab', () => {
    render(<MarketingNotificationPreviewPage />);
    expect(screen.getByTestId('realtime-opt-out-note')).toHaveTextContent(
      'communication preferences checked at delivery time, not batch creation time',
    );
  });

  it('AC 4: delivery resilience note visible on all tabs', () => {
    render(<MarketingNotificationPreviewPage />);
    expect(screen.getByTestId('delivery-resilience-note')).toHaveTextContent(
      'Email queued for retry — not silently discarded',
    );
  });
});

describe('Send Personalized Recommendation — preview UI', () => {
  it('AC 1: recommendation tab shows basis and in-stock copy', () => {
    render(<MarketingNotificationPreviewPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Personalized Recommendation' }));
    expect(screen.getByLabelText('personalized recommendation preview')).toHaveTextContent(
      'recommendation basis',
    );
    expect(screen.getByLabelText('personalized recommendation preview')).toHaveTextContent(
      'in-stock only',
    );
  });

  it('AC 2: not sent without personalization data note', () => {
    render(<MarketingNotificationPreviewPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Personalized Recommendation' }));
    expect(screen.getByText('not sent without personalization data')).toBeInTheDocument();
  });
});

describe('Send Restock Alert — preview UI', () => {
  it('AC 1: restock tab shows wishlist match and opt-in requirements', () => {
    render(<MarketingNotificationPreviewPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Restock Alert' }));
    expect(screen.getByLabelText('restock alert preview')).toHaveTextContent('wishlist match');
    expect(screen.getByLabelText('restock alert preview')).toHaveTextContent('opt-in + wishlist required');
  });

  it('AC 3: best-effort signal documented in preview', () => {
    render(<MarketingNotificationPreviewPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'Restock Alert' }));
    expect(screen.getByText('best-effort signal — stock may change after alert sent')).toBeInTheDocument();
  });
});

describe('Send In-Store Event Notification — preview UI', () => {
  it('AC 1: in-store event tab shows store match copy', () => {
    render(<MarketingNotificationPreviewPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'In-Store Event' }));
    expect(screen.getByLabelText('in-store event preview')).toHaveTextContent('preferred store required');
  });

  it('AC 2: walk-in discoverable note on store page', () => {
    render(<MarketingNotificationPreviewPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'In-Store Event' }));
    expect(screen.getByText('walk-in discoverable on Store Details Page')).toBeInTheDocument();
  });
});

describe('Marketing notification preview — accessibility', () => {
  it('tab selector is keyboard reachable with role tablist', () => {
    render(<MarketingNotificationPreviewPage />);
    expect(screen.getByRole('tablist', { name: 'notification type selector' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
  });
});
