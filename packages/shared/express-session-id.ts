import type { Request } from 'express';

export class SessionRequiredError extends Error {
  constructor() {
    super('session required');
    this.name = 'SessionRequiredError';
  }
}

export function requireSessionId(req: Request): string {
  if (!req.session?.id) throw new SessionRequiredError();
  return req.session.id;
}
