const express = require("express");

const {
  getAvailableOrders,
  getMyDeliveries,
  acceptDelivery,
  completeDelivery,
  getRiderStats,
} = require("../controllers/riderController");

const authMiddleware = require("../middleware/authMiddleware");
const riderMiddleware = require("../middleware/riderMiddleware");

const router = express.Router();

// All rider routes are protected by auth + rider role

// Orders ready for pickup
router.get(
  "/available",
  authMiddleware,
  riderMiddleware,
  getAvailableOrders
);

// My assigned deliveries
router.get(
  "/my-deliveries",
  authMiddleware,
  riderMiddleware,
  getMyDeliveries
);

// Rider dashboard stats
router.get(
  "/stats",
  authMiddleware,
  riderMiddleware,
  getRiderStats
);

// Accept a delivery
router.put(
  "/accept/:id",
  authMiddleware,
  riderMiddleware,
  acceptDelivery
);

// Mark a delivery as complete
router.put(
  "/deliver/:id",
  authMiddleware,
  riderMiddleware,
  completeDelivery
);

module.exports = router;
