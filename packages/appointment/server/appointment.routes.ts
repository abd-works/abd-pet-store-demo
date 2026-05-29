import { Router } from 'express';
import type { AppointmentController } from './appointment.controller';

export function createAppointmentRouter(controller: AppointmentController): Router {
  const router = Router();

  // Customer booking flow (pet-scoped)
  router.post('/api/pets/:petId/slot-holds', controller.createSlotHold);
  router.delete('/api/pets/:petId/slot-holds/:holdId', controller.releaseSlotHold);
  router.post('/api/appointments', controller.confirmBooking);
  router.delete('/api/appointments/:appointmentId', controller.cancelAppointment);

  // Customer account appointment list
  router.get('/api/account/appointments', controller.listAccountAppointments);
  router.get('/api/account/appointments/:appointmentId', controller.getAppointment);

  // Staff workflow
  router.get('/api/staff/appointments', controller.listStaffAppointments);
  router.patch('/api/appointments/:appointmentId/check-in', controller.checkIn);
  router.patch('/api/appointments/:appointmentId/outcome', controller.recordOutcome);
  router.patch('/api/appointments/:appointmentId/no-show', controller.recordNoShow);
  router.patch('/api/appointments/:appointmentId/follow-up', controller.setFollowUp);

  return router;
}
