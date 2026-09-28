
const express = require("express");

const {
  updateVerificationStatus,
} = require("../controllers/verificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================
// Admin Role Middleware
// ============================================
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

// ============================================
// PUT /api/admin/verification/:id
// Approve / Reject verification
// ============================================
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  updateVerificationStatus
);

module.exports = router;
