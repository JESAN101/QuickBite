const mongoose = require("mongoose");

const roleRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestedRole: {
      type: String,
      enum: ["rider", "restaurant"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // ----- Rider application fields -----
    vehicleType: {
      type: String,
      default: "",
    },

    vehicleNumber: {
      type: String,
      default: "",
    },

    licenseNumber: {
      type: String,
      default: "",
    },

    experienceYears: {
      type: Number,
      default: 0,
    },

    // ----- Restaurant application fields -----
    ownerName: {
      type: String,
      default: "",
    },

    ownerEmail: {
      type: String,
      default: "",
    },

    ownerPhone: {
      type: String,
      default: "",
    },

    restaurantName: {
      type: String,
      default: "",
    },

    restaurantDescription: {
      type: String,
      default: "",
    },

    restaurantAddress: {
      type: String,
      default: "",
    },

    restaurantPhone: {
      type: String,
      default: "",
    },

    restaurantEmail: {
      type: String,
      default: "",
    },

    cuisineType: {
      type: String,
      default: "",
    },

    openingTime: {
      type: String,
      default: "",
    },

    closingTime: {
      type: String,
      default: "",
    },

    estimatedDeliveryTime: {
      type: String,
      default: "",
    },

    licenseNumber: {
      type: String,
      default: "",
    },

    restaurantImage: {
      type: String,
      default: "",
    },

    // Note added by the admin when reviewing
    adminNote: {
      type: String,
      default: "",
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RoleRequest", roleRequestSchema);
