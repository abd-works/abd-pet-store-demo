import express from 'express';
import { storeRouter, storeTestRouter } from './packages/store/server/index';
import { productCatalogRouter } from './packages/product-catalog/server/index';

const app = express();
app.use(express.json());
app.use('/api', storeRouter);
app.use('/api', storeTestRouter);
app.use(productCatalogRouter);

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`PawPlace API running at http://localhost:${PORT}`);
  console.log(`  Stores:    http://localhost:${PORT}/api/stores`);
  console.log(`  Products:  http://localhost:${PORT}/api/products/PET-HAR-001`);
  console.log(`  Stock:     http://localhost:${PORT}/api/stock/PET-HAR-001/STR-001`);
});

server.on('error', (err: Error) => {
  console.error('Server error:', err);
});

process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
