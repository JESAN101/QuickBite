const Food = require("../models/Food");
const Category = require("../models/Category");

// ===================================
// Create Food
// ===================================
const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      restaurant,
      image,
      isAvailable,
      preparationTime,
    } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check Category
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const food = await Food.create({
      name,
      description,
      price,
      category,
      restaurant,
      image,
      isAvailable,
      preparationTime,
    });

    res.status(201).json({
      success: true,
      message: "Food created successfully.",
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

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
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

// =============================
// Get Foods By Restaurant
// =============================
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
  createFood,
  getAllFood,
  getFoodById,
  updateFood,
  deleteFood,
  getFoodsByRestaurant,
};