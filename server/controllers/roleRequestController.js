const RoleRequest = require("../models/RoleRequest");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// ==========================================
// Apply For A Role (Customer)
// ==========================================
const applyForRole = asyncHandler(async (req, res) => {
  const { requestedRole } = req.body;

  // Only customers can apply
  if (req.user.role !== "customer") {
    throw new ErrorResponse(
      "You already have an active account role and cannot apply.",
      400,
    );
  }

  // One pending application per role per user
  const existing = await RoleRequest.findOne({
    user: req.user._id,
    requestedRole,
    status: "Pending",
  });

  if (existing) {
    throw new ErrorResponse(
      "You already have a pending application for this role.",
      400,
    );
  }

  let data = {
    user: req.user._id,
    requestedRole,
  };

  if (requestedRole === "rider") {
    const { vehicleType, vehicleNumber, licenseNumber, experienceYears } =
      req.body;

    data = {
      ...data,
      vehicleType,
      vehicleNumber,
      licenseNumber,
      experienceYears: Number(experienceYears) || 0,
    };
  } else {
    const {
      ownerName,
      ownerEmail,
      ownerPhone,
      restaurantName,
      restaurantDescription,
      restaurantAddress,
      restaurantPhone,
      restaurantEmail,
      cuisineType,
      openingTime,
      closingTime,
      estimatedDeliveryTime,
      licenseNumber,
    } = req.body;

    const image = req.file ? req.file.path : "";

    data = {
      ...data,
      ownerName,
      ownerEmail,
      ownerPhone,
      restaurantName,
      restaurantDescription,
      restaurantAddress,
      restaurantPhone,
      restaurantEmail,
      cuisineType,
      openingTime,
      closingTime,
      estimatedDeliveryTime: estimatedDeliveryTime || "",
      licenseNumber: licenseNumber || "",
      restaurantImage: image,
    };
  }

  const request = await RoleRequest.create(data);

  res.status(201).json({
    success: true,
    message: "Application submitted successfully. The admin will review it.",
    request,
  });
});

// ==========================================
// Get My Role Requests (Customer)
// ==========================================
const getMyRoleRequests = asyncHandler(async (req, res) => {
  const requests = await RoleRequest.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    requests,
  });
});

// ==========================================
// Get All Role Requests (Admin)
// ==========================================
const getAllRoleRequests = asyncHandler(async (req, res) => {
  const requests = await RoleRequest.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email phone");

  res.status(200).json({
    success: true,
    count: requests.length,
    requests,
  });
});

// ==========================================
// Approve / Reject A Request (Admin)
// ==========================================
const updateRoleRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;

  const request = await RoleRequest.findById(req.params.id);

  if (!request) {
    throw new ErrorResponse("Request not found.", 404);
  }

  if (request.status !== "Pending") {
    throw new ErrorResponse("This request has already been reviewed.", 400);
  }

  const user = await User.findById(request.user);

  if (!user) {
    throw new ErrorResponse("User not found.", 404);
  }

  if (status === "Approved") {
    // Change the user's role
    user.role = request.requestedRole;
    await user.save();

    // If the restaurant application is approved, register the restaurant
    if (request.requestedRole === "restaurant") {
      await Restaurant.create({
        name: request.restaurantName,
        description: request.restaurantDescription,
        address: request.restaurantAddress,
        phone: request.restaurantPhone,
        email: request.restaurantEmail,
        cuisineType: request.cuisineType,
        openingTime: request.openingTime,
        closingTime: request.closingTime,
        estimatedDeliveryTime: request.estimatedDeliveryTime,
        licenseNumber: request.licenseNumber,
        image: request.restaurantImage,
        owner: user._id,
      });
    }
  }

  request.status = status;
  request.adminNote = adminNote || "";
  request.reviewedAt = new Date();
  await request.save();

  const successMessage =
    status === "Approved"
      ? request.requestedRole === "restaurant"
        ? "Application approved and restaurant registered."
        : "Application approved. User is now a rider."
      : "Application rejected.";

  res.status(200).json({
    success: true,
    message: successMessage,
    request,
  });
});

module.exports = {
  applyForRole,
  getMyRoleRequests,
  getAllRoleRequests,
  updateRoleRequestStatus,
};
