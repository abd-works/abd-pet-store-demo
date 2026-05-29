import type { Request, Response, NextFunction } from 'express';
import {
  createHoldSchema,
  confirmBookingSchema,
  checkInSchema,
  recordOutcomeSchema,
  recordNoShowSchema,
  setFollowUpSchema,
} from './appointment.schema';
import type { AppointmentService, PetServiceRef } from './appointment.service';
import { toAppointmentId } from '../shared/AppointmentId';
import { toPetId } from '../../pet/shared/PetId';
import {
  SlotNoLongerAvailableError,
  SlotHoldExpiredError,
  AppointmentNotFoundError,
  AppointmentAlreadyCheckedInError,
  AppointmentCancelledError,
  AlreadyCheckedInError,
} from '../shared/AppointmentErrors';
import { requireSessionId } from '../../shared/express-session-id';

export interface CustomerSessionService {
  requireVerifiedPrincipal(sessionId: string): Promise<{ accountId: string }>;
}

export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly petService: PetServiceRef,
    private readonly sessionService: CustomerSessionService,
  ) {
    this.createSlotHold = this.createSlotHold.bind(this);
    this.releaseSlotHold = this.releaseSlotHold.bind(this);
    this.confirmBooking = this.confirmBooking.bind(this);
    this.cancelAppointment = this.cancelAppointment.bind(this);
    this.listAccountAppointments = this.listAccountAppointments.bind(this);
    this.getAppointment = this.getAppointment.bind(this);
    this.listStaffAppointments = this.listStaffAppointments.bind(this);
    this.checkIn = this.checkIn.bind(this);
    this.recordOutcome = this.recordOutcome.bind(this);
    this.recordNoShow = this.recordNoShow.bind(this);
    this.setFollowUp = this.setFollowUp.bind(this);
  }

  async createSlotHold(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const petId = toPetId(req.params.petId);
      const { timeSlotId } = createHoldSchema.parse(req.body);
      const sessionId = requireSessionId(req);
      const { accountId } = await this.sessionService.requireVerifiedPrincipal(sessionId);
      const dto = await this.appointmentService.createHold(petId, timeSlotId, accountId);
      res.status(201).json(dto);
    } catch (err) {
      if (err instanceof SlotNoLongerAvailableError) {
        res.status(409).json({ error: 'Time slot is no longer available' }); return;
      }
      next(err);
    }
  }

  async releaseSlotHold(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.appointmentService.releaseHold(req.params.holdId);
      res.status(204).send();
    } catch (err) { next(err); }
  }

  async confirmBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { holdId, visitNote } = confirmBookingSchema.parse(req.body);
      const sessionId = requireSessionId(req);
      const { accountId } = await this.sessionService.requireVerifiedPrincipal(sessionId);
      const appointment = await this.appointmentService.confirmBooking(holdId, accountId, visitNote);
      res.status(201).json({ appointmentId: appointment.id });
    } catch (err) {
      if (err instanceof SlotHoldExpiredError) {
        res.status(409).json({ error: 'Slot hold expired — please re-select a time slot' }); return;
      }
      if (err instanceof SlotNoLongerAvailableError) {
        res.status(409).json({ error: 'Time slot is no longer available' }); return;
      }
      next(err);
    }
  }

  async cancelAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointmentId = toAppointmentId(req.params.appointmentId);
      const sessionId = requireSessionId(req);
      const { accountId } = await this.sessionService.requireVerifiedPrincipal(sessionId);
      await this.appointmentService.cancelAppointment(appointmentId, accountId);
      res.status(204).send();
    } catch (err) {
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' }); return;
      }
      next(err);
    }
  }

  async listAccountAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = requireSessionId(req);
      const { accountId } = await this.sessionService.requireVerifiedPrincipal(sessionId);
      const appointments = await this.appointmentService.listForAccount(accountId);
      res.json(appointments.map((a) => ({ id: a.id, petId: a.petId, status: a.status, startAt: a.timeSlot.startAt })));
    } catch (err) { next(err); }
  }

  async getAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointmentId = toAppointmentId(req.params.appointmentId);
      const appointment = await this.appointmentService.getById(appointmentId);
      res.json({ id: appointment.id, petId: appointment.petId, status: appointment.status });
    } catch (err) {
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' }); return;
      }
      next(err);
    }
  }

  async listStaffAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeCode = req.query['storeCode'] as string;
      const appointments = await this.appointmentService.listIncoming(storeCode);
      res.json(appointments.map((a) => ({
        id: a.id,
        petId: a.petId,
        customerId: a.customerId,
        status: a.status,
        startAt: a.timeSlot.startAt,
        notificationStatus: a.notificationStatus,
      })));
    } catch (err) { next(err); }
  }

  async checkIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { staffId } = checkInSchema.parse(req.body);
      const appointment = await this.appointmentService.checkIn(req.params.appointmentId, staffId);
      res.json({ status: appointment.status, checkedInAt: appointment.checkInRecord?.checkedInAt });
    } catch (err) {
      if (err instanceof AppointmentAlreadyCheckedInError) {
        res.status(409).json({ status: 'checked_in', checkedInAt: err.originalCheckedInAt }); return;
      }
      if (err instanceof AppointmentCancelledError) {
        res.status(422).json({ error: 'Appointment is cancelled' }); return;
      }
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' }); return;
      }
      next(err);
    }
  }

  async recordOutcome(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { outcome, staffVisitNotes } = recordOutcomeSchema.parse(req.body);
      const appointment = await this.appointmentService.recordOutcome(
        req.params.appointmentId,
        outcome,
        staffVisitNotes,
        this.petService,
      );
      res.json({ status: appointment.status, outcome: appointment.visitOutcome });
    } catch (err) {
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' }); return;
      }
      next(err);
    }
  }

  async recordNoShow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { staffId } = recordNoShowSchema.parse(req.body);
      const appointment = await this.appointmentService.recordNoShow(req.params.appointmentId, staffId);
      res.json({ status: appointment.status });
    } catch (err) {
      if (err instanceof AlreadyCheckedInError) {
        res.status(422).json({ error: 'Cannot record no-show: appointment is already checked in' }); return;
      }
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' }); return;
      }
      next(err);
    }
  }

  async setFollowUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { action, followUpDate } = setFollowUpSchema.parse(req.body);
      const appointment = await this.appointmentService.setFollowUp(
        req.params.appointmentId,
        action,
        followUpDate,
      );
      res.json({ status: appointment.status, followUpAction: appointment.followUpAction });
    } catch (err) {
      if (err instanceof AppointmentNotFoundError) {
        res.status(404).json({ error: 'Appointment not found' }); return;
      }
      next(err);
    }
  }
}
