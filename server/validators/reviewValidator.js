const Joi = require("joi");
const { objectId } = require("../middleware/validate");

const addReviewSchema = Joi.object({
  food: objectId.required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().allow("").max(500),
});

module.exports = { addReviewSchema };
