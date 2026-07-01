const express = require("express");

const {
  createFood,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodsByRestaurant,
} = require("../controllers/foodController");

const router = express.Router();

// =============================
// Create Food
// =============================
router.post("/create", createFood);

// =============================
// Get All Foods
// =============================
router.get("/all", getAllFood);

// =============================
// Get Foods By Restaurant
// =============================
router.get("/restaurant/:restaurantId", getFoodsByRestaurant);

// =============================
// Get Food By ID
// =============================
router.get("/:id", getFoodById);

// =============================
// Update Food
// =============================
router.put("/:id", updateFood);

// =============================
// Delete Food
// =============================
router.delete("/:id", deleteFood);

module.exports = router;