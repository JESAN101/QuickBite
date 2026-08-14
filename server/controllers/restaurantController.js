const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");
const Order = require("../models/Order");

// =============================
// Create Restaurant (Admin)
// =============================
const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, phone, owner } = req.body;

    const image = req.file ? req.file.filename : "";

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
      // Admin can assign an owner; otherwise the creator becomes the owner
      owner: owner || req.user._id,
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
// Update Restaurant (Admin)
// =============================
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    if (req.file) {
      req.body.image = req.file.filename;
    }

    const updatedRestaurant =
      await Restaurant.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully.",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Restaurant (Admin)
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

// ==========================================
// Owner: Get My Restaurant
// ==========================================
const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(
      req.restaurant._id
    ).populate("owner", "name email");

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

// ==========================================
// Owner: Update My Restaurant
// ==========================================
const updateMyRestaurant = async (req, res) => {
  try {
    const { name, description, address, phone, isOpen } = req.body;

    const restaurant = req.restaurant;

    restaurant.name = name || restaurant.name;
    restaurant.description =
      description || restaurant.description;
    restaurant.address = address || restaurant.address;
    restaurant.phone = phone || restaurant.phone;
    restaurant.isOpen = isOpen !== undefined ? isOpen : restaurant.isOpen;

    if (req.file) {
      restaurant.image = req.file.filename;
    }

    await restaurant.save();

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

// ==========================================
// Owner: Get My Orders
// ==========================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      restaurant: req.restaurant._id,
    })
      .sort({ createdAt: -1 })
      .populate("user", "name email phone")
      .populate("coupon")
      .populate("rider", "name phone")
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
// Owner: Update My Order Status
// ==========================================
const updateMyOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Owners can only update orders belonging to their restaurant
    if (
      order.restaurant.toString() !==
      req.restaurant._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This order does not belong to your restaurant.",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
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
// Owner: Get My Foods
// ==========================================
const getMyFoods = async (req, res) => {
  try {
    const foods = await Food.find({
      restaurant: req.restaurant._id,
    })
      .sort({ createdAt: -1 })
      .populate("category", "name");

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Owner: Create Food For My Restaurant
// ==========================================
const createMyFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      preparationTime,
      isAvailable,
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const image = req.file ? req.file.filename : "";

    const food = await Food.create({
      name,
      description,
      price,
      category,
      restaurant: req.restaurant._id,
      image,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      preparationTime: preparationTime || 20,
    });

    res.status(201).json({
      success: true,
      message: "Food added successfully.",
      food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Owner: Update My Food
// ==========================================
const updateMyFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found.",
      });
    }

    // Owners can only edit foods belonging to their restaurant
    if (
      food.restaurant.toString() !==
      req.restaurant._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This food does not belong to your restaurant.",
      });
    }

    const {
      name,
      description,
      price,
      category,
      preparationTime,
      isAvailable,
    } = req.body;

    food.name = name || food.name;
    food.description = description || food.description;
    food.price = price !== undefined ? price : food.price;
    food.category = category || food.category;
    food.preparationTime =
      preparationTime || food.preparationTime;
    food.isAvailable =
      isAvailable !== undefined ? isAvailable : food.isAvailable;

    if (req.file) {
      food.image = req.file.filename;
    }

    await food.save();

    res.status(200).json({
      success: true,
      message: "Food updated successfully.",
      food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Owner: Delete My Food
// ==========================================
const deleteMyFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found.",
      });
    }

    if (
      food.restaurant.toString() !==
      req.restaurant._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This food does not belong to your restaurant.",
      });
    }

    await food.deleteOne();

    res.status(200).json({
      success: true,
      message: "Food deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Owner: Dashboard Stats
// ==========================================
const getMyStats = async (req, res) => {
  try {
    const myId = req.restaurant._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [totalOrders, pendingOrders, preparingOrders, deliveredOrders, todayOrders, totalFoods, revenueAgg] =
      await Promise.all([
        Order.countDocuments({ restaurant: myId }),
        Order.countDocuments({ restaurant: myId, orderStatus: "Pending" }),
        Order.countDocuments({ restaurant: myId, orderStatus: "Preparing" }),
        Order.countDocuments({ restaurant: myId, orderStatus: "Delivered" }),
        Order.countDocuments({
          restaurant: myId,
          createdAt: { $gte: startOfDay },
        }),
        Food.countDocuments({ restaurant: myId }),
        Order.aggregate([
          {
            $match: {
              restaurant: myId,
              orderStatus: "Delivered",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalPrice" },
            },
          },
        ]),
      ]);

    const totalRevenue =
      revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        preparingOrders,
        deliveredOrders,
        todayOrders,
        totalFoods,
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
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyOrders,
  updateMyOrderStatus,
  getMyFoods,
  createMyFood,
  updateMyFood,
  deleteMyFood,
  getMyStats,
};
