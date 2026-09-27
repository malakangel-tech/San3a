
const pool = require("../config/db");

// ============================================
// POST /api/verification/submit
// Submit Verification Request
// ============================================
const submitVerification = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      official_id_number,
      workshop_name,
      documents_image,
    } = req.body;

    // Validation
    if (!official_id_number) {
      return res.status(400).json({
        message: "Official ID number is required",
      });
    }

    if (!workshop_name) {
      return res.status(400).json({
        message: "Workshop name is required",
      });
    }

    // Check if user already has a pending/approved request
    const existingRequest = await pool.query(
      `
      SELECT *
      FROM verification_requests
      WHERE user_id = $1
      AND status IN ('pending', 'approved')
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [user_id]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({
        message: "You already have a pending or approved verification request",
        request: existingRequest.rows[0],
      });
    }

    // Create verification request
    const result = await pool.query(
      `
      INSERT INTO verification_requests (
        user_id,
        official_id_number,
        workshop_name,
        documents_image,
        payment_status,
        payment_amount,
        status
      )
      VALUES ($1, $2, $3, $4, 'pending', 50.00, 'pending')
      RETURNING *
      `,
      [
        user_id,
        official_id_number,
        workshop_name,
        documents_image || null,
      ]
    );

    res.status(201).json({
      message: "Verification request submitted successfully",
      request: result.rows[0],
    });
  } catch (error) {
    console.error("SUBMIT VERIFICATION ERROR:", error);

    res.status(500).json({
      message: "Failed to submit verification request",
      error: error.message,
    });
  }
};

// ============================================
// GET /api/verification/my-request
// Get current user's verification request
// ============================================
const getMyVerificationRequest = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM verification_requests
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No verification request found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET VERIFICATION ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch verification request",
      error: error.message,
    });
  }
};
// ============================================
// PUT /api/admin/verification/:id
// Admin Approve / Reject Verification
// ============================================
const updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_note } = req.body;

    const allowedStatuses = ["approved", "rejected"];

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        allowedStatuses,
      });
    }

    // Get verification request
    const verificationResult = await pool.query(
      `
      SELECT *
      FROM verification_requests
      WHERE id = $1
      `,
      [id]
    );

    if (verificationResult.rows.length === 0) {
      return res.status(404).json({
        message: "Verification request not found",
      });
    }

    const verificationRequest = verificationResult.rows[0];

    // Update verification request
    const result = await pool.query(
      `
      UPDATE verification_requests
      SET
        status = $1,
        admin_note = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
      `,
      [
        status,
        admin_note || null,
        id,
      ]
    );

    // If approved, verify the user
    if (status === "approved") {
      await pool.query(
        `
        UPDATE users
        SET is_verified = TRUE
        WHERE id = $1
        `,
        [verificationRequest.user_id]
      );
    }

    // If rejected, make sure user is not verified
    if (status === "rejected") {
      await pool.query(
        `
        UPDATE users
        SET is_verified = FALSE
        WHERE id = $1
        `,
        [verificationRequest.user_id]
      );
    }

    res.json({
      message:
        status === "approved"
          ? "Verification approved successfully"
          : "Verification rejected successfully",
      verification: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE VERIFICATION STATUS ERROR:", error);

    res.status(500).json({
      message: "Failed to update verification status",
      error: error.message,
    });
  }
};

module.exports = {
  submitVerification,
  getMyVerificationRequest,
  updateVerificationStatus,
};
