/**
 * Send Appointment Reminder — server acceptance tests (Increment 6)
 *
 * Stories: Send Appointment Reminder
 * Scenarios: reminder sent 24h before, cancelled skipped, adopted precedence
 */
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { PetVisitsServerHelper } from '../helpers/pet-visits.server';

describe('Send Appointment Reminder', () => {
  const helper = new PetVisitsServerHelper();

  beforeEach(async () => { await helper.seed(); });
  afterEach(async () => { await helper.cleanup(); });

  it('reminder sent 24 hours before appointment', async () => {
    // Given: Appointment APT-001 for Pet PET-001 at Store STR-001
    //   And: appointmentStatus is confirmed
    const agent = helper.createSessionAgent();

    // When: current time is 24 hours before appointment
    const response = await helper.when_trigger_appointment_reminder(agent, 'APT-001');

    // Then: system sends an Appointment Reminder Notification
    helper.then_reminder_sent(response);
  });

  it('cancelled appointment — reminder skipped', async () => {
    // Given: Appointment with appointmentStatus cancelled
    const cancelAgent = helper.createAuthenticatedAgent('CUST-001');
    await helper.when_cancel_appointment(cancelAgent, 'APT-001');

    const agent = helper.createSessionAgent();

    // When: the 24-hour reminder trigger time arrives
    const response = await helper.when_trigger_appointment_reminder(agent, 'APT-001');

    // Then: reminder is skipped
    helper.then_reminder_skipped(response, 'appointment cancelled');
  });

  it('adopted pet — adoption notification takes precedence over reminder', async () => {
    // Given: Appointment APT-003 for Pet PET-005 with lifecycleState Adopted
    //   And: Pet Adopted Before Visit Notification has not yet sent
    const agent = helper.createSessionAgent();

    // When: the 24-hour reminder trigger time arrives
    const response = await helper.when_trigger_appointment_reminder(agent, 'APT-003');

    // Then: reminder outcome is skipped — adoption takes precedence
    helper.then_reminder_skipped(response, 'adoption takes precedence');
  });
});
