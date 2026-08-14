const Order = require("../models/Order");

// ==========================================
// Rider: Get Orders Available For Pickup
// ==========================================
const getAvailableOrders = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Rider: Get My Deliveries
// ==========================================
const getMyDeliveries = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Rider: Accept A Delivery
// ==========================================
const acceptDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.orderStatus !== "Out for Delivery") {
      return res.status(400).json({
        success: false,
        message: "This order is not ready for pickup.",
      });
    }

    if (order.rider) {
      return res.status(400).json({
        success: false,
        message: "This order has already been taken by another rider.",
      });
    }

    order.rider = req.user._id;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Delivery accepted. Collect the order and deliver it.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Rider: Complete Delivery
// ==========================================
const completeDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Only the assigned rider can complete this delivery
    if (!order.rider || order.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "This delivery is not assigned to you.",
      });
    }

    order.orderStatus = "Delivered";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Delivery completed successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Rider: Dashboard Stats
// ==========================================
const getRiderStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAvailableOrders,
  getMyDeliveries,
  acceptDelivery,
  completeDelivery,
  getRiderStats,
};
