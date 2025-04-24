const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware"); // Middleware for protected routes

// Register Route
router.post("/register", authController.register);

// Login Route
router.post("/login", authController.login);

// Get Profile (Protected Route)
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
