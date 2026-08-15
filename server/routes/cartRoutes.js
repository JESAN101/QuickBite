const express = require("express");

const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const {
  addToCartSchema,
  updateCartSchema,
} = require("../validators/cartValidator");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  validate(addToCartSchema),
  addToCart
);

router.get("/", authMiddleware, getCart);

router.put(
  "/update/:id",
  authMiddleware,
  validate(updateCartSchema),
  updateCart
);

router.delete("/delete/:id", authMiddleware, removeFromCart);

router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
