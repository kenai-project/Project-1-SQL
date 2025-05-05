const jwt = require("jsonwebtoken");

// Middleware to verify authentication
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    console.log("Auth Middleware: No token provided.");
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  const secret = process.env.JWT_SECRET || "your_jwt_secret";
  if (!secret) {
    console.error("Auth Middleware: JWT_SECRET is not defined.");
    return res.status(500).json({ message: "Internal Server Error: JWT secret not configured." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), secret);
    req.user = decoded; // Attach user data to request
    console.log("Auth Middleware: Token verified for user", decoded.id);
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.log("Auth Middleware: Invalid or expired token.", error.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
