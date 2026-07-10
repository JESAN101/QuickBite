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

// Customer
router.post("/place", authMiddleware, placeOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/:id", authMiddleware, getOrder);

// Admin
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteOrder
);

module.exports = router;