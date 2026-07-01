const Review = require("../models/Review");

// =========================
// Add Review
// =========================

const addReview = async (req, res) => {
  try {

    const { food, rating, comment } = req.body;

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      food,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this food.",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      food,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully.",
      review,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// Get Reviews By Food
// =========================

const getReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      food: req.params.foodId,
    }).populate("user", "name");

    res.status(200).json({
      success: true,
      total: reviews.length,
      reviews,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =========================
// Delete Review
// =========================

const deleteReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  addReview,
  getReviews,
  deleteReview,
};