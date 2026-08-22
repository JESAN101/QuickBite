const Joi = require("joi");
const { objectId } = require("../middleware/validate");

const createFoodSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(3).max(1000).required(),
  price: Joi.number().min(0).required(),
  // Accept an array OR a comma-separated string (from FormData)
  categories: Joi.alternatives()
    .try(Joi.array().items(objectId).min(1), Joi.string().trim().min(1))
    .required(),
  restaurant: objectId.allow(null, ""),
  preparationTime: Joi.number().integer().min(1).default(20),
  isAvailable: Joi.boolean().default(true),
});

const updateFoodSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().min(3).max(1000),
  price: Joi.number().min(0),
  categories: Joi.alternatives().try(
    Joi.array().items(objectId).min(1),
    Joi.string().trim().min(1),
  ),
  restaurant: objectId.allow(null, ""),
  preparationTime: Joi.number().integer().min(1),
  isAvailable: Joi.boolean(),
}).min(1);

module.exports = { createFoodSchema, updateFoodSchema };
