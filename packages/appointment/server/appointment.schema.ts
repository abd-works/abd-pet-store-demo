import { z } from 'zod';

export const slotQuerySchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export const createHoldSchema = z.object({
  timeSlotId: z.string().min(1),
});

export const confirmBookingSchema = z.object({
  holdId: z.string().min(1),
  visitNote: z.string().max(500).optional(),
});

export const checkInSchema = z.object({
  staffId: z.string().min(1),
});

export const recordOutcomeSchema = z.object({
  outcome: z.enum(['adopted', 'interested_returning', 'not_a_fit', 'browsing_only']),
  staffVisitNotes: z.string().max(2000).optional(),
});

export const recordNoShowSchema = z.object({
  staffId: z.string().min(1),
});

export const setFollowUpSchema = z.object({
  action: z.enum(['none', 'schedule_return_visit', 'hold_pet', 'send_adoption_paperwork']),
  followUpDate: z.coerce.date().optional(),
});

export type SlotQuery = z.infer<typeof slotQuerySchema>;
export type CreateHold = z.infer<typeof createHoldSchema>;
export type ConfirmBooking = z.infer<typeof confirmBookingSchema>;
export type CheckIn = z.infer<typeof checkInSchema>;
export type RecordOutcome = z.infer<typeof recordOutcomeSchema>;
export type SetFollowUp = z.infer<typeof setFollowUpSchema>;
