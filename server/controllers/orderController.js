const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Food = require("../models/Food");
const Coupon = require("../models/Coupon");
const {
  validateCouponLogic,
} = require("./couponController");
const asyncHandler = require("../utils/asyncHandler");

// ==========================================
// Place Order
// ==========================================
const placeOrder = asyncHandler(async (req, res) => {
  const {
    restaurant,
    foods,
    deliveryAddress,
    paymentMethod,
    couponCode,
  } = req.body;

  // Load foods from the database to compute the authoritative subtotal
  const foodIds = foods.map((item) => item.food);
  const foodDocs = await Food.find({
    _id: { $in: foodIds },
  });

  const foodMap = new Map(
    foodDocs.map((food) => [
      food._id.toString(),
      food,
    ])
  );

  let subtotal = 0;

  for (const item of foods) {
    const food = foodMap.get(item.food.toString());

    if (!food) {
      return res.status(400).json({
        success: false,
        message:
          "One or more foods in your cart are invalid.",
      });
    }

    subtotal += food.price * item.quantity;
  }

  // Delivery fee (same rule as the checkout page)
  const deliveryFee = subtotal > 1000 ? 0 : 100;

  // Apply coupon (validated server-side)
  let discount = 0;
  let coupon = null;

  if (couponCode) {
    const foundCoupon = await Coupon.findOne({
      code: couponCode.toUpperCase().trim(),
    });

    const result = validateCouponLogic(
      foundCoupon,
      subtotal
    );

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    discount = result.discount;
    coupon = foundCoupon;
  }

  const totalPrice = subtotal + deliveryFee - discount;

  const order = await Order.create({
    user: req.user._id,
    restaurant,
    foods,
    totalPrice,
    coupon: coupon ? coupon._id : null,
    discount,
    deliveryAddress,
    paymentMethod,
  });

  // Increment coupon usage
  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }

  // Clear user's cart
  await Cart.deleteMany({
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully.",
    order,
  });
});

// ==========================================
// Get Logged-in User Orders
// ==========================================
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  })
    .populate("restaurant")
    .populate("coupon")
    .populate("rider", "name phone")
    .populate("foods.food");

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// ==========================================
// Get Single Order
// ==========================================
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user")
    .populate("restaurant")
    .populate("coupon")
    .populate("rider", "name phone")
    .populate("foods.food");

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  // Admin can view any order
  if (req.user.role !== "admin") {
    // Customer can only view their own order
    if (
      order.user._id.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// ==========================================
// Get All Orders (Admin Only)
// ==========================================
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .populate("restaurant")
    .populate("coupon")
    .populate("rider", "name phone")
    .populate("foods.food");

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// ==========================================
// Update Order Status
// ==========================================
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  order.orderStatus = orderStatus;

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order updated successfully.",
    order,
  });
});

// ==========================================
// Delete Order (Admin Only)
// ==========================================
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(
    req.params.id
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Order deleted successfully.",
  });
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
