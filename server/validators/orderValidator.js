const Joi = require("joi");
const { objectId } = require("../middleware/validate");

const placeOrderSchema = Joi.object({
  restaurant: objectId.required(),
  foods: Joi.array()
    .items(
      Joi.object({
        food: objectId.required(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().min(0),
  deliveryAddress: Joi.string().trim().min(3).max(300).required(),
  paymentMethod: Joi.string().valid("Cash", "eSewa", "Khalti").default("Cash"),
  couponCode: Joi.string().trim().uppercase().allow(""),
});

const updateOrderStatusSchema = Joi.object({
  orderStatus: Joi.string()
    .valid("Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled")
    .required(),
});

module.exports = { placeOrderSchema, updateOrderStatusSchema };
