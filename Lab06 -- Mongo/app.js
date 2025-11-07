// app.js
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./src/db/database.js";

// Rutas
import homeRoutes from "./src/routes/home.routes.js";
import postRoutes from "./src/routes/post.routes.js";

// Repositorios para la creación inicial de datos
import userRepository from "./src/repositories/userRepository.js";
import postRepository from "./src/repositories/postRepository.js";

dotenv.config();
const app = express();

// Configuración de rutas y carpetas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));

app.use("/", homeRoutes);
app.use("/posts", postRoutes);

// Conexión a la BD
connectDB().then(async () => {
  console.log("🔗 MongoDB conectado");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
