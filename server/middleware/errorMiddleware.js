const multer = require("multer");

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  let message = err.message || "Internal server error.";
  let statusCode = err.statusCode || err.status || 500;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format.";
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `${field} already exists.`
      : "Resource already exists.";
  }

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = err.message;
  }

  if (statusCode === 500) {
    console.error(err);
    message =
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
