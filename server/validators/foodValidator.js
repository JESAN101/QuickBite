const Joi = require("joi");
const { objectId } = require("../middleware/validate");

const createFoodSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(3).max(1000).required(),
  price: Joi.number().min(0).required(),
  category: objectId.required(),
  restaurant: objectId.allow(null, ""),
  preparationTime: Joi.number().integer().min(1).default(20),
  isAvailable: Joi.boolean().default(true),
});

const updateFoodSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().min(3).max(1000),
  price: Joi.number().min(0),
  category: objectId,
  restaurant: objectId.allow(null, ""),
  preparationTime: Joi.number().integer().min(1),
  isAvailable: Joi.boolean(),
}).min(1);

module.exports = { createFoodSchema, updateFoodSchema };
