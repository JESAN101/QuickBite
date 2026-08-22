const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const {
  isRestaurantOpenNow,
} = require("../utils/openingHours");
const {
  sendOrderStatusEmail,
} = require("../utils/mailer");

// =============================
// Create Restaurant (Admin)
// =============================
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, description, address, phone, owner } =
    req.body;

  const image = req.file ? req.file.path : "";

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
});

// =============================
// Get All Restaurants
// =============================
const getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find().populate(
    "owner",
    "name email"
  );

  // Reflect the current open/closed state based on hours
  restaurants.forEach((restaurant) => {
    restaurant.isOpen = isRestaurantOpenNow(restaurant);
  });

  res.status(200).json({
    success: true,
    count: restaurants.length,
    restaurants,
  });
});

// =============================
// Get Single Restaurant
// =============================
const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(
    req.params.id
  ).populate("owner", "name email");

  if (!restaurant) {
    throw new ErrorResponse(
      "Restaurant not found.",
      404
    );
  }

  // Reflect the current open/closed state based on hours
  restaurant.isOpen = isRestaurantOpenNow(restaurant);

  res.status(200).json({
    success: true,
    restaurant,
  });
});

// =============================
// Update Restaurant (Admin)
// =============================
const updateRestaurant = asyncHandler(async (req, res) => {
  let restaurant = await Restaurant.findById(
    req.params.id
  );

  if (!restaurant) {
    throw new ErrorResponse(
      "Restaurant not found.",
      404
    );
  }

  if (req.file) {
    req.body.image = req.file.path;
  }

  restaurant = await Restaurant.findByIdAndUpdate(
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
    restaurant,
  });
});

// =============================
// Delete Restaurant (Admin)
// =============================
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndDelete(
    req.params.id
  );

  if (!restaurant) {
    throw new ErrorResponse(
      "Restaurant not found.",
      404
    );
  }

  res.status(200).json({
    success: true,
    message: "Restaurant deleted successfully.",
  });
});

// ==========================================
// Owner: Get My Restaurant
// ==========================================
const getMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(
    req.restaurant._id
  ).populate("owner", "name email");

  res.status(200).json({
    success: true,
    restaurant,
  });
});

// ==========================================
// Owner: Update My Restaurant
// ==========================================
const updateMyRestaurant = asyncHandler(
  async (req, res) => {
    const {
      name,
      description,
      address,
      phone,
      email,
      cuisineType,
      openingTime,
      closingTime,
      estimatedDeliveryTime,
      licenseNumber,
      isOpen,
    } = req.body;

    const restaurant = req.restaurant;

    if (name) restaurant.name = name;
    if (description !== undefined) restaurant.description = description;
    if (address) restaurant.address = address;
    if (phone) restaurant.phone = phone;
    if (email !== undefined) restaurant.email = email;
    if (cuisineType !== undefined) restaurant.cuisineType = cuisineType;
    if (openingTime !== undefined) restaurant.openingTime = openingTime;
    if (closingTime !== undefined) restaurant.closingTime = closingTime;
    if (estimatedDeliveryTime !== undefined) restaurant.estimatedDeliveryTime = estimatedDeliveryTime;
    if (licenseNumber !== undefined) restaurant.licenseNumber = licenseNumber;
    if (isOpen !== undefined) restaurant.isOpen = isOpen;

    if (req.file) {
      restaurant.image = req.file.path;
    }

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully.",
      restaurant,
    });
  }
);

// ==========================================
// Owner: Get My Orders
// ==========================================
const getMyOrders = asyncHandler(async (req, res) => {
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
});

// ==========================================
// Owner: Update My Order Status
// ==========================================
const updateMyOrderStatus = asyncHandler(
  async (req, res) => {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new ErrorResponse(
        "Order not found.",
        404
      );
    }

    // Owners can only update orders belonging to their restaurant
    if (
      order.restaurant.toString() !==
      req.restaurant._id.toString()
    ) {
      throw new ErrorResponse(
        "This order does not belong to your restaurant.",
        403
      );
    }

    order.orderStatus = orderStatus;

    await order.save();

    // Emit real-time update to the customer's room
    try {
      const { getIO } = require("../config/socket");
      getIO()
        .to(order.user.toString())
        .emit("order:status", {
          orderId: order._id,
          status: order.orderStatus,
        });
    } catch (_) {}

    // Fire-and-forget status-change email
    sendOrderStatusEmail(order._id).catch((error) =>
      console.error(
        "[mailer] status-change email failed:",
        error
      )
    );

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order,
    });
  }
);

// ==========================================
// Owner: Get My Foods
// ==========================================
const getMyFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({
    restaurant: req.restaurant._id,
  })
    .sort({ createdAt: -1 })
    .populate("categories", "name");

  res.status(200).json({
    success: true,
    count: foods.length,
    foods,
  });
});

// ==========================================
// Owner: Create Food For My Restaurant
// ==========================================
const createMyFood = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    categories,
    preparationTime,
    isAvailable,
  } = req.body;

  const image = req.file ? req.file.path : "";

  // Accept both comma-separated string (from FormData) and array
  const categoryIds = typeof categories === "string"
    ? categories.split(",").filter(Boolean)
    : categories || [];

  const food = await Food.create({
    name,
    description,
    price,
    categories: categoryIds,
    restaurant: req.restaurant._id,
    image,
    isAvailable:
      isAvailable !== undefined ? isAvailable : true,
    preparationTime: preparationTime || 20,
  });

  res.status(201).json({
    success: true,
    message: "Food added successfully.",
    food,
  });
});

// ==========================================
// Owner: Update My Food
// ==========================================
const updateMyFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    throw new ErrorResponse("Food not found.", 404);
  }

  // Owners can only edit foods belonging to their restaurant
  if (
    food.restaurant.toString() !==
    req.restaurant._id.toString()
  ) {
    throw new ErrorResponse(
      "This food does not belong to your restaurant.",
      403
    );
  }

  const {
    name,
    description,
    price,
    categories,
    preparationTime,
    isAvailable,
  } = req.body;

  // Accept both comma-separated string (from FormData) and array
  const categoryIds = typeof categories === "string"
    ? categories.split(",").filter(Boolean)
    : categories;

  food.name = name || food.name;
  food.description = description || food.description;
  food.price = price !== undefined ? price : food.price;
  if (categoryIds !== undefined) food.categories = categoryIds;
  food.preparationTime =
    preparationTime || food.preparationTime;
  food.isAvailable =
    isAvailable !== undefined
      ? isAvailable
      : food.isAvailable;

  if (req.file) {
    food.image = req.file.path;
  }

  await food.save();

  res.status(200).json({
    success: true,
    message: "Food updated successfully.",
    food,
  });
});

// ==========================================
// Owner: Delete My Food
// ==========================================
const deleteMyFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    throw new ErrorResponse("Food not found.", 404);
  }

  if (
    food.restaurant.toString() !==
    req.restaurant._id.toString()
  ) {
    throw new ErrorResponse(
      "This food does not belong to your restaurant.",
      403
    );
  }

  await food.deleteOne();

  res.status(200).json({
    success: true,
    message: "Food deleted successfully.",
  });
});

// ==========================================
// Owner: Dashboard Stats
// ==========================================
const getMyStats = asyncHandler(async (req, res) => {
  const myId = req.restaurant._id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    pendingOrders,
    preparingOrders,
    deliveredOrders,
    todayOrders,
    totalFoods,
    revenueAgg,
  ] = await Promise.all([
    Order.countDocuments({ restaurant: myId }),
    Order.countDocuments({
      restaurant: myId,
      orderStatus: "Pending",
    }),
    Order.countDocuments({
      restaurant: myId,
      orderStatus: "Preparing",
    }),
    Order.countDocuments({
      restaurant: myId,
      orderStatus: "Delivered",
    }),
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
});

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
