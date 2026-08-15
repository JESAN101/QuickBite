const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  image: Joi.string().trim().allow(""),
  description: Joi.string().trim().allow("").max(500),
  isActive: Joi.boolean(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  image: Joi.string().trim().allow(""),
  description: Joi.string().trim().allow("").max(500),
  isActive: Joi.boolean(),
}).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
