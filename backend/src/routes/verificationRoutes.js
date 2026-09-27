
const express = require("express");

const {
  submitVerification,
  getMyVerificationRequest,
} = require("../controllers/verificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/verification/submit
router.post(
  "/submit",
  authMiddleware,
  submitVerification
);

// GET /api/verification/my-request
router.get(
  "/my-request",
  authMiddleware,
  getMyVerificationRequest
);

module.exports = router;
