import React, { useState } from 'react';
import { StaffPage } from '../../components/CustomerPage';

type TabId = 'return-received' | 'refund-completed' | 'refund-under-review';

const TABS: { id: TabId; label: string }[] = [
  { id: 'return-received', label: 'Return Received' },
  { id: 'refund-completed', label: 'Refund Completed' },
  { id: 'refund-under-review', label: 'Refund Under Review' },
];

function ReturnReceivedPreview() {
  return (
    <section aria-label="return received preview" style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
      <p><strong>Subject:</strong> We've received your return for order #[order number]</p>
      <hr style={{ margin: '12px 0', borderColor: '#e5e7eb' }} />
      <p><strong>order number:</strong> [order number]</p>
      <p><strong>returned items summary:</strong></p>
      <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
        <li>[product name] × [quantity]</li>
      </ul>
      <p style={{ marginTop: 12 }}>
        Inspection and refund processing are underway.
      </p>
      <p style={{ marginTop: 12, fontSize: 12, color: '#6b7280' }}>
        Sent when returned items are received at the warehouse and processing begins.
      </p>
    </section>
  );
}

function RefundCompletedPreview() {
  return (
    <section aria-label="refund completed preview" style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
      <p><strong>Subject:</strong> Your refund for order #[order number] is complete</p>
      <hr style={{ margin: '12px 0', borderColor: '#e5e7eb' }} />
      <p><strong>refunded amount:</strong> £[amount]</p>
      <p><strong>credit returned to:</strong> [masked payment method]</p>
      <p style={{ marginTop: 12, fontSize: 12, color: '#6b7280' }}>
        Sent when the payment vendor confirms the refund credit has been issued.
        Includes the refunded amount and the payment method the credit was returned to.
      </p>
    </section>
  );
}

function RefundUnderReviewPreview() {
  return (
    <section aria-label="refund under review preview" style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
      <p><strong>Subject:</strong> Update on your refund for order #[order number]</p>
      <hr style={{ margin: '12px 0', borderColor: '#e5e7eb' }} />
      <p>Your refund requires additional review.</p>
      <p>Please contact support if you need assistance.</p>
      <p style={{ marginTop: 8 }}>
        <strong>return reference:</strong> [return reference]
      </p>
      <p>
        <strong>order reference:</strong> [order number]
      </p>
      <p style={{ marginTop: 12, fontSize: 12, color: '#6b7280' }}>
        Sent when refund retry is exhausted and status transitions to "requires review".
        Includes guidance to contact support.
      </p>
    </section>
  );
}

export function ReturnNotificationPreviewPage() {
  const [activeTab, setActiveTab] = useState<TabId>('return-received');

  return (
    <StaffPage title="notification preview — return and refund updates">
      <nav
        aria-label="notification type selector"
        style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid #e5e7eb' }}
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-current={activeTab === id ? 'page' : undefined}
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

      {activeTab === 'return-received' && <ReturnReceivedPreview />}
      {activeTab === 'refund-completed' && <RefundCompletedPreview />}
      {activeTab === 'refund-under-review' && <RefundUnderReviewPreview />}

      <section
        aria-label="email resilience note"
        style={{ marginTop: 16, padding: 12, background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 6 }}
      >
        <p style={{ margin: 0, fontSize: 13, color: '#92400e' }}>
          Email queued for retry when delivery system unavailable — return/refund status still updated.
        </p>
      </section>
    </StaffPage>
  );
}
