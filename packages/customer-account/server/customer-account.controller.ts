import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpStatus } from '../../shared/http-status';
import { requireSessionId } from '../../shared/express-session-id';
import {
  registerSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  savedAddressInputSchema,
  saveVendorPaymentMethodSchema,
} from '@pawplace/customer-account-shared';
import type { AuthService } from './auth.service';
import type { SessionService } from './session.service';
import type { ProfileService } from './profile.service';
import type { AddressBookService } from './address-book.service';
import type { SavedPaymentService } from './saved-payment.service';
import type { WishlistService } from './wishlist.service';
import type { CustomerAccountRepository } from './customer-account.repository';
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  UnverifiedAccountError,
  VerificationLinkError,
  PasswordResetLinkError,
  AuthenticationRequiredError,
  DefaultAddressDeletionRequiresReplacementError,
  DefaultPaymentDeletionRequiresReplacementError,
} from './customer-account.errors';

function zodMessage(error: ZodError): string {
  return error.issues.map((i) => i.message).join('; ');
}

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly accounts: CustomerAccountRepository,
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = registerSchema.parse(req.body);
      const result = await this.authService.register(body);
      res.status(HttpStatus.CREATED).json({
        message: 'check your email to verify',
        expectEmailShortly: result.queuedDelivery,
      });
    } catch (error) {
      if (error instanceof EmailAlreadyRegisteredError) {
        res.status(HttpStatus.CONFLICT).json({
          error: 'This email is already in use',
          loginUrl: '/login',
        });
        return;
      }
      if (error instanceof ZodError) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: zodMessage(error) });
        return;
      }
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = loginSchema.parse(req.body);
      const sessionId = requireSessionId(req);
      const dashboard = await this.authService.login(body, sessionId);
      const account = await this.accounts.findByEmail(body.email);
      if (account) {
        await this.sessionService.mergeGuestCartOnLogin(sessionId, account.id);
      }
      res.json(dashboard);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'invalid email or password' });
        return;
      }
      if (error instanceof UnverifiedAccountError) {
        res.status(HttpStatus.FORBIDDEN).json({
          error: 'please verify your email first',
          resendAvailable: true,
        });
        return;
      }
      if (error instanceof ZodError) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: zodMessage(error) });
        return;
      }
      throw error;
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = String(req.query.token ?? '');
      const outcome = await this.authService.verifyEmail(token);
      res.json({ outcome });
    } catch (error) {
      if (error instanceof VerificationLinkError) {
        res.status(HttpStatus.GONE).json({
          error: error.message,
          code: error.code,
          resendAvailable: error.code === 'expired',
        });
        return;
      }
      throw error;
    }
  };

  resendVerification = async (req: Request, res: Response): Promise<void> => {
    const email = String(req.body.email ?? '');
    await this.authService.resendVerification(email);
    res.json({ message: 'expect verification email shortly' });
  };

  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = passwordResetRequestSchema.parse(req.body);
      await this.authService.requestPasswordReset(body.email);
      res.json({ message: 'check your email' });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: zodMessage(error) });
        return;
      }
      throw error;
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = passwordResetConfirmSchema.parse(req.body);
      await this.authService.resetPassword(body.token, body.password);
      res.json({ message: 'password updated' });
    } catch (error) {
      if (error instanceof PasswordResetLinkError) {
        res.status(HttpStatus.GONE).json({ error: 'link expired', code: error.code });
        return;
      }
      if (error instanceof ZodError) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: zodMessage(error) });
        return;
      }
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        return;
      }
      throw error;
    }
  };

  validateResetToken = async (req: Request, res: Response): Promise<void> => {
    const token = String(req.query.token ?? '');
    const result = this.authService.validateResetToken(token);
    res.json(result);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const sessionId = requireSessionId(req);
    await this.sessionService.invalidate(sessionId);
    res.json({ ok: true });
  };

  logoutEverywhere = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId = requireSessionId(req);
      const principal = await this.sessionService.requireVerifiedPrincipal(sessionId);
      await this.sessionService.invalidateAllForAccount(principal.accountId);
      res.json({ ok: true });
    } catch (error) {
      if (error instanceof AuthenticationRequiredError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
        return;
      }
      throw error;
    }
  };
}

export class AccountController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly profileService: ProfileService,
    private readonly addressBook: AddressBookService,
    private readonly savedPayment: SavedPaymentService,
  ) {}

  getAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const dashboard = await this.profileService.getDashboard(principal.accountId);
      res.json(dashboard);
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  listOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const orders = await this.profileService.listOrderHistory(principal.accountId);
      res.json({ orders });
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  getOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const order = await this.profileService.getOrderDetail(principal.accountId, req.params.orderNumber);
      if (!order) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'Order not found' });
        return;
      }
      res.json(order);
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  reorder = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId = requireSessionId(req);
      const principal = await this.sessionService.requireVerifiedPrincipal(sessionId);
      const result = await this.profileService.reorder(
        principal.accountId,
        req.params.orderNumber,
        sessionId,
      );
      res.json(result);
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  listAddresses = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      res.json({ addresses: this.addressBook.list(principal.accountId) });
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  addAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const body = savedAddressInputSchema.parse(req.body);
      const address = this.addressBook.add(principal.accountId, body);
      res.status(HttpStatus.CREATED).json(address);
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const body = savedAddressInputSchema.parse(req.body);
      const address = this.addressBook.update(principal.accountId, req.params.id, body);
      res.json(address);
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  deleteAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const newDefaultId = req.body.newDefaultId as string | undefined;
      this.addressBook.delete(principal.accountId, req.params.id, newDefaultId);
      res.json({ ok: true });
    } catch (error) {
      if (error instanceof DefaultAddressDeletionRequiresReplacementError) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ error: error.message });
        return;
      }
      this.handleAuthError(error, res);
    }
  };

  setDefaultAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      this.addressBook.setDefault(principal.accountId, req.params.id);
      res.json({ ok: true });
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  listPaymentMethods = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      res.json({ methods: this.savedPayment.list(principal.accountId) });
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  savePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const body = saveVendorPaymentMethodSchema.parse(req.body);
      const method = this.savedPayment.addVendorSavedMethod(principal.accountId, body);
      res.status(HttpStatus.CREATED).json(method);
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  deletePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      const newDefaultId = req.body.newDefaultId as string | undefined;
      this.savedPayment.remove(principal.accountId, req.params.id, newDefaultId);
      res.json({ ok: true });
    } catch (error) {
      if (error instanceof DefaultPaymentDeletionRequiresReplacementError) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ error: error.message });
        return;
      }
      this.handleAuthError(error, res);
    }
  };

  setDefaultPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      this.savedPayment.setDefault(principal.accountId, req.params.id);
      res.json({ ok: true });
    } catch (error) {
      this.handleAuthError(error, res);
    }
  };

  private handleAuthError(error: unknown, res: Response): void {
    if (error instanceof AuthenticationRequiredError || error instanceof UnverifiedAccountError) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
      return;
    }
    if (error instanceof ZodError) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: zodMessage(error) });
      return;
    }
    throw error;
  }
}

export class WishlistController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly wishlistService: WishlistService,
  ) {}

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      res.json(this.wishlistService.list(principal.accountId));
    } catch (error) {
      if (error instanceof AuthenticationRequiredError || error instanceof UnverifiedAccountError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
        return;
      }
      throw error;
    }
  };

  add = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      this.wishlistService.add(principal.accountId, req.body.sku);
      res.status(HttpStatus.CREATED).json({ ok: true });
    } catch (error) {
      if (error instanceof AuthenticationRequiredError || error instanceof UnverifiedAccountError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
        return;
      }
      throw error;
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      this.wishlistService.remove(principal.accountId, req.params.sku);
      res.json({ ok: true });
    } catch (error) {
      if (error instanceof AuthenticationRequiredError || error instanceof UnverifiedAccountError) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
        return;
      }
      throw error;
    }
  };

  contains = async (req: Request, res: Response): Promise<void> => {
    try {
      const principal = await this.sessionService.requireVerifiedPrincipal(req.session?.id);
      res.json({ inWishlist: this.wishlistService.contains(principal.accountId, req.params.sku) });
    } catch {
      res.json({ inWishlist: false });
    }
  };
}
