
const pool = require("../config/db");

// ============================================
// ADD CHAT MESSAGE
// POST /api/chat/messages
// ============================================
const addMessage = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      custom_order_id,
      role,
      message,
    } = req.body;

    // --------------------------------------------
    // Validation
    // --------------------------------------------

    if (!role || !["user", "assistant"].includes(role)) {
      return res.status(400).json({
        message: "Role must be either user or assistant",
      });
    }

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // --------------------------------------------
    // Validate custom order if provided
    // --------------------------------------------

    if (custom_order_id) {
      const orderResult = await pool.query(
        `
        SELECT id
        FROM custom_orders
        WHERE id = $1
        AND user_id = $2
        `,
        [custom_order_id, userId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          message: "Custom order not found",
        });
      }
    }

    // --------------------------------------------
    // Insert message
    // --------------------------------------------

    const result = await pool.query(
      `
      INSERT INTO chat_messages (
        user_id,
        custom_order_id,
        role,
        message
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        user_id,
        custom_order_id,
        role,
        message,
        created_at
      `,
      [
        userId,
        custom_order_id || null,
        role,
        message.trim(),
      ]
    );

    return res.status(201).json({
      message: "Chat message added successfully",
      chat_message: result.rows[0],
    });

  } catch (error) {
    console.error(
      "ADD CHAT MESSAGE ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to add chat message",
      error: error.message,
    });
  }
};


// ============================================
// GET USER CHAT HISTORY
// GET /api/chat/history
// ============================================
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        custom_order_id,
        role,
        message,
        created_at
      FROM chat_messages
      WHERE user_id = $1
      ORDER BY created_at ASC, id ASC
      `,
      [userId]
    );

    return res.json({
      message: "Chat history fetched successfully",
      count: result.rows.length,
      messages: result.rows,
    });

  } catch (error) {
    console.error(
      "GET CHAT HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch chat history",
      error: error.message,
    });
  }
};


// ============================================
// GET CUSTOM ORDER CHAT HISTORY
// GET /api/chat/history/:custom_order_id
// ============================================
const getCustomOrderChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { custom_order_id } = req.params;

    // --------------------------------------------
    // Check ownership
    // --------------------------------------------

    const orderResult = await pool.query(
      `
      SELECT id
      FROM custom_orders
      WHERE id = $1
      AND user_id = $2
      `,
      [custom_order_id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Custom order not found",
      });
    }

    // --------------------------------------------
    // Get messages
    // --------------------------------------------

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        custom_order_id,
        role,
        message,
        created_at
      FROM chat_messages
      WHERE
        user_id = $1
        AND custom_order_id = $2
      ORDER BY created_at ASC, id ASC
      `,
      [
        userId,
        custom_order_id,
      ]
    );

    return res.json({
      message: "Custom order chat history fetched successfully",
      custom_order_id: Number(custom_order_id),
      count: result.rows.length,
      messages: result.rows,
    });

  } catch (error) {
    console.error(
      "GET CUSTOM ORDER CHAT HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch custom order chat history",
      error: error.message,
    });
  }
};


// ============================================
// DELETE CUSTOM ORDER CHAT HISTORY
// DELETE /api/chat/history/:custom_order_id
// ============================================
const deleteCustomOrderChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { custom_order_id } = req.params;

    // --------------------------------------------
    // Check ownership
    // --------------------------------------------

    const orderResult = await pool.query(
      `
      SELECT id
      FROM custom_orders
      WHERE id = $1
      AND user_id = $2
      `,
      [
        custom_order_id,
        userId,
      ]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Custom order not found",
      });
    }

    // --------------------------------------------
    // Delete messages
    // --------------------------------------------

    const result = await pool.query(
      `
      DELETE FROM chat_messages
      WHERE
        user_id = $1
        AND custom_order_id = $2
      `,
      [
        userId,
        custom_order_id,
      ]
    );

    return res.json({
      message: "Chat history deleted successfully",
      custom_order_id: Number(custom_order_id),
      deleted_count: result.rowCount,
    });

  } catch (error) {
    console.error(
      "DELETE CHAT HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete chat history",
      error: error.message,
    });
  }
};


module.exports = {
  addMessage,
  getChatHistory,
  getCustomOrderChatHistory,
  deleteCustomOrderChatHistory,
};
