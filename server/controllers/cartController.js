const Cart = require("../models/Cart");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// ============================
// Add To Cart
// ============================
const addToCart = asyncHandler(async (req, res) => {
  const { food, quantity } = req.body;

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
    quantity: quantity || 1,
  });

  res.status(201).json({
    success: true,
    message: "Added to cart.",
    cart,
  });
});

// ============================
// Get My Cart
// ============================
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.find({
    user: req.user._id,
  }).populate({
    path: "food",
    populate: [
      {
        path: "restaurant",
        select: "name",
      },
      {
        path: "categories",
        select: "name",
      },
    ],
  });

  res.status(200).json({
    success: true,
    count: cart.length,
    cart,
  });
});

// ============================
// Update Quantity
// ============================
const updateCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
  });

  if (!cart) {
    throw new ErrorResponse("Cart item not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Cart updated.",
    cart,
  });
});

// ============================
// Remove Item
// ============================
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);

  if (!cart) {
    throw new ErrorResponse("Item not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Item removed.",
  });
});

// ============================
// Clear Cart
// ============================
const clearCart = asyncHandler(async (req, res) => {
  await Cart.deleteMany({
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Cart cleared.",
  });
});

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
};
