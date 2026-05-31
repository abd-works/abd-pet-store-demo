/**
 * Notification & communication preferences — shared test data (Increment 8 Sprint 2)
 */
import { ReturningCustomersBase } from '../../../returning-customers/helpers/returning-customers.base';

/** Tom Nguyen — primary customer from specification-by-example backgrounds. */
export const TOM = {
  ...ReturningCustomersBase.JANE,
  email: 'tom.nguyen@pawplace.example',
  displayName: 'Tom Nguyen',
} as const;

export const OPT_IN_TIMESTAMP = '2026-05-30T14:22:00Z';
