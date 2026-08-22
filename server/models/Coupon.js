const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    // Coupon Code (e.g. "SAVE10")
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // Discount Type
    // percentage -> X% off  |  flat -> Rs. X off
    type: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },

    // Discount Value
    value: {
      type: Number,
      required: true,
      min: 0,
    },

    // Minimum order subtotal required to use this coupon
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Max discount cap (only used for percentage coupons; 0 = no cap)
    maxDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total number of times the coupon can be used (0 = unlimited)
    usageLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    // How many times the coupon has been used so far
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Whether the coupon can be used right now
    isActive: {
      type: Boolean,
      default: true,
    },

    // Expiry date (null = never expires)
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Coupon", couponSchema);
