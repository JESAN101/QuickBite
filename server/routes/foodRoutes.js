const express = require("express");

const {
  createFood,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodsByRestaurant,
} = require("../controllers/foodController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =============================
// Public Routes
// =============================

// Get All Foods
router.get("/all", getAllFood);

// Get Foods By Restaurant
router.get(
  "/restaurant/:restaurantId",
  getFoodsByRestaurant
);

// Get Food By ID
router.get("/:id", getFoodById);

// =============================
// Admin Routes
// =============================

// Create Food
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createFood
);

// Update Food
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateFood
);

// Delete Food
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteFood
);

module.exports = router;