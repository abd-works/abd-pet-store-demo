import { z } from 'zod';

export const passwordRequirementsSchema = z
  .string()
  .min(8, 'minimum 8 characters')
  .regex(/[A-Z]/, 'at least one uppercase letter')
  .regex(/\d/, 'at least one digit')
  .regex(/[^A-Za-z0-9]/, 'at least one special character');

export const PASSWORD_REQUIREMENT_LABELS = [
  'minimum 8 characters',
  'at least one uppercase letter',
  'at least one digit',
  'at least one special character',
] as const;

export function listUnmetPasswordRequirements(password: string): string[] {
  const result = passwordRequirementsSchema.safeParse(password);
  if (result.success) return [];
  return result.error.issues.map((issue) => issue.message);
}
