const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).max(128).required(),
  phone: Joi.string().trim().allow("").max(20),
  address: Joi.string().trim().allow("").max(300),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60),
  phone: Joi.string().trim().allow("").max(20),
  address: Joi.string().trim().allow("").max(300),
}).min(1);

const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid("customer", "restaurant", "admin", "rider")
    .required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateRoleSchema,
};
