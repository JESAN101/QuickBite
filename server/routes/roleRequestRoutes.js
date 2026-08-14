const express = require("express");

const {
  applyForRole,
  getMyRoleRequests,
  getAllRoleRequests,
  updateRoleRequestStatus,
} = require("../controllers/roleRequestController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Apply for a rider / restaurant role (customer)
router.post(
  "/apply",
  authMiddleware,
  upload.single("image"),
  applyForRole
);

// My applications (customer)
router.get("/my", authMiddleware, getMyRoleRequests);

// All applications (admin)
router.get("/all", authMiddleware, adminMiddleware, getAllRoleRequests);

// Approve / reject an application (admin)
router.put("/:id", authMiddleware, adminMiddleware, updateRoleRequestStatus);

module.exports = router;
