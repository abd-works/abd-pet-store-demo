import React, { useState } from 'react';
import { StaffPage } from '../components/CustomerPage';
import { useLocation } from 'react-router-dom';

type TabId = 'reminder' | 'adopted' | 'follow-up';

const TABS: { id: TabId; label: string }[] = [
  { id: 'reminder', label: 'Appointment Reminder' },
  { id: 'adopted', label: 'Pet Adopted Before Visit' },
  { id: 'follow-up', label: 'Visit Follow-Up' },
];

function AppointmentReminderPreview() {
  return (
    <section aria-label="appointment reminder preview" style={{ padding: '16px', background: '#f9fafb', borderRadius: 8 }}>
      <p><strong>Subject:</strong> Your appointment with [pet name] is tomorrow</p>
      <hr style={{ margin: '12px 0', borderColor: '#e5e7eb' }} />
      <p><strong>pet name:</strong> [pet name]</p>
      <p><strong>store address:</strong> [store address]</p>
      <p><strong>date and time:</strong> [date/time]</p>
      <p><strong>visit note:</strong> [visit note if provided]</p>
      <p style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        Sent 24 hours before appointment. Suppressed for cancelled appointments and when pet is Adopted.
      </p>
    </section>
  );
}

function PetAdoptedPreview() {
  return (
    <section aria-label="pet adopted before visit notification preview" style={{ padding: '16px', background: '#f9fafb', borderRadius: 8 }}>
      <p><strong>Subject:</strong> [pet name] has been adopted</p>
      <hr style={{ margin: '12px 0', borderColor: '#e5e7eb' }} />
      <p><strong>pet name:</strong> [pet name]</p>
      <p><strong>adoption status:</strong> Adopted</p>
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button type="button" style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          Cancel Appointment
        </button>
        <button type="button" style={{ padding: '6px 12px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          Browse Other Pets
        </button>
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        Sent when staff marks pet adopted. Sent to each customer with a pending appointment.
      </p>
    </section>
  );
}

function VisitFollowUpPreview() {
  return (
    <section aria-label="visit follow-up notification preview" style={{ padding: '16px', background: '#f9fafb', borderRadius: 8 }}>
      <p><strong>Subject:</strong> Follow-up on your visit with [pet name]</p>
      <hr style={{ margin: '12px 0', borderColor: '#e5e7eb' }} />
      <p><strong>pet name:</strong> [pet name]</p>
      <p><strong>store:</strong> [store name]</p>
      <p><strong>follow-up context:</strong> [follow-up action details]</p>
      <p style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        Triggered on Follow-Up Date. Suppressed if pet adopted before date.
      </p>
    </section>
  );
}

export function NotificationPreviewPage() {
  const { pathname } = useLocation();
  const defaultTab: TabId = pathname.includes('adopted') ? 'adopted' : pathname.includes('follow') ? 'follow-up' : 'reminder';
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  return (
    <StaffPage title="notification preview">
      <nav aria-label="notification type selector" style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid #e5e7eb' }}>
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

      {activeTab === 'reminder' && <AppointmentReminderPreview />}
      {activeTab === 'adopted' && <PetAdoptedPreview />}
      {activeTab === 'follow-up' && <VisitFollowUpPreview />}

      <p style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
        Email queued for retry when delivery system unavailable
      </p>
    </StaffPage>
  );
}
