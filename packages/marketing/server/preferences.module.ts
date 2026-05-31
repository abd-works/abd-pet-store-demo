import type { SessionService } from '../../customer-account/server/session.service';
import { CommunicationPreferencesController } from '../../customer-account/server/communication-preferences.controller';
import { createCommunicationPreferencesRouter } from '../../customer-account/server/communication-preferences.routes';
import {
  InMemoryCommunicationPreferencesRepository,
  type CommunicationPreferencesRepository,
} from '../../customer-account/server/communication-preferences.repository';
import { CommunicationPreferencesService } from '../../customer-account/server/communication-preferences.service';
import { NotificationPreferencesController } from '../../customer-account/server/notification-preferences.controller';
import { createNotificationPreferencesRouter } from '../../customer-account/server/notification-preferences.routes';
import {
  InMemoryNotificationPreferencesRepository,
  type NotificationPreferencesRepository,
} from '../../notification/server/notification-preferences.repository';
import { NotificationPreferencesService } from '../../notification/server/notification-preferences.service';
import { MarketingConsentGuard } from './marketing-consent.guard';

let sharedCommunicationPrefsRepo: InMemoryCommunicationPreferencesRepository | null = null;
let sharedNotificationPrefsRepo: InMemoryNotificationPreferencesRepository | null = null;

export function getSharedCommunicationPreferencesRepository(): InMemoryCommunicationPreferencesRepository {
  if (!sharedCommunicationPrefsRepo) {
    sharedCommunicationPrefsRepo = new InMemoryCommunicationPreferencesRepository();
  }
  return sharedCommunicationPrefsRepo;
}

export function getSharedNotificationPreferencesRepository(): InMemoryNotificationPreferencesRepository {
  if (!sharedNotificationPrefsRepo) {
    sharedNotificationPrefsRepo = new InMemoryNotificationPreferencesRepository();
  }
  return sharedNotificationPrefsRepo;
}

export function resetPreferencesModuleForTests(): void {
  getSharedCommunicationPreferencesRepository().reset();
  getSharedNotificationPreferencesRepository().reset();
}

export interface PreferencesModuleDeps {
  sessionService: SessionService;
}

export function createPreferencesModule(deps: PreferencesModuleDeps) {
  const communicationPrefsRepo = getSharedCommunicationPreferencesRepository();
  const notificationPrefsRepo = getSharedNotificationPreferencesRepository();

  const communicationPrefsService = new CommunicationPreferencesService(communicationPrefsRepo);
  const notificationPrefsService = new NotificationPreferencesService(notificationPrefsRepo);
  const marketingConsentGuard = new MarketingConsentGuard(communicationPrefsRepo);

  const communicationPrefsController = new CommunicationPreferencesController(
    communicationPrefsService,
    deps.sessionService,
  );
  const notificationPrefsController = new NotificationPreferencesController(
    notificationPrefsService,
    deps.sessionService,
  );

  return {
    communicationPrefsService,
    notificationPrefsService,
    marketingConsentGuard,
    communicationPrefsRepository: communicationPrefsRepo,
    notificationPrefsRepository: notificationPrefsRepo,
    communicationPrefsRouter: createCommunicationPreferencesRouter(communicationPrefsController),
    notificationPrefsRouter: createNotificationPreferencesRouter(notificationPrefsController),
  };
}

export type {
  CommunicationPreferencesRepository,
  NotificationPreferencesRepository,
  CommunicationPreferencesService,
  NotificationPreferencesService,
};
