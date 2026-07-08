const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Profile Route
router.get("/profile", authMiddleware, getProfile);

// Update Profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;