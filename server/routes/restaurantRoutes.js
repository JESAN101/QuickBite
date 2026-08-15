const express = require("express");

const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyOrders,
  updateMyOrderStatus,
  getMyFoods,
  createMyFood,
  updateMyFood,
  deleteMyFood,
  getMyStats,
} = require("../controllers/restaurantController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const restaurantMiddleware = require("../middleware/restaurantMiddleware");

const upload = require("../middleware/upload");
const { validate } = require("../middleware/validate");
const {
  createRestaurantSchema,
  updateRestaurantSchema,
} = require("../validators/restaurantValidator");
const {
  createFoodSchema,
  updateFoodSchema,
} = require("../validators/foodValidator");
const {
  updateOrderStatusSchema,
} = require("../validators/orderValidator");

const router = express.Router();

// ===========================
// Restaurant Owner Routes
// (MUST be registered before "/:id")
// ===========================

router.get(
  "/owner/mine",
  authMiddleware,
  restaurantMiddleware,
  getMyRestaurant
);

router.put(
  "/owner/update",
  authMiddleware,
  restaurantMiddleware,
  upload.single("image"),
  validate(updateRestaurantSchema),
  updateMyRestaurant
);

router.get(
  "/owner/stats",
  authMiddleware,
  restaurantMiddleware,
  getMyStats
);

router.get(
  "/owner/orders",
  authMiddleware,
  restaurantMiddleware,
  getMyOrders
);

router.put(
  "/owner/orders/:id",
  authMiddleware,
  restaurantMiddleware,
  validate(updateOrderStatusSchema),
  updateMyOrderStatus
);

router.get(
  "/owner/foods",
  authMiddleware,
  restaurantMiddleware,
  getMyFoods
);

router.post(
  "/owner/foods",
  authMiddleware,
  restaurantMiddleware,
  upload.single("image"),
  validate(createFoodSchema),
  createMyFood
);

router.put(
  "/owner/foods/:id",
  authMiddleware,
  restaurantMiddleware,
  upload.single("image"),
  validate(updateFoodSchema),
  updateMyFood
);

router.delete(
  "/owner/foods/:id",
  authMiddleware,
  restaurantMiddleware,
  deleteMyFood
);

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
  validate(createRestaurantSchema),
  createRestaurant
);

router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  validate(updateRestaurantSchema),
  updateRestaurant
);

router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteRestaurant
);

module.exports = router;
