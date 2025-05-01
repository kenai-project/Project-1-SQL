const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware"); // Middleware for protected routes

// Register Route
router.post("/register", authController.register);

// Login Route
router.post("/login", authController.login);

// Password Update Route
router.put("/password", authMiddleware, authController.updatePassword);

module.exports = router;
