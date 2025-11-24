const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

const app = express();

/* CORS SEGURO PARA PRODUCCIÓN */
// Allowed origins can be configured via FRONTEND_ORIGINS env var (comma separated).
const defaultOrigins = 'http://localhost:3000,http://127.0.0.1:3000,https://laboratorios-node-js-express.vercel.app';
const allowedOrigins = (process.env.FRONTEND_ORIGINS || defaultOrigins)
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

console.log('CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

/* MIDDLEWARES */
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

/* RUTAS */
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

/* ROOT */
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API E-commerce funcionando correctamente 🚀'
  });
});

/* 404 */
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
