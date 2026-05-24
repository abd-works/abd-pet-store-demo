import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import path from 'node:path';

const confRoot = __dirname;
const repoRoot = path.resolve(confRoot, '..');

export default defineConfig({
  root: confRoot,
  cacheDir: path.join(confRoot, 'node_modules', '.vite'),
  plugins: [react()],
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    fs: {
      allow: [repoRoot, confRoot],
    },
  },
  test: {
    include: [
      '../tests/**/*_server.test.ts',
      '../tests/**/*_client.test.tsx',
    ],
    exclude: ['**/*_e2e.spec.ts', '**/*_e2e.spec.tsx', 'node_modules/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(confRoot, 'vitest.setup.ts')],
  },
  resolve: {
    alias: {
      '@pawplace/store-shared': path.resolve(repoRoot, 'packages/store/shared/index.ts'),
      '@pawplace/store-server': path.resolve(repoRoot, 'packages/store/server/index.ts'),
      '@pawplace/store-client/store.api': path.resolve(repoRoot, 'packages/store/client/store.api.ts'),
      '@pawplace/store-client': path.resolve(repoRoot, 'packages/store/client/index.ts'),
      '@pawplace/product-catalog-shared': path.resolve(repoRoot, 'packages/product-catalog/shared/index.ts'),
      '@pawplace/product-catalog-server': path.resolve(repoRoot, 'packages/product-catalog/server/index.ts'),
      '@pawplace/product-catalog-client/product-catalog.api': path.resolve(repoRoot, 'packages/product-catalog/client/product-catalog.api.ts'),
      '@pawplace/product-catalog-client': path.resolve(repoRoot, 'packages/product-catalog/client/index.ts'),
      '@pawplace/app-server': path.resolve(repoRoot, 'packages/app-server/index.ts'),
    },
  },
});
