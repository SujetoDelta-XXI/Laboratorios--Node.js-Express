// src/routes/post.routes.js
import express from "express";
import postController from "../controllers/postController.js";
import userRepository from "../repositories/userRepository.js";

const router = express.Router();

// Listar todos los posts
router.get("/", postController.getAll);

// Formulario para crear un nuevo post (carga usuarios)
router.get("/add", async (req, res) => {
  try {
    const users = await userRepository.findAll();
    res.render("addPost", { users });
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    res.status(500).send("Error al cargar el formulario de posts.");
  }
});

// Crear un nuevo post
router.post("/add", postController.create);

// Formulario para editar un post existente
router.get("/edit/:id", postController.editForm);

// Actualizar un post
router.post("/update/:id", postController.update);

// Eliminar un post
router.get("/delete/:id", postController.delete);

export default router;
