const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Profile Route
router.get("/profile", authMiddleware, getProfile);

// Update Profile
router.put("/profile", authMiddleware, updateProfile);

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

router.put(
  "/users/:id/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);

module.exports = router;