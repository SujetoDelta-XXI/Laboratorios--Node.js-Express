const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const pokedexController = require("../controllers/pokedexController");

// Rutas principales
router.get("/", mainController.home);
router.get("/about", mainController.about);
router.get("/contact", mainController.contact);
router.post("/contact", mainController.saveContact);
router.get("/admin", mainController.admin);

// Nueva ruta Pokedex
router.get("/pokedex", pokedexController.list);
router.post("/pokedex", pokedexController.save);

module.exports = router;



