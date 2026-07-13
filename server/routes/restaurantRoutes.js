const express = require("express");

const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const upload = require("../middleware/upload");

const router = express.Router();


// ===========================
// Public Routes
// ===========================

router.get("/all", getRestaurants);

router.get("/:id", getRestaurant);


// ===========================
// Admin Routes
// ===========================

router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createRestaurant
);

router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateRestaurant
);

router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteRestaurant
);

module.exports = router;