const express = require("express");

const {
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================
// Public Routes
// =====================================

// Active Coupons (for the checkout page)
router.get("/active", getActiveCoupons);

// =====================================
// Customer Routes
// =====================================

// Validate a coupon code against a subtotal
router.post("/validate", authMiddleware, validateCoupon);

// =====================================
// Admin Routes
// =====================================

// Create Coupon
router.post("/", authMiddleware, adminMiddleware, createCoupon);

// Get All Coupons
router.get("/all", authMiddleware, adminMiddleware, getAllCoupons);

// Update Coupon
router.put("/:id", authMiddleware, adminMiddleware, updateCoupon);

// Delete Coupon
router.delete("/:id", authMiddleware, adminMiddleware, deleteCoupon);

// Get Single Coupon (KEEP BEFORE catch-all order matters: "/active", "/all", "/validate" must come before "/:id")
router.get("/:id", authMiddleware, adminMiddleware, getCouponById);

module.exports = router;
