import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pawplaceViteAliases } from '../../conf/pawplace-aliases.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: __dirname,
  cacheDir: path.resolve(__dirname, '../../conf/node_modules/.vite/pawplace-client'),
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  resolve: {
    alias: pawplaceViteAliases(),
  },
});
