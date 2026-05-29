import { createServer, type InlineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function devServerConfig(): InlineConfig {
  return {
    configFile: false,
    root: __dirname,
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
  };
}

async function startDevServer() {
  const server = await createServer(devServerConfig());
  await server.listen();
  console.log('PawPlace client running at http://localhost:3000');
}

startDevServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
