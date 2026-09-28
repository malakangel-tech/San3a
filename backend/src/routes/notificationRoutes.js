const express = require("express");

const {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/notifications
router.get("/", authMiddleware, getNotifications);

// GET /api/notifications/unread
router.get("/unread", authMiddleware, getUnreadNotifications);

// PUT /api/notifications/:id/read
router.put("/:id/read", authMiddleware, markAsRead);

// PUT /api/notifications/read-all
router.put("/read-all", authMiddleware, markAllAsRead);

module.exports = router;