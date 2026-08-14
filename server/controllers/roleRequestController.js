const RoleRequest = require("../models/RoleRequest");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

// ==========================================
// Apply For A Role (Customer)
// ==========================================
const applyForRole = async (req, res) => {
  try {
    const { requestedRole } = req.body;

    if (!["rider", "restaurant"].includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    // Only customers can apply
    if (req.user.role !== "customer") {
      return res.status(400).json({
        success: false,
        message:
          "You already have an active account role and cannot apply.",
      });
    }

    // One pending application per role per user
    const existing = await RoleRequest.findOne({
      user: req.user._id,
      requestedRole,
      status: "Pending",
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a pending application for this role.",
      });
    }

    let data = {
      user: req.user._id,
      requestedRole,
    };

    if (requestedRole === "rider") {
      const {
        vehicleType,
        vehicleNumber,
        licenseNumber,
        experienceYears,
      } = req.body;

      if (!vehicleType || !vehicleNumber || !licenseNumber) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required fields.",
        });
      }

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

      if (
        !restaurantName ||
        !restaurantDescription ||
        !restaurantAddress ||
        !restaurantPhone ||
        !restaurantEmail ||
        !cuisineType ||
        !openingTime ||
        !closingTime ||
        !ownerName ||
        !ownerEmail ||
        !ownerPhone
      ) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required fields.",
        });
      }

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
      message:
        "Application submitted successfully. The admin will review it.",
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get My Role Requests (Customer)
// ==========================================
const getMyRoleRequests = async (req, res) => {
  try {
    const requests = await RoleRequest.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get All Role Requests (Admin)
// ==========================================
const getAllRoleRequests = async (req, res) => {
  try {
    const requests = await RoleRequest.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email phone");

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Approve / Reject A Request (Admin)
// ==========================================
const updateRoleRequestStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const request = await RoleRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been reviewed.",
      });
    }

    const user = await User.findById(request.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  applyForRole,
  getMyRoleRequests,
  getAllRoleRequests,
  updateRoleRequestStatus,
};
