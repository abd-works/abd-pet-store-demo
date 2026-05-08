import { app } from './index';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`PawPlace API running at http://localhost:${PORT}`);
  console.log(`  Stores:    http://localhost:${PORT}/api/stores`);
  console.log(`  Products:  http://localhost:${PORT}/api/products/PET-HAR-001`);
  console.log(`  Stock:     http://localhost:${PORT}/api/stock/PET-HAR-001/STR-001`);
});
