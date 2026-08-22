const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// ==========================================
// Rider: Get Orders Available For Pickup
// ==========================================
const getAvailableOrders = asyncHandler(async (req, res) => {
  // Orders the restaurant marked as "Out for Delivery"
  // that no rider has claimed yet
  const orders = await Order.find({
    orderStatus: "Out for Delivery",
    rider: null,
  })
    .sort({ createdAt: 1 })
    .populate("user", "name phone")
    .populate("restaurant", "name address phone")
    .populate("coupon")
    .populate("foods.food");

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// ==========================================
// Rider: Get My Deliveries
// ==========================================
const getMyDeliveries = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    rider: req.user._id,
  })
    .sort({ createdAt: -1 })
    .populate("user", "name phone")
    .populate("restaurant", "name address phone")
    .populate("coupon")
    .populate("foods.food");

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// ==========================================
// Rider: Accept A Delivery
// ==========================================
const acceptDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ErrorResponse("Order not found.", 404);
  }

  if (order.orderStatus !== "Out for Delivery") {
    throw new ErrorResponse("This order is not ready for pickup.", 400);
  }

  if (order.rider) {
    throw new ErrorResponse(
      "This order has already been taken by another rider.",
      400,
    );
  }

  order.rider = req.user._id;

  await order.save();

  // Emit real-time update to the customer's room
  try {
    const { getIO } = require("../config/socket");
    getIO()
      .to(order.user.toString())
      .emit("order:status", {
        orderId: order._id,
        status: order.orderStatus,
        rider: { name: req.user.name },
      });
  } catch (_) {}

  res.status(200).json({
    success: true,
    message: "Delivery accepted. Collect the order and deliver it.",
    order,
  });
});

// ==========================================
// Rider: Complete Delivery
// ==========================================
const completeDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ErrorResponse("Order not found.", 404);
  }

  // Only the assigned rider can complete this delivery
  if (!order.rider || order.rider.toString() !== req.user._id.toString()) {
    throw new ErrorResponse("This delivery is not assigned to you.", 403);
  }

  order.orderStatus = "Delivered";

  await order.save();

  // Emit real-time update to the customer's room
  try {
    const { getIO } = require("../config/socket");
    getIO().to(order.user.toString()).emit("order:status", {
      orderId: order._id,
      status: order.orderStatus,
    });
  } catch (_) {}

  res.status(200).json({
    success: true,
    message: "Delivery completed successfully.",
    order,
  });
});

// ==========================================
// Rider: Dashboard Stats
// ==========================================
const getRiderStats = asyncHandler(async (req, res) => {
  const myId = req.user._id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [totalDeliveries, activeDeliveries, todayDeliveries, availableCount] =
    await Promise.all([
      Order.countDocuments({
        rider: myId,
        orderStatus: "Delivered",
      }),
      Order.countDocuments({
        rider: myId,
        orderStatus: "Out for Delivery",
      }),
      Order.countDocuments({
        rider: myId,
        orderStatus: "Delivered",
        createdAt: { $gte: startOfDay },
      }),
      Order.countDocuments({
        orderStatus: "Out for Delivery",
        rider: null,
      }),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalDeliveries,
      activeDeliveries,
      todayDeliveries,
      availableCount,
    },
  });
});

module.exports = {
  getAvailableOrders,
  getMyDeliveries,
  acceptDelivery,
  completeDelivery,
  getRiderStats,
};
