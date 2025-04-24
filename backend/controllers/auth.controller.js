const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use." });
        }

        // 🔹 Password Validation (example)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters, contain a number, and a special character." });
        }

        // 🔹 Hash password & create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        return res.status(201).json({ success: true, message: "User registered successfully!" });

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
        const user = await User.findOne({ email });
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
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "your_jwt_secret",
            { expiresIn: "1h" }
        );

        return res.json({
            success: true,
            message: "Login successful!",
            user: { id: user._id, username: user.username, email: user.email },
            accessToken: token,
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// ✅ Get user profile (Protected Route)
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, user });

    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// ✅ Export functions
module.exports = { register, login, getProfile };
