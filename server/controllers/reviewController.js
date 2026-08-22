const Review = require("../models/Review");
const Food = require("../models/Food");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

/**
 * Recalculate and persist the average rating + review count on the Food doc.
 */
const recalcFoodRating = async (foodId) => {
  const stats = await Review.aggregate([
    { $match: { food: foodId } },
    {
      $group: {
        _id: "$food",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  await Food.findByIdAndUpdate(foodId, {
    rating: stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0,
    totalReviews: stats.length > 0 ? stats[0].count : 0,
  });
};

// =========================
// Add Review
// =========================
const addReview = asyncHandler(async (req, res) => {
  const { food, rating, comment } = req.body;

  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    food,
  });

  if (alreadyReviewed) {
    throw new ErrorResponse("You already reviewed this food.", 400);
  }

  const review = await Review.create({
    user: req.user._id,
    food,
    rating,
    comment,
  });

  await recalcFoodRating(food);

  res.status(201).json({
    success: true,
    message: "Review added successfully.",
    review,
  });
});

// =========================
// Get Reviews By Food
// =========================
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    food: req.params.foodId,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    total: reviews.length,
    reviews,
  });
});

// =========================
// Delete Review
// =========================
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ErrorResponse("Review not found.", 404);
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw new ErrorResponse("Not authorized.", 403);
  }

  const foodId = review.food;
  await review.deleteOne();

  await recalcFoodRating(foodId);

  res.status(200).json({
    success: true,
    message: "Review deleted.",
  });
});

module.exports = {
  addReview,
  getReviews,
  deleteReview,
};
