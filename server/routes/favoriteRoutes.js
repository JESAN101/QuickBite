const express = require("express");

const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../controllers/favoriteController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addFavorite);

router.get("/all", authMiddleware, getFavorites);

router.delete("/remove/:id", authMiddleware, removeFavorite);

module.exports = router;