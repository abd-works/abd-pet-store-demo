import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import { toggleNotificationPreferenceSchema } from '../../notification/shared/notification-preferences.schema';
import type { NotificationPreferencesService } from '../../notification/server/notification-preferences.service';
import type { SessionService } from './session.service';
import {
  AuthenticationRequiredError,
  UnverifiedAccountError,
} from './customer-account.errors';

export class NotificationPreferencesController {
  constructor(
    private readonly service: NotificationPreferencesService,
    private readonly sessionService: SessionService,
  ) {}

  getPreferences = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const prefs = await this.service.getForAccount(principal.accountId);
      res.status(HttpStatus.OK).json(prefs);
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  toggleCategory = async (req: Request, res: Response): Promise<void> => {
    const parsed = toggleNotificationPreferenceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid preference toggle', details: parsed.error.flatten() });
      return;
    }

    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const prefs = await this.service.setCategory(
        principal.accountId,
        parsed.data.category,
        parsed.data.enabled,
      );
      res.status(HttpStatus.OK).json(prefs);
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  private handleAuthError(error: unknown, res: Response): void {
    if (error instanceof AuthenticationRequiredError) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
      return;
    }
    if (error instanceof UnverifiedAccountError) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Email verification required' });
      return;
    }
    throw error;
  }
}
