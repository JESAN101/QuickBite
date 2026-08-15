const Food = require("../models/Food");
const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// ===================================
// Get All Foods
// ===================================
const getAllFood = asyncHandler(async (req, res) => {
  const foods = await Food.find()
    .populate("category", "name")
    .populate("restaurant", "name");

  res.status(200).json({
    success: true,
    count: foods.length,
    foods,
  });
});

// ===================================
// Get Food By ID
// ===================================
const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id)
    .populate("category", "name")
    .populate("restaurant", "name");

  if (!food) {
    throw new ErrorResponse("Food not found.", 404);
  }

  res.status(200).json({
    success: true,
    food,
  });
});

// ===================================
// Update Food
// ===================================
const updateFood = asyncHandler(async (req, res) => {
  let food = await Food.findById(req.params.id);

  if (!food) {
    throw new ErrorResponse("Food not found.", 404);
  }

  if (req.body.category) {
    const categoryExists = await Category.findById(
      req.body.category
    );

    if (!categoryExists) {
      throw new ErrorResponse("Category not found.", 404);
    }
  }

  // Create update object
  const updateData = {
    ...req.body,
  };

  // If a new image was uploaded
  if (req.file) {
    updateData.image = req.file.path;
  }

  const updatedFood = await Food.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  )
    .populate("category", "name")
    .populate("restaurant", "name");

  res.status(200).json({
    success: true,
    message: "Food updated successfully.",
    food: updatedFood,
  });
});

// ===================================
// Delete Food
// ===================================
const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findByIdAndDelete(req.params.id);

  if (!food) {
    throw new ErrorResponse("Food not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Food deleted successfully.",
  });
});

// ===================================
// Get Foods By Restaurant
// ===================================
const getFoodsByRestaurant = asyncHandler(async (req, res) => {
  const foods = await Food.find({
    restaurant: req.params.restaurantId,
  })
    .populate("category", "name")
    .populate("restaurant", "name");

  res.status(200).json({
    success: true,
    count: foods.length,
    foods,
  });
});

module.exports = {
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodsByRestaurant,
};
