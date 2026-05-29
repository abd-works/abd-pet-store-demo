import { Router, type Request, type Response } from 'express';
import { Pet, type PetSnapshot } from '../../pet/shared/Pet';
import { toPetId } from '../../pet/shared/PetId';
import { PetNotFoundError, PetAlreadyAdoptedError } from '../../pet/shared/PetErrors';
import { PetService, type CustomerLocation } from '../../pet/server/pet.service';
import { AppointmentService, type PetServiceRef } from '../../appointment/server/appointment.service';
import { Appointment } from '../../appointment/shared/Appointment';
import { AppointmentStatus } from '../../appointment/shared/AppointmentStatus';
import { TimeSlot } from '../../appointment/shared/TimeSlot';
import { SlotHold } from '../../appointment/shared/SlotHold';
import { toAppointmentId } from '../../appointment/shared/AppointmentId';
import { toVisitNote } from '../../appointment/shared/VisitNote';
import { toStaffVisitNotes } from '../../appointment/shared/StaffVisitNotes';
import { FollowUpDate } from '../../appointment/shared/FollowUpDate';
import {
  SlotNoLongerAvailableError,
  AppointmentNotFoundError,
  AppointmentAlreadyCheckedInError,
  AppointmentCancelledError,
  AlreadyCheckedInError,
} from '../../appointment/shared/AppointmentErrors';
import type { VisitOutcome } from '../../appointment/shared/VisitOutcome';
import type { FollowUpAction } from '../../appointment/shared/FollowUpAction';
import {
  InMemoryPetRepo,
  InMemoryAppointmentRepo,
  InMemorySlotHoldRepo,
} from './pet-visits.repository';
import { InMemoryStoreRegistry } from './pet-visits.stores';
import { InMemoryCustomerRegistry } from './pet-visits.customers';
import { InMemoryTimeSlotRegistry } from './pet-visits.time-slots';

const petRepo = new InMemoryPetRepo();
const appointmentRepo = new InMemoryAppointmentRepo();
const holdRepo = new InMemorySlotHoldRepo();
const storeRegistry = new InMemoryStoreRegistry();
const customerRegistry = new InMemoryCustomerRegistry();
const timeSlotRegistry = new InMemoryTimeSlotRegistry();

const bookedSlots = new Set<string>();

const notificationService = {
  async sendConfirmationEmail(_appointment: Appointment): Promise<void> {},
  async notifyPendingAppointmentsOfAdoption(petId: string): Promise<number> {
    const pending = await appointmentRepo.findConfirmedByPet(petId as any);
    for (const appt of pending) {
      appt.notificationStatus = 'notified';
      await appointmentRepo.save(appt);
    }
    return pending.length;
  },
};

const petService = new PetService(
  petRepo,
  { distanceFromCustomer: async () => 0 },
  notificationService as any,
  (storeCode: string) => storeRegistry.resolveStoreName(storeCode),
);

const appointmentService = new AppointmentService(
  appointmentRepo,
  holdRepo,
  notificationService as any,
  10,
);

function getCustomerId(req: Request): string | null {
  return (req.headers['x-customer-id'] as string) ?? null;
}

function requireCustomerId(req: Request, res: Response): string | null {
  const id = getCustomerId(req);
  if (!id) {
    res.status(401).json({ error: 'Authentication required' });
    return null;
  }
  return id;
}

export function createPetVisitsRouter(): Router {
  const router = Router();

  // ======================================================================
  // PET GALLERY
  // ======================================================================

  router.get('/api/pets', async (req: Request, res: Response) => {
    try {
      const species = req.query.species as string | undefined;
      const pets = await petService.listBySpecies(species as any);
      res.json({ pets });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/api/pets/:petId', async (req: Request, res: Response) => {
    try {
      const petId = toPetId(req.params.petId);
      const profile = await petService.getProfile(petId);
      const storeAddress = storeRegistry.resolveStoreAddress(
        (await petRepo.findById(petId))?.storeCode ?? '',
      );
      res.json({ ...profile, storeAddress });
    } catch (err) {
      if (err instanceof PetNotFoundError) {
        res.status(404).json({ error: 'Pet not found' });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ======================================================================
  // TIME SLOTS
  // ======================================================================

  router.get('/api/stores/:storeCode/time-slots', async (req: Request, res: Response) => {
    try {
      const { storeCode } = req.params;
      const availableSlots = timeSlotRegistry.findAvailableByStore(storeCode);
      res.json({ slots: availableSlots });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ======================================================================
  // APPOINTMENT BOOKING
  // ======================================================================

  router.post('/api/appointments/hold', async (req: Request, res: Response) => {
    try {
      const customerId = requireCustomerId(req, res);
      if (!customerId) return;
      const { timeslotId, petId } = req.body;

      if (bookedSlots.has(timeslotId)) {
        res.status(409).json({ error: 'Time slot is no longer available' });
        return;
      }

      const existingHold = await holdRepo.findActiveHold(timeslotId);
      if (existingHold && existingHold.customerId !== customerId) {
        res.status(409).json({ error: 'Time slot is no longer available' });
        return;
      }

      if (!existingHold) {
        const hold = SlotHold.create({
          petId: toPetId(petId),
          timeSlotId: timeslotId,
          customerId,
          holdMinutes: 10,
        });
        await holdRepo.insert(hold);
        res.status(201).json(hold.toDto());
      } else {
        res.status(201).json(existingHold.toDto());
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/api/appointments', async (req: Request, res: Response) => {
    try {
      const customerId = requireCustomerId(req, res);
      if (!customerId) return;
      const { petId, storeCode, timeslotId, visitNote } = req.body;

      const slotRecord = timeSlotRegistry.get(timeslotId);
      const timeSlotData = slotRecord
        ? {
            timeSlotId: slotRecord.timeslotId,
            storeCode: slotRecord.storeCode,
            startAt: new Date(slotRecord.startTime),
            endAt: new Date(slotRecord.endTime),
          }
        : { timeSlotId: timeslotId, storeCode, startAt: new Date(), endAt: new Date(Date.now() + 30 * 60_000) };

      const activeHold = await holdRepo.findActiveHold(timeslotId);
      if (activeHold && activeHold.customerId === customerId) {
        await holdRepo.delete(activeHold.holdId);
      }

      const timeSlot = new TimeSlot(timeSlotData);
      const visitNoteVal = visitNote ? toVisitNote(visitNote) : undefined;
      const appointment = Appointment.create({
        petId: toPetId(petId),
        storeCode,
        customerId,
        timeSlot,
        visitNote: visitNoteVal,
      });
      await appointmentRepo.save(appointment);
      bookedSlots.add(timeslotId);

      res.status(201).json({
        appointmentId: appointment.id,
        petId: appointment.petId,
        storeCode: appointment.storeCode,
        customerId: appointment.customerId,
        status: appointment.status,
        visitNote: appointment.visitNote,
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/api/appointments/:appointmentId/cancel', async (req: Request, res: Response) => {
    try {
      const customerId = requireCustomerId(req, res);
      if (!customerId) return;
      const appointmentId = toAppointmentId(req.params.appointmentId);
      await appointmentService.cancelAppointment(appointmentId, customerId);
      res.json({ status: 'cancelled' });
    } catch (err) {
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/api/appointments', async (req: Request, res: Response) => {
    try {
      const customerId = requireCustomerId(req, res);
      if (!customerId) return;
      const appointments = await appointmentService.listForAccount(customerId);
      const upcoming = appointments.filter(
        (a) => a.status === AppointmentStatus.Confirmed,
      );
      const past = appointments.filter(
        (a) => a.status !== AppointmentStatus.Confirmed,
      );
      res.json({ upcoming, past });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ======================================================================
  // STAFF WORKFLOW
  // ======================================================================

  router.post('/api/staff/appointments/:appointmentId/check-in', async (req: Request, res: Response) => {
    try {
      const { storeCode, checkedInAt } = req.body;
      const appointment = await appointmentService.checkIn(
        req.params.appointmentId,
        storeCode,
      );
      const record = appointment.checkInRecord!;
      const actualTime = checkedInAt ?? record.checkedInAt.toISOString();
      if (checkedInAt) {
        Object.assign(record, { checkedInAt: new Date(checkedInAt) });
      }
      res.json({
        status: appointment.status,
        checkInRecord: {
          checkedInBy: record.checkedInBy,
          checkedInAt: checkedInAt ?? record.checkedInAt.toISOString(),
        },
      });
    } catch (err) {
      if (err instanceof AppointmentAlreadyCheckedInError) {
        res.status(409).json({ message: `Already checked in at ${err.originalCheckedInAt?.toISOString()}` });
        return;
      }
      if (err instanceof AppointmentCancelledError) {
        res.status(422).json({ message: 'Appointment is cancelled' });
        return;
      }
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/api/staff/appointments/:appointmentId/outcome', async (req: Request, res: Response) => {
    try {
      const { visitOutcome, staffVisitNotes } = req.body;
      const petServiceRef: PetServiceRef = {
        markAdopted: async (petId) => petService.markAdopted(petId),
      };
      const appointment = await appointmentService.recordOutcome(
        req.params.appointmentId,
        visitOutcome as VisitOutcome,
        staffVisitNotes ?? undefined,
        petServiceRef,
      );
      const followUpPrompt = visitOutcome === 'interested_returning';
      res.json({
        status: appointment.status,
        visitOutcome: appointment.visitOutcome,
        staffVisitNotes: appointment.staffVisitNotes,
        followUpPrompt,
      });
    } catch (err) {
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/api/staff/appointments/:appointmentId/no-show', async (req: Request, res: Response) => {
    try {
      const { storeCode, recordedAt } = req.body;
      const appointment = await appointmentService.recordNoShow(
        req.params.appointmentId,
        storeCode,
      );
      const record = appointment.noShowRecord!;
      if (recordedAt) {
        Object.assign(record, { recordedAt: new Date(recordedAt) });
      }
      res.json({
        status: appointment.status,
        noShowRecord: {
          recordedBy: record.recordedBy,
          recordedAt: recordedAt ?? record.recordedAt.toISOString(),
        },
      });
    } catch (err) {
      if (err instanceof AlreadyCheckedInError) {
        res.status(422).json({ message: 'Cannot record no-show: appointment is already checked in' });
        return;
      }
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/api/staff/appointments/:appointmentId/follow-up', async (req: Request, res: Response) => {
    try {
      const { followUpAction, followUpDate } = req.body;
      const appointment = await appointmentService.setFollowUp(
        req.params.appointmentId,
        followUpAction as FollowUpAction,
        followUpDate ? new Date(followUpDate) : undefined,
      );
      res.json({
        status: appointment.status,
        followUpAction: appointment.followUpAction,
        followUpDate: followUpDate ?? null,
      });
    } catch (err) {
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/api/staff/pets/:petId/adopt', async (req: Request, res: Response) => {
    try {
      const petId = toPetId(req.params.petId);
      const notificationCount = await notificationService.notifyPendingAppointmentsOfAdoption(petId);
      await petService.markAdopted(petId);
      const pet = await petRepo.findById(petId);
      res.json({
        status: 'adopted',
        petId: req.params.petId,
        notificationCount,
      });
    } catch (err) {
      if (err instanceof PetAlreadyAdoptedError) {
        res.status(409).json({ message: 'Pet is already adopted' });
        return;
      }
      if (err instanceof PetNotFoundError) {
        res.status(404).json({ error: 'Pet not found' });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/api/staff/stores/:storeCode/appointments', async (req: Request, res: Response) => {
    try {
      const { storeCode } = req.params;
      const allByStore = await appointmentRepo.findAllByStore(storeCode);
      const enriched = allByStore.map((a) => ({
        id: a.id,
        petId: a.petId,
        petName: '',
        customerId: a.customerId,
        status: a.status,
        startAt: a.timeSlot.startAt.toISOString(),
        notificationStatus: a.notificationStatus,
      }));
      for (const item of enriched) {
        const pet = await petRepo.findById(toPetId(item.petId));
        (item as any).petName = pet?.name ?? 'Unknown';
      }
      enriched.sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      );
      res.json({ appointments: enriched });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/api/staff/pets/:petId', async (req: Request, res: Response) => {
    try {
      const petId = toPetId(req.params.petId);
      const { breed, temperamentNotes, photoUrls } = req.body;
      const pet = await petRepo.findById(petId);
      if (!pet) {
        res.status(404).json({ error: 'Pet not found' });
        return;
      }

      if (temperamentNotes !== undefined) {
        Object.assign(pet, { temperamentNotes });
      }
      if (photoUrls !== undefined) {
        const currentUrls = [...pet.photoUrls];
        for (const url of photoUrls) {
          if (!currentUrls.includes(url)) {
            pet.addPhoto(url);
          }
        }
        for (const existing of currentUrls) {
          if (!photoUrls.includes(existing)) {
            pet.removePhoto(existing);
          }
        }
      }

      await petRepo.save(pet);
      const storeName = storeRegistry.resolveStoreName(pet.storeCode);
      res.json({
        id: pet.id,
        name: pet.name,
        breed: pet.breed,
        species: pet.species,
        age: pet.age,
        temperamentNotes: pet.temperamentNotes,
        photoUrls: [...pet.photoUrls],
        status: pet.status,
        storeName,
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ======================================================================
  // NOTIFICATIONS
  // ======================================================================

  router.post('/api/notifications/appointment-reminder', async (req: Request, res: Response) => {
    try {
      const { appointmentId } = req.body;
      const appointment = await appointmentRepo.findById(toAppointmentId(appointmentId));
      if (!appointment) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
      if (appointment.status === AppointmentStatus.Cancelled) {
        res.json({ sent: false, skipped: true, reason: 'appointment cancelled' });
        return;
      }
      const pet = await petRepo.findById(toPetId(appointment.petId));
      if (pet && pet.status === 'adopted') {
        res.json({ sent: false, skipped: true, reason: 'adoption takes precedence' });
        return;
      }
      appointment.reminderSent = true;
      await appointmentRepo.save(appointment);
      res.json({ sent: true });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/api/notifications/visit-follow-up', async (req: Request, res: Response) => {
    try {
      const { appointmentId } = req.body;
      const appointment = await appointmentRepo.findById(toAppointmentId(appointmentId));
      if (!appointment) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
      if (appointment.followUpAction === 'none') {
        res.json({ sent: false, skipped: true, reason: 'follow-up action is none' });
        return;
      }
      const pet = await petRepo.findById(toPetId(appointment.petId));
      if (pet && pet.status === 'adopted') {
        res.json({ sent: false, skipped: true, reason: 'pet adopted before follow-up' });
        return;
      }
      res.json({ sent: true });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}

// ======================================================================
// TEST SEEDING ROUTES
// ======================================================================

export function createPetVisitsTestRouter(): Router {
  const router = Router();

  router.post('/api/test/pet-visits/stores', (req: Request, res: Response) => {
    storeRegistry.add(req.body);
    res.status(201).json({ ok: true });
  });

  router.delete('/api/test/pet-visits/stores', (req: Request, res: Response) => {
    const { codes } = req.body;
    if (codes) storeRegistry.deleteMany(codes);
    else storeRegistry.clear();
    res.json({ ok: true });
  });

  router.post('/api/test/pets', (req: Request, res: Response) => {
    const data = req.body;
    const snapshot: PetSnapshot = {
      id: data.petId,
      name: data.petName,
      species: data.species,
      breed: data.breed,
      age: data.age,
      temperamentNotes: data.temperamentNotes ?? null,
      photoUrls: data.photoUrls ?? [],
      status: data.lifecycleState ?? 'available',
      storeCode: data.hostingStore,
    };
    petRepo.seed(snapshot);
    res.status(201).json({ ok: true });
  });

  router.delete('/api/test/pets', (req: Request, res: Response) => {
    const { ids } = req.body;
    if (ids) petRepo.deleteMany(ids);
    else petRepo.clear();
    res.json({ ok: true });
  });

  router.post('/api/test/time-slots', (req: Request, res: Response) => {
    timeSlotRegistry.add(req.body);
    res.status(201).json({ ok: true });
  });

  router.delete('/api/test/time-slots', (req: Request, res: Response) => {
    const { ids } = req.body;
    if (ids) timeSlotRegistry.deleteMany(ids);
    else timeSlotRegistry.clear();
    res.json({ ok: true });
  });

  router.post('/api/test/customers', (req: Request, res: Response) => {
    customerRegistry.add(req.body);
    res.status(201).json({ ok: true });
  });

  router.delete('/api/test/customers', (req: Request, res: Response) => {
    const { ids } = req.body;
    if (ids) customerRegistry.deleteMany(ids);
    else customerRegistry.clear();
    res.json({ ok: true });
  });

  router.post('/api/test/appointments', (req: Request, res: Response) => {
    const data = req.body;
    const slotRecord = timeSlotRegistry.get(data.timeslotId);
    const startAt = slotRecord ? new Date(slotRecord.startTime) : new Date('2025-06-10T10:00:00');
    const endAt = slotRecord ? new Date(slotRecord.endTime) : new Date('2025-06-10T10:30:00');
    const storeCode = data.storeCode ?? slotRecord?.storeCode ?? 'STR-001';

    const appointment = new Appointment({
      id: toAppointmentId(data.appointmentId),
      petId: toPetId(data.petId),
      storeCode,
      customerId: data.customerAccountId,
      timeSlot: new TimeSlot({
        timeSlotId: data.timeslotId,
        storeCode,
        startAt,
        endAt,
      }),
      visitNote: data.visitNote ? toVisitNote(data.visitNote) : null,
      status: data.appointmentStatus ?? AppointmentStatus.Confirmed,
      visitOutcome: data.visitOutcome ?? null,
      staffVisitNotes: data.staffVisitNotes ? toStaffVisitNotes(data.staffVisitNotes) : null,
      followUpAction: data.followUpAction ?? null,
      followUpDate: data.followUpDate ? new FollowUpDate(new Date(data.followUpDate)) : null,
      notificationStatus: data.notificationStatus ?? null,
    });
    appointmentRepo.seed(appointment);
    res.status(201).json({ ok: true });
  });

  router.delete('/api/test/appointments', (req: Request, res: Response) => {
    appointmentRepo.clear();
    holdRepo.clear();
    bookedSlots.clear();
    res.json({ ok: true });
  });

  return router;
}
