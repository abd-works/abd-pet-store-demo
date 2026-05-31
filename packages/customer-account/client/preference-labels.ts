export {
  MARKETING_CATEGORY_DESCRIPTIONS,
  MARKETING_CATEGORY_LABELS,
} from '@pawplace/customer-account-shared';

export const NOTIFICATION_CATEGORY_LABELS: Record<string, string> = {
  order_updates: 'Order Updates',
  shipping: 'Shipping Notifications',
  appointments: 'Appointment Reminders',
  returns: 'Return Updates',
};

export const TRANSACTIONAL_NOTE =
  'Transactional notifications not affected by these settings';

export const CRITICAL_NOTIFICATIONS_NOTE =
  'Some notifications cannot be disabled (e.g. order confirmation, refund completion)';

export const PROMOTIONAL_EMAIL_OPT_IN_LABEL =
  'Send me promotional emails about sales, new products, and seasonal offers';
