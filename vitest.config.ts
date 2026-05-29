import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import path from 'node:path';

const repoRoot = __dirname;
const confRoot = path.join(repoRoot, 'conf');

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
    deps: {
      inline: [
        /@pawplace\//,
        'zod',
        'supertest',
        'express',
        '@testing-library/react',
        '@testing-library/user-event',
        '@testing-library/jest-dom',
      ],
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
    modules: [path.join(confRoot, 'node_modules'), 'node_modules'],
    alias: {
      '@pawplace/store-shared': path.resolve(repoRoot, 'packages/store/shared/index.ts'),
      '@pawplace/store-server': path.resolve(repoRoot, 'packages/store/server/index.ts'),
      '@pawplace/store-client/store.api': path.resolve(repoRoot, 'packages/store/client/store.api.ts'),
      '@pawplace/store-client': path.resolve(repoRoot, 'packages/store/client/index.ts'),
      '@pawplace/product-catalog-shared': path.resolve(repoRoot, 'packages/product-catalog/shared/index.ts'),
      '@pawplace/product-catalog-server': path.resolve(repoRoot, 'packages/product-catalog/server/index.ts'),
      '@pawplace/product-catalog-client/product-catalog.api': path.resolve(repoRoot, 'packages/product-catalog/client/product-catalog.api.ts'),
      '@pawplace/product-catalog-client': path.resolve(repoRoot, 'packages/product-catalog/client/index.ts'),
      '@pawplace/pet-client/pet.api': path.resolve(repoRoot, 'packages/pet/client/pet.api.ts'),
      '@pawplace/pet-client': path.resolve(repoRoot, 'packages/pet/client/index.ts'),
      '@pawplace/app-server': path.resolve(repoRoot, 'packages/app-server/index.ts'),
      'react-router-dom': path.resolve(confRoot, 'node_modules/react-router-dom/dist/index.js'),
      '@testing-library/react': path.resolve(confRoot, 'node_modules/@testing-library/react/dist/index.js'),
      '@testing-library/user-event': path.resolve(confRoot, 'node_modules/@testing-library/user-event/dist/esm/index.js'),
      '@testing-library/jest-dom': path.resolve(confRoot, 'node_modules/@testing-library/jest-dom/dist/index.js'),
      supertest: path.resolve(confRoot, 'node_modules/supertest/index.js'),
      zod: path.resolve(confRoot, 'node_modules/zod/index.js'),
      express: path.resolve(confRoot, 'node_modules/express/index.js'),
      mongodb: path.resolve(confRoot, 'node_modules/mongodb/lib/index.js'),
    },
  },
});
