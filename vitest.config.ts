import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    loader: 'tsx',
    include: ['**/*.ts', '**/*.tsx'],
  },
  test: {
    include: ['tests/**/*_server.test.ts', 'tests/**/*_client.test.tsx'],
    exclude: ['**/*_e2e.spec.ts', '**/*_e2e.spec.tsx', 'node_modules/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@pawplace/store-shared': path.resolve(__dirname, 'packages/store/shared/index.ts'),
      '@pawplace/store-server': path.resolve(__dirname, 'packages/store/server/index.ts'),
      '@pawplace/store-client/store.api': path.resolve(__dirname, 'packages/store/client/store.api.ts'),
      '@pawplace/store-client': path.resolve(__dirname, 'packages/store/client/index.ts'),
      '@pawplace/product-catalog-shared': path.resolve(__dirname, 'packages/product-catalog/shared/index.ts'),
      '@pawplace/product-catalog-server': path.resolve(__dirname, 'packages/product-catalog/server/index.ts'),
      '@pawplace/product-catalog-client/product-catalog.api': path.resolve(__dirname, 'packages/product-catalog/client/product-catalog.api.ts'),
      '@pawplace/product-catalog-client': path.resolve(__dirname, 'packages/product-catalog/client/index.ts'),
      '@pawplace/app-server': path.resolve(__dirname, 'packages/app-server/index.ts'),
    },
  },
});
