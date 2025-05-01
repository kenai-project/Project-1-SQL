const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
require('dotenv').config();

// ✅ Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔹 Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // 🔹 Check if user already exists
    const existingUser = await userModel.findUserByEmail(req.pgPool, email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use." });
    }

    // 🔹 Password Validation (example)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters, contain a number, and a special character." });
    }

    // 🔹 Create user
    const newUser = await userModel.createUser(req.pgPool, { username, email, password });

    return res.status(201).json({ success: true, message: "User registered successfully!", user: newUser });

  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ✅ Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // 🔹 Check if user exists
    const user = await userModel.findUserByEmail(req.pgPool, email);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    // 🔹 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    // 🔹 Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      message: "Login successful!",
      user: { id: user.id, username: user.username, email: user.email },
      accessToken: token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ✅ Update password
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All password fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New password and confirmation do not match." });
    }

    // Validate new password strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters, contain a number, and a special character." });
    }

    // Get user from DB
    const user = await userModel.findUserById(req.pgPool, userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in DB
    await userModel.updatePassword(req.pgPool, userId, hashedPassword);

    return res.json({ success: true, message: "Password updated successfully." });

  } catch (error) {
    console.error("Update Password Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

module.exports = { register, login, updatePassword };
