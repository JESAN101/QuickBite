const express = require("express");

const {
  getSuggestions,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodsByRestaurant,
} = require("../controllers/foodController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");
const { validate } = require("../middleware/validate");
const { updateFoodSchema } = require("../validators/foodValidator");

const router = express.Router();

// =============================
// Public Routes
// =============================

// Get Search Suggestions (must be before /:id)
router.get("/suggestions", getSuggestions);

// Get All Foods
router.get("/all", getAllFood);

// Get Foods By Restaurant
router.get("/restaurant/:restaurantId", getFoodsByRestaurant);

// Get Food By ID
router.get("/:id", getFoodById);

// =============================
// Admin Routes
// =============================

// Update Food
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  validate(updateFoodSchema),
  updateFood,
);

// Delete Food
router.delete("/:id", authMiddleware, adminMiddleware, deleteFood);

module.exports = router;
