const Restaurant = require("../models/Restaurant");

// Restaurant Owner Middleware
// - Ensures the logged-in user has the "restaurant" role
// - Loads their restaurant and attaches it to req.restaurant
const restaurantMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "restaurant") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Restaurant owners only.",
      });
    }

    const restaurant = await Restaurant.findOne({
      owner: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message:
          "No restaurant is assigned to your account. Please contact the admin.",
      });
    }

    req.restaurant = restaurant;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = restaurantMiddleware;
