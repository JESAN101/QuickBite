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

// =====================================
// Analytics Data (Charts)
// =====================================
const getAnalytics = async (req, res) => {
  try {
    // Date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Revenue last 7 days (delivered orders only)
    const revenueByDay = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Orders last 7 days (all statuses)
    const ordersByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Orders by status (all time, for doughnut chart)
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Top 5 selling foods
    const topFoods = await Order.aggregate([
      { $unwind: "$foods" },
      {
        $group: {
          _id: "$foods.food",
          totalQuantity: { $sum: "$foods.quantity" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "foods",
          localField: "_id",
          foreignField: "_id",
          as: "foodInfo",
        },
      },
      { $unwind: "$foodInfo" },
      {
        $project: {
          name: "$foodInfo.name",
          totalQuantity: 1,
          totalOrders: 1,
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    // Fill in missing days with zero values for the 7-day charts
    const fillDays = (data, valueKey) => {
      const result = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        const found = data.find((item) => item._id === dateStr);
        result.push({
          date: dateStr,
          [valueKey]: found ? found[valueKey] : 0,
        });
      }
      return result;
    };

    const revenueLast7Days = fillDays(revenueByDay, "revenue");
    const ordersLast7Days = fillDays(ordersByDay, "count");

    res.status(200).json({
      success: true,
      analytics: {
        revenueLast7Days,
        ordersLast7Days,
        ordersByStatus: ordersByStatus.map((s) => ({
          status: s._id,
          count: s.count,
        })),
        topFoods,
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
  getAnalytics,
};