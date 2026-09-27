const pool = require("../config/db");

// ============================================
// POST /api/reviews
// Create a review
// ============================================
const createReview = async (req, res) => {
  try {
    const { product_id, rating, comment, image } = req.body;

    // User ID comes from JWT
    const user_id = req.user.id;

    // Validate product ID
    if (!product_id) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    // Validate rating
    if (rating === undefined) {
      return res.status(400).json({
        message: "Rating is required",
      });
    }

    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be a number between 1 and 5",
      });
    }

    // Check if product exists
    const productResult = await pool.query(
      "SELECT id FROM products WHERE id = $1",
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await pool.query(
      `
      SELECT id
      FROM reviews
      WHERE user_id = $1
      AND product_id = $2
      `,
      [user_id, product_id]
    );

    if (existingReview.rows.length > 0) {
      return res.status(409).json({
        message: "You have already reviewed this product",
      });
    }

    // Create review
    const result = await pool.query(
      `
      INSERT INTO reviews (
        user_id,
        product_id,
        rating,
        comment,
        image
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        user_id,
        product_id,
        rating,
        comment || null,
        image || null,
      ]
    );

    res.status(201).json({
      message: "Review created successfully",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// ============================================
// GET /api/reviews/product/:productId
// Get all reviews for a product
// ============================================
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      `
      SELECT
        reviews.id,
        reviews.rating,
        reviews.comment,
        reviews.image,
        reviews.created_at,
        users.id AS user_id,
        users.name AS user_name
      FROM reviews
      INNER JOIN users
        ON reviews.user_id = users.id
      WHERE reviews.product_id = $1
      ORDER BY reviews.created_at DESC
      `,
      [productId]
    );

    res.json({
      product_id: Number(productId),
      reviews: result.rows,
    });
  } catch (error) {
    console.error("GET PRODUCT REVIEWS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch product reviews",
      error: error.message,
    });
  }
};

// ============================================
// GET /api/reviews/:id
// Get review by ID
// ============================================
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        reviews.id,
        reviews.user_id,
        reviews.product_id,
        reviews.rating,
        reviews.comment,
        reviews.image,
        reviews.created_at,
        users.name AS user_name
      FROM reviews
      INNER JOIN users
        ON reviews.user_id = users.id
      WHERE reviews.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET REVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch review",
      error: error.message,
    });
  }
};

// ============================================
// PUT /api/reviews/:id
// Update review
// ============================================
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, image } = req.body;

    const user_id = req.user.id;

    // Check rating
    if (
      rating !== undefined &&
      (
        typeof rating !== "number" ||
        rating < 1 ||
        rating > 5
      )
    ) {
      return res.status(400).json({
        message: "Rating must be a number between 1 and 5",
      });
    }

    // Check review belongs to current user
    const reviewResult = await pool.query(
      `
      SELECT *
      FROM reviews
      WHERE id = $1
      `,
      [id]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const review = reviewResult.rows[0];

    if (review.user_id !== user_id) {
      return res.status(403).json({
        message: "You can only update your own review",
      });
    }

    const result = await pool.query(
      `
      UPDATE reviews
      SET
        rating = COALESCE($1, rating),
        comment = COALESCE($2, comment),
        image = COALESCE($3, image)
      WHERE id = $4
      RETURNING *
      `,
      [
        rating,
        comment,
        image,
        id,
      ]
    );

    res.json({
      message: "Review updated successfully",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// ============================================
// DELETE /api/reviews/:id
// Delete review
// ============================================
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const user_id = req.user.id;

    // Check review exists
    const reviewResult = await pool.query(
      `
      SELECT *
      FROM reviews
      WHERE id = $1
      `,
      [id]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const review = reviewResult.rows[0];

    // Only owner can delete review
    if (review.user_id !== user_id) {
      return res.status(403).json({
        message: "You can only delete your own review",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM reviews
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    res.json({
      message: "Review deleted successfully",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// ============================================
// EXPORTS
// ============================================
module.exports = {
  createReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
};