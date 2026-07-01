const Favorite = require("../models/Favorite");

// ==========================
// Add Favorite
// ==========================
const addFavorite = async (req, res) => {
  try {

    const { food } = req.body;

    const exists = await Favorite.findOne({
      user: req.user._id,
      food,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already in favorites.",
      });
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

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// Get Favorites
// ==========================
const getFavorites = async (req, res) => {
  try {

    const favorites = await Favorite.find({
      user: req.user._id,
    }).populate("food");

    res.status(200).json({
      success: true,
      favorites,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// Remove Favorite
// ==========================
const removeFavorite = async (req, res) => {
  try {

    await Favorite.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Removed from favorites.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};