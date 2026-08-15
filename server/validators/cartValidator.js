const Joi = require("joi");
const { objectId } = require("../middleware/validate");

const addToCartSchema = Joi.object({
  food: objectId.required(),
  quantity: Joi.number().integer().min(1).default(1),
});

const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().min(1),
}).min(1);

module.exports = { addToCartSchema, updateCartSchema };
