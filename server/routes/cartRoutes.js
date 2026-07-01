const express = require("express");

const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addToCart);

router.get("/", authMiddleware, getCart);

router.put("/update/:id", authMiddleware, updateCart);

router.delete("/delete/:id", authMiddleware, removeFromCart);

router.delete("/clear", authMiddleware, clearCart);

module.exports = router;