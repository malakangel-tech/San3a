const express = require("express");

const {
  createReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================
// CREATE REVIEW
// POST /api/reviews
// ============================================
router.post(
  "/",
  authMiddleware,
  createReview
);

// ============================================
// GET ALL REVIEWS FOR PRODUCT
// GET /api/reviews/product/:productId
// ============================================
router.get(
  "/product/:productId",
  getProductReviews
);

// ============================================
// GET REVIEW BY ID
// GET /api/reviews/:id
// ============================================
router.get(
  "/:id",
  getReviewById
);

// ============================================
// UPDATE REVIEW
// PUT /api/reviews/:id
// ============================================
router.put(
  "/:id",
  authMiddleware,
  updateReview
);

// ============================================
// DELETE REVIEW
// DELETE /api/reviews/:id
// ============================================
router.delete(
  "/:id",
  authMiddleware,
  deleteReview
);

module.exports = router;