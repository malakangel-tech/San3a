const pool = require("../config/db");

// ============================================
// POST /api/custom-orders
// Create Custom Order
// ============================================
const createCustomOrder = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      furniture_type,
      wood_type,
      size,
      details,
      estimated_price,
      vendor_id,
      design_url,
    } = req.body;

    // Validation
    if (!furniture_type) {
      return res.status(400).json({
        message: "Furniture type is required",
      });
    }

    if (!wood_type) {
      return res.status(400).json({
        message: "Wood type is required",
      });
    }

    if (!size) {
      return res.status(400).json({
        message: "Size is required",
      });
    }

    if (estimated_price === undefined || estimated_price === null) {
      return res.status(400).json({
        message: "Estimated price is required",
      });
    }

    if (Number(estimated_price) < 0) {
      return res.status(400).json({
        message: "Estimated price cannot be negative",
      });
    }

    // Check vendor if vendor_id was provided
    if (vendor_id) {
      const vendorResult = await pool.query(
        "SELECT id FROM vendors WHERE id = $1",
        [vendor_id]
      );

      if (vendorResult.rows.length === 0) {
        return res.status(404).json({
          message: "Vendor not found",
        });
      }
    }

    // Create custom order
    const result = await pool.query(
      `
      INSERT INTO custom_orders (
        user_id,
        vendor_id,
        furniture_type,
        wood_type,
        size,
        details,
        estimated_price,
        design_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        user_id,
        vendor_id || null,
        furniture_type,
        wood_type,
        size,
        details || null,
        estimated_price,
        design_url || null,
      ]
    );

    res.status(201).json({
      message: "Custom order created successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE CUSTOM ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to create custom order",
      error: error.message,
    });
  }
};

// ============================================
// GET /api/custom-orders
// Get current user's custom orders
// ============================================
const getMyCustomOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `
      SELECT
        co.*,
        v.name AS vendor_name
      FROM custom_orders co
      LEFT JOIN vendors v
        ON co.vendor_id = v.id
      WHERE co.user_id = $1
      ORDER BY co.created_at DESC
      `,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET MY CUSTOM ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch custom orders",
      error: error.message,
    });
  }
};

// ============================================
// GET /api/custom-orders/:id
// Get one custom order
// ============================================
const getCustomOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `
      SELECT
        co.*,
        v.name AS vendor_name
      FROM custom_orders co
      LEFT JOIN vendors v
        ON co.vendor_id = v.id
      WHERE co.id = $1
      AND co.user_id = $2
      `,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Custom order not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET CUSTOM ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch custom order",
      error: error.message,
    });
  }
};

// ============================================
// PUT /api/custom-orders/:id
// Update Custom Order
// ============================================
const updateCustomOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const {
      furniture_type,
      wood_type,
      size,
      details,
      estimated_price,
      design_url,
    } = req.body;

    // Check order belongs to current user
    const existingOrder = await pool.query(
      `
      SELECT *
      FROM custom_orders
      WHERE id = $1
      AND user_id = $2
      `,
      [id, user_id]
    );

    if (existingOrder.rows.length === 0) {
      return res.status(404).json({
        message: "Custom order not found",
      });
    }

    // Don't allow editing completed/cancelled orders
    const currentOrder = existingOrder.rows[0];

    if (
      currentOrder.status === "completed" ||
      currentOrder.status === "cancelled"
    ) {
      return res.status(400).json({
        message: "This order cannot be updated",
      });
    }

    if (
      estimated_price !== undefined &&
      Number(estimated_price) < 0
    ) {
      return res.status(400).json({
        message: "Estimated price cannot be negative",
      });
    }

    const result = await pool.query(
      `
      UPDATE custom_orders
      SET
        furniture_type = COALESCE($1, furniture_type),
        wood_type = COALESCE($2, wood_type),
        size = COALESCE($3, size),
        details = COALESCE($4, details),
        estimated_price = COALESCE($5, estimated_price),
        design_url = COALESCE($6, design_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      AND user_id = $8
      RETURNING *
      `,
      [
        furniture_type,
        wood_type,
        size,
        details,
        estimated_price,
        design_url,
        id,
        user_id,
      ]
    );

    res.json({
      message: "Custom order updated successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE CUSTOM ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to update custom order",
      error: error.message,
    });
  }
};

// ============================================
// DELETE /api/custom-orders/:id
// Delete Custom Order
// ============================================
const deleteCustomOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `
      DELETE FROM custom_orders
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Custom order not found",
      });
    }

    res.json({
      message: "Custom order deleted successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE CUSTOM ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to delete custom order",
      error: error.message,
    });
  }
};
// ============================================
// PUT /api/custom-orders/:id/status
// Update Custom Order Status
// ============================================
const updateCustomOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { status } = req.body;

    // Allowed statuses
    const allowedStatuses = [
      "pending",
      "in_progress",
      "completed",
      "cancelled",
    ];

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

    // Check that the order belongs to the current user
    const existingOrder = await pool.query(
      `
      SELECT *
      FROM custom_orders
      WHERE id = $1
      AND user_id = $2
      `,
      [id, user_id]
    );

    if (existingOrder.rows.length === 0) {
      return res.status(404).json({
        message: "Custom order not found",
      });
    }

    // Update status
    const result = await pool.query(
      `
      UPDATE custom_orders
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      AND user_id = $3
      RETURNING *
      `,
      [status, id, user_id]
    );

    res.json({
      message: "Custom order status updated successfully",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE CUSTOM ORDER STATUS ERROR:", error);

    res.status(500).json({
      message: "Failed to update custom order status",
      error: error.message,
    });
  }
};

module.exports = {
  createCustomOrder,
  getMyCustomOrders,
  getCustomOrderById,
  updateCustomOrder,
  deleteCustomOrder,
  updateCustomOrderStatus,
};