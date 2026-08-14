// Rider Middleware
// Ensures the logged-in user has the "rider" role
const riderMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== "rider") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Riders only.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = riderMiddleware;
