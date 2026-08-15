const Joi = require("joi");

const createCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(20).required(),
  type: Joi.string().valid("percentage", "flat").required(),
  value: Joi.number().min(0).required(),
  minOrderAmount: Joi.number().min(0).default(0),
  maxDiscount: Joi.number().min(0).default(0),
  usageLimit: Joi.number().integer().min(0).default(0),
  isActive: Joi.boolean().default(true),
  expiresAt: Joi.date().iso().allow(null),
});

const updateCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).max(20),
  type: Joi.string().valid("percentage", "flat"),
  value: Joi.number().min(0),
  minOrderAmount: Joi.number().min(0),
  maxDiscount: Joi.number().min(0),
  usageLimit: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
  expiresAt: Joi.date().iso().allow(null),
}).min(1);

const validateCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(1).required(),
  subtotal: Joi.number().min(0).default(0),
});

module.exports = {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
};
