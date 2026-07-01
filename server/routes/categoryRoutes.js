const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/create", createCategory);

router.get("/all", getAllCategories);

router.get("/:id", getCategoryById);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;