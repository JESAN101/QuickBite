const express = require("express");
const rateLimit = require("express-rate-limit");

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
const { validate } = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateRoleSchema,
} = require("../validators/authValidator");

const router = express.Router();

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

// Register
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  registerUser
);

// Login
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  loginUser
);

// Protected Profile Route
router.get("/profile", authMiddleware, getProfile);

// Update Profile
router.put(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  updateProfile
);

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
  validate(updateRoleSchema),
  updateUserRole
);

module.exports = router;
