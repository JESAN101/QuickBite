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
