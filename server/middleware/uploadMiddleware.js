const multer = require("multer");
const path = require("path");
const { storage } = require("../config/cloudinary");

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;

  const isValid =
    allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    ) &&
    allowedTypes.test(file.mimetype);

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
