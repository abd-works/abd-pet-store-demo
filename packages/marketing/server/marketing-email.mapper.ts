import type { MarketingEmailMessage } from '../../notification/shared/MarketingEmailMessage';

export function toMarketingPayload(message: {
  referenceId: string;
  type: string;
  recipientEmail: string;
  subject: string;
  html: string;
}): MarketingEmailMessage {
  return {
    referenceId: message.referenceId,
    type: message.type,
    to: message.recipientEmail,
    subject: message.subject,
    html: message.html,
  };
}
