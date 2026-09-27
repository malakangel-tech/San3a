
const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// POST /api/upload/image
router.post("/image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(201).json({
      message: "Image uploaded successfully",
      imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  }
});

module.exports = router;
