const express = require("express");

const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../controllers/favoriteController");

const authMiddleware = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const {
  addFavoriteSchema,
} = require("../validators/favoriteValidator");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  validate(addFavoriteSchema),
  addFavorite
);

router.get("/all", authMiddleware, getFavorites);

router.delete("/remove/:id", authMiddleware, removeFavorite);

module.exports = router;
