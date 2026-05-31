import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function startDevServer() {
  const server = await createServer({
    configFile: path.resolve(__dirname, 'vite.config.ts'),
    root: __dirname,
  });
  await server.listen();
  server.printUrls();
}

startDevServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
