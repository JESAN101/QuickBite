const express = require("express");

const {
  addReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { addReviewSchema } = require("../validators/reviewValidator");

const router = express.Router();

router.post("/add", authMiddleware, validate(addReviewSchema), addReview);

router.get("/:foodId", getReviews);

router.delete("/delete/:id", authMiddleware, deleteReview);

module.exports = router;
