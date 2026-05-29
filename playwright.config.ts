import path from 'node:path';
import { defineConfig } from '@playwright/test';

const repoRoot = __dirname;

export default defineConfig({
  testDir: path.join(repoRoot, 'tests'),
  testMatch: '**/*_e2e.spec.ts',
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    slowMo: 400,
    geolocation: { latitude: 51.5074, longitude: -0.1278 },
    permissions: ['geolocation'],
  },
  webServer: [
    {
      command: 'node --import tsx/esm --import tsconfig-paths/register packages/app-server/dev.ts',
      cwd: repoRoot,
      url: 'http://localhost:3001/api/stores',
      reuseExistingServer: true,
      timeout: 15000,
    },
    {
      command: 'node --import tsx/esm packages/app-client/dev.ts',
      cwd: repoRoot,
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 30000,
    },
  ],
});
