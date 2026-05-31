import React, { useState } from 'react';
import { StaffPage } from '../../components/CustomerPage';

type TabId = 'promotional' | 'recommendation' | 'restock' | 'in-store-event';

const TABS: { id: TabId; label: string }[] = [
  { id: 'promotional', label: 'Promotional Email' },
  { id: 'recommendation', label: 'Personalized Recommendation' },
  { id: 'restock', label: 'Restock Alert' },
  { id: 'in-store-event', label: 'In-Store Event' },
];

function EmailPreviewShell({
  ariaLabel,
  subject,
  children,
}: {
  ariaLabel: string;
  subject: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={ariaLabel}
      style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}
    >
      <p>
        <strong>Subject:</strong> {subject}
      </p>
      <hr style={{ margin: '12px 0', borderColor: '#e5e7eb' }} />
      {children}
      <p style={{ marginTop: 12 }}>
        <a href="#unsubscribe" data-testid="unsubscribe-link">
          Unsubscribe
        </a>
      </p>
    </section>
  );
}

function PromotionalEmailPreview() {
  return (
    <EmailPreviewShell
      ariaLabel="promotional email preview"
      subject="Spring savings on your favourite pet supplies"
    >
      <p>promotional content — sales, new products, seasonal offers</p>
      <p data-testid="realtime-opt-out-note">
        communication preferences checked at delivery time, not batch creation time
      </p>
    </EmailPreviewShell>
  );
}

function PersonalizedRecommendationPreview() {
  return (
    <EmailPreviewShell
      ariaLabel="personalized recommendation preview"
      subject="Picked for [pet name] — in-stock recommendations"
    >
      <p>recommendation basis: purchase history, browsing history, pet profile</p>
      <p>in-stock only — out-of-stock products excluded</p>
      <p>not sent without personalization data</p>
    </EmailPreviewShell>
  );
}

function RestockAlertPreview() {
  return (
    <EmailPreviewShell
      ariaLabel="restock alert preview"
      subject="[product name] is back in stock"
    >
      <p>wishlist match — product on customer wishlist</p>
      <p>best-effort signal — stock may change after alert sent</p>
      <p>opt-in + wishlist required</p>
    </EmailPreviewShell>
  );
}

function InStoreEventPreview() {
  return (
    <EmailPreviewShell
      ariaLabel="in-store event preview"
      subject="Upcoming event at [preferred store name]"
    >
      <p>event details — date, time, location</p>
      <p>store match — preferred store required</p>
      <p>walk-in discoverable on Store Details Page</p>
    </EmailPreviewShell>
  );
}

export function MarketingNotificationPreviewPage() {
  const [activeTab, setActiveTab] = useState<TabId>('promotional');

  return (
    <StaffPage title="notification preview — marketing communications">
      <nav
        role="tablist"
        aria-label="notification type selector"
        style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid #e5e7eb' }}
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            style={{
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === id ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 14,
              color: activeTab === id ? '#1d4ed8' : '#555',
              fontWeight: activeTab === id ? 600 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 'promotional' && <PromotionalEmailPreview />}
      {activeTab === 'recommendation' && <PersonalizedRecommendationPreview />}
      {activeTab === 'restock' && <RestockAlertPreview />}
      {activeTab === 'in-store-event' && <InStoreEventPreview />}

      <section
        aria-label="delivery resilience note"
        data-testid="delivery-resilience-note"
        style={{ marginTop: 16, padding: 12, background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 6 }}
      >
        <p style={{ margin: 0, fontSize: 13, color: '#92400e' }}>
          Email queued for retry — not silently discarded
        </p>
      </section>
    </StaffPage>
  );
}
