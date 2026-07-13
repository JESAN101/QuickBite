const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================
// Customer Routes
// =====================================

// Place Order
router.post(
  "/place",
  authMiddleware,
  placeOrder
);

// Logged-in User Orders
router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);

// =====================================
// Admin Routes
// =====================================

// Get All Orders
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// Update Order Status
router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

// Delete Order
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteOrder
);

// =====================================
// Single Order (KEEP THIS LAST)
// =====================================

router.get(
  "/:id",
  authMiddleware,
  getOrder
);

module.exports = router;