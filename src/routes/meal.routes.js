const express = require("express");
const router = express.Router();
const mealController = require("../controllers/meal.controller");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");

const upload = multer();

// Rotas
router.get("/stats/weekly", authMiddleware, mealController.getWeeklyStats);
router.post("/analyze", authMiddleware, upload.single("image"), mealController.analyzeImage);
router.post("/", authMiddleware, mealController.createMeal);
router.get("/", authMiddleware, mealController.getMeals);
router.delete("/:id", authMiddleware, mealController.deleteMeal);

// A LINHA QUE ESTAVA FALTANDO:
module.exports = router;