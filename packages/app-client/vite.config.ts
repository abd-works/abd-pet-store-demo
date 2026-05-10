import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  resolve: {
    alias: {
      '@pawplace/product-catalog-shared': path.resolve(__dirname, '../product-catalog/shared/index.ts'),
      '@pawplace/store-shared': path.resolve(__dirname, '../store/shared/index.ts'),
    },
  },
});
