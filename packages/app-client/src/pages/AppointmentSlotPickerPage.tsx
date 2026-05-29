import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomerPage } from '../components/CustomerPage';
import { AppointmentCalendar } from '../../../../appointment/client/AppointmentCalendar';
import { fetchAvailableSlots, createHold, releaseHold } from '../../../../appointment/client/appointment.api';
import { fetchPet } from '../../../../pet/client/pet.api';
import type { TimeSlotDto, SlotHoldResponseDto } from '../../../../appointment/client/appointment.api';
import type { PetDto } from '../../../../pet/client/pet.api';

const HOLD_MINUTES = 10;

export function AppointmentSlotPickerPage() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<PetDto | null>(null);
  const [slots, setSlots] = useState<TimeSlotDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotDto | null>(null);
  const [hold, setHold] = useState<SlotHoldResponseDto | null>(null);
  const [holdExpired, setHoldExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!petId) return;
    Promise.all([fetchPet(petId), fetchAvailableSlots(petId)])
      .then(([p, s]) => { setPet(p); setSlots(s); })
      .catch(() => setError('Failed to load booking data'))
      .finally(() => setLoading(false));
    return () => { if (holdTimerRef.current) clearTimeout(holdTimerRef.current); };
  }, [petId]);

  const handleSelectSlot = useCallback(async (slot: TimeSlotDto) => {
    if (!petId) return;
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (hold) await releaseHold(hold.holdId).catch(() => {});
    setHoldExpired(false);
    setError(null);
    try {
      const newHold = await createHold(petId, slot.timeSlotId);
      setSelectedSlot(slot);
      setHold(newHold);
      const expiresIn = new Date(newHold.expiresAt).getTime() - Date.now();
      holdTimerRef.current = setTimeout(() => {
        setHoldExpired(true);
        setSelectedSlot(null);
        setHold(null);
      }, expiresIn);
    } catch {
      setError('Slot no longer available — please select another');
    }
  }, [petId, hold]);

  const handleContinue = () => {
    if (!petId || !hold || !selectedSlot) return;
    navigate(`/pets/${petId}/book/confirm`, {
      state: { holdId: hold.holdId, slot: selectedSlot, petName: pet?.name, storeName: pet?.storeName },
    });
  };

  if (loading) return <CustomerPage title="select time slot"><p>Loading…</p></CustomerPage>;
  if (error && !pet) return <CustomerPage title="select time slot"><p role="alert">{error}</p></CustomerPage>;

  return (
    <CustomerPage title="select time slot">
      <nav aria-label="breadcrumb" style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        <a href={`/pets/${petId}`} style={{ color: '#3b82f6' }}>← Back to {pet?.name}</a>
      </nav>

      {pet && (
        <section aria-label="appointment context" style={{ marginBottom: 20, padding: '12px 16px', background: '#f9fafb', borderRadius: 8 }}>
          <p><strong aria-label="pet name">pet:</strong> {pet.name}</p>
          <p><strong aria-label="store name">store:</strong> {pet.storeName}</p>
          <p><strong aria-label="store address">address:</strong> {pet.storeAddress}</p>
        </section>
      )}

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>available time slots — next 14 days</h2>

      {error && (
        <p role="alert" style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>
      )}

      <AppointmentCalendar
        slots={slots}
        selectedSlotId={selectedSlot?.timeSlotId ?? null}
        holdExpired={holdExpired}
        onSelect={handleSelectSlot}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedSlot || holdExpired}
          style={{
            padding: '10px 20px',
            background: !selectedSlot || holdExpired ? '#e5e7eb' : '#3b82f6',
            color: !selectedSlot || holdExpired ? '#9ca3af' : '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: !selectedSlot || holdExpired ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          Continue
        </button>
        <button
          type="button"
          onClick={() => navigate(`/pets/${petId}`)}
          style={{ padding: '10px 20px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer' }}
        >
          Back to pet profile
        </button>
      </div>
    </CustomerPage>
  );
}
