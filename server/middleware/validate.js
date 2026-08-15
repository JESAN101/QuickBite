const Joi = require("joi");

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "{#label} must be a valid ID.",
  });

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details[0].message.replace(/"/g, "");
      return res.status(400).json({
        success: false,
        message,
      });
    }

    req[source] = value;
    next();
  };
};

module.exports = { validate, objectId };
