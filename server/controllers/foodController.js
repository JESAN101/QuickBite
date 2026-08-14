const Food = require("../models/Food");
const Category = require("../models/Category");

// ===================================
// Get All Foods
// ===================================
const getAllFood = async (req, res) => {
  try {

    const foods = await Food.find()
      .populate("category", "name")
      .populate("restaurant", "name");

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Get Food By ID
// ===================================
const getFoodById = async (req, res) => {
  try {

    const food = await Food.findById(req.params.id)
      .populate("category", "name")
      .populate("restaurant", "name");

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found.",
      });
    }

    res.status(200).json({
      success: true,
      food,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Update Food
// ===================================
const updateFood = async (req, res) => {
  try {

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found.",
      });
    }

    if (req.body.category) {

      const categoryExists = await Category.findById(req.body.category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
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

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Delete Food
// ===================================
const deleteFood = async (req, res) => {
  try {

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found.",
      });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Food deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Get Foods By Restaurant
// ===================================
const getFoodsByRestaurant = async (req, res) => {
  try {

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

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodsByRestaurant,
};