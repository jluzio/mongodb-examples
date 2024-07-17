import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';

import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';

import { DbService } from './db.js'

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/products', productRoutes);
app.use('/', authRoutes);

DbService.init()
  .then(ignored => app.listen(3100))
  .catch(reason => console.log("Error", {reason}))
