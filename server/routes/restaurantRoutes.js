const express = require("express");

const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected
router.post("/create", authMiddleware, createRestaurant);
router.put("/update/:id", authMiddleware, updateRestaurant);
router.delete("/delete/:id", authMiddleware, deleteRestaurant);

// Public
router.get("/all", getRestaurants);
router.get("/:id", getRestaurant);

module.exports = router;