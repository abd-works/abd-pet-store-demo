import type {
  CommunicationPreferencesDto,
  ToggleCommunicationPreferenceInput,
} from '@pawplace/customer-account-shared';
import { httpJson } from '../../shared/http-client';

export async function fetchCommunicationPreferences(): Promise<CommunicationPreferencesDto> {
  return httpJson<CommunicationPreferencesDto>('/api/account/communication-preferences');
}

export async function toggleCommunicationPreference(
  input: ToggleCommunicationPreferenceInput,
): Promise<CommunicationPreferencesDto> {
  return httpJson<CommunicationPreferencesDto>('/api/account/communication-preferences', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export interface NotificationPreferencesDto {
  accountId: string;
  categories: Array<{ category: string; enabled: boolean }>;
  criticalNote: string;
}

export async function fetchNotificationPreferences(): Promise<NotificationPreferencesDto> {
  return httpJson<NotificationPreferencesDto>('/api/account/notification-preferences');
}

export async function toggleNotificationPreference(input: {
  category: string;
  enabled: boolean;
}): Promise<NotificationPreferencesDto> {
  return httpJson<NotificationPreferencesDto>('/api/account/notification-preferences', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
