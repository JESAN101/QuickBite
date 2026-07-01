const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {

    // Get token from request header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token.",
    });
  }
};

module.exports = authMiddleware;