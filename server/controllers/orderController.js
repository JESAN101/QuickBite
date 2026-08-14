const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Food = require("../models/Food");
const Coupon = require("../models/Coupon");
const {
  validateCouponLogic,
} = require("./couponController");

// ==========================================
// Place Order
// ==========================================
const placeOrder = async (req, res) => {
  try {
    const {
      restaurant,
      foods,
      deliveryAddress,
      paymentMethod,
      couponCode,
    } = req.body;

    if (
      !restaurant ||
      !foods ||
      foods.length === 0 ||
      !deliveryAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Logged-in User Orders
// ==========================================
const getMyOrders = async (req, res) => {
  try {

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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Single Order
// ==========================================
const getOrder = async (req, res) => {
  try {

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

    res.status(200).json({
      success: true,
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
// Get All Orders (Admin Only)
// ==========================================
const getAllOrders = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only.",
      });
    }

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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Update Order Status 
// ==========================================
const updateOrderStatus = async (req, res) => {
  try {
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

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Delete Order (Admin Only)
// ==========================================
const deleteOrder = async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only.",
      });
    }

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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};