const Coupon = require("../models/Coupon");

// ==========================================
// Shared: Compute Discount Amount
// ==========================================
const calculateDiscount = (coupon, subtotal) => {
  let discount = 0;

  if (coupon.type === "flat") {
    // Never discount below the subtotal
    discount = Math.min(coupon.value, subtotal);
  } else {
    discount = (subtotal * coupon.value) / 100;

    // Apply the max discount cap for percentage coupons
    if (coupon.maxDiscount > 0) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  }

  return Math.round(discount * 100) / 100;
};

// ==========================================
// Shared: Validate Coupon
// ==========================================
const validateCouponLogic = (coupon, subtotal) => {
  if (!coupon) {
    return { valid: false, message: "Invalid coupon code." };
  }

  if (!coupon.isActive) {
    return {
      valid: false,
      message: "This coupon is no longer active.",
    };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, message: "This coupon has expired." };
  }

  if (
    coupon.usageLimit > 0 &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    return {
      valid: false,
      message: "This coupon has reached its usage limit.",
    };
  }

  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount is Rs. ${coupon.minOrderAmount} for this coupon.`,
    };
  }

  const discount = calculateDiscount(coupon, subtotal);

  if (discount <= 0) {
    return {
      valid: false,
      message: "No discount available with this coupon.",
    };
  }

  return {
    valid: true,
    discount,
    message: "Coupon applied successfully.",
    coupon,
  };
};

// ==========================================
// Create Coupon (Admin)
// ==========================================
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      isActive,
      expiresAt,
    } = req.body;

    if (!code || !type || value === undefined || value < 0) {
      return res.status(400).json({
        success: false,
        message: "Code, type and a valid value are required.",
      });
    }

    if (!["percentage", "flat"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be 'percentage' or 'flat'.",
      });
    }

    const coupon = await Coupon.create({
      code,
      type,
      value,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount: maxDiscount || 0,
      usageLimit: usageLimit || 0,
      isActive: isActive ?? true,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      coupon,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This coupon code already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get All Coupons (Admin)
// ==========================================
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Active Coupons (Public)
// ==========================================
const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      $or: [
        { expiresAt: { $eq: null } },
        { expiresAt: { $gt: new Date() } },
      ],
    })
      .sort({ createdAt: -1 })
      .select("code type value minOrderAmount maxDiscount expiresAt");

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Single Coupon (Admin)
// ==========================================
const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Validate Coupon (Customer)
// ==========================================
const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Please enter a coupon code.",
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
    });

    const result = validateCouponLogic(coupon, subtotal || 0);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      discount: result.discount,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Update Coupon (Admin)
// ==========================================
const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      isActive,
      expiresAt,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    coupon.code = code || coupon.code;
    coupon.type = type || coupon.type;
    coupon.value = value ?? coupon.value;
    coupon.minOrderAmount = minOrderAmount ?? coupon.minOrderAmount;
    coupon.maxDiscount = maxDiscount ?? coupon.maxDiscount;
    coupon.usageLimit = usageLimit ?? coupon.usageLimit;
    coupon.isActive = isActive ?? coupon.isActive;
    coupon.expiresAt = expiresAt || null;

    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      coupon,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This coupon code already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Delete Coupon (Admin)
// ==========================================
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  calculateDiscount,
  validateCouponLogic,
};
