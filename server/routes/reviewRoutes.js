const express = require("express");

const {
  addReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addReview);

router.get("/:foodId", getReviews);

router.delete("/delete/:id", authMiddleware, deleteReview);

module.exports = router;