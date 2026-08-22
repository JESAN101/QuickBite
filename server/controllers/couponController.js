const Coupon = require("../models/Coupon");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// ==========================================
// Shared: Compute Discount Amount
// ==========================================
const calculateDiscount = (coupon, subtotal) => {
  let discount = 0;

  if (coupon.type === "flat") {
    discount = Math.min(coupon.value, subtotal);
  } else {
    discount = (subtotal * coupon.value) / 100;

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

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
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
const createCoupon = asyncHandler(async (req, res) => {
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

  const coupon = await Coupon.create({
    code: code.toUpperCase().trim(),
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
});

// ==========================================
// Get All Coupons (Admin)
// ==========================================
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: coupons.length,
    coupons,
  });
});

// ==========================================
// Get Active Coupons (Public)
// ==========================================
const getActiveCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({
    isActive: true,
    $or: [{ expiresAt: { $eq: null } }, { expiresAt: { $gt: new Date() } }],
  })
    .sort({ createdAt: -1 })
    .select("code type value minOrderAmount maxDiscount expiresAt");

  res.status(200).json({
    success: true,
    coupons,
  });
});

// ==========================================
// Get Single Coupon (Admin)
// ==========================================
const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ErrorResponse("Coupon not found.", 404);
  }

  res.status(200).json({
    success: true,
    coupon,
  });
});

// ==========================================
// Validate Coupon (Customer)
// ==========================================
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

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
});

// ==========================================
// Update Coupon (Admin)
// ==========================================
const updateCoupon = asyncHandler(async (req, res) => {
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
    throw new ErrorResponse("Coupon not found.", 404);
  }

  coupon.code = code ? code.toUpperCase().trim() : coupon.code;
  coupon.type = type || coupon.type;
  coupon.value = value ?? coupon.value;
  coupon.minOrderAmount = minOrderAmount ?? coupon.minOrderAmount;
  coupon.maxDiscount = maxDiscount ?? coupon.maxDiscount;
  coupon.usageLimit = usageLimit ?? coupon.usageLimit;
  coupon.isActive = isActive ?? coupon.isActive;
  coupon.expiresAt = expiresAt ?? coupon.expiresAt;

  await coupon.save();

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully.",
    coupon,
  });
});

// ==========================================
// Delete Coupon (Admin)
// ==========================================
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    throw new ErrorResponse("Coupon not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully.",
  });
});

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
