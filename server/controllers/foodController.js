const Food = require("../models/Food");
const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// ===================================
// Get All Foods (Paginated)
// Supports ?page=1&limit=10&search=word
// Without limit, returns everything
// (backward compatible with the Home page).
// ===================================
const getAllFood = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || undefined;
  const search = (req.query.search || "").trim();
  const skip = limit ? (page - 1) * limit : 0;

  const filter = search
    ? {
        name: new RegExp(
          search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i"
        ),
      }
    : {};

  const [total, foods] = await Promise.all([
    Food.countDocuments(filter),
    Food.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category", "name")
      .populate("restaurant", "name"),
  ]);

  res.status(200).json({
    success: true,
    total,
    page,
    pages: limit ? Math.max(1, Math.ceil(total / limit)) : 1,
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
