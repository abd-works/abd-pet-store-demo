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
    deps: {
      inline: [
        /@pawplace\//,
        'zod',
        'supertest',
        'express',
        'express-session',
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
    fileParallelism: false,
    setupFiles: [path.resolve(confRoot, 'vitest.setup.ts')],
  },
  resolve: {
    modules: [path.join(confRoot, 'node_modules'), 'node_modules'],
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: '@pawplace/store-shared', replacement: path.resolve(repoRoot, 'packages/store/shared/index.ts') },
      { find: '@pawplace/store-server', replacement: path.resolve(repoRoot, 'packages/store/server/index.ts') },
      { find: '@pawplace/store-client/store.api', replacement: path.resolve(repoRoot, 'packages/store/client/store.api.ts') },
      { find: '@pawplace/store-client', replacement: path.resolve(repoRoot, 'packages/store/client/index.ts') },
      { find: '@pawplace/product-catalog-shared', replacement: path.resolve(repoRoot, 'packages/product-catalog/shared/index.ts') },
      { find: '@pawplace/product-catalog-server', replacement: path.resolve(repoRoot, 'packages/product-catalog/server/index.ts') },
      { find: '@pawplace/product-catalog-client/product-catalog.api', replacement: path.resolve(repoRoot, 'packages/product-catalog/client/product-catalog.api.ts') },
      { find: '@pawplace/product-catalog-client', replacement: path.resolve(repoRoot, 'packages/product-catalog/client/index.ts') },
      { find: '@pawplace/app-server', replacement: path.resolve(repoRoot, 'packages/app-server/index.ts') },
      { find: '@pawplace/cart-shared', replacement: path.resolve(repoRoot, 'packages/cart/shared/index.ts') },
      { find: '@pawplace/cart-server', replacement: path.resolve(repoRoot, 'packages/cart/server/index.ts') },
      { find: '@pawplace/cart-client/cart.api', replacement: path.resolve(repoRoot, 'packages/cart/client/cart.api.ts') },
      { find: '@pawplace/cart-client', replacement: path.resolve(repoRoot, 'packages/cart/client/index.ts') },
      { find: '@pawplace/order-shared', replacement: path.resolve(repoRoot, 'packages/order/shared/index.ts') },
      { find: '@pawplace/order-server', replacement: path.resolve(repoRoot, 'packages/order/server/index.ts') },
      { find: '@pawplace/order-client/order.api', replacement: path.resolve(repoRoot, 'packages/order/client/order.api.ts') },
      { find: '@pawplace/order-client', replacement: path.resolve(repoRoot, 'packages/order/client/index.ts') },
      { find: '@pawplace/payment-shared', replacement: path.resolve(repoRoot, 'packages/payment/shared/index.ts') },
      { find: '@pawplace/payment-client/payment.api', replacement: path.resolve(repoRoot, 'packages/payment/client/payment.api.ts') },
      { find: '@pawplace/payment-client', replacement: path.resolve(repoRoot, 'packages/payment/client/index.ts') },
      { find: 'react-router-dom', replacement: path.resolve(confRoot, 'node_modules/react-router-dom/dist/index.js') },
      { find: '@testing-library/react', replacement: path.resolve(confRoot, 'node_modules/@testing-library/react/dist/index.js') },
      { find: '@testing-library/user-event', replacement: path.resolve(confRoot, 'node_modules/@testing-library/user-event/dist/esm/index.js') },
      { find: '@testing-library/jest-dom/vitest', replacement: path.resolve(confRoot, 'node_modules/@testing-library/jest-dom/vitest.js') },
      { find: '@testing-library/jest-dom', replacement: path.resolve(confRoot, 'node_modules/@testing-library/jest-dom/dist/index.js') },
      { find: 'supertest', replacement: path.resolve(confRoot, 'node_modules/supertest/index.js') },
      { find: 'zod', replacement: path.resolve(confRoot, 'node_modules/zod/index.js') },
      { find: 'express', replacement: path.resolve(confRoot, 'node_modules/express/index.js') },
      { find: 'express-session', replacement: path.resolve(confRoot, 'node_modules/express-session/index.js') },
      { find: 'mongodb', replacement: path.resolve(confRoot, 'node_modules/mongodb/lib/index.js') },
      { find: 'react/jsx-dev-runtime', replacement: path.resolve(confRoot, 'node_modules/react/jsx-dev-runtime.js') },
      { find: 'react/jsx-runtime', replacement: path.resolve(confRoot, 'node_modules/react/jsx-runtime.js') },
      { find: 'react-dom/client', replacement: path.resolve(confRoot, 'node_modules/react-dom/client.js') },
      { find: 'react-dom', replacement: path.resolve(confRoot, 'node_modules/react-dom/index.js') },
      { find: 'react', replacement: path.resolve(confRoot, 'node_modules/react/index.js') },
      { find: '@pawplace/customer-account-shared', replacement: path.resolve(repoRoot, 'packages/customer-account/shared/index.ts') },
      { find: '@pawplace/customer-account-client', replacement: path.resolve(repoRoot, 'packages/customer-account/client/index.ts') },
    ],
  },
});
