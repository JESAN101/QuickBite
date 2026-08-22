const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    // Food Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Food Description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Food Price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Category References (supports multiple categories per dish)
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // Restaurant Reference
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
    },

    // Food Image
    image: {
      type: String,
      default: "",
    },

    // Availability
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // Average Rating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Number of Reviews
    totalReviews: {
      type: Number,
      default: 0,
    },

    // Preparation Time (minutes)
    preparationTime: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  },
);

// Virtual: backward-compatible singular accessor.
// Old code reading food.category gets the first category.
foodSchema.virtual("category").get(function () {
  return this.categories?.[0] || null;
});

foodSchema.set("toJSON", { virtuals: true });
foodSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Food", foodSchema);
