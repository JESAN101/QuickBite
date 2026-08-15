const Joi = require("joi");
const { objectId } = require("../middleware/validate");

const addFavoriteSchema = Joi.object({
  food: objectId.required(),
});

module.exports = { addFavoriteSchema };
