const Cart = require("../models/Cart");

// ============================
// Add To Cart
// ============================
const addToCart = async (req, res) => {
  try {

    const { food, quantity } = req.body;

    if (!food) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required.",
      });
    }

    const existingItem = await Cart.findOne({
      user: req.user._id,
      food,
    });

    if (existingItem) {

      existingItem.quantity += quantity || 1;

      await existingItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated.",
        cart: existingItem,
      });
    }

    const cart = await Cart.create({
      user: req.user._id,
      food,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: "Added to cart.",
      cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ============================
// Get My Cart
// ============================
const getCart = async (req, res) => {
  try {

    const cart = await Cart.find({
      user: req.user._id,
    }).populate("food");

    res.status(200).json({
      success: true,
      count: cart.length,
      cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ============================
// Update Quantity
// ============================
const updateCart = async (req, res) => {
  try {

    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!cart) {

      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });

    }

    res.status(200).json({
      success: true,
      message: "Cart updated.",
      cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ============================
// Remove Item
// ============================
const removeFromCart = async (req, res) => {
  try {

    const cart = await Cart.findByIdAndDelete(req.params.id);

    if (!cart) {

      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });

    }

    res.status(200).json({
      success: true,
      message: "Item removed.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ============================
// Clear Cart
// ============================
const clearCart = async (req, res) => {
  try {

    await Cart.deleteMany({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
};