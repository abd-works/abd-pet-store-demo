import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CustomerPage } from '../components/CustomerPage';
import { confirmBooking } from '../../../appointment/client/appointment.api';
import type { TimeSlotDto } from '../../../appointment/client/appointment.api';

const MAX_NOTE = 500;

interface LocationState {
  holdId: string;
  slot: TimeSlotDto;
  petName: string;
  storeName: string;
}

function formatDateTime(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  return `${start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · ${start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}–${end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

export function AppointmentConfirmPage() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const [visitNote, setVisitNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const noteCharCount = visitNote.length;
  const noteOverLimit = noteCharCount > MAX_NOTE;
  const noteCountId = 'visit-note-count';
  const noteErrorId = 'visit-note-error';

  if (!state) {
    return (
      <CustomerPage title="confirm booking">
        <p>Booking session not found — <a href={`/pets/${petId}`}>start again</a></p>
      </CustomerPage>
    );
  }

  const handleConfirm = async () => {
    if (noteOverLimit) return;
    setSubmitting(true);
    setError(null);
    try {
      const appointment = await confirmBooking(state.holdId, visitNote || undefined);
      navigate(`/pets/${petId}/book/confirmed`, { state: { appointment } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Booking failed';
      if (msg.toLowerCase().includes('slot') || msg.toLowerCase().includes('no longer')) {
        setError('Your selected slot is no longer available — please select a new time');
        navigate(`/pets/${petId}/book/slots`);
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerPage title="confirm booking">
      <nav aria-label="breadcrumb" style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        <a href={`/pets/${petId}/book/slots`} style={{ color: '#3b82f6' }}>← Back to slot selection</a>
      </nav>

      <section aria-label="appointment summary" style={{ marginBottom: 20, padding: '12px 16px', background: '#f9fafb', borderRadius: 8 }}>
        <p><strong aria-label="pet name">pet:</strong> {state.petName}</p>
        <p><strong aria-label="store name">store:</strong> {state.storeName}</p>
        <p><strong aria-label="date and time">date and time:</strong> {formatDateTime(state.slot.startAt, state.slot.endAt)}</p>
      </section>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="visit-note" style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>
          Visit Note <span style={{ fontWeight: 400, color: '#888' }}>(optional)</span>
        </label>
        <textarea
          id="visit-note"
          aria-label="Visit Note (optional)"
          aria-describedby={`${noteCountId} ${noteOverLimit ? noteErrorId : ''}`}
          value={visitNote}
          onChange={(e) => setVisitNote(e.target.value)}
          rows={4}
          maxLength={MAX_NOTE + 100}
          style={{
            width: '100%',
            padding: '8px 10px',
            border: noteOverLimit ? '1px solid #dc2626' : '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14,
            resize: 'vertical',
          }}
        />
        <p id={noteCountId} aria-live="polite" style={{ fontSize: 12, color: noteOverLimit ? '#dc2626' : '#888', marginTop: 4 }}>
          {noteCharCount} / {MAX_NOTE} characters
        </p>
        {noteOverLimit && (
          <p id={noteErrorId} role="alert" style={{ color: '#dc2626', fontSize: 13 }}>
            visit note exceeds {MAX_NOTE} characters
          </p>
        )}
      </div>

      {error && <p role="alert" style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting || noteOverLimit}
          style={{
            padding: '10px 20px',
            background: submitting || noteOverLimit ? '#e5e7eb' : '#3b82f6',
            color: submitting || noteOverLimit ? '#9ca3af' : '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: submitting || noteOverLimit ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {submitting ? 'Confirming…' : 'Confirm Booking'}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/pets/${petId}/book/slots`)}
          disabled={submitting}
          style={{ padding: '10px 20px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer' }}
        >
          Back to slot selection
        </button>
      </div>
    </CustomerPage>
  );
}
