import type { Request, Response } from 'express';
import { HttpStatus } from '../../shared/http-status';
import type { SessionService } from './session.service';
import { PetProfileNotFoundError, type PetProfileService } from './pet-profile.service';
import { AuthenticationRequiredError } from './customer-account.errors';

export class PetProfileController {
  constructor(
    private readonly petProfileService: PetProfileService,
    private readonly sessionService: SessionService,
  ) {}

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const profiles = await this.petProfileService.list(principal.accountId);
      res.status(HttpStatus.OK).json({ profiles });
    } catch (error) {
      if (error instanceof AuthenticationRequiredError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const profile = await this.petProfileService.create(principal.accountId, req.body);
      res.status(HttpStatus.CREATED).json(profile);
    } catch (error) {
      if (error instanceof AuthenticationRequiredError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const profile = await this.petProfileService.update(principal.accountId, req.params.id, req.body);
      res.status(HttpStatus.OK).json(profile);
    } catch (error) {
      if (error instanceof PetProfileNotFoundError) {
        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        return;
      }
      if (error instanceof AuthenticationRequiredError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      await this.petProfileService.delete(principal.accountId, req.params.id);
      res.status(HttpStatus.OK).json({ ok: true });
    } catch (error) {
      if (error instanceof PetProfileNotFoundError) {
        res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
        return;
      }
      if (error instanceof AuthenticationRequiredError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
        return;
      }
      throw error;
    }
  };
}
