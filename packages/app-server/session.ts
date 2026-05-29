import session from 'express-session';
import type { Express } from 'express';

export function attachSessionMiddleware(app: Express): void {
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'pawplace-dev-session-secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
      },
    }),
  );
}
