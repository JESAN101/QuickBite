const Restaurant = require("../models/Restaurant");

// =============================
// Create Restaurant
// =============================
const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, phone, image } = req.body;

    if (!name || !description || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      address,
      phone,
      image,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully.",
      restaurant,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Restaurants
// =============================
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate(
      "owner",
      "name email"
    );

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Restaurant
// =============================
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    res.status(200).json({
      success: true,
      restaurant,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Restaurant
// =============================
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully.",
      restaurant,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Restaurant
// =============================
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
};