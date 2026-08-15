const Favorite = require("../models/Favorite");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// ==========================
// Add Favorite
// ==========================
const addFavorite = asyncHandler(async (req, res) => {
  const { food } = req.body;

  const exists = await Favorite.findOne({
    user: req.user._id,
    food,
  });

  if (exists) {
    throw new ErrorResponse("Already in favorites.", 400);
  }

  const favorite = await Favorite.create({
    user: req.user._id,
    food,
  });

  res.status(201).json({
    success: true,
    message: "Added to favorites.",
    favorite,
  });
});

// ==========================
// Get Favorites
// ==========================
const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({
    user: req.user._id,
  }).populate("food");

  res.status(200).json({
    success: true,
    favorites,
  });
});

// ==========================
// Remove Favorite
// ==========================
const removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findByIdAndDelete(
    req.params.id
  );

  if (!favorite) {
    throw new ErrorResponse("Item not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Removed from favorites.",
  });
});

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};
