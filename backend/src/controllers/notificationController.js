const pool = require("../config/db");

// ============================================
// GET /api/notifications
// Get current user's notifications
// ============================================
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// ============================================
// GET /api/notifications/unread
// Get unread notifications
// ============================================
const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE user_id = $1
      AND is_read = FALSE
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET UNREAD NOTIFICATIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch unread notifications",
      error: error.message,
    });
  }
};

// ============================================
// PUT /api/notifications/:id/read
// Mark one notification as read
// ============================================
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification marked as read",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("MARK NOTIFICATION READ ERROR:", error);

    res.status(500).json({
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// ============================================
// PUT /api/notifications/read-all
// Mark all user's notifications as read
// ============================================
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1
      AND is_read = FALSE
      RETURNING *
      `,
      [userId]
    );

    res.json({
      message: "All notifications marked as read",
      count: result.rows.length,
    });
  } catch (error) {
    console.error("MARK ALL NOTIFICATIONS READ ERROR:", error);

    res.status(500).json({
      message: "Failed to mark notifications as read",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
};