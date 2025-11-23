const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API E-commerce funcionando' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
