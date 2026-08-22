const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, escapeRegex } = require("../utils/pagination");

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

// ============================
// Register User
// ============================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    user: sanitizeUser(user),
  });
});

// ============================
// Login User
// ============================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid Email or Password.",
    });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.status(200).json({
    success: true,
    message: "Login Successful.",
    token,
    user: sanitizeUser(user),
  });
});

// ============================
// Get Profile
// ============================
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  });
});

// ============================
// Update Profile
// ============================
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      phone,
      address,
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: sanitizeUser(user),
  });
});

// ============================
// Get All Users (Admin, Paginated)
// Supports ?page=1&limit=10&search=word
// ============================
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const search = (req.query.search || "").trim();

  const filter = search
    ? {
        $or: [
          { name: new RegExp(escapeRegex(search), "i") },
          { email: new RegExp(escapeRegex(search), "i") },
        ],
      }
    : {};

  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    users,
  });
});

// ============================
// Delete User (Admin)
// ============================
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  if (req.user._id.toString() === user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "You cannot delete your own account.",
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
});

// ============================
// Update User Role (Admin)
// ============================
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  if (req.user._id.toString() === user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: "You cannot change your own role.",
    });
  }

  user.role = role;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully.",
    user: sanitizeUser(user),
  });
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  updateUserRole,
};
