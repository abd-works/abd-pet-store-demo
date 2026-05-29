import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StaffPage } from '../../components/CustomerPage';
import { staffRecordOutcome, fetchStaffAppointments } from '../../../../../appointment/client/appointment.api';
import type { StaffAppointmentDto } from '../../../../../appointment/client/appointment.api';

const OUTCOMES = [
  { value: 'adopted', label: 'Adopted' },
  { value: 'interested_returning', label: 'Interested — Returning' },
  { value: 'not_a_fit', label: 'Not a Fit' },
  { value: 'browsing_only', label: 'Browsing Only' },
] as const;

export function RecordOutcomePage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<StaffAppointmentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [outcome, setOutcome] = useState('');
  const [staffVisitNotes, setStaffVisitNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStaffAppointments()
      .then((list) => {
        const found = list.find((a) => a.appointmentId === appointmentId) ?? null;
        setAppointment(found);
        if (found?.outcome) setOutcome(found.outcome);
      })
      .catch(() => setError('Failed to load appointment'))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const handleSubmit = async () => {
    if (!appointmentId || !outcome) return;
    setSubmitting(true);
    setError(null);
    try {
      await staffRecordOutcome(appointmentId, outcome, staffVisitNotes || undefined);
      if (outcome === 'interested_returning') {
        navigate(`/staff/appointments/${appointmentId}/follow-up`);
      } else {
        navigate('/staff/appointments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record outcome');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <StaffPage title="record outcome"><p>Loading…</p></StaffPage>;

  const existingOutcome = appointment?.outcome;

  return (
    <StaffPage title="record visit outcome">
      <section aria-label="appointment context" style={{ marginBottom: 20, padding: '12px 16px', background: '#f9fafb', borderRadius: 8 }}>
        {appointment && (
          <>
            <p><strong aria-label="customer name">customer:</strong> {appointment.customerName}</p>
            <p><strong aria-label="pet name">pet:</strong> {appointment.petName}</p>
            <p><strong aria-label="date and time">date and time:</strong> {new Date(appointment.startAt).toLocaleString('en-GB')}</p>
          </>
        )}
      </section>

      {existingOutcome && (
        <div role="alert" style={{ marginBottom: 16, padding: '10px 14px', background: '#fef9c3', borderRadius: 8 }}>
          <strong>Outcome already recorded:</strong> {existingOutcome}{' '}
          <button
            type="button"
            onClick={() => setOutcome('')}
            style={{ marginLeft: 8, background: 'none', border: '1px solid #ca8a04', padding: '2px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}
          >
            Override
          </button>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="outcome-select" style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Visit Outcome</label>
        <select
          id="outcome-select"
          role="listbox"
          aria-label="Visit Outcome"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          style={{ width: '100%', maxWidth: 300, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
        >
          <option value="">Select outcome…</option>
          {OUTCOMES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="staff-notes" style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>
          Staff Visit Notes <span style={{ fontWeight: 400, color: '#888' }}>(optional)</span>
        </label>
        <textarea
          id="staff-notes"
          aria-label="Staff Visit Notes (optional)"
          value={staffVisitNotes}
          onChange={(e) => setStaffVisitNotes(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
        />
      </div>

      {error && <p role="alert" style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!outcome || submitting}
          style={{
            padding: '10px 20px',
            background: !outcome || submitting ? '#e5e7eb' : '#3b82f6',
            color: !outcome || submitting ? '#9ca3af' : '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: !outcome || submitting ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {submitting ? 'Recording…' : 'Record Outcome'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/staff/appointments')}
          disabled={submitting}
          style={{ padding: '10px 20px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </StaffPage>
  );
}
