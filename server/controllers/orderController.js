const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Food = require("../models/Food");
const Coupon = require("../models/Coupon");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const { validateCouponLogic } = require("./couponController");
const asyncHandler = require("../utils/asyncHandler");
const { isRestaurantOpenNow, formatHours } = require("../utils/openingHours");
const {
  sendOrderPlacedEmail,
  sendOrderStatusEmail,
} = require("../utils/mailer");
const { parsePagination, escapeRegex } = require("../utils/pagination");

// Time (in minutes) customers can cancel their own
// order after placing it. Configurable via env.
const cancellationWindowMinutes = () =>
  Math.max(0, parseInt(process.env.ORDER_CANCELLATION_WINDOW_MINUTES, 10) || 5);

// ==========================================
// Place Order
// ==========================================
const placeOrder = asyncHandler(async (req, res) => {
  const {
    restaurant: restaurantId,
    foods,
    deliveryAddress,
    paymentMethod,
    couponCode,
  } = req.body;

  // The restaurant must exist and be accepting orders
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found.",
    });
  }

  if (!isRestaurantOpenNow(restaurant)) {
    const hours = formatHours(restaurant);

    return res.status(400).json({
      success: false,
      message: `This restaurant is currently closed.${
        hours ? ` Opening hours: ${hours}.` : ""
      } Please try again when it reopens.`,
    });
  }

  // Load foods from the database to compute the authoritative subtotal
  const foodIds = foods.map((item) => item.food);
  const foodDocs = await Food.find({
    _id: { $in: foodIds },
  });

  const foodMap = new Map(foodDocs.map((food) => [food._id.toString(), food]));

  let subtotal = 0;

  for (const item of foods) {
    const food = foodMap.get(item.food.toString());

    if (!food) {
      return res.status(400).json({
        success: false,
        message: "One or more foods in your cart are invalid.",
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

    const result = validateCouponLogic(foundCoupon, subtotal);

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

  // Fire-and-forget confirmation email (never blocks the response)
  sendOrderPlacedEmail(order._id).catch((error) =>
    console.error("[mailer] order placement email failed:", error),
  );

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
    .sort({ createdAt: -1 })
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
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }
  }

  // Client uses this to show/hide the cancel button
  const cancelDeadline =
    new Date(order.createdAt).getTime() +
    cancellationWindowMinutes() * 60 * 1000;

  res.status(200).json({
    success: true,
    order,
    cancellationWindowMinutes: cancellationWindowMinutes(),
    cancelDeadline,
  });
});

// ==========================================
// Cancel My Order (Customer)
// Allowed only within the configurable window
// after the order was placed, and only while
// the order is still "Pending".
// ==========================================
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You can only cancel your own orders.",
    });
  }

  const elapsedMinutes =
    (Date.now() - new Date(order.createdAt).getTime()) / 60000;

  if (elapsedMinutes > cancellationWindowMinutes()) {
    return res.status(400).json({
      success: false,
      message: `The ${cancellationWindowMinutes()}-minute cancellation window has passed.`,
    });
  }

  if (order.orderStatus !== "Pending") {
    return res.status(400).json({
      success: false,
      message:
        "This order has already been processed and can no longer be cancelled.",
    });
  }

  order.orderStatus = "Cancelled";
  await order.save();

  // Emit real-time update to the customer's room
  try {
    const { getIO } = require("../config/socket");
    getIO().to(order.user.toString()).emit("order:status", {
      orderId: order._id,
      status: order.orderStatus,
    });
  } catch (_) {}

  // Fire-and-forget status-change email
  sendOrderStatusEmail(order._id).catch((error) =>
    console.error("[mailer] cancellation email failed:", error),
  );

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully.",
    order,
  });
});

// ==========================================
// Get All Orders (Admin Only, Paginated)
// ==========================================
const getAllOrders = asyncHandler(async (req, res) => {
  const { page } = parsePagination(req.query);
  const limitParam = req.query.limit;
  const limit =
    limitParam !== undefined
      ? Math.max(1, Math.min(parseInt(limitParam, 10) || 10, 100))
      : undefined;
  const search = (req.query.search || "").trim();
  const skip = limit ? (page - 1) * limit : 0;

  // Build the filter, including a text search on
  // customer name/email or restaurant name.
  const filter = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");

    const [matchingUsers, matchingRestaurants] = await Promise.all([
      User.find({
        $or: [{ name: regex }, { email: regex }],
      }).select("_id"),
      Restaurant.find({ name: regex }).select("_id"),
    ]);

    filter.$or = [
      { user: { $in: matchingUsers.map((u) => u._id) } },
      {
        restaurant: {
          $in: matchingRestaurants.map((r) => r._id),
        },
      },
    ];
  }

  const [total, orders, stats] = await Promise.all([
    Order.countDocuments(filter),
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email phone")
      .populate("restaurant", "name")
      .populate("coupon")
      .populate("rider", "name phone")
      .populate("foods.food"),
    Order.aggregate([
      { $match: filter },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]),
  ]);

  const revenueAgg = await Order.aggregate([
    { $match: { ...filter, orderStatus: "Delivered" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const statusCounts = stats.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    total,
    page,
    pages: limit ? Math.max(1, Math.ceil(total / limit)) : 1,
    orders,
    stats: {
      totalOrders: total,
      pendingOrders: statusCounts["Pending"] || 0,
      preparingOrders: statusCounts["Preparing"] || 0,
      deliveredOrders: statusCounts["Delivered"] || 0,
      totalRevenue: revenueAgg.length > 0 ? revenueAgg[0].total : 0,
    },
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

  const { getIO } = require("../config/socket");

  order.orderStatus = orderStatus;

  await order.save();

  // Emit real-time update to the customer's room
  try {
    getIO().to(order.user.toString()).emit("order:status", {
      orderId: order._id,
      status: order.orderStatus,
    });
  } catch (_) {}

  // Fire-and-forget status-change email
  sendOrderStatusEmail(order._id).catch((error) =>
    console.error("[mailer] status-change email failed:", error),
  );

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
  const order = await Order.findByIdAndDelete(req.params.id);

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
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
