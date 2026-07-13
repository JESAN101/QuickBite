const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =======================
// Public Routes
// =======================

router.get("/all", getAllCategories);

router.get("/:id", getCategoryById);

// =======================
// Admin Routes
// =======================

router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategory
);

module.exports = router;