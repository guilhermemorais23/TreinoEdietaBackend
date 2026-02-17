const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workout.controller");
const authMiddleware = require("../middleware/auth");

router.post("/generate", authMiddleware, workoutController.generateWorkout);

module.exports = router;