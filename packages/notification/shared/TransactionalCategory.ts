/** Transactional notification category — distinct from marketing communication preferences. */
export const TRANSACTIONAL_CATEGORIES = [
  'order_updates',
  'shipping',
  'appointments',
  'returns',
] as const;

export type TransactionalCategory = (typeof TRANSACTIONAL_CATEGORIES)[number];

export const TRANSACTIONAL_CATEGORY_LABELS: Record<TransactionalCategory, string> = {
  order_updates: 'Order Updates',
  shipping: 'Shipping Notifications',
  appointments: 'Appointment Reminders',
  returns: 'Return Updates',
};

/** Non-suppressible transactional notifications (always sent). */
export const MANDATORY_TRANSACTIONAL_TYPES = [
  'order_confirmation',
  'refund_completion',
] as const;

export type MandatoryTransactionalType = (typeof MANDATORY_TRANSACTIONAL_TYPES)[number];

export function isTransactionalCategory(value: string): value is TransactionalCategory {
  return (TRANSACTIONAL_CATEGORIES as readonly string[]).includes(value);
}
