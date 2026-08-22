const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// =======================================
// Create Category
// =======================================
const createCategory = asyncHandler(async (req, res) => {
  const { name, image, description } = req.body;

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new ErrorResponse("Category already exists.", 400);
  }

  const category = await Category.create({
    name,
    image,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    category,
  });
});

// =======================================
// Get All Categories
// =======================================
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

// =======================================
// Get Category By ID
// =======================================
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ErrorResponse("Category not found.", 404);
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// =======================================
// Update Category
// =======================================
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ErrorResponse("Category not found.", 404);
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully.",
    category: updatedCategory,
  });
});

// =======================================
// Delete Category
// =======================================
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new ErrorResponse("Category not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully.",
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
