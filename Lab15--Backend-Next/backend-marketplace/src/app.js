const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

const app = express();

/*CORS CONFIGURADO PARA PRODUCCIÓN*/

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_ORIGIN 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS bloqueado para: ' + origin));
    }
  },
  credentials: true
}));

/*MIDDLEWARES*/

app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

/*RUTAS */

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

/*RUTA PRINCIPAL*/

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API E-commerce funcionando correctamente 🚀'
  });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
