const User = require("../models/User");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const Order = require("../models/Order");

// =====================================
// Dashboard Statistics
// =====================================
const getDashboardStats = async (req, res) => {
  try {
    // Count documents
    const totalUsers = await User.countDocuments();

    const totalFoods = await Food.countDocuments();

    const totalRestaurants =
      await Restaurant.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    // Order status counts
    const pendingOrders =
      await Order.countDocuments({
        orderStatus: "Pending",
      });

    const preparingOrders =
      await Order.countDocuments({
        orderStatus: "Preparing",
      });

    const outForDeliveryOrders =
      await Order.countDocuments({
        orderStatus: "Out for Delivery",
      });

    const completedOrders =
      await Order.countDocuments({
        orderStatus: "Delivered",
      });

    const cancelledOrders =
      await Order.countDocuments({
        orderStatus: "Cancelled",
      });

    // Total Revenue
    const revenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue =
      revenue.length > 0
        ? revenue[0].totalRevenue
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFoods,
        totalRestaurants,
        totalOrders,

        pendingOrders,
        preparingOrders,
        outForDeliveryOrders,
        completedOrders,
        cancelledOrders,

        totalRevenue,
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
  getDashboardStats,
};