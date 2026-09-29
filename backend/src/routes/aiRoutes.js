
const express = require("express");
const multer = require("multer");
const {
  analyzeFurniture,
  customDesign,
  analyzeFurnitureImage,
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================
// MULTER CONFIGURATION
// ============================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    // Maximum image size = 10 MB
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only JPEG, PNG and WEBP images are allowed"
        )
      );
    }

    cb(null, true);
  },
});

// ============================================
// MULTER ERROR HANDLER
// ============================================

const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    // ----------------------------------------
    // No error
    // ----------------------------------------

    if (!err) {
      return next();
    }

    console.error(
      "MULTER ERROR:",
      err
    );

    // ----------------------------------------
    // File too large
    // ----------------------------------------

    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_FILE_SIZE"
    ) {
      return res.status(413).json({
        message: "Image size must not exceed 10 MB",
        error: "file_too_large",
      });
    }

    // ----------------------------------------
    // Too many files
    // ----------------------------------------

    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_UNEXPECTED_FILE"
    ) {
      return res.status(400).json({
        message: "Only one image is allowed",
        error: "unexpected_file",
      });
    }

    // ----------------------------------------
    // Other Multer errors
    // ----------------------------------------

    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: err.message,
        error: "multer_error",
      });
    }

    // ----------------------------------------
    // Invalid file type
    // ----------------------------------------

    if (
      err instanceof Error &&
      err.message ===
        "Only JPEG, PNG and WEBP images are allowed"
    ) {
      return res.status(400).json({
        message:
          "Invalid image type. Allowed types: JPEG, PNG, WEBP",
        error: "invalid_file_type",
      });
    }

    // ----------------------------------------
    // Unknown upload error
    // ----------------------------------------

    return res.status(400).json({
      message: "Failed to upload image",
      error: err.message || "upload_error",
    });
  });
};

// ============================================
// ANALYZE FURNITURE
// POST /api/ai/analyze-furniture
// ============================================

router.post(
  "/analyze-furniture",
  authMiddleware,
  analyzeFurniture
);

// ============================================
// ANALYZE FURNITURE IMAGE
// POST /api/ai/analyze-image
// ============================================

router.post(
  "/analyze-image",
  authMiddleware,
  uploadImage,
  analyzeFurnitureImage
);

// ============================================
// CUSTOM DESIGN
// POST /api/ai/custom-design
// ============================================

router.post(
  "/custom-design",
  authMiddleware,
  customDesign
);

// ============================================
// EXPORT
// ============================================

module.exports = router;
