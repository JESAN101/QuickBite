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

const router = express.Router();

router.post("/place", authMiddleware, placeOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/all", authMiddleware, getAllOrders);

router.get("/:id", authMiddleware, getOrder);

router.put("/update/:id", authMiddleware, updateOrderStatus);

router.delete("/delete/:id", authMiddleware, deleteOrder);

module.exports = router;