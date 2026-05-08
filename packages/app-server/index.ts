import express from 'express';
import { storeRouter, storeTestRouter } from '@pawplace/store-server';
import { productCatalogRouter } from '@pawplace/product-catalog-server';

export const app = express();

app.use(express.json());
app.use('/api', storeRouter);
app.use('/api', storeTestRouter);
app.use(productCatalogRouter);
