const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware"); // Middleware for protected routes

// Register Route
router.post("/register", authController.register);

// Login Route
router.post("/login", authController.login);

// Refresh Token Route
router.post("/refresh-token", authController.refreshToken);

// Password Update Route
router.put("/password", authMiddleware, authController.updatePassword);

// Profile Update Route
router.put("/profile", authMiddleware, authController.updateProfile);

// Profile Get Route
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
