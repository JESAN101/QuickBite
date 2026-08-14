const multer = require("multer");
const path = require("path");
const { storage } = require("../config/cloudinary");

// Allow image files only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error("Only image files are allowed."));
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
