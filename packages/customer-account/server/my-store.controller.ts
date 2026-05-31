import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import type { SessionService } from './session.service';
import type { MyStoreService } from './my-store.service';
import { AuthenticationRequiredError } from './customer-account.errors';

export class MyStoreController {
  constructor(
    private readonly myStoreService: MyStoreService,
    private readonly sessionService: SessionService,
  ) {}

  getMyStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const storeCode = await this.myStoreService.getForAccount(principal.accountId);
      res.status(HttpStatus.OK).json({ storeCode });
    } catch (error) {
      if (error instanceof AuthenticationRequiredError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  clearMyStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      await this.myStoreService.clearPreferredStore(principal.accountId);
      res.status(HttpStatus.OK).json({ storeCode: null });
    } catch (error) {
      if (error instanceof AuthenticationRequiredError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  setMyStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const storeCode = typeof req.body.storeCode === 'string' ? req.body.storeCode : '';
      if (!storeCode) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: 'storeCode required' });
        return;
      }
      const saved = await this.myStoreService.setPreferredStore(principal.accountId, storeCode);
      res.status(HttpStatus.OK).json({ storeCode: saved });
    } catch (error) {
      if (error instanceof AuthenticationRequiredError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
        return;
      }
      throw error;
    }
  };
}
