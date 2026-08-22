const express = require("express");

const {
  getDashboardStats,
  getAnalytics,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ===============================
// Admin Dashboard Statistics
// ===============================
router.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);

// ===============================
// Admin Analytics (Charts)
// ===============================
router.get("/analytics", authMiddleware, adminMiddleware, getAnalytics);

module.exports = router;
