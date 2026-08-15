const Joi = require("joi");

const applyForRoleSchema = Joi.object({
  requestedRole: Joi.string().valid("rider", "restaurant").required(),
  vehicleType: Joi.when("requestedRole", {
    is: "rider",
    then: Joi.string().trim().min(1).max(50).required(),
    otherwise: Joi.forbidden(),
  }),
  vehicleNumber: Joi.when("requestedRole", {
    is: "rider",
    then: Joi.string().trim().min(1).max(50).required(),
    otherwise: Joi.forbidden(),
  }),
  licenseNumber: Joi.when("requestedRole", {
    is: "rider",
    then: Joi.string().trim().min(1).max(100).required(),
    otherwise: Joi.string().trim().allow("").max(100),
  }),
  experienceYears: Joi.when("requestedRole", {
    is: "rider",
    then: Joi.alternatives()
      .try(Joi.number().integer().min(0), Joi.string().allow(""))
      .default(0),
    otherwise: Joi.forbidden(),
  }),
  ownerName: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().min(1).max(80).required(),
    otherwise: Joi.forbidden(),
  }),
  ownerEmail: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().email().required(),
    otherwise: Joi.forbidden(),
  }),
  ownerPhone: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().min(5).max(20).required(),
    otherwise: Joi.forbidden(),
  }),
  restaurantName: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().min(1).max(80).required(),
    otherwise: Joi.forbidden(),
  }),
  restaurantDescription: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().min(3).max(1000).required(),
    otherwise: Joi.forbidden(),
  }),
  restaurantAddress: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().min(3).max(300).required(),
    otherwise: Joi.forbidden(),
  }),
  restaurantPhone: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().min(5).max(20).required(),
    otherwise: Joi.forbidden(),
  }),
  restaurantEmail: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().email().required(),
    otherwise: Joi.forbidden(),
  }),
  cuisineType: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().min(1).max(100).required(),
    otherwise: Joi.forbidden(),
  }),
  openingTime: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().min(1).max(20).required(),
    otherwise: Joi.forbidden(),
  }),
  closingTime: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().min(1).max(20).required(),
    otherwise: Joi.forbidden(),
  }),
  estimatedDeliveryTime: Joi.when("requestedRole", {
    is: "restaurant",
    then: Joi.string().trim().allow("").max(50),
    otherwise: Joi.forbidden(),
  }),
}).options({ allowUnknown: true });

const updateRoleRequestStatusSchema = Joi.object({
  status: Joi.string().valid("Approved", "Rejected").required(),
  adminNote: Joi.string().trim().allow("").max(500),
});

module.exports = { applyForRoleSchema, updateRoleRequestStatusSchema };
