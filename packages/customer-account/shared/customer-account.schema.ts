import { z } from 'zod';
import { passwordRequirementsSchema } from './password.schema';

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: passwordRequirementsSchema,
    passwordConfirmation: z.string(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    optInPromotionalEmail: z.boolean().optional().default(false),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const verifyEmailQuerySchema = z.object({
  token: z.string().min(1),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const passwordResetConfirmSchema = z
  .object({
    token: z.string().min(1),
    password: passwordRequirementsSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export const accountDashboardSchema = z.object({
  email: z.string().email(),
  accountVerificationStatus: z.enum(['unverified', 'verified']),
  firstName: z.string(),
  lastName: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AccountDashboardDto = z.infer<typeof accountDashboardSchema>;
