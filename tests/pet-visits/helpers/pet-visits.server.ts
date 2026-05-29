/**
 * Pet visits — server helper (Increment 6)
 */
import request, { type Response, type SuperAgentTest } from 'supertest';
import { app } from '@pawplace/app-server';
import { PetVisitsBase } from './pet-visits.base';

export class PetVisitsServerHelper extends PetVisitsBase {
  private seededPetIds: string[] = [];
  private seededSlotIds: string[] = [];
  private seededStoreCodes: string[] = [];
  private seededCustomerIds: string[] = [];
  private seededAppointmentIds: string[] = [];

  createSessionAgent(): SuperAgentTest {
    return request.agent(app);
  }

  createAuthenticatedAgent(customerAccountId: string): SuperAgentTest {
    const agent = request.agent(app);
    agent.set('X-Customer-Id', customerAccountId);
    return agent;
  }

  async seed(): Promise<void> {
    for (const store of PetVisitsBase.STORES) {
      await request(app).post('/api/test/pet-visits/stores').send(store);
      this.seededStoreCodes.push(store.storeCode);
    }

    for (const pet of PetVisitsBase.PETS) {
      await request(app).post('/api/test/pets').send(pet);
      this.seededPetIds.push(pet.petId);
    }

    for (const slot of PetVisitsBase.TIME_SLOTS) {
      await request(app).post('/api/test/time-slots').send(slot);
      this.seededSlotIds.push(slot.timeslotId);
    }

    for (const customer of PetVisitsBase.CUSTOMERS) {
      await request(app).post('/api/test/customers').send(customer);
      this.seededCustomerIds.push(customer.customerAccountId);
    }

    for (const appointment of PetVisitsBase.APPOINTMENTS) {
      await request(app).post('/api/test/appointments').send(appointment);
      this.seededAppointmentIds.push(appointment.appointmentId);
    }
  }

  async cleanup(): Promise<void> {
    if (this.seededAppointmentIds.length > 0) {
      await request(app).delete('/api/test/appointments').send({ ids: this.seededAppointmentIds });
      this.seededAppointmentIds = [];
    }
    if (this.seededSlotIds.length > 0) {
      await request(app).delete('/api/test/time-slots').send({ ids: this.seededSlotIds });
      this.seededSlotIds = [];
    }
    if (this.seededPetIds.length > 0) {
      await request(app).delete('/api/test/pets').send({ ids: this.seededPetIds });
      this.seededPetIds = [];
    }
    if (this.seededCustomerIds.length > 0) {
      await request(app).delete('/api/test/customers').send({ ids: this.seededCustomerIds });
      this.seededCustomerIds = [];
    }
    if (this.seededStoreCodes.length > 0) {
      await request(app).delete('/api/test/pet-visits/stores').send({ codes: this.seededStoreCodes });
      this.seededStoreCodes = [];
    }
  }

  // ============================================================================
  // WHEN — Pet Gallery
  // ============================================================================

  async when_browse_pet_gallery(agent: SuperAgentTest): Promise<Response> {
    return agent.get('/api/pets').expect(200);
  }

  async when_filter_pets_by_species(agent: SuperAgentTest, species: string): Promise<Response> {
    return agent.get(`/api/pets?species=${species}`).expect(200);
  }

  async when_view_pet_profile(agent: SuperAgentTest, petId: string): Promise<Response> {
    return agent.get(`/api/pets/${petId}`).expect(200);
  }

  // ============================================================================
  // WHEN — Appointment Booking
  // ============================================================================

  async when_view_available_time_slots(agent: SuperAgentTest, storeCode: string): Promise<Response> {
    return agent.get(`/api/stores/${storeCode}/time-slots?status=available`).expect(200);
  }

  async when_select_time_slot(agent: SuperAgentTest, timeslotId: string, petId: string): Promise<Response> {
    return agent.post('/api/appointments/hold').send({ timeslotId, petId });
  }

  async when_confirm_appointment(
    agent: SuperAgentTest,
    params: { petId: string; storeCode: string; timeslotId: string; visitNote?: string },
  ): Promise<Response> {
    return agent.post('/api/appointments').send(params).expect(201);
  }

  async when_cancel_appointment(agent: SuperAgentTest, appointmentId: string): Promise<Response> {
    return agent.post(`/api/appointments/${appointmentId}/cancel`).expect(200);
  }

  async when_view_customer_appointments(agent: SuperAgentTest): Promise<Response> {
    return agent.get('/api/appointments').expect(200);
  }

  async when_guest_confirms_appointment(
    agent: SuperAgentTest,
    params: { petId: string; storeCode: string; timeslotId: string },
  ): Promise<Response> {
    return agent.post('/api/appointments').send(params);
  }

  // ============================================================================
  // WHEN — Staff Workflow
  // ============================================================================

  async when_check_in_customer(
    agent: SuperAgentTest,
    appointmentId: string,
    storeCode: string,
    at: string,
  ): Promise<Response> {
    return agent.post(`/api/staff/appointments/${appointmentId}/check-in`).send({ storeCode, checkedInAt: at }).expect(200);
  }

  async when_record_visit_outcome(
    agent: SuperAgentTest,
    appointmentId: string,
    visitOutcome: string,
    staffVisitNotes?: string,
  ): Promise<Response> {
    return agent
      .post(`/api/staff/appointments/${appointmentId}/outcome`)
      .send({ visitOutcome, staffVisitNotes: staffVisitNotes ?? null })
      .expect(200);
  }

  async when_record_no_show(
    agent: SuperAgentTest,
    appointmentId: string,
    storeCode: string,
    recordedAt: string,
  ): Promise<Response> {
    return agent
      .post(`/api/staff/appointments/${appointmentId}/no-show`)
      .send({ storeCode, recordedAt })
      .expect(200);
  }

  async when_set_follow_up_action(
    agent: SuperAgentTest,
    appointmentId: string,
    followUpAction: string,
    followUpDate: string,
  ): Promise<Response> {
    return agent
      .post(`/api/staff/appointments/${appointmentId}/follow-up`)
      .send({ followUpAction, followUpDate })
      .expect(200);
  }

  async when_mark_pet_as_adopted(agent: SuperAgentTest, petId: string): Promise<Response> {
    return agent.post(`/api/staff/pets/${petId}/adopt`).expect(200);
  }

  async when_view_incoming_appointments(agent: SuperAgentTest, storeCode: string): Promise<Response> {
    return agent.get(`/api/staff/stores/${storeCode}/appointments`).expect(200);
  }

  async when_update_pet_profile(
    agent: SuperAgentTest,
    petId: string,
    updates: { breed?: string; temperamentNotes?: string; photoUrls?: string[] },
  ): Promise<Response> {
    return agent.patch(`/api/staff/pets/${petId}`).send(updates).expect(200);
  }

  // ============================================================================
  // WHEN — Notifications
  // ============================================================================

  async when_trigger_appointment_reminder(agent: SuperAgentTest, appointmentId: string): Promise<Response> {
    return agent.post(`/api/notifications/appointment-reminder`).send({ appointmentId }).expect(200);
  }

  async when_trigger_follow_up_notification(agent: SuperAgentTest, appointmentId: string): Promise<Response> {
    return agent.post(`/api/notifications/visit-follow-up`).send({ appointmentId }).expect(200);
  }

  // ============================================================================
  // THEN — assertions
  // ============================================================================

  then_pet_gallery_contains(response: Response, expectedCount: number): void {
    const { pets } = response.body;
    if (pets.length !== expectedCount) {
      throw new Error(`Expected ${expectedCount} pets, got ${pets.length}`);
    }
  }

  then_pets_filtered_by_species(response: Response, species: string): void {
    const { pets } = response.body;
    for (const pet of pets) {
      if (pet.species !== species) {
        throw new Error(`Expected species ${species}, got ${pet.species}`);
      }
    }
  }

  then_pet_card_shows(response: Response, petId: string, expected: { breed: string; species: string; storeName: string }): void {
    const { pets } = response.body;
    const pet = pets.find((p: { id: string }) => p.id === petId);
    if (!pet) throw new Error(`Pet ${petId} not found in gallery`);
    if (pet.breed !== expected.breed) throw new Error(`Expected breed ${expected.breed}, got ${pet.breed}`);
    if (pet.species !== expected.species) throw new Error(`Expected species ${expected.species}, got ${pet.species}`);
    if (pet.storeName !== expected.storeName) throw new Error(`Expected store ${expected.storeName}, got ${pet.storeName}`);
  }

  then_pet_profile_shows(response: Response, expected: {
    petName: string;
    breed: string;
    species: string;
    age: number;
    photoCount: number;
    storeName: string;
  }): void {
    const pet = response.body;
    if (pet.name !== expected.petName) throw new Error(`Expected name ${expected.petName}, got ${pet.name}`);
    if (pet.breed !== expected.breed) throw new Error(`Expected breed ${expected.breed}, got ${pet.breed}`);
    if (pet.species !== expected.species) throw new Error(`Expected species ${expected.species}, got ${pet.species}`);
    if (pet.age !== expected.age) throw new Error(`Expected age ${expected.age}, got ${pet.age}`);
    if (pet.photoUrls.length !== expected.photoCount) throw new Error(`Expected ${expected.photoCount} photos, got ${pet.photoUrls.length}`);
    if (pet.storeName !== expected.storeName) throw new Error(`Expected store ${expected.storeName}, got ${pet.storeName}`);
  }

  then_available_slots_count(response: Response, expectedCount: number): void {
    const { slots } = response.body;
    if (slots.length !== expectedCount) throw new Error(`Expected ${expectedCount} slots, got ${slots.length}`);
  }

  then_appointment_created(response: Response, expected: {
    petId: string;
    storeCode: string;
    customerId: string;
    status: string;
  }): void {
    const appointment = response.body;
    if (appointment.petId !== expected.petId) throw new Error(`Expected petId ${expected.petId}`);
    if (appointment.storeCode !== expected.storeCode) throw new Error(`Expected storeCode ${expected.storeCode}`);
    if (appointment.customerId !== expected.customerId) throw new Error(`Expected customerId ${expected.customerId}`);
    if (appointment.status !== expected.status) throw new Error(`Expected status ${expected.status}`);
  }

  then_appointment_status(response: Response, expectedStatus: string): void {
    const { status } = response.body;
    if (status !== expectedStatus) throw new Error(`Expected status ${expectedStatus}, got ${status}`);
  }

  then_check_in_recorded(response: Response, expected: { checkedInBy: string; status: string }): void {
    const appointment = response.body;
    if (appointment.status !== expected.status) throw new Error(`Expected status ${expected.status}`);
    if (appointment.checkInRecord?.checkedInBy !== expected.checkedInBy) throw new Error(`Expected checkedInBy ${expected.checkedInBy}`);
  }

  then_visit_outcome_recorded(response: Response, expected: { visitOutcome: string; status: string }): void {
    const appointment = response.body;
    if (appointment.status !== expected.status) throw new Error(`Expected status ${expected.status}`);
    if (appointment.visitOutcome !== expected.visitOutcome) throw new Error(`Expected outcome ${expected.visitOutcome}`);
  }

  then_no_show_recorded(response: Response, expected: { recordedBy: string; status: string }): void {
    const appointment = response.body;
    if (appointment.status !== expected.status) throw new Error(`Expected status ${expected.status}`);
    if (appointment.noShowRecord?.recordedBy !== expected.recordedBy) throw new Error(`Expected recordedBy ${expected.recordedBy}`);
  }

  then_follow_up_set(response: Response, expected: { followUpAction: string; followUpDate: string }): void {
    const appointment = response.body;
    if (appointment.followUpAction !== expected.followUpAction) throw new Error(`Expected action ${expected.followUpAction}`);
    if (appointment.followUpDate !== expected.followUpDate) throw new Error(`Expected date ${expected.followUpDate}`);
  }

  then_pet_adopted(response: Response): void {
    const pet = response.body;
    if (pet.status !== 'adopted') throw new Error(`Expected status adopted, got ${pet.status}`);
  }

  then_notifications_sent(response: Response, expectedCount: number): void {
    const { notificationCount } = response.body;
    if (notificationCount !== expectedCount) throw new Error(`Expected ${expectedCount} notifications, got ${notificationCount}`);
  }

  then_slot_hold_created(response: Response, holdMinutes: number): void {
    const hold = response.body;
    if (!hold.holdId) throw new Error('Expected holdId in response');
    if (!hold.expiresAt) throw new Error('Expected expiresAt in response');
  }

  then_appointments_listed(response: Response, expected: { upcomingCount: number; pastCount: number }): void {
    const { upcoming, past } = response.body;
    if (upcoming.length !== expected.upcomingCount) throw new Error(`Expected ${expected.upcomingCount} upcoming, got ${upcoming.length}`);
    if (past.length !== expected.pastCount) throw new Error(`Expected ${expected.pastCount} past, got ${past.length}`);
  }

  then_incoming_appointments_sorted(response: Response, expectedCount: number): void {
    const { appointments } = response.body;
    if (appointments.length !== expectedCount) throw new Error(`Expected ${expectedCount} appointments, got ${appointments.length}`);
  }

  then_reminder_sent(response: Response): void {
    const { sent } = response.body;
    if (!sent) throw new Error('Expected reminder to be sent');
  }

  then_reminder_skipped(response: Response, reason: string): void {
    const { skipped, reason: actualReason } = response.body;
    if (!skipped) throw new Error('Expected reminder to be skipped');
    if (actualReason !== reason) throw new Error(`Expected reason "${reason}", got "${actualReason}"`);
  }

  then_follow_up_notification_sent(response: Response): void {
    const { sent } = response.body;
    if (!sent) throw new Error('Expected follow-up notification to be sent');
  }

  then_follow_up_notification_skipped(response: Response, reason: string): void {
    const { skipped, reason: actualReason } = response.body;
    if (!skipped) throw new Error('Expected follow-up notification to be skipped');
    if (actualReason !== reason) throw new Error(`Expected reason "${reason}", got "${actualReason}"`);
  }

  then_guest_blocked(response: Response): void {
    if (response.status !== 401) throw new Error(`Expected 401, got ${response.status}`);
  }
}
