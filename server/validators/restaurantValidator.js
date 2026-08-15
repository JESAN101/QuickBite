const Joi = require("joi");
const { objectId } = require("../middleware/validate");

const createRestaurantSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  description: Joi.string().trim().min(3).max(1000).required(),
  address: Joi.string().trim().min(3).max(300).required(),
  phone: Joi.string().trim().min(5).max(20).required(),
  owner: objectId.allow(null, ""),
});

const updateRestaurantSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  description: Joi.string().trim().min(3).max(1000),
  address: Joi.string().trim().min(3).max(300),
  phone: Joi.string().trim().min(5).max(20),
  email: Joi.string().trim().email().allow(""),
  cuisineType: Joi.string().trim().allow(""),
  openingTime: Joi.string().trim().allow(""),
  closingTime: Joi.string().trim().allow(""),
  estimatedDeliveryTime: Joi.string().trim().allow(""),
  licenseNumber: Joi.string().trim().allow(""),
  isOpen: Joi.boolean(),
  owner: objectId.allow(null, ""),
}).min(1);

module.exports = { createRestaurantSchema, updateRestaurantSchema };
