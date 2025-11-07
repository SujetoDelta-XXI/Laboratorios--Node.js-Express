// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import ejsMate from 'ejs-mate';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Rutas y utils
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import webRoutes from './routes/web.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

dotenv.config();

// 🔑 Necesario para construir ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// === Configuración EJS con ejs-mate ===
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === Archivos estáticos ===
app.use(express.static('public'));

// === Middlewares ===
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// === Rutas API ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// === Rutas Web (EJS) ===
app.use('/', webRoutes);

// === Healthcheck ===
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// === Manejador global de errores ===
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
  });
});

const PORT = process.env.PORT || 3000;

// === Conexión a MongoDB y seeders ===
mongoose
  .connect(process.env.MONGO_URI, { autoIndex: true })
  .then(async () => {
    console.log('Mongo connected');
    await seedRoles();
    await seedUsers();
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('Error al conectar con Mongo:', err);
    process.exit(1);
  });
