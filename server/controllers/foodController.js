const Food = require("../models/Food");
const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const { parsePagination, escapeRegex } = require("../utils/pagination");

// ===================================
// Search Suggestions (Autocomplete)
// Returns up to 8 food names for typeahead.
// ===================================
const getSuggestions = asyncHandler(async (req, res) => {
  const search = (req.query.search || "").trim();

  if (!search || search.length < 2) {
    return res.status(200).json({ success: true, suggestions: [] });
  }

  const regex = new RegExp(escapeRegex(search), "i");

  const foods = await Food.find({ name: regex, isAvailable: true })
    .select("name _id")
    .limit(8)
    .lean();

  res.status(200).json({
    success: true,
    suggestions: foods.map((f) => ({ id: f._id, name: f.name })),
  });
});

// ===================================
// Get All Foods (Paginated)
// Supports ?page=1&limit=10&search=word
// Without limit, returns everything
// (backward compatible with the Home page).
// ===================================
const getAllFood = asyncHandler(async (req, res) => {
  const { page } = parsePagination(req.query);
  // When ?limit is omitted the public storefront wants ALL foods.
  const limitParam = req.query.limit;
  const limit =
    limitParam !== undefined
      ? Math.max(1, Math.min(parseInt(limitParam, 10) || 10, 100))
      : undefined;
  const skip = limit ? (page - 1) * limit : 0;
  const search = (req.query.search || "").trim();

  const filter = search
    ? {
        name: new RegExp(escapeRegex(search), "i"),
      }
    : {};

  const [total, foods] = await Promise.all([
    Food.countDocuments(filter),
    Food.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("categories", "name")
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
    .populate("categories", "name")
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

  if (req.body.categories) {
    const ids = Array.isArray(req.body.categories)
      ? req.body.categories
      : String(req.body.categories).split(",").map((s) => s.trim()).filter(Boolean);

    for (const id of ids) {
      const categoryExists = await Category.findById(id);
      if (!categoryExists) {
        throw new ErrorResponse(`Category ${id} not found.`, 404);
      }
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
    .populate("categories", "name")
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
    .populate("categories", "name")
    .populate("restaurant", "name");

  res.status(200).json({
    success: true,
    count: foods.length,
    foods,
  });
});

module.exports = {
  getSuggestions,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodsByRestaurant,
};
