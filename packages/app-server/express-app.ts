import express, { type Express } from 'express';

export function createExpressApp(): Express {
  return express();
}

export function attachJsonBodyParser(app: Express): void {
  app.use(express.json());
}
