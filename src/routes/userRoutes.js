const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

// Rota para pegar os dados do perfil (GET)
router.get("/profile", authMiddleware, userController.getProfile);

// Rota para salvar os dados do perfil (POST)
router.post("/profile", authMiddleware, userController.updateProfile);

module.exports = router;